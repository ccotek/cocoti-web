# Script de build simple pour Windows
Write-Host "Starting build process..." -ForegroundColor Cyan

# Stop Node processes
Write-Host "Stopping Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clean caches
Write-Host "Cleaning caches..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# Set environment variables
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Build
Write-Host "Building..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
