import Link from "next/link";
import SearchBar from "@/components/home/SearchBar";
import PropertyCard from "@/components/home/PropertyCard";
import {
  MessageCircle,
  Shield,
  Star,
  ArrowRight,
  Mountain,
  Utensils,
  Music,
  ChevronRight,
  Quote,
} from "lucide-react";

const FEATURED_PROPERTIES = [
  {
    id: "1",
    slug: "casa-colonial-centro",
    title: "Casa colonial en el centro",
    type: "casa",
    city: "Tlaxiaco centro",
    pricePerNight: 850,
    maxGuests: 4,
    bedrooms: 2,
    rating: 4.9,
    reviewCount: 24,
    featured: true,
  },
  {
    id: "6",
    slug: "cabana-privada-confortable",
    title: "Cabaña privada y confortable",
    type: "cabana",
    city: "Tlaxiaco centro",
    pricePerNight: 1533,
    maxGuests: 2,
    bedrooms: 1,
    rating: 5.0,
    reviewCount: 8,
    featured: true,
  },
  {
    id: "5",
    slug: "departamento-familiar",
    title: "Departamento familiar completo",
    type: "completo",
    city: "Tlaxiaco centro",
    pricePerNight: 950,
    maxGuests: 6,
    bedrooms: 3,
    rating: 4.9,
    reviewCount: 42,
    featured: true,
  },
];

const ALL_PROPERTIES = [
  ...FEATURED_PROPERTIES,
  {
    id: "2",
    slug: "cabana-vista-al-cerro",
    title: "Cabaña con vista al cerro",
    type: "cabana",
    city: "San Miguel",
    pricePerNight: 1200,
    maxGuests: 6,
    bedrooms: 3,
    rating: 4.7,
    reviewCount: 15,
  },
  {
    id: "3",
    slug: "habitacion-privada-centro",
    title: "Habitación privada y acogedora",
    type: "habitacion",
    city: "Tlaxiaco centro",
    pricePerNight: 450,
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.8,
    reviewCount: 31,
  },
  {
    id: "4",
    slug: "casa-rustica-mixteca",
    title: "Casa rústica mixteca",
    type: "rustico",
    city: "San Martín Huamelúlpam",
    pricePerNight: 650,
    maxGuests: 5,
    bedrooms: 2,
    rating: 4.6,
    reviewCount: 8,
  },
  {
    id: "7",
    slug: "estudio-moderno-centro",
    title: "Estudio moderno céntrico",
    type: "habitacion",
    city: "Tlaxiaco centro",
    pricePerNight: 550,
    maxGuests: 2,
    bedrooms: 1,
  },
  {
    id: "8",
    slug: "casa-jardin-amplio",
    title: "Casa con jardín amplio",
    type: "casa",
    city: "Barrio de Guadalupe",
    pricePerNight: 780,
    maxGuests: 5,
    bedrooms: 2,
    rating: 4.5,
    reviewCount: 11,
  },
];

const ZONES = [
  {
    name: "Tlaxiaco Centro",
    description: "A pasos de todo",
    count: 5,
    gradient: "from-primary-700 to-primary-900",
  },
  {
    name: "San Miguel",
    description: "Vistas al cerro",
    count: 2,
    gradient: "from-accent-600 to-accent-800",
  },
  {
    name: "Mixteca Alta",
    description: "Naturaleza pura",
    count: 3,
    gradient: "from-neutral-600 to-neutral-800",
  },
];

