"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  MessageCircle,
  Home,
  Copy,
  Check,
} from "lucide-react";
import { formatPrice, formatDate, getAirbnbBlockUrl } from "@/lib/utils";

export default function ConfirmationPage() {
  const params = useParams();
  const [reservation, setReservation] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/reservaciones/${params.id}`)
      .then((r) => r.json())
      .then(setReservation);
  }, [params.id]);

  if (!reservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 bg-neutral-200 rounded-full mx-auto" />
          <div className="h-6 bg-neutral-200 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  const airbnbUrl = getAirbnbBlockUrl(
    new Date(reservation.checkIn),
    new Date(reservation.checkOut),
    reservation.property.title
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Reservación confirmada
        </h1>
        <p className="text-neutral-500">
          Te enviamos los detalles por WhatsApp y correo electrónico.
        </p>
      </div>

      {/* Details card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span>Reservación</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(reservation.id);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1 font-mono text-neutral-700"
          >
            #{reservation.id.slice(-8).toUpperCase()}
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <h2 className="text-lg font-medium text-neutral-900">
          {reservation.property.title}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500">Llegada</p>
              <p className="font-medium text-neutral-900">
                {formatDate(reservation.checkIn)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500">Salida</p>
              <p className="font-medium text-neutral-900">
                {formatDate(reservation.checkOut)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500">Huéspedes</p>
              <p className="font-medium text-neutral-900">
                {reservation.guests}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500">Ubicación</p>
              <p className="font-medium text-neutral-900">
                {reservation.property.city}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
          <span className="text-neutral-600">Total</span>
          <span className="text-xl font-semibold text-neutral-900">
            {formatPrice(reservation.totalPrice)}
          </span>
        </div>
      </div>

      {/* Airbnb block reminder — visible to admin/host */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-900 mb-1">
              Bloquear fechas en Airbnb
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              No olvides bloquear las fechas{" "}
              <strong>
                {formatDate(reservation.checkIn)} —{" "}
                {formatDate(reservation.checkOut)}
              </strong>{" "}
              en Airbnb para evitar reservaciones duplicadas.
            </p>
            <a
              href={airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-800 bg-amber-100 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Bloquear en Airbnb
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/reservaciones"
          className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Mis reservaciones
        </Link>
        <a
          href={`https://wa.me/5219510000000?text=${encodeURIComponent(
            `Hola, acabo de confirmar la reservación #${reservation.id.slice(-8).toUpperCase()} para ${reservation.property.title}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 text-center flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-green-600" />
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
