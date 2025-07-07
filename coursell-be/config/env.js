require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  // MongoDB Configuration
  mongoUrl: process.env.MONGO_URL || 'mongodb+srv://coursell:coursell123@cluster0.0ajox62.mongodb.net/coursell?retryWrites=true&w=majority',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'coursell-super-secret-jwt-key-2024',
  
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Frontend Configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // API URL for backend (for CORS, links, etc.)
  apiUrl: process.env.API_URL || (isProduction ? 'https://coursel.onrender.com' : 'http://localhost:3001'),
  
  // Database Configuration
  dbName: 'coursell',
  
  // Security Configuration
  corsOrigins: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
    'https://coursell.netlify.app',
    'https://coursell-be.onrender.com'
  ]
};

module.exports = config; 