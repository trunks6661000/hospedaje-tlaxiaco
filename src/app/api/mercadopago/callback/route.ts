import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard/anfitrion?mp_error=missing_params", request.url)
    );
  }

  try {
    const tokenRes = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.MP_APP_ID,
        client_secret: process.env.MP_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.MP_REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("MP OAuth error:", err);
      return NextResponse.redirect(
        new URL("/dashboard/anfitrion?mp_error=oauth_failed", request.url)
      );
    }

    const tokens = await tokenRes.json();

    await prisma.user.update({
      where: { id: state },
      data: {
        mpAccessToken: tokens.access_token,
        mpRefreshToken: tokens.refresh_token,
        mpUserId: String(tokens.user_id),
        mpConnected: true,
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard/anfitrion?mp_success=true", request.url)
    );
  } catch (error) {
    console.error("MP callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/anfitrion?mp_error=server_error", request.url)
    );
  }
}
