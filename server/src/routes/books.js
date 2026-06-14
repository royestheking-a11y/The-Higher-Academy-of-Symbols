import express from 'express';
import Book from '../models/Book.js';
import { protect, adminOnly as admin } from '../middleware/auth.js';

const router = express.Router();

// GET all books (Public)
router.get('/', async (req, res) => {
  try {
    const { category, language, isFeatured, limit } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (language) query.language = language;
    if (isFeatured === 'true') query.isFeatured = true;

    let booksQuery = Book.find(query).sort({ createdAt: -1 });
    if (limit) booksQuery = booksQuery.limit(parseInt(limit));

    const books = await booksQuery;
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single book by slug
router.get('/:slug', async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE book (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const book = new Book(req.body);
    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE book (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE book (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
