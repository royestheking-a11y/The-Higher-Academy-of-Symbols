import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { ArrowRight, ArrowLeft, CheckCircle, MapPin, CreditCard, User, ShoppingBag } from 'lucide-react';

const BRAND = { deep: '#062B24', primary: '#1B4D42', secondary: '#3A5A50', accent: '#7BBFAD', gold: '#C9A24A', light: '#F8F4EA' };
const SHIPPING_CHARGE = 20;

export default function StoreCheckout() {
  const { t, isRTL } = useLanguage();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(currentUser ? 2 : 1);
  const [address, setAddress] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '', country: 'United Arab Emirates', city: 'Dubai', address: '', postalCode: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleNext = () => {
    if (step === 1 && !currentUser) {
      // Force them to login page but pass a return URL (simple simulation here)
      navigate('/login?redirect=/store/checkout');
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const res = await fetch(baseUrl ? `${baseUrl}/api/orders` : '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          customerDetails: address,
          items: cartItems.map(item => ({ bookId: item.bookId, quantity: item.quantity, price: item.price })),
          totalAmount: cartTotal + SHIPPING_CHARGE
        })
      });
      if (res.ok) {
        clearCart();
        setOrderComplete(true);
        setStep(4);
      } else {
        alert(t('حدث خطأ أثناء معالجة الطلب', 'An error occurred while processing the order.'));
      }
    } catch (err) {
      alert(t('خادم غير متاح', 'Server unavailable'));
    }
    setIsProcessing(false);
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-[#F8F4EA] flex flex-col items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <ShoppingBag size={64} className="text-[#C9A24A] opacity-50 mb-6" />
        <h2 className="text-2xl font-bold text-[#062B24] mb-2">{t('سلة التسوق فارغة', 'Your Cart is Empty')}</h2>
        <p className="text-[#5A7A70] mb-8">{t('تصفح المتجر وأضف بعض الكتب الرائعة.', 'Browse the store and add some great books.')}</p>
        <button onClick={() => navigate('/store')} className="px-8 py-3 rounded-xl bg-[#062B24] text-white font-bold hover:bg-[#1B4D42] transition-colors">
          {t('العودة للمتجر', 'Return to Store')}
        </button>
      </div>
    );
  }

  const steps = [
    { id: 1, label: t('الحساب', 'Account'), icon: User },
    { id: 2, label: t('العنوان', 'Address'), icon: MapPin },
    { id: 3, label: t('الدفع', 'Payment'), icon: CreditCard },
    { id: 4, label: t('تأكيد', 'Confirm'), icon: CheckCircle },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F4EA]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#062B24] mb-8 text-center">{t('إتمام الطلب', 'Checkout')}</h1>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[rgba(6,43,36,0.1)] -z-10 -translate-y-1/2" />
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-[#F8F4EA] px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step >= s.id ? 'bg-[#C9A24A] text-white shadow-lg' : 'bg-white border-2 border-[rgba(6,43,36,0.1)] text-[#8B9D8A]'}`}>
                <s.icon size={18} />
              </div>
              <span className={`text-xs font-bold ${step >= s.id ? 'text-[#062B24]' : 'text-[#8B9D8A]'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 border border-[rgba(6,43,36,0.08)] shadow-sm">
              
              {/* STEP 1: LOGIN */}
              {step === 1 && (
                <div className="text-center py-8">
                  <User size={48} className="text-[#C9A24A] mx-auto mb-4 opacity-80" />
                  <h2 className="text-xl font-bold text-[#062B24] mb-2">{t('تسجيل الدخول مطلوب', 'Login Required')}</h2>
                  <p className="text-[#5A7A70] mb-8">{t('يرجى تسجيل الدخول أو إنشاء حساب لمتابعة عملية الشراء.', 'Please login or create an account to continue.')}</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => navigate('/login?redirect=/store/checkout')} className="px-6 py-3 rounded-xl bg-[#062B24] text-white font-bold">{t('تسجيل الدخول', 'Login')}</button>
                    <button onClick={() => navigate('/register')} className="px-6 py-3 rounded-xl border border-[rgba(6,43,36,0.2)] text-[#062B24] font-bold">{t('حساب جديد', 'Register')}</button>
                  </div>
                </div>
              )}

              {/* STEP 2: ADDRESS */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#062B24] mb-4 border-b border-[rgba(6,43,36,0.08)] pb-4">{t('معلومات الشحن', 'Shipping Information')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder={t('الاسم الكامل', 'Full Name')} value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[rgba(6,43,36,0.1)] outline-none focus:border-[#C9A24A]" />
                    <input type="email" placeholder={t('البريد الإلكتروني', 'Email')} value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[rgba(6,43,36,0.1)] outline-none focus:border-[#C9A24A]" />
                    <input type="tel" placeholder={t('رقم الهاتف', 'Phone')} value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[rgba(6,43,36,0.1)] outline-none focus:border-[#C9A24A]" />
                    <input type="text" placeholder={t('الدولة', 'Country')} value={address.country} readOnly className="w-full px-4 py-3 rounded-xl border border-[rgba(6,43,36,0.1)] outline-none bg-gray-50 text-gray-500 cursor-not-allowed" />
                    <input type="text" placeholder={t('المدينة', 'City')} value={address.city} readOnly className="w-full px-4 py-3 rounded-xl border border-[rgba(6,43,36,0.1)] outline-none bg-gray-50 text-gray-500 cursor-not-allowed" />
                    <input type="text" placeholder={t('الرمز البريدي (اختياري)', 'Postal Code (Optional)')} value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[rgba(6,43,36,0.1)] outline-none focus:border-[#C9A24A]" />
                  </div>
                  <input type="text" placeholder={t('العنوان التفصيلي', 'Detailed Address')} value={address.address} onChange={e => setAddress({...address, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[rgba(6,43,36,0.1)] outline-none focus:border-[#C9A24A]" />
                  
                  <div className="flex justify-end pt-4">
                    <button onClick={handleNext} disabled={!address.name || !address.email || !address.phone || !address.city || !address.address} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#062B24] text-white font-bold disabled:opacity-50">
                      {t('التالي', 'Next')} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#062B24] mb-4 border-b border-[rgba(6,43,36,0.08)] pb-4">{t('طريقة الدفع', 'Payment Method')}</h2>
                  
                  <div className="p-4 border-2 border-[#C9A24A] rounded-xl bg-[rgba(201,162,74,0.05)] cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-[5px] border-[#C9A24A] bg-white" />
                      <span className="font-bold text-[#062B24]">{t('تحويل بنكي / الدفع عند الاستلام', 'Bank Transfer / Cash on Delivery')}</span>
                    </div>
                    <CreditCard className="text-[#C9A24A]" />
                  </div>

                  <p className="text-sm text-[#5A7A70] p-4 bg-gray-50 rounded-xl border border-gray-100 leading-relaxed">
                    {t('يرجى ملاحظة أنه سيتم التواصل معك عبر رقم الهاتف المسجل لتأكيد الطلب وتحديد آلية الدفع والاستلام الأنسب.', 'Please note that you will be contacted via the registered phone number to confirm the order and arrange the payment and delivery mechanism.')}
                  </p>

                  <div className="flex justify-between pt-4">
                    <button onClick={handleBack} className="px-8 py-3 rounded-xl text-[#5A7A70] font-bold hover:bg-gray-100">{t('رجوع', 'Back')}</button>
                    <button onClick={handlePlaceOrder} disabled={isProcessing} className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#C9A24A] to-[#D8B75B] text-[#062B24] font-bold min-w-[150px]">
                      {isProcessing ? t('جاري المعالجة...', 'Processing...') : t('تأكيد الطلب', 'Place Order')}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION */}
              {step === 4 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[rgba(37,211,102,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-[#25D366]" />
                  </div>
                  <h2 className="text-2xl font-black text-[#062B24] mb-3">{t('تم تأكيد طلبك بنجاح!', 'Order Confirmed Successfully!')}</h2>
                  <p className="text-[#5A7A70] mb-8">{t('سنتواصل معك قريباً لتأكيد وتجهيز شحنتك.', 'We will contact you shortly to confirm and prepare your shipment.')}</p>
                  <button onClick={() => navigate('/store')} className="px-8 py-3 rounded-xl bg-[#062B24] text-white font-bold">
                    {t('العودة للمتجر', 'Return to Store')}
                  </button>
                </div>
              )}

            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          {step < 4 && (
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl p-6 border border-[rgba(6,43,36,0.08)] sticky top-32">
                <h3 className="font-bold text-[#062B24] text-lg mb-4">{t('ملخص الطلب', 'Order Summary')}</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-12 h-16 bg-gray-100 rounded shrink-0 overflow-hidden">
                        {item.coverImage ? <img src={item.coverImage} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#062B24] truncate">{isRTL ? item.title_ar : item.title_en}</div>
                        <div className="text-xs text-[#8B9D8A]">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-bold text-[#C9A24A]">AED {item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[rgba(6,43,36,0.08)] pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-[#5A7A70]">
                    <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                    <span>AED {cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#5A7A70]">
                    <span>{t('الشحن (دبي)', 'Shipping (Dubai)')}</span>
                    <span>AED {SHIPPING_CHARGE}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-[#062B24] pt-2 border-t border-[rgba(6,43,36,0.08)]">
                    <span>{t('الإجمالي', 'Total')}</span>
                    <span className="text-[#C9A24A]">AED {cartTotal + SHIPPING_CHARGE}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
