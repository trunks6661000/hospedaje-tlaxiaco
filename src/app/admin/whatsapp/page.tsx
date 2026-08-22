import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WhatsAppBotManager from "@/components/admin/WhatsAppBotManager";

export const metadata = { title: "Bot de WhatsApp — Admin" };

export default async function AdminWhatsAppPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const faqs = await prisma.whatsAppBot.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return <WhatsAppBotManager initialFaqs={faqs} />;
}
