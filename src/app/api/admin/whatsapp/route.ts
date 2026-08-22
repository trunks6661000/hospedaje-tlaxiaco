import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
  category: z.string().min(1),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const faqs = await prisma.whatsAppBot.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = faqSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const faq = await prisma.whatsAppBot.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      category: parsed.data.category,
      order: parsed.data.order ?? 0,
      active: parsed.data.active ?? true,
    },
  });

  return NextResponse.json(faq, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const faq = await prisma.whatsAppBot.update({
    where: { id },
    data,
  });

  return NextResponse.json(faq);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  await prisma.whatsAppBot.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
