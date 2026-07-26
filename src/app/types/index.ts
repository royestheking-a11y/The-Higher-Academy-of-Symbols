export interface User {
  id: string;
  _id?: string;
  name: string;
  name_ar?: string;
  email: string;
  phone?: string;
  country?: string;
  role: 'admin' | 'student';
  language: 'ar' | 'en';
  enrolledCourses: string[];
  avatar?: string;
  status: 'active' | 'inactive' | 'banned';
  hasLibraryAccess: boolean;
  createdAt?: string;
}

export interface AreaOfStudy {
  id: string;
  _id?: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  image?: string;
  order: number;
  status: 'published' | 'draft';
  whatItMeans?: string;
}

export interface Lecture {
  id: string;
  _id?: string;
  title_ar: string;
  title_en: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  content_ar?: string;
  content_en?: string;
  areaOfStudy: string;
  thumbnail?: string;
  videoUrl?: string;
  audioUrl?: string;
  documentUrl?: string;
  isFree: boolean;
  price?: number;
  duration?: number;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
}

export interface Article {
  id: string;
  _id?: string;
  title_ar: string;
  title_en: string;
  slug: string;
  content_ar: string;
  content_en: string;
  author: string;
  thumbnail?: string;
  tags?: string[];
  status: 'published' | 'draft';
}

export interface Testimonial {
  id: string;
  _id?: string;
  name_ar: string;
  name_en: string;
  role_ar?: string;
  role_en?: string;
  content_ar: string;
  content_en: string;
  avatar?: string;
  rating: number;
  status: 'published' | 'draft';
}

export interface Enrollment {
  id: string;
  _id?: string;
  user: string | User;
  lecture?: string | Lecture;
  courseId?: string;
  courseTitle?: string;
  amount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  enrollmentStatus?: string;
  date?: string;
  userId?: string;
  userName?: string;
  completedLessons?: string[];
  status: 'active' | 'completed' | 'cancelled';
  enrolledAt: string;
}

export interface ContactMessage {
  id: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  subject_ar?: string;
  subject_en?: string;
  message: string;
  message_ar?: string;
  message_en?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface Supervisor {
  id: string;
  _id?: string;
  user: string | User;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: string;
  _id?: string;
  user: string | User;
  specialization_ar?: string;
  specialization_en?: string;
  status: 'active' | 'inactive';
}

export interface Package {
  id: string;
  _id?: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  durationMonths: number;
  features_ar: string[];
  features_en: string[];
  status: 'active' | 'inactive';
}

export interface Subscription {
  id: string;
  _id?: string;
  user: string | User;
  package: string | Package;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

export interface Settings {
  id?: string;
  _id?: string;
  siteName_ar?: string;
  siteName_en?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  announcementEnabled?: boolean;
  announcementLink?: string;
  announcement_ar?: string;
  announcement_en?: string;
  address_ar?: string;
  address_en?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  heroTitle_ar?: string;
  heroTitle_en?: string;
  heroSubtitle_ar?: string;
  heroSubtitle_en?: string;
  heroDescription_ar?: string;
  heroDescription_en?: string;
  aboutText_ar?: string;
  aboutText_en?: string;
  vision_ar?: string;
  vision_en?: string;
  mission_ar?: string;
  mission_en?: string;
  founderName_ar?: string;
  founderName_en?: string;
  founderTitle_ar?: string;
  founderTitle_en?: string;
  founderBio_ar?: string;
  founderBio_en?: string;
  founderWebsite?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  aboutUs_ar?: string;
  aboutUs_en?: string;
  terms_ar?: string;
  terms_en?: string;
  privacy_ar?: string;
  privacy_en?: string;
}
