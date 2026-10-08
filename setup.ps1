$ErrorActionPreference = 'Stop'
Write-Host 'Installing root dependencies...' -ForegroundColor Cyan
npm install
Write-Host 'Installing server and client dependencies...' -ForegroundColor Cyan
npm run install-all
if (!(Test-Path 'server/.env')) { Copy-Item 'server/.env.example' 'server/.env' }
if (!(Test-Path 'client/.env')) { Copy-Item 'client/.env.example' 'client/.env' }
Write-Host ''
Write-Host 'Setup complete.' -ForegroundColor Green
Write-Host 'Next: docker compose up -d mongodb' -ForegroundColor Yellow
Write-Host 'Then: npm run seed' -ForegroundColor Yellow
Write-Host 'Then: npm run dev' -ForegroundColor Yellow
