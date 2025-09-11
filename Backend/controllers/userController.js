const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Add book to favorites
exports.addFavorite = async (req, res) => {
  const { bookId } = req.body; // ✅ Read from request body
  try {
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(bookId)) {
      user.favorites.push(bookId);
      await user.save();
      res.json({ message: 'Book added to favorites' });
    } else {
      res.status(400).json({ message: 'Book already in favorites' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favorite', error: err.message });
  }
};

// Remove book from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.bookId
    );
    await user.save();
    res.json({ message: 'Book removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite', error: err.message });
  }
};