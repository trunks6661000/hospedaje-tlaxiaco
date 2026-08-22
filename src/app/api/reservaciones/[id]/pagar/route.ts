import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getAirbnbBlockUrl } from "@/lib/utils";
import { notifyPaymentReceived } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { method, isDeposit } = await request.json();

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: {
      property: {
        include: {
          owner: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
  });

  if (!reservation) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  if (reservation.guestId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  if (reservation.status !== "PENDIENTE") {
    return NextResponse.json(
      { error: "Esta reservación ya fue procesada" },
      { status: 400 }
    );
  }

  const amount = isDeposit
    ? reservation.depositAmount || Math.round(reservation.totalPrice * 0.3)
    : reservation.totalPrice;

  const payment = await prisma.payment.create({
    data: {
      amount,
      method,
      status: method === "SPEI" ? "PENDIENTE" : "PENDIENTE",
      isDeposit,
      reservationId: reservation.id,
      speiClabe: method === "SPEI" ? process.env.SPEI_CLABE_RECEPTORA : null,
    },
  });

  await prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      status: method === "SPEI" ? "PENDIENTE" : "PENDIENTE",
    },
  });

  notifyPaymentReceived(reservation.id, amount).catch(console.error);

  const airbnbBlockUrl = getAirbnbBlockUrl(
    reservation.checkIn,
    reservation.checkOut,
    reservation.property.title
  );

  return NextResponse.json({
    payment,
    airbnbBlockUrl,
    message:
      method === "SPEI"
        ? "Reservación creada. Realiza la transferencia SPEI en las próximas 24 horas."
        : "Procesando pago...",
  });
}
