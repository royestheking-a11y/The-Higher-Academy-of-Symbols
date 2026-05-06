import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

// GET all — admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('courseId', 'title_en title_ar slug');
    res.json(enrollments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET my enrollments — student
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate('courseId', 'title_en title_ar slug thumbnail price');
    res.json(enrollments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST — student creates enrollment
router.post('/', protect, async (req, res) => {
  try {
    const enr = await Enrollment.create({
      ...req.body,
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      enrollmentStatus: 'pending',
    });

    // Notify admin
    await Notification.create({
      userId: 'admin',
      title_ar: 'طلب اشتراك جديد',
      title_en: 'New Enrollment Request',
      message_ar: `طلب اشتراك جديد من: ${req.user.name} في: ${req.body.courseTitle}`,
      message_en: `New enrollment request from: ${req.user.name} for: ${req.body.courseTitle}`,
      type: 'success',
      link: '/admin',
    });

    // Notify student
    await Notification.create({
      userId: req.user._id.toString(),
      title_ar: 'تم استلام طلب الاشتراك',
      title_en: 'Enrollment Request Received',
      message_ar: 'تم استلام طلب اشتراكك بنجاح وجارٍ مراجعته من فريق الإدارة.',
      message_en: 'Your enrollment request has been received and is under review.',
      type: 'info',
      link: '/dashboard',
    });

    res.status(201).json(enr);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH — admin approves/rejects
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const enr = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enr) return res.status(404).json({ message: 'Not found' });

    // If approved, notify student
    if (req.body.enrollmentStatus === 'approved') {
      await Notification.create({
        userId: enr.userId.toString(),
        title_ar: 'تم تفعيل المحاضرة',
        title_en: 'Lecture Activated',
        message_ar: `تمت الموافقة على طلب اشتراكك في: ${enr.courseTitle}. يمكنك الآن البدء بالمشاهدة.`,
        message_en: `Your enrollment for "${enr.courseTitle}" has been approved. You can start now.`,
        type: 'success',
        link: '/dashboard',
      });
    }

    res.json(enr);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

export default router;
