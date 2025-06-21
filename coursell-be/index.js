require('dotenv').config();

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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
    message: 'CourseLL API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
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
    const mongoUrl = process.env.MONGO_URL;
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
    
    const PORT = process.env.PORT || 3001;
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
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
