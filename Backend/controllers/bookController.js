const Book = require('../models/Book');

// Get all books
exports.getBooks = async (req, res) => {
  const pageSize = 50;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { author: { $regex: req.query.keyword, $options: 'i' } },
          { category: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const ratingFilter = req.query.rating
    ? { rating: { $gte: Number(req.query.rating) } }
    : {};

  const filter = { ...keyword, ...ratingFilter };

  const count = await Book.countDocuments(filter);
  const books = await Book.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    books,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
};

// Get book by ID
exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  const { title, author, description, image, category } = req.body;

  const book = new Book({
    title,
    author,
    description,
    image,
    category,
    createdBy: req.user._id,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
};

// Update a book
exports.updateBook = async (req, res) => {
  const { title, author, description, image, category } = req.body;
  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.image = image || book.image;
    book.category = category || book.category;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await book.remove();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const book = await Book.findById(req.params.id);

  if (book) {
    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Book already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    book.reviews.push(review);
    book.numReviews = book.reviews.length;
    book.rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};