import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = { title: "Panel de administración" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [
    totalUsers,
    totalProperties,
    pendingProperties,
    totalReservations,
    activeReservations,
    revenueData,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.property.count({ where: { status: "PENDIENTE_APROBACION" } }),
    prisma.reservation.count(),
    prisma.reservation.count({
      where: { status: { in: ["CONFIRMADA", "EN_CURSO"] } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAGADO" },
    }),
  ]);

  return (
    <AdminDashboard
      stats={{
        totalUsers,
        totalProperties,
        pendingProperties,
        totalReservations,
        activeReservations,
        totalRevenue: revenueData._sum.amount || 0,
      }}
    />
  );
}
