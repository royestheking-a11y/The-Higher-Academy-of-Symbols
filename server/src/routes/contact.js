import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import Notification from '../models/Notification.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try { res.json(await ContactMessage.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// Public — submit contact form
router.post('/', async (req, res) => {
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
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json(msg);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

export default router;
