"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminNotFound() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers l'accueil
    router.push("/fr");
  }, [router]);

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
        <p className="text-ink-muted">Redirection vers l'accueil...</p>
      </div>
    </div>
  );
}
