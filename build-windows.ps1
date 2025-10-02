# Script de build robuste pour Windows
Write-Host "🚀 Démarrage du build Cocoti Web pour Windows..." -ForegroundColor Cyan

# Arrêter tous les processus Node.js
Write-Host "🛑 Arrêt des processus Node.js..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "next" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Nettoyer tous les caches
Write-Host "🧹 Nettoyage des caches..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

# Vérifier les permissions
Write-Host "🔐 Vérification des permissions..." -ForegroundColor Yellow
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent()
Write-Host "Utilisateur: $($currentUser.Name)" -ForegroundColor Gray

# Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install --no-optional --legacy-peer-deps

# Build avec configuration spéciale
Write-Host "🔨 Build en cours..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Essayer le build
Write-Host "🔨 Tentative de build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build réussi!" -ForegroundColor Green
    Write-Host "📁 Dossier .next créé avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    Write-Host "🔄 Tentative de build alternatif..." -ForegroundColor Yellow
    
    # Essayer avec une configuration minimale
    $env:NEXT_BUILD_WORKERS = "1"
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build alternatif réussi!" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du build" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🎉 Build terminé avec succès!" -ForegroundColor Green
