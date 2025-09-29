import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Cocoti",
  description: "Gestion du contenu du site Cocoti"
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand text-night">
      {children}
    </div>
  );
}
