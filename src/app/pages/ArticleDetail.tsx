import { Link, useParams } from 'react-router';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA' };

export default function ArticleDetail() {
  const { slug } = useParams();
  const { t, isRTL, fontFamily } = useLanguage();
  const { getPublishedArticles } = useData();

  const articles = getPublishedArticles();
  const article = (articles as any[]).find((a: any) => a.slug === slug);
  const currentIndex = (articles as any[]).findIndex((a: any) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? (articles as any[])[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? (articles as any[])[currentIndex + 1] : null;
  const related = (articles as any[]).filter((a: any) => a.id !== article?.id && a.category_ar === article?.category_ar).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BRAND.ivory, fontFamily }}>
        <div className="text-center p-8">
          <BookOpen size={48} className="text-[#C9A24A] mx-auto mb-4 opacity-40" />
          <p className="text-[#5A7A70] text-lg mb-2">{t('المقالة غير موجودة', 'Article not found')}</p>
          <Link to="/articles" className="mt-2 inline-block text-[#C9A24A] hover:underline text-sm">
            {t('العودة للمقالات', 'Back to Articles')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: BRAND.ivory, fontFamily, minHeight: '100vh' }}>

      {/* Hero — full bleed, fixed header overlays top portion of it */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${BRAND.deep} 0%, ${BRAND.mid} 100%)` }}
      >
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="art-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C9A24A" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#art-grid)"/>
          </svg>
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-0 end-0 w-64 h-64 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #C9A24A, transparent)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 start-0 w-48 h-48 opacity-8 pointer-events-none" style={{ background: 'radial-gradient(circle, #C9A24A, transparent)', borderRadius: '50%', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6" style={{ paddingTop: '8rem', paddingBottom: '3rem' }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: '#6B8B80' }}>
            <Link to="/" className="hover:text-[#C9A24A] transition-colors">{t('الرئيسية', 'Home')}</Link>
            <span className="opacity-50">/</span>
            <Link to="/articles" className="hover:text-[#C9A24A] transition-colors">{t('المقالات', 'Articles')}</Link>
            <span className="opacity-50">/</span>
            <span className="text-[#C9A24A] line-clamp-1 max-w-[200px]">{t(article.title_ar, article.title_en)}</span>
          </nav>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.35)', color: BRAND.gold }}>
            {t(article.category_ar, article.category_en)}
          </div>

          {/* Title */}
          <h1
            className="text-[#F0D98A] mb-6 leading-snug"
            style={{
              fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '700',
            }}
          >
            {t(article.title_ar, article.title_en)}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#8B9D8A' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(201,162,74,0.2)', color: BRAND.gold }}>
                {t(article.author_ar, article.author_en).charAt(0)}
              </div>
              <span>{t(article.author_ar, article.author_en)}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#C9A24A]" />
              {new Date(article.date).toLocaleDateString(t('ar-SA', 'en-US'))}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#C9A24A]" />
              {article.readTime} {t('دقائق قراءة', 'min read')}
            </span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Article Body */}
          <div className="lg:col-span-3">

            {/* Article Image Placeholder */}
            <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8 relative" style={{ background: `linear-gradient(135deg, ${BRAND.mid}, ${BRAND.deep})`, border: '1px solid rgba(201,162,74,0.15)' }}>
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" opacity="0.2">
                  <path d="M50 10C35 10 22 23 22 38c0 10 6 18 16 24l12 7 12-7c10-6 16-14 16-24 0-15-13-28-28-28z" stroke="#C9A24A" strokeWidth="2" fill="rgba(201,162,74,0.15)"/>
                  <path d="M50 46L38 74h5l7-14 7 14h5L50 46z" stroke="#C9A24A" strokeWidth="2" fill="rgba(201,162,74,0.1)"/>
                  <circle cx="50" cy="26" r="8" stroke="#C9A24A" strokeWidth="2" fill="rgba(201,162,74,0.2)"/>
                </svg>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="mb-10"
              style={{
                color: '#2A4040',
                lineHeight: '2',
                fontSize: '0.95rem',
              }}
              dangerouslySetInnerHTML={{ __html: t(article.content_ar, article.content_en) }}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 pt-6" style={{ borderTop: '1px solid rgba(6,43,36,0.08)' }}>
                {article.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', color: BRAND.gold }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(6,43,36,0.08)' }}>
              <span className="text-[#5A7A70] text-sm font-medium">{t('شارك المقالة:', 'Share Article:')}</span>
              {[
                { icon: Facebook, label: 'Facebook', color: '#1877F2' },
                { icon: Twitter, label: 'Twitter/X', color: '#1DA1F2' },
                { icon: Share2, label: 'Share', color: BRAND.gold },
              ].map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>

            {/* Prev / Next Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle && (
                <Link
                  to={`/articles/${prevArticle.slug}`}
                  className="group p-4 rounded-2xl flex items-center gap-3 transition-all hover:-translate-x-1"
                  style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  {isRTL ? <ArrowRight size={18} className="text-[#C9A24A] shrink-0" /> : <ArrowLeft size={18} className="text-[#C9A24A] shrink-0" />}
                  <div className="min-w-0">
                    <div className="text-[#8B9D8A] text-xs mb-0.5">{t('المقالة السابقة', 'Previous Article')}</div>
                    <div className="text-[#062B24] text-sm font-medium line-clamp-1 group-hover:text-[#C9A24A] transition-colors">{t(prevArticle.title_ar, prevArticle.title_en)}</div>
                  </div>
                </Link>
              )}
              {nextArticle && (
                <Link
                  to={`/articles/${nextArticle.slug}`}
                  className="group p-4 rounded-2xl flex items-center gap-3 transition-all hover:translate-x-1"
                  style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex-1 min-w-0 text-end">
                    <div className="text-[#8B9D8A] text-xs mb-0.5">{t('المقالة التالية', 'Next Article')}</div>
                    <div className="text-[#062B24] text-sm font-medium line-clamp-1 group-hover:text-[#C9A24A] transition-colors">{t(nextArticle.title_ar, nextArticle.title_en)}</div>
                  </div>
                  {isRTL ? <ArrowLeft size={18} className="text-[#C9A24A] shrink-0" /> : <ArrowRight size={18} className="text-[#C9A24A] shrink-0" />}
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">

            {/* Author Card */}
            <div className="p-5 rounded-2xl text-center" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.12)', border: '2px solid rgba(201,162,74,0.3)' }}>
                <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="11" r="6" fill="rgba(201,162,74,0.25)" stroke="#C9A24A" strokeWidth="1.5"/>
                  <path d="M5 26c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="rgba(201,162,74,0.1)" stroke="#C9A24A" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="text-[#062B24] text-sm font-semibold mb-0.5">{t(article.author_ar, article.author_en)}</div>
              <div className="text-[#8B9D8A] text-xs">{t('كاتبة ومؤسِّسة', 'Writer & Founder')}</div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 className="text-[#062B24] font-semibold text-sm mb-4">{t('مقالات ذات صلة', 'Related Articles')}</h3>
                <div className="space-y-3">
                  {related.map((rel: any) => (
                    <Link
                      key={rel.id}
                      to={`/articles/${rel.slug}`}
                      className="flex gap-3 p-3 rounded-xl transition-all hover:bg-[rgba(201,162,74,0.05)] group"
                      style={{ border: '1px solid rgba(6,43,36,0.07)' }}
                    >
                      <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path d="M10 2C7 2 4 5 4 8c0 3 2 5 6 7 4-2 6-4 6-7 0-3-3-6-6-6z" stroke="#C9A24A" strokeWidth="1" fill="rgba(201,162,74,0.2)"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[#062B24] text-xs font-medium line-clamp-2 mb-0.5 group-hover:text-[#C9A24A] transition-colors">{t(rel.title_ar, rel.title_en)}</div>
                        <div className="text-[#8B9D8A] text-[10px]">{new Date(rel.date).toLocaleDateString(t('ar-SA', 'en-US'))}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Articles */}
            <Link
              to="/articles"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-medium transition-all"
              style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})`, color: '#F0D98A', border: '1px solid rgba(201,162,74,0.2)' }}
            >
              {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
              {t('جميع المقالات', 'All Articles')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
