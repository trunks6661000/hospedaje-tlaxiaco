import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyDetail from "@/components/property/PropertyDetail";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug, status: "PUBLICADA" },
  });

  if (!property) return { title: "No encontrada" };

  return {
    title: property.title,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyPage({ params }: Props) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug, status: "PUBLICADA" },
    include: {
      images: { orderBy: { order: "asc" } },
      amenities: { include: { amenity: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      owner: {
        select: { id: true, name: true, image: true, createdAt: true },
      },
      blockedDates: { select: { date: true } },
    },
  });

  if (!property) notFound();

  const rating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
        property.reviews.length
      : null;

  return (
    <PropertyDetail
      property={{
        ...property,
        rating,
        reviewCount: property.reviews.length,
        pricePerNight: property.pricePerNight,
      }}
    />
  );
}
