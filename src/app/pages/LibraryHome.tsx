import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Download, CheckCircle, Search, Filter, Lock, ArrowRight, ArrowLeft, ShieldCheck, Cpu, Library as LibIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', primary: '#1B4D42', secondary: '#3A5A50', accent: '#7BBFAD', gold: '#C9A24A', light: '#F8F4EA', ivory: '#F8F4EA', sand: '#E8DDC7' };

function Door({ category, onClick, isRTL, isOpening }: { category: any, onClick: () => void, isRTL: boolean, isOpening: boolean }) {
  return (
    <div 
      className="relative aspect-[3/5] w-full max-w-[260px] mx-auto cursor-pointer group"
      style={{ perspective: '1200px' }}
      onClick={onClick}
    >
      {/* Door Frame & Wall Socket */}
      <div className="absolute inset-0 bg-[#062B24] rounded-t-full border-[8px] border-[#1B4D42] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-2 flex flex-col justify-end overflow-hidden">
        {/* The darkness inside the room */}
        <div className="absolute inset-0 bg-black opacity-95" />
        {/* Subtle glow from inside the room when door opens */}
        <div className={`absolute inset-0 bg-[#C9A24A] blur-3xl transition-opacity duration-1000 ${isOpening ? 'opacity-30' : 'opacity-0'}`} />
      </div>
      
      {/* The Door itself */}
      <motion.div 
        className="absolute inset-y-2 left-2 right-2 rounded-t-[120px] rounded-b-md bg-gradient-to-br from-[#C9A24A] via-[#A88232] to-[#73581F] shadow-[inset_0_0_30px_rgba(0,0,0,0.6),_5px_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center p-6 z-10"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isOpening ? (isRTL ? 105 : -105) : 0 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={!isOpening ? { rotateY: isRTL ? 8 : -8, scale: 1.02 } : {}}
        style={{ 
          transformOrigin: isRTL ? 'right center' : 'left center',
          transformStyle: 'preserve-3d' 
        }}
      >
        {/* Wood grain / Texture overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-50 mix-blend-overlay rounded-t-[120px] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

        {/* Door details */}
        <div className="w-full h-full border border-black/10 rounded-t-[110px] p-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-black/20 flex items-center justify-center mt-4 mb-auto shadow-inner bg-black/5">
             <LibIcon size={24} className="text-[#062B24] opacity-80" />
          </div>
          
          {/* Plaque */}
          <div className="bg-gradient-to-b from-[#111] to-[#062B24] border-2 border-[#1B4D42] text-[#C9A24A] px-4 py-3 rounded-lg shadow-xl text-center w-[110%] relative z-20 mb-12">
            <span className="font-bold text-lg tracking-wider" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
              {isRTL ? category.ar : category.en}
            </span>
          </div>
        </div>
        
        {/* Handle */}
        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-16 bg-gradient-to-b from-[#4A5D23] to-[#1B2910] rounded-full shadow-[2px_4px_10px_rgba(0,0,0,0.6)] ${isRTL ? 'left-4' : 'right-4'}`} />
      </motion.div>
    </div>
  );
}

export default function LibraryHome() {
  const { t, isRTL } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // New States for Interactive Doors
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [openingDoor, setOpeningDoor] = useState<string | null>(null);

  const categories = [
    { id: 'History', ar: 'علم التاريخ', en: 'History' },
    { id: 'Geography', ar: 'علم الجغرافيا', en: 'Geography' },
    { id: 'Interpretation', ar: 'علم التأويل', en: 'Interpretation' },
    { id: 'Semiotics', ar: 'علم السيميائية', en: 'Semiotics' },
    { id: 'Symbolism', ar: 'الرمزية', en: 'Symbolism' },
    { id: 'Manuscripts', ar: 'المخطوطات', en: 'Manuscripts' },
    { id: 'Cryptography', ar: 'علم التشفير', en: 'Cryptography' },
    { id: 'Philosophy', ar: 'الفلسفة', en: 'Philosophy' }
  ];

  useEffect(() => {
    // Fetch resources
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/library` : '/api/library')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setResources(data); setLoading(false); })
      .catch(() => { setResources([]); setLoading(false); });
  }, []);

  const hasAccess = currentUser?.hasLibraryAccess || currentUser?.role === 'admin';

  const handleDoorClick = (category: any) => {
    if (openingDoor) return;
    
    // Play sound
    try {
      const audio = new Audio('/assets/sounds/door-open.mp3');
      audio.volume = 0.6;
      audio.play().catch(e => console.log('Audio play failed, user may need to interact first', e));
    } catch (e) { }

    setOpeningDoor(category.id);
    
    // Wait for animation to finish
    setTimeout(() => {
      setSelectedCategory(category);
      setOpeningDoor(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const closeRoom = () => {
    setSelectedCategory(null);
    setSearch('');
  };

  const filteredResources = resources.filter(r => {
    if (!selectedCategory) return true;
    const matchesCategory = r.category === selectedCategory.id || r.category === selectedCategory.en || r.category === selectedCategory.ar;
    const matchesSearch = r.title_ar?.includes(search) || r.title_en?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ background: BRAND.ivory, minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <div className="relative pt-36 pb-16 overflow-hidden mb-8" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
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
              {t('المكتبة البحثية المميزة للطلاب والباحثين. اختر القسم واستكشف عالم المعرفة المخبأ خلف أبواب الأكاديمية.', 'The premium research library for students and researchers. Choose a section and explore the world of knowledge hidden behind the Academy doors.')}
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
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            /* ── GRAND HALLWAY (DOORS) ── */
            <motion.div 
              key="hallway"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-3xl font-black text-[#062B24] mb-12 text-center" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
                {t('أقسام المكتبة', 'Library Sections')}
                <div className="w-24 h-1 bg-[#C9A24A] mx-auto mt-4 rounded-full" />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 w-full max-w-5xl">
                {categories.map((cat, i) => (
                  <motion.div 
                    key={cat.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Door 
                      category={cat} 
                      onClick={() => handleDoorClick(cat)} 
                      isRTL={isRTL} 
                      isOpening={openingDoor === cat.id} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── INTERIOR ROOM (BOOKS SHELF) ── */
            <motion.div 
              key="room"
              initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
            >
              {/* Room Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b-2 border-[rgba(201,162,74,0.3)] pb-6">
                <div>
                  <button 
                    onClick={closeRoom}
                    className="flex items-center gap-2 text-[#5A7A70] hover:text-[#C9A24A] font-bold mb-4 transition-colors text-sm"
                  >
                    {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                    {t('العودة إلى الرواق', 'Return to Hallway')}
                  </button>
                  <h2 className="text-4xl font-black text-[#062B24]" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
                    {isRTL ? selectedCategory.ar : selectedCategory.en}
                  </h2>
                </div>

                <div className="relative w-full md:w-72">
                  <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-[#8B9D8A]" style={{ insetInlineStart: '16px' }} />
                  <input type="text"
                    placeholder={t('البحث في هذا القسم...', 'Search this section...')}
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full py-3 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] shadow-sm"
                    style={{ background: 'white', border: '1.5px solid rgba(6,43,36,0.1)', color: BRAND.deep, paddingInlineStart: '44px', paddingInlineEnd: '16px' }}
                  />
                </div>
              </div>

              {/* Books Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-3xl border border-[rgba(6,43,36,0.08)] overflow-hidden flex flex-col h-64 animate-pulse">
                      <div className="h-full w-1/3 bg-gray-200 float-left"></div>
                      <div className="p-6"></div>
                    </div>
                  ))}
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-[rgba(6,43,36,0.08)] shadow-sm">
                  <FileText size={64} className="text-[#C9A24A] opacity-50 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#062B24] mb-3">{t('القسم فارغ', 'Section Empty')}</h3>
                  <p className="text-[#5A7A70] text-lg">{t('سيتم إضافة موارد جديدة قريباً لهذا القسم.', 'New resources will be added to this section soon.')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 relative">
                  
                  {/* Decorative background shelves lines */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-0 opacity-10">
                    <div className="w-full h-1 bg-[#062B24] rounded-full mt-32" />
                    <div className="w-full h-1 bg-[#062B24] rounded-full mt-32" />
                    <div className="w-full h-1 bg-[#062B24] rounded-full mt-32" />
                  </div>

                  {filteredResources.map((res: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      onClick={() => navigate(`/library/${res.slug}`)}
                      className="relative bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row group transition-all duration-500 cursor-pointer z-10"
                      style={{ border: '1px solid rgba(201,162,74,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 15px 40px rgba(201,162,74,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,162,74,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(201,162,74,0.2)'; }}
                    >
                      {/* Header Image Area with "3D Floating Book" look */}
                      <div className={`relative w-full sm:w-[40%] p-4 sm:p-5 bg-gradient-to-br from-[#F8F4EA] to-white flex items-center justify-center shrink-0 border-b sm:border-b-0 ${isRTL ? 'sm:border-l' : 'sm:border-r'} border-[rgba(201,162,74,0.15)]`}>
                        <div className="w-[85%] aspect-[4/5] relative rounded-r-xl rounded-l-md overflow-hidden shadow-[-8px_12px_25px_rgba(6,43,36,0.25)] group-hover:scale-105 transition-all duration-500">
                          {/* Book Spine Overlay */}
                          <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/60 to-transparent w-6 z-20 pointer-events-none`} />
                          
                          {res.thumbnail ? (
                            <img src={res.thumbnail} alt={isRTL ? res.title_ar : res.title_en} className="absolute inset-0 w-full h-full object-cover z-10" />
                          ) : (
                            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#062B24] z-10 border-4 border-[#1B4D42]">
                              <BookOpen size={30} className="text-[#C9A24A] mb-2 relative z-10" />
                              <div className="text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider line-clamp-3 relative z-10 leading-relaxed">
                                {isRTL ? res.title_ar : res.title_en}
                              </div>
                            </div>
                          )}
                          
                          {!hasAccess && (
                            <div className="absolute top-2 right-2 bg-[#062B24]/90 backdrop-blur-md text-[#F87171] p-1.5 rounded-full shadow-lg z-30">
                              <Lock size={12} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col relative z-10 bg-white justify-center min-w-0">
                        <h3 className={`text-[#062B24] font-bold text-xl md:text-2xl leading-snug mb-3 group-hover:text-[#C9A24A] transition-colors line-clamp-2 text-${isRTL ? 'right' : 'left'}`}
                            style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
                          {isRTL ? res.title_ar : res.title_en}
                        </h3>
                        <p className={`text-[#5A7A70] text-sm leading-relaxed line-clamp-3 mb-6 text-${isRTL ? 'right' : 'left'}`}>
                          {isRTL ? res.description_ar : res.description_en}
                        </p>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between gap-2 text-xs font-semibold border-t border-[rgba(201,162,74,0.15)]">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[#8B9D8A] uppercase tracking-wider truncate">{res.author}</span>
                          </div>
                          <div className="flex items-center shrink-0 gap-1.5 text-[#C9A24A] bg-[#F8F4EA] px-3 py-1.5 rounded-full border border-[rgba(201,162,74,0.2)]">
                            <Download size={14} /> {res.downloadSize || 'PDF'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
