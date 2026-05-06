import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, BookOpen, Newspaper, Compass, ArrowRight, ArrowLeft, Clock, Star, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA', sand: '#E8DDC7' };

type ResultType = 'all' | 'lectures' | 'articles' | 'areas';

export default function SearchPage() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { lectures, getPublishedArticles, areasOfStudy } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState<ResultType>('all');

  const currentQ = searchParams.get('q') || '';
  const articles = getPublishedArticles();

  const normalize = (s: string) => s.toLowerCase().trim();

  const matchedLectures = (lectures as any[]).filter((l: any) =>
    currentQ.length >= 1 && (
      normalize(l.title_ar || '').includes(normalize(currentQ)) ||
      normalize(l.title_en || '').includes(normalize(currentQ)) ||
      normalize(l.description_ar || '').includes(normalize(currentQ)) ||
      normalize(l.description_en || '').includes(normalize(currentQ)) ||
      normalize(l.category_ar || '').includes(normalize(currentQ)) ||
      normalize(l.category_en || '').includes(normalize(currentQ))
    )
  );

  const matchedArticles = (articles as any[]).filter((a: any) =>
    currentQ.length >= 1 && (
      normalize(a.title_ar || '').includes(normalize(currentQ)) ||
      normalize(a.title_en || '').includes(normalize(currentQ)) ||
      normalize(a.excerpt_ar || '').includes(normalize(currentQ)) ||
      normalize(a.excerpt_en || '').includes(normalize(currentQ)) ||
      normalize(a.category_ar || '').includes(normalize(currentQ)) ||
      normalize(a.category_en || '').includes(normalize(currentQ))
    )
  );

  const matchedAreas = (areasOfStudy as any[]).filter((a: any) =>
    currentQ.length >= 1 && (
      normalize(a.name_ar || '').includes(normalize(currentQ)) ||
      normalize(a.name_en || '').includes(normalize(currentQ)) ||
      normalize(a.description_ar || '').includes(normalize(currentQ)) ||
      normalize(a.description_en || '').includes(normalize(currentQ))
    )
  );

  const totalResults = matchedLectures.length + matchedArticles.length + matchedAreas.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const filters: { id: ResultType; label_ar: string; label_en: string; count: number; icon: any }[] = [
    { id: 'all', label_ar: 'الكل', label_en: 'All', count: totalResults, icon: SlidersHorizontal },
    { id: 'lectures', label_ar: 'المحاضرات', label_en: 'Lectures', count: matchedLectures.length, icon: BookOpen },
    { id: 'articles', label_ar: 'المقالات', label_en: 'Articles', count: matchedArticles.length, icon: Newspaper },
    { id: 'areas', label_ar: 'مجالات الدراسة', label_en: 'Study Areas', count: matchedAreas.length, icon: Compass },
  ];

  const GoldArrow = () => isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />;

  const showLectures = activeFilter === 'all' || activeFilter === 'lectures';
  const showArticles = activeFilter === 'all' || activeFilter === 'articles';
  const showAreas = activeFilter === 'all' || activeFilter === 'areas';

  return (
    <div style={{ background: BRAND.ivory, fontFamily, minHeight: '100vh' }}>
      {/* Hero Search Bar */}
      <div
        className="pt-36 pb-12 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}
      >
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-widest" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
              <Search size={12} />
              {t('نتائج البحث', 'Search Results')}
            </div>
            {currentQ && (
              <h1 className="text-[#F0D98A] mb-2" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: '700' }}>
                {t(`نتائج البحث عن: "${currentQ}"`, `Results for: "${currentQ}"`)}
              </h1>
            )}
            {currentQ && (
              <p className="text-[#8B9D8A] text-sm">
                {t(`وجدنا ${totalResults} نتيجة`, `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}`)}
              </p>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-[#C9A24A]" style={{ insetInlineStart: '18px' }} />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('ابحث في المحاضرات، المقالات، مجالات الدراسة...', 'Search lectures, articles, areas of study...')}
                  className="w-full rounded-2xl text-sm text-[#F8F4EA] placeholder-[#6B8B80] outline-none transition-all"
                  style={{
                    background: 'rgba(11,58,49,0.8)',
                    border: '1.5px solid rgba(201,162,74,0.4)',
                    padding: '16px 52px',
                    fontFamily,
                    backdropFilter: 'blur(10px)',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#C9A24A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,162,74,0.4)')}
                  autoFocus
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="absolute top-1/2 -translate-y-1/2 text-[#6B8B80] hover:text-[#F0D98A] transition-colors" style={{ insetInlineEnd: '18px' }}>
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-4 rounded-2xl text-sm font-semibold flex items-center gap-2 shrink-0 transition-all"
                style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 4px 0 #8B6B20' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 0 #8B6B20'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 0 #8B6B20'; }}
              >
                <Search size={16} />
                {t('بحث', 'Search')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* No query yet */}
        {!currentQ && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.25)' }}>
              <Search size={32} className="text-[#C9A24A] opacity-60" />
            </div>
            <h2 className="text-[#062B24] mb-2" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: '700' }}>
              {t('ابدأ البحث', 'Start Searching')}
            </h2>
            <p className="text-[#5A7A70] text-sm max-w-sm mx-auto">
              {t('اكتب كلمة للبحث في المحاضرات والمقالات ومجالات الدراسة', 'Type a keyword to search through lectures, articles and study areas')}
            </p>
          </div>
        )}

        {/* Has query */}
        {currentQ && (
          <>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filters.map(f => {
                const IconComp = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: activeFilter === f.id ? 'linear-gradient(135deg, #C9A24A, #D8B75B)' : 'white',
                      color: activeFilter === f.id ? BRAND.deep : '#3A5A50',
                      border: activeFilter === f.id ? 'none' : '1px solid rgba(6,43,36,0.12)',
                      boxShadow: activeFilter === f.id ? '0 3px 0 #8B6B20' : '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <IconComp size={14} />
                    {t(f.label_ar, f.label_en)}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: activeFilter === f.id ? 'rgba(6,43,36,0.2)' : 'rgba(201,162,74,0.15)',
                        color: activeFilter === f.id ? BRAND.deep : '#C9A24A',
                      }}
                    >
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* No results */}
            {totalResults === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.08)', border: '1px solid rgba(201,162,74,0.2)' }}>
                  <Search size={32} className="text-[#C9A24A] opacity-40" />
                </div>
                <h3 className="text-[#062B24] mb-2" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: '700' }}>
                  {t('لا توجد نتائج', 'No Results Found')}
                </h3>
                <p className="text-[#5A7A70] text-sm mb-6 max-w-sm mx-auto">
                  {t(`لم نجد نتائج لـ "${currentQ}"، جرب كلمات أخرى.`, `No results for "${currentQ}". Try different keywords.`)}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/lectures" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}>
                    <BookOpen size={14} />
                    {t('استكشف المحاضرات', 'Explore Lectures')}
                  </Link>
                  <Link to="/articles" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-[rgba(6,43,36,0.05)]" style={{ borderColor: 'rgba(6,43,36,0.2)', color: '#3A5A50' }}>
                    <Newspaper size={14} />
                    {t('تصفح المقالات', 'Browse Articles')}
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Lectures Results */}
            <AnimatePresence>
              {showLectures && matchedLectures.length > 0 && (
                <motion.section key="lectures" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="flex items-center gap-2 text-[#062B24] font-semibold" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
                      <BookOpen size={20} className="text-[#C9A24A]" />
                      {t('المحاضرات', 'Lectures')}
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.15)', color: '#C9A24A' }}>{matchedLectures.length}</span>
                    </h2>
                    {activeFilter === 'all' && <button onClick={() => setActiveFilter('lectures')} className="text-[#C9A24A] text-xs hover:underline">{t('عرض الكل', 'See all')}</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(activeFilter === 'all' ? matchedLectures.slice(0, 3) : matchedLectures).map((l: any, i: number) => (
                      <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                        <Link to={`/lectures/${l.slug}`} className="flex items-start gap-4 p-5 rounded-2xl group transition-all hover:-translate-y-1 block" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                            <BookOpen size={18} className="text-[#C9A24A]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#062B24] text-sm font-semibold mb-1 group-hover:text-[#C9A24A] transition-colors line-clamp-2">{t(l.title_ar, l.title_en)}</h3>
                            <p className="text-[#5A7A70] text-xs mb-2 line-clamp-2">{t(l.description_ar, l.description_en)}</p>
                            <div className="flex items-center gap-3 text-[#8B9D8A] text-xs">
                              <span className="flex items-center gap-1"><Clock size={10} className="text-[#C9A24A]" />{l.duration?.split('/')[0]?.trim()}</span>
                              <span className="text-[#C9A24A] font-bold">${l.price}</span>
                            </div>
                          </div>
                          <div className="shrink-0 text-[#C9A24A] mt-1"><GoldArrow /></div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Articles Results */}
              {showArticles && matchedArticles.length > 0 && (
                <motion.section key="articles" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="flex items-center gap-2 text-[#062B24] font-semibold" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
                      <Newspaper size={20} className="text-[#C9A24A]" />
                      {t('المقالات', 'Articles')}
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.15)', color: '#C9A24A' }}>{matchedArticles.length}</span>
                    </h2>
                    {activeFilter === 'all' && <button onClick={() => setActiveFilter('articles')} className="text-[#C9A24A] text-xs hover:underline">{t('عرض الكل', 'See all')}</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(activeFilter === 'all' ? matchedArticles.slice(0, 4) : matchedArticles).map((a: any, i: number) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                        <Link to={`/articles/${a.slug}`} className="flex flex-col h-full p-5 rounded-2xl group transition-all hover:-translate-y-1 block" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(201,162,74,0.1)' }}>
                              <Newspaper size={15} className="text-[#C9A24A]" />
                            </div>
                            <span className="text-[#C9A24A] text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,162,74,0.12)' }}>{t(a.category_ar, a.category_en)}</span>
                          </div>
                          <h3 className="text-[#062B24] text-sm font-semibold mb-2 group-hover:text-[#C9A24A] transition-colors line-clamp-2">{t(a.title_ar, a.title_en)}</h3>
                          <p className="text-[#5A7A70] text-xs line-clamp-2 mb-3 flex-1">{t(a.excerpt_ar, a.excerpt_en)}</p>
                          <div className="flex items-center justify-between text-[#8B9D8A] text-xs pt-3" style={{ borderTop: '1px solid rgba(6,43,36,0.07)' }}>
                            <span>{new Date(a.date).toLocaleDateString(t('ar-SA', 'en-US'))}</span>
                            <span className="flex items-center gap-1 text-[#C9A24A]">{t('اقرأ', 'Read')} <GoldArrow /></span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Areas Results */}
              {showAreas && matchedAreas.length > 0 && (
                <motion.section key="areas" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="flex items-center gap-2 text-[#062B24] font-semibold" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
                      <Compass size={20} className="text-[#C9A24A]" />
                      {t('مجالات الدراسة', 'Study Areas')}
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.15)', color: '#C9A24A' }}>{matchedAreas.length}</span>
                    </h2>
                    {activeFilter === 'all' && <button onClick={() => setActiveFilter('areas')} className="text-[#C9A24A] text-xs hover:underline">{t('عرض الكل', 'See all')}</button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchedAreas.map((area: any, i: number) => (
                      <motion.div key={area.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                        <Link to={`/areas/${area.slug}`} className="flex items-start gap-4 p-5 rounded-2xl group transition-all hover:-translate-y-1 block" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)' }}>
                            <Compass size={18} className="text-[#C9A24A]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[#062B24] text-sm font-semibold mb-1 group-hover:text-[#C9A24A] transition-colors">{t(area.name_ar, area.name_en)}</h3>
                            <p className="text-[#5A7A70] text-xs line-clamp-2">{t(area.description_ar, area.description_en)}</p>
                          </div>
                          <div className="shrink-0 text-[#C9A24A] mt-1"><GoldArrow /></div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
