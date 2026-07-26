import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import Notification from '../models/Notification.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', protect, adminOnly, async (req, res, next) => {
  try { res.json(await ContactMessage.find().sort({ createdAt: -1 })); }
  catch (err) { next(err); }
});

// Public — submit contact form
router.post('/', async (req, res, next) => {
  try {
    const msg = await ContactMessage.create({ ...req.body, date: new Date().toISOString(), status: 'new' });
    // Notify admin
    await Notification.create({
      userId: 'admin',
      title_ar: 'رسالة تواصل جديدة',
      title_en: 'New Contact Message',
      message_ar: `رسالة جديدة من: ${req.body.name}`,
      message_en: `New message from: ${req.body.name}`,
      type: 'info',
      link: '/admin',
    });
    res.status(201).json(msg);
  } catch (err) { next(err); }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json(msg);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
