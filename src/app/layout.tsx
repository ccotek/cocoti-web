import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Cocoti – Réinventons les tontines et projets collectifs",
  description: "Cocoti est la plateforme moderne pour gérer tontines digitales, cagnottes solidaires et projets collectifs en toute confiance."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} bg-sand text-night antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
