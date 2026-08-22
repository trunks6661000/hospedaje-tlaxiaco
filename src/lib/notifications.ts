import { prisma } from "./prisma";
import { sendTextMessage } from "./whatsapp";
import { formatPrice, formatDate, getAirbnbBlockUrl } from "./utils";

export async function notifyNewReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      guest: { select: { name: true, phone: true, email: true } },
      property: {
        select: { title: true, slug: true, ownerId: true },
        include: { owner: { select: { name: true, phone: true } } },
      },
    },
  });

  if (!reservation) return;

  const { guest, property } = reservation;
  const checkIn = formatDate(reservation.checkIn);
  const checkOut = formatDate(reservation.checkOut);

  // Notificar al anfitrión
  if (property.owner.phone) {
    const airbnbUrl = getAirbnbBlockUrl(
      reservation.checkIn,
      reservation.checkOut,
      property.title
    );

    await sendTextMessage(
      property.owner.phone,
      `🏠 *Nueva reservación en ${property.title}*\n\n` +
        `Huésped: ${guest.name}\n` +
        `Fechas: ${checkIn} — ${checkOut}\n` +
        `Huéspedes: ${reservation.guests}\n` +
        `Total: ${formatPrice(reservation.totalPrice)}\n\n` +
        `⚠️ *Bloquea estas fechas en Airbnb:*\n${airbnbUrl}\n\n` +
        `Revisa los detalles en tu panel de anfitrión.`
    );
  }

  // Notificar al huésped
  if (guest.phone) {
    await sendTextMessage(
      guest.phone,
      `✅ *Reservación recibida*\n\n` +
        `Propiedad: ${property.title}\n` +
        `Fechas: ${checkIn} — ${checkOut}\n` +
        `Total: ${formatPrice(reservation.totalPrice)}\n\n` +
        `Te notificaremos cuando el anfitrión confirme tu reservación.`
    );
  }
}

export async function notifyReservationConfirmed(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      guest: { select: { name: true, phone: true } },
      property: { select: { title: true } },
    },
  });

  if (!reservation?.guest.phone) return;

  const checkIn = formatDate(reservation.checkIn);

  await sendTextMessage(
    reservation.guest.phone,
    `🎉 *¡Tu reservación fue confirmada!*\n\n` +
      `Propiedad: ${reservation.property.title}\n` +
      `Check-in: ${checkIn}\n` +
      `Total: ${formatPrice(reservation.totalPrice)}\n\n` +
      `Te esperamos en Santiago Tlaxiaco. ¡Buen viaje!`
  );
}

export async function notifyPaymentReceived(reservationId: string, amount: number) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      guest: { select: { name: true, phone: true } },
      property: {
        select: { title: true },
        include: { owner: { select: { phone: true } } },
      },
    },
  });

  if (!reservation) return;

  if (reservation.guest.phone) {
    await sendTextMessage(
      reservation.guest.phone,
      `💰 *Pago recibido*\n\n` +
        `Monto: ${formatPrice(amount)}\n` +
        `Propiedad: ${reservation.property.title}\n\n` +
        `Gracias por tu pago.`
    );
  }

  if (reservation.property.owner.phone) {
    await sendTextMessage(
      reservation.property.owner.phone,
      `💰 *Pago recibido por ${reservation.property.title}*\n\n` +
        `Monto: ${formatPrice(amount)}\n` +
        `Huésped: ${reservation.guest.name}\n\n` +
        `Revisa tu panel para más detalles.`
    );
  }
}

export async function notifyReservationCancelled(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      guest: { select: { name: true, phone: true } },
      property: {
        select: { title: true },
        include: { owner: { select: { phone: true } } },
      },
    },
  });

  if (!reservation) return;

  if (reservation.guest.phone) {
    await sendTextMessage(
      reservation.guest.phone,
      `❌ *Reservación cancelada*\n\n` +
        `Propiedad: ${reservation.property.title}\n\n` +
        `Si tienes preguntas, contáctanos por WhatsApp.`
    );
  }

  if (reservation.property.owner.phone) {
    await sendTextMessage(
      reservation.property.owner.phone,
      `❌ *Reservación cancelada en ${reservation.property.title}*\n\n` +
        `Huésped: ${reservation.guest.name}\n\n` +
        `Las fechas han sido liberadas.`
    );
  }
}
