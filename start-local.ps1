# Coursell Local Development Startup Script
# This script sets up environment variables for local development

Write-Host "🚀 Starting Coursell Project for Local Development..." -ForegroundColor Green

# Kill any existing Node.js processes
Write-Host "🔄 Stopping existing processes..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null

# Set environment variables for local development
$env:MONGO_URL = "mongodb+srv://coursell:coursell123@cluster0.0ajox62.mongodb.net/coursell?retryWrites=true&w=majority"
$env:JWT_SECRET = "coursell-super-secret-jwt-key-2024"
$env:PORT = "3001"
$env:FRONTEND_URL = "http://localhost:5173"
$env:NODE_ENV = "development"
$env:VITE_API_URL = "http://localhost:3001"

Write-Host "✅ Environment variables set for local development" -ForegroundColor Green
Write-Host "📡 MongoDB URL: mongodb+srv://***:***@cluster0.0ajox62.mongodb.net/coursell" -ForegroundColor Yellow
Write-Host "🔑 JWT Secret: coursell-super-secret-jwt-key-2024" -ForegroundColor Yellow
Write-Host "🌐 Backend Port: 3001" -ForegroundColor Yellow
Write-Host "🎨 Frontend URL: http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔗 API URL: http://localhost:3001" -ForegroundColor Yellow

# Start the development servers
Write-Host "🔄 Starting development servers..." -ForegroundColor Green
npm run dev 