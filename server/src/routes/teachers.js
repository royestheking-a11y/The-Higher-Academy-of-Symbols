import express from 'express';
import Teacher from '../models/Teacher.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Teacher.find().sort({ serialNo: 1 })); }
  catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const count = await Teacher.countDocuments();
    res.status(201).json(await Teacher.create({ ...req.body, serialNo: count + 1 }));
  } catch (err) { next(err); }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const t = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try { await Teacher.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { next(err); }
});

export default router;
