import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';
import { toast } from 'sonner';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

export default function Contact() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { settings, addContactMessage } = useData();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    addContactMessage({ ...form, subject_ar: form.subject, subject_en: form.subject, message_ar: form.message, message_en: form.message });
    setSent(true);
    setLoading(false);
    toast.success(t('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', 'Your message was sent successfully! We\'ll respond soon.'));
  };

  const contactInfo = [
    { icon: MapPin, label_ar: 'العنوان', label_en: 'Address', value_ar: settings.address_ar, value_en: settings.address_en },
    { icon: Phone, label_ar: 'الهاتف', label_en: 'Phone', value_ar: `${settings.phone1} | ${settings.phone2}`, value_en: `${settings.phone1} | ${settings.phone2}` },
    { icon: Mail, label_ar: 'البريد الإلكتروني', label_en: 'Email', value_ar: settings.email, value_en: settings.email },
    { icon: Clock, label_ar: 'أوقات العمل', label_en: 'Working Hours', value_ar: 'الأحد - الخميس، 9 ص - 5 م', value_en: 'Sun - Thu, 9AM - 5PM' },
  ];

  return (
    <div style={{ background: BRAND.ivory, fontFamily, minHeight: '100vh' }}>
      {/* Hero */}
      <div className="relative pt-36 pb-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
            {t('تواصل معنا', 'Contact Us')}
          </div>
          <h1 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '700' }}>
            {t('هل لديك أسئلة؟', 'Do You Have Questions?')}
          </h1>
          <p className="text-[#A0B9B0] text-base max-w-xl mx-auto">
            {t('نحن هنا للإجابة على أسئلتك ومساعدتك في اختيار البرنامج المناسب.', 'We are here to answer your questions and guide you to the right program.')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
            <div className="p-7 rounded-3xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})`, border: '1px solid rgba(201,162,74,0.25)' }}>
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
              <h2 className="text-[#F0D98A] font-semibold mb-6 text-base">{t('معلومات التواصل', 'Contact Information')}</h2>
              <div className="space-y-5">
                {contactInfo.map((item, i) => {
                  const IconComp = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.25)' }}>
                        <IconComp size={18} className="text-[#C9A24A]" />
                      </div>
                      <div>
                        <div className="text-[#8B9D8A] text-xs mb-1">{t(item.label_ar, item.label_en)}</div>
                        <div className="text-[#E8DDC7] text-sm font-medium">{t(item.value_ar, item.value_en)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social */}
            <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)' }}>
              <p className="text-[#5A7A70] text-sm text-center">
                {t('يسعدنا التواصل معك عبر البريد الإلكتروني أو الهاتف في أي وقت.', 'We\'re happy to connect with you via email or phone at any time.')}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <div className="p-8 rounded-3xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
              {sent ? (
                <div className="py-16 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <CheckCircle size={60} className="text-[#C9A24A] mx-auto mb-5" />
                  </motion.div>
                  <h3 className="text-[#062B24] font-bold text-lg mb-2" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
                    {t('شكراً لتواصلك!', 'Thank You for Reaching Out!')}
                  </h3>
                  <p className="text-[#5A7A70] text-sm">
                    {t('تم استلام رسالتك وسيتواصل معك فريقنا قريباً.', 'Your message has been received and our team will contact you soon.')}
                  </p>
                  <button onClick={() => setSent(false)} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep }}>
                    {t('إرسال رسالة أخرى', 'Send Another Message')}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-[#062B24] font-bold mb-6 text-lg" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
                    {t('أرسل لنا رسالة', 'Send Us a Message')}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">{t('الاسم الكامل *', 'Full Name *')}</label>
                        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none transition-all" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#C9A24A'} onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(6,43,36,0.12)'} />
                      </div>
                      <div>
                        <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">{t('البريد الإلكتروني *', 'Email *')}</label>
                        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none transition-all" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#C9A24A'} onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(6,43,36,0.12)'} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">{t('الهاتف', 'Phone')}</label>
                        <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }} />
                      </div>
                      <div>
                        <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">{t('الموضوع *', 'Subject *')}</label>
                        <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#3A5A50] text-xs font-semibold mb-2 uppercase tracking-wide">{t('الرسالة *', 'Message *')}</label>
                      <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none resize-none" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', fontFamily }} />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-semibold transition-all"
                      style={{ background: loading ? 'rgba(201,162,74,0.5)' : 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: loading ? 'none' : '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.15)' }}
                      onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(2px)', (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 0 #8B6B20, 0 3px 10px rgba(0,0,0,0.15)')}
                      onMouseLeave={e => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)', (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.15)')}
                    >
                      {loading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#062B24] border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Send size={17} />
                          {t('إرسال الرسالة', 'Send Message')}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}