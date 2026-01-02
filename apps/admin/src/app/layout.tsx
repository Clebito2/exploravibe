import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

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
  title: "ExploraVibe Admin | Painel de Gestão",
  description: "Painel administrativo para gerenciamento de experiências e destinos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${libre.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
