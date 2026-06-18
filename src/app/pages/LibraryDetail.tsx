import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, Download, FileText, Lock, Eye, CheckCircle, Star, BookOpen } from 'lucide-react';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', primary: '#1B4D42', secondary: '#3A5A50', accent: '#7BBFAD', gold: '#C9A24A', light: '#F8F4EA' };

export default function LibraryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { currentUser } = useAuth();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/library/${slug}` : `/api/library/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setResource(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const hasAccess = currentUser?.hasLibraryAccess || currentUser?.role === 'admin';

  if (loading) {
    return (
      <div className="pt-36 pb-20 min-h-screen bg-[#F8F4EA]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-32 h-6 bg-[rgba(6,43,36,0.05)] animate-pulse rounded mb-8" />
          
          <div className="bg-white rounded-[2rem] overflow-hidden border border-[rgba(201,162,74,0.15)] shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col md:flex-row min-h-[600px]">
            {/* Skeleton Left Pane */}
            <div className={`relative w-full md:w-[40%] lg:w-[35%] p-10 lg:p-12 bg-gradient-to-br from-[#F8F4EA] to-white flex flex-col items-center justify-center shrink-0 border-b md:border-b-0 ${isRTL ? 'md:border-l' : 'md:border-r'} border-[rgba(201,162,74,0.15)]`}>
              <div className="w-[70%] sm:w-[50%] md:w-[80%] aspect-[4/5] bg-[rgba(6,43,36,0.05)] animate-pulse rounded-r-2xl rounded-l-lg mb-10 transform -rotate-2 -translate-y-2 shadow-inner" />
              <div className="flex w-full gap-4">
                <div className="flex-1 h-[72px] bg-[rgba(6,43,36,0.03)] animate-pulse rounded-2xl border border-[rgba(201,162,74,0.1)]" />
                <div className="flex-1 h-[72px] bg-[rgba(6,43,36,0.03)] animate-pulse rounded-2xl border border-[rgba(201,162,74,0.1)]" />
              </div>
            </div>

            {/* Skeleton Right Pane */}
            <div className="md:w-[60%] lg:w-[65%] p-8 lg:p-14 flex flex-col bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-24 h-3 bg-[rgba(201,162,74,0.15)] animate-pulse rounded" />
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(201,162,74,0.1)] to-transparent" />
              </div>
              
              <div className="w-3/4 h-10 lg:h-12 bg-[rgba(6,43,36,0.05)] animate-pulse rounded-lg mb-4" />
              <div className="w-1/2 h-10 lg:h-12 bg-[rgba(6,43,36,0.05)] animate-pulse rounded-lg mb-6" />

              <div className="flex flex-wrap gap-4 mb-10 pb-8 border-b border-[rgba(201,162,74,0.1)]">
                <div className="w-32 h-8 bg-[rgba(6,43,36,0.03)] animate-pulse rounded-full" />
                <div className="w-24 h-8 bg-[rgba(6,43,36,0.03)] animate-pulse rounded-full" />
                <div className="w-24 h-8 bg-[rgba(6,43,36,0.03)] animate-pulse rounded-full" />
              </div>

              <div className="w-40 h-4 bg-[rgba(6,43,36,0.06)] animate-pulse rounded mb-6" />
              <div className="space-y-4 mb-12 flex-1">
                <div className="w-full h-3 bg-[rgba(6,43,36,0.04)] animate-pulse rounded" />
                <div className="w-full h-3 bg-[rgba(6,43,36,0.04)] animate-pulse rounded" />
                <div className="w-5/6 h-3 bg-[rgba(6,43,36,0.04)] animate-pulse rounded" />
                <div className="w-2/3 h-3 bg-[rgba(6,43,36,0.04)] animate-pulse rounded" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex-1 h-16 bg-[rgba(6,43,36,0.06)] animate-pulse rounded-2xl" />
                <div className="flex-1 h-16 bg-[rgba(201,162,74,0.15)] animate-pulse rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!resource) return <div className="pt-32 min-h-screen bg-[#F8F4EA] text-center text-[#062B24]">{t('المورد غير موجود', 'Resource not found')}</div>;

  return (
    <div className="pt-36 pb-20 min-h-screen bg-[#F8F4EA]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/library')} className="flex items-center gap-2 text-[#5A7A70] hover:text-[#C9A24A] font-bold mb-8 transition-colors">
          {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {t('العودة للمكتبة', 'Back to Library')}
        </button>

        <div className="bg-white rounded-[2rem] overflow-hidden border border-[rgba(201,162,74,0.15)] shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col md:flex-row">
          {/* Image/Icon Section (3D Book Layout) */}
          <div className={`relative w-full md:w-[40%] lg:w-[35%] p-10 lg:p-12 bg-gradient-to-br from-[#F8F4EA] to-white flex flex-col items-center justify-center shrink-0 border-b md:border-b-0 ${isRTL ? 'md:border-l' : 'md:border-r'} border-[rgba(201,162,74,0.15)]`}>
            {/* Decorative inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#C9A24A] opacity-15 blur-[60px] pointer-events-none" />

            <div className="w-[70%] sm:w-[50%] md:w-[80%] aspect-[4/5] relative rounded-r-2xl rounded-l-lg overflow-hidden shadow-[-10px_20px_40px_rgba(6,43,36,0.35)] mb-10 transform -rotate-2 -translate-y-2">
              {/* Book Spine Overlay */}
              <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/60 to-transparent w-7 z-20 pointer-events-none`} />
              <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-[2px]' : 'left-[2px]'} bg-white/20 w-px z-20 pointer-events-none mix-blend-overlay`} />

              {resource.thumbnail ? (
                <img src={resource.thumbnail} alt={isRTL ? resource.title_ar : resource.title_en} className="absolute inset-0 w-full h-full object-cover z-10" />
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#062B24] z-10">
                  <GeometricBackground strokeOpacity={0.1} />
                  <FileText size={56} className="text-[#C9A24A] mb-4 relative z-10" />
                  <div className="text-[#C9A24A] text-[12px] font-bold uppercase tracking-wider line-clamp-4 relative z-10 leading-relaxed">
                    {isRTL ? resource.title_ar : resource.title_en}
                  </div>
                </div>
              )}
              {/* Lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 opacity-70 z-20 pointer-events-none" />
            </div>
            
            <div className="flex w-full gap-4 relative z-10">
              <div className="flex-1 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-[rgba(201,162,74,0.3)] text-center shadow-sm">
                <div className="text-[10px] text-[#C9A24A] font-black tracking-widest uppercase mb-1">{t('النوع', 'Type')}</div>
                <div className="text-sm font-bold text-[#062B24]">{resource.fileType || 'PDF'}</div>
              </div>
              <div className="flex-1 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-[rgba(201,162,74,0.3)] text-center shadow-sm">
                <div className="text-[10px] text-[#C9A24A] font-black tracking-widest uppercase mb-1">{t('الحجم', 'Size')}</div>
                <div className="text-sm font-bold text-[#062B24]">{resource.downloadSize || '-- MB'}</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-[60%] lg:w-[65%] p-8 lg:p-14 flex flex-col bg-white">
            <div className={`flex items-center gap-3 mb-6 opacity-90 ${isRTL ? 'justify-start' : 'justify-start'}`}>
              <span className="text-[11px] font-black text-[#C9A24A] uppercase tracking-[0.25em]">{resource.category}</span>
              <div className={`h-[1px] flex-1 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#C9A24A]/40 to-transparent`} />
            </div>

            <h1 className={`text-[#062B24] font-black text-3xl lg:text-5xl leading-tight mb-6 text-${isRTL ? 'right' : 'left'}`}
                style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
              {isRTL ? resource.title_ar : resource.title_en}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-10 pb-8 border-b border-[rgba(201,162,74,0.15)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F8F4EA] flex items-center justify-center text-[#C9A24A] border border-[rgba(201,162,74,0.2)]">
                  <BookOpen size={14} />
                </div>
                <span className="text-sm font-bold text-[#5A7A70] tracking-wider uppercase">{resource.author}</span>
              </div>
              <div className="w-px h-5 bg-[rgba(201,162,74,0.3)] mx-1 hidden sm:block" />
              <div className="flex items-center gap-1.5 text-[#C9A24A] text-sm font-bold">
                <Star size={16} fill="currentColor" />
                <span>{resource.rating || 4.9} <span className="text-[#8B9D8A] font-medium">({resource.reviewsCount || 128} {t('تقييم', 'Reviews')})</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8B9D8A] text-sm font-bold">
                <Eye size={16} />
                <span>{resource.views ? resource.views.toLocaleString() : '1,200'} {t('مشاهدة', 'Views')}</span>
              </div>
            </div>

            <div className="relative mb-12 flex-1">
              <h3 className="text-sm font-bold text-[#062B24] mb-4 uppercase tracking-widest">{t('عن هذا المورد', 'About this manuscript')}</h3>
              
              <div className="relative prose prose-sm md:prose-base max-w-none leading-loose">
                {/* Real Description */}
                <div className={`text-[#5A7A70] ${!hasAccess ? 'line-clamp-2' : ''}`}>
                  {isRTL ? resource.description_ar : resource.description_en}
                </div>
                
                {/* Fake Blurred Lines & Pill */}
                {!hasAccess && (
                  <div className="relative mt-2">
                    <div className="text-[#5A7A70] blur-[4px] opacity-40 select-none pointer-events-none line-clamp-3">
                      {isRTL 
                        ? 'هذا النص مموه لأنه يتطلب وصولاً للمكتبة لقراءته بالكامل. تحتوي هذه المخطوطة على معلومات قيمة ودراسات تحليلية عميقة لا تتوفر إلا للأعضاء المشتركين. يرجى الترقية الآن لفتح المحتوى الكامل والاستفادة من هذا المورد الحصري.'
                        : 'This text is blurred because it requires library access to read in full. This manuscript contains highly valuable information, deep analytical studies, and exclusive insights that are only available to premium members. Please upgrade your account now to unlock the complete contents and benefit from this exclusive resource.'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent flex items-center justify-center pointer-events-none">
                       <span className="text-xs font-bold text-[#C9A24A] bg-[#F8F4EA] px-4 py-1.5 rounded-full border border-[rgba(201,162,74,0.2)] shadow-sm">
                         {t('يجب فتح المكتبة لقراءة المزيد', 'Unlock library to read full details')}
                       </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto">
              {hasAccess ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 px-8 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-white transition-all hover:-translate-y-1 shadow-[0_10px_20px_rgba(6,43,36,0.15)]"
                    style={{ background: BRAND.deep }}>
                    <Eye size={20} /> {t('معاينة المخطوطة', 'Preview Manuscript')}
                  </a>
                  <a href={resource.fileUrl} download
                    className="flex-1 px-8 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-[#062B24] transition-all hover:-translate-y-1 shadow-[0_10px_20px_rgba(201,162,74,0.3)]"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #F0D98A)' }}>
                    <Download size={20} /> {t('تحميل المخطوطة', 'Download Manuscript')}
                  </a>
                </div>
              ) : (
                <div className="bg-[#062B24] rounded-3xl p-8 relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 justify-between shadow-2xl">
                  {/* Decorative faint grid/lock in background */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <svg width="100%" height="100%" viewBox="0 0 400 200"><defs><pattern id="grid-lock" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A24A" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid-lock)"/></svg>
                  </div>
                  <Lock size={160} className="absolute -right-12 -top-12 text-[#C9A24A] opacity-10 pointer-events-none" />
                  
                  <div className="relative z-10 text-white max-w-sm">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[rgba(201,162,74,0.2)] text-[#C9A24A] text-xs font-bold uppercase tracking-wider mb-3">
                      <Lock size={12} /> {t('محتوى حصري', 'Exclusive Content')}
                    </div>
                    <h3 className="font-black text-2xl mb-2">{t('هذا المورد مقفل', 'This manuscript is locked')}</h3>
                    <p className="text-[#A0B9B0] text-sm leading-relaxed">{t('يرجى ترقية حسابك للحصول على وصول كامل للمكتبة.', 'Please upgrade your account to get full library access.')}</p>
                  </div>
                  <button onClick={() => {
                      if (!currentUser) {
                        navigate('/register');
                      } else {
                        navigate('/library/checkout');
                      }
                    }}
                    className="relative z-10 w-full sm:w-auto whitespace-nowrap px-8 py-4 rounded-2xl font-bold text-sm text-[#062B24] transition-all hover:scale-105 shadow-[0_10px_20px_rgba(201,162,74,0.3)]"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #F0D98A)' }}>
                    {t('فتح المكتبة', 'Unlock Library')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

