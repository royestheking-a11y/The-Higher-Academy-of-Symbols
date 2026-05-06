import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA' };

export default function AdminLogin() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { login, isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser && isAdmin) {
      navigate('/admin');
    }
  }, [currentUser, isAdmin, navigate]);

  if (currentUser && isAdmin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      // Check if logged in user is admin
      const storedUser = localStorage.getItem('sa_current_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (user?.role === 'admin') {
        toast.success(t('تم تسجيل الدخول بنجاح!', 'Welcome, Admin!'));
        navigate('/admin');
      } else {
        // Not an admin — log them out
        localStorage.removeItem('sa_current_user');
        setError(t('هذه الصفحة للمديرين فقط', 'This page is for administrators only'));
      }
    } else {
      setError(t('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'Invalid email or password'));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center pt-32 pb-16 px-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${BRAND.deep} 0%, #041F1A 50%, ${BRAND.mid} 100%)`, fontFamily }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="absolute top-1/4 -start-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #C9A24A, transparent)' }} />
        <div className="absolute bottom-1/4 -end-20 w-80 h-80 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #C9A24A, transparent)' }} />
      </div>

      {/* Back to site */}
      <Link
        to="/"
        className="absolute top-6 start-6 flex items-center gap-2 text-[#8B9D8A] hover:text-[#C9A24A] transition-colors text-sm z-20"
      >
        {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        {t('العودة للموقع', 'Back to Site')}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="rounded-3xl overflow-hidden relative" style={{ background: BRAND.ivory, boxShadow: '0 25px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,162,74,0.2)' }}>
          <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.06} strokeWidth={0.6} tileSize={60} />
          
          {/* Header */}
          <div className="p-8 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
            <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.7} tileSize={50} />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center relative p-1"
              style={{
                background: 'linear-gradient(135deg, #C9A24A, #F0D98A)',
                boxShadow: '0 4px 20px rgba(201,162,74,0.5), 0 6px 0 #8B6B20',
              }}
            >
              <img src="/symbolacademy.png" alt="Logo" className="w-full h-full object-contain" />
            </motion.div>

            <h1 className="text-[#F0D98A] font-bold text-xl mb-1 relative z-10" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
              {t('بوابة المديرين', 'Admin Portal')}
            </h1>
            <p className="text-[#8B9D8A] text-xs relative z-10">{t('الأكاديمية العليا للرموز — دخول المشرفين', 'The Higher Academy of Symbols — Administrators Only')}</p>

            {/* Warning badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs relative z-10" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
              <ShieldCheck size={12} />
              {t('منطقة محمية — للمديرين فقط', 'Restricted Area — Admins Only')}
            </div>
          </div>

          {/* Form */}
          <div className="p-8 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">
                  {t('البريد الإلكتروني', 'Email')}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@symbolsacademy.com"
                  className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none"
                  style={{ background: 'rgba(6,43,36,0.04)', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }}
                  onFocus={e => (e.target.style.borderColor = BRAND.gold)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(6,43,36,0.12)')}
                />
              </div>

              <div>
                <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">
                  {t('كلمة المرور', 'Password')}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none"
                    style={{ background: 'rgba(6,43,36,0.04)', border: '1.5px solid rgba(6,43,36,0.12)', paddingInlineEnd: '44px', fontFamily }}
                    onFocus={e => (e.target.style.borderColor = BRAND.gold)}
                    onBlur={e => (e.target.style.borderColor = 'rgba(6,43,36,0.12)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A] hover:text-[#3A5A50]"
                    style={{ insetInlineEnd: '14px' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                  style={{ background: 'rgba(212,24,61,0.08)', border: '1px solid rgba(212,24,61,0.2)', color: '#D4183D' }}
                >
                  <ShieldCheck size={14} />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold transition-all"
                style={{
                  background: loading ? 'rgba(201,162,74,0.5)' : 'linear-gradient(135deg, #C9A24A, #D8B75B)',
                  color: BRAND.deep,
                  boxShadow: loading ? 'none' : '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => !loading && ((e.currentTarget).style.transform = 'translateY(2px)')}
                onMouseLeave={e => !loading && ((e.currentTarget).style.transform = 'translateY(0)')}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#062B24] border-t-transparent animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {t('دخول المشرف', 'Admin Sign In')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
