import express from 'express';
import AreaOfStudy from '../models/AreaOfStudy.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const areas = await AreaOfStudy.find(filter).sort({ order: 1 });
    res.json(areas);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const area = await AreaOfStudy.findOne({ slug: req.params.slug });
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json(area);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await AreaOfStudy.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const area = await AreaOfStudy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!area) return res.status(404).json({ message: 'Not found' });
    res.json(area);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try { await AreaOfStudy.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
