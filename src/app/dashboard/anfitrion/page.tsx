import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HostDashboard from "@/components/dashboard/HostDashboard";

export const metadata = { title: "Panel de anfitrión" };

export default async function HostDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "ANFITRION" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [properties, reservations, revenueData] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: session.user.id },
      include: {
        images: { take: 1, orderBy: { order: "asc" } },
        reviews: { select: { rating: true } },
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.reservation.findMany({
      where: {
        property: { ownerId: session.user.id },
        status: { in: ["PENDIENTE", "CONFIRMADA", "EN_CURSO"] },
      },
      include: {
        property: { select: { title: true, slug: true } },
        guest: { select: { name: true, email: true, phone: true } },
        payments: true,
      },
      orderBy: { checkIn: "asc" },
      take: 20,
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAGADO",
        reservation: { property: { ownerId: session.user.id } },
      },
    }),
  ]);

  const formattedProperties = properties.map((p) => ({
    ...p,
    rating:
      p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : null,
    reviewCount: p.reviews.length,
    imageUrl: p.images[0]?.url || null,
    reservationCount: p._count.reservations,
  }));

  return (
    <HostDashboard
      properties={formattedProperties}
      reservations={reservations}
      totalRevenue={revenueData._sum.amount || 0}
    />
  );
}
