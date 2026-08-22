import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ChatPage from "@/components/chat/ChatPage";

export const metadata = { title: "Mensajes — Hospedaje Tlaxiaco" };

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <ChatPage userId={session.user.id} userName={session.user.name || "Usuario"} />;
}
