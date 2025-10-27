#!/bin/bash

echo "🚀 Déploiement de Cocoti Web..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire cocoti-web"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Vérifier que le build a réussi
if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
    echo "🌐 Application prête pour le déploiement"
    echo "📁 Dossier .next créé avec succès"
else
    echo "❌ Erreur lors du build"
    exit 1
fi
echo "🎉 Déploiement terminé avec succès!"

