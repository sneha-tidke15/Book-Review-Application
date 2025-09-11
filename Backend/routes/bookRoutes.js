const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  addReview,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

// 📚 Public Routes
router.get('/', getBooks);              // Get all books
router.get('/:id', getBookById);        // Get a single book by ID

// 🔐 Protected Routes
router.post('/', protect, createBook);  // Create a new book
router.put('/:id', protect, updateBook); // Update a book
router.delete('/:id', protect, deleteBook); // Delete a book
router.post('/:id/reviews', protect, addReview);

module.exports = router;