@echo off
echo 🚀 Starting ML Model Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Check if embeddings file exists
if not exist "src\embeddings_final.pkl" (
    echo ❌ embeddings_final.pkl not found in src\ directory
    echo Please ensure the embeddings file is present before deployment.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Build and start the service
echo 🔨 Building Docker image...
docker-compose build

if %errorlevel% neq 0 (
    echo ❌ Docker build failed
    pause
    exit /b 1
)

echo 🚀 Starting ML Model service...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ❌ Failed to start service
    pause
    exit /b 1
)

REM Wait for service to be ready
echo ⏳ Waiting for service to be ready...
timeout /t 10 /nobreak >nul

REM Check health
echo 🏥 Checking service health...
for /l %%i in (1,1,10) do (
    curl -f http://localhost:5000/health >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ Service is healthy and running!
        echo 🌐 ML Model API is available at: http://localhost:5000
        echo 📊 Health check: http://localhost:5000/health
        echo 🔍 API endpoint: http://localhost:5000/schemes
        goto :success
    ) else (
        echo ⏳ Waiting for service to be ready... (attempt %%i/10)
        timeout /t 5 /nobreak >nul
    )
)

echo ❌ Service failed to become healthy
echo 📋 Checking logs...
docker-compose logs
pause
exit /b 1

:success
echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop service: docker-compose down
echo   Restart service: docker-compose restart
echo   Update service: docker-compose up -d --build
pause
