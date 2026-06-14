import express from 'express';
import StoreOrder from '../models/StoreOrder.js';
import { protect, adminOnly as admin } from '../middleware/auth.js';

const router = express.Router();

// Generate unique order number
const generateOrderNumber = () => {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// CREATE new order (Public/Student)
router.post('/', async (req, res) => {
  try {
    const { customerDetails, items, totalAmount } = req.body;
    
    // Create new order
    const order = new StoreOrder({
      userId: req.user ? req.user.id : null, // Assuming optional auth middleware could be added if needed, or explicitly pass userId
      orderNumber: generateOrderNumber(),
      customerDetails,
      items,
      totalAmount,
      paymentStatus: 'pending',
      shippingStatus: 'pending'
    });

    // Handle user authentication if token provided (req.user might not be set if it's a public route without protect)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Decode user manually or use protect middleware on a specific sub-route if forced auth is needed.
      // We'll rely on the client to pass the userId in the body if we want it tied, or we use a custom middleware.
    }
    // If the frontend explicitly sends userId
    if (req.body.userId) {
      order.userId = req.body.userId;
    }

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET user orders (Protected)
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await StoreOrder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await StoreOrder.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id).populate('userId', 'name email').populate('items.bookId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE order status (Admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { paymentStatus, shippingStatus, trackingNumber } = req.body;
    const order = await StoreOrder.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (shippingStatus) order.shippingStatus = shippingStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
