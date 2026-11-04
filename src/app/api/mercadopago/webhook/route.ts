import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    const paymentInfo = await fetchPaymentFromMP(paymentId);
    if (!paymentInfo) {
      return NextResponse.json({ ok: true });
    }

    const reservationId = paymentInfo.external_reference;
    if (!reservationId) {
      return NextResponse.json({ ok: true });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        property: {
          include: {
            owner: { select: { mpAccessToken: true } },
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json({ ok: true });
    }

    const mpStatus = paymentInfo.status;

    if (mpStatus === "approved") {
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: {
            reservationId,
            mercadoPagoId: { not: null },
          },
          data: {
            status: "PAGADO",
            mercadoPagoId: String(paymentId),
            paidAt: new Date(),
          },
        }),
        prisma.reservation.update({
          where: { id: reservationId },
          data: { status: "CONFIRMADA" },
        }),
      ]);
    } else if (mpStatus === "rejected" || mpStatus === "cancelled") {
      await prisma.payment.updateMany({
        where: {
          reservationId,
          mercadoPagoId: { not: null },
        },
        data: { status: "PENDIENTE" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("MP webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}

async function fetchPaymentFromMP(paymentId: string) {
  try {
    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_CLIENT_SECRET}`,
        },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
