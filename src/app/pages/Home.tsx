import { useRef } from 'react';
import { Link } from 'react-router';
import {
  BookOpen, Star, Eye, Lock, ScrollText, FileText, Compass, PenLine,
  MessageSquare, Pen, ArrowRight, ArrowLeft, GraduationCap, Users, Award,
  Globe, FlaskConical, ChevronRight, ChevronLeft, Clock, BarChart3, Play,
  Quote, CheckCircle2, Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';
import { Skeleton } from '../components/Skeleton';
const logoImg = '/symbolacademy.png';

const AREA_ICONS: Record<string, any> = {
  Star, Eye, BookOpen, PenLine, MessageSquare, Lock, ScrollText, FileText, Compass, Pen,
};

const BRAND = {
  deep: '#062B24',
  mid: '#0B3A31',
  light: '#123F36',
  gold: '#C9A24A',
  goldMid: '#D8B75B',
  goldLight: '#F0D98A',
  ivory: '#F8F4EA',
  cream: '#FFF9EC',
  charcoal: '#1E1E1E',
  sand: '#E8DDC7',
};

function GoldArrow({ isRTL }: { isRTL: boolean }) {
  return isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />;
}

function PremiumBtn({ children, onClick, variant = 'gold', href }: { children: React.ReactNode; onClick?: () => void; variant?: 'gold' | 'outline'; href?: string }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
  };
  const gold = {
    ...base,
    background: 'linear-gradient(145deg, #D8B75B, #C9A24A)',
    color: '#062B24',
    boxShadow: '0 5px 0 #8B6B20, 0 7px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
  };
  const outline = {
    ...base,
    background: 'transparent',
    color: BRAND.goldLight,
    boxShadow: '0 3px 0 rgba(201,162,74,0.3)',
    border: `1px solid rgba(201,162,74,0.5)`,
  };
  const style = variant === 'gold' ? gold : outline;

  const handleMouseEnter = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (variant === 'gold') {
      el.style.transform = 'translateY(3px)';
      el.style.boxShadow = '0 2px 0 #8B6B20, 0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
    } else {
      el.style.background = 'rgba(201,162,74,0.1)';
    }
  };
  const handleMouseLeave = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (variant === 'gold') {
      el.style.transform = 'translateY(0)';
      el.style.boxShadow = '0 5px 0 #8B6B20, 0 7px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)';
    } else {
      el.style.background = 'transparent';
    }
  };

  if (href) {
    return (
      <Link to={href} style={style as any} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </Link>
    );
  }
  return (
    <button style={style as any} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </button>
  );
}

function PhoenixSymbol() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="opacity-30">
      <circle cx="60" cy="60" r="55" stroke="#C9A24A" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="60" cy="60" r="42" stroke="#C9A24A" strokeWidth="0.5" />
      <path d="M60 20C50 20 38 30 38 42c0 8 5 15 14 21l8 5 8-5c9-6 14-13 14-21 0-12-12-22-22-22z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.08)" />
      <path d="M60 50L46 82h6l8-16 8 16h6L60 50z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.08)" />
      <circle cx="60" cy="34" r="5" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.15)" />
      <line x1="60" y1="5" x2="60" y2="15" stroke="#C9A24A" strokeWidth="1" />
      <line x1="60" y1="105" x2="60" y2="115" stroke="#C9A24A" strokeWidth="1" />
      <line x1="5" y1="60" x2="15" y2="60" stroke="#C9A24A" strokeWidth="1" />
      <line x1="105" y1="60" x2="115" y2="60" stroke="#C9A24A" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <circle key={angle} cx={60 + 55 * Math.cos((angle * Math.PI) / 180)} cy={60 + 55 * Math.sin((angle * Math.PI) / 180)} r="2" fill="#C9A24A" opacity="0.4" />
      ))}
    </svg>
  );
}

// GeometricPattern replaced by GeometricBackground component

