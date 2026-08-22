import Link from "next/link";
import SearchBar from "@/components/home/SearchBar";
import Categories from "@/components/home/Categories";
import PropertyCard from "@/components/home/PropertyCard";
import {
  MessageCircle,
  Shield,
  Star,
  ArrowRight,
  Mountain,
  Utensils,
  Music,
} from "lucide-react";

const SAMPLE_PROPERTIES = [
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
  {
    id: "6",
    slug: "cabana-bosque-pino",
    title: "Cabaña en bosque de pino",
    type: "cabana",
    city: "San Juan Mixtepec",
    pricePerNight: 1100,
    maxGuests: 4,
    bedrooms: 2,
    rating: 5.0,
    reviewCount: 6,
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

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Descubre Tlaxiaco
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Hospedaje auténtico en el corazón de la Mixteca oaxaqueña.
              Encuentra tu lugar ideal para descansar.
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <Categories />

      {/* Properties grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Hospedajes en Tlaxiaco
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {SAMPLE_PROPERTIES.length} opciones disponibles
            </p>
          </div>
          <Link
            href="/propiedades"
            className="text-sm font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SAMPLE_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </section>

      {/* Why Tlaxiaco */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Conoce Santiago Tlaxiaco
            </h2>
            <p className="text-neutral-500 mt-2 max-w-xl mx-auto">
              El corazón de la Mixteca te espera con tradición, naturaleza y
              calidez
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Mountain className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Naturaleza viva
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Rodeado de montañas, bosques de pino y encino. Clima templado
                todo el año, perfecto para desconectarte.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Gastronomía mixteca
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Tamales de iguana, mole negro, tlayudas y chocolate de metate.
                Sabores que no encontrarás en otro lugar.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Cultura y tradición
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Mercado de los sábados, fiestas patronales, artesanías de palma
                y lana. Vive la Mixteca de cerca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-1">
              Pago seguro
            </h3>
            <p className="text-sm text-neutral-500">
              SPEI directo, sin comisiones extra. Tu dinero protegido.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-1">
              Anfitriones verificados
            </h3>
            <p className="text-sm text-neutral-500">
              Todos los hospedajes son revisados antes de publicarse.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-primary-500" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-1">
              Soporte por WhatsApp
            </h3>
            <p className="text-sm text-neutral-500">
              Escríbenos cuando lo necesites. Respuesta rápida garantizada.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Anfitrión */}
      <section className="bg-neutral-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            ¿Tienes un espacio en Tlaxiaco?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
            Regístralo y empieza a generar ingresos. Nosotros nos encargamos de
            la plataforma, tú del hospedaje.
          </p>
          <Link href="/anfitrion" className="btn-primary inline-block text-lg">
            Empieza como anfitrión
          </Link>
        </div>
      </section>
    </>
  );
}
