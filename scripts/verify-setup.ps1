# Quick check: Docker, Postgres, MinIO vs src/.env
$ErrorActionPreference = "SilentlyContinue"

Write-Host "`n=== NITH Backend setup check ===`n" -ForegroundColor Cyan

# Docker
try {
  docker info 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Docker daemon is running" -ForegroundColor Green
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | Write-Host
  } else { throw }
} catch {
  Write-Host "[FAIL] Docker is not running. Start Docker Desktop." -ForegroundColor Red
}

function Test-Port($port) {
  $r = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
  return $r.TcpTestSucceeded
}

# Postgres (from .env: 5432)
if (Test-Port 5432) {
  Write-Host "[OK] Port 5432 (PostgreSQL) is open" -ForegroundColor Green
} else {
  Write-Host "[FAIL] Port 5432 is not open — Postgres not running or wrong port" -ForegroundColor Red
}

# MinIO API + console
if (Test-Port 9000) {
  Write-Host "[OK] Port 9000 (MinIO API) is open" -ForegroundColor Green
} else {
  Write-Host "[FAIL] Port 9000 is not open — MinIO not running" -ForegroundColor Red
}
if (Test-Port 9001) {
  Write-Host "[OK] Port 9001 (MinIO Console) is open — http://localhost:9001" -ForegroundColor Green
} else {
  Write-Host "[WARN] Port 9001 (MinIO Console) is not open" -ForegroundColor Yellow
}

Write-Host "`nExpected .env values (src/.env):" -ForegroundColor Cyan
Write-Host "  DB_HOST=localhost  DB_PORT=5432  DB_NAME=nith  DB_USER=myuser"
Write-Host "  MINIO_ENDPOINT=http://localhost:9000  keys=minioadmin / minioadmin123"
Write-Host ""
