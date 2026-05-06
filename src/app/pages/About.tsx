import { CheckCircle2, Target, Eye, Heart, Lightbulb, Shield, Star, Award, BookOpen, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

function PhoenixSymbol({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="opacity-20">
      <circle cx="60" cy="60" r="55" stroke="#C9A24A" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M60 20C50 20 38 30 38 42c0 8 5 15 14 21l8 5 8-5c9-6 14-13 14-21 0-12-12-22-22-22z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.08)"/>
      <path d="M60 50L46 82h6l8-16 8 16h6L60 50z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.08)"/>
      <circle cx="60" cy="34" r="5" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.15)"/>
    </svg>
  );
}

export default function About() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { settings } = useData();

  const coreValues = [
    { icon: Shield, title_ar: 'النزاهة والأمانة', title_en: 'Integrity and Honesty', desc_ar: 'نلتزم بأعلى معايير الأمانة الأكاديمية والنزاهة العلمية في كل ما نقدمه.', desc_en: 'We adhere to the highest standards of academic integrity and scientific honesty in everything we provide.' },
    { icon: Award, title_ar: 'التميز', title_en: 'Excellence', desc_ar: 'نسعى إلى التميز في كل جانب من جوانب العملية التعليمية والبحثية.', desc_en: 'We strive for excellence in every aspect of the educational and research process.' },
    { icon: Heart, title_ar: 'المسؤولية والشفافية والمساواة', title_en: 'Responsibility, Transparency & Equality', desc_ar: 'نؤمن بالمسؤولية المجتمعية والشفافية الكاملة والمساواة بين جميع الطلاب.', desc_en: 'We believe in social responsibility, full transparency, and equality among all students.' },
    { icon: Lightbulb, title_ar: 'الابتكار والإبداع', title_en: 'Innovation and Creativity', desc_ar: 'نشجع التفكير الإبداعي والمناهج المبتكرة في دراسة الرمزية والعلوم الإنسانية.', desc_en: 'We encourage creative thinking and innovative approaches in the study of symbolism and humanities.' },
  ];

  const goals = [
    { ar: 'تأسيس الدراسات الرمزية في العالم العربي', en: 'Establishing symbolic studies in the Arab world', status: 'current' },
    { ar: 'جعل العربية اللغة الأكاديمية الرسمية للحقل', en: 'Making Arabic the official academic language of the field', status: 'current' },
    { ar: 'بناء حوكمة ذكية للمؤسسة التعليمية', en: 'Building smart governance for the educational institution', status: 'progress' },
    { ar: 'تعزيز البحث الإنساني المتمركز حول الإنسان', en: 'Enhancing human-centered research', status: 'progress' },
    { ar: 'إعداد باحثين جادين ومتخصصين', en: 'Preparing serious and specialized researchers', status: 'current' },
    { ar: 'جمع الدراسات الرمزية العربية وترجمتها', en: 'Collecting and translating Arabic symbolic studies', status: 'future' },
  ];

  const statusStyles: Record<string, { bg: string; color: string; label_ar: string; label_en: string }> = {
    current: { bg: 'rgba(201,162,74,0.15)', color: '#C9A24A', label_ar: 'جارٍ', label_en: 'Current' },
    progress: { bg: 'rgba(18,63,54,0.2)', color: '#7BBFAD', label_ar: 'قيد التنفيذ', label_en: 'In Progress' },
    future: { bg: 'rgba(6,43,36,0.15)', color: '#4A8B7A', label_ar: 'خطة مستقبلية', label_en: 'Future Plan' },
  };

  const timeline = [
    { year: '2023', title_ar: 'فكرة التأسيس', title_en: 'Founding Idea', desc_ar: 'ولدت فكرة الأكاديمية العليا للرموز من رحم البحث العلمي في الدراسات الرمزية.', desc_en: 'The idea of The Higher Academy of Symbols was born from scientific research in symbolic studies.' },
    { year: '2024', title_ar: 'التأسيس الرسمي', title_en: 'Official Founding', desc_ar: 'انطلقت الأكاديمية رسمياً وبدأت بتقديم أولى محاضراتها الأكاديمية.', desc_en: 'The Academy officially launched and began offering its first academic lectures.' },
    { year: '2025', title_ar: 'أولى النشرات البحثية', title_en: 'First Research Publications', desc_ar: 'صدرت أولى المقالات البحثية للأكاديمية في مجال الرمزية والسيميائيات.', desc_en: 'The Academy published its first research articles in symbolism and semiotics.' },
    { year: '2026+', title_ar: 'التوسع المستقبلي', title_en: 'Future Expansion', desc_ar: 'خطط طموحة للتوسع والتعاون مع الجامعات العربية والدولية.', desc_en: 'Ambitious plans for expansion and collaboration with Arab and international universities.' },
  ];

  return (
    <div style={{ background: BRAND.ivory, fontFamily, minHeight: '100vh' }}>
      {/* Hero */}
      <div className="relative pt-36 pb-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden opacity-10 pe-8 pointer-events-none">
          <PhoenixSymbol size={300} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
            {t('عن الأكاديمية', 'About the Academy')}
          </div>
          <h1 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '700' }}>
            {t('الأكاديمية العليا للرموز', 'The Higher Academy of Symbols')}
          </h1>
          <p className="text-[#A0B9B0] text-base max-w-2xl leading-relaxed">{t(settings?.aboutText_ar ?? '', settings?.aboutText_en ?? '')}</p>
        </div>
      </div>

      {/* Overview */}
      <section className="py-20" style={{ background: BRAND.ivory }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
            <motion.div initial={{ opacity: 0, x: isRTL ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
                {/* Logo — occupies top 60% of the card */}
                <div className="absolute inset-x-0 top-0 flex items-center justify-center p-8" style={{ height: '62%' }}>
                  <img
                    src="/symbolacademy.png"
                    alt="The Higher Academy of Symbols"
                    style={{ width: '54%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 22px rgba(201,162,74,0.5))' }}
                  />
                </div>
                {/* Stats — pinned to bottom 38% of the card */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end" style={{ height: '42%' }}>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ num: '1000+', ar: 'طالب', en: 'Students' }, { num: '6+', ar: 'محاضرة', en: 'Lectures' }, { num: '10+', ar: 'مجال', en: 'Fields' }, { num: '5★', ar: 'التقييم', en: 'Rating' }].map((s, i) => (
                      <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(6,43,36,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(201,162,74,0.25)' }}>
                        <div className="text-[#F0D98A] font-bold">{s.num}</div>
                        <div className="text-[#8B9D8A] text-xs">{t(s.ar, s.en)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h2 className="text-[#062B24] mb-4" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700' }}>
                {t('من نحن؟', 'Who Are We?')}
              </h2>
              <p className="text-[#3A5A50] text-sm leading-relaxed mb-4">{t(settings?.aboutText_ar ?? '', settings?.aboutText_en ?? '')}</p>
              <p className="text-[#3A5A50] text-sm leading-relaxed mb-6">
                {t('تأسست الأكاديمية العليا للرموز برؤية واضحة: أن تكون المرجع الأول في العالم العربي لدراسة الرمز والسيميائيات والتفير، مع الحفاظ على المنهج العلمي المحايد والرصين.', 'The Higher Academy of Symbols was founded with a clear vision: to be the primary reference in the Arab world for the study of symbolism, semiotics, and cryptography, while maintaining a neutral and rigorous scientific approach.')}
              </p>
              <div className="space-y-2">
                {['منهج علمي محايد ورصين', 'بيئة بحثية داعمة ومحفزة', 'خبراء متخصصون في حقل الرمزية', 'اعتماد اللغة العربية معرفياً وأكاديمياً'].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#3A5A50] text-sm">
                    <CheckCircle2 size={15} className="text-[#C9A24A] shrink-0" />
                    {t(b, ['Neutral and rigorous scientific approach', 'Supportive and stimulating research environment', 'Specialized experts in the field of symbolism', 'Adopting Arabic academically and epistemically'][i])}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 relative overflow-hidden" style={{ background: BRAND.deep }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.8} tileSize={80} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-[#F0D98A] text-center mb-10" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700' }}>
            {t('الرؤية والرسالة', 'Vision & Mission')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ icon: Eye, title_ar: 'الرؤية', title_en: 'Vision', text_ar: settings?.vision_ar ?? '', text_en: settings?.vision_en ?? '' }, { icon: Target, title_ar: 'الرسالة', title_en: 'Mission', text_ar: settings?.mission_ar ?? '', text_en: settings?.mission_en ?? '' }].map((item, i) => {
              const IconComp = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative p-8 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B3A31, #123F36)', border: '1px solid rgba(201,162,74,0.25)' }}>
                  <div className="absolute -bottom-6 -end-6 opacity-10"><PhoenixSymbol size={100} /></div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)' }}>
                    <IconComp size={22} className="text-[#C9A24A]" />
                  </div>
                  <h3 className="text-[#F0D98A] mb-3 text-lg font-bold" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>{t(item.title_ar, item.title_en)}</h3>
                  <p className="text-[#A0B9B0] text-sm leading-relaxed">{t(item.text_ar, item.text_en)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16" style={{ background: BRAND.sand }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-[#062B24]" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700' }}>
              {t('القيم الجوهرية', 'Core Values')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((val, i) => {
              const IconComp = val.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl transition-all hover:-translate-y-1" style={{ background: BRAND.ivory, border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.25)' }}>
                    <IconComp size={22} className="text-[#C9A24A]" />
                  </div>
                  <h3 className="text-[#062B24] font-semibold mb-2 text-sm">{t(val.title_ar, val.title_en)}</h3>
                  <p className="text-[#5A7A70] text-xs leading-relaxed">{t(val.desc_ar, val.desc_en)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Goals Timeline */}
      <section className="py-16" style={{ background: BRAND.ivory }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-[#062B24]" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700' }}>
              {t('أهداف الأكاديمية', 'Academy Goals')}
            </h2>
          </div>
          <div className="space-y-4">
            {goals.map((goal, i) => {
              const st = statusStyles[goal.status];
              return (
                <motion.div key={i} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5" style={{ background: 'rgba(201,162,74,0.15)', color: BRAND.gold }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-[#062B24] text-sm font-medium">{t(goal.ar, goal.en)}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs shrink-0" style={{ background: st.bg, color: st.color }}>
                    {t(st.label_ar, st.label_en)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academy Timeline */}
      <section className="py-16 relative overflow-hidden" style={{ background: BRAND.deep }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.8} tileSize={80} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-[#F0D98A] text-center mb-10" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700' }}>
            {t('مسيرتنا', 'Our Journey')}
          </h2>
          <div className="relative">
            <div className="absolute start-7 top-0 bottom-0 w-px" style={{ background: 'rgba(201,162,74,0.3)' }} />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-6 ps-16 relative">
                  <div className="absolute start-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: BRAND.gold, color: BRAND.deep, boxShadow: '0 0 0 4px rgba(201,162,74,0.2)' }}>
                    {item.year.slice(0, 4)}
                  </div>
                  <div className="p-5 rounded-2xl flex-1" style={{ background: 'rgba(11,58,49,0.6)', border: '1px solid rgba(201,162,74,0.2)' }}>
                    <div className="text-[#F0D98A] font-semibold mb-1 text-sm">{t(item.title_ar, item.title_en)}</div>
                    <div className="text-[#8B9D8A] text-xs leading-relaxed">{t(item.desc_ar, item.desc_en)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="py-16" style={{ background: BRAND.ivory }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center`}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <div className="relative p-8 rounded-3xl text-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})`, border: '1px solid rgba(201,162,74,0.3)' }}>
                <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
                <div className="absolute -top-5 -end-5 opacity-10"><PhoenixSymbol size={80} /></div>
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.2)', border: '3px solid rgba(201,162,74,0.4)' }}>
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none"><circle cx="25" cy="18" r="10" fill="rgba(201,162,74,0.25)" stroke="#C9A24A" strokeWidth="1.5"/><path d="M8 42c0-9 8-17 17-17s17 8 17 17" fill="rgba(201,162,74,0.15)" stroke="#C9A24A" strokeWidth="1.5"/></svg>
                </div>
                <h3 className="text-[#F0D98A] font-bold text-base mb-1" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>{t(settings?.founderName_ar ?? '', settings?.founderName_en ?? '')}</h3>
                <p className="text-[#C9A24A] text-xs">{t(settings?.founderTitle_ar ?? '', settings?.founderTitle_en ?? '')}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h2 className="text-[#062B24] mb-4" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: '700' }}>
                {t('رسالة المؤسِّسة', "Founder's Message")}
              </h2>
              <p className="text-[#3A5A50] text-sm leading-relaxed mb-4">{t(settings?.founderBio_ar ?? '', settings?.founderBio_en ?? '')}</p>
              <p className="text-[#3A5A50] text-sm leading-relaxed italic" style={{ fontFamily: isRTL ? 'Amiri, serif' : 'Cormorant Garamond, serif' }}>
                {t('"الأكاديمية العليا للرموز ليست مجرد مؤسسة تعليمية، بل هي مشروع حضاري يهدف إلى إعادة الاعتبار للتراث العلمي العربي في مجال الرمزية والتشفير."', '"The Higher Academy of Symbols is not just an educational institution, but a civilizational project aimed at restoring recognition of the Arab scientific heritage in the field of symbolism and cryptography."')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}