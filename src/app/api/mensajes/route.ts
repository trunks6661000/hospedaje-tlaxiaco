import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = messageSchema.parse(body);

    if (data.receiverId === session.user.id) {
      return NextResponse.json(
        { error: "No puedes enviarte mensajes a ti mismo" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content: data.content,
        senderId: session.user.id,
        receiverId: data.receiverId,
      },
      include: {
        sender: { select: { name: true, image: true } },
        receiver: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Error al enviar mensaje" },
      { status: 500 }
    );
  }
}

// Get conversations list
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const contactId = req.nextUrl.searchParams.get("contactId");

  if (contactId) {
    // Get messages with specific contact
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      },
      include: {
        sender: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    // Mark as read
    await prisma.message.updateMany({
      where: {
        senderId: contactId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json(messages);
  }

  // Get conversations list (unique contacts with last message)
  const sent = await prisma.message.findMany({
    where: { senderId: userId },
    select: { receiverId: true },
    distinct: ["receiverId"],
  });

  const received = await prisma.message.findMany({
    where: { receiverId: userId },
    select: { senderId: true },
    distinct: ["senderId"],
  });

  const contactIds = Array.from(
    new Set([
      ...sent.map((m) => m.receiverId),
      ...received.map((m) => m.senderId),
    ])
  );

  const conversations = await Promise.all(
    contactIds.map(async (cId) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: cId },
            { senderId: cId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      const unread = await prisma.message.count({
        where: {
          senderId: cId,
          receiverId: userId,
          read: false,
        },
      });

      const contact = await prisma.user.findUnique({
        where: { id: cId },
        select: { id: true, name: true, image: true },
      });

      return {
        contact,
        lastMessage,
        unreadCount: unread,
      };
    })
  );

  conversations.sort((a, b) => {
    const aTime = a.lastMessage?.createdAt?.getTime() || 0;
    const bTime = b.lastMessage?.createdAt?.getTime() || 0;
    return bTime - aTime;
  });

  return NextResponse.json(conversations);
}
