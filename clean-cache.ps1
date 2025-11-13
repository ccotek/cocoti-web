# Script pour nettoyer le cache Next.js
Write-Host "Nettoyage du cache Next.js..." -ForegroundColor Yellow

# Arrêter les processus Node.js si possible
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*"}
if ($nodeProcesses) {
    Write-Host "Processus Node.js trouves. Arretez manuellement le serveur Next.js (Ctrl+C) avant de continuer." -ForegroundColor Red
    Write-Host "Appuyez sur Entree une fois le serveur arrete..."
    Read-Host
}

# Supprimer le cache .next
if (Test-Path ".next") {
    Write-Host "Suppression du dossier .next..." -ForegroundColor Yellow
    try {
        Remove-Item -Recurse -Force ".next" -ErrorAction Stop
        Write-Host "Dossier .next supprime avec succes!" -ForegroundColor Green
    } catch {
        Write-Host "Erreur lors de la suppression: $_" -ForegroundColor Red
        Write-Host "Essayez de fermer tous les processus Node.js et reessayez." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Le dossier .next n'existe pas." -ForegroundColor Gray
}

# Supprimer le cache node_modules/.cache
if (Test-Path "node_modules/.cache") {
    Write-Host "Suppression du cache node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
    Write-Host "Cache node_modules supprime!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Cache nettoye avec succes!" -ForegroundColor Green
Write-Host "Vous pouvez maintenant redemarrer le serveur avec: npm run dev" -ForegroundColor Cyan

