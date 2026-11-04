import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ANFITRION") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      mpAccessToken: null,
      mpRefreshToken: null,
      mpUserId: null,
      mpConnected: false,
    },
  });

  return NextResponse.json({ ok: true });
}
