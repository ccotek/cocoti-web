import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Cocoti – Reinventing tontines and collective projects",
  description: "Cocoti makes it simple to run digital tontines, solidarity funds and collective projects with a smooth, secure experience."
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-sand text-night antialiased`}>
        {children}
      </body>
    </html>
  );
}
