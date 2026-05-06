import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA' };

export default function Login() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Check if email is passed from registration
    if (location.state?.email) {
      setForm(f => ({ ...f, email: location.state.email }));
    } 
    // 2. Check if email is remembered in localStorage
    else {
      const rememberedEmail = localStorage.getItem('sa_remembered_email');
      if (rememberedEmail) {
        setForm(f => ({ ...f, email: rememberedEmail }));
        setRememberMe(true);
      }
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('sa_remembered_email', form.email);
      } else {
        localStorage.removeItem('sa_remembered_email');
      }
      toast.success(t('تم تسجيل الدخول بنجاح!', 'Logged in successfully!'));
      // Redirect based on role
      const storedUser = localStorage.getItem('sa_current_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(t('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'Invalid email or password'));
    }
  };
  
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const result = await loginWithGoogle(tokenResponse.access_token);
      setLoading(false);
      if (result.success) {
        toast.success(t('تم تسجيل الدخول بواسطة جوجل!', 'Logged in with Google!'));
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    },
    onError: () => toast.error(t('فشل تسجيل الدخول بواسطة جوجل', 'Google Login Failed')),
  });


  return (
    <div className="min-h-screen flex items-center justify-center pt-40 pb-16 px-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep} 0%, ${BRAND.mid} 100%)`, fontFamily }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl overflow-hidden relative" style={{ background: BRAND.ivory, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.06} strokeWidth={0.6} tileSize={60} />
          {/* Header */}
          <div className="p-8 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
            <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.7} tileSize={50} />
            <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center p-1 relative z-10" style={{ background: 'linear-gradient(135deg, #C9A24A, #F0D98A)', boxShadow: '0 3px 15px rgba(201,162,74,0.4)' }}>
              <img src="/symbolacademy.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-[#F0D98A] font-bold text-xl" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
              {t('تسجيل الدخول', 'Log In')}
            </h1>
            <p className="text-[#8B9D8A] text-xs mt-1">{t('الأكاديمية العليا للرموز', 'The Higher Academy of Symbols')}</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">{t('البريد الإلكتروني', 'Email')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder={t('example@email.com', 'example@email.com')}
                  className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none"
                  style={{ background: 'rgba(6,43,36,0.04)', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = BRAND.gold}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(6,43,36,0.12)'}
                />
              </div>

              <div>
                <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">{t('كلمة المرور', 'Password')}</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none"
                    style={{ background: 'rgba(6,43,36,0.04)', border: '1.5px solid rgba(6,43,36,0.12)', paddingInlineEnd: '44px', fontFamily }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = BRAND.gold}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(6,43,36,0.12)'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A] hover:text-[#3A5A50]" style={{ insetInlineEnd: '14px' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative w-4 h-4 rounded border transition-all flex items-center justify-center"
                    style={{ 
                      background: rememberMe ? BRAND.gold : 'rgba(6,43,36,0.04)', 
                      borderColor: rememberMe ? BRAND.gold : 'rgba(6,43,36,0.12)' 
                    }}>
                    <input
                      type="checkbox"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    {rememberMe && <div className="w-2 h-2 rounded-full bg-[#062B24]" />}
                  </div>
                  <span className="text-[#5A7A70] text-[11px] font-medium group-hover:text-[#3A5A50] transition-colors">
                    {t('تذكرني', 'Remember Me')}
                  </span>
                </label>
                
                <Link to="/forgot-password" className="text-[#C9A24A] text-[11px] font-semibold hover:underline">
                  {t('نسيت كلمة المرور؟', 'Forgot Password?')}
                </Link>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(212,24,61,0.08)', border: '1px solid rgba(212,24,61,0.2)', color: '#D4183D' }}>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold transition-all"
                style={{ background: loading ? 'rgba(201,162,74,0.5)' : 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: loading ? 'none' : '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.15)' }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(2px)')}
                onMouseLeave={e => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)')}
              >
                {loading ? <div className="w-5 h-5 rounded-full border-2 border-[#062B24] border-t-transparent animate-spin" /> : <><LogIn size={16} />{t('تسجيل الدخول', 'Log In')}</>}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#F8F4EA] px-2 text-[#8B9D8A] font-medium">{t('أو', 'Or')}</span></div>
            </div>

            <button
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold transition-all group overflow-hidden relative"
              style={{ 
                background: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(6, 43, 36, 0.1)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                color: '#3A5A50'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.9)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.7)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.8c2.3-2.1 3.6-5.2 3.6-8.6z" fill="#4285F4"/>
                <path d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3c-1.1.8-2.6 1.2-4.2 1.2-3.2 0-6-2.2-7-5.2H1.1v3.2C3.1 21.3 7.3 24 12 24z" fill="#34A853"/>
                <path d="M5 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1V6.7H1.1C.4 8.1 0 9.7 0 11.4s.4 3.3 1.1 4.7l3.9-3.1v1.1z" fill="#FBBC05"/>
                <path d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.3 0 3.1 2.7 1.1 6.7l3.9 3.2c1-3 3.8-5.1 7-5.1z" fill="#EA4335"/>
              </svg>
              {t('متابعة باستخدام جوجل', 'Continue with Google')}
            </button>

            <p className="text-center text-[#5A7A70] text-xs mt-6">
              {t('ليس لديك حساب؟', "Don't have an account?")}
              {' '}
              <Link to="/register" className="text-[#C9A24A] font-semibold hover:underline">
                {t('مستخدم جديد', 'New User')}
              </Link>
            </p>
            <p className="text-center text-[#8B9D8A] text-xs mt-3">
              {t('هل أنت مشرف؟', 'Are you an admin?')}{' '}
              <Link to="/admin-login" className="text-[#C9A24A] font-semibold hover:underline">
                {t('بوابة المديرين', 'Admin Portal')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}