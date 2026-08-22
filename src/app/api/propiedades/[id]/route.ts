import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const property = await prisma.property.findFirst({
    where: {
      OR: [{ id: params.id }, { slug: params.id }],
      status: "PUBLICADA",
    },
    include: {
      images: { orderBy: { order: "asc" } },
      amenities: { include: { amenity: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      owner: { select: { id: true, name: true, image: true, createdAt: true } },
      blockedDates: { select: { date: true } },
    },
  });

  if (!property) {
    return NextResponse.json(
      { error: "Propiedad no encontrada" },
      { status: 404 }
    );
  }

  const rating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
        property.reviews.length
      : null;

  return NextResponse.json({ ...property, rating, reviewCount: property.reviews.length });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  if (property.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await request.json();

  const updated = await prisma.property.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  if (property.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  await prisma.property.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Propiedad eliminada" });
}
