const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
// CORS configuration
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path} from origin: ${req.headers.origin}`);
  console.log('Headers:', req.headers);
  next();
});

// Enable CORS for all routes
app.use(cors({
  origin: function (origin, callback) {
    console.log('Origin:', origin);
    // Allow all origins for now - we'll log them to see what's hitting us
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Handle preflight requests
app.options('*', cors());
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