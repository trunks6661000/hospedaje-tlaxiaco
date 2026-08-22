"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Menu,
  User,
  Home,
  MessageCircle,
  LogOut,
  LayoutDashboard,
  Heart,
  CalendarDays,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!session) return "/login";
    switch (session.user.role) {
      case "ADMIN":
        return "/admin";
      case "ANFITRION":
        return "/dashboard/anfitrion";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-neutral-900 hidden sm:block">
              Hospedaje Tlaxiaco
            </span>
          </Link>

          {/* Search bar - desktop */}
          <Link
            href="/propiedades"
            className="hidden md:flex items-center border border-neutral-300 rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="px-5 py-2.5 text-sm font-medium text-neutral-800 border-r border-neutral-300">
              Tlaxiaco
            </span>
            <span className="px-5 py-2.5 text-sm text-neutral-400 border-r border-neutral-300">
              Fechas
            </span>
            <span className="px-5 py-2.5 text-sm text-neutral-400">
              Huéspedes
            </span>
            <div className="m-2 p-2 bg-primary-500 rounded-full text-white">
              <Search className="w-4 h-4" />
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/anfitrion"
              className="hidden md:block text-sm font-medium text-neutral-700 hover:bg-neutral-100 px-4 py-2 rounded-full transition-colors"
            >
              Sé anfitrión
            </Link>
            <a
              href="https://wa.me/5219510000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 px-4 py-2 rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              Ayuda
            </a>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 border border-neutral-300 rounded-full p-1.5 pl-3 hover:shadow-md transition-shadow"
              >
                <Menu className="w-4 h-4 text-neutral-600" />
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                    {session ? (
                      <>
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href={getDashboardLink()}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Mi panel
                        </Link>
                        <Link
                          href="/dashboard/reservaciones"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          <CalendarDays className="w-4 h-4" />
                          Mis reservaciones
                        </Link>
                        <Link
                          href="/dashboard/favoritos"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          Favoritos
                        </Link>
                        <div className="border-t border-neutral-200 my-1" />
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          Iniciar sesión
                        </Link>
                        <Link
                          href="/registro"
                          className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          Registrarse
                        </Link>
                        <div className="border-t border-neutral-200 my-1" />
                        <Link
                          href="/anfitrion"
                          className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          Sé anfitrión
                        </Link>
                        <Link
                          href="/ayuda"
                          className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          Centro de ayuda
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <Link
            href="/propiedades"
            className="w-full flex items-center gap-3 border border-neutral-300 rounded-full px-4 py-2.5 shadow-sm"
          >
            <Search className="w-5 h-5 text-neutral-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-800">
                Buscar en Tlaxiaco
              </p>
              <p className="text-xs text-neutral-500">Fechas · Huéspedes</p>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