const REVIEWS = [
  {
    name: "Carolina M.",
    date: "Octubre 2026",
    rating: 5.0,
    text: "Las cabañas son hermosas, cada detalle está muy bien pensado y la vista a la naturaleza le suma. Es muy céntrico.",
  },
  {
    name: "Roberto G.",
    date: "Septiembre 2026",
    rating: 5.0,
    text: "Todo fue genial, muy limpio. La regadera es grande y tiene mucha agua caliente. Recomendado al 100%.",
  },
  {
    name: "Ana L.",
    date: "Agosto 2026",
    rating: 4.9,
    text: "El anfitrión súper amable, nos dio buenas recomendaciones para hacer senderismo. Volveremos sin duda.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/50 to-neutral-900/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-transparent to-accent-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center mb-12">
            <p className="text-primary-300 text-sm tracking-[0.2em] uppercase mb-4">
              Santiago Tlaxiaco, Oaxaca
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white mb-5 leading-tight">
              Quédate en el corazón
              <br />
              de la Mixteca
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Hospedaje curado con calidez oaxaqueña. Cada espacio es
              seleccionado por su autenticidad.
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Featured properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-500 text-xs tracking-[0.2em] uppercase mb-2">
              Selección Guetza
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900">
              Espacios destacados
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="hidden sm:flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-1 text-sm text-primary-600"
          >
            Ver todos los hospedajes
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Explore by zone */}
      <section className="bg-warm-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-primary-500 text-xs tracking-[0.2em] uppercase mb-2">
              Explora por zona
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900">
              Cada rincón tiene su encanto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ZONES.map((zone) => (
              <Link
                key={zone.name}
                href={`/propiedades?zone=${encodeURIComponent(zone.name)}`}
                className="group relative h-52 sm:h-64 rounded-2xl overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${zone.gradient}`}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-serif text-white mb-1">
                    {zone.name}
                  </h3>
                  <p className="text-sm text-white/70">{zone.description}</p>
                  <p className="text-xs text-white/50 mt-2">
                    {zone.count} hospedajes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-500 text-xs tracking-[0.2em] uppercase mb-2">
              Colección completa
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900">
              Todos los hospedajes
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              {ALL_PROPERTIES.length} espacios disponibles en la región
            </p>
          </div>
          <Link
            href="/propiedades"
            className="hidden sm:flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            Ver más
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {ALL_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </section>

      {/* Why Tlaxiaco */}
      <section className="bg-neutral-900 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-400 text-xs tracking-[0.2em] uppercase mb-2">
              Descubre
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-white">
              Santiago Tlaxiaco te espera
            </h2>
            <p className="text-neutral-400 mt-3 max-w-lg mx-auto text-sm">
              Tradición, naturaleza y calidez en cada esquina de la Mixteca
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-7">
              <div className="w-11 h-11 bg-accent-500/20 rounded-xl flex items-center justify-center mb-5">
                <Mountain className="w-5 h-5 text-accent-400" />
              </div>
              <h3 className="font-serif text-lg text-white mb-2">
                Naturaleza viva
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Montañas, bosques de pino y encino. Clima templado todo el año,
                perfecto para desconectarte del ruido.
              </p>
            </div>

            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-7">
              <div className="w-11 h-11 bg-primary-500/20 rounded-xl flex items-center justify-center mb-5">
                <Utensils className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="font-serif text-lg text-white mb-2">
                Gastronomía mixteca
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Tamales de iguana, mole negro, tlayudas y chocolate de metate.
                Sabores que no encontrarás en otro lugar.
              </p>
            </div>

            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-7">
              <div className="w-11 h-11 bg-purple-500/20 rounded-xl flex items-center justify-center mb-5">
                <Music className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-serif text-lg text-white mb-2">
                Cultura y tradición
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Mercado de los sábados, fiestas patronales, artesanías de palma
                y lana. Vive la Mixteca de cerca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
            <span className="text-2xl font-serif text-neutral-900">4.88</span>
          </div>
          <p className="text-sm text-neutral-500">
            Calificación promedio de nuestros huéspedes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-warm-50 border border-neutral-200/60 rounded-2xl p-6"
            >
              <Quote className="w-6 h-6 text-primary-300 mb-4" />
              <p className="text-sm text-neutral-700 leading-relaxed mb-5">
                {review.text}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-neutral-400">{review.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
                  <span className="text-sm font-medium text-neutral-700">
                    {review.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-warm-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">
                Pago seguro
              </h3>
              <p className="text-sm text-neutral-500">
                SPEI directo, sin comisiones extra
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">
                Espacios verificados
              </h3>
              <p className="text-sm text-neutral-500">
                Cada hospedaje es revisado personalmente
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">
                Soporte por WhatsApp
              </h3>
              <p className="text-sm text-neutral-500">
                Respuesta rápida cuando lo necesites
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Anfitrión */}
      <section className="relative bg-primary-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-900 to-neutral-900" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-300 text-xs tracking-[0.2em] uppercase mb-4">
            Para anfitriones
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-4">
            ¿Tienes un espacio en Tlaxiaco?
          </h2>
          <p className="text-primary-200/70 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Publica tu casa, cabaña o habitación en Guetza y empieza a recibir
            huéspedes. Nosotros nos encargamos de la plataforma.
          </p>
          <Link
            href="/anfitrion"
            className="inline-flex items-center gap-2 bg-white text-primary-900 px-7 py-3.5 rounded-xl font-medium hover:bg-primary-50 transition-colors"
          >
            Publica tu espacio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
