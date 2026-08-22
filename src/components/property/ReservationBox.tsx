"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Users, CreditCard } from "lucide-react";
import { formatPrice, calculateNights } from "@/lib/utils";
import toast from "react-hot-toast";

interface ReservationBoxProps {
  propertyId: string;
  pricePerNight: number;
  maxGuests: number;
  blockedDates: Date[];
}

export default function ReservationBox({
  propertyId,
  pricePerNight,
  maxGuests,
  blockedDates,
}: ReservationBoxProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const nights =
    checkIn && checkOut
      ? calculateNights(new Date(checkIn), new Date(checkOut))
      : 0;
  const subtotal = nights * pricePerNight;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;
  const deposit = Math.round(total * 0.3);

  const isDateBlocked = (dateStr: string) => {
    const date = new Date(dateStr);
    return blockedDates.some(
      (d) => d.toISOString().split("T")[0] === date.toISOString().split("T")[0]
    );
  };

  const handleReserve = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Selecciona las fechas");
      return;
    }

    if (nights < 1) {
      toast.error("La estancia mínima es 1 noche");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reservaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          checkIn,
          checkOut,
          guests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      router.push(`/reservacion/${data.id}/pago`);
    } catch {
      toast.error("Error al crear la reservación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-28 bg-white border border-neutral-200 rounded-2xl p-6 shadow-lg">
      {/* Price */}
      <div className="mb-6">
        <span className="text-2xl font-semibold text-neutral-900">
          {formatPrice(pricePerNight)}
        </span>
        <span className="text-neutral-500"> /noche</span>
      </div>

      {/* Date inputs */}
      <div className="border border-neutral-300 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-neutral-300">
            <label className="block text-[10px] font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Llegada
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full text-sm text-neutral-700 bg-transparent outline-none"
            />
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Salida
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="w-full text-sm text-neutral-700 bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="p-3 border-t border-neutral-300">
          <label className="block text-[10px] font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Huéspedes
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full text-sm text-neutral-700 bg-transparent outline-none"
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "huésped" : "huéspedes"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reserve button */}
      <button
        onClick={handleReserve}
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Reservar"}
      </button>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>
              {formatPrice(pricePerNight)} x {nights} noches
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Comisión del servicio</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-neutral-900 pt-2 border-t border-neutral-200">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-primary-600 text-xs pt-1">
            <span>Anticipo (30%)</span>
            <span>{formatPrice(deposit)}</span>
          </div>
          <p className="text-xs text-neutral-400 pt-1">
            Paga el 30% para confirmar. El resto al llegar.
          </p>
        </div>
      )}

      {/* Payment info */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <CreditCard className="w-4 h-4" />
          <span>SPEI sin comisión · Tarjeta · OXXO</span>
        </div>
      </div>
    </div>
  );
}
