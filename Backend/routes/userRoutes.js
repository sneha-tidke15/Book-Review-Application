const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  addFavorite,
  removeFavorite,
} = require('../controllers/userController');

// Get logged-in user's profile
router.get('/profile', protect, getProfile);

// Add a book to favorites (bookId comes from request body)
router.post('/favorites', protect, addFavorite);

// Remove a book from favorites (bookId comes from URL param)
router.delete('/favorites/:bookId', protect, removeFavorite);

module.exports = router;