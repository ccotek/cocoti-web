export default function AdminTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-night">Test Admin</h1>
      <p className="text-ink-muted">
        Cette page teste si le layout admin fonctionne correctement sans conflit d'hydratation.
      </p>
      <div className="mt-4 p-4 bg-ivory border border-cloud rounded-2xl">
        <p className="text-night">
          ✅ Si vous voyez cette page sans erreur d'hydratation, le problème est résolu !
        </p>
      </div>
      
      {/* Test des couleurs de la charte graphique */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-sunset text-white rounded-2xl text-center">
          <div className="font-bold">Sunset</div>
          <div className="text-sm opacity-90">#ff7c32</div>
        </div>
        <div className="p-4 bg-magenta text-white rounded-2xl text-center">
          <div className="font-bold">Magenta</div>
          <div className="text-sm opacity-90">#ff3a81</div>
        </div>
        <div className="p-4 bg-turquoise text-white rounded-2xl text-center">
          <div className="font-bold">Turquoise</div>
          <div className="text-sm opacity-90">#00c2a8</div>
        </div>
        <div className="p-4 bg-lilac text-white rounded-2xl text-center">
          <div className="font-bold">Lilac</div>
          <div className="text-sm opacity-90">#a259ff</div>
        </div>
      </div>
    </div>
  );
}
