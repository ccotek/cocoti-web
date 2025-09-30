import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButtonBasic from "@/components/WhatsAppButtonBasic";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Cocoti – L'app qui digitalise la solidarité humaine",
  description: "Cocoti facilite la gestion de tontines digitales, cagnottes solidaires et projets collectifs avec une expérience fluide et sécurisée.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json'
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
        <WhatsAppButtonBasic />
      </body>
    </html>
  );
}
