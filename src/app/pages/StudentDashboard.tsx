import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard, BookOpen, Award, CreditCard, MessageSquare,
  User, LogOut, Clock, CheckCircle2, Play, Star, ChevronRight,
  Home, Bell, Search, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import CertificateModal from '../components/CertificateModal';
import { GeometricBackground } from '../components/GeometricBackground';
import { Skeleton } from '../components/Skeleton';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

export default function StudentDashboard() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { currentUser, logout } = useAuth();
  const { lectures, enrollments, notifications, markNotificationAsRead, clearAllNotifications, loading } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    nameAr: currentUser?.name_ar || '',
    phone: currentUser?.phone || '',
    country: currentUser?.country || '',
    language: currentUser?.language || 'ar' as 'ar' | 'en'
  });
  const { updateProfile } = useAuth();
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{ courseName: string, date: string } | null>(null);

  // Handle immediate redirect if logged out
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleLogout = () => {
    setIsNavigating(true);
    logout();
    navigate('/', { replace: true });
  };

  const handleProfileSave = async () => {
    const result = await updateProfile(profileForm);
    if (result.success) {
      toast.success(t('تم تحديث الملف الشخصي بنجاح', 'Profile updated successfully'));
      setIsEditing(false);
    } else {
      toast.error(t('فشل تحديث الملف الشخصي', 'Failed to update profile'));
    }
  };

  if (!currentUser || isNavigating) {
    if (!isNavigating && !currentUser) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: BRAND.ivory, fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="text-center">
            <p className="text-[#5A7A70] mb-4">{t('يجب تسجيل الدخول أولاً', 'Please log in first')}</p>
            <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep }}>
              {t('تسجيل الدخول', 'Log In')}
            </Link>
          </div>
        </div>
      );
    }
    return <div className="min-h-screen" style={{ background: BRAND.ivory }} />;
  }

  const myEnrollments = (enrollments as any[]).filter((e: any) => e.userId === currentUser.id);
  const allMyCourses = myEnrollments.map((enr: any) => {
    const lecture = (lectures as any[]).find((l: any) => l.id === enr.courseId);
    return { ...enr, lecture };
  }).filter((e: any) => e.lecture);

  const myCourses = allMyCourses.filter((c: any) => c.enrollmentStatus === 'approved');
  const pendingCourses = allMyCourses.filter((c: any) => c.enrollmentStatus === 'pending');

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label_ar: 'نظرة عامة', label_en: 'Overview' },
    { id: 'courses', icon: BookOpen, label_ar: 'محاضراتي', label_en: 'My Lectures' },
    { id: 'certificates', icon: Award, label_ar: 'الشهادات', label_en: 'Certificates' },
    { id: 'payments', icon: CreditCard, label_ar: 'المدفوعات', label_en: 'Payments' },
    { id: 'profile', icon: User, label_ar: 'الملف الشخصي', label_en: 'Profile' },
    { id: 'support', icon: MessageSquare, label_ar: 'الدعم', label_en: 'Support' },
  ];

  const stats = [
    { icon: BookOpen, label_ar: 'محاضراتي', label_en: 'My Lectures', value: myCourses.length, color: '#C9A24A' },
    { icon: CheckCircle2, label_ar: 'مكتملة', label_en: 'Completed', value: myEnrollments.filter((e: any) => e.enrollmentStatus === 'approved').length, color: '#4A8B7A' },
    { icon: Award, label_ar: 'الشهادات', label_en: 'Certificates', value: myCourses.filter((c: any) => c.lecture?.certificate).length, color: '#D8B75B' },
    { icon: Star, label_ar: 'نقاط التقدم', label_en: 'Progress Points', value: '85%', color: '#7BBFAD' },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo / Academy Branding */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(201,162,74,0.2)' }}>
        <Link to="/" className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm" style={{ background: '#062B24', border: '1px solid rgba(201,162,74,0.3)' }}>
            <img src="/symbolacademy.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[#F0D98A] text-xs font-bold">{t('الأكاديمية العليا للرموز', 'The Higher Academy of Symbols')}</div>
            <div className="text-[#6B8B80] text-[10px]">{t('لوحة الطالب', 'Student Panel')}</div>
          </div>
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(201,162,74,0.08)', border: '1px solid rgba(201,162,74,0.2)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', boxShadow: '0 2px 0 #8B6B20', color: BRAND.deep }}>
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-[#F0D98A] text-xs font-semibold truncate">{currentUser.name}</div>
            <div className="text-[#6B8B80] text-[10px] truncate">{currentUser.email}</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="p-3 flex-1">
        {navItems.map(item => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-1 transition-all text-start ${activeTab === item.id ? 'text-[#F0D98A]' : 'text-[#8B9D8A] hover:text-[#E8DDC7]'}`}
              style={{ background: activeTab === item.id ? 'rgba(201,162,74,0.15)' : 'transparent' }}
            >
              <IconComp size={16} className={activeTab === item.id ? 'text-[#C9A24A]' : ''} />
              {t(item.label_ar, item.label_en)}
              {activeTab === item.id && (
                <ChevronRight size={12} className="ms-auto text-[#C9A24A]" style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(201,162,74,0.15)' }}>
        <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#8B9D8A] hover:text-[#E8DDC7] transition-all">
          <Home size={14} />
          {t('العودة للموقع', 'Back to Site')}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#8B9D8A] hover:text-[#E8DDC7] transition-all text-start"
        >
          <LogOut size={14} />
          {t('تسجيل الخروج', 'Logout')}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#F0EDE5', fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 min-h-screen sticky top-0 overflow-hidden"
        style={{ background: `linear-gradient(175deg, ${BRAND.deep}, ${BRAND.mid})`, borderInlineEnd: '1px solid rgba(201,162,74,0.2)' }}
      >
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 start-0 w-72 min-h-screen z-50 flex flex-col lg:hidden overflow-hidden"
              style={{ background: `linear-gradient(175deg, ${BRAND.deep}, ${BRAND.mid})` }}
            >
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
              <div className="relative z-10 flex flex-col h-full">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 end-4 text-[#8B9D8A] hover:text-[#E8DDC7]"
                >
                  <X size={20} />
                </button>
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 lg:px-8"
          style={{ background: 'rgba(240,237,229,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(6,43,36,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(6,43,36,0.06)' }}
            >
              <Menu size={18} className="text-[#062B24]" />
            </button>
            <div>
              <h2 className="text-[#062B24] text-sm font-semibold">
                {navItems.find(i => i.id === activeTab) ? t(navItems.find(i => i.id === activeTab)!.label_ar, navItems.find(i => i.id === activeTab)!.label_en) : ''}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all hover:bg-[rgba(6,43,36,0.1)]"
                style={{ background: 'rgba(6,43,36,0.06)' }}
              >
                <Bell size={16} className="text-[#3A5A50]" />
                {notifications.filter(n => (n.userId === currentUser.id || n.userId === 'all') && n.status === 'unread').length > 0 && (
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
                        <h3 className="text-sm font-bold text-[#062B24]">{t('التنبيهات', 'Notifications')}</h3>
                        <button
                          onClick={() => clearAllNotifications(currentUser.id)}
                          className="text-[10px] text-[#C9A24A] hover:underline"
                        >
                          {t('مسح الكل', 'Clear All')}
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.filter(n => n.userId === currentUser.id || n.userId === 'all').length === 0 ? (
                          <div className="p-8 text-center text-[#8B9D8A] text-xs">
                            {t('لا توجد تنبيهات حالياً', 'No notifications yet')}
                          </div>
                        ) : (
                          notifications.filter(n => n.userId === currentUser.id || n.userId === 'all').map((n, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                if (n.id) markNotificationAsRead(n.id);
                                if (n.link) navigate(n.link);
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
                                    {new Date(n.createdAt).toLocaleTimeString(t('ar-SA', 'en-US'), { hour: '2-digit', minute: '2-digit' })}
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

        {/* Page Content */}
        <div className="flex-1 p-5 lg:p-8 overflow-auto">

          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h1 className="text-[#062B24] font-bold" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>
                  {t(`أهلاً، ${currentUser.name.split(' ')[0]} 👋`, `Welcome back, ${currentUser.name.split(' ')[0]} 👋`)}
                </h1>
                <p className="text-[#5A7A70] text-sm mt-1">{t('هذا ملخص نشاطك الأكاديمي', 'Here\'s your academic activity summary')}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton.Base key={i} theme="light" className="h-28 w-full rounded-2xl" />
                  ))
                ) : (
                  stats.map((stat, i) => {
                    const IconComp = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-5 rounded-2xl"
                        style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}20` }}>
                          <IconComp size={18} style={{ color: stat.color }} />
                        </div>
                        <div className="text-[#062B24] font-bold text-2xl">{stat.value}</div>
                        <div className="text-[#8B9D8A] text-xs mt-0.5">{t(stat.label_ar, stat.label_en)}</div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Pending Approval Section */}
              {pendingCourses.length > 0 && (
                <div className="p-6 rounded-2xl mb-6" style={{ background: 'white', border: '1px solid rgba(201,162,74,0.15)', boxShadow: '0 4px 20px rgba(201,162,74,0.08)' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#C9A24A' }} />
                    <h2 className="text-[#062B24] font-semibold text-base">{t('بانتظار موافقة الإدارة', 'Awaiting Admin Approval')}</h2>
                  </div>
                  <div className="space-y-3">
                    {pendingCourses.map((course: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-[rgba(6,43,36,0.1)]" style={{ background: 'rgba(6,43,36,0.02)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(6,43,36,0.08)' }}>
                          <Clock size={18} className="text-[#8B9D8A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[#062B24] text-sm font-medium truncate">{t(course.lecture.title_ar, course.lecture.title_en)}</div>
                          <div className="text-[#8B9D8A] text-[10px] uppercase font-bold tracking-widest mt-1">{t('طلب قيد المراجعة', 'Request Under Review')}</div>
                        </div>
                        <div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(201,162,74,0.1)', color: '#C9A24A' }}>
                          {t(course.paymentMethod?.replace('_', ' ') || '', course.paymentMethod?.replace('_', ' ') || '')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Courses */}
              <div className="p-6 rounded-2xl mb-6" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[#062B24] font-semibold text-base">{t('محاضراتي الحالية', 'My Current Lectures')}</h2>
                  <button onClick={() => setActiveTab('courses')} className="text-[#C9A24A] text-xs hover:underline">{t('عرض الكل', 'View All')}</button>
                </div>
                {myCourses.length === 0 ? (
                  <div className="text-center py-10">
                    <BookOpen size={40} className="text-[#C9A24A] mx-auto mb-3 opacity-40" />
                    <p className="text-[#5A7A70] text-sm">{t('لم تسجّل في أي محاضرة بعد.', "You haven't enrolled in any lectures yet.")}</p>
                    <Link to="/lectures" className="mt-3 inline-block text-[#C9A24A] text-sm hover:underline">{t('استكشف المحاضرات', 'Explore Lectures')}</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myCourses.slice(0, 3).map((course: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F8F6F0' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                          <BookOpen size={18} className="text-[#C9A24A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[#062B24] text-sm font-medium truncate">{t(course.lecture.title_ar, course.lecture.title_en)}</div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(6,43,36,0.1)' }}>
                              <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #C9A24A, #F0D98A)', width: `${40 + i * 18}%` }} />
                            </div>
                            <span className="text-[#8B9D8A] text-xs shrink-0">{40 + i * 18}%</span>
                          </div>
                        </div>
                        <Link to={`/lectures/${course.lecture.slug}`}>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', boxShadow: '0 2px 0 #8B6B20' }}>
                            <Play size={12} className="text-[#062B24]" style={{ marginInlineStart: '2px' }} />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: BookOpen, label_ar: 'استكشف المحاضرات', label_en: 'Explore Lectures', to: '/lectures', color: '#C9A24A' },
                  { icon: MessageSquare, label_ar: 'تواصل معنا', label_en: 'Contact Support', to: '/contact', color: '#7BBFAD' },
                  { icon: Award, label_ar: 'شهاداتي', label_en: 'My Certificates', action: () => setActiveTab('certificates'), color: '#D8B75B' },
                ].map((action, i) => {
                  const IconComp = action.icon;
                  const content = (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl transition-all hover:shadow-md cursor-pointer" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${action.color}20` }}>
                        <IconComp size={16} style={{ color: action.color }} />
                      </div>
                      <span className="text-[#3A5A50] text-sm font-medium">{t(action.label_ar, action.label_en)}</span>
                      <ChevronRight size={14} className="ms-auto text-[#8B9D8A]" style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                    </div>
                  );
                  return action.to
                    ? <Link key={i} to={action.to}>{content}</Link>
                    : <div key={i} onClick={action.action}>{content}</div>;
                })}
              </div>
            </motion.div>
          )}

          {/* My Courses */}
          {activeTab === 'courses' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-[#062B24] font-bold text-lg mb-6">{t('محاضراتي', 'My Lectures')}</h2>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton.Base key={i} theme="light" className="h-28 w-full rounded-2xl" />
                  ))}
                </div>
              ) : myCourses.length === 0 ? (
                <div className="text-center py-20 p-8 rounded-2xl" style={{ background: 'white' }}>
                  <BookOpen size={48} className="text-[#C9A24A] mx-auto mb-4 opacity-40" />
                  <p className="text-[#5A7A70] mb-4">{t('لا توجد محاضرات مسجلة.', 'No enrolled lectures.')}</p>
                  <Link to="/lectures" className="px-5 py-2.5 rounded-xl text-sm font-semibold inline-block" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}>
                    {t('استكشف المحاضرات', 'Explore Lectures')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myCourses.map((course: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                          <BookOpen size={24} className="text-[#C9A24A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#062B24] font-semibold text-sm mb-1">{t(course.lecture.title_ar, course.lecture.title_en)}</h3>
                          <div className="flex items-center gap-3 text-[#8B9D8A] text-xs mb-3">
                            <span className="flex items-center gap-1"><Clock size={11} className="text-[#C9A24A]" />{course.lecture.duration?.split('/')[0]?.trim()}</span>
                            <span className="flex items-center gap-1"><Play size={11} className="text-[#C9A24A]" />{course.lecture.lessonsCount} {t('درس', 'lessons')}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(6,43,36,0.1)' }}>
                              <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #C9A24A, #F0D98A)', width: `${40 + i * 15}%` }} />
                            </div>
                            <span className="text-[#8B9D8A] text-xs">{40 + i * 15}%</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <span className="px-2.5 py-1 rounded-full text-xs text-center" style={{ background: 'rgba(74,139,122,0.15)', color: '#4A8B7A' }}>
                            {t('مسجّل', 'Enrolled')}
                          </span>
                          <Link to={`/lectures/${course.lecture.slug}`} className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                            <Play size={11} /> {t('متابعة', 'Continue')}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Certificates */}
          {activeTab === 'certificates' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-[#062B24] font-bold text-lg mb-6">{t('شهاداتي', 'My Certificates')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton.Base key={i} theme="light" className="h-44 w-full rounded-2xl" />
                  ))
                ) : myCourses.filter((c: any) => c.lecture?.certificate).length === 0 ? (
                  <div className="col-span-2 text-center py-16 rounded-2xl" style={{ background: 'white' }}>
                    <Award size={48} className="text-[#C9A24A] mx-auto mb-4 opacity-40" />
                    <p className="text-[#5A7A70]">{t('لا توجد شهادات بعد.', 'No certificates yet.')}</p>
                  </div>
                ) : (
                  myCourses.filter((c: any) => c.lecture?.certificate).map((course: any, i: number) => (
                    <div key={i} className="p-6 rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})`, border: '1px solid rgba(201,162,74,0.3)' }}>
                      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.6} tileSize={50} />
                      <div className="relative z-10">
                        <div className="absolute -bottom-6 -end-6 opacity-10">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                            <circle cx="50" cy="50" r="45" stroke="#C9A24A" strokeWidth="1"/>
                            <path d="M50 15C35 15 22 28 22 43c0 10 6 18 16 24l12 7 12-7c10-6 16-14 16-24 0-15-13-28-28-28z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.1)"/>
                          </svg>
                        </div>
                        <Award size={28} className="text-[#C9A24A] mb-4" />
                        <div className="text-[#F0D98A] font-semibold text-sm mb-1">{t(course.lecture.title_ar, course.lecture.title_en)}</div>
                        <div className="text-[#8B9D8A] text-xs mb-5">{t('د. فاطمة فاضل العيساوي', 'Dr. Fatima Fadel Al-Issawi')}</div>
                        <button
                          onClick={() => {
                            setSelectedCert({ 
                              courseName: t(course.lecture.title_ar, course.lecture.title_en),
                              date: new Date(course.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
                            });
                            setIsCertModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                          style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}
                        >
                          {t('عرض وتحميل الشهادة', 'View & Download Certificate')}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Payments */}
          {activeTab === 'payments' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-[#062B24] font-bold text-lg mb-6">{t('سجل المدفوعات', 'Payment History')}</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="relative overflow-hidden" style={{ background: BRAND.deep, color: '#C9A24A' }}>
                        <th className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wide relative z-10">{t('المحاضرة', 'Lecture')}</th>
                        <th className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wide relative z-10">{t('المبلغ', 'Amount')}</th>
                        <th className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wide relative z-10">{t('الحالة', 'Status')}</th>
                        <th className="px-5 py-4 text-start text-xs font-semibold uppercase tracking-wide relative z-10">{t('التاريخ', 'Date')}</th>
                        <div className="absolute inset-0 pointer-events-none">
                          <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.1} strokeWidth={0.5} tileSize={40} />
                        </div>
                      </tr>
                    </thead>
                    <tbody>
                      {myEnrollments.map((enr: any, i: number) => {
                        const lec = (lectures as any[]).find((l: any) => l.id === enr.courseId);
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                            <td className="px-5 py-4 text-[#062B24] text-xs">{lec ? t(lec.title_ar, lec.title_en) : '-'}</td>
                            <td className="px-5 py-4 text-[#C9A24A] font-bold text-xs">${enr.amount}</td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(74,139,122,0.15)', color: '#4A8B7A' }}>
                                {t('مدفوع', 'Paid')}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-[#8B9D8A] text-xs">{new Date(enr.createdAt).toLocaleDateString(t('ar-SA', 'en-US'))}</td>
                          </tr>
                        );
                      })}
                      {myEnrollments.length === 0 && (
                        <tr><td colSpan={4} className="px-5 py-12 text-center text-[#5A7A70] text-sm">{t('لا توجد مدفوعات.', 'No payments.')}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#062B24] font-bold text-lg">{t('الملف الشخصي', 'My Profile')}</h2>
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setProfileForm({
                        name: currentUser.name,
                        nameAr: currentUser.name_ar || '',
                        phone: currentUser.phone || '',
                        country: currentUser.country || '',
                        language: currentUser.language
                      });
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: 'rgba(201,162,74,0.15)', color: BRAND.gold, border: '1px solid rgba(201,162,74,0.3)' }}
                  >
                    {t('تعديل الملف', 'Edit Profile')}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: 'rgba(0,0,0,0.05)', color: '#5A7A70' }}
                    >
                      {t('إلغاء', 'Cancel')}
                    </button>
                    <button
                      onClick={handleProfileSave}
                      className="px-4 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}
                    >
                      {t('حفظ التغييرات', 'Save Changes')}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-7 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                <div className="flex items-center gap-5 mb-8 pb-6" style={{ borderBottom: '1px solid rgba(6,43,36,0.08)' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep }}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[#062B24] font-bold text-lg">{currentUser.name}</div>
                    <div className="text-[#8B9D8A] text-sm">{currentUser.email}</div>
                    <span className="mt-1 inline-flex px-2.5 py-0.5 rounded-full text-xs" style={{ background: 'rgba(74,139,122,0.15)', color: '#4A8B7A' }}>
                      {t('طالب', 'Student')}
                    </span>
                  </div>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#8B9D8A] text-xs uppercase tracking-wide mb-1.5 font-semibold">{t('الاسم الكامل', 'Full Name')}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                        style={{ background: '#F8F6F0', borderColor: 'rgba(6,43,36,0.1)' }}
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        onFocus={e => e.target.style.borderColor = BRAND.gold}
                        onBlur={e => e.target.style.borderColor = 'rgba(6,43,36,0.1)'}
                      />
                    </div>
                    <div>
                      <label className="block text-[#8B9D8A] text-xs uppercase tracking-wide mb-1.5 font-semibold">{t('الاسم بالكامل (بالعربي)', 'Full Name (Arabic)')}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                        style={{ background: '#F8F6F0', borderColor: 'rgba(6,43,36,0.1)' }}
                        value={profileForm.nameAr}
                        onChange={e => setProfileForm({ ...profileForm, nameAr: e.target.value })}
                        onFocus={e => e.target.style.borderColor = BRAND.gold}
                        onBlur={e => e.target.style.borderColor = 'rgba(6,43,36,0.1)'}
                      />
                    </div>
                    <div>
                      <label className="block text-[#8B9D8A] text-xs uppercase tracking-wide mb-1.5 font-semibold">{t('رقم الهاتف', 'Phone')}</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                        style={{ background: '#F8F6F0', borderColor: 'rgba(6,43,36,0.1)' }}
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        onFocus={e => e.target.style.borderColor = BRAND.gold}
                        onBlur={e => e.target.style.borderColor = 'rgba(6,43,36,0.1)'}
                      />
                    </div>
                    <div>
                      <label className="block text-[#8B9D8A] text-xs uppercase tracking-wide mb-1.5 font-semibold">{t('الدولة', 'Country')}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                        style={{ background: '#F8F6F0', borderColor: 'rgba(6,43,36,0.1)' }}
                        value={profileForm.country}
                        onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                        onFocus={e => e.target.style.borderColor = BRAND.gold}
                        onBlur={e => e.target.style.borderColor = 'rgba(6,43,36,0.1)'}
                      />
                    </div>
                    <div>
                      <label className="block text-[#8B9D8A] text-xs uppercase tracking-wide mb-1.5 font-semibold">{t('اللغة المفضلة', 'Language')}</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all"
                        style={{ background: '#F8F6F0', borderColor: 'rgba(6,43,36,0.1)', cursor: 'pointer' }}
                        value={profileForm.language}
                        onChange={e => setProfileForm({ ...profileForm, language: e.target.value as 'ar' | 'en' })}
                      >
                        <option value="ar">{t('العربية', 'Arabic')}</option>
                        <option value="en">{t('الإنجليزية', 'English')}</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label_ar: 'الاسم الكامل (إنجليزي)', label_en: 'Full Name (English)', value: currentUser.name },
                      { label_ar: 'الاسم الكامل (عربي)', label_en: 'Full Name (Arabic)', value: currentUser.name_ar || '-' },
                      { label_ar: 'البريد الإلكتروني', label_en: 'Email', value: currentUser.email },
                      { label_ar: 'رقم الهاتف', label_en: 'Phone', value: currentUser.phone || '-' },
                      { label_ar: 'الدولة', label_en: 'Country', value: currentUser.country || '-' },
                      { label_ar: 'اللغة المفضلة', label_en: 'Language', value: currentUser.language === 'ar' ? t('العربية', 'Arabic') : t('الإنجليزية', 'English') },
                      { label_ar: 'تاريخ التسجيل', label_en: 'Joined', value: new Date(currentUser.createdAt).toLocaleDateString(t('ar-SA', 'en-US')) },
                    ].map((field, i) => (
                      <div key={i}>
                        <label className="block text-[#8B9D8A] text-xs uppercase tracking-wide mb-1">{t(field.label_ar, field.label_en)}</label>
                        <div className="px-4 py-3 rounded-xl text-sm text-[#1E1E1E]" style={{ background: '#F8F6F0' }}>{field.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Support */}
          {activeTab === 'support' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-[#062B24] font-bold text-lg mb-6">{t('الدعم والمساعدة', 'Support & Help')}</h2>
              <div className="p-8 rounded-2xl text-center" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)' }}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.1)' }}>
                  <MessageSquare size={28} className="text-[#C9A24A]" />
                </div>
                <h3 className="text-[#062B24] font-semibold mb-2">{t('هل تحتاج مساعدة؟', 'Need Help?')}</h3>
                <p className="text-[#5A7A70] text-sm mb-6 max-w-sm mx-auto">{t('تواصل معنا وسيرد فريقنا في أقرب وقت ممكن.', "Contact us and our team will respond as soon as possible.")}</p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}>
                  {t('تواصل معنا', 'Contact Us')}
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </div>
      <CertificateModal 
        isOpen={isCertModalOpen} 
        onClose={() => setIsCertModalOpen(false)}
        userName={isRTL ? (currentUser.name_ar || currentUser.name) : currentUser.name}
        courseName={selectedCert?.courseName || ''}
        date={selectedCert?.date || ''}
      />
    </div>
  );
}