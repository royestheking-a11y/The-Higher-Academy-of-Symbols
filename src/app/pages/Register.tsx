import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, UserPlus, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', ivory: '#F8F4EA' };

export default function Register() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { register, currentUser } = useAuth();
  const { addNotification } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    language: (isRTL ? 'ar' : 'en') as 'ar' | 'en',
    interestedLecture: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t('الاسم مطلوب', 'Name is required');
    if (!form.email.trim()) errs.email = t('البريد الإلكتروني مطلوب', 'Email is required');
    if (form.password.length < 6) errs.password = t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('كلمة المرور غير متطابقة', 'Passwords do not match');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Omit confirmPassword and interestedLecture for the register call
    const { confirmPassword: _cp, interestedLecture: _il, ...registrationData } = form;
    const result = await register(registrationData);

    setLoading(false);
    if (result.success) {
      // Notify Admin
      addNotification({
        userId: 'admin',
        title_ar: 'طالب جديد',
        title_en: 'New Student Registered',
        message_ar: `قام طالب جديد بالتسجيل: ${registrationData.name}`,
        message_en: `A new student has registered: ${registrationData.name}`,
        type: 'info',
        link: '/admin/users'
      });

      toast.success(t('تم التسجيل بنجاح! يرجى تسجيل الدخول.', 'Registration successful! Please log in.'));
      navigate('/login', { state: { email: registrationData.email } });
    } else {
      setErrors({ email: t(result.message || 'حدث خطأ', result.message || 'An error occurred') });
    }
  };

  const countries = [
    { ar: 'الإمارات العربية المتحدة', en: 'UAE' },
    { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
    { ar: 'الكويت', en: 'Kuwait' },
    { ar: 'قطر', en: 'Qatar' },
    { ar: 'البحرين', en: 'Bahrain' },
    { ar: 'عُمان', en: 'Oman' },
    { ar: 'مصر', en: 'Egypt' },
    { ar: 'الأردن', en: 'Jordan' },
    { ar: 'سوريا', en: 'Syria' },
    { ar: 'العراق', en: 'Iraq' },
    { ar: 'المغرب', en: 'Morocco' },
    { ar: 'تونس', en: 'Tunisia' },
    { ar: 'أخرى', en: 'Other' },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none";
  const inputStyle = { background: 'rgba(6,43,36,0.04)', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily };
  const focusStyle = (e: any) => { e.target.style.borderColor = BRAND.gold; };
  const blurStyle = (e: any) => { e.target.style.borderColor = 'rgba(6,43,36,0.12)'; };

  return (
    <div className="min-h-screen flex items-center justify-center pt-40 pb-16 px-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep} 0%, ${BRAND.mid} 100%)`, fontFamily }}>
      <div className="absolute inset-0 pointer-events-none">
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        <div className="rounded-3xl overflow-hidden relative" style={{ background: BRAND.ivory, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.06} strokeWidth={0.6} tileSize={60} />
          {/* Header */}
          <div className="p-7 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
            <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.7} tileSize={50} />
            <div className="w-28 h-28 rounded-full mx-auto mb-3 flex items-center justify-center p-1 relative z-10" style={{ background: 'linear-gradient(135deg, #C9A24A, #F0D98A)', boxShadow: '0 3px 15px rgba(201,162,74,0.4)' }}>
              <img src="/symbolacademy.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-[#F0D98A] font-bold text-xl" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
              {t('إنشاء حساب جديد', 'Create New Account')}
            </h1>
            <p className="text-[#8B9D8A] text-xs mt-1">{t('انضم إلى الأكاديمية العليا للرموز', 'Join The Higher Academy of Symbols')}</p>
          </div>

          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الاسم الكامل *', 'Full Name *')}</label>
                  <input type="text" required className={inputClass} style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('البريد الإلكتروني *', 'Email *')}</label>
                  <input type="email" required className={inputClass} style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('رقم الهاتف', 'Phone Number')}</label>
                  <input type="tel" className={inputClass} style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('الدولة', 'Country')}</label>
                  <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                    <option value="">{t('اختر دولتك', 'Select your country')}</option>
                    {countries.map(c => <option key={c.en} value={c.en}>{t(c.ar, c.en)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('كلمة المرور *', 'Password *')}</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} required className={inputClass} style={{ ...inputStyle, paddingInlineEnd: '44px' }} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A]" style={{ insetInlineEnd: '14px' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('تأكيد كلمة المرور *', 'Confirm Password *')}</label>
                  <input type="password" required className={inputClass} style={inputStyle} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('اللغة المفضلة', 'Preferred Language')}</label>
                  <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }} value={form.language} onChange={e => setForm({ ...form, language: e.target.value as 'ar' | 'en' })}>
                    <option value="ar">{t('العربية', 'Arabic')}</option>
                    <option value="en">{t('الإنجليزية', 'English')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#3A5A50] text-xs font-semibold mb-1.5 uppercase tracking-wide">{t('المحاضرة المهتم بها', 'Interested Lecture')}</label>
                  <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }} value={form.interestedLecture} onChange={e => setForm({ ...form, interestedLecture: e.target.value })}>
                    <option value="">{t('اختر محاضرة', 'Select a lecture')}</option>
                    <option value="interpretation">{t('علم التأويل', 'Interpretation')}</option>
                    <option value="cryptography">{t('التشفير والمرموز', 'Cryptography')}</option>
                    <option value="semiotics">{t('السيميائيات', 'Semiotics')}</option>
                    <option value="shorthand">{t('الاختزال العربي', 'Arabic Shorthand')}</option>
                    <option value="semantics">{t('الدلالة', 'Semantics')}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold mt-2 transition-all"
                style={{ background: loading ? 'rgba(201,162,74,0.5)' : 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: loading ? 'none' : '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.15)' }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(2px)')}
                onMouseLeave={e => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)')}
              >
                {loading ? <div className="w-5 h-5 rounded-full border-2 border-[#062B24] border-t-transparent animate-spin" /> : <><UserPlus size={16} />{t('إنشاء الحساب', 'Create Account')}</>}
              </button>
            </form>

            <p className="text-center text-[#5A7A70] text-xs mt-5">
              {t('لديك حساب بالفعل؟', 'Already have an account?')}
              {' '}
              <Link to="/login" className="text-[#C9A24A] font-semibold hover:underline">{t('تسجيل الدخول', 'Log In')}</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}