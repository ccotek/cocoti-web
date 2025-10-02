import DebugAdminAuth from "@/components/DebugAdminAuth";

export default function AdminDebugPage() {
  // Ne rendre le composant de debug que en développement
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Cette page n'est disponible qu'en mode développement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <strong>⚠️ Mode Debug :</strong> Cette page n'est disponible qu'en développement. 
          Elle ne sera pas accessible en production.
        </div>
        <DebugAdminAuth />
      </div>
    </div>
  );
}
