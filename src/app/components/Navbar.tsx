import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
  Menu, X, ChevronDown, Search, User, LogOut, LayoutDashboard,
  ShieldCheck, BookOpen, Newspaper, GraduationCap, Phone, Star, Eye,
  Lock, ScrollText, FileText, Compass, PenLine, MessageSquare, Pen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';

const AREA_ICONS: Record<string, any> = {
  Star, Eye, BookOpen, PenLine, MessageSquare, Lock, ScrollText, FileText, Compass, Pen,
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t, language, setLanguage, isRTL, fontFamily } = useLanguage();
  const { currentUser, logout, isAdmin } = useAuth();
  const { areasOfStudy, settings } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const areasRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAreasOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (areasRef.current && !areasRef.current.contains(e.target as Node)) setAreasOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label_ar: 'الرئيسية', label_en: 'Home', to: '/' },
    { label_ar: 'عن الأكاديمية', label_en: 'About', to: '/about' },
    { label_ar: 'المحاضرات', label_en: 'Lectures', to: '/lectures' },
    { label_ar: 'المقالات', label_en: 'Articles', to: '/articles' },
    { label_ar: 'التواصل', label_en: 'Contact', to: '/contact' },
  ];

  const isActive = (to: string) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const isHomePage = location.pathname === '/';
  const bgStyle: React.CSSProperties = (isScrolled || !isHomePage)
    ? { background: '#062B24', borderBottom: '1px solid rgba(201,162,74,0.3)', backdropFilter: 'blur(20px)' }
    : { background: 'transparent' };

  return (
    <nav
      className="w-full transition-all duration-500"
      style={{ ...bgStyle, fontFamily }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="shrink-0 rounded-full overflow-hidden"
              style={{ width: 42, height: 42, boxShadow: '0 2px 14px rgba(201,162,74,0.4)', background: '#062B24' }}
            >
              <img src="/symbolacademy.png" alt="The Higher Academy of Symbols Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="leading-tight max-w-[150px]">
              <div className="text-[#F0D98A] font-bold tracking-wide leading-tight" style={{ fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif', fontSize: isRTL ? '12px' : '10.5px' }}>
                {t('الأكاديمية العليا للرموز', 'The Higher Academy of Symbols')}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm transition-all duration-200 relative group ${
                  isActive(link.to) ? 'text-[#F0D98A]' : 'text-[#E8DDC7] hover:text-[#F0D98A]'
                }`}
              >
                {t(link.label_ar, link.label_en)}
                <span
                  className={`absolute bottom-0 start-0 end-0 h-0.5 transition-all duration-200 ${
                    isActive(link.to) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{ background: 'linear-gradient(90deg, #C9A24A, #F0D98A)' }}
                />
              </Link>
            ))}

            {/* Areas Mega Menu */}
            <div ref={areasRef} className="relative">
              <button
                onClick={() => setAreasOpen(!areasOpen)}
                className={`flex items-center gap-1 px-4 py-2 text-sm transition-all duration-200 ${areasOpen ? 'text-[#F0D98A]' : 'text-[#E8DDC7] hover:text-[#F0D98A]'}`}
              >
                {t('مجالات الدراسة', 'Areas of Study')}
                <ChevronDown size={14} className={`transition-transform ${areasOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {areasOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 rounded-xl shadow-2xl overflow-hidden z-50"
                    style={{
                      background: '#062B24',
                      border: '1px solid rgba(201,162,74,0.3)',
                      width: '480px',
                      insetInlineStart: isRTL ? 'auto' : '-100px',
                      insetInlineEnd: isRTL ? '-100px' : 'auto',
                    }}
                  >
                    <div className="p-4">
                      <div className="text-[#C9A24A] text-xs uppercase tracking-widest mb-3 px-2">
                        {t('مجالات الدراسة الأكاديمية', 'Academic Fields of Study')}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {areasOfStudy.slice(0, 8).map((area: any) => {
                          const IconComp = AREA_ICONS[area.icon] || Star;
                          return (
                            <Link
                              key={area.id}
                              to={`/areas/${area.slug}`}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#0B3A31] transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(201,162,74,0.15)' }}>
                                <IconComp size={16} className="text-[#C9A24A]" />
                              </div>
                              <div>
                                <div className="text-[#F8F4EA] text-sm font-medium group-hover:text-[#F0D98A] transition-colors">
                                  {t(area.name_ar, area.name_en)}
                                </div>
                                <div className="text-[#8B9D8A] text-xs mt-0.5 line-clamp-1">
                                  {t(area.description_ar, area.description_en)}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-[rgba(201,162,74,0.2)]">
                        <Link to="/areas-of-study" className="flex items-center gap-2 text-[#C9A24A] text-sm hover:text-[#F0D98A] transition-colors px-2">
                          {t('عرض جميع المجالات', 'View All Areas')}
                          <ChevronDown size={14} className={isRTL ? 'rotate-90' : '-rotate-90'} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#C9A24A] hover:bg-[rgba(201,162,74,0.15)] transition-all"
            >
              <Search size={17} />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
              style={{ borderColor: 'rgba(201,162,74,0.5)', color: '#C9A24A', background: 'rgba(201,162,74,0.1)' }}
            >
              {language === 'ar' ? 'EN' : 'عر'}
            </button>

            {/* Auth */}
            {currentUser ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all"
                  style={{ borderColor: 'rgba(201,162,74,0.5)', color: '#F0D98A', background: 'rgba(201,162,74,0.1)' }}
                >
                  <User size={15} />
                  <span className="text-xs">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute top-full mt-2 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[180px]"
                      style={{ background: '#0B3A31', border: '1px solid rgba(201,162,74,0.3)', insetInlineEnd: 0 }}
                    >
                      <div className="p-1.5">
                        {isAdmin ? (
                          <Link to="/admin" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#F8F4EA] hover:bg-[rgba(201,162,74,0.15)] text-sm transition-all">
                            <ShieldCheck size={15} className="text-[#C9A24A]" />
                            {t('لوحة الإدارة', 'Admin Panel')}
                          </Link>
                        ) : (
                          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#F8F4EA] hover:bg-[rgba(201,162,74,0.15)] text-sm transition-all">
                            <LayoutDashboard size={15} className="text-[#C9A24A]" />
                            {t('لوحتي', 'My Dashboard')}
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); navigate('/'); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#F8F4EA] hover:bg-[rgba(201,162,74,0.15)] text-sm transition-all text-start"
                        >
                          <LogOut size={15} className="text-[#C9A24A]" />
                          {t('تسجيل الخروج', 'Logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm border transition-all hover:bg-[rgba(201,162,74,0.1)]"
                  style={{ borderColor: 'rgba(201,162,74,0.4)', color: '#E8DDC7' }}
                >
                  {t('تسجيل الدخول', 'Log In')}
                </Link>
                <Link to="/register">
                  <button
                    className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #C9A24A, #D8B75B)',
                      color: '#062B24',
                      boxShadow: '0 3px 0 #8B6B20, 0 5px 15px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(2px)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 #8B6B20, 0 3px 8px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 3px 0 #8B6B20, 0 5px 15px rgba(0,0,0,0.3)';
                    }}
                  >
                    {t('مستخدم جديد', 'New User')}
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1 rounded-full text-xs font-semibold border"
              style={{ borderColor: 'rgba(201,162,74,0.5)', color: '#C9A24A' }}
            >
              {language === 'ar' ? 'EN' : 'عر'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#C9A24A]"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('ابحث في المحاضرات، المقالات، مجالات الدراسة...', 'Search lectures, articles, areas...')}
                  className="w-full px-4 py-3 rounded-xl text-sm text-[#F8F4EA] placeholder-[#8B9D8A] outline-none"
                  style={{ background: 'rgba(11,58,49,0.9)', border: '1px solid rgba(201,162,74,0.3)', fontFamily }}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                />
                <Search size={17} className="absolute top-1/2 -translate-y-1/2 text-[#C9A24A]" style={{ insetInlineEnd: '16px' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ background: '#062B24', borderTop: '1px solid rgba(201,162,74,0.2)' }}
          >
            <div className="px-4 py-4 space-y-1" style={{ fontFamily }}>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive(link.to)
                      ? 'text-[#F0D98A] bg-[rgba(201,162,74,0.15)]'
                      : 'text-[#E8DDC7] hover:bg-[rgba(201,162,74,0.1)] hover:text-[#F0D98A]'
                  }`}
                >
                  {t(link.label_ar, link.label_en)}
                </Link>
              ))}
              <Link
                to="/areas-of-study"
                className="flex items-center px-4 py-3 rounded-xl text-sm text-[#E8DDC7] hover:bg-[rgba(201,162,74,0.1)] hover:text-[#F0D98A] transition-all"
              >
                {t('مجالات الدراسة', 'Areas of Study')}
              </Link>
              <div className="pt-3 border-t border-[rgba(201,162,74,0.2)] space-y-2">
                {currentUser ? (
                  <>
                    <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-[#F0D98A] hover:bg-[rgba(201,162,74,0.1)] transition-all">
                      {isAdmin ? <ShieldCheck size={15} /> : <LayoutDashboard size={15} />}
                      {isAdmin ? t('لوحة الإدارة', 'Admin Panel') : t('لوحتي', 'My Dashboard')}
                    </Link>
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-[#E8DDC7] hover:bg-[rgba(201,162,74,0.1)] transition-all text-start">
                      <LogOut size={15} />
                      {t('تسجيل الخروج', 'Logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3 rounded-xl text-sm text-center border text-[#E8DDC7] transition-all" style={{ borderColor: 'rgba(201,162,74,0.4)' }}>
                      {t('تسجيل الدخول', 'Log In')}
                    </Link>
                    <Link to="/register" className="block px-4 py-3 rounded-xl text-sm text-center font-semibold" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: '#062B24' }}>
                      {t('مستخدم جديد', 'New User')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}