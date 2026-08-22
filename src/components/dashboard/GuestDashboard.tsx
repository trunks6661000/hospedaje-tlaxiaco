"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Heart,
  MapPin,
  Star,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
import { formatPrice, formatShortDate, calculateNights } from "@/lib/utils";

interface GuestDashboardProps {
  userName: string;
  reservations: any[];
  favorites: any[];
}

export default function GuestDashboard({
  userName,
  reservations,
  favorites,
}: GuestDashboardProps) {
  const [activeTab, setActiveTab] = useState<"reservaciones" | "favoritos">(
    "reservaciones"
  );

  const upcoming = reservations.filter(
    (r) =>
      r.status === "CONFIRMADA" ||
      r.status === "PENDIENTE" ||
      r.status === "EN_CURSO"
  );
  const past = reservations.filter(
    (r) => r.status === "COMPLETADA" || r.status === "CANCELADA"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Hola, {userName.split(" ")[0]}
        </h1>
        <p className="text-neutral-500 mt-1">
          Administra tus reservaciones y favoritos
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-neutral-500">Reservaciones</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {reservations.length}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-neutral-500">Activas</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {upcoming.length}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm text-neutral-500">Favoritos</span>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {favorites.length}
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
          Mis reservaciones ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab("favoritos")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "favoritos"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Favoritos ({favorites.length})
        </button>
      </div>

      {/* Reservations tab */}
      {activeTab === "reservaciones" && (
        <div className="space-y-6">
          {reservations.length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="font-medium text-neutral-700">
                Sin reservaciones
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Explora propiedades y haz tu primera reservación.
              </p>
              <Link
                href="/propiedades"
                className="btn-primary inline-flex items-center gap-2 mt-4"
              >
                Explorar propiedades
              </Link>
            </div>
          ) : (
            <>
              {/* Upcoming */}
              {upcoming.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
                    Próximas / Activas
                  </h2>
                  <div className="space-y-3">
                    {upcoming.map((res) => (
                      <ReservationCard key={res.id} reservation={res} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {past.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
                    Historial
                  </h2>
                  <div className="space-y-3">
                    {past.map((res) => (
                      <ReservationCard key={res.id} reservation={res} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Favorites tab */}
      {activeTab === "favoritos" && (
        <div>
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="font-medium text-neutral-700">Sin favoritos</p>
              <p className="text-sm text-neutral-500 mt-1">
                Guarda propiedades que te gusten para verlas después.
              </p>
              <Link
                href="/propiedades"
                className="btn-primary inline-flex items-center gap-2 mt-4"
              >
                Explorar propiedades
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <FavoriteCard key={fav.id} favorite={fav} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReservationCard({ reservation }: { reservation: any }) {
  const res = reservation;
  const property = res.property;
  const image = property.images?.[0]?.url;
  const nights = calculateNights(new Date(res.checkIn), new Date(res.checkOut));
  const paid = res.payments?.reduce(
    (sum: number, p: any) => (p.status === "PAGADO" ? sum + p.amount : sum),
    0
  ) || 0;

  return (
    <Link
      href={`/reservacion/${res.id}`}
      className="bg-white border border-neutral-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow group"
    >
      {/* Image */}
      <div className="w-28 h-24 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            width={112}
            height={96}
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
          <StatusBadge status={res.status} />
          <span className="text-xs text-neutral-400 font-mono">
            #{res.id.slice(-6).toUpperCase()}
          </span>
        </div>
        <h3 className="font-medium text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatShortDate(res.checkIn)} — {formatShortDate(res.checkOut)}
          </span>
          <span>{nights} {nights === 1 ? "noche" : "noches"}</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {res.guests}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-sm">
          <span className="font-medium text-neutral-900">
            {formatPrice(res.totalPrice)}
          </span>
          {paid > 0 && paid < res.totalPrice && (
            <span className="text-xs text-green-600">
              {formatPrice(paid)} pagado
            </span>
          )}
          {res.property.owner?.name && (
            <span className="text-neutral-400 text-xs">
              Anfitrión: {res.property.owner.name}
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-neutral-300 self-center flex-shrink-0 group-hover:text-neutral-500 transition-colors" />
    </Link>
  );
}

function FavoriteCard({ favorite }: { favorite: any }) {
  const property = favorite.property;
  const image = property.images?.[0]?.url;
  const avgRating =
    property.reviews?.length > 0
      ? property.reviews.reduce((s: number, r: any) => s + r.rating, 0) /
        property.reviews.length
      : null;

  return (
    <Link
      href={`/propiedad/${property.slug}`}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-neutral-200 relative">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-neutral-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-sm text-neutral-500 mt-0.5 truncate">
          {property.location || "Santiago Tlaxiaco, Oaxaca"}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-neutral-900">
            {formatPrice(property.pricePerNight)}
            <span className="text-neutral-500 font-normal">/noche</span>
          </span>
          {avgRating && (
            <span className="flex items-center gap-1 text-sm text-neutral-700">
              <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
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
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.classes}`}
    >
      {c.label}
    </span>
  );
}
