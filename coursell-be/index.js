require('dotenv').config();
const config = require('./config/env');

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler, notFound, logger } = require("./middleware/errorHandler");

const app = express();

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Force redeployment - Render deployment fix
// Version 2.0 - Complete backend fix for Render deployment

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}));

const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) {
      // Allow all localhost ports in development
      return callback(null, true);
    }
    // Allow only your production frontend in production
    if (isProduction && (origin === process.env.FRONTEND_URL || origin === 'https://coursell.netlify.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'CourseLL API is running - Version 2.0',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    deployment: 'Render - Fixed',
    endpoints: {
      health: '/health',
      api: '/api',
      user: '/api/user',
      courses: '/api/courses',
      admin: '/api/admin',
      purchase: '/api/purchase'
    }
  });
});

// API routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");
const purchaseRoutes = require("./routes/purchase");

// Route mounting
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/purchase", purchaseRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUrl = config.mongoUrl;
    logger.info(`Attempting to connect to MongoDB: ${mongoUrl.replace(/\/\/.*@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error.message);
    logger.error('Please check your MONGO_URL in .env file or ensure MongoDB is running locally');
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = config.port;
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
