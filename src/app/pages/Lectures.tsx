import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Search, Filter, BookOpen, Clock, Users, Star, Award, Play, SlidersHorizontal, X, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';
import { Skeleton } from '../components/Skeleton';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

function PhoenixIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
      <path d="M30 5C22 5 14 12 14 21c0 6 4 11 10 15l6 4 6-4c6-4 10-9 10-15 0-9-8-16-16-16z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.1)"/>
      <path d="M30 30l-9 20h4l5-10 5 10h4L30 30z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.1)"/>
      <circle cx="30" cy="15" r="4" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.2)"/>
    </svg>
  );
}

export default function Lectures() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { lectures, loading } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label_ar: 'الكل', label_en: 'All' },
    { value: 'interpretation', label_ar: 'التأويل', label_en: 'Interpretation' },
    { value: 'semiotics', label_ar: 'السيميائيات', label_en: 'Semiotics' },
    { value: 'cryptography', label_ar: 'التشفير', label_en: 'Cryptography' },
    { value: 'shorthand', label_ar: 'الاختزال', label_en: 'Shorthand' },
    { value: 'semantics', label_ar: 'الدلالة', label_en: 'Semantics' },
    { value: 'research', label_ar: 'البحث', label_en: 'Research' },
  ];

  const sortOptions = [
    { value: 'newest', label_ar: 'الأحدث', label_en: 'Newest' },
    { value: 'price_asc', label_ar: 'السعر: من الأقل', label_en: 'Price: Low to High' },
    { value: 'price_desc', label_ar: 'السعر: من الأعلى', label_en: 'Price: High to Low' },
    { value: 'popular', label_ar: 'الأكثر تسجيلاً', label_en: 'Most Enrolled' },
    { value: 'rating', label_ar: 'الأعلى تقييماً', label_en: 'Highest Rated' },
  ];

  const filtered = useMemo(() => {
    let result = [...(lectures as any[])].filter((l: any) => l.status === 'published');
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l: any) =>
        t(l.title_ar, l.title_en).toLowerCase().includes(q) ||
        t(l.description_ar, l.description_en).toLowerCase().includes(q) ||
        t(l.lecturer_ar, l.lecturer_en).toLowerCase().includes(q)
      );
    }
    if (category !== 'all') result = result.filter((l: any) => l.category === category);
    if (sortBy === 'price_asc') result.sort((a: any, b: any) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a: any, b: any) => b.price - a.price);
    else if (sortBy === 'popular') result.sort((a: any, b: any) => b.enrolled - a.enrolled);
    else if (sortBy === 'rating') result.sort((a: any, b: any) => b.rating - a.rating);
    return result;
  }, [lectures, search, category, sortBy, t]);

  return (
    <div style={{ background: BRAND.ivory, fontFamily, minHeight: '100vh' }}>
      {/* Hero */}
      <div className="relative pt-36 pb-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 400 200"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#C9A24A" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
            {t('المحاضرات الأكاديمية', 'Academic Lectures')}
          </div>
          <h1 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '700' }}>
            {t('محاضراتنا', 'Our Lectures')}
          </h1>
          <p className="text-[#A0B9B0] text-base max-w-2xl mx-auto">
            {t('استكشف محاضراتنا الأكاديمية في الرمزية والسيميائيات والتأويل والاختزال والتشفير.', 'Explore our academic lectures in symbolism, semiotics, interpretation, shorthand, and cryptography.')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={17} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A]" style={{ insetInlineStart: '14px' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('ابحث في المحاضرات...', 'Search lectures...')}
              className="w-full py-3 rounded-xl text-sm text-[#1E1E1E] placeholder-[#8B9D8A] outline-none"
              style={{ background: 'white', border: '1px solid rgba(6,43,36,0.15)', paddingInlineStart: '42px', paddingInlineEnd: '16px', fontFamily, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A] hover:text-[#1E1E1E]" style={{ insetInlineEnd: '14px' }}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm text-[#1E1E1E] outline-none cursor-pointer"
              style={{ background: 'white', border: '1px solid rgba(6,43,36,0.15)', fontFamily, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{t(o.label_ar, o.label_en)}</option>)}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: showFilters ? BRAND.deep : 'white',
                color: showFilters ? '#F0D98A' : BRAND.deep,
                border: `1px solid ${showFilters ? 'rgba(201,162,74,0.4)' : 'rgba(6,43,36,0.15)'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <SlidersHorizontal size={16} />
              {t('تصفية', 'Filter')}
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: category === cat.value ? `linear-gradient(135deg, ${BRAND.gold}, #D8B75B)` : 'white',
                color: category === cat.value ? BRAND.deep : '#5A7A70',
                border: `1px solid ${category === cat.value ? 'transparent' : 'rgba(6,43,36,0.15)'}`,
                boxShadow: category === cat.value ? '0 2px 0 #8B6B20, 0 4px 12px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.05)',
                fontFamily,
              }}
            >
              {t(cat.label_ar, cat.label_en)}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#5A7A70] text-sm">
            {filtered.length} {t('محاضرة', 'lectures')}
          </p>
        </div>

        {/* Lectures Grid */}
        {loading && lectures.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton.Card key={i} theme="light" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#C9A24A] mx-auto mb-4 opacity-50" />
            <p className="text-[#5A7A70] text-base">{t('لا توجد محاضرات تطابق البحث.', 'No lectures match your search.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lecture: any, i: number) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col rounded-3xl overflow-hidden transition-all duration-300 group"
                style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(6,43,36,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div className="relative h-44 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                  <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
                  <div className="opacity-20 scale-125"><PhoenixIcon /></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)' }}>
                      <BookOpen size={26} className="text-[#C9A24A]" />
                    </div>
                  </div>
                  <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(201,162,74,0.2)', border: '1px solid rgba(201,162,74,0.4)', color: '#F0D98A' }}>
                    {t(lecture.category_ar, lecture.category_en)}
                  </div>
                  {lecture.certificate && (
                    <div className="absolute top-3 end-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.15)', color: '#C9A24A' }}>
                      <Award size={11} /> {t('شهادة', 'Cert')}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[#062B24] font-semibold mb-2 text-sm leading-snug group-hover:text-[#C9A24A] transition-colors">
                    {t(lecture.title_ar, lecture.title_en)}
                  </h3>
                  <p className="text-[#5A7A70] text-xs mb-3 line-clamp-2 leading-relaxed">{t(lecture.description_ar, lecture.description_en)}</p>
                  <div className="flex items-center gap-1.5 text-[#5A7A70] text-xs mb-3">
                    <GraduationCap size={13} className="text-[#C9A24A]" />
                    {t(lecture.lecturer_ar, lecture.lecturer_en)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-3 text-xs text-[#6B8B80]" style={{ borderTop: '1px solid rgba(6,43,36,0.08)', borderBottom: '1px solid rgba(6,43,36,0.08)' }}>
                    <div className="flex items-center justify-center gap-1"><Clock size={11} className="text-[#C9A24A]" />{lecture.duration.split('/')[0].trim()}</div>
                    <div className="flex items-center justify-center gap-1"><Play size={11} className="text-[#C9A24A]" />{lecture.lessonsCount}</div>
                    <div className="flex items-center justify-center gap-1"><Users size={11} className="text-[#C9A24A]" />{lecture.enrolled}</div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#062B24] font-bold text-lg">${lecture.price}</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.floor(lecture.rating) ? '#C9A24A' : 'none'} className="text-[#C9A24A]" />)}
                      <span className="text-[#8B9D8A] text-xs ms-1">({lecture.reviews})</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to={`/lectures/${lecture.slug}`} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-center border transition-all hover:bg-[rgba(6,43,36,0.05)]" style={{ borderColor: 'rgba(6,43,36,0.2)', color: BRAND.deep }}>
                      {t('التفاصيل', 'Details')}
                    </Link>
                    <Link to="/register" className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-center" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 2px 0 #8B6B20' }}>
                      {t('سجّل الآن', 'Register')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}