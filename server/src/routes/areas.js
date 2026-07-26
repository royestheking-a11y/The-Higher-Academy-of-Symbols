import express from 'express';
import AreaOfStudy from '../models/AreaOfStudy.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const areas = await AreaOfStudy.find(filter).sort({ order: 1 });
    res.json(areas);
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const area = await AreaOfStudy.findOne({ slug: req.params.slug });
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json(area);
  } catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try { res.status(201).json(await AreaOfStudy.create(req.body)); }
  catch (err) { next(err); }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const area = await AreaOfStudy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!area) return res.status(404).json({ message: 'Not found' });
    res.json(area);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try { await AreaOfStudy.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { next(err); }
});

export default router;
