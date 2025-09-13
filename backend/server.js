import express from "express";
import fs from "fs";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import helmet from "helmet";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

import router from "./routes/index.js";

const app = express();

dotenv.config();

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Compress all responses
app.use(compression());

app.set("trust proxy", 1);

// Helmet security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"]
}
  }
}));

// CORS
app.use(cors());

// Cookie-parser
app.use(cookieParser());
app.use(express.json());

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Method-override
app.use(methodOverride("_method"));

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Serve Static Resources
app.use("/public", express.static("public"));
app.use(express.static(path.join(process.cwd(), "public")));

// Global blacklisted tokens
global.blacklistedTokens = new Set();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.use('/api', router);

// View Engine Setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

// 404 Handler
const notFoundHandler = (req, res, next) => {
  res.status(404).render("404", {
    layout: false,
    title: "Page Not Found",
  });
};

// Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Set default error status
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', err);
  }
  
  // Send error response
  if (req.accepts('html')) {
    res.status(status).render('error', {
      layout: false,
      title: 'Error',
      error: process.env.NODE_ENV === 'development' ? err : {},
      message: message,
      status: status
    });
  } else if (req.accepts('json')) {
    res.status(status).json({
      error: message,
      status: status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    res.status(status).type('txt').send(message);
  }
};

// Apply error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Server listen
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || 'localhost';

const server = app.listen(PORT, HOST, (error) => {
  if (error) throw error;
  console.log(`Express server started at http://${HOST}:${PORT}/`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server gracefully...');
  
  server.close(async () => {
    console.log('HTTP server closed.');
    
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
    
    console.log('Server shut down gracefully');
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
