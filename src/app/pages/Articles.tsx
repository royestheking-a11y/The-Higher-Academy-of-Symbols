import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Search, Clock, Star, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';
import { Skeleton } from '../components/Skeleton';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

function PhoenixBg() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-10">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path d="M40 8C30 8 18 17 18 28c0 8 6 15 14 20l8 5 8-5c8-5 14-12 14-20 0-11-8-20-22-20z" stroke="#C9A24A" strokeWidth="2" fill="rgba(201,162,74,0.2)"/>
        <path d="M40 42l-10 28h5l5-12 5 12h5L40 42z" stroke="#C9A24A" strokeWidth="2" fill="rgba(201,162,74,0.2)"/>
        <circle cx="40" cy="20" r="5" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.3)"/>
      </svg>
    </div>
  );
}

export default function Articles() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { getPublishedArticles, loading } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const articles = getPublishedArticles?.() ?? [];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    (articles as any[]).forEach((a: any) => cats.add(t(a.category_ar, a.category_en)));
    return ['all', ...Array.from(cats)];
  }, [articles, t]);

  const featured = (articles as any[]).find((a: any) => a.featured);
  const rest = (articles as any[]).filter((a: any) => !a.featured || a !== featured);

  const filtered = useMemo(() => {
    let result = rest;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a: any) =>
        t(a.title_ar, a.title_en).toLowerCase().includes(q) ||
        t(a.excerpt_ar, a.excerpt_en).toLowerCase().includes(q)
      );
    }
    if (category !== 'all') result = result.filter((a: any) => t(a.category_ar, a.category_en) === category);
    return result;
  }, [rest, search, category, t]);

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
            {t('المقالات البحثية', 'Research Articles')}
          </div>
          <h1 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '700' }}>
            {t('المقالات', 'Articles')}
          </h1>
          <p className="text-[#A0B9B0] text-base max-w-xl mx-auto">
            {t('مقالات علمية وبحثية في الرمزية والسيميائيات والتأويل.', 'Scientific and research articles in symbolism, semiotics, and interpretation.')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search */}
        <div className="relative max-w-xl mb-8">
          <Search size={17} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A]" style={{ insetInlineStart: '14px' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('ابحث في المقالات...', 'Search articles...')}
            className="w-full py-3 rounded-xl text-sm text-[#1E1E1E] placeholder-[#8B9D8A] outline-none"
            style={{ background: 'white', border: '1px solid rgba(6,43,36,0.15)', paddingInlineStart: '42px', paddingInlineEnd: '42px', fontFamily, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineEnd: '14px' }}>
              <X size={15} className="text-[#8B9D8A]" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: category === cat ? `linear-gradient(135deg, ${BRAND.gold}, #D8B75B)` : 'white',
                color: category === cat ? BRAND.deep : '#5A7A70',
                border: `1px solid ${category === cat ? 'transparent' : 'rgba(6,43,36,0.15)'}`,
                boxShadow: category === cat ? '0 2px 0 #8B6B20, 0 4px 12px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
                fontFamily,
              }}
            >
              {cat === 'all' ? t('الكل', 'All') : cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {featured && !search && category === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="text-[#C9A24A] text-xs uppercase tracking-widest mb-4">{t('مقالة مميزة', 'Featured Article')}</div>
            <Link
              to={`/articles/${featured.slug}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden group transition-all block"
              style={{ background: 'white', border: '1px solid rgba(6,43,36,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(6,43,36,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div className="h-60 md:h-auto relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
                <PhoenixBg />
                <div className="absolute top-4 start-4 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.2)', color: '#F0D98A' }}>
                  {t(featured.category_ar, featured.category_en)}
                </div>
                <div className="absolute inset-0 flex items-end p-6">
                  <span className="text-[#C9A24A] text-xs flex items-center gap-1">
                    <Star size={12} fill="#C9A24A" className="text-[#C9A24A]" /> {t('مقالة مميزة', 'Featured')}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-[#062B24] font-bold mb-3 group-hover:text-[#C9A24A] transition-colors leading-snug" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>
                  {t(featured.title_ar, featured.title_en)}
                </h2>
                <p className="text-[#5A7A70] text-sm leading-relaxed mb-4">{t(featured.excerpt_ar, featured.excerpt_en)}</p>
                <div className="flex items-center gap-3 text-[#8B9D8A] text-xs">
                  <span>{t(featured.author_ar, featured.author_en)}</span>
                  <span>•</span>
                  <span>{new Date(featured.date).toLocaleDateString(t('ar-SA', 'en-US'))}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {featured.readTime} {t('د', 'min')}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton.Card key={i} theme="light" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#C9A24A] mx-auto mb-4 opacity-50" />
            <p className="text-[#5A7A70] text-base">{t('لا توجد مقالات تطابق البحث.', 'No articles match your search.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article: any, i: number) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/articles/${article.slug}`}
                className="flex flex-col h-full rounded-2xl overflow-hidden group transition-all block"
                style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(6,43,36,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div className="relative h-44 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                  <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
                  <PhoenixBg />
                  <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.2)', color: '#F0D98A' }}>
                    {t(article.category_ar, article.category_en)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[#062B24] font-semibold mb-2 text-sm line-clamp-2 group-hover:text-[#C9A24A] transition-colors leading-snug">
                    {t(article.title_ar, article.title_en)}
                  </h3>
                  <p className="text-[#5A7A70] text-xs leading-relaxed mb-4 line-clamp-2 flex-1">{t(article.excerpt_ar, article.excerpt_en)}</p>
                  <div className="flex items-center justify-between text-[#8B9D8A] text-xs pt-3" style={{ borderTop: '1px solid rgba(6,43,36,0.08)' }}>
                    <span>{new Date(article.date).toLocaleDateString(t('ar-SA', 'en-US'))}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime} {t('دقائق قراءة', 'min read')}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}