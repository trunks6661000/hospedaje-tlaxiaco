"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Building2,
  CalendarDays,
  DollarSign,
  Star,
  Eye,
  Edit,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { formatPrice, formatDate, formatShortDate, getAirbnbBlockUrl } from "@/lib/utils";

interface HostDashboardProps {
  properties: any[];
  reservations: any[];
  totalRevenue: number;
}

export default function HostDashboard({
  properties,
  reservations,
  totalRevenue,
}: HostDashboardProps) {
  const [activeTab, setActiveTab] = useState<"propiedades" | "reservaciones">(
    "reservaciones"
  );

  const activeReservations = reservations.filter(
    (r) => r.status === "CONFIRMADA" || r.status === "EN_CURSO"
  );
  const pendingReservations = reservations.filter(
    (r) => r.status === "PENDIENTE"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Panel de anfitrión
          </h1>
          <p className="text-neutral-500 mt-1">Gestiona tus propiedades y reservaciones</p>
        </div>
        <Link
          href="/dashboard/anfitrion/nueva-propiedad"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva propiedad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-neutral-500">Propiedades</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {properties.length}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-neutral-500">Activas</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {activeReservations.length}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-neutral-500">Pendientes</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {pendingReservations.length}
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
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab("reservaciones")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "reservaciones"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Reservaciones ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab("propiedades")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "propiedades"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Mis propiedades ({properties.length})
        </button>
      </div>

      {/* Reservations tab */}
      {activeTab === "reservaciones" && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="font-medium text-neutral-700">Sin reservaciones</p>
              <p className="text-sm mt-1">
                Las reservaciones de tus propiedades aparecerán aquí.
              </p>
            </div>
          ) : (
            reservations.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-neutral-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={res.status} />
                      <span className="text-xs text-neutral-400 font-mono">
                        #{res.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-neutral-900">
                      {res.property.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {formatShortDate(res.checkIn)} —{" "}
                        {formatShortDate(res.checkOut)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {res.guests} huéspedes
                      </span>
                      <span className="font-medium text-neutral-900">
                        {formatPrice(res.totalPrice)}
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <span className="text-neutral-500">Huésped: </span>
                      <span className="text-neutral-700 font-medium">
                        {res.guest.name}
                      </span>
                      {res.guest.phone && (
                        <span className="text-neutral-400 ml-2">
                          {res.guest.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Airbnb block link */}
                  {!res.airbnbBlocked && (
                    <a
                      href={getAirbnbBlockUrl(
                        new Date(res.checkIn),
                        new Date(res.checkOut),
                        res.property.title
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Bloquear Airbnb
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Properties tab */}
      {activeTab === "propiedades" && (
        <div className="space-y-4">
          {properties.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="font-medium text-neutral-700">Sin propiedades</p>
              <p className="text-sm mt-1">
                Registra tu primera propiedad para empezar a recibir
                reservaciones.
              </p>
              <Link
                href="/dashboard/anfitrion/nueva-propiedad"
                className="btn-primary inline-flex items-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" />
                Agregar propiedad
              </Link>
            </div>
          ) : (
            properties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white border border-neutral-200 rounded-xl p-5 flex items-center gap-5"
              >
                {/* Image */}
                <div className="w-24 h-20 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                  {prop.imageUrl ? (
                    <Image
                      src={prop.imageUrl}
                      alt={prop.title}
                      width={96}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-neutral-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PropertyStatusBadge status={prop.status} />
                  </div>
                  <h3 className="font-medium text-neutral-900 truncate">
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                    <span>{formatPrice(prop.pricePerNight)}/noche</span>
                    <span>{prop.reservationCount} reservaciones</span>
                    {prop.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
                        {prop.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/propiedad/${prop.slug}`}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Ver"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/dashboard/anfitrion/editar/${prop.id}`}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    PENDIENTE: {
      label: "Pendiente",
      classes: "bg-amber-100 text-amber-800",
    },
    CONFIRMADA: {
      label: "Confirmada",
      classes: "bg-green-100 text-green-800",
    },
    EN_CURSO: {
      label: "En curso",
      classes: "bg-blue-100 text-blue-800",
    },
    COMPLETADA: {
      label: "Completada",
      classes: "bg-neutral-100 text-neutral-700",
    },
    CANCELADA: {
      label: "Cancelada",
      classes: "bg-red-100 text-red-700",
    },
  };

  const c = config[status] || config.PENDIENTE;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.classes}`}>
      {c.label}
    </span>
  );
}

function PropertyStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    BORRADOR: { label: "Borrador", classes: "bg-neutral-100 text-neutral-600" },
    PENDIENTE_APROBACION: {
      label: "En revisión",
      classes: "bg-amber-100 text-amber-700",
    },
    PUBLICADA: {
      label: "Publicada",
      classes: "bg-green-100 text-green-700",
    },
    PAUSADA: { label: "Pausada", classes: "bg-neutral-100 text-neutral-600" },
    RECHAZADA: { label: "Rechazada", classes: "bg-red-100 text-red-700" },
  };

  const c = config[status] || config.BORRADOR;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.classes}`}>
      {c.label}
    </span>
  );
}
