import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, Download, FileText, Lock, Eye, CheckCircle } from 'lucide-react';

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

  if (loading) return <div className="pt-32 min-h-screen bg-[#F8F4EA] flex justify-center"><div className="w-8 h-8 border-4 border-[#C9A24A] border-t-transparent rounded-full animate-spin" /></div>;
  if (!resource) return <div className="pt-32 min-h-screen bg-[#F8F4EA] text-center text-[#062B24]">{t('المورد غير موجود', 'Resource not found')}</div>;

  return (
    <div className="pt-36 pb-20 min-h-screen bg-[#F8F4EA]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/library')} className="flex items-center gap-2 text-[#5A7A70] hover:text-[#C9A24A] font-bold mb-8 transition-colors">
          {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {t('العودة للمكتبة', 'Back to Library')}
        </button>

        <div className="bg-white rounded-3xl overflow-hidden border border-[rgba(6,43,36,0.08)] shadow-sm flex flex-col md:flex-row">
          {/* Image/Icon Section */}
          <div className="md:w-1/3 bg-[#F8F4EA] p-8 flex flex-col items-center justify-center relative border-r border-[rgba(6,43,36,0.05)]">
            {resource.thumbnail ? (
              <img src={resource.thumbnail} className="w-full h-auto max-h-64 object-contain" alt={resource.title_en} />
            ) : (
              <FileText size={80} className="text-[#1B4D42] opacity-20" />
            )}
            
            <div className="mt-8 flex gap-4 w-full">
              <div className="flex-1 bg-white p-3 rounded-xl border border-[rgba(6,43,36,0.05)] text-center">
                <div className="text-[10px] text-[#8B9D8A] uppercase mb-1">{t('النوع', 'Type')}</div>
                <div className="text-sm font-bold text-[#062B24]">{resource.fileType || 'PDF'}</div>
              </div>
              <div className="flex-1 bg-white p-3 rounded-xl border border-[rgba(6,43,36,0.05)] text-center">
                <div className="text-[10px] text-[#8B9D8A] uppercase mb-1">{t('الحجم', 'Size')}</div>
                <div className="text-sm font-bold text-[#062B24]">{resource.downloadSize || '-- MB'}</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-8 lg:p-12 flex flex-col">
            <div className="inline-block px-3 py-1 rounded bg-[#F8F4EA] text-[#C9A24A] text-xs font-bold uppercase tracking-widest mb-4 w-fit">
              {resource.category}
            </div>
            <h1 className="text-3xl font-black text-[#062B24] mb-3 leading-tight">
              {isRTL ? resource.title_ar : resource.title_en}
            </h1>
            <div className="text-sm font-bold text-[#5A7A70] mb-8">{t('تأليف:', 'By:')} {resource.author}</div>

            <div className="prose prose-sm max-w-none text-[#5A7A70] mb-8 leading-relaxed">
              {isRTL ? resource.description_ar : resource.description_en}
            </div>

            <div className="mt-auto border-t border-[rgba(6,43,36,0.08)] pt-8">
              {hasAccess ? (
                <div className="flex flex-wrap gap-4">
                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all hover:scale-[1.02]"
                    style={{ background: BRAND.deep }}>
                    <Eye size={18} /> {t('معاينة الملف', 'Preview File')}
                  </a>
                  <a href={resource.fileUrl} download
                    className="flex-1 min-w-[200px] px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[#062B24] transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)' }}>
                    <Download size={18} /> {t('تحميل الملف', 'Download File')}
                  </a>
                </div>
              ) : (
                <div className="bg-[#062B24] rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <Lock size={120} className="absolute -right-10 -top-10 text-white opacity-5" />
                  <div className="relative z-10 text-white">
                    <h3 className="font-bold text-lg mb-1">{t('هذا المورد مقفل', 'This resource is locked')}</h3>
                    <p className="text-[#8B9D8A] text-sm">{t('يرجى ترقية حسابك للحصول على وصول كامل للمكتبة.', 'Please upgrade your account to get full library access.')}</p>
                  </div>
                  <button onClick={() => {
                      if (!currentUser) {
                        navigate('/register');
                      } else {
                        navigate('/library/checkout');
                      }
                    }}
                    className="relative z-10 w-full sm:w-auto whitespace-nowrap px-8 py-3 rounded-xl font-bold text-sm bg-white text-[#062B24] transition-all hover:bg-[#F8F4EA]">
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
