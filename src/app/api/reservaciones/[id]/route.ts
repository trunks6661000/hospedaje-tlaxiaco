import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: {
      property: {
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
          owner: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
      guest: { select: { name: true, email: true, phone: true } },
      payments: true,
    },
  });

  if (!reservation) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  if (
    reservation.guestId !== session.user.id &&
    reservation.property.owner.id !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  return NextResponse.json(reservation);
}
