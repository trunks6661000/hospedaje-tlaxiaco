import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  reservationId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);

    const reservation = await prisma.reservation.findUnique({
      where: { id: data.reservationId },
      include: { review: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservación no encontrada" }, { status: 404 });
    }

    if (reservation.guestId !== session.user.id) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    if (reservation.status !== "COMPLETADA") {
      return NextResponse.json(
        { error: "Solo puedes reseñar reservaciones completadas" },
        { status: 400 }
      );
    }

    if (reservation.review) {
      return NextResponse.json(
        { error: "Ya dejaste una reseña para esta reservación" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment || null,
        userId: session.user.id,
        propertyId: reservation.propertyId,
        reservationId: data.reservationId,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Error al crear la reseña" },
      { status: 500 }
    );
  }
}

// Get reviews for a property
export async function GET(req: NextRequest) {
  const propertyId = req.nextUrl.searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId requerido" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { propertyId },
    include: {
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    reviews,
    average: Math.round(avg * 10) / 10,
    total: reviews.length,
  });
}
