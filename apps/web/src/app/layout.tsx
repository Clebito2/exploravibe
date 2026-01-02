import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { TripProvider } from "@/lib/TripContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const libre = Libre_Baskerville({
  variable: "--font-libre",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExploraVibe | Turismo de Elite em João Pessoa e Goiânia",
  description: "Descubra as melhores experiências turísticas com ExploraVibe. Reservas fáceis e seguras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${libre.variable} antialiased`}
      >
        <AuthProvider>
          <TripProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </TripProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
