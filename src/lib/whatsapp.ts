const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

interface WhatsAppMessage {
  to: string;
  type: "text" | "template";
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: any[];
  };
}

export async function sendWhatsAppMessage(message: WhatsAppMessage) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn("WhatsApp API no configurada — mensaje no enviado");
    return null;
  }

  const response = await fetch(
    `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        ...message,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Error enviando WhatsApp:", error);
    return null;
  }

  return response.json();
}

export async function sendTextMessage(to: string, body: string) {
  return sendWhatsAppMessage({
    to: formatPhone(to),
    type: "text",
    text: { body },
  });
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("52") && digits.length === 12) return digits;
  if (digits.startsWith("1") && digits.length === 11) return digits;
  if (digits.length === 10) return `52${digits}`;
  return digits;
}
