# Script de nettoyage et build pour Windows
Write-Host "🧹 Nettoyage des caches..." -ForegroundColor Yellow

# Arrêter les processus Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Supprimer les dossiers de cache
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Caches nettoyés" -ForegroundColor Green

# Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

# Build
Write-Host "🔨 Build en cours..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Build terminé!" -ForegroundColor Green
