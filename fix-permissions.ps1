Write-Host "🔧 Résolution des problèmes de permissions Windows..." -ForegroundColor Yellow

# Arrêter tous les processus Node.js
Write-Host "Arrêt des processus Node.js..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null
taskkill /F /IM next.exe /T 2>$null
Start-Sleep -Seconds 3

# Supprimer le dossier .next avec différentes méthodes
Write-Host "Suppression du dossier .next..." -ForegroundColor Yellow
if (Test-Path .next) {
    # Méthode 1: PowerShell
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    
    # Méthode 2: CMD
    if (Test-Path .next) {
        cmd /c "rmdir /s /q .next" 2>$null
        Start-Sleep -Seconds 1
    }
    
    # Méthode 3: Attrib + R puis suppression
    if (Test-Path .next) {
        cmd /c "attrib -r -h -s .next\*.* /s /d" 2>$null
        cmd /c "rmdir /s /q .next" 2>$null
    }
}

# Vérifier que le dossier est supprimé
if (Test-Path .next) {
    Write-Host "❌ Impossible de supprimer le dossier .next" -ForegroundColor Red
    Write-Host "Veuillez redémarrer votre ordinateur ou exécuter en tant qu'administrateur" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Dossier .next supprimé avec succès" -ForegroundColor Green
}

# Nettoyer le cache npm
Write-Host "Nettoyage du cache npm..." -ForegroundColor Yellow
npm cache clean --force

# Réinstaller les dépendances
Write-Host "Réinstallation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host "✅ Nettoyage terminé ! Vous pouvez maintenant essayer npm run build" -ForegroundColor Green
