@echo off
chcp 65001 >nul
echo ========================================
echo    INICIANDO E-COMMERCE COMPLETO
echo ========================================
echo.

echo 1. Iniciando Backend API (Porta 5001)...
cd /d "%~dp0backend\src"
start "Backend API" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

echo 2. Iniciando Servidor Frontend (Porta 3000)...
cd /d "%~dp0frontend"
echo Iniciando servidor HTTP...
start "Frontend Server" cmd /k "npx http-server -p 3000"
timeout /t 2 /nobreak >nul

echo 3. Abrindo aplicação...
start "" "http://localhost:3000/admin/dashboard.html"
echo.

echo ========================================
echo    ✅ SISTEMA INICIADO COM SUCESSO
echo ========================================
echo.
echo 📍 ENDPOINTS:
echo    API Backend:    http://localhost:5001
echo    Loja:           http://localhost:3000
echo    Admin:          http://localhost:3000/admin
echo.
echo 🔐 LOGIN ADMIN:
echo    URL:      http://localhost:3000/admin/login.html
echo    Usuario:  admin
echo    Senha:    admin123
echo.
echo 📋 ATALHOS RÁPIDOS:
echo    [1] Loja:        http://localhost:3000
echo    [2] Dashboard:   http://localhost:3000/admin/dashboard.html
echo    [3] Produtos:    http://localhost:3000/admin/dashboard.html#products
echo    [4] Pedidos:     http://localhost:3000/admin/dashboard.html#orders
echo.
echo ========================================
echo    ⚠️  NÃO FECHE AS JANELAS DO CMD
echo ========================================
echo Os servidores estão rodando nestas janelas.
echo.
pause