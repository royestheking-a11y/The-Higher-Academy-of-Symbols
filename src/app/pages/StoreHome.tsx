import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter, Star, ShoppingCart, ArrowRight, BookMarked, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', primary: '#1B4D42', secondary: '#3A5A50', accent: '#7BBFAD', gold: '#C9A24A', light: '#F8F4EA', ivory: '#F8F4EA', sand: '#E8DDC7' };

function PhoenixIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
      <path d="M30 5C22 5 14 12 14 21c0 6 4 11 10 15l6 4 6-4c6-4 10-9 10-15 0-9-8-16-16-16z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.1)"/>
      <path d="M30 30l-9 20h4l5-10 5 10h4L30 30z" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.1)"/>
      <circle cx="30" cy="15" r="4" stroke="#C9A24A" strokeWidth="1.5" fill="rgba(201,162,74,0.2)"/>
    </svg>
  );
}

export default function StoreHome() {
  const { t, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLang, setActiveLang] = useState('all');

  const categories = [
    { id: 'All', ar: 'الكل', en: 'All' },
    { id: 'Symbolism', ar: 'الرمزية', en: 'Symbolism' },
    { id: 'Cryptography', ar: 'التشفير', en: 'Cryptography' },
    { id: 'Research', ar: 'البحثوث', en: 'Research' },
    { id: 'Philosophy', ar: 'الفلسفة', en: 'Philosophy' },
  ];

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/books` : '/api/books')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setBooks(data); setLoading(false); })
      .catch(() => { setBooks([]); setLoading(false); });
  }, []);

  const filteredBooks = books.filter(b => {
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
    const matchesLang = activeLang === 'all' || b.language === activeLang || b.language === 'both';
    const matchesSearch = b.title_ar?.includes(search) || b.title_en?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesLang && matchesSearch;
  });

  const featuredBooks = books.filter(b => b.isFeatured).slice(0, 3);

  const handleAddToCart = (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    addToCart(book);
    toast.success(t('تمت الإضافة للسلة', 'Added to cart'));
  };

  return (
    <div style={{ background: BRAND.ivory, minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <div className="relative pt-36 pb-16 overflow-hidden mb-16" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 400 200"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#C9A24A" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 max-w-2xl text-center md:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(201,162,74,0.15)] text-[#C9A24A] text-xs font-bold tracking-wide uppercase border border-[rgba(201,162,74,0.3)] backdrop-blur-sm">
              <ShoppingBag size={14} /> {t('المتجر الرسمي', 'Official Bookstore')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif' }}>
              {t('إصدارات الأكاديمية العليا', 'Academy Publications')}
            </h1>
            <p className="text-[#A0B9B0] text-lg max-w-xl leading-relaxed mx-auto md:mx-0">
              {t('تصفح مجموعتنا الحصرية من الكتب المطبوعة والرقمية في الرمزية، التشفير، السيميائية، والمزيد.', 'Browse our exclusive collection of printed and digital books in symbolism, cryptography, semiotics, and more.')}
            </p>
          </div>

          {/* Featured Book Preview */}
          {featuredBooks.length > 0 && (
            <div className="w-full md:w-1/3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => navigate(`/store/${featuredBooks[0].slug}`)}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all shadow-xl">
                <div className="text-[#C9A24A] text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center md:justify-start gap-2"><Star size={14} className="fill-current" /> {t('كتاب مميز', 'Featured Book')}</div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-start">
                  <div className="w-24 h-36 bg-black/20 rounded-xl shadow-lg overflow-hidden shrink-0 border border-white/10">
                    {featuredBooks[0].coverImage ? <img src={featuredBooks[0].coverImage} className="w-full h-full object-cover" /> : <BookMarked className="w-full h-full p-6 text-white/50" />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">{isRTL ? featuredBooks[0].title_ar : featuredBooks[0].title_en}</h3>
                    <p className="text-[#A0B9B0] text-xs mb-3">{featuredBooks[0].author}</p>
                    <div className="text-[#C9A24A] font-black text-xl">AED {featuredBooks[0].salePrice || featuredBooks[0].price}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A]" style={{ insetInlineStart: '16px' }} />
              <input type="text"
                placeholder={t('البحث عن كتاب...', 'Search books...')}
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full py-3.5 rounded-2xl text-sm outline-none transition-all focus:border-[#C9A24A]"
                style={{ background: 'white', border: '1.5px solid rgba(6,43,36,0.08)', color: BRAND.deep, paddingInlineStart: '44px', paddingInlineEnd: '16px' }}
              />
            </div>

            {/* Language Filter */}
            <div className="bg-white rounded-2xl p-5 border border-[rgba(6,43,36,0.08)]">
              <div className="text-[#062B24] font-bold mb-4">{t('اللغة', 'Language')}</div>
              <div className="flex bg-[#F8F4EA] p-1 rounded-xl">
                {[
                  { id: 'all', ar: 'الكل', en: 'All' },
                  { id: 'ar', ar: 'عربي', en: 'Arabic' },
                  { id: 'en', ar: 'English', en: 'English' }
                ].map(l => (
                  <button key={l.id} onClick={() => setActiveLang(l.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeLang === l.id ? 'bg-white text-[#062B24] shadow-sm' : 'text-[#8B9D8A]'}`}>
                    {isRTL ? l.ar : l.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl p-5 border border-[rgba(6,43,36,0.08)]">
              <div className="flex items-center gap-2 text-[#062B24] font-bold mb-4">
                <Filter size={16} /> {t('التصنيفات', 'Categories')}
              </div>
              <div className="space-y-2">
                {categories.map((cat, i) => (
                  <button key={i} onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-${isRTL ? 'right' : 'left'} px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-[#F8F4EA] text-[#C9A24A]' : 'text-[#5A7A70] hover:bg-[#F8F4EA] hover:text-[#062B24]'}`}>
                    {isRTL ? cat.ar : cat.en}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#062B24]">{activeCategory === 'All' ? t('أحدث الإصدارات', 'New Releases') : (isRTL ? categories.find(c => c.id === activeCategory)?.ar : categories.find(c => c.id === activeCategory)?.en)}</h2>
              <span className="text-[#8B9D8A] text-sm">{t(`${filteredBooks.length} كتاب`, `${filteredBooks.length} Books`)}</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl border border-[rgba(6,43,36,0.08)] overflow-hidden flex flex-col">
                    <div className="aspect-[4/5] w-full relative overflow-hidden bg-gray-200 animate-pulse">
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-6"></div>
                      
                      <div className="mt-auto pt-4 border-t border-[rgba(6,43,36,0.06)] flex items-center justify-between">
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-10 bg-[#F8F4EA] rounded-xl animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[rgba(6,43,36,0.08)]">
                <ShoppingBag size={48} className="text-[#C9A24A] opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#062B24] mb-2">{t('لا توجد كتب بعد', 'No books found')}</h3>
                <p className="text-[#5A7A70]">{t('جاري إضافة كتب جديدة للمتجر.', 'New books are being added to the store.')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={() => navigate(`/store/${book.slug}`)}
                      className="bg-white rounded-3xl border border-[rgba(6,43,36,0.08)] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col group">
                      
                      {/* Header Image Area */}
                      <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#062B24] group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={isRTL ? book.title_ar : book.title_en} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center relative">
                            <GeometricBackground strokeOpacity={0.1} />
                            <BookOpen size={48} className="text-[#C9A24A] mb-4" />
                            <div className="text-[#C9A24A] text-xs font-bold uppercase tracking-wider line-clamp-3">
                              {isRTL ? book.title_ar : book.title_en}
                            </div>
                          </div>
                        )}
                        
                        {/* Premium Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-80 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                        {book.stock === 0 && (
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] flex items-center justify-center z-30">
                            <span className="bg-[#D4183D] text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg">{t('نفذت الكمية', 'Out of Stock')}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                      <div className="text-[10px] font-bold text-[#8B9D8A] uppercase tracking-wider mb-2">{book.author}</div>
                      <h3 className="text-[#062B24] font-bold text-sm leading-snug mb-4 line-clamp-2 group-hover:text-[#C9A24A] transition-colors">
                        {isRTL ? book.title_ar : book.title_en}
                      </h3>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          {book.salePrice && book.salePrice < book.price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#C9A24A] font-black text-lg">AED {book.salePrice}</span>
                              <span className="text-[#8B9D8A] text-xs line-through">AED {book.price}</span>
                            </div>
                          ) : (
                            <span className="text-[#062B24] font-black text-lg">AED {book.price}</span>
                          )}
                        </div>
                        <button onClick={(e) => handleAddToCart(e, book)} disabled={book.stock === 0}
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: book.stock > 0 ? 'linear-gradient(135deg, #C9A24A, #D8B75B)' : '#E5E7EB', color: book.stock > 0 ? BRAND.deep : '#8B9D8A' }}>
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
