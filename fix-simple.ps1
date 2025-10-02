Write-Host "Fixing permissions..." -ForegroundColor Yellow

# Stop Node processes
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# Remove .next folder
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    cmd /c "rmdir /s /q .next" 2>$null
}

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
npm install

Write-Host "Done! Try npm run build now" -ForegroundColor Green
