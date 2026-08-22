"use client";

import Link from "next/link";
import {
  Users,
  Building2,
  CalendarDays,
  DollarSign,
  ArrowRight,
  AlertCircle,
  BarChart3,
  Settings,
  MessageSquare,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalProperties: number;
  pendingProperties: number;
  totalReservations: number;
  activeReservations: number;
  totalRevenue: number;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Panel de administración
          </h1>
          <p className="text-neutral-500 mt-1">
            Vista general de Hospedaje Tlaxiaco
          </p>
        </div>
        <Link href="/admin/configuracion" className="btn-ghost flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Configuración
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-neutral-500">Usuarios</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-neutral-500">Propiedades</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {stats.totalProperties}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-neutral-500">Reservaciones</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {stats.totalReservations}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {stats.activeReservations} activas
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm text-neutral-500">Ingresos</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {formatPrice(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Pending alert */}
      {stats.pendingProperties > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>{stats.pendingProperties}</strong> propiedades pendientes
              de aprobación
            </p>
          </div>
          <Link
            href="/admin/propiedades?status=PENDIENTE_APROBACION"
            className="text-sm font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            Revisar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/propiedades"
          className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <Building2 className="w-6 h-6 text-neutral-600 mb-3" />
          <h3 className="font-medium text-neutral-900 group-hover:text-primary-600">
            Gestionar propiedades
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Aprobar, editar y administrar las propiedades
          </p>
        </Link>

        <Link
          href="/admin/usuarios"
          className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <Users className="w-6 h-6 text-neutral-600 mb-3" />
          <h3 className="font-medium text-neutral-900 group-hover:text-primary-600">
            Gestionar usuarios
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Anfitriones, huéspedes y administradores
          </p>
        </Link>

        <Link
          href="/admin/reservaciones"
          className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <CalendarDays className="w-6 h-6 text-neutral-600 mb-3" />
          <h3 className="font-medium text-neutral-900 group-hover:text-primary-600">
            Reservaciones
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Ver y gestionar todas las reservaciones
          </p>
        </Link>

        <Link
          href="/admin/pagos"
          className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <DollarSign className="w-6 h-6 text-neutral-600 mb-3" />
          <h3 className="font-medium text-neutral-900 group-hover:text-primary-600">
            Pagos y comisiones
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Reportes de ingresos y comisiones
          </p>
        </Link>

        <Link
          href="/admin/whatsapp"
          className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <MessageSquare className="w-6 h-6 text-neutral-600 mb-3" />
          <h3 className="font-medium text-neutral-900 group-hover:text-primary-600">
            Bot de WhatsApp
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Configurar preguntas y respuestas automáticas
          </p>
        </Link>

        <Link
          href="/admin/reportes"
          className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <BarChart3 className="w-6 h-6 text-neutral-600 mb-3" />
          <h3 className="font-medium text-neutral-900 group-hover:text-primary-600">
            Reportes y métricas
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Estadísticas de ocupación e ingresos
          </p>
        </Link>
      </div>
    </div>
  );
}
