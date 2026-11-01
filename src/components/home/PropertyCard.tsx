"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  type: string;
  city: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  featured?: boolean;
}

export default function PropertyCard({
  id,
  slug,
  title,
  type,
  city,
  pricePerNight,
  maxGuests,
  bedrooms,
  rating,
  reviewCount,
  imageUrl,
  featured,
}: PropertyCardProps) {
  return (
    <Link href={`/propiedad/${slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-warm-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-200 to-primary-100">
            <MapPin className="w-10 h-10 text-primary-300" />
          </div>
        )}

        {/* Favorite */}
        <button
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-neutral-600" />
        </button>

        {/* Badge */}
        {featured && (
          <div className="absolute top-3 left-3 bg-primary-500 px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-white">Destacado</span>
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="font-semibold text-neutral-900 text-sm">
            {formatPrice(pricePerNight)}
          </span>
          <span className="text-xs text-neutral-500"> /noche</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          {rating && (
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
              <span className="text-sm font-medium text-neutral-700">
                {rating.toFixed(1)}
              </span>
              {reviewCount && (
                <span className="text-xs text-neutral-400">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {city}
          <span className="mx-1 text-neutral-300">&middot;</span>
          {maxGuests} huésp.
          <span className="mx-1 text-neutral-300">&middot;</span>
          {bedrooms} {bedrooms === 1 ? "rec." : "rec."}
        </p>
      </div>
    </Link>
  );
}
