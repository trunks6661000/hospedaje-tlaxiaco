import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.string(),
  address: z.string().min(5),
  city: z.string().default("Tlaxiaco"),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pricePerNight: z.number().min(1),
  maxGuests: z.number().min(1).max(20),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  rules: z.string().optional(),
  checkIn: z.string().default("15:00"),
  checkOut: z.string().default("12:00"),
  airbnbIcalUrl: z.string().url().optional().or(z.literal("")),
  amenityIds: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const guests = searchParams.get("guests");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: any = { status: "PUBLICADA" };

  if (type && type !== "todos") {
    where.type = type;
  }
  if (minPrice) {
    where.pricePerNight = { ...where.pricePerNight, gte: parseFloat(minPrice) };
  }
  if (maxPrice) {
    where.pricePerNight = { ...where.pricePerNight, lte: parseFloat(maxPrice) };
  }
  if (guests) {
    where.maxGuests = { gte: parseInt(guests) };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
        owner: { select: { name: true, image: true } },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  const formatted = properties.map((p) => ({
    ...p,
    rating:
      p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : null,
    reviewCount: p.reviews.length,
    imageUrl: p.images[0]?.url || null,
  }));

  return NextResponse.json({
    properties: formatted,
    total,
    pages: Math.ceil(total / limit),
    page,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role !== "ANFITRION" && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Solo anfitriones pueden crear propiedades" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const data = propertySchema.parse(body);

    let slug = slugify(data.title);
    const existing = await prisma.property.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        type: data.type,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        pricePerNight: data.pricePerNight,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        rules: data.rules,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        airbnbIcalUrl: data.airbnbIcalUrl || null,
        status: session.user.role === "ADMIN" ? "PUBLICADA" : "PENDIENTE_APROBACION",
        ownerId: session.user.id,
        amenities: data.amenityIds
          ? {
              create: data.amenityIds.map((id) => ({ amenityId: id })),
            }
          : undefined,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error al crear la propiedad" },
      { status: 500 }
    );
  }
}
