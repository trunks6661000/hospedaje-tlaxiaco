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
    <Link href={`/propiedad/${slug}`} className="group">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300">
            <MapPin className="w-10 h-10 text-neutral-400" />
          </div>
        )}

        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-neutral-700" />
        </button>

        {/* Badge */}
        {featured && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <span className="text-xs font-semibold text-neutral-800">
              Destacado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-neutral-900 text-[15px] leading-tight">
            {title}
          </h3>
          {rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900" />
              <span className="text-sm text-neutral-900">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-neutral-500 mt-0.5">
          {city} · {maxGuests} huéspedes · {bedrooms}{" "}
          {bedrooms === 1 ? "recámara" : "recámaras"}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold text-neutral-900">
            {formatPrice(pricePerNight)}
          </span>
          <span className="text-sm text-neutral-500"> noche</span>
        </p>
      </div>
    </Link>
  );
}
