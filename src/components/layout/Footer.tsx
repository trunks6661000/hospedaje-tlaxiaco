import Link from "next/link";
import { Home, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">
                Hospedaje Tlaxiaco
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Encuentra el mejor hospedaje en Santiago Tlaxiaco, Oaxaca.
              Casas, cabañas y habitaciones en el corazón de la Mixteca.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Explorar</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/propiedades"
                  className="hover:text-white transition-colors"
                >
                  Todos los hospedajes
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
            <h3 className="text-white font-medium mb-4">Anfitriones</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/anfitrion"
                  className="hover:text-white transition-colors"
                >
                  Sé anfitrión
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

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium mb-4">Contacto</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                Santiago Tlaxiaco, Oaxaca
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                +52 951 000 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                contacto@hospedajetlaxiaco.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            © 2026 Hospedaje Tlaxiaco. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500">
            <Link
              href="/terminos"
              className="hover:text-neutral-300 transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
