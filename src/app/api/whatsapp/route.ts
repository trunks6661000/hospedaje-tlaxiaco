import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTextMessage } from "@/lib/whatsapp";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Webhook verification (GET) — Meta sends this to verify the endpoint
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Incoming messages (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.[0]) {
      return NextResponse.json({ status: "no_message" });
    }

    const message = value.messages[0];
    const from = message.from;
    const text = message.text?.body?.trim().toLowerCase();

    if (!text) {
      return NextResponse.json({ status: "no_text" });
    }

    const response = await findBotResponse(text);
    await sendTextMessage(from, response);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error procesando webhook WhatsApp:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

async function findBotResponse(input: string): Promise<string> {
  const faqs = await prisma.whatsAppBot.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  // Buscar coincidencia por palabras clave
  for (const faq of faqs) {
    const keywords = faq.question.toLowerCase().split(/\s+/);
    const matchCount = keywords.filter((kw) => input.includes(kw)).length;
    if (matchCount >= Math.ceil(keywords.length * 0.5)) {
      return faq.answer;
    }
  }

  // Si hay FAQs configuradas, mostrar menú
  if (faqs.length > 0) {
    const categories = Array.from(new Set(faqs.map((f) => f.category)));
    const menu = categories
      .map((cat) => {
        const items = faqs.filter((f) => f.category === cat);
        return `*${cat}*\n${items.map((item, i) => `  ${i + 1}. ${item.question}`).join("\n")}`;
      })
      .join("\n\n");

    return (
      `👋 ¡Hola! Soy el asistente de *Hospedaje Tlaxiaco*.\n\n` +
      `Estas son las preguntas frecuentes:\n\n${menu}\n\n` +
      `Escribe tu pregunta y te ayudo. También puedes visitar nuestra página web.`
    );
  }

  return (
    `👋 ¡Hola! Bienvenido a *Hospedaje Tlaxiaco*.\n\n` +
    `Encuentra el mejor hospedaje en Santiago Tlaxiaco, Oaxaca.\n` +
    `Para más información, visita nuestra página web o escríbenos tu pregunta.`
  );
}
