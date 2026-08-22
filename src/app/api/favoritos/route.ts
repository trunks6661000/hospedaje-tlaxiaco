import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Toggle favorite
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { propertyId } = await req.json();

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId requerido" }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: session.user.id,
        propertyId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: {
      userId: session.user.id,
      propertyId,
    },
  });

  return NextResponse.json({ favorited: true });
}

// Check if favorited
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ favorited: false });
  }

  const propertyId = req.nextUrl.searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId requerido" }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: session.user.id,
        propertyId,
      },
    },
  });

  return NextResponse.json({ favorited: !!existing });
}