function HeroSection() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { settings } = useData();

  const floatingCards = [
    { label_ar: 'الرمزية', label_en: 'Symbolism', icon: Star, delay: 0 },
    { label_ar: 'السيميائيات', label_en: 'Semiotics', icon: Eye, delay: 0.15 },
    { label_ar: 'التشفير', label_en: 'Cryptography', icon: Lock, delay: 0.3 },
    { label_ar: 'الاختزال', label_en: 'Shorthand', icon: PenLine, delay: 0.45 },
    { label_ar: 'البحث العلمي', label_en: 'Research', icon: FlaskConical, delay: 0.6 },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${BRAND.deep} 0%, ${BRAND.mid} 50%, ${BRAND.light} 100%)` }}
    >
      {/* Islamic Geometric Background */}
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#062B24]/40" />

      {/* Animated gold orbs */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: '#C9A24A' }} />
      <div className="absolute bottom-1/4 end-1/4 w-64 h-64 rounded-full opacity-5 blur-2xl" style={{ background: '#C9A24A' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-36 pb-16" style={{ fontFamily }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={isRTL ? 'lg:order-last' : ''}
          >
            {(!settings || !settings.heroTitle_ar) ? (
              <Skeleton.Hero />
            ) : (
              <>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A24A' }} />
                  <span className="text-[#C9A24A] text-xs font-medium tracking-widest uppercase">
                    {t('أكاديمية علمية بحثية', 'Scientific Research Academy')}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-4"
                  style={{
                    fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: isRTL ? '700' : '600',
                    color: BRAND.goldLight,
                    lineHeight: '1.2',
                  }}
                >
                  {t(settings?.heroTitle_ar ?? '', settings?.heroTitle_en ?? '')}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: BRAND.goldMid, fontWeight: '500', marginBottom: '16px' }}
                >
                  {t(settings?.heroSubtitle_ar ?? '', settings?.heroSubtitle_en ?? '')}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-[#A0B9B0] text-base leading-relaxed mb-8"
                  style={{ maxWidth: '520px' }}
                >
                  {t(settings?.heroDescription_ar ?? '', settings?.heroDescription_en ?? '')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <PremiumBtn href="/lectures" variant="gold">
                    <BookOpen size={16} />
                    {t('استكشف المحاضرات', 'Explore Lectures')}
                  </PremiumBtn>
                  <PremiumBtn href="/about" variant="outline">
                    {t('تعرّف على الأكاديمية', 'Discover the Academy')}
                    <GoldArrow isRTL={isRTL} />
                  </PremiumBtn>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-6 mt-10 pt-8"
                  style={{ borderTop: '1px solid rgba(201,162,74,0.2)' }}
                >
                  {[
                    { num: '1000+', label_ar: 'طالب مسجل', label_en: 'Enrolled Students' },
                    { num: '6+', label_ar: 'محاضرة أكاديمية', label_en: 'Academic Lectures' },
                    { num: '100%', label_ar: 'منهج علمي', label_en: 'Scientific Approach' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-[#F0D98A] text-xl font-bold">{stat.num}</div>
                      <div className="text-[#6B8B80] text-xs mt-0.5">{t(stat.label_ar, stat.label_en)}</div>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Visual Side — Real Logo */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow rings */}
            <div className="absolute w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,162,74,0.12) 0%, transparent 70%)' }} />
            <div className="absolute w-60 h-60 rounded-full" style={{ border: '1px solid rgba(201,162,74,0.2)' }} />
            <div className="absolute w-72 h-72 rounded-full" style={{ border: '1px dashed rgba(201,162,74,0.1)' }} />
            {/* Actual Logo */}
            <motion.div
              animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
              style={{ filter: 'drop-shadow(0 0 40px rgba(201,162,74,0.4)) drop-shadow(0 0 80px rgba(201,162,74,0.15))' }}
            >
              <img
                src={logoImg}
                alt="The Higher Academy of Symbols — Phoenix Emblem"
                style={{ width: 'min(260px, 72vw)', height: 'min(260px, 72vw)', objectFit: 'contain' }}
              />
            </motion.div>

            {/* Floating Field Cards — desktop only to avoid overflow */}
            {floatingCards.map((card, i) => {
              const angle = (i / floatingCards.length) * 360;
              const radius = 140;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const IconComp = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -6, 0],
                  }}
                  transition={{
                    opacity: { delay: card.delay + 0.5, duration: 0.5 },
                    scale: { delay: card.delay + 0.5, duration: 0.5 },
                    y: { delay: card.delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: 'rgba(11,58,49,0.9)',
                    border: '1px solid rgba(201,162,74,0.35)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transform: `translate(${x}px, ${y}px)`,
                    fontFamily,
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.2)' }}>
                    <IconComp size={14} className="text-[#C9A24A]" />
                  </div>
                  <span className="text-[#F0D98A] text-xs font-medium whitespace-nowrap">
                    {t(card.label_ar, card.label_en)}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#F8F4EA" />
        </svg>
      </div>
    </section>
  );
}

function TrustStrip() {
  const { t, isRTL, fontFamily } = useLanguage();
  const items = [
    { icon: Award, label_ar: 'أول أكاديمية عربية للرموز', label_en: 'First Arab Academy for Symbols' },
    { icon: FlaskConical, label_ar: 'تعليم قائم على البحث', label_en: 'Research-Based Education' },
    { icon: Globe, label_ar: 'التعلم بالعربية والإنجليزية', label_en: 'Arabic & English Learning' },
    { icon: GraduationCap, label_ar: 'محاضرات بقيادة خبراء', label_en: 'Expert-Led Lectures' },
    { icon: Target, label_ar: 'منهج أكاديمي محايد', label_en: 'Neutral Academic Approach' },
  ];

  return (
    <section className="py-10 relative z-10 overflow-hidden" style={{ background: BRAND.deep, fontFamily }}>
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.1} strokeWidth={0.6} tileSize={70} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item, i) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl text-center group transition-all hover:scale-105"
                style={{ background: 'rgba(11,58,49,0.6)', border: '1px solid rgba(201,162,74,0.2)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.15)' }}>
                  <IconComp size={20} className="text-[#C9A24A]" />
                </div>
                <span className="text-[#E8DDC7] text-xs font-medium leading-snug">{t(item.label_ar, item.label_en)}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { settings } = useData();
  const bullets = [

    { ar: 'منهج تعليمي علمي ومحايد', en: 'Scientific and neutral educational approach' },
    { ar: 'بيئة بحثية داعمة', en: 'Supportive research environment' },
    { ar: 'التركيز على مجتمع المعرفة العربية', en: 'Focus on Arab knowledge society' },
    { ar: 'التعاون مع الجامعات', en: 'Collaboration with universities' },
    { ar: 'اللغة العربية هوية أكاديمية أصيلة', en: 'Arabic language as a core academic identity' },
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BRAND.ivory, fontFamily }}>
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.06} strokeWidth={0.6} tileSize={90} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={isRTL ? 'order-last' : ''}
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.14} strokeWidth={0.7} tileSize={60} />
              {/* Logo — sits above the stat cards area */}
              <div className="absolute inset-x-0 top-0 bottom-[72px] flex items-center justify-center z-10">
                <img
                  src={logoImg}
                  alt="The Higher Academy of Symbols"
                  style={{ width: '52%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(201,162,74,0.35))' }}
                />
              </div>
              <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, transparent, rgba(6,43,36,0.4))' }} />
              {/* Floating stat cards — above logo layer */}
              <div className="absolute bottom-3 start-3 end-3 grid grid-cols-3 gap-1.5 z-20">
                {[
                  { num: '2024', label_ar: 'سنة التأسيس', label_en: 'Founded' },
                  { num: '10+', label_ar: 'مجال دراسي', label_en: 'Study Areas' },
                  { num: '5★', label_ar: 'تقييم الطلاب', label_en: 'Student Rating' },
                ].map((s, i) => (
                  <div key={i} className="py-2 px-1.5 rounded-xl text-center" style={{ background: 'rgba(6,43,36,0.9)', border: '1px solid rgba(201,162,74,0.3)', backdropFilter: 'blur(10px)' }}>
                    <div className="text-[#F0D98A] font-bold text-xs sm:text-sm">{s.num}</div>
                    <div className="text-[#8B9D8A] text-[10px] sm:text-xs mt-0.5">{t(s.label_ar, s.label_en)}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
              {t('من نحن', 'About Us')}
            </div>
            <h2 className="text-[#062B24] mb-4" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: '700', lineHeight: '1.25' }}>
              {t('الأكاديمية العليا للرموز', 'The Higher Academy of Symbols')}
            </h2>
            <p className="text-[#3A5A50] text-base leading-relaxed mb-6">
              {t(settings?.aboutText_ar ?? '', settings?.aboutText_en ?? '')}
            </p>
            <ul className="space-y-3 mb-8">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 size={17} className="text-[#C9A24A] shrink-0" />
                  <span className="text-[#3A5A50] text-sm">{t(b.ar, b.en)}</span>
                </motion.li>
              ))}
            </ul>
            <PremiumBtn href="/about" variant="gold">
              {t('اقرأ المزيد', 'Read More')}
              <GoldArrow isRTL={isRTL} />
            </PremiumBtn>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { settings } = useData();

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BRAND.deep, fontFamily }}>
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.14} strokeWidth={0.75} tileSize={80} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
            {t('هويتنا', 'Our Identity')}
          </div>
          <h2 className="text-[#F0D98A]" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700' }}>
            {t('الرؤية والرسالة', 'Vision & Mission')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Eye,
              title_ar: 'الرؤية',
              title_en: 'Vision',
              text_ar: settings?.vision_ar ?? '',
              text_en: settings?.vision_en ?? '',
            },
            {
              icon: Target,
              title_ar: 'الرسالة',
              title_en: 'Mission',
              text_ar: settings?.mission_ar ?? '',
              text_en: settings?.mission_en ?? '',
            },
          ].map((card, i) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 rounded-3xl group overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0B3A31, #123F36)',
                  border: '1px solid rgba(201,162,74,0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                {/* Logo watermark */}
                <div className="absolute -bottom-4 -end-4 opacity-[0.08]">
                  <img src={logoImg} alt="" style={{ width: 90, height: 90, objectFit: 'contain' }} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)' }}>
                    <IconComp size={26} className="text-[#C9A24A]" />
                  </div>
                  <h3 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: '700' }}>
                    {t(card.title_ar, card.title_en)}
                  </h3>
                  <p className="text-[#A0B9B0] text-sm leading-relaxed">
                    {t(card.text_ar, card.text_en)}
                  </p>
                </div>
                <div className="absolute bottom-0 start-0 end-0 h-0.5 opacity-0 group-hover:opacity-100 transition-all" style={{ background: 'linear-gradient(90deg, #C9A24A, #F0D98A, #C9A24A)' }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StudyAreasSection() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { areasOfStudy, loading } = useData();

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BRAND.sand, fontFamily }}>
      <GeometricBackground strokeColor="#8B6B20" strokeOpacity={0.1} strokeWidth={0.6} tileSize={80} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(6,43,36,0.08)', border: `1px solid rgba(6,43,36,0.2)`, color: BRAND.deep }}>
            {t('التخصصات الأكاديمية', 'Academic Specializations')}
          </div>
          <h2 className="text-[#062B24] mb-3" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700' }}>
            {t('مجالات الدراسة', 'Areas of Study')}
          </h2>
          <p className="text-[#3A5A50] text-base max-w-xl mx-auto">
            {t('اكتشف تخصصاتنا الأكاديمية المتنوعة في علوم الرمزية والسيميائيات والتشفير.', 'Discover our diverse academic specializations in symbolism, semiotics, and cryptography.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {(loading && (!areasOfStudy || areasOfStudy.length === 0)) ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Card key={i} theme="light" />
            ))
          ) : (
            ((areasOfStudy as any[]) || []).slice(0, 8).map((area: any, i: number) => {
              const IconComp = AREA_ICONS[area.icon] || Star;
              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={`/areas/${area.slug}`}
                    className="flex flex-col gap-4 p-5 rounded-2xl h-full group transition-all duration-300 block"
                    style={{
                      background: BRAND.ivory,
                      border: '1px solid rgba(6,43,36,0.1)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(201,162,74,0.5)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(6,43,36,0.15)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(6,43,36,0.1)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ background: 'rgba(6,43,36,0.08)' }}>
                      <IconComp size={22} className="text-[#062B24] group-hover:text-[#C9A24A] transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-[#062B24] font-semibold mb-1.5 text-sm">{t(area.name_ar, area.name_en)}</h3>
                      <p className="text-[#5A7A70] text-xs leading-relaxed line-clamp-3">{t(area.description_ar, area.description_en)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#C9A24A] text-xs font-medium mt-auto pt-2" style={{ borderTop: '1px solid rgba(201,162,74,0.15)' }}>
                      {t('استكشف', 'Learn More')}
                      <GoldArrow isRTL={isRTL} />
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="text-center">
          <PremiumBtn href="/areas-of-study" variant="gold">
            {t('عرض جميع المجالات', 'View All Areas')}
            <GoldArrow isRTL={isRTL} />
          </PremiumBtn>
        </div>
      </div>
    </section>
  );
}

function FeaturedLectures() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { getFeaturedLectures, loading } = useData();
  const lectures = getFeaturedLectures?.() ?? [];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BRAND.deep, fontFamily }}>
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.7} tileSize={85} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
              {t('أبرز المحاضرات', 'Featured Lectures')}
            </div>
            <h2 className="text-[#F0D98A]" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700' }}>
              {t('محاضراتنا الأكاديمية', 'Our Academic Lectures')}
            </h2>
          </div>
          <Link to="/lectures" className="flex items-center gap-2 text-[#C9A24A] hover:text-[#F0D98A] text-sm font-medium transition-colors shrink-0">
            {t('عرض الكل', 'View All')}
            <GoldArrow isRTL={isRTL} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading && lectures.length === 0) ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton.Card key={i} theme="dark" />
            ))
          ) : (
            lectures.slice(0, 6).map((lecture: any, i: number) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(145deg, #0B3A31, #123F36)',
                  border: '1px solid rgba(201,162,74,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.35)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'}
              >
                {/* Card Header - Abstract Visual */}
                <div className="relative h-44 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #062B24, #0B3A31)' }}>
                  <div className="opacity-20"><PhoenixSymbol /></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)' }}>
                      <BookOpen size={28} className="text-[#C9A24A]" />
                    </div>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-4 start-4 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(201,162,74,0.2)', border: '1px solid rgba(201,162,74,0.4)', color: '#F0D98A' }}>
                    {t(lecture.category_ar, lecture.category_en)}
                  </div>
                  {lecture.certificate && (
                    <div className="absolute top-4 end-4 px-2 py-1 rounded-full text-xs flex items-center gap-1" style={{ background: 'rgba(201,162,74,0.15)', color: '#C9A24A' }}>
                      <Award size={12} />
                      {t('شهادة', 'Cert')}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[#F8F4EA] font-semibold mb-2 text-sm leading-snug group-hover:text-[#F0D98A] transition-colors">
                    {t(lecture.title_ar, lecture.title_en)}
                  </h3>
                  <p className="text-[#8B9D8A] text-xs mb-3 line-clamp-2 leading-relaxed">
                    {t(lecture.description_ar, lecture.description_en)}
                  </p>
                  <div className="flex items-center gap-1 text-[#8B9D8A] text-xs mb-4">
                    <GraduationCap size={13} className="text-[#C9A24A]" />
                    {t(lecture.lecturer_ar, lecture.lecturer_en)}
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-3 gap-2 mb-4 py-3" style={{ borderTop: '1px solid rgba(201,162,74,0.15)', borderBottom: '1px solid rgba(201,162,74,0.15)' }}>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6B8B80] text-xs">
                        <Clock size={11} className="text-[#C9A24A]" />
                        {lecture.duration.split('/')[0].trim()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6B8B80] text-xs">
                        <Play size={11} className="text-[#C9A24A]" />
                        {lecture.lessonsCount} {t('درس', 'lessons')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#6B8B80] text-xs">
                        <Users size={11} className="text-[#C9A24A]" />
                        {lecture.enrolled}
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[#F0D98A] text-lg font-bold">${lecture.price}</span>
                      <span className="text-[#6B8B80] text-xs ms-1">{t('/ محاضرة', '/ lecture')}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={11} fill={s <= Math.floor(lecture.rating) ? '#C9A24A' : 'none'} className="text-[#C9A24A]" />
                      ))}
                      <span className="text-[#6B8B80] text-xs ms-1">({lecture.reviews})</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/lectures/${lecture.slug}`}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-center border transition-all hover:bg-[rgba(201,162,74,0.1)]"
                      style={{ borderColor: 'rgba(201,162,74,0.4)', color: '#C9A24A' }}
                    >
                      {t('التفاصيل', 'Details')}
                    </Link>
                    <Link
                      to={`/register`}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-center transition-all"
                      style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: '#062B24', boxShadow: '0 2px 0 #8B6B20' }}
                    >
                      {t('سجّل الآن', 'Register')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function FounderSection() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { settings } = useData();

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BRAND.ivory, fontFamily }}>
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.06} strokeWidth={0.6} tileSize={90} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>

          {/* Founder Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative ${isRTL ? 'lg:order-last' : ''}`}
          >
            <div
              className="relative p-8 rounded-3xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})`, border: '1px solid rgba(201,162,74,0.3)' }}
            >
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.65} tileSize={60} />
              <div className="absolute -top-6 -end-6 opacity-[0.08]">
                <img src={logoImg} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Avatar — logo */}
                <div
                  className="w-28 h-28 rounded-full mb-5 overflow-hidden"
                  style={{ border: '3px solid rgba(201,162,74,0.5)', boxShadow: '0 0 30px rgba(201,162,74,0.25)' }}
                >
                  <img src={logoImg} alt="Founder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="w-full mb-4 pb-4" style={{ borderBottom: '1px solid rgba(201,162,74,0.2)' }}>
                  <h3 className="text-[#F0D98A] text-lg font-bold mb-1" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
                    {t(settings?.founderName_ar ?? '', settings?.founderName_en ?? '')}
                  </h3>
                  <p className="text-[#C9A24A] text-sm">{t(settings?.founderTitle_ar ?? '', settings?.founderTitle_en ?? '')}</p>
                </div>
                <p className="text-[#A0B9B0] text-sm leading-relaxed">{t(settings?.founderBio_ar ?? '', settings?.founderBio_en ?? '')}</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
              {t('المؤسِّسة', 'The Founder')}
            </div>
            <h2 className="text-[#062B24] mb-4" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700' }}>
              {t('تعرّف على مؤسِّسة الأكاديمية', 'Meet the Academy Founder')}
            </h2>
            <div className="p-5 rounded-2xl mb-6 relative" style={{ background: 'rgba(6,43,36,0.05)', border: '1px solid rgba(6,43,36,0.1)' }}>
              <Quote size={28} className="text-[#C9A24A] mb-3 opacity-60" />
              <p className="text-[#3A5A50] text-base leading-relaxed italic" style={{ fontFamily: isRTL ? 'Amiri, serif' : 'Cormorant Garamond, serif' }}>
                {t(
                  'الأكاديمية العليا للرموز — حيث تتحول العلامات إلى معرفة منهجية راسخة.',
                  'The Higher Academy of Symbols — where signs become structured, enduring knowledge.'
                )}
              </p>
            </div>
            <p className="text-[#3A5A50] text-sm leading-relaxed mb-6">
              {t(settings?.founderBio_ar ?? '', settings?.founderBio_en ?? '')}
            </p>
            <PremiumBtn href="/about#founder" variant="gold">
              {t('رسالة المؤسِّسة', "Founder's Message")}
              <GoldArrow isRTL={isRTL} />
            </PremiumBtn>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArticlesSection() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { getPublishedArticles } = useData();
  const articles = getPublishedArticles?.() ?? [];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BRAND.sand, fontFamily }}>
      <GeometricBackground strokeColor="#8B6B20" strokeOpacity={0.09} strokeWidth={0.6} tileSize={85} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(6,43,36,0.08)', border: '1px solid rgba(6,43,36,0.2)', color: BRAND.deep }}>
              {t('المقالات البحثية', 'Research Articles')}
            </div>
            <h2 className="text-[#062B24]" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700' }}>
              {t('أحدث المقالات', 'Latest Articles')}
            </h2>
          </div>
          <Link to="/articles" className="flex items-center gap-2 text-[#C9A24A] hover:text-[#062B24] text-sm font-medium transition-colors shrink-0">
            {t('عرض الكل', 'View All')} <GoldArrow isRTL={isRTL} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.slice(0, 4).map((article: any, i: number) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/articles/${article.slug}`}
                className="flex flex-col h-full rounded-2xl overflow-hidden group transition-all duration-300 block"
                style={{ background: BRAND.ivory, border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Image area */}
                <div className="h-40 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                  <div className="opacity-20"><PhoenixSymbol /></div>
                  <div className="absolute top-3 start-3 px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.2)', color: '#F0D98A' }}>
                    {t(article.category_ar, article.category_en)}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[#062B24] text-sm font-semibold mb-2 line-clamp-2 group-hover:text-[#C9A24A] transition-colors leading-snug">
                    {t(article.title_ar, article.title_en)}
                  </h3>
                  <p className="text-[#5A7A70] text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
                    {t(article.excerpt_ar, article.excerpt_en)}
                  </p>
                  <div className="flex items-center justify-between text-[#8B9D8A] text-xs pt-3" style={{ borderTop: '1px solid rgba(6,43,36,0.08)' }}>
                    <span>{new Date(article.date).toLocaleDateString(t('ar-SA', 'en-US'))}</span>
                    <span>{article.readTime} {t('دقائق', 'min read')}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { getPublishedTestimonials } = useData();
  const testimonials = getPublishedTestimonials?.() ?? [];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BRAND.deep, fontFamily }}>
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.8} tileSize={80} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
            {t('آراء الطلاب', 'Student Reviews')}
          </div>
          <h2 className="text-[#F0D98A]" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700' }}>
            {t('ماذا يقول طلابنا؟', 'What Do Our Students Say?')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(0, 3).map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl relative"
              style={{ background: 'linear-gradient(145deg, #0B3A31, #123F36)', border: '1px solid rgba(201,162,74,0.2)' }}
            >
              <Quote size={24} className="text-[#C9A24A] opacity-50 mb-4" />
              <p className="text-[#B0C8C0] text-sm leading-relaxed mb-5 italic">
                "{t(item.message_ar, item.message_en)}"
              </p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(201,162,74,0.15)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#C9A24A] font-bold text-sm" style={{ background: 'rgba(201,162,74,0.2)' }}>
                  {(isRTL ? item.name : item.name_en).charAt(0)}
                </div>
                <div>
                  <div className="text-[#F0D98A] text-sm font-semibold">{isRTL ? item.name : item.name_en}</div>
                  <div className="text-[#6B8B80] text-xs">{t(item.course_ar, item.course_en)}</div>
                </div>
                <div className="ms-auto flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={11} fill={s <= item.rating ? '#C9A24A' : 'none'} className="text-[#C9A24A]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { t, isRTL, fontFamily } = useLanguage();

  return (
    <section className="py-20 relative overflow-hidden" style={{ fontFamily, background: BRAND.ivory }}>
      <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.05} strokeWidth={0.55} tileSize={90} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-12 rounded-3xl text-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${BRAND.deep} 0%, ${BRAND.mid} 100%)`,
            border: '1px solid rgba(201,162,74,0.3)',
            boxShadow: '0 20px 60px rgba(6,43,36,0.25)',
          }}
        >
          <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.16} strokeWidth={0.7} tileSize={70} />
          <div className="absolute -top-8 -start-8 opacity-[0.07]"><img src={logoImg} alt="" style={{ width: 100, height: 100, objectFit: 'contain' }} /></div>
          <div className="absolute -bottom-8 -end-8 opacity-[0.07]"><img src={logoImg} alt="" style={{ width: 100, height: 100, objectFit: 'contain' }} /></div>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(201,162,74,0.08), transparent 70%)' }} />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(201,162,74,0.4)' }}>
              <img src={logoImg} alt="Symbols Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700' }}>
              {t('هل لديك أسئلة؟', 'Do You Have Any Questions?')}
            </h2>
            <p className="text-[#A0B9B0] text-base mb-8 max-w-xl mx-auto">
              {t('نحن هنا للإجابة على أسئلتك ومساعدتك في اختيار البرنامج المناسب.', 'We are here to answer your questions and guide you to the right program.')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <PremiumBtn href="/contact" variant="gold">
                {t('تواصل معنا', 'Contact Us')}
                <GoldArrow isRTL={isRTL} />
              </PremiumBtn>
              <PremiumBtn href="/lectures" variant="outline">
                {t('استكشف المحاضرات', 'Explore Lectures')}
              </PremiumBtn>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <AboutPreview />
      <VisionMission />
      <StudyAreasSection />
      <FeaturedLectures />
      <FounderSection />
      <ArticlesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}