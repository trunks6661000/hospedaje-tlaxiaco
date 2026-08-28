import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create admin user
  const adminPassword = await hash("Admin2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hospedajetlaxiaco.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@hospedajetlaxiaco.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "9530001234",
    },
  });
  console.log("Admin created:", admin.email);

  // 2. Create host users
  const hostPassword = await hash("Anfitrion2026!", 12);

  const host1 = await prisma.user.upsert({
    where: { email: "maria.lopez@email.com" },
    update: {},
    create: {
      name: "María López Hernández",
      email: "maria.lopez@email.com",
      password: hostPassword,
      role: "ANFITRION",
      phone: "9531234567",
      bio: "Anfitriona en Tlaxiaco con más de 5 años de experiencia. Me encanta compartir la cultura mixteca con mis huéspedes.",
    },
  });

  const host2 = await prisma.user.upsert({
    where: { email: "carlos.martinez@email.com" },
    update: {},
    create: {
      name: "Carlos Martínez Ruiz",
      email: "carlos.martinez@email.com",
      password: hostPassword,
      role: "ANFITRION",
      phone: "9537654321",
      bio: "Tengo varias propiedades en la región de la Mixteca. Ofrezco experiencias únicas cerca de la naturaleza.",
    },
  });

  const host3 = await prisma.user.upsert({
    where: { email: "guadalupe.santiago@email.com" },
    update: {},
    create: {
      name: "Guadalupe Santiago Cruz",
      email: "guadalupe.santiago@email.com",
      password: hostPassword,
      role: "ANFITRION",
      phone: "9539876543",
      bio: "Originaria de Tlaxiaco, rento habitaciones en mi casa colonial del centro.",
    },
  });

  // 3. Create a guest user
  const guestPassword = await hash("Huesped2026!", 12);
  const guest = await prisma.user.upsert({
    where: { email: "pedro.garcia@email.com" },
    update: {},
    create: {
      name: "Pedro García Sánchez",
      email: "pedro.garcia@email.com",
      password: guestPassword,
      role: "HUESPED",
      phone: "5551234567",
    },
  });

  // 4. Create amenities
  const amenitiesData = [
    { name: "WiFi", icon: "wifi", category: "Esencial" },
    { name: "Estacionamiento", icon: "car", category: "Esencial" },
    { name: "Cocina", icon: "utensils", category: "Esencial" },
    { name: "Agua caliente", icon: "droplets", category: "Esencial" },
    { name: "TV", icon: "tv", category: "Entretenimiento" },
    { name: "Chimenea", icon: "flame", category: "Confort" },
    { name: "Jardín", icon: "trees", category: "Exterior" },
    { name: "Vista al cerro", icon: "mountain", category: "Exterior" },
    { name: "Lavadora", icon: "shirt", category: "Esencial" },
    { name: "Aire acondicionado", icon: "wind", category: "Confort" },
    { name: "Calefacción", icon: "thermometer", category: "Confort" },
    { name: "Mascotas permitidas", icon: "paw-print", category: "Política" },
  ];

  const amenities: Record<string, string> = {};
  for (const a of amenitiesData) {
    const amenity = await prisma.amenity.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    });
    amenities[a.name] = amenity.id;
  }
  console.log("Amenities created:", Object.keys(amenities).length);

  // 5. Create properties
  const propertiesData = [
    {
      title: "Casa colonial en el centro",
      slug: "casa-colonial-centro",
      description:
        "Hermosa casa colonial ubicada en el corazón de Santiago Tlaxiaco. Cuenta con un patio interior tradicional, techos altos con vigas de madera y una decoración que mezcla lo antiguo con lo moderno. A solo 2 cuadras del mercado principal y de la plaza central. Ideal para familias que quieren vivir la experiencia auténtica de la Mixteca oaxaqueña.\n\nLa casa cuenta con cocina totalmente equipada, sala de estar con chimenea, y un jardín trasero con plantas de la región. El barrio es tranquilo y seguro, con acceso fácil a restaurantes, tiendas y transporte.",
      type: "casa",
      address: "Calle Porfirio Díaz 45, Centro",
      pricePerNight: 850,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      status: "PUBLICADA" as const,
      featured: true,
      latitude: 17.2764,
      longitude: -97.6789,
      rules: "No fumar dentro de la casa. Hora de silencio a partir de las 22:00. Mascotas pequeñas permitidas.",
      ownerId: host1.id,
      amenityNames: ["WiFi", "Cocina", "Agua caliente", "TV", "Chimenea", "Jardín"],
    },
    {
      title: "Cabaña con vista al cerro",
      slug: "cabana-vista-al-cerro",
      description:
        "Cabaña de madera con una vista espectacular al Cerro de la Garza. Ubicada en las afueras de Tlaxiaco, rodeada de bosque de pino y encino. Perfecta para quienes buscan desconectarse de la ciudad y disfrutar de la naturaleza.\n\nCuenta con una terraza amplia donde podrás desayunar con vista a las montañas, asador para carne, fogata exterior y senderos para caminar. Las noches estrelladas aquí son inolvidables.",
      type: "cabana",
      address: "Camino a San Miguel, km 3.5",
      city: "San Miguel",
      pricePerNight: 1200,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      status: "PUBLICADA" as const,
      featured: false,
      latitude: 17.2845,
      longitude: -97.6912,
      rules: "No se permiten fiestas. Cuidar el entorno natural. No dejar basura fuera de los contenedores.",
      ownerId: host2.id,
      amenityNames: ["Estacionamiento", "Cocina", "Agua caliente", "Chimenea", "Vista al cerro"],
    },
    {
      title: "Habitación privada y acogedora",
      slug: "habitacion-privada-centro",
      description:
        "Habitación privada dentro de una casa familiar en el centro de Tlaxiaco. Baño compartido con agua caliente las 24 horas. Incluye desayuno oaxaqueño (café de olla, pan de yema y fruta de temporada).\n\nUbicación inmejorable: a una cuadra de la plaza y del mercado. La anfitriona Guadalupe es originaria de Tlaxiaco y te puede orientar sobre los mejores lugares para comer y visitar.",
      type: "habitacion",
      address: "Calle Independencia 23, Centro",
      pricePerNight: 450,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      status: "PUBLICADA" as const,
      featured: false,
      latitude: 17.2758,
      longitude: -97.6778,
      rules: "Hora de llegada después de las 14:00. No fumar. Respetar las áreas comunes.",
      ownerId: host3.id,
      amenityNames: ["WiFi", "Agua caliente", "TV"],
    },
    {
      title: "Casa rústica mixteca",
      slug: "casa-rustica-mixteca",
      description:
        "Casa tradicional de adobe con techo de teja, restaurada con cuidado para ofrecer comodidades modernas sin perder la esencia mixteca. Ubicada en el pueblo de San Martín Huamelúlpam, a 15 minutos de Tlaxiaco.\n\nEl pueblo tiene una zona arqueológica importante y vistas panorámicas de todo el valle. La casa incluye hamacas en el corredor, cocina con fogón y estufa de gas, y un huerto de hierbas aromáticas.",
      type: "casa",
      address: "Calle Principal s/n, San Martín Huamelúlpam",
      city: "San Martín Huamelúlpam",
      pricePerNight: 650,
      maxGuests: 5,
      bedrooms: 2,
      bathrooms: 1,
      status: "PUBLICADA" as const,
      featured: false,
      latitude: 17.3012,
      longitude: -97.6534,
      rules: "Respetar el entorno del pueblo. No hacer ruido excesivo después de las 21:00.",
      ownerId: host2.id,
      amenityNames: ["Estacionamiento", "Cocina", "Agua caliente", "Jardín", "Vista al cerro"],
    },
    {
      title: "Departamento familiar completo",
      slug: "departamento-familiar",
      description:
        "Departamento completamente equipado y recién remodelado en Tlaxiaco. Perfecto para familias o grupos que necesitan espacio y comodidad. Cuenta con 3 recámaras amplias, sala-comedor, cocina integral y balcón con vista a la ciudad.\n\nEl edificio tiene estacionamiento techado y está ubicado en una zona residencial tranquila, a 5 minutos caminando del centro. Internet de alta velocidad para quienes necesiten trabajar remotamente.",
      type: "departamento",
      address: "Av. Juárez 112, Col. Centro",
      pricePerNight: 950,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      status: "PUBLICADA" as const,
      featured: true,
      latitude: 17.2771,
      longitude: -97.6801,
      rules: "No fiestas. No mascotas. Mantener limpio el departamento.",
      ownerId: host1.id,
      amenityNames: ["WiFi", "Estacionamiento", "Cocina", "Agua caliente", "TV", "Lavadora"],
    },
    {
      title: "Cabaña en bosque de pino",
      slug: "cabana-bosque-pino",
      description:
        "Cabaña aislada en medio de un bosque de pinos, a 20 minutos de Tlaxiaco por camino de terracería. El lugar perfecto para una escapada romántica o un retiro de silencio. Sin señal de celular — desconexión total.\n\nLa cabaña cuenta con calefacción a leña, cocina básica, terraza con hamaca y un arroyo a 50 metros. Se incluye leña para la chimenea y un mapa de senderos del bosque.",
      type: "cabana",
      address: "Paraje El Pinar, Camino a Mixtepec",
      city: "San Juan Mixtepec",
      pricePerNight: 1100,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      status: "PUBLICADA" as const,
      featured: false,
      latitude: 17.2634,
      longitude: -97.7123,
      rules: "Apagar bien el fuego de la chimenea antes de salir. No tirar basura en el bosque. Llevar linterna.",
      ownerId: host2.id,
      amenityNames: ["Estacionamiento", "Cocina", "Chimenea", "Vista al cerro", "Calefacción"],
    },
    {
      title: "Estudio moderno céntrico",
      slug: "estudio-moderno-centro",
      description:
        "Estudio tipo loft completamente nuevo en el centro de Tlaxiaco. Ideal para viajeros solos o parejas. Diseño minimalista con todo lo necesario: cama queen, cocineta, baño completo y escritorio de trabajo.\n\nCuenta con internet de fibra óptica, smart TV y aire acondicionado. Está sobre la calle principal, a pasos de todo: mercado, plaza, bancos, farmacias y restaurantes.",
      type: "habitacion",
      address: "Calle 5 de Mayo 67-A, Centro",
      pricePerNight: 550,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      status: "PUBLICADA" as const,
      featured: false,
      latitude: 17.2762,
      longitude: -97.6795,
      rules: "No fumar. No mascotas. Check-in flexible con caja de llaves.",
      ownerId: host3.id,
      amenityNames: ["WiFi", "Cocina", "Agua caliente", "TV", "Aire acondicionado"],
    },
    {
      title: "Cabañas del Café Tlaxiaco",
      slug: "cabanas-del-cafe-tlaxiaco",
      description:
        "Cabañas rodeadas de naturaleza con temática de café en Santiago Tlaxiaco. Un concepto único que combina el descanso con la cultura cafetalera de la Mixteca. Cada cabaña está decorada con elementos alusivos al café oaxaqueño y cuenta con su propia terraza privada.\n\nDisfruta de café de la región recién molido cada mañana, paseos por los jardines y noches tranquilas bajo las estrellas. Ubicación privilegiada con fácil acceso desde el centro de Tlaxiaco.",
      type: "cabana",
      address: "Santiago Tlaxiaco, Oaxaca",
      pricePerNight: 900,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      status: "PUBLICADA" as const,
      featured: true,
      latitude: 17.2752,
      longitude: -97.6815,
      rules: "No fumar dentro de las cabañas. Respetar horarios de silencio (22:00 - 7:00). Mascotas pequeñas con previo aviso.",
      ownerId: host1.id,
      amenityNames: ["WiFi", "Estacionamiento", "Cocina", "Agua caliente", "Jardín", "Vista al cerro", "Calefacción"],
    },
    {
      title: "Casa con jardín amplio",
      slug: "casa-jardin-amplio",
      description:
        "Casa espaciosa en el Barrio de Guadalupe con un jardín de 200m² donde los niños pueden jugar libremente. La casa tiene ambiente familiar, con sala amplia, comedor para 8 personas y una cocina completamente equipada.\n\nEl barrio es uno de los más tradicionales de Tlaxiaco, famoso por sus fiestas de diciembre. A 10 minutos caminando del centro. Estacionamiento para 2 autos dentro de la propiedad.",
      type: "casa",
      address: "Calle Guadalupe Victoria 89, Barrio de Guadalupe",
      city: "Barrio de Guadalupe",
      pricePerNight: 780,
      maxGuests: 5,
      bedrooms: 2,
      bathrooms: 1,
      status: "PUBLICADA" as const,
      featured: false,
      latitude: 17.2739,
      longitude: -97.6756,
      rules: "Mascotas permitidas con previo aviso. No fiestas. Cuidar el jardín.",
      ownerId: host1.id,
      amenityNames: ["WiFi", "Estacionamiento", "Cocina", "Agua caliente", "TV", "Jardín", "Mascotas permitidas"],
    },
  ];

  for (const propData of propertiesData) {
    const { amenityNames, city, ...data } = propData;
    const property = await prisma.property.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        city: city || "Tlaxiaco",
      },
    });

    for (const name of amenityNames) {
      const amenityId = amenities[name];
      if (amenityId) {
        await prisma.propertyAmenity.upsert({
          where: {
            propertyId_amenityId: {
              propertyId: property.id,
              amenityId: amenityId,
            },
          },
          update: {},
          create: {
            propertyId: property.id,
            amenityId: amenityId,
          },
        });
      }
    }

    console.log("Property created:", property.title);
  }

  // 6. Create WhatsApp bot FAQs
  const faqs = [
    {
      question: "¿Cómo hago una reservación?",
      answer: "Puedes reservar directamente en nuestra página web hospedaje-tlaxiaco.vercel.app. Elige la propiedad, selecciona tus fechas y completa el pago por SPEI o tarjeta.",
      category: "Reservaciones",
      order: 1,
    },
    {
      question: "¿Cuáles son las formas de pago?",
      answer: "Aceptamos SPEI (transferencia bancaria sin comisión), tarjeta de débito/crédito y pago en OXXO. El método más rápido es SPEI.",
      category: "Pagos",
      order: 1,
    },
    {
      question: "¿Cuál es la política de cancelación?",
      answer: "Cancelación gratuita hasta 48 horas antes del check-in. Después de ese plazo, se cobra el 50% de la primera noche.",
      category: "Reservaciones",
      order: 2,
    },
    {
      question: "¿Cómo llego a Tlaxiaco?",
      answer: "Desde Oaxaca capital: tomar la carretera 125 rumbo a Putla, son aproximadamente 4 horas. Hay corridas de autobús desde la Central de Abasto con líneas como Fletes y Pasajes o Estrella del Valle.",
      category: "Información general",
      order: 1,
    },
    {
      question: "¿Tienen estacionamiento?",
      answer: "Depende de la propiedad. Muchas de nuestras casas y cabañas incluyen estacionamiento gratuito. Revisa los amenidades de cada propiedad en la página de detalle.",
      category: "Información general",
      order: 2,
    },
    {
      question: "¿Aceptan mascotas?",
      answer: "Algunas propiedades aceptan mascotas pequeñas con previo aviso. Busca el filtro 'Mascotas permitidas' en nuestra página o pregúntanos por la propiedad que te interesa.",
      category: "Información general",
      order: 3,
    },
  ];

  for (const faq of faqs) {
    await prisma.whatsAppBot.create({ data: faq });
  }
  console.log("WhatsApp FAQs created:", faqs.length);

  // 7. Create a sample completed reservation with review
  const property1 = await prisma.property.findUnique({ where: { slug: "casa-colonial-centro" } });
  if (property1) {
    const reservation = await prisma.reservation.create({
      data: {
        checkIn: new Date("2026-08-01"),
        checkOut: new Date("2026-08-04"),
        guests: 3,
        nights: 3,
        totalPrice: 2550,
        status: "COMPLETADA",
        guestId: guest.id,
        propertyId: property1.id,
      },
    });

    await prisma.payment.create({
      data: {
        amount: 2550,
        method: "SPEI",
        status: "PAGADO",
        reference: "SPEI-20260801-001",
        paidAt: new Date("2026-07-30"),
        reservationId: reservation.id,
      },
    });

    await prisma.review.create({
      data: {
        rating: 5,
        comment: "Excelente lugar, muy limpio y bien ubicado. La anfitriona María fue muy amable y nos dio recomendaciones de lugares para comer. El patio interior es hermoso. Definitivamente regresaremos.",
        userId: guest.id,
        propertyId: property1.id,
        reservationId: reservation.id,
      },
    });
    console.log("Sample reservation + review created");
  }

  console.log("\nSeed completed successfully!");
  console.log("\nCredentials:");
  console.log("  Admin: admin@hospedajetlaxiaco.com / Admin2026!");
  console.log("  Host 1: maria.lopez@email.com / Anfitrion2026!");
  console.log("  Host 2: carlos.martinez@email.com / Anfitrion2026!");
  console.log("  Host 3: guadalupe.santiago@email.com / Anfitrion2026!");
  console.log("  Guest: pedro.garcia@email.com / Huesped2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
