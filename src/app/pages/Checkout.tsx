import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  CreditCard, Banknote, Landmark, ShieldCheck, ChevronLeft, 
  ChevronRight, Info, AlertCircle, CheckCircle2, Lock, 
  ArrowRight, CreditCard as CardIcon, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA' };

export default function Checkout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, isRTL, fontFamily } = useLanguage();
  const { currentUser } = useAuth();
  const { lectures, addEnrollment } = useData();
  
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Processing
  const [method, setMethod] = useState<'card' | 'ibanking' | 'bank_transfer'>('card');
  const [loading, setLoading] = useState(false);
  
  const lecture = (lectures as any[]).find((l: any) => l.slug === slug);

  useEffect(() => {
    if (!currentUser) {
      toast.error(t('يرجى تسجيل الدخول أولاً', 'Please log in first'));
      navigate('/login');
    }
  }, [currentUser, navigate, t]);

  if (!lecture) return null;

  const handlePayment = async () => {
    setStep(3);
    setLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const enrollmentData = {
      userId: currentUser?.id,
      userName: currentUser?.name,
      courseId: lecture.id,
      courseTitle: lecture.title_en,
      amount: lecture.price,
      paymentMethod: method,
      paymentStatus: 'pending_approval',
      enrollmentStatus: 'pending',
      date: new Date().toISOString()
    };
    
    addEnrollment(enrollmentData);
    setLoading(false);
    toast.success(t('تم إرسال طلبك بنجاح! بانتظار موافقة الإدارة.', 'Request sent successfully! Awaiting admin approval.'));
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const methods = [
    { id: 'card', icon: CardIcon, title_ar: 'البطاقة البنكية', title_en: 'Credit/Debit Card', desc_ar: 'فيزا، ماستركارد، مدى', desc_en: 'Visa, Mastercard, Mada' },
    { id: 'ibanking', icon: Building2, title_ar: 'الخدمات المصرفية الإلكترونية', title_en: 'iBanking / Online', desc_ar: 'دفع مباشر عبر البنك', desc_en: 'Direct bank payment' },
    { id: 'bank_transfer', icon: Landmark, title_ar: 'تحويل بنكي', title_en: 'Bank Transfer', desc_ar: 'تحويل يدوي للحساب', desc_en: 'Manual transfer' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4" style={{ background: BRAND.ivory, fontFamily }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#3A5A50] hover:text-[#C9A24A] transition-colors text-sm font-medium">
            {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {t('العودة للمحاضرة', 'Back to Lecture')}
          </button>
          <div className="flex items-center gap-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-[#C9A24A] text-[#062B24]' : 'bg-white border-2 border-rgba(6,43,36,0.1) text-[#8B9D8A]'}`}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                {s === 1 && <div className={`w-8 h-0.5 rounded ${step > 1 ? 'bg-[#C9A24A]' : 'bg-[rgba(6,43,36,0.1)]'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Flow */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-8 border border-[rgba(6,43,36,0.08)] shadow-xl relative overflow-hidden"
                >
                  <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.05} strokeWidth={0.5} tileSize={60} />
                  <h2 className="text-2xl font-bold text-[#062B24] mb-6 relative z-10">{t('تفاصيل الطلب', 'Order Details')}</h2>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex gap-4 p-4 rounded-2xl bg-[rgba(201,162,74,0.05)] border border-[rgba(201,162,74,0.15)]">
                      <div className="w-20 h-20 rounded-xl bg-[#062B24] flex items-center justify-center shrink-0">
                        <img src="/symbolacademy.png" alt="Logo" className="w-12 h-12 object-contain" />
                      </div>
                      <div>
                        <div className="text-[#C9A24A] text-xs font-semibold mb-1 uppercase tracking-wider">{t(lecture.category_ar, lecture.category_en)}</div>
                        <h3 className="text-[#062B24] font-bold text-lg leading-tight">{t(lecture.title_ar, lecture.title_en)}</h3>
                        <p className="text-[#8B9D8A] text-xs mt-1">{t(lecture.lecturer_ar, lecture.lecturer_en)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-[#3A5A50] uppercase tracking-widest">{t('معلومات الطالب', 'Student Information')}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-[10px] text-[#8B9D8A] uppercase font-bold mb-1">{t('الاسم', 'Name')}</div>
                          <div className="text-sm font-medium text-[#1E1E1E]">{currentUser?.name}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-[10px] text-[#8B9D8A] uppercase font-bold mb-1">{t('البريد الإلكتروني', 'Email')}</div>
                          <div className="text-sm font-medium text-[#1E1E1E]">{currentUser?.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#F0D98A] flex gap-3">
                      <Info className="text-[#C9A24A] shrink-0" size={20} />
                      <p className="text-[#8B6B20] text-xs leading-relaxed">
                        {t('سيتم مراجعة طلب اشتراكك من قبل الإدارة بعد إتمام عملية الدفع. ستحصل على وصول كامل للمحاضرة بمجرد الموافقة.', 'Your enrollment will be reviewed by admin after payment. You will get full access once approved.')}
                      </p>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-4 rounded-2xl bg-[#062B24] text-[#F0D98A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0B3A31] transition-all shadow-lg"
                    >
                      {t('المتابعة للدفع', 'Continue to Payment')}
                      {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-8 border border-[rgba(6,43,36,0.08)] shadow-xl relative overflow-hidden"
                >
                   <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.05} strokeWidth={0.5} tileSize={60} />
                  <h2 className="text-2xl font-bold text-[#062B24] mb-6 relative z-10">{t('طريقة الدفع', 'Payment Method')}</h2>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 gap-3">
                      {methods.map((m) => {
                        const Icon = m.icon;
                        const active = method === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setMethod(m.id as any)}
                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-start transition-all ${active ? 'border-[#C9A24A] bg-[rgba(201,162,74,0.05)]' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-[#C9A24A] text-[#062B24]' : 'bg-gray-100 text-[#8B9D8A]'}`}>
                              <Icon size={24} />
                            </div>
                            <div className="grow">
                              <div className={`text-sm font-bold ${active ? 'text-[#062B24]' : 'text-[#3A5A50]'}`}>{t(m.title_ar, m.title_en)}</div>
                              <div className="text-xs text-[#8B9D8A] mt-0.5">{t(m.desc_ar, m.desc_en)}</div>
                            </div>
                            {active && <CheckCircle2 size={20} className="text-[#C9A24A]" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      {method === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-[#8B9D8A] uppercase tracking-widest mb-1.5">{t('رقم البطاقة', 'Card Number')}</label>
                            <div className="relative">
                              <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C9A24A] transition-all" />
                              <CreditCard size={18} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A]" style={{ insetInlineEnd: '14px' }} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-[#8B9D8A] uppercase tracking-widest mb-1.5">{t('تاريخ الانتهاء', 'Expiry Date')}</label>
                              <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C9A24A] transition-all" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-[#8B9D8A] uppercase tracking-widest mb-1.5">CVV</label>
                              <div className="relative">
                                <input type="text" placeholder="***" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C9A24A] transition-all" />
                                <Lock size={14} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A]" style={{ insetInlineEnd: '14px' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {method === 'ibanking' && (
                        <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center">
                          <Building2 size={32} className="mx-auto mb-3 text-[#C9A24A] opacity-50" />
                          <p className="text-[#3A5A50] text-sm font-medium">{t('سيتم تحويلك إلى بوابة الدفع البنكي الآمنة عند النقر على إتمام الدفع.', 'You will be redirected to the secure bank portal upon clicking pay.')}</p>
                        </div>
                      )}

                      {method === 'bank_transfer' && (
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle size={18} className="text-[#C9A24A]" />
                            <h4 className="text-sm font-bold text-[#062B24]">{t('تفاصيل الحساب البنكي', 'Bank Account Details')}</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs"><span className="text-[#8B9D8A]">{t('اسم البنك', 'Bank Name')}</span><span className="font-bold text-[#3A5A50]">Academy International Bank</span></div>
                            <div className="flex justify-between text-xs"><span className="text-[#8B9D8A]">IBAN</span><span className="font-bold text-[#3A5A50]">SA00 0000 0000 0000 0000 0000</span></div>
                            <div className="flex justify-between text-xs"><span className="text-[#8B9D8A]">{t('اسم المستفيد', 'Beneficiary')}</span><span className="font-bold text-[#3A5A50]">Higher Academy of Symbols</span></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handlePayment}
                      className="w-full py-4 rounded-2xl bg-[#C9A24A] text-[#062B24] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D8B75B] transition-all shadow-lg"
                    >
                      <ShieldCheck size={18} />
                      {t('إتمام الدفع الآن', 'Complete Payment Now')}
                    </button>
                    <p className="text-center text-[10px] text-[#8B9D8A] uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                      <Lock size={12} />
                      {t('تشفير آمن وحماية كاملة للبيانات', 'SECURE ENCRYPTION & FULL DATA PROTECTION')}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-12 text-center border border-[rgba(6,43,36,0.08)] shadow-xl"
                >
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-[#C9A24A] border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-[#C9A24A]">
                      <Landmark size={32} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-[#062B24] mb-3">{t('جاري معالجة طلبك', 'Processing Your Request')}</h2>
                  <p className="text-[#8B9D8A] text-sm leading-relaxed max-w-sm mx-auto">
                    {t('يرجى الانتظار بينما نقوم بتأمين بياناتك وإرسال طلب الاشتراك إلى فريق الإدارة...', 'Please wait while we secure your data and send your enrollment request to the admin team...')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#062B24] rounded-3xl p-6 border border-[rgba(201,162,74,0.3)] shadow-2xl sticky top-28 relative overflow-hidden">
               <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.6} tileSize={50} />
              <h3 className="text-[#F0D98A] font-bold mb-6 relative z-10">{t('ملخص الدفع', 'Payment Summary')}</h3>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center py-3 border-b border-[rgba(201,162,74,0.15)]">
                  <span className="text-[#8B9D8A] text-xs">{t('سعر المحاضرة', 'Lecture Price')}</span>
                  <span className="text-[#F8F4EA] font-bold text-sm">${lecture.price}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[rgba(201,162,74,0.15)]">
                  <span className="text-[#8B9D8A] text-xs">{t('الضريبة (0%)', 'VAT (0%)')}</span>
                  <span className="text-[#F8F4EA] font-bold text-sm">$0.00</span>
                </div>
                <div className="flex justify-between items-center py-6">
                  <span className="text-[#F0D98A] font-bold">{t('الإجمالي', 'Total Amount')}</span>
                  <span className="text-[#F0D98A] text-2xl font-bold">${lecture.price}</span>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-[rgba(201,162,74,0.1)] border border-[rgba(201,162,74,0.2)] relative z-10">
                <div className="flex items-center gap-2 mb-2 text-[#C9A24A]">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('ضمان الأكاديمية', 'Academy Guarantee')}</span>
                </div>
                <p className="text-[#8B9D8A] text-[10px] leading-relaxed">
                  {t('جميع عمليات الدفع محمية بسياسة الخصوصية الخاصة بنا. يتم تنشيط الكورسات بعد مراجعة الإدارة للعملية.', 'All payments are protected by our privacy policy. Courses are activated after admin review.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
