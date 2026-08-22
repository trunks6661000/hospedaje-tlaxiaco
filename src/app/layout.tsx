import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Hospedaje Tlaxiaco — Hospedaje en el corazón de la Mixteca",
    template: "%s | Hospedaje Tlaxiaco",
  },
  description:
    "Encuentra el mejor hospedaje en Santiago Tlaxiaco, Oaxaca. Casas, cabañas y habitaciones auténticas en la Mixteca oaxaqueña.",
  keywords: [
    "hospedaje tlaxiaco",
    "hospedaje oaxaca",
    "cabañas tlaxiaco",
    "hotel tlaxiaco",
    "airbnb tlaxiaco",
    "mixteca oaxaqueña",
    "santiago tlaxiaco",
  ],
  openGraph: {
    title: "Hospedaje Tlaxiaco",
    description:
      "Encuentra el mejor hospedaje en Santiago Tlaxiaco, Oaxaca.",
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
      <body className={`${inter.variable} font-sans antialiased`}>
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
