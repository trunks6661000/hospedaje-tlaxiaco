import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GuestDashboard from "@/components/dashboard/GuestDashboard";

export const metadata = { title: "Mi panel" };

export default async function GuestDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "ANFITRION") redirect("/dashboard/anfitrion");

  const [reservations, favorites] = await Promise.all([
    prisma.reservation.findMany({
      where: { guestId: session.user.id },
      include: {
        property: {
          include: {
            images: { take: 1, orderBy: { order: "asc" } },
            owner: { select: { name: true } },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        property: {
          include: {
            images: { take: 1, orderBy: { order: "asc" } },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <GuestDashboard
      userName={session.user.name || "Huésped"}
      reservations={reservations}
      favorites={favorites}
    />
  );
}
