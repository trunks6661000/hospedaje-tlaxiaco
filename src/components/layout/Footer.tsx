import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <span className="text-2xl font-serif tracking-wide text-white">
              GUETZA
            </span>
            <p className="text-sm text-neutral-500 mt-3 leading-relaxed">
              Hospedaje curado en Santiago Tlaxiaco, Oaxaca. Cada espacio es
              seleccionado por su calidez, ubicación y autenticidad.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4 tracking-wide uppercase">
              Explorar
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/propiedades"
                  className="hover:text-white transition-colors"
                >
                  Hospedajes
                </Link>
              </li>
              <li>
                <Link
                  href="/tlaxiaco"
                  className="hover:text-white transition-colors"
                >
                  Sobre Tlaxiaco
                </Link>
              </li>
              <li>
                <Link
                  href="/experiencias"
                  className="hover:text-white transition-colors"
                >
                  Experiencias
                </Link>
              </li>
              <li>
                <Link
                  href="/mapa"
                  className="hover:text-white transition-colors"
                >
                  Mapa
                </Link>
              </li>
            </ul>
          </div>

          {/* Anfitriones */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4 tracking-wide uppercase">
              Anfitriones
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/anfitrion"
                  className="hover:text-white transition-colors"
                >
                  Publica tu espacio
                </Link>
              </li>
              <li>
                <Link
                  href="/anfitrion/recursos"
                  className="hover:text-white transition-colors"
                >
                  Recursos
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda"
                  className="hover:text-white transition-colors"
                >
                  Centro de ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4 tracking-wide uppercase">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                Santiago Tlaxiaco, Oaxaca
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                +52 951 000 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                hola@guetza.mx
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-600">
            &copy; 2026 Guetza. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-neutral-600">
            <Link
              href="/terminos"
              className="hover:text-neutral-400 transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="hover:text-neutral-400 transition-colors"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
