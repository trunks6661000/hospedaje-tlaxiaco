import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ANFITRION") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const appId = process.env.MP_APP_ID;
  const redirectUri = process.env.MP_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json(
      { error: "Mercado Pago no está configurado" },
      { status: 500 }
    );
  }

  const authUrl = new URL("https://auth.mercadopago.com.mx/authorization");
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("platform_id", "mp");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", session.user.id);

  return NextResponse.redirect(authUrl.toString());
}
