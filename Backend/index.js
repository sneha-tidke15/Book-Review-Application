const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Configure CORS with allowed origins from environment
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

console.log('Allowed origins:', allowedOrigins);

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log all requests
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${origin || 'none'}`);
  
  // Check if origin is allowed or if it's a server-to-server request
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Request-Timestamp');
    res.header('Access-Control-Expose-Headers', 'X-Request-Timestamp');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Basic rate limiting (in-memory, for production consider using Redis)
const rateLimit = {};
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Initialize rate limit for this IP if it doesn't exist
  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  }
  
  // Reset count if window has passed
  if (now > rateLimit[ip].resetTime) {
    rateLimit[ip] = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  }
  
  // Check if rate limit exceeded
  if (rateLimit[ip].count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((rateLimit[ip].resetTime - now) / 1000) + ' seconds'
    });
  }
  
  // Increment request count
  rateLimit[ip].count++;
  
  // Set rate limit headers
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS,
    'X-RateLimit-Remaining': MAX_REQUESTS - rateLimit[ip].count,
    'X-RateLimit-Reset': Math.ceil(rateLimit[ip].resetTime / 1000)
  });
  
  next();
});
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route for Render health check
app.get('/', (req, res) => {
  res.send('📚 Book Review API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));