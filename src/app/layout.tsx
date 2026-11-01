import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Guetza — Hospedaje en el corazón de la Mixteca",
    template: "%s | Guetza",
  },
  description:
    "Encuentra hospedaje auténtico en Santiago Tlaxiaco, Oaxaca. Casas, cabañas y habitaciones curadas en la Mixteca oaxaqueña.",
  keywords: [
    "guetza",
    "hospedaje tlaxiaco",
    "hospedaje oaxaca",
    "cabañas tlaxiaco",
    "hotel tlaxiaco",
    "mixteca oaxaqueña",
    "santiago tlaxiaco",
  ],
  openGraph: {
    title: "Guetza — Hospedaje auténtico en Tlaxiaco",
    description:
      "Hospedaje curado en Santiago Tlaxiaco, Oaxaca. Vive la Mixteca.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${dmSerif.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Toaster position="top-center" />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
