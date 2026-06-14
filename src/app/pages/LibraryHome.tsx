import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Download, CheckCircle, Search, Filter, Lock, ArrowRight, ShieldCheck, Cpu, Library as LibIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
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

export default function LibraryHome() {
  const { t, isRTL } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'All', ar: 'الكل', en: 'All' },
    { id: 'Symbolism', ar: 'الرمزية', en: 'Symbolism' },
    { id: 'Cryptography', ar: 'التشفير', en: 'Cryptography' },
    { id: 'Semiotics', ar: 'السيميائية', en: 'Semiotics' },
    { id: 'Quranic', ar: 'الدراسات القرآنية', en: 'Quranic Studies' },
    { id: 'Manuscripts', ar: 'المخطوطات', en: 'Manuscripts' },
  ];

  useEffect(() => {
    // Fetch resources
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/library` : '/api/library')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setResources(data); setLoading(false); })
      .catch(() => { setResources([]); setLoading(false); });
  }, []);

  const filteredResources = resources.filter(r => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch = r.title_ar?.includes(search) || r.title_en?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const hasAccess = currentUser?.hasLibraryAccess || currentUser?.role === 'admin';

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
              <LibIcon size={14} /> {t('المكتبة الرقمية', 'Digital Research Library')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif' }}>
              {t('مكتبة الأكاديمية العليا للأبحاث', 'The Higher Academy Research Library')}
            </h1>
            <p className="text-[#A0B9B0] text-lg max-w-xl leading-relaxed mx-auto md:mx-0">
              {t('المكتبة البحثية المميزة للطلاب والباحثين. احصل على إمكانية الوصول إلى مئات الكتب والبحوث والمخطوطات.', 'The premium research library for students and researchers. Gain access to hundreds of books, papers, and manuscripts.')}
            </p>
            
            {!hasAccess && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <button onClick={() => navigate('/library/checkout')}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 4px 15px rgba(201,162,74,0.4)' }}>
                  <Lock size={16} /> {t('فتح المكتبة (499 درهم)', 'Unlock Library (AED 499)')}
                </button>
                <p className="text-[#7BBFAD] text-sm font-medium">{t('دفعة لمرة واحدة · وصول مدى الحياة', 'One-time payment · Lifetime access')}</p>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="w-full md:w-auto grid grid-cols-2 gap-4">
            {[
              { label: t('مورد بحثي', 'Resources'), val: '2,450+', icon: LibIcon },
              { label: t('ورقة بحثية', 'Research Papers'), val: '120+', icon: FileText },
              { label: t('كتب أكاديمية', 'Books'), val: '75+', icon: BookOpen },
              { label: t('ملاحظات محاضرات', 'Lecture Notes'), val: '300+', icon: Download },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                <stat.icon size={24} className="text-[#C9A24A] mx-auto mb-3" />
                <div className="text-2xl font-black text-white mb-1">{stat.val}</div>
                <div className="text-xs text-[#A0B9B0] uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
                placeholder={t('البحث في الموارد...', 'Search resources...')}
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full py-3.5 rounded-2xl text-sm outline-none transition-all focus:border-[#C9A24A]"
                style={{ background: 'white', border: '1.5px solid rgba(6,43,36,0.08)', color: BRAND.deep, paddingInlineStart: '44px', paddingInlineEnd: '16px' }}
              />
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

            {/* Pricing Box (If no access) */}
            {!hasAccess && (
              <div className="bg-[#062B24] rounded-2xl p-6 border border-[#1B4D42] text-center relative overflow-hidden">
                <ShieldCheck size={120} className="absolute -top-10 -right-10 text-white opacity-5" />
                <h3 className="text-white font-bold text-lg mb-1">{t('عضوية المكتبة', 'Library Membership')}</h3>
                <p className="text-[#8B9D8A] text-xs mb-4">{t('وصول دائم ومستمر لجميع الموارد', 'Continuous access to all resources')}</p>
                <div className="text-3xl font-black text-[#C9A24A] mb-4">AED 499</div>
                <div className="space-y-2 mb-6 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
                  {[
                    t('وصول لكل ملفات الـ PDF', 'All PDF Books'),
                    t('بحوث وأوراق أكاديمية', 'Research Papers'),
                    t('ملاحظات وملخصات المحاضرات', 'Lecture Notes'),
                    t('تحديثات مستقبلية مجانية', 'Free Future Updates')
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#7BBFAD]">
                      <CheckCircle size={14} className="text-[#C9A24A]" /> {feat}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/library/checkout')}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-white text-[#062B24] transition-all hover:bg-[#F8F4EA]">
                  {t('اشترك الآن', 'Get Access')}
                </button>
              </div>
            )}
          </div>

          {/* Resources Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#062B24]">{activeCategory === 'All' ? t('أحدث الموارد', 'New Uploads') : (isRTL ? categories.find(c => c.id === activeCategory)?.ar : categories.find(c => c.id === activeCategory)?.en)}</h2>
              <span className="text-[#8B9D8A] text-sm">{t(`${filteredResources.length} نتيجة`, `${filteredResources.length} Results`)}</span>
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
                        <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-16 bg-[#F8F4EA] rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[rgba(6,43,36,0.08)]">
                <FileText size={48} className="text-[#C9A24A] opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#062B24] mb-2">{t('لا توجد موارد بعد', 'No resources found')}</h3>
                <p className="text-[#5A7A70]">{t('جاري إضافة موارد جديدة للمكتبة.', 'New resources are being added to the library.')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResources.map((res: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => navigate(`/library/${res.slug}`)}
                    className="bg-white rounded-3xl border border-[rgba(6,43,36,0.08)] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col group">
                    {/* Header Image Area */}
                    <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#062B24] group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
                      {res.thumbnail ? (
                        <img src={res.thumbnail} alt={isRTL ? res.title_ar : res.title_en} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center relative">
                          <GeometricBackground strokeOpacity={0.1} />
                          <BookOpen size={48} className="text-[#C9A24A] mb-4" />
                          <div className="text-[#C9A24A] text-xs font-bold uppercase tracking-wider line-clamp-3">
                            {isRTL ? res.title_ar : res.title_en}
                          </div>
                        </div>
                      )}
                      
                      {/* Premium Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-80 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                      {res.isFeatured && (
                        <div className="absolute top-3 left-3 bg-[#C9A24A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {t('مميز', 'Featured')}
                        </div>
                      )}
                      {!hasAccess && (
                        <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md text-[#F87171] p-1.5 rounded-full shadow-sm border border-white/10">
                          <Lock size={14} />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-[10px] font-bold text-[#C9A24A] uppercase tracking-wider mb-2">{res.category}</div>
                      <h3 className="text-[#062B24] font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#C9A24A] transition-colors">
                        {isRTL ? res.title_ar : res.title_en}
                      </h3>
                      <p className="text-[#8B9D8A] text-xs mb-4 line-clamp-2">{isRTL ? res.description_ar : res.description_en}</p>
                      
                      <div className="mt-auto pt-4 border-t border-[rgba(6,43,36,0.06)] flex items-center justify-between text-[#5A7A70] text-[11px] font-medium">
                        <span>{res.author}</span>
                        <div className="flex items-center gap-1 bg-[#F8F4EA] px-2 py-1 rounded">
                          <Download size={10} /> {res.downloadSize || 'PDF'}
                        </div>
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
