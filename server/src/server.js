import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from './db.js';

// Routes
import authRoutes         from './routes/auth.js';
import lectureRoutes      from './routes/lectures.js';
import articleRoutes      from './routes/articles.js';
import areaRoutes         from './routes/areas.js';
import testimonialRoutes  from './routes/testimonials.js';
import enrollmentRoutes   from './routes/enrollments.js';
import userRoutes         from './routes/users.js';
import supervisorRoutes   from './routes/supervisors.js';
import teacherRoutes      from './routes/teachers.js';
import packageRoutes      from './routes/packages.js';
import subscriptionRoutes from './routes/subscriptions.js';
import notificationRoutes from './routes/notifications.js';
import settingsRoutes     from './routes/settings.js';
import contactRoutes      from './routes/contact.js';
import uploadRoutes       from './routes/upload.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app') || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount Routes
app.use('/api/auth',          authRoutes);
app.use('/api/lectures',      lectureRoutes);
app.use('/api/articles',      articleRoutes);
app.use('/api/areas',         areaRoutes);
app.use('/api/testimonials',  testimonialRoutes);
app.use('/api/enrollments',   enrollmentRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/supervisors',   supervisorRoutes);
app.use('/api/teachers',      teacherRoutes);
app.use('/api/packages',      packageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings',      settingsRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/upload',        uploadRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Academy API running on http://localhost:${PORT}`);
    console.log(`📦 MongoDB: Connected`);
    console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  });
});
