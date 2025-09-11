const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://book-review-application-aayin65xd-sneha-tidkes-projects.vercel.app',
    'https://book-review-web-application.onrender.com'
  ],
  credentials: true
}));
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