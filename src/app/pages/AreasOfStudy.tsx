import { Link, useParams } from 'react-router';
import { Star, Eye, BookOpen, PenLine, MessageSquare, Lock, ScrollText, FileText, Compass, Pen, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';
import { Skeleton } from '../components/Skeleton';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

const AREA_ICONS: Record<string, any> = { Star, Eye, BookOpen, PenLine, MessageSquare, Lock, ScrollText, FileText, Compass, Pen };

function AreaCard({ area, index }: { area: any; index: number }) {
  const { t, isRTL } = useLanguage();
  const IconComp = AREA_ICONS[area.icon] || Star;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        to={`/areas/${area.slug}`}
        className="flex flex-col gap-5 p-6 rounded-2xl h-full group transition-all duration-300 block"
        style={{ background: BRAND.ivory, border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(201,162,74,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(6,43,36,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(6,43,36,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110" style={{ background: 'rgba(6,43,36,0.08)', border: '1px solid rgba(6,43,36,0.1)' }}>
            <IconComp size={22} className="text-[#062B24] group-hover:text-[#C9A24A] transition-colors" />
          </div>
          <h3 className="text-[#062B24] font-semibold text-base group-hover:text-[#C9A24A] transition-colors">{t(area.name_ar, area.name_en)}</h3>
        </div>
        <p className="text-[#5A7A70] text-sm leading-relaxed flex-1">{t(area.description_ar, area.description_en)}</p>
        <div className="flex items-center gap-1 text-[#C9A24A] text-xs font-medium pt-3" style={{ borderTop: '1px solid rgba(201,162,74,0.15)' }}>
          {t('استكشف التخصص', 'Explore Field')}
          {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </div>
      </Link>
    </motion.div>
  );
}

export function AreaDetail() {
  const { slug } = useParams();
  const { t, isRTL, fontFamily } = useLanguage();
  const { areasOfStudy, lectures, loading } = useData();
  
  if (loading && (!areasOfStudy || areasOfStudy.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: BRAND.ivory }}>
        <Skeleton.Hero />
      </div>
    );
  }

  const area = (areasOfStudy as any[]).find((a: any) => a.slug === slug);
  const relatedLectures = (lectures as any[]).filter((l: any) => l.category === area?.slug && l.status === 'published').slice(0, 3);

  if (!area) return (
    <div className="min-h-screen flex items-center justify-center" style={{ fontFamily, background: BRAND.ivory }}>
      <div className="text-center">
        <p className="text-[#5A7A70]">{t('المجال غير موجود', 'Area not found')}</p>
        <Link to="/areas-of-study" className="text-[#C9A24A] hover:underline mt-3 block">{t('العودة', 'Back')}</Link>
      </div>
    </div>
  );

  const IconComp = AREA_ICONS[area.icon] || Star;

  return (
    <div style={{ background: BRAND.ivory, fontFamily, minHeight: '100vh' }}>
      <div className="relative pt-36 pb-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[#6B8B80] text-xs mb-6">
            <Link to="/" className="hover:text-[#C9A24A]">{t('الرئيسية', 'Home')}</Link>
            <span>/</span>
            <Link to="/areas-of-study" className="hover:text-[#C9A24A]">{t('مجالات الدراسة', 'Areas of Study')}</Link>
            <span>/</span>
            <span className="text-[#C9A24A]">{t(area.name_ar, area.name_en)}</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.2)', border: '2px solid rgba(201,162,74,0.4)' }}>
              <IconComp size={30} className="text-[#C9A24A]" />
            </div>
            <div>
              <h1 className="text-[#F0D98A] mb-1" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: '700' }}>
                {t(area.name_ar, area.name_en)}
              </h1>
              <p className="text-[#A0B9B0] text-sm">{t(area.description_ar, area.description_en)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)' }}>
              <h2 className="text-[#062B24] font-semibold mb-4 text-base">{t('تعريف المجال', 'Field Definition')}</h2>
              <p className="text-[#3A5A50] text-sm leading-relaxed">{t(area.description_ar, area.description_en)}</p>
            </div>

            {relatedLectures.length > 0 && (
              <div>
                <h2 className="text-[#062B24] font-semibold mb-5 text-base">{t('المحاضرات ذات الصلة', 'Related Lectures')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedLectures.map((lec: any) => (
                    <Link key={lec.id} to={`/lectures/${lec.slug}`} className="p-4 rounded-xl transition-all block hover:-translate-y-1" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div className="text-[#062B24] text-sm font-medium mb-2 line-clamp-2">{t(lec.title_ar, lec.title_en)}</div>
                      <div className="text-[#C9A24A] font-bold text-sm">${lec.price}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="p-6 rounded-2xl sticky top-24" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)' }}>
              <h3 className="text-[#062B24] font-semibold mb-4 text-sm">{t('ماذا ستتعلم؟', "What You'll Learn")}</h3>
              <ul className="space-y-3 text-[#3A5A50] text-xs">
                {[
                  t('الأسس النظرية للمجال', 'Theoretical foundations of the field'),
                  t('التطبيقات العملية والحديثة', 'Practical and modern applications'),
                  t('المناهج البحثية المتخصصة', 'Specialized research methodologies'),
                  t('تحليل النصوص والرموز', 'Analyzing texts and symbols'),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Star size={12} className="text-[#C9A24A] mt-0.5 shrink-0" fill="#C9A24A" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  to="/lectures"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}
                >
                  <BookOpen size={15} />
                  {t('استكشف المحاضرات', 'Explore Lectures')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AreasOfStudy() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { areasOfStudy, loading } = useData();

  return (
    <div style={{ background: BRAND.sand, fontFamily, minHeight: '100vh' }}>
      <div className="relative pt-36 pb-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
            {t('الخريطة المعرفية', 'Knowledge Map')}
          </div>
          <h1 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '700' }}>
            {t('مجالات الدراسة', 'Fields of Study')}
          </h1>
          <p className="text-[#A0B9B0] text-base max-w-2xl mx-auto">
            {t('اكتشف الخريطة المعرفية للأكاديمية في علوم الرمزية والسيميائيات والتشفير وما يتصل بها.', 'Discover the Academy\'s knowledge map in symbolism, semiotics, cryptography, and related sciences.')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading && (!areasOfStudy || areasOfStudy.length === 0) ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Card key={i} theme="light" />
            ))
          ) : (
            (areasOfStudy as any[]).filter((a: any) => a.status === 'published').sort((a: any, b: any) => a.order - b.order).map((area: any, i: number) => (
              <AreaCard key={area.id} area={area} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}