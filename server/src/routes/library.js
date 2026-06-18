import express from 'express';
import LibraryResource from '../models/LibraryResource.js';
import User from '../models/User.js';
import { protect, adminOnly as admin } from '../middleware/auth.js';

const router = express.Router();

// GET all published resources (Public/Students)
router.get('/', async (req, res) => {
  try {
    const { category, isFeatured, limit } = req.query;
    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (isFeatured === 'true') query.isFeatured = true;

    let resourcesQuery = LibraryResource.find(query).sort({ createdAt: -1 });
    if (limit) resourcesQuery = resourcesQuery.limit(parseInt(limit));

    const resources = await resourcesQuery;
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all resources (Admin only)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const resources = await LibraryResource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single resource
router.get('/:slug', async (req, res) => {
  try {
    const resource = await LibraryResource.findOne({ slug: req.params.slug, status: 'published' });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    
    // Increment view count dynamically
    resource.views = (resource.views || 1000) + 1;
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE resource (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const resource = new LibraryResource(req.body);
    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE resource (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const resource = await LibraryResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE resource (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const resource = await LibraryResource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PURCHASE library membership
router.post('/purchase-membership', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Simulate payment logic for AED 499...
    user.hasLibraryAccess = true;
    await user.save();
    
    res.json({ success: true, message: 'Library access granted', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
