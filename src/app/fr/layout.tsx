import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Cocoti – L'app qui digitalise la solidarité humaine",
  description: "Cocoti facilite la gestion de tontines digitales, cagnottes solidaires et projets collectifs avec une expérience fluide et sécurisée.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg'
  }
};

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} bg-sand text-night antialiased`}>
        {children}
      </body>
    </html>
  );
}
