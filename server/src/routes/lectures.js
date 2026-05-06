import express from 'express';
import Lecture from '../models/Lecture.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/lectures — public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured) filter.featured = req.query.featured === 'true';
    const lectures = await Lecture.find(filter).sort({ createdAt: -1 });
    res.json(lectures);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/lectures/:slug — public
router.get('/:slug', async (req, res) => {
  try {
    const lecture = await Lecture.findOne({ slug: req.params.slug });
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    res.json(lecture);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/lectures — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const lecture = await Lecture.create(req.body);
    res.status(201).json(lecture);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/lectures/:id — admin only
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    res.json(lecture);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/lectures/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lecture deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
