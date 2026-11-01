"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Users } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 1) params.set("guests", guests.toString());
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/60 p-2 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Check-in */}
        <div className="flex-1 px-4 py-3 md:border-r border-neutral-200">
          <label
            htmlFor="checkin"
            className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1"
          >
            Llegada
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-400" />
            <input
              id="checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="text-sm text-neutral-700 bg-transparent outline-none w-full"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 px-4 py-3 md:border-r border-neutral-200">
          <label
            htmlFor="checkout"
            className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1"
          >
            Salida
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-400" />
            <input
              id="checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-sm text-neutral-700 bg-transparent outline-none w-full"
              min={checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 px-4 py-3">
          <label
            htmlFor="guests"
            className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1"
          >
            Huéspedes
          </label>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-400" />
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="text-sm text-neutral-700 bg-transparent outline-none w-full"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "huésped" : "huéspedes"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center p-1.5">
          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Buscar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
