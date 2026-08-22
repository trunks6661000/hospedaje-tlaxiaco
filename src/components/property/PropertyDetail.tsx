"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  Share2,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  MessageCircle,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import ReservationBox from "./ReservationBox";

interface PropertyDetailProps {
  property: any;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const images = property.images || [];
  const amenities = property.amenities?.map((a: any) => a.amenity) || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {property.title}
          </h1>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-sm">
              {property.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" />
                  {property.rating.toFixed(1)}
                  <span className="text-neutral-500">
                    ({property.reviewCount} reseñas)
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1 text-neutral-600">
                <MapPin className="w-4 h-4" />
                {property.city}, {property.state}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-sm text-neutral-700 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" /> Compartir
              </button>
              <button className="flex items-center gap-1.5 text-sm text-neutral-700 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors">
                <Heart className="w-4 h-4" /> Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Images grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden cursor-pointer mb-8"
          onClick={() => setShowGallery(true)}
        >
          {images.length > 0 ? (
            <>
              <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto">
                <Image
                  src={images[0].url}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {images.slice(1, 5).map((img: any, i: number) => (
                <div key={img.id} className="relative aspect-[4/3] hidden md:block">
                  <Image
                    src={img.url}
                    alt={`${property.title} ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                  {i === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-medium">
                        +{images.length - 5} fotos
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="col-span-4 aspect-[21/9] bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-neutral-400" />
            </div>
          )}
        </div>

        {/* Content + Reservation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left content */}
          <div className="lg:col-span-2">
            {/* Host info */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-medium text-neutral-900">
                  {property.type} · Anfitrión: {property.owner.name}
                </h2>
                <p className="text-neutral-500 mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {property.maxGuests} huéspedes
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" /> {property.bedrooms}{" "}
                    recámaras
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {property.bathrooms} baños
                  </span>
                </p>
              </div>
              {property.owner.image && (
                <Image
                  src={property.owner.image}
                  alt={property.owner.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              )}
            </div>

            {/* Key features */}
            <div className="py-6 border-b border-neutral-200 space-y-4">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-neutral-600 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900">
                    Check-in: {property.checkIn} · Check-out: {property.checkOut}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Horarios establecidos por el anfitrión
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-6 border-b border-neutral-200">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="py-6 border-b border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  Lo que ofrece este lugar
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity: any) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 text-neutral-700"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            {property.rules && (
              <div className="py-6 border-b border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  Reglas del lugar
                </h3>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {property.rules}
                </p>
              </div>
            )}

            {/* Reviews */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-6">
                {property.rating && (
                  <>
                    <Star className="w-5 h-5 fill-neutral-900 text-neutral-900" />
                    <span className="text-lg font-medium">
                      {property.rating.toFixed(1)}
                    </span>
                    <span className="text-neutral-500">·</span>
                  </>
                )}
                <span className="text-lg font-medium">
                  {property.reviewCount} reseñas
                </span>
              </div>

              {property.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.reviews.slice(0, 6).map((review: any) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-neutral-600">
                            {review.user.name?.[0] || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {review.user.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= review.rating
                                ? "fill-neutral-900 text-neutral-900"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">
                  Aún no hay reseñas para esta propiedad.
                </p>
              )}
            </div>
          </div>

          {/* Right sidebar - Reservation */}
          <div className="lg:col-span-1">
            <ReservationBox
              propertyId={property.id}
              pricePerNight={property.pricePerNight}
              maxGuests={property.maxGuests}
              blockedDates={property.blockedDates.map(
                (d: any) => new Date(d.date)
              )}
            />

            {/* Contact WhatsApp */}
            <a
              href={`https://wa.me/5219510000000?text=${encodeURIComponent(
                `Hola, me interesa la propiedad "${property.title}" en Hospedaje Tlaxiaco`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-green-500 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen gallery */}
      {showGallery && images.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setGalleryIndex(
                (galleryIndex - 1 + images.length) % images.length
              )
            }
            className="absolute left-4 text-white hover:bg-white/10 p-2 rounded-full"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-4xl aspect-[16/10]">
            <Image
              src={images[galleryIndex].url}
              alt={`${property.title} ${galleryIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={() =>
              setGalleryIndex((galleryIndex + 1) % images.length)
            }
            className="absolute right-4 text-white hover:bg-white/10 p-2 rounded-full"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {galleryIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
