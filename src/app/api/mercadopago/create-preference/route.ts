import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { reservationId } = await request.json();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      property: {
        include: {
          owner: {
            select: {
              id: true,
              mpAccessToken: true,
              mpConnected: true,
            },
          },
        },
      },
    },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservación no encontrada" }, { status: 404 });
  }

  if (reservation.guestId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  if (reservation.status !== "PENDIENTE") {
    return NextResponse.json({ error: "Ya fue procesada" }, { status: 400 });
  }

  const owner = reservation.property.owner;
  if (!owner.mpConnected || !owner.mpAccessToken) {
    return NextResponse.json(
      { error: "El anfitrión no tiene Mercado Pago conectado. Contacta al anfitrión." },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const prefRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${owner.mpAccessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: `Reservación: ${reservation.property.title}`,
            description: `${reservation.nights} noches · ${reservation.guests} huéspedes`,
            quantity: 1,
            unit_price: reservation.totalPrice,
            currency_id: "MXN",
          },
        ],
        back_urls: {
          success: `${baseUrl}/reservacion/${reservation.id}?pago=exitoso`,
          failure: `${baseUrl}/reservacion/${reservation.id}?pago=fallido`,
          pending: `${baseUrl}/reservacion/${reservation.id}?pago=pendiente`,
        },
        auto_return: "approved",
        external_reference: reservation.id,
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        statement_descriptor: "GUETZA",
      }),
    });

    if (!prefRes.ok) {
      const err = await prefRes.text();
      console.error("MP preference error:", err);

      if (prefRes.status === 401) {
        const refreshed = await refreshToken(owner.id);
        if (!refreshed) {
          return NextResponse.json(
            { error: "Token de Mercado Pago expirado. El anfitrión debe reconectar su cuenta." },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: "Token renovado, intenta de nuevo" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Error al crear el pago" },
        { status: 500 }
      );
    }

    const preference = await prefRes.json();

    await prisma.payment.create({
      data: {
        amount: reservation.totalPrice,
        method: "TARJETA",
        status: "PENDIENTE",
        reference: preference.id,
        mercadoPagoId: preference.id,
        reservationId: reservation.id,
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
      preference_id: preference.id,
    });
  } catch (error) {
    console.error("MP create preference error:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}

async function refreshToken(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mpRefreshToken: true },
  });

  if (!user?.mpRefreshToken) return false;

  try {
    const res = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.MP_APP_ID,
        client_secret: process.env.MP_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: user.mpRefreshToken,
      }),
    });

    if (!res.ok) return false;

    const tokens = await res.json();
    await prisma.user.update({
      where: { id: userId },
      data: {
        mpAccessToken: tokens.access_token,
        mpRefreshToken: tokens.refresh_token,
      },
    });

    return true;
  } catch {
    return false;
  }
}
