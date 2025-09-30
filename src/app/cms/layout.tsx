import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cocoti CMS – Gestion de contenu",
  description: "Interface d'administration pour gérer le contenu du site Cocoti.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg'
  }
};

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
