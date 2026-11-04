"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  Store,
  Copy,
  Check,
  Clock,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { formatPrice, formatShortDate } from "@/lib/utils";
import toast from "react-hot-toast";

type PaymentMethod = "SPEI" | "TARJETA" | "OXXO";

interface ReservationData {
  id: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  depositAmount: number;
  property: {
    title: string;
    city: string;
    images: { url: string }[];
  };
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("SPEI");
  const [payFull, setPayFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch(`/api/reservaciones/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setReservation(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Reservación no encontrada");
        router.push("/");
      });
  }, [params.id, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (method === "TARJETA" || method === "OXXO") {
        const mpRes = await fetch("/api/mercadopago/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservationId: params.id }),
        });

        const mpData = await mpRes.json();

        if (!mpRes.ok) {
          toast.error(mpData.error);
          setProcessing(false);
          return;
        }

        window.location.href = mpData.init_point;
        return;
      }

      const res = await fetch(`/api/reservaciones/${params.id}/pagar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          isDeposit: !payFull,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Reservación confirmada. Realiza la transferencia SPEI.");
      router.push(`/reservacion/${params.id}/confirmacion`);
    } catch {
      toast.error("Error al procesar el pago");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !reservation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-64 mx-auto" />
          <div className="h-4 bg-neutral-200 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  const amount = payFull
    ? reservation.totalPrice
    : reservation.depositAmount || Math.round(reservation.totalPrice * 0.3);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar
      </button>

      <h1 className="text-2xl font-semibold text-neutral-900 mb-8">
        Confirma y paga
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left - Payment */}
        <div className="lg:col-span-3 space-y-6">
          {/* Amount selector */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-3">
              Monto a pagar
            </h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-4 border border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/30">
                <input
                  type="radio"
                  name="payType"
                  checked={!payFull}
                  onChange={() => setPayFull(false)}
                  className="accent-primary-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    Anticipo del 30% — {formatPrice(reservation.depositAmount || Math.round(reservation.totalPrice * 0.3))}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Paga el resto ({formatPrice(reservation.totalPrice - (reservation.depositAmount || Math.round(reservation.totalPrice * 0.3)))}) al llegar
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/30">
                <input
                  type="radio"
                  name="payType"
                  checked={payFull}
                  onChange={() => setPayFull(true)}
                  className="accent-primary-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    Pago completo — {formatPrice(reservation.totalPrice)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Paga todo ahora y olvídate
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-3">
              Método de pago
            </h2>
            <div className="space-y-2">
              {/* SPEI */}
              <button
                onClick={() => setMethod("SPEI")}
                className={`w-full flex items-center gap-4 p-4 border rounded-xl text-left transition-colors ${
                  method === "SPEI"
                    ? "border-primary-500 bg-primary-50/30"
                    : "border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    SPEI / Transferencia bancaria
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    Sin comisión — recomendado
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === "SPEI"
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300"
                  }`}
                >
                  {method === "SPEI" && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>

              {/* Tarjeta */}
              <button
                onClick={() => setMethod("TARJETA")}
                className={`w-full flex items-center gap-4 p-4 border rounded-xl text-left transition-colors ${
                  method === "TARJETA"
                    ? "border-primary-500 bg-primary-50/30"
                    : "border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    Tarjeta de crédito / débito
                  </p>
                  <p className="text-sm text-neutral-500">
                    Visa, Mastercard, Amex — vía Mercado Pago
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === "TARJETA"
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300"
                  }`}
                >
                  {method === "TARJETA" && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>

              {/* OXXO */}
              <button
                onClick={() => setMethod("OXXO")}
                className={`w-full flex items-center gap-4 p-4 border rounded-xl text-left transition-colors ${
                  method === "OXXO"
                    ? "border-primary-500 bg-primary-50/30"
                    : "border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">OXXO</p>
                  <p className="text-sm text-neutral-500">
                    Paga en efectivo — vía Mercado Pago
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === "OXXO"
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300"
                  }`}
                >
                  {method === "OXXO" && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* SPEI details */}
          {method === "SPEI" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
              <h3 className="font-medium text-blue-900">
                Datos para transferencia SPEI
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">CLABE</span>
                  <button
                    onClick={() => copyToClipboard("012345678901234567")}
                    className="flex items-center gap-1.5 text-sm font-mono text-blue-900"
                  >
                    0123 4567 8901 2345 67
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Beneficiario</span>
                  <span className="text-sm font-medium text-blue-900">
                    Hospedaje Tlaxiaco
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Banco</span>
                  <span className="text-sm font-medium text-blue-900">
                    STP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Monto</span>
                  <span className="text-sm font-semibold text-blue-900">
                    {formatPrice(amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Referencia</span>
                  <span className="text-sm font-mono text-blue-900">
                    {reservation.id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 mt-2 pt-2 border-t border-blue-200">
                <Clock className="w-4 h-4" />
                Tienes 24 horas para completar la transferencia
              </div>
            </div>
          )}

          {/* Pay button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-primary w-full text-lg disabled:opacity-50"
          >
            {processing
              ? "Procesando..."
              : method === "SPEI"
              ? `Confirmar reservación por ${formatPrice(amount)}`
              : `Pagar ${formatPrice(amount)}`}
          </button>

          <div className="flex items-center gap-2 text-xs text-neutral-500 justify-center">
            <Shield className="w-4 h-4" />
            Tus datos están protegidos y encriptados
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-2">
          <div className="border border-neutral-200 rounded-2xl p-5 sticky top-28">
            <h3 className="font-medium text-neutral-900 mb-4">
              Tu reservación
            </h3>
            <div className="space-y-3 text-sm">
              <p className="font-medium text-neutral-900">
                {reservation.property.title}
              </p>
              <p className="text-neutral-500">{reservation.property.city}</p>
              <div className="flex justify-between py-2 border-t border-neutral-100">
                <span className="text-neutral-600">Llegada</span>
                <span className="font-medium">
                  {formatShortDate(reservation.checkIn)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Salida</span>
                <span className="font-medium">
                  {formatShortDate(reservation.checkOut)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Huéspedes</span>
                <span className="font-medium">{reservation.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Noches</span>
                <span className="font-medium">{reservation.nights}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(reservation.totalPrice)}</span>
              </div>
              {!payFull && (
                <div className="flex justify-between text-primary-600 font-medium">
                  <span>A pagar ahora</span>
                  <span>{formatPrice(amount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
