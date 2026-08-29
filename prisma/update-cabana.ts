import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Update the property with real Airbnb data
  const property = await prisma.property.update({
    where: { slug: "cabanas-del-cafe-tlaxiaco" },
    data: {
      title: "Cabaña privada y confortable",
      slug: "cabana-privada-confortable",
      description:
        "Disfruta de la sencillez de este alojamiento tranquilo y céntrico en Santiago Tlaxiaco.\n\nCabaña privada con entrada independiente, perfecta para parejas. Cuenta con una recámara con cama matrimonial, sala con sofá, cocina equipada con frigobar, estufa, cafetera y licuadora, baño con agua caliente y regadera amplia, patio/balcón y estacionamiento gratuito.\n\nUbicación inmejorable — el 100% de los huéspedes calificaron la ubicación con 5 estrellas. A unas calles del centro, cerca de tiendas y restaurantes. Las mascotas son bienvenidas.\n\nAnfitrión: Abimanuel — SuperAnfitrión con índice de respuesta del 100%, responde en menos de una hora.\n\nReseñas destacadas:\n★ \"Las cabañas son hermosas, cada detalle está muy bien pensado y la vista a la naturaleza le suma. Es muy céntrico.\"\n★ \"Cabaña muy acogedora, cerca de tiendas y restaurantes.\"\n★ \"Todo fue genial, muy limpio. La regadera es grande y tiene mucha agua caliente.\"\n★ \"Manuel es un anfitrión súper amable, nos dio buenas recomendaciones para hacer senderismo.\"",
      type: "cabana",
      pricePerNight: 1533,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      checkIn: "15:00",
      checkOut: "12:00",
      rules:
        "Máximo 2 huéspedes. Llegada a partir de las 3:00 p.m. Salida antes de las 12:00 p.m. Es necesario utilizar escaleras. Mascotas bienvenidas.",
      featured: true,
    },
  });
  console.log("Property updated:", property.title);

  // Remove old amenities
  await prisma.propertyAmenity.deleteMany({
    where: { propertyId: property.id },
  });

  // Add new amenities matching the Airbnb listing
  const amenityNames = [
    "WiFi",
    "Estacionamiento",
    "Cocina",
    "Agua caliente",
    "TV",
    "Mascotas permitidas",
  ];

  // Also create amenities that don't exist yet
  const newAmenities = [
    { name: "Entrada privada", icon: "door-open", category: "Ubicación" },
    { name: "Patio o balcón", icon: "fence", category: "Exterior" },
    { name: "Detector de humo", icon: "alarm-smoke", category: "Seguridad" },
    { name: "Cafetera", icon: "coffee", category: "Cocina" },
    { name: "Frigobar", icon: "refrigerator", category: "Cocina" },
  ];

  for (const a of newAmenities) {
    await prisma.amenity.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    });
    amenityNames.push(a.name);
  }

  for (const name of amenityNames) {
    const amenity = await prisma.amenity.findUnique({ where: { name } });
    if (amenity) {
      await prisma.propertyAmenity.create({
        data: {
          propertyId: property.id,
          amenityId: amenity.id,
        },
      });
    }
  }

  console.log("Amenities updated:", amenityNames.length);

  // Update homepage reference — need to update the slug in the page.tsx too
  console.log("\nDone! Property updated with real Airbnb data.");
  console.log("Rating: 5.0 (8 evaluaciones)");
  console.log("Price per night: ~$1,533 MXN (basado en $4,599 / 3 noches)");
  console.log("New slug: cabana-privada-confortable");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
