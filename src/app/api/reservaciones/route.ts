import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { calculateNights } from "@/lib/utils";
import { z } from "zod";

const reservationSchema = z.object({
  propertyId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = reservationSchema.parse(body);

    const property = await prisma.property.findUnique({
      where: { id: data.propertyId, status: "PUBLICADA" },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    if (data.guests > property.maxGuests) {
      return NextResponse.json(
        { error: `Máximo ${property.maxGuests} huéspedes` },
        { status: 400 }
      );
    }

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: "La fecha de salida debe ser posterior a la de llegada" },
        { status: 400 }
      );
    }

    const conflicting = await prisma.reservation.findFirst({
      where: {
        propertyId: data.propertyId,
        status: { in: ["PENDIENTE", "CONFIRMADA", "EN_CURSO"] },
        OR: [
          { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (conflicting) {
      return NextResponse.json(
        { error: "Las fechas seleccionadas no están disponibles" },
        { status: 409 }
      );
    }

    const blocked = await prisma.blockedDate.findFirst({
      where: {
        propertyId: data.propertyId,
        date: { gte: checkInDate, lt: checkOutDate },
      },
    });

    if (blocked) {
      return NextResponse.json(
        { error: "Algunas fechas están bloqueadas por el anfitrión" },
        { status: 409 }
      );
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const subtotal = nights * property.pricePerNight;
    const serviceFee = Math.round(subtotal * property.commissionRate);
    const totalPrice = subtotal + serviceFee;
    const depositAmount = Math.round(totalPrice * 0.3);

    const reservation = await prisma.reservation.create({
      data: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: data.guests,
        nights,
        totalPrice,
        depositAmount,
        status: "PENDIENTE",
        guestId: session.user.id,
        propertyId: data.propertyId,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Error al crear la reservación" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const reservations = await prisma.reservation.findMany({
    where: { guestId: session.user.id },
    include: {
      property: {
        include: { images: { take: 1, orderBy: { order: "asc" } } },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reservations);
}
