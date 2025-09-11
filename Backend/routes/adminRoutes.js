const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Book = require('../models/Book');

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Delete a user
router.delete('/users/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Delete any book
router.delete('/books/:id', protect, admin, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await book.remove();
    res.json({ message: 'Book deleted by admin' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

module.exports = router;