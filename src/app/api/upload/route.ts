import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUploadUrl, getPublicUrl } from "@/lib/s3";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { contentType, folder = "properties" } = await request.json();

  if (!contentType || !contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Solo se permiten imágenes" },
      { status: 400 }
    );
  }

  const { url, key } = await getUploadUrl(folder, contentType);
  const publicUrl = getPublicUrl(key);

  return NextResponse.json({ uploadUrl: url, key, publicUrl });
}
