import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard, BookOpen, Newspaper, Users, CreditCard, MessageSquare,
  Star, Settings, LogOut, Plus, Pencil, Trash2, Eye, EyeOff, Check, X,
  TrendingUp, GraduationCap, Shield, Home, Bell, Menu, ChevronRight,
  BarChart3, Award, UserCheck, Package, Wallet, CalendarDays, ChevronLeft,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft,
  AlignCenter, AlignRight, Quote, Minus, Link2, RotateCcw, RotateCw,
  Compass, Save, ArrowLeft, ArrowRight, Tag, Clock, Building2, Landmark,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import { GeometricBackground } from '../components/GeometricBackground';
import { Skeleton } from '../components/Skeleton';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

// ─────────────────────────────────────────────────────────────────────────────
// Rich Text Editor
// ─────────────────────────────────────────────────────────────────────────────
function RichTextEditor({ initialValue, onChange, dir = 'auto', minHeight = 220 }: {
  initialValue: string;
  onChange: (v: string) => void;
  dir?: 'ltr' | 'rtl' | 'auto';
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialValue || '';
  }, []); // eslint-disable-line

  const exec = (cmd: string, val?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const Sep = () => <div className="w-px self-stretch mx-0.5" style={{ background: 'rgba(6,43,36,0.15)' }} />;
  const TB = ({ title, icon: Icon, cmd, val }: { title: string; icon: any; cmd: string; val?: string }) => (
    <button type="button" title={title} onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
      className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-[rgba(6,43,36,0.1)]"
      style={{ color: '#3A5A50' }}>
      <Icon size={13} />
    </button>
  );
  const TBText = ({ title, label, cmd, val }: { title: string; label: string; cmd: string; val: string }) => (
    <button type="button" title={title} onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
      className="h-7 px-2 text-xs font-bold rounded transition-colors hover:bg-[rgba(6,43,36,0.1)]"
      style={{ color: '#3A5A50' }}>
      {label}
    </button>
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(6,43,36,0.18)' }}>
      {/* Toolbar row 1 */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5" style={{ background: 'rgba(6,43,36,0.04)', borderBottom: '1px solid rgba(6,43,36,0.1)' }}>
        <TB title="Undo" icon={RotateCcw} cmd="undo" />
        <TB title="Redo" icon={RotateCw} cmd="redo" />
        <Sep />
        <TB title="Bold" icon={Bold} cmd="bold" />
        <TB title="Italic" icon={Italic} cmd="italic" />
        <TB title="Underline" icon={Underline} cmd="underline" />
        <TB title="Strikethrough" icon={Strikethrough} cmd="strikeThrough" />
        <Sep />
        <TBText title="Heading 2" label="H2" cmd="formatBlock" val="h2" />
        <TBText title="Heading 3" label="H3" cmd="formatBlock" val="h3" />
        <TBText title="Paragraph" label="P" cmd="formatBlock" val="p" />
        <Sep />
        <TB title="Bullet List" icon={List} cmd="insertUnorderedList" />
        <TB title="Numbered List" icon={ListOrdered} cmd="insertOrderedList" />
        <Sep />
        <TB title="Align Left" icon={AlignLeft} cmd="justifyLeft" />
        <TB title="Align Center" icon={AlignCenter} cmd="justifyCenter" />
        <TB title="Align Right" icon={AlignRight} cmd="justifyRight" />
        <Sep />
        <TB title="Blockquote" icon={Quote} cmd="formatBlock" val="blockquote" />
        <TB title="Horizontal Rule" icon={Minus} cmd="insertHorizontalRule" />
        <button type="button" title="Insert Link"
          onMouseDown={e => { e.preventDefault(); const url = window.prompt('Enter URL:'); if (url) exec('createLink', url); }}
          className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-[rgba(6,43,36,0.1)]"
          style={{ color: '#3A5A50' }}>
          <Link2 size={13} />
        </button>
      </div>
      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        dir={dir}
        suppressContentEditableWarning
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        className="outline-none p-4 text-sm leading-relaxed"
        style={{ minHeight, color: '#3A5A50', background: 'white', lineHeight: '1.8' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const tableCls = 'w-full text-sm';
const thCls = 'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-start';
const tdCls = 'px-4 py-3 text-xs';

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { currentUser, logout, isAdmin } = useAuth();
  const {
    lectures, articles, areasOfStudy, users, enrollments, contactMessages, testimonials,
    settings, supervisors, teachers, packages, subscriptions,
    updateSettings, addLecture, updateLecture, deleteLecture,
    addArticle, updateArticle, deleteArticle, 
    updateEnrollment, updateContactMessage, deleteUser,
    addSupervisor, updateSupervisor, deleteSupervisor,
    addTeacher, updateTeacher, deleteTeacher,
    addPackage, updatePackage, deletePackage,
    addSubscription, deleteSubscription,
    addAreaOfStudy, updateAreaOfStudy, deleteAreaOfStudy,
    addTestimonial, updateTestimonial, deleteTestimonial,
    notifications, markNotificationAsRead, clearAllNotifications, addNotification, loading
  } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]       = useState('overview');
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  // Article editor
  const defaultArticleForm = {
    title_ar: '', title_en: '', slug: '', type: 'general',
    excerpt_ar: '', excerpt_en: '',
    content_ar: '', content_en: '',
    author_ar: 'د. فاطمة فاضل العيساوي', author_en: 'Dr. Fatima Fadel Al-Issawi',
    category_ar: '', category_en: '',
    tags: '', readTime: 5, featured: false, status: 'draft', date: new Date().toISOString().slice(0, 10),
  };
  const [articleView, setArticleView]     = useState<'list' | 'form'>('list');
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [articleForm, setArticleForm]     = useState<any>(defaultArticleForm);
  const [articleLang, setArticleLang]     = useState<'ar' | 'en'>('ar');

  // Lecture form
  const defaultLectureForm = {
    title_ar: '', title_en: '', slug: '', type: 'general',
    price: 0, lessonsCount: 0, duration: '',
    description_ar: '', description_en: '',
    featured: false, status: 'draft',
  };
  const [lectureView, setLectureView]     = useState<'list' | 'form'>('list');
  const [editingLecture, setEditingLecture] = useState<any>(null);
  const [lectureForm, setLectureForm]     = useState<any>(defaultLectureForm);

  // Area form
  const defaultAreaForm = { name_ar: '', name_en: '', description_ar: '', description_en: '', order: 1, status: 'published' };
  const [areaView, setAreaView]     = useState<'list' | 'form'>('list');
  const [editingArea, setEditingArea] = useState<any>(null);
  const [areaForm, setAreaForm]     = useState<any>(defaultAreaForm);

  // Testimonial form
  const defaultTestimonialForm = { name: '', name_en: '', country_ar: '', country_en: '', message_ar: '', message_en: '', rating: 5, status: 'published' };
  const [testimonialView, setTestimonialView]     = useState<'list' | 'form'>('list');
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialForm, setTestimonialForm]     = useState<any>(defaultTestimonialForm);

  // User View
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // Supervisor form
  const defaultSupForm = { name: '', name_ar: '', email: '', phone: '', specialty_ar: 'الإشراف الأكاديمي', specialty_en: 'Academic Supervision', bio_ar: '', bio_en: '', status: 'active', createdAt: new Date().toISOString().slice(0, 10) };
  const [supView, setSupView]   = useState<'list' | 'form'>('list');
  const [editingSup, setEditingSup] = useState<any>(null);
  const [supForm, setSupForm]   = useState<any>(defaultSupForm);

  // Teacher form
  const defaultTeacherForm = { name: '', name_ar: '', email: '', phone: '', specialty_ar: '', specialty_en: '', bio_ar: '', bio_en: '', status: 'active', createdAt: new Date().toISOString().slice(0, 10) };
  const [teacherView, setTeacherView]   = useState<'list' | 'form'>('list');
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [teacherForm, setTeacherForm]   = useState<any>(defaultTeacherForm);

  // Package form
  const defaultPkgForm = { name_ar: '', name_en: '', price: 0, duration_days: 30, features_ar: [], features_en: [], status: 'active', createdAt: new Date().toISOString().slice(0, 10) };
  const [pkgView, setPkgView]     = useState<'list' | 'form'>('list');
  const [editingPkg, setEditingPkg] = useState<any>(null);
  const [pkgForm, setPkgForm]     = useState<any>(defaultPkgForm);

  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogout = () => {
    setIsNavigating(true);
    logout();
    navigate('/', { replace: true });
  };

  if (isNavigating) return null;

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BRAND.ivory, fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.1)' }}>
            <Shield size={28} className="text-[#C9A24A] opacity-60" />
          </div>
          <p className="text-[#5A7A70] mb-2 font-medium">{t('الدخول محظور', 'Access Denied')}</p>
          <p className="text-[#8B9D8A] text-sm mb-5">{t('هذه الصفحة للمديرين فقط', 'This page is for administrators only')}</p>
          <Link to="/admin-login" className="px-5 py-2.5 rounded-xl text-sm font-semibold inline-block"
            style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}>
            {t('بوابة المديرين', 'Admin Portal')}
          </Link>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      label_ar: 'الرئيسية', label_en: 'Main',
      items: [{ id: 'overview', icon: LayoutDashboard, label_ar: 'نظرة عامة', label_en: 'Overview' }],
    },
    {
      label_ar: 'إدارة الكادر', label_en: 'Staff',
      items: [
        { id: 'supervisors', icon: UserCheck,      label_ar: 'المشرفون', label_en: 'Supervisors' },
        { id: 'teachers',    icon: GraduationCap,  label_ar: 'الأساتذة', label_en: 'Teachers' },
      ],
    },
    {
      label_ar: 'المحتوى', label_en: 'Content',
      items: [
        { id: 'lectures',    icon: BookOpen,   label_ar: 'المحاضرات',    label_en: 'Lectures' },
        { id: 'articles',    icon: Newspaper,  label_ar: 'المقالات',     label_en: 'Articles' },
        { id: 'areas',       icon: Compass,    label_ar: 'مجالات الدراسة', label_en: 'Areas of Study' },
      ],
    },
    {
      label_ar: 'التجاري', label_en: 'Commerce',
      items: [
        { id: 'packages',      icon: Package,      label_ar: 'الباقات',       label_en: 'Packages' },
        { id: 'subscriptions', icon: CalendarDays, label_ar: 'الاشتراكات',    label_en: 'Subscriptions' },
        { id: 'payments',      icon: Wallet,       label_ar: 'المدفوعات',     label_en: 'Payments' },
        { id: 'enrollments',   icon: CreditCard,   label_ar: 'التسجيلات',     label_en: 'Enrollments' },
      ],
    },
    {
      label_ar: 'المجتمع', label_en: 'Community',
      items: [
        { id: 'users',        icon: Users,        label_ar: 'المستخدمون',  label_en: 'Users' },
        { id: 'messages',     icon: MessageSquare, label_ar: 'الرسائل',    label_en: 'Messages' },
        { id: 'testimonials', icon: Star,          label_ar: 'التقييمات',  label_en: 'Testimonials' },
      ],
    },
    {
      label_ar: 'النظام', label_en: 'System',
      items: [{ id: 'settings', icon: Settings, label_ar: 'الإعدادات', label_en: 'Settings' }],
    },
  ];

  const allNavItems = navGroups.flatMap(g => g.items);

  const overviewStats = [
    { icon: Users,          label_ar: 'إجمالي المستخدمين', label_en: 'Total Users',   value: users.length,        color: '#C9A24A', bg: 'rgba(201,162,74,0.1)' },
    { icon: BookOpen,       label_ar: 'المحاضرات',          label_en: 'Lectures',       value: lectures.length,     color: '#7BBFAD', bg: 'rgba(123,191,173,0.1)' },
    { icon: Newspaper,      label_ar: 'المقالات',           label_en: 'Articles',       value: articles.length,     color: '#D8B75B', bg: 'rgba(216,183,91,0.1)' },
    { icon: CreditCard,     label_ar: 'الإيرادات',          label_en: 'Revenue',        value: `$${(enrollments as any[]).reduce((s: number, e: any) => s + (e.amount || 0), 0)}`, color: '#4A8B7A', bg: 'rgba(74,139,122,0.1)' },
    { icon: GraduationCap,  label_ar: 'التسجيلات',          label_en: 'Enrollments',    value: enrollments.length,  color: '#C9A24A', bg: 'rgba(201,162,74,0.1)' },
    { icon: MessageSquare,  label_ar: 'رسائل جديدة',        label_en: 'New Messages',   value: (contactMessages as any[]).filter((m: any) => m.status === 'new').length, color: '#F0D98A', bg: 'rgba(240,217,138,0.1)' },
  ];

  const ActionBtn = ({ onClick, color, icon: Icon }: any) => (
    <button onClick={onClick} className="p-1.5 rounded-lg transition-all hover:scale-110" style={{ background: `${color}18`, color }}>
      <Icon size={13} />
    </button>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, any> = {
      approved:  { bg: 'rgba(74,139,122,0.15)',  color: '#4A8B7A',  ar: 'موافق',     en: 'Approved' },
      pending:   { bg: 'rgba(216,183,91,0.15)',  color: '#D8B75B',  ar: 'انتظار',    en: 'Pending' },
      rejected:  { bg: 'rgba(212,24,61,0.12)',   color: '#D4183D',  ar: 'مرفوض',    en: 'Rejected' },
      new:       { bg: 'rgba(201,162,74,0.15)',  color: '#C9A24A',  ar: 'جديد',      en: 'New' },
      replied:   { bg: 'rgba(74,139,122,0.15)',  color: '#4A8B7A',  ar: 'مُرَد عليه', en: 'Replied' },
      published: { bg: 'rgba(74,139,122,0.15)',  color: '#4A8B7A',  ar: 'منشور',    en: 'Published' },
      draft:     { bg: 'rgba(216,183,91,0.15)',  color: '#D8B75B',  ar: 'مسودة',    en: 'Draft' },
      active:    { bg: 'rgba(74,139,122,0.15)',  color: '#4A8B7A',  ar: 'نشط',      en: 'Active' },
      inactive:  { bg: 'rgba(139,157,138,0.15)', color: '#8B9D8A',  ar: 'غير نشط',  en: 'Inactive' },
    };
    const s = map[status] || map.pending;
    return <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: s.bg, color: s.color }}>{t(s.ar, s.en)}</span>;
  };

  const TableWrap = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      <div className="overflow-x-auto"><table className={tableCls}>{children}</table></div>
    </div>
  );

  const THead = ({ cols }: { cols: string[] }) => (
    <thead><tr className="relative overflow-hidden" style={{ background: BRAND.deep }}>
      {cols.map((c, i) => <th key={i} className={`${thCls} relative z-10`} style={{ color: '#C9A24A' }}>{c}</th>)}
      <div className="absolute inset-0 pointer-events-none">
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.6} tileSize={40} />
      </div>
    </tr></thead>
  );

  const InputField = ({ label, value, onChange, dir = 'auto', type = 'text', disabled = false }: any) => (
    <div>
      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} dir={dir}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#1E1E1E] outline-none transition-all"
        style={{ background: disabled ? 'rgba(6,43,36,0.03)' : '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }}
        onFocus={e => !disabled && (e.target.style.borderColor = '#C9A24A')}
        onBlur={e => (e.target.style.borderColor = 'rgba(6,43,36,0.12)')}
      />
    </div>
  );

  const FormCard = ({ title, onClose, children, onSave }: { title: string; onClose: () => void; children: React.ReactNode; onSave: () => void }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between px-6 py-4 relative overflow-hidden" style={{ background: BRAND.deep }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
        <span className="text-[#F0D98A] font-semibold text-sm relative z-10">{title}</span>
        <button onClick={onClose} className="text-[#8B9D8A] hover:text-[#F0D98A] transition-colors relative z-10"><X size={16} /></button>
      </div>
      <div className="p-6 space-y-4">{children}</div>
      <div className="px-6 pb-6 flex gap-3">
        <button onClick={onSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}>
          <Save size={14} /> {t('حفظ', 'Save')}
        </button>
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm transition-all"
          style={{ background: 'rgba(212,24,61,0.08)', color: '#D4183D' }}>
          {t('إلغاء', 'Cancel')}
        </button>
      </div>
    </motion.div>
  );

  const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col" style={{ background: BRAND.ivory }}>
        <div className="px-8 py-5 flex items-center justify-between border-b relative overflow-hidden" style={{ background: BRAND.deep, borderColor: 'rgba(201,162,74,0.2)' }}>
          <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
          <h3 className="text-[#F0D98A] font-bold text-lg relative z-10">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B9D8A] hover:text-[#F0D98A] transition-colors relative z-10" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  );

  // ── Save helpers ─────────────────────────────────────────────────────────
  const saveArticle = (status: string) => {
    const form = { ...articleForm, status, tags: typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : articleForm.tags };
    if (!form.slug && form.title_en) form.slug = form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (editingArticle) { updateArticle(editingArticle.id, form); toast.success(t('تم تحديث المقالة', 'Article updated')); }
    else { addArticle({ ...form, image: null }); toast.success(t('تم نشر المقالة', status === 'published' ? 'Article published' : 'Article saved as draft')); }
    setArticleView('list'); setEditingArticle(null); setArticleForm(defaultArticleForm);
  };

  const saveSupervisor = () => {
    if (!supForm.name || !supForm.email) { toast.error(t('يرجى ملء الحقول المطلوبة', 'Please fill required fields')); return; }
    if (editingSup) { updateSupervisor(editingSup.id, supForm); toast.success(t('تم التحديث', 'Updated')); }
    else { addSupervisor(supForm); toast.success(t('تمت الإضافة', 'Added')); }
    setSupView('list'); setEditingSup(null); setSupForm(defaultSupForm);
  };

  const saveTeacher = () => {
    if (!teacherForm.name || !teacherForm.email) { toast.error(t('يرجى ملء الحقول المطلوبة', 'Please fill required fields')); return; }
    if (editingTeacher) { updateTeacher(editingTeacher.id, teacherForm); toast.success(t('تم التحديث', 'Updated')); }
    else { addTeacher(teacherForm); toast.success(t('تمت الإضافة', 'Added')); }
    setTeacherView('list'); setEditingTeacher(null); setTeacherForm(defaultTeacherForm);
  };

  const savePackage = () => {
    if (!pkgForm.name_ar && !pkgForm.name_en) { toast.error(t('يرجى إدخال اسم الباقة', 'Please enter package name')); return; }
    if (editingPkg) { updatePackage(editingPkg.id, pkgForm); toast.success(t('تم التحديث', 'Updated')); }
    else { addPackage(pkgForm); toast.success(t('تمت الإضافة', 'Added')); }
    setPkgView('list'); setEditingPkg(null); setPkgForm(defaultPkgForm);
  };

  const saveLecture = () => {
    if (!lectureForm.title_ar && !lectureForm.title_en) { toast.error(t('يرجى إدخال عنوان المحاضرة', 'Please enter lecture title')); return; }
    if (editingLecture) { updateLecture(editingLecture.id, lectureForm); toast.success(t('تم التحديث', 'Updated')); }
    else { addLecture(lectureForm); toast.success(t('تمت الإضافة', 'Added')); }
    setLectureView('list'); setEditingLecture(null); setLectureForm(defaultLectureForm);
  };

  const saveArea = () => {
    if (!areaForm.name_ar && !areaForm.name_en) { toast.error(t('يرجى إدخال اسم المجال', 'Please enter area name')); return; }
    if (editingArea) { updateAreaOfStudy(editingArea.id, areaForm); toast.success(t('تم التحديث', 'Updated')); }
    else { addAreaOfStudy(areaForm); toast.success(t('تمت الإضافة', 'Added')); }
    setAreaView('list'); setEditingArea(null); setAreaForm(defaultAreaForm);
  };

  const saveTestimonial = () => {
    if (!testimonialForm.name && !testimonialForm.message_ar) { toast.error(t('يرجى إدخال الاسم والرسالة', 'Please enter name and message')); return; }
    if (editingTestimonial) { updateTestimonial(editingTestimonial.id, testimonialForm); toast.success(t('تم التحديث', 'Updated')); } 
    else { addTestimonial(testimonialForm); toast.success(t('تمت الإضافة', 'Added')); }
    setTestimonialView('list'); setEditingTestimonial(null); setTestimonialForm(defaultTestimonialForm);
  };

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      <div className="p-4" style={{ borderBottom: '1px solid rgba(201,162,74,0.2)' }}>
        <Link to="/" className="flex items-center gap-2.5 mb-4">
          <div className="rounded-full overflow-hidden shrink-0" style={{ width: 36, height: 36, background: '#062B24', boxShadow: '0 2px 10px rgba(201,162,74,0.35)' }}>
            <img src="/symbolacademy.png" alt="The Higher Academy of Symbols" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <div className="text-[#F0D98A] text-xs font-bold">{t('الأكاديمية العليا للرموز', 'The Higher Academy of Symbols')}</div>
            <div className="text-[#6B8B80] text-[10px]">{t('لوحة الإدارة', 'Admin Panel')}</div>
          </div>
        </Link>
        <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(201,162,74,0.08)', border: '1px solid rgba(201,162,74,0.2)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', boxShadow: '0 2px 0 #8B6B20' }}>
            <Shield size={16} color="#062B24" />
          </div>
          <div className="min-w-0">
            <div className="text-[#F0D98A] text-xs font-semibold">{t('المشرف العام', 'Super Admin')}</div>
            <div className="text-[#6B8B80] text-[10px] truncate">{currentUser.email}</div>
          </div>
        </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label_en} className="mb-3">
            <div className="px-3 mb-1 text-[#4A6B60] text-[9px] font-bold uppercase tracking-widest">
              {t(group.label_ar, group.label_en)}
            </div>
            {group.items.map(item => {
              const IconComp = item.icon;
              const newMsgCount = item.id === 'messages' ? (contactMessages as any[]).filter((m: any) => m.status === 'new').length : 0;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs mb-0.5 transition-all text-start ${isActive ? 'text-[#F0D98A]' : 'text-[#8B9D8A] hover:text-[#E8DDC7]'}`}
                  style={{ background: isActive ? 'rgba(201,162,74,0.15)' : 'transparent' }}>
                  <IconComp size={13} className={isActive ? 'text-[#C9A24A]' : ''} />
                  <span className="flex-1">{t(item.label_ar, item.label_en)}</span>
                  {newMsgCount > 0 && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#C9A24A', color: BRAND.deep }}>{newMsgCount}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-3" style={{ borderTop: '1px solid rgba(201,162,74,0.15)' }}>
        <Link to="/" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#8B9D8A] hover:text-[#E8DDC7] transition-all">
          <Home size={13} /> {t('العودة للموقع', 'Back to Site')}
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#8B9D8A] hover:text-[#E8DDC7] transition-all text-start">
          <LogOut size={13} /> {t('تسجيل الخروج', 'Logout')}
        </button>
      </div>
    </>
  );

  const currentNavItem = allNavItems.find(i => i.id === activeTab);

  return (
    <div className="min-h-screen flex" style={{ background: '#F0EDE5', fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{ background: `linear-gradient(175deg, ${BRAND.deep}, ${BRAND.mid})`, borderInlineEnd: '1px solid rgba(201,162,74,0.2)' }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: isRTL ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 start-0 w-60 h-screen z-50 flex flex-col lg:hidden overflow-hidden"
              style={{ background: `linear-gradient(175deg, ${BRAND.deep}, ${BRAND.mid})` }}>
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
              <div className="relative z-10 flex flex-col h-full">
                <button onClick={() => setSidebarOpen(false)} className="absolute top-4 end-4 text-[#8B9D8A] hover:text-[#E8DDC7]"><X size={18} /></button>
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 lg:px-8"
          style={{ background: 'rgba(240,237,229,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(6,43,36,0.08)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,43,36,0.06)' }}>
              <Menu size={18} className="text-[#062B24]" />
            </button>
            <h2 className="text-[#062B24] text-sm font-semibold">{currentNavItem ? t(currentNavItem.label_ar, currentNavItem.label_en) : ''}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs" style={{ background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', color: BRAND.gold }}>
              <Shield size={12} /> {t('مشرف', 'Admin')}
            </div>
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all hover:bg-[rgba(6,43,36,0.1)]"
                style={{ background: 'rgba(6,43,36,0.06)' }}
              >
                <Bell size={16} className="text-[#3A5A50]" />
                {notifications.filter(n => n.userId === 'admin' && n.status === 'unread').length > 0 && (
                  <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full" style={{ background: '#C9A24A' }} />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute end-0 mt-2 w-80 rounded-2xl overflow-hidden z-50 shadow-2xl border border-[rgba(6,43,36,0.08)]"
                      style={{ background: 'white' }}
                    >
                      <div className="p-4 flex items-center justify-between border-bottom" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <h3 className="text-sm font-bold text-[#062B24]">{t('تنبيهات الإدارة', 'Admin Notifications')}</h3>
                        <button
                          onClick={() => clearAllNotifications('admin')}
                          className="text-[10px] text-[#C9A24A] hover:underline"
                        >
                          {t('مسح الكل', 'Clear All')}
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.filter(n => n.userId === 'admin').length === 0 ? (
                          <div className="p-8 text-center text-[#8B9D8A] text-xs">
                            {t('لا توجد تنبيهات جديدة', 'No new notifications')}
                          </div>
                        ) : (
                          notifications.filter(n => n.userId === 'admin').map((n, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                if (n.id) markNotificationAsRead(n.id);
                                if (n.link) {
                                  if (n.link.startsWith('/admin')) {
                                    const tab = n.link.split('/').pop();
                                    if (tab) setActiveTab(tab);
                                  } else {
                                    navigate(n.link);
                                  }
                                }
                                setNotifOpen(false);
                              }}
                              className={`p-4 transition-all cursor-pointer border-bottom ${n.status === 'unread' ? 'bg-[#F8F6F0]' : 'bg-white hover:bg-[#FAF9F6]'}`}
                              style={{ borderBottom: '1px solid rgba(6,43,36,0.04)' }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.status === 'unread' ? 'bg-[#C9A24A]' : 'bg-transparent'}`} />
                                <div className="min-w-0">
                                  <div className={`text-xs font-semibold truncate ${n.status === 'unread' ? 'text-[#062B24]' : 'text-[#5A7A70]'}`}>
                                    {t(n.title_ar, n.title_en)}
                                  </div>
                                  <div className="text-[11px] text-[#8B9D8A] mt-0.5 line-clamp-2">
                                    {t(n.message_ar, n.message_en)}
                                  </div>
                                  <div className="text-[10px] text-[#C9A24A] mt-1.5 opacity-70">
                                    {new Date(n.createdAt).toLocaleString(t('ar-SA', 'en-US'), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-5 lg:p-8 overflow-auto">

          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h1 className="text-[#062B24] font-bold" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem,3vw,1.8rem)' }}>
                  {t('لوحة التحكم الرئيسية', 'Main Dashboard')}
                </h1>
                <p className="text-[#5A7A70] text-sm mt-1">{t('مرحباً بك في لوحة إدارة الأكاديمية العليا للرموز', 'Welcome to The Higher Academy of Symbols admin panel')}</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton.Base key={i} theme="light" className="h-32 w-full rounded-2xl" />
                  ))
                ) : overviewStats.map((s, i) => {
                  const IconComp = s.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                          <IconComp size={18} style={{ color: s.color }} />
                        </div>
                        <TrendingUp size={13} className="text-[#8B9D8A]" />
                      </div>
                      <div className="text-[#062B24] font-bold text-2xl">{s.value}</div>
                      <div className="text-[#8B9D8A] text-xs mt-0.5">{t(s.label_ar, s.label_en)}</div>
                    </motion.div>
                  );
                })}
              </div>
              {/* Quick stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton.Base key={i} theme="light" className="h-16 w-full rounded-2xl" />
                  ))
                ) : [
                  { label_ar: 'المشرفون', label_en: 'Supervisors', val: supervisors.length, icon: UserCheck },
                  { label_ar: 'الأساتذة',  label_en: 'Teachers',    val: teachers.length,    icon: GraduationCap },
                  { label_ar: 'الباقات',   label_en: 'Packages',    val: packages.length,    icon: Package },
                  { label_ar: 'مجالات الدراسة', label_en: 'Study Areas', val: areasOfStudy.length, icon: Compass },
                ].map((item, i) => {
                  const IconComp = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(201,162,74,0.1)' }}>
                        <IconComp size={16} className="text-[#C9A24A]" />
                      </div>
                      <div>
                        <div className="text-[#062B24] font-bold text-lg">{item.val}</div>
                        <div className="text-[#8B9D8A] text-xs">{t(item.label_ar, item.label_en)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                <div className="flex items-center justify-between px-5 py-4 relative overflow-hidden" style={{ background: BRAND.deep }}>
                  <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.6} tileSize={50} />
                  <span className="text-[#F0D98A] text-sm font-semibold relative z-10">{t('أحدث الرسائل', 'Recent Messages')}</span>
                  <button onClick={() => setActiveTab('messages')} className="text-[#C9A24A] text-xs hover:underline relative z-10">{t('عرض الكل', 'View All')}</button>
                </div>
                <div className="overflow-x-auto">
                  <table className={tableCls}>
                    <thead><tr style={{ background: 'rgba(6,43,36,0.04)' }}>
                      <th className={thCls} style={{ color: BRAND.deep }}>{t('المرسل', 'Sender')}</th>
                      <th className={thCls} style={{ color: BRAND.deep }}>{t('الموضوع', 'Subject')}</th>
                      <th className={thCls} style={{ color: BRAND.deep }}>{t('الحالة', 'Status')}</th>
                    </tr></thead>
                    <tbody>
                      {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                            <td className={tdCls}><Skeleton.Base className="h-4 w-24 rounded" /></td>
                            <td className={tdCls}><Skeleton.Base className="h-4 w-48 rounded" /></td>
                            <td className={tdCls}><Skeleton.Base className="h-4 w-16 rounded" /></td>
                          </tr>
                        ))
                      ) : (contactMessages as any[]).slice(0, 5).map((msg: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                          <td className={`${tdCls} text-[#062B24] font-medium`}>{msg.name}</td>
                          <td className={`${tdCls} text-[#5A7A70]`}>{t(msg.subject_ar, msg.subject_en)}</td>
                          <td className={tdCls}><StatusBadge status={msg.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SUPERVISORS ──────────────────────────────────────────────── */}
          {activeTab === 'supervisors' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[#062B24] font-bold text-lg">{t('جدول المشرفين', "Supervisors' Schedule")}</h2>
                  <p className="text-[#8B9D8A] text-xs mt-0.5">{t(`${supervisors.length} مشرف`, `${supervisors.length} supervisor(s)`)}</p>
                </div>
                {supView === 'list' && (
                  <button onClick={() => { setSupView('form'); setEditingSup(null); setSupForm(defaultSupForm); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                    <Plus size={15} /> {t('إضافة مشرف', 'Add Supervisor')}
                  </button>
                )}
              </div>

              {supView === 'form' ? (
                <FormCard title={editingSup ? t('تعديل المشرف', 'Edit Supervisor') : t('مشرف جديد', 'New Supervisor')}
                  onClose={() => { setSupView('list'); setEditingSup(null); }} onSave={saveSupervisor}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label={t('الاسم (انجليزي)', 'Name (English)')} value={supForm.name} onChange={(v: string) => setSupForm({ ...supForm, name: v })} />
                    <InputField label={t('الاسم (عربي)', 'Name (Arabic)')} value={supForm.name_ar} onChange={(v: string) => setSupForm({ ...supForm, name_ar: v })} dir="rtl" />
                    <InputField label={t('البريد الإلكتروني', 'Email')} value={supForm.email} onChange={(v: string) => setSupForm({ ...supForm, email: v })} type="email" />
                    <InputField label={t('رقم الهاتف', 'Phone')} value={supForm.phone} onChange={(v: string) => setSupForm({ ...supForm, phone: v })} />
                    <InputField label={t('التخصص (عربي)', 'Specialty (Arabic)')} value={supForm.specialty_ar} onChange={(v: string) => setSupForm({ ...supForm, specialty_ar: v })} dir="rtl" />
                    <InputField label={t('التخصص (انجليزي)', 'Specialty (English)')} value={supForm.specialty_en} onChange={(v: string) => setSupForm({ ...supForm, specialty_en: v })} />
                  </div>
                  <div>
                    <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الحالة', 'Status')}</label>
                    <select value={supForm.status} onChange={e => setSupForm({ ...supForm, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}>
                      <option value="active">{t('نشط', 'Active')}</option>
                      <option value="inactive">{t('غير نشط', 'Inactive')}</option>
                    </select>
                  </div>
                </FormCard>
              ) : (
                <TableWrap>
                  <THead cols={['#', t('الاسم', 'Name'), t('البريد', 'Email'), t('تاريخ الإنشاء', 'Created'), t('الحالة', 'Status'), t('الإجراءات', 'Actions')]} />
                  <tbody>
                    {(supervisors as any[]).map((s: any, i: number) => (
                      <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{s.serialNo || i + 1}</td>
                        <td className={`${tdCls} text-[#062B24] font-medium`}>{isRTL ? (s.name_ar || s.name) : (s.name || s.name_ar)}</td>
                        <td className={`${tdCls} text-[#5A7A70]`}>{s.email}</td>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{s.createdAt}</td>
                        <td className={tdCls}><StatusBadge status={s.status} /></td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-1.5">
                            <ActionBtn icon={Pencil} color="#C9A24A" onClick={() => { setEditingSup(s); setSupForm({ ...s }); setSupView('form'); }} />
                            <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteSupervisor(s.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {supervisors.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-[#5A7A70] text-sm">{t('لا يوجد مشرفون.', 'No supervisors.')}</td></tr>}
                  </tbody>
                </TableWrap>
              )}
            </motion.div>
          )}

          {/* ── TEACHERS ─────────────────────────────────────────────────── */}
          {activeTab === 'teachers' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[#062B24] font-bold text-lg">{t('إدارة الأساتذة', 'Teachers Management')}</h2>
                  <p className="text-[#8B9D8A] text-xs mt-0.5">{t(`${teachers.length} أستاذ`, `${teachers.length} teacher(s)`)}</p>
                </div>
                {teacherView === 'list' && (
                  <button onClick={() => { setTeacherView('form'); setEditingTeacher(null); setTeacherForm(defaultTeacherForm); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                    <Plus size={15} /> {t('إضافة أستاذ', 'Add Teacher')}
                  </button>
                )}
              </div>
              {teacherView === 'form' ? (
                <FormCard title={editingTeacher ? t('تعديل الأستاذ', 'Edit Teacher') : t('أستاذ جديد', 'New Teacher')}
                  onClose={() => { setTeacherView('list'); setEditingTeacher(null); }} onSave={saveTeacher}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label={t('الاسم (انجليزي)', 'Name (English)')} value={teacherForm.name} onChange={(v: string) => setTeacherForm({ ...teacherForm, name: v })} />
                    <InputField label={t('الاسم (عربي)', 'Name (Arabic)')} value={teacherForm.name_ar} onChange={(v: string) => setTeacherForm({ ...teacherForm, name_ar: v })} dir="rtl" />
                    <InputField label={t('البريد الإلكتروني', 'Email')} value={teacherForm.email} onChange={(v: string) => setTeacherForm({ ...teacherForm, email: v })} type="email" />
                    <InputField label={t('رقم الهاتف', 'Phone')} value={teacherForm.phone} onChange={(v: string) => setTeacherForm({ ...teacherForm, phone: v })} />
                    <InputField label={t('التخصص (عربي)', 'Specialty (Arabic)')} value={teacherForm.specialty_ar} onChange={(v: string) => setTeacherForm({ ...teacherForm, specialty_ar: v })} dir="rtl" />
                    <InputField label={t('التخصص (انجليزي)', 'Specialty (English)')} value={teacherForm.specialty_en} onChange={(v: string) => setTeacherForm({ ...teacherForm, specialty_en: v })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('السيرة (عربي)', 'Bio (Arabic)')}</label>
                      <textarea value={teacherForm.bio_ar} onChange={e => setTeacherForm({ ...teacherForm, bio_ar: e.target.value })} rows={3} dir="rtl"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                    </div>
                    <div>
                      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('السيرة (انجليزي)', 'Bio (English)')}</label>
                      <textarea value={teacherForm.bio_en} onChange={e => setTeacherForm({ ...teacherForm, bio_en: e.target.value })} rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                    </div>
                  </div>
                </FormCard>
              ) : (
                <TableWrap>
                  <THead cols={['#', t('الاسم', 'Name'), t('البريد', 'Email'), t('التخصص', 'Specialty'), t('تاريخ الإنشاء', 'Created'), t('الإجراءات', 'Actions')]} />
                  <tbody>
                    {(teachers as any[]).map((tc: any, i: number) => (
                      <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{tc.serialNo || i + 1}</td>
                        <td className={`${tdCls} text-[#062B24] font-medium`}>{isRTL ? (tc.name_ar || tc.name) : (tc.name || tc.name_ar)}</td>
                        <td className={`${tdCls} text-[#5A7A70]`}>{tc.email}</td>
                        <td className={`${tdCls} text-[#5A7A70]`}>{t(tc.specialty_ar, tc.specialty_en)}</td>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{tc.createdAt}</td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-1.5">
                            <ActionBtn icon={Pencil} color="#C9A24A" onClick={() => { setEditingTeacher(tc); setTeacherForm({ ...tc }); setTeacherView('form'); }} />
                            <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteTeacher(tc.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {teachers.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-[#5A7A70] text-sm">{t('لا يوجد أساتذة.', 'No teachers.')}</td></tr>}
                  </tbody>
                </TableWrap>
              )}
            </motion.div>
          )}

          {/* ── LECTURES ─────────────────────────────────────────────────── */}
          {activeTab === 'lectures' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#062B24] font-bold text-lg">{t('إدارة المحاضرات', 'Lectures Management')}</h2>
                {lectureView === 'list' && (
                  <button onClick={() => { setLectureView('form'); setEditingLecture(null); setLectureForm(defaultLectureForm); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                    <Plus size={15} /> {t('محاضرة جديدة', 'New Lecture')}
                  </button>
                )}
              </div>
              
              {lectureView === 'form' ? (
                <FormCard title={editingLecture ? t('تعديل المحاضرة', 'Edit Lecture') : t('محاضرة جديدة', 'New Lecture')}
                  onClose={() => { setLectureView('list'); setEditingLecture(null); }} onSave={saveLecture}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label={t('العنوان (عربي) *', 'Title (Arabic) *')} value={lectureForm.title_ar} onChange={(v: string) => setLectureForm({ ...lectureForm, title_ar: v })} dir="rtl" />
                    <InputField label={t('العنوان (انجليزي) *', 'Title (English) *')} value={lectureForm.title_en} onChange={(v: string) => setLectureForm({ ...lectureForm, title_en: v })} />
                    <InputField label={t('المعرف (Slug)', 'Slug')} value={lectureForm.slug} onChange={(v: string) => setLectureForm({ ...lectureForm, slug: v })} />
                    <InputField label={t('السعر ($)', 'Price ($)')} value={String(lectureForm.price)} onChange={(v: string) => setLectureForm({ ...lectureForm, price: Number(v) })} type="number" />
                    <InputField label={t('عدد الدروس', 'Lessons Count')} value={String(lectureForm.lessonsCount)} onChange={(v: string) => setLectureForm({ ...lectureForm, lessonsCount: Number(v) })} type="number" />
                    <InputField label={t('المدة (مثلاً: 20 ساعة / 10 جلسات)', 'Duration (e.g. 20h / 10 sessions)')} value={lectureForm.duration} onChange={(v: string) => setLectureForm({ ...lectureForm, duration: v })} />
                  </div>
                  <div>
                    <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الوصف (عربي)', 'Description (Arabic)')}</label>
                    <textarea value={lectureForm.description_ar} onChange={e => setLectureForm({ ...lectureForm, description_ar: e.target.value })} rows={3} dir="rtl"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الحالة', 'Status')}</label>
                      <select value={lectureForm.status} onChange={e => setLectureForm({ ...lectureForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}>
                        <option value="published">{t('منشور', 'Published')}</option>
                        <option value="draft">{t('مسودة', 'Draft')}</option>
                      </select>
                    </div>
                    <div className="flex items-end pb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={lectureForm.featured} onChange={e => setLectureForm({ ...lectureForm, featured: e.target.checked })} />
                        <span className="text-[#3A5A50] text-xs font-medium">{t('محاضرة مميزة', 'Featured Lecture')}</span>
                      </label>
                    </div>
                  </div>
                </FormCard>
              ) : (
                <TableWrap>
                  <THead cols={['#', t('العنوان', 'Title'), t('السعر', 'Price'), t('الساعات', 'Hours'), t('الجلسات', 'Sessions'), t('التسجيلات', 'Enrolled'), t('الحالة', 'Status'), t('الإجراءات', 'Actions')]} />
                  <tbody>
                    {(lectures as any[]).map((lec: any, i: number) => (
                      <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{i + 1}</td>
                        <td className={`${tdCls} text-[#062B24] font-medium max-w-[180px]`}><div className="truncate">{t(lec.title_ar, lec.title_en)}</div></td>
                        <td className={`${tdCls} text-[#C9A24A] font-bold`}>${lec.price}</td>
                        <td className={`${tdCls} text-[#5A7A70]`}>{lec.duration?.split('/')[1]?.trim() || lec.duration}</td>
                        <td className={`${tdCls} text-[#5A7A70]`}>{lec.lessonsCount}</td>
                        <td className={`${tdCls} text-[#5A7A70]`}>{lec.enrolled}</td>
                        <td className={tdCls}><StatusBadge status={lec.status} /></td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-1.5">
                            <ActionBtn icon={Pencil} color="#C9A24A" onClick={() => { setEditingLecture(lec); setLectureForm({ ...lec }); setLectureView('form'); }} />
                            <ActionBtn icon={lec.status === 'published' ? EyeOff : Eye} color="#7BBFAD" onClick={() => { updateLecture(lec.id, { status: lec.status === 'published' ? 'draft' : 'published' }); toast.success(t('تم تحديث الحالة', 'Status updated')); }} />
                            <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteLecture(lec.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              )}
            </motion.div>
          )}

          {/* ── ARTICLES ─────────────────────────────────────────────────── */}
          {activeTab === 'articles' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {articleView === 'list' ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[#062B24] font-bold text-lg">{t('إدارة المقالات', 'Articles Management')}</h2>
                    <button onClick={() => { setEditingArticle(null); setArticleForm(defaultArticleForm); setArticleView('form'); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                      <Plus size={15} /> {t('مقالة جديدة', 'New Article')}
                    </button>
                  </div>
                  <TableWrap>
                    <THead cols={['#', t('العنوان', 'Title'), t('الكاتب', 'Author'), t('التاريخ', 'Date'), t('الحالة', 'Status'), t('الإجراءات', 'Actions')]} />
                    <tbody>
                      {(articles as any[]).map((art: any, i: number) => (
                        <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                          <td className={`${tdCls} text-[#8B9D8A]`}>{i + 1}</td>
                          <td className={`${tdCls} text-[#062B24] font-medium max-w-[220px]`}><div className="truncate">{t(art.title_ar, art.title_en)}</div></td>
                          <td className={`${tdCls} text-[#5A7A70]`}>{t(art.author_ar, art.author_en)}</td>
                          <td className={`${tdCls} text-[#8B9D8A]`}>{new Date(art.date).toLocaleDateString(t('ar-SA', 'en-US'))}</td>
                          <td className={tdCls}><StatusBadge status={art.status} /></td>
                          <td className={tdCls}>
                            <div className="flex items-center gap-1.5">
                              <ActionBtn icon={Eye} color="#C9A24A" onClick={() => navigate(`/articles/${art.slug}`)} />
                              <ActionBtn icon={Pencil} color="#7BBFAD" onClick={() => {
                                setEditingArticle(art);
                                setArticleForm({ ...art, tags: Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || '') });
                                setArticleView('form');
                              }} />
                              <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteArticle(art.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                </>
              ) : (
                /* Article Editor */
                <div>
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 mb-6 text-xs text-[#8B9D8A]">
                    <button onClick={() => { setArticleView('list'); setEditingArticle(null); }} className="hover:text-[#C9A24A] transition-colors flex items-center gap-1">
                      {isRTL ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                      {t('المقالات', 'Articles')}
                    </button>
                    <span>/</span>
                    <span className="text-[#3A5A50]">{editingArticle ? t('تعديل المقالة', 'Edit Article') : t('مقالة جديدة', 'New Article')}</span>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main form */}
                    <div className="xl:col-span-2 space-y-5">
                      <div className="p-6 rounded-2xl space-y-4" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                        <h3 className="text-[#062B24] font-semibold text-sm border-b border-[rgba(6,43,36,0.08)] pb-3">{t('معلومات المقالة', 'Article Information')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label={t('العنوان (عربي) *', 'Title (Arabic) *')} value={articleForm.title_ar} onChange={(v: string) => setArticleForm({ ...articleForm, title_ar: v })} dir="rtl" />
                          <InputField label={t('العنوان (انجليزي) *', 'Title (English) *')} value={articleForm.title_en} onChange={(v: string) => setArticleForm({ ...articleForm, title_en: v })} />
                          <InputField label={t('المعرف (Slug)', 'Slug')} value={articleForm.slug} onChange={(v: string) => setArticleForm({ ...articleForm, slug: v })}  />
                          <div>
                            <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('النوع', 'Type')}</label>
                            <select value={articleForm.type} onChange={e => setArticleForm({ ...articleForm, type: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }}>
                              <option value="general">{t('عام', 'General')}</option>
                              <option value="research">{t('بحثي', 'Research')}</option>
                              <option value="academic">{t('أكاديمي', 'Academic')}</option>
                              <option value="news">{t('أخبار', 'News')}</option>
                            </select>
                          </div>
                          <InputField label={t('الكاتب (عربي)', 'Author (Arabic)')} value={articleForm.author_ar} onChange={(v: string) => setArticleForm({ ...articleForm, author_ar: v })} dir="rtl" />
                          <InputField label={t('الكاتب (انجليزي)', 'Author (English)')} value={articleForm.author_en} onChange={(v: string) => setArticleForm({ ...articleForm, author_en: v })} />
                          <InputField label={t('التصنيف (عربي)', 'Category (Arabic)')} value={articleForm.category_ar} onChange={(v: string) => setArticleForm({ ...articleForm, category_ar: v })} dir="rtl" />
                          <InputField label={t('التصنيف (انجليزي)', 'Category (English)')} value={articleForm.category_en} onChange={(v: string) => setArticleForm({ ...articleForm, category_en: v })} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('المقتطف (عربي)', 'Excerpt (Arabic)')}</label>
                            <textarea value={articleForm.excerpt_ar} onChange={e => setArticleForm({ ...articleForm, excerpt_ar: e.target.value })} rows={2} dir="rtl"
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                          </div>
                          <div>
                            <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('المقتطف (انجليزي)', 'Excerpt (English)')}</label>
                            <textarea value={articleForm.excerpt_en} onChange={e => setArticleForm({ ...articleForm, excerpt_en: e.target.value })} rows={2}
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                          </div>
                        </div>
                      </div>

                      {/* Rich Text Content */}
                      <div className="p-6 rounded-2xl space-y-4" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                        <div className="flex items-center justify-between border-b border-[rgba(6,43,36,0.08)] pb-3">
                          <h3 className="text-[#062B24] font-semibold text-sm">{t('محتوى المقالة', 'Article Content')}</h3>
                          <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: 'rgba(6,43,36,0.06)' }}>
                            <button onClick={() => setArticleLang('ar')} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{ background: articleLang === 'ar' ? 'linear-gradient(135deg, #C9A24A, #D8B75B)' : 'transparent', color: articleLang === 'ar' ? BRAND.deep : '#5A7A70' }}>
                              عربي
                            </button>
                            <button onClick={() => setArticleLang('en')} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{ background: articleLang === 'en' ? 'linear-gradient(135deg, #C9A24A, #D8B75B)' : 'transparent', color: articleLang === 'en' ? BRAND.deep : '#5A7A70' }}>
                              English
                            </button>
                          </div>
                        </div>

                        {articleLang === 'ar' ? (
                          <RichTextEditor
                            key={`${editingArticle?.id || 'new'}-ar`}
                            initialValue={articleForm.content_ar}
                            onChange={v => setArticleForm((f: any) => ({ ...f, content_ar: v }))}
                            dir="rtl"
                            minHeight={280}
                          />
                        ) : (
                          <RichTextEditor
                            key={`${editingArticle?.id || 'new'}-en`}
                            initialValue={articleForm.content_en}
                            onChange={v => setArticleForm((f: any) => ({ ...f, content_en: v }))}
                            dir="ltr"
                            minHeight={280}
                          />
                        )}
                      </div>
                    </div>

                    {/* Sidebar options */}
                    <div className="space-y-5">
                      <div className="p-5 rounded-2xl space-y-4" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                        <h3 className="text-[#062B24] font-semibold text-sm border-b border-[rgba(6,43,36,0.08)] pb-3">{t('النشر', 'Publish')}</h3>
                        <div className="space-y-3">
                          <button onClick={() => saveArticle('published')}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}>
                            <Eye size={14} /> {t('نشر المقالة', 'Publish Article')}
                          </button>
                          <button onClick={() => saveArticle('draft')}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: 'rgba(6,43,36,0.08)', color: '#3A5A50' }}>
                            <Save size={14} /> {t('حفظ كمسودة', 'Save as Draft')}
                          </button>
                          <button onClick={() => { setArticleView('list'); setEditingArticle(null); }}
                            className="w-full py-2.5 rounded-xl text-sm transition-all"
                            style={{ background: 'rgba(212,24,61,0.06)', color: '#D4183D' }}>
                            {t('إلغاء', 'Cancel')}
                          </button>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl space-y-3" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                        <h3 className="text-[#062B24] font-semibold text-sm border-b border-[rgba(6,43,36,0.08)] pb-3">{t('الإعدادات', 'Settings')}</h3>
                        <InputField label={t('تاريخ النشر', 'Publish Date')} value={articleForm.date} onChange={(v: string) => setArticleForm({ ...articleForm, date: v })} type="date" />
                        <InputField label={t('وقت القراءة (دقيقة)', 'Read Time (min)')} value={String(articleForm.readTime)} onChange={(v: string) => setArticleForm({ ...articleForm, readTime: Number(v) })} type="number" />
                        <div>
                          <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الكلمات المفتاحية', 'Tags (comma separated)')}</label>
                          <input value={articleForm.tags} onChange={e => setArticleForm({ ...articleForm, tags: e.target.value })}
                            placeholder="symbolism, semiotics, research"
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                            style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div className="relative" onClick={() => setArticleForm({ ...articleForm, featured: !articleForm.featured })}>
                            <div className={`w-10 h-5 rounded-full transition-all ${articleForm.featured ? '' : ''}`}
                              style={{ background: articleForm.featured ? 'linear-gradient(135deg, #C9A24A, #D8B75B)' : 'rgba(6,43,36,0.1)' }} />
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${articleForm.featured ? 'start-5' : 'start-0.5'}`} />
                          </div>
                          <span className="text-[#3A5A50] text-xs font-medium">{t('مقالة مميزة', 'Featured Article')}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── AREAS OF STUDY ───────────────────────────────────────────── */}
          {activeTab === 'areas' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#062B24] font-bold text-lg">{t('مجالات الدراسة', 'Areas of Study')}</h2>
                {areaView === 'list' && (
                  <button onClick={() => { setAreaView('form'); setEditingArea(null); setAreaForm(defaultAreaForm); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                    <Plus size={15} /> {t('إضافة مجال', 'Add Area')}
                  </button>
                )}
              </div>
              
              {areaView === 'form' ? (
                <FormCard title={editingArea ? t('تعديل المجال', 'Edit Area') : t('إضافة مجال', 'Add Area')}
                  onClose={() => { setAreaView('list'); setEditingArea(null); }} onSave={saveArea}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label={t('الاسم (عربي) *', 'Name (Arabic) *')} value={areaForm.name_ar} onChange={(v: string) => setAreaForm({ ...areaForm, name_ar: v })} dir="rtl" />
                    <InputField label={t('الاسم (انجليزي) *', 'Name (English) *')} value={areaForm.name_en} onChange={(v: string) => setAreaForm({ ...areaForm, name_en: v })} />
                    <InputField label={t('الترتيب', 'Order')} value={String(areaForm.order)} onChange={(v: string) => setAreaForm({ ...areaForm, order: Number(v) })} type="number" />
                    <div>
                      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الحالة', 'Status')}</label>
                      <select value={areaForm.status} onChange={e => setAreaForm({ ...areaForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}>
                        <option value="published">{t('منشور', 'Published')}</option>
                        <option value="draft">{t('مسودة', 'Draft')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الوصف (عربي)', 'Description (Arabic)')}</label>
                    <textarea value={areaForm.description_ar} onChange={e => setAreaForm({ ...areaForm, description_ar: e.target.value })} rows={3} dir="rtl"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                  </div>
                  <div>
                    <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الوصف (انجليزي)', 'Description (English)')}</label>
                    <textarea value={areaForm.description_en} onChange={e => setAreaForm({ ...areaForm, description_en: e.target.value })} rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                  </div>
                </FormCard>
              ) : (
                <TableWrap>
                  <THead cols={['#', t('الاسم', 'Name'), t('الوصف', 'Description'), t('الترتيب', 'Order'), t('الحالة', 'Status'), t('الإجراءات', 'Actions')]} />
                  <tbody>
                    {(areasOfStudy as any[]).map((area: any, i: number) => (
                      <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{i + 1}</td>
                        <td className={`${tdCls} text-[#062B24] font-medium`}>{t(area.name_ar, area.name_en)}</td>
                        <td className={`${tdCls} text-[#5A7A70] max-w-[250px]`}><div className="truncate">{t(area.description_ar, area.description_en)}</div></td>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{area.order}</td>
                        <td className={tdCls}><StatusBadge status={area.status} /></td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-1.5">
                            <ActionBtn icon={Pencil} color="#C9A24A" onClick={() => { setEditingArea(area); setAreaForm({ ...area }); setAreaView('form'); }} />
                            <ActionBtn icon={area.status === 'published' ? EyeOff : Eye} color="#7BBFAD" onClick={() => { updateAreaOfStudy(area.id, { status: area.status === 'published' ? 'draft' : 'published' }); toast.success(t('تم التحديث', 'Updated')); }} />
                            <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteAreaOfStudy(area.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              )}
            </motion.div>
          )}

          {/* ── PACKAGES ─────────────────────────────────────────────────── */}
          {activeTab === 'packages' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[#062B24] font-bold text-lg">{t('إدارة الباقات', 'Packages Management')}</h2>
                  <p className="text-[#8B9D8A] text-xs mt-0.5">{t(`${packages.length} باقة`, `${packages.length} package(s)`)}</p>
                </div>
                {pkgView === 'list' && (
                  <button onClick={() => { setPkgView('form'); setEditingPkg(null); setPkgForm(defaultPkgForm); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                    <Plus size={15} /> {t('باقة جديدة', 'New Package')}
                  </button>
                )}
              </div>
              {pkgView === 'form' ? (
                <FormCard title={editingPkg ? t('تعديل الباقة', 'Edit Package') : t('باقة جديدة', 'New Package')}
                  onClose={() => { setPkgView('list'); setEditingPkg(null); }} onSave={savePackage}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label={t('الاسم (عربي)', 'Name (Arabic)')} value={pkgForm.name_ar} onChange={(v: string) => setPkgForm({ ...pkgForm, name_ar: v })} dir="rtl" />
                    <InputField label={t('الاسم (انجليزي)', 'Name (English)')} value={pkgForm.name_en} onChange={(v: string) => setPkgForm({ ...pkgForm, name_en: v })} />
                    <InputField label={t('السعر ($)', 'Price ($)')} value={String(pkgForm.price)} onChange={(v: string) => setPkgForm({ ...pkgForm, price: Number(v) })} type="number" />
                    <InputField label={t('المدة (أيام)', 'Duration (days)')} value={String(pkgForm.duration_days)} onChange={(v: string) => setPkgForm({ ...pkgForm, duration_days: Number(v) })} type="number" />
                  </div>
                  <div>
                    <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الحالة', 'Status')}</label>
                    <select value={pkgForm.status} onChange={e => setPkgForm({ ...pkgForm, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}>
                      <option value="active">{t('نشط', 'Active')}</option>
                      <option value="inactive">{t('غير نشط', 'Inactive')}</option>
                    </select>
                  </div>
                </FormCard>
              ) : (
                <TableWrap>
                  <THead cols={['#', t('الاسم', 'Name'), t('السعر', 'Price'), t('المدة (أيام)', 'Duration (days)'), t('الحالة', 'Status'), t('الإجراءات', 'Actions')]} />
                  <tbody>
                    {(packages as any[]).map((pkg: any, i: number) => (
                      <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{pkg.serialNo || i + 1}</td>
                        <td className={`${tdCls} text-[#062B24] font-medium`}>{t(pkg.name_ar, pkg.name_en)}</td>
                        <td className={`${tdCls} text-[#C9A24A] font-bold`}>{pkg.price === 0 ? t('مجاني', 'Free') : `$${pkg.price}`}</td>
                        <td className={`${tdCls} text-[#5A7A70]`}>{pkg.duration_days}</td>
                        <td className={tdCls}><StatusBadge status={pkg.status} /></td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-1.5">
                            <ActionBtn icon={Pencil} color="#C9A24A" onClick={() => { setEditingPkg(pkg); setPkgForm({ ...pkg }); setPkgView('form'); }} />
                            <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deletePackage(pkg.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {packages.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-[#5A7A70] text-sm">{t('لا توجد باقات.', 'No packages.')}</td></tr>}
                  </tbody>
                </TableWrap>
              )}
            </motion.div>
          )}

          {/* ── SUBSCRIPTIONS ────────────────────────────────────────────── */}
          {activeTab === 'subscriptions' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#062B24] font-bold text-lg">{t('إدارة الاشتراكات', 'Subscriptions Management')}</h2>
              </div>
              {subscriptions.length === 0 ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                  <CalendarDays size={44} className="text-[#C9A24A] mx-auto mb-3 opacity-40" />
                  <p className="text-[#5A7A70] font-medium mb-1">{t('لا توجد اشتراكات حتى الآن', 'No subscriptions yet')}</p>
                  <p className="text-[#8B9D8A] text-xs">{t('ستظهر اشتراكات الطلاب هنا عند اشتراكهم في باقة.', 'Student subscriptions will appear here when they subscribe to a package.')}</p>
                </div>
              ) : (
                <TableWrap>
                  <THead cols={['#', t('المستخدم', 'User'), t('الباقة', 'Package'), t('تاريخ البداية', 'Start'), t('تاريخ الانتهاء', 'End'), t('الحالة', 'Status'), t('الإجراءات', 'Actions')]} />
                  <tbody>
                    {(subscriptions as any[]).map((sub: any, i: number) => {
                      const u = (users as any[]).find((us: any) => us.id === sub.userId);
                      const pkg = (packages as any[]).find((p: any) => p.id === sub.packageId);
                      return (
                        <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                          <td className={`${tdCls} text-[#8B9D8A]`}>{i + 1}</td>
                          <td className={`${tdCls} text-[#062B24] font-medium`}>{u?.name || sub.userId}</td>
                          <td className={`${tdCls} text-[#5A7A70]`}>{pkg ? t(pkg.name_ar, pkg.name_en) : sub.packageId}</td>
                          <td className={`${tdCls} text-[#8B9D8A]`}>{sub.startDate}</td>
                          <td className={`${tdCls} text-[#8B9D8A]`}>{sub.endDate}</td>
                          <td className={tdCls}><StatusBadge status={sub.status || 'active'} /></td>
                          <td className={tdCls}>
                            <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteSubscription(sub.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableWrap>
              )}
            </motion.div>
          )}

          {/* ── PAYMENTS ─────────────────────────────────────────────────── */}
          {activeTab === 'payments' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[#062B24] font-bold text-lg">{t('سجل المدفوعات', 'Payment Records')}</h2>
                  <p className="text-[#8B9D8A] text-xs mt-0.5">{t('إجمالي الإيرادات:', 'Total Revenue:')} <span className="text-[#C9A24A] font-bold">${(enrollments as any[]).reduce((s: number, e: any) => s + (e.amount || 0), 0)}</span></p>
                </div>
              </div>
              <TableWrap>
                <THead cols={['#', t('المستخدم', 'User'), t('المحاضرة', 'Course'), t('المبلغ', 'Amount'), t('المعاملة', 'Transaction'), t('التاريخ', 'Date'), t('الحالة', 'Status')]} />
                <tbody>
                  {(enrollments as any[]).map((enr: any, i: number) => {
                    const u = (users as any[]).find((us: any) => us.id === enr.userId);
                    const lec = (lectures as any[]).find((l: any) => l.id === enr.courseId);
                    return (
                      <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{i + 1}</td>
                        <td className={`${tdCls} text-[#062B24] font-medium`}>{u?.name || '-'}</td>
                        <td className={`${tdCls} text-[#5A7A70] max-w-[140px]`}><div className="truncate">{lec ? t(lec.title_ar, lec.title_en) : '-'}</div></td>
                        <td className={`${tdCls} text-[#C9A24A] font-bold`}>${enr.amount}</td>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{enr.transactionId || '-'}</td>
                        <td className={`${tdCls} text-[#8B9D8A]`}>{new Date(enr.createdAt).toLocaleDateString(t('ar-SA', 'en-US'))}</td>
                        <td className={tdCls}><StatusBadge status={enr.paymentStatus === 'paid' ? 'approved' : enr.paymentStatus} /></td>
                      </tr>
                    );
                  })}
                  {enrollments.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-[#5A7A70] text-sm">{t('لا توجد مدفوعات.', 'No payments.')}</td></tr>}
                </tbody>
              </TableWrap>
            </motion.div>
          )}

          {/* ── USERS ────────────────────────────────────────────────────── */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-[#062B24] font-bold text-lg mb-6">{t('إدارة المستخدمين', 'User Management')}</h2>
              <TableWrap>
                <THead cols={['#', t('الاسم', 'Name'), t('البريد', 'Email'), t('الدور', 'Role'), t('الدولة', 'Country'), t('الإجراءات', 'Actions')]} />
                <tbody>
                  {(users as any[]).map((user: any, i: number) => (
                    <tr key={i} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                      <td className={`${tdCls} text-[#8B9D8A]`}>{i + 1}</td>
                      <td className={`${tdCls} text-[#062B24] font-medium`}>{user.name}</td>
                      <td className={`${tdCls} text-[#5A7A70]`}>{user.email}</td>
                      <td className={tdCls}>
                        <span className="px-2 py-1 rounded-full text-xs" style={{ background: user.role === 'admin' ? 'rgba(201,162,74,0.15)' : 'rgba(74,139,122,0.15)', color: user.role === 'admin' ? '#C9A24A' : '#4A8B7A' }}>
                          {user.role === 'admin' ? t('مشرف', 'Admin') : t('طالب', 'Student')}
                        </span>
                      </td>
                      <td className={`${tdCls} text-[#8B9D8A]`}>{user.country || '-'}</td>
                      <td className={tdCls}>
                        <div className="flex items-center gap-1.5">
                          <ActionBtn icon={Eye} color="#7BBFAD" onClick={() => { setSelectedUser(user); setUserModalOpen(true); }} />
                          <ActionBtn icon={Pencil} color="#C9A24A" onClick={() => toast.info(t('ميزة التعديل قيد التطوير', 'Edit feature in development'))} />
                          {user.role !== 'admin' && <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteUser(user.id); toast.success(t('تم الحذف', 'Deleted')); } }} />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            </motion.div>
          )}

          {/* ── ENROLLMENTS ──────────────────────────────────────────────── */}
          {activeTab === 'enrollments' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-[#062B24] font-bold text-lg mb-6">{t('إدارة التسجيلات', 'Enrollment Management')}</h2>
              <TableWrap>
                <THead cols={[t('المستخدم', 'User'), t('المحاضرة', 'Lecture'), t('المبلغ', 'Amount'), t('طريقة الدفع', 'Payment'), t('الحالة', 'Status'), t('الإجراءات', 'Actions')]} />
                <tbody>
                  {(enrollments as any[]).map((enr: any, i: number) => {
                    const u = (users as any[]).find((us: any) => us.id === enr.userId);
                    const lec = (lectures as any[]).find((l: any) => l.id === enr.courseId);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <td className={`${tdCls} text-[#062B24] font-medium`}>{enr.userName || u?.name || '-'}</td>
                        <td className={`${tdCls} text-[#5A7A70] max-w-[150px]`}><div className="truncate">{enr.courseTitle || (lec ? t(lec.title_ar, lec.title_en) : '-')}</div></td>
                        <td className={`${tdCls} text-[#C9A24A] font-bold`}>${enr.amount}</td>
                        <td className={`${tdCls} text-[#5A7A70] text-xs`}>
                          <div className="flex items-center gap-1">
                            {enr.paymentMethod === 'card' && <CreditCard size={12} />}
                            {enr.paymentMethod === 'ibanking' && <Building2 size={12} />}
                            {enr.paymentMethod === 'bank_transfer' && <Landmark size={12} />}
                            <span className="capitalize">{enr.paymentMethod?.replace('_', ' ') || t('غير معروف', 'Unknown')}</span>
                          </div>
                        </td>
                        <td className={tdCls}><StatusBadge status={enr.enrollmentStatus} /></td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-1.5">
                            {enr.enrollmentStatus !== 'approved' && (
                              <ActionBtn 
                                icon={Check} 
                                color="#4A8B7A" 
                                onClick={() => { 
                                  updateEnrollment(enr.id, { enrollmentStatus: 'approved', paymentStatus: 'paid' }); 
                                  addNotification({
                                    userId: enr.userId,
                                    title_ar: 'تم تفعيل المحاضرة',
                                    title_en: 'Lecture Activated',
                                    message_ar: `تمت الموافقة على طلب اشتراكك في: ${enr.courseTitle || (lec ? t(lec.title_ar, lec.title_en) : '')}. يمكنك الآن البدء بالمشاهدة.`,
                                    message_en: `Your enrollment for ${enr.courseTitle || (lec ? t(lec.title_ar, lec.title_en) : '')} has been approved. You can start watching now.`,
                                    type: 'success',
                                    link: '/dashboard'
                                  });
                                  toast.success(t('تمت الموافقة وتفعيل المحاضرة', 'Approved and Lecture Activated')); 
                                }} 
                              />
                            )}
                            {enr.enrollmentStatus !== 'rejected' && <ActionBtn icon={X} color="#D4183D" onClick={() => { updateEnrollment(enr.id, { enrollmentStatus: 'rejected' }); toast.success(t('تم الرفض', 'Rejected')); }} />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {enrollments.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-[#5A7A70] text-sm">{t('لا توجد تسجيلات.', 'No enrollments.')}</td></tr>}
                </tbody>
              </TableWrap>
            </motion.div>
          )}

          {/* ── MESSAGES ─────────────────────────────────────────────────── */}
          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-[#062B24] font-bold text-lg mb-6">{t('رسائل التواصل', 'Contact Messages')}</h2>
              <div className="space-y-4">
                {(contactMessages as any[]).map((msg: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#062B24] font-semibold text-sm">{msg.name}</span>
                          <StatusBadge status={msg.status} />
                        </div>
                        <div className="text-[#8B9D8A] text-xs mt-1">{msg.email} · {msg.phone}</div>
                      </div>
                      <div className="text-[#8B9D8A] text-xs shrink-0">{new Date(msg.date).toLocaleDateString(t('ar-SA', 'en-US'))}</div>
                    </div>
                    <div className="text-[#3A5A50] font-medium text-sm mb-2">{t(msg.subject_ar, msg.subject_en)}</div>
                    <p className="text-[#5A7A70] text-xs leading-relaxed mb-4">{t(msg.message_ar, msg.message_en)}</p>
                    <div className="flex items-center gap-2">
                      {msg.status === 'new' && (
                        <button onClick={() => { updateContactMessage(msg.id, { status: 'replied' }); toast.success(t('تم تحديث الحالة', 'Status updated')); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                          style={{ background: 'rgba(201,162,74,0.12)', color: BRAND.gold, border: '1px solid rgba(201,162,74,0.3)' }}>
                          <Check size={12} /> {t('تحديد كمُرَد عليه', 'Mark as Replied')}
                        </button>
                      )}
                      <a href={`mailto:${msg.email}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                        style={{ background: 'rgba(6,43,36,0.06)', color: BRAND.deep, border: '1px solid rgba(6,43,36,0.12)' }}>
                        {t('الرد بالبريد', 'Reply via Email')}
                      </a>
                    </div>
                  </div>
                ))}
                {contactMessages.length === 0 && (
                  <div className="text-center py-16 rounded-2xl" style={{ background: 'white' }}>
                    <MessageSquare size={40} className="text-[#C9A24A] mx-auto mb-3 opacity-40" />
                    <p className="text-[#5A7A70]">{t('لا توجد رسائل.', 'No messages.')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
          {activeTab === 'testimonials' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#062B24] font-bold text-lg">{t('إدارة التقييمات', 'Testimonials Management')}</h2>
                {testimonialView === 'list' && (
                  <button onClick={() => { setTestimonialView('form'); setEditingTestimonial(null); setTestimonialForm(defaultTestimonialForm); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                    <Plus size={15} /> {t('تقييم جديد', 'New Testimonial')}
                  </button>
                )}
              </div>
              
              {testimonialView === 'form' ? (
                <FormCard title={editingTestimonial ? t('تعديل التقييم', 'Edit Testimonial') : t('إضافة تقييم', 'Add Testimonial')}
                  onClose={() => { setTestimonialView('list'); setEditingTestimonial(null); }} onSave={saveTestimonial}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label={t('الاسم *', 'Name *')} value={testimonialForm.name} onChange={(v: string) => setTestimonialForm({ ...testimonialForm, name: v })} />
                    <InputField label={t('الاسم (انجليزي)', 'Name (English)')} value={testimonialForm.name_en} onChange={(v: string) => setTestimonialForm({ ...testimonialForm, name_en: v })} />
                    <InputField label={t('الدولة (عربي)', 'Country (Arabic)')} value={testimonialForm.country_ar} onChange={(v: string) => setTestimonialForm({ ...testimonialForm, country_ar: v })} dir="rtl" />
                    <InputField label={t('الدولة (انجليزي)', 'Country (English)')} value={testimonialForm.country_en} onChange={(v: string) => setTestimonialForm({ ...testimonialForm, country_en: v })} />
                    <InputField label={t('التقييم (1-5)', 'Rating (1-5)')} value={String(testimonialForm.rating)} onChange={(v: string) => setTestimonialForm({ ...testimonialForm, rating: Number(v) })} type="number" />
                    <div>
                      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الحالة', 'Status')}</label>
                      <select value={testimonialForm.status} onChange={e => setTestimonialForm({ ...testimonialForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}>
                        <option value="published">{t('منشور', 'Published')}</option>
                        <option value="draft">{t('مسودة', 'Draft')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الرسالة (عربي) *', 'Message (Arabic) *')}</label>
                      <textarea value={testimonialForm.message_ar} onChange={e => setTestimonialForm({ ...testimonialForm, message_ar: e.target.value })} rows={3} dir="rtl"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                    </div>
                    <div>
                      <label className="block text-[#5A7A70] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الرسالة (انجليزي)', 'Message (English)')}</label>
                      <textarea value={testimonialForm.message_en} onChange={e => setTestimonialForm({ ...testimonialForm, message_en: e.target.value })} rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E', fontFamily }} />
                    </div>
                  </div>
                </FormCard>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(testimonials as any[]).map((item: any, i: number) => (
                    <div key={i} className="p-5 rounded-2xl relative group" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                      <div className="absolute top-4 end-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionBtn icon={Pencil} color="#C9A24A" onClick={() => { setEditingTestimonial(item); setTestimonialForm({ ...item }); setTestimonialView('form'); }} />
                        <ActionBtn icon={Trash2} color="#D4183D" onClick={() => { if (confirm(t('هل أنت متأكد؟', 'Are you sure?'))) { deleteTestimonial(item.id); toast.success(t('تم الحذف', 'Deleted')); } }} />
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: 'rgba(201,162,74,0.15)', color: BRAND.gold }}>
                          {(isRTL ? item.name : (item.name_en || item.name)).charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[#062B24] text-sm font-semibold truncate">{isRTL ? item.name : (item.name_en || item.name)}</div>
                          <div className="text-[#8B9D8A] text-xs">{t(item.country_ar, item.country_en)}</div>
                        </div>
                        <div className="ms-auto flex items-center gap-0.5 shrink-0">
                          {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= item.rating ? '#C9A24A' : 'none'} className="text-[#C9A24A]" />)}
                        </div>
                      </div>
                      <p className="text-[#5A7A70] text-xs leading-relaxed mb-3 italic">"{t(item.message_ar, item.message_en)}"</p>
                      <StatusBadge status={item.status} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── SETTINGS ─────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#062B24] font-bold text-lg">{t('إعدادات الموقع', 'Site Settings')}</h2>
                {!editingSettings ? (
                  <button onClick={() => { setSettingsForm({ ...settings }); setEditingSettings(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                    <Pencil size={14} /> {t('تعديل', 'Edit')}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => { updateSettings(settingsForm); setEditingSettings(false); toast.success(t('تم حفظ الإعدادات', 'Settings saved')); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep }}>
                      <Check size={14} /> {t('حفظ', 'Save')}
                    </button>
                    <button onClick={() => setEditingSettings(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                      style={{ background: 'rgba(212,24,61,0.1)', color: '#D4183D' }}>
                      <X size={14} /> {t('إلغاء', 'Cancel')}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {[
                  { key: 'announcement_ar', key2: 'announcement_en', label_ar: 'نص الإعلان', label_en: 'Announcement Text' },
                  { key: 'heroTitle_ar', key2: 'heroTitle_en', label_ar: 'عنوان الهيرو', label_en: 'Hero Title' },
                  { key: 'heroSubtitle_ar', key2: 'heroSubtitle_en', label_ar: 'العنوان الفرعي', label_en: 'Hero Subtitle' },
                  { key: 'aboutText_ar', key2: 'aboutText_en', label_ar: 'نص عن الأكاديمية', label_en: 'About Text' },
                  { key: 'vision_ar', key2: 'vision_en', label_ar: 'الرؤية', label_en: 'Vision' },
                  { key: 'mission_ar', key2: 'mission_en', label_ar: 'الرسالة', label_en: 'Mission' },
                  { key: 'phone1', key2: 'email', label_ar: 'هاتف 1', label_en: 'Phone 1' },
                ].map((field, i) => (
                  <div key={i} className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                    <label className="block text-[#3A5A50] text-xs font-semibold mb-3 uppercase tracking-wide">{t(field.label_ar, field.label_en)}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[#8B9D8A] text-xs mb-1 block">{t('عربي', 'Arabic')}</label>
                        <input disabled={!editingSettings} value={(settingsForm as any)[field.key] || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, [field.key]: e.target.value })}
                          dir="rtl"
                          className="w-full px-3 py-2.5 rounded-xl text-xs text-[#1E1E1E] outline-none"
                          style={{ background: editingSettings ? '#F8F4EA' : 'rgba(6,43,36,0.03)', border: '1.5px solid rgba(6,43,36,0.1)', fontFamily }} />
                      </div>
                      <div>
                        <label className="text-[#8B9D8A] text-xs mb-1 block">{t('إنجليزي', 'English')}</label>
                        <input disabled={!editingSettings} value={(settingsForm as any)[field.key2] || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, [field.key2]: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl text-xs text-[#1E1E1E] outline-none"
                          style={{ background: editingSettings ? '#F8F4EA' : 'rgba(6,43,36,0.03)', border: '1.5px solid rgba(6,43,36,0.1)', fontFamily }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>

      <AnimatePresence>
        {userModalOpen && selectedUser && (
          <Modal title={t('تفاصيل المستخدم', 'User Details')} onClose={() => setUserModalOpen(false)}>
            <div className="space-y-6">
              <div className="flex items-center gap-5 p-5 rounded-2xl" style={{ background: 'rgba(6,43,36,0.04)', border: '1px solid rgba(6,43,36,0.08)' }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep }}>
                  {selectedUser.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-[#062B24] font-bold text-xl">{selectedUser.name}</h4>
                  <div className="text-[#5A7A70] text-sm">{selectedUser.email}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(201,162,74,0.15)', color: BRAND.gold }}>
                      {selectedUser.role}
                    </span>
                    <span className="text-[#8B9D8A] text-xs">Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border" style={{ borderColor: 'rgba(6,43,36,0.08)' }}>
                  <div className="text-[#8B9D8A] text-[10px] font-bold uppercase mb-1">{t('الدولة', 'Country')}</div>
                  <div className="text-[#062B24] font-medium">{selectedUser.country || '-'}</div>
                </div>
                <div className="p-4 rounded-2xl border" style={{ borderColor: 'rgba(6,43,36,0.08)' }}>
                  <div className="text-[#8B9D8A] text-[10px] font-bold uppercase mb-1">{t('رقم الهاتف', 'Phone')}</div>
                  <div className="text-[#062B24] font-medium">{selectedUser.phone || '-'}</div>
                </div>
              </div>

              <div>
                <h5 className="text-[#062B24] font-bold text-sm mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-[#C9A24A]" />
                  {t('المحاضرات المسجلة', 'Enrolled Courses')}
                </h5>
                <div className="space-y-2">
                  {(enrollments as any[]).filter(e => e.userId === selectedUser.id).length === 0 ? (
                    <div className="p-5 text-center text-[#8B9D8A] text-xs bg-white rounded-xl border border-dashed border-[rgba(6,43,36,0.1)]">
                      {t('لا توجد محاضرات مسجلة لهذا المستخدم.', 'No enrolled courses for this user.')}
                    </div>
                  ) : (
                    (enrollments as any[]).filter(e => e.userId === selectedUser.id).map((enr, i) => {
                      const lec = (lectures as any[]).find(l => l.id === enr.courseId);
                      return (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border" style={{ borderColor: 'rgba(6,43,36,0.06)' }}>
                          <div>
                            <div className="text-[#062B24] text-xs font-semibold">{lec ? t(lec.title_ar, lec.title_en) : enr.courseId}</div>
                            <div className="text-[10px] text-[#8B9D8A] mt-0.5">{new Date(enr.createdAt).toLocaleDateString()}</div>
                          </div>
                          <StatusBadge status={enr.enrollmentStatus} />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
