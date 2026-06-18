import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, ShoppingCart, BookOpen, Tag, Info, CheckCircle, Star, Eye, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', primary: '#1B4D42', secondary: '#3A5A50', accent: '#7BBFAD', gold: '#C9A24A', light: '#F8F4EA' };

export default function BookDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/books/${slug}` : `/api/books/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setBook(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);



  const handleBuyNow = () => {
    if (book) {
      addToCart(book);
      if (!currentUser) {
        toast.info(t('الرجاء تسجيل الدخول لإتمام الشراء', 'Please login to checkout'));
        navigate('/login');
      } else {
        navigate('/store/checkout');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 min-h-screen bg-[#F8F4EA]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-32 h-6 bg-[rgba(6,43,36,0.05)] animate-pulse rounded mb-8" />
          
          <div className="bg-white rounded-[2rem] overflow-hidden border border-[rgba(201,162,74,0.15)] shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col md:flex-row min-h-[600px]">
            {/* Skeleton Left Pane */}
            <div className={`relative w-full md:w-[40%] lg:w-[35%] p-10 lg:p-12 bg-gradient-to-br from-[#F8F4EA] to-white flex flex-col items-center justify-center shrink-0 border-b md:border-b-0 ${isRTL ? 'md:border-l' : 'md:border-r'} border-[rgba(201,162,74,0.15)]`}>
              <div className="w-[70%] sm:w-[50%] md:w-[80%] aspect-[4/5] bg-[rgba(6,43,36,0.05)] animate-pulse rounded-r-2xl rounded-l-lg mb-10 transform -rotate-2 -translate-y-2 shadow-inner" />
            </div>

            {/* Skeleton Right Pane */}
            <div className="md:w-[60%] lg:w-[65%] p-8 lg:p-14 flex flex-col bg-white">
              <div className="w-3/4 h-10 lg:h-12 bg-[rgba(6,43,36,0.05)] animate-pulse rounded-lg mb-4" />
              <div className="w-1/2 h-10 lg:h-12 bg-[rgba(6,43,36,0.05)] animate-pulse rounded-lg mb-6" />
              <div className="space-y-4 mb-12 flex-1 mt-8">
                <div className="w-full h-3 bg-[rgba(6,43,36,0.04)] animate-pulse rounded" />
                <div className="w-full h-3 bg-[rgba(6,43,36,0.04)] animate-pulse rounded" />
                <div className="w-5/6 h-3 bg-[rgba(6,43,36,0.04)] animate-pulse rounded" />
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
  
  if (!book) return <div className="pt-32 min-h-screen bg-[#F8F4EA] text-center text-[#062B24]">{t('الكتاب غير موجود', 'Book not found')}</div>;

  return (
    <div className="pt-36 pb-20 min-h-screen bg-[#F8F4EA]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 text-[#5A7A70] hover:text-[#C9A24A] font-bold mb-8 transition-colors">
          {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {t('العودة للمتجر', 'Back to Store')}
        </button>

        <div className="bg-white rounded-[2rem] overflow-hidden border border-[rgba(201,162,74,0.15)] shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col md:flex-row">
          
          {/* Image Section (3D Book Layout) */}
          <div className={`relative w-full md:w-[40%] lg:w-[35%] p-10 lg:p-12 bg-gradient-to-br from-[#F8F4EA] to-white flex flex-col items-center justify-center shrink-0 border-b md:border-b-0 ${isRTL ? 'md:border-l' : 'md:border-r'} border-[rgba(201,162,74,0.15)]`}>
            {/* Decorative inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#C9A24A] opacity-15 blur-[60px] pointer-events-none" />

            {book.isFeatured && (
              <div className="absolute top-6 right-6 bg-gradient-to-r from-[#C9A24A] to-[#F0D98A] text-[#062B24] px-4 py-1.5 rounded-full text-xs font-black shadow-[0_4px_10px_rgba(201,162,74,0.3)] uppercase tracking-widest z-30">
                {t('مميز', 'Featured')}
              </div>
            )}

            <div className="w-[70%] sm:w-[50%] md:w-[80%] aspect-[4/5] relative rounded-r-2xl rounded-l-lg overflow-hidden shadow-[-10px_20px_40px_rgba(6,43,36,0.35)] mb-10 transform -rotate-2 -translate-y-2">
              {/* Book Spine Overlay */}
              <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/60 to-transparent w-7 z-20 pointer-events-none`} />
              <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-[2px]' : 'left-[2px]'} bg-white/20 w-px z-20 pointer-events-none mix-blend-overlay`} />

              {book.coverImage ? (
                <img src={book.coverImage} className="absolute inset-0 w-full h-full object-cover z-10" alt={isRTL ? book.title_ar : book.title_en} />
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#062B24] z-10">
                  <GeometricBackground strokeOpacity={0.1} />
                  <BookOpen size={56} className="text-[#C9A24A] mb-4 relative z-10" />
                  <div className="text-[#C9A24A] text-[12px] font-bold uppercase tracking-wider line-clamp-4 relative z-10 leading-relaxed">
                    {isRTL ? book.title_ar : book.title_en}
                  </div>
                </div>
              )}
              {/* Lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 opacity-70 z-20 pointer-events-none" />
              
              {/* Out of stock badge */}
              {book.stock === 0 && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[4px] flex items-center justify-center z-30">
                  <span className="bg-[#D4183D] text-white font-bold px-6 py-2 rounded-full text-base shadow-xl">{t('نفذت الكمية', 'Out of Stock')}</span>
                </div>
              )}
            </div>
            
            {/* Quick Metadata under cover */}
            <div className="flex w-full gap-4 relative z-10">
              <div className="flex-1 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-[rgba(201,162,74,0.3)] text-center shadow-sm">
                <div className="text-[10px] text-[#C9A24A] font-black tracking-widest uppercase mb-1">{t('النوع', 'Type')}</div>
                <div className="text-sm font-bold text-[#062B24]">{book.format || 'Physical Book'}</div>
              </div>
              <div className="flex-1 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-[rgba(201,162,74,0.3)] text-center shadow-sm">
                <div className="text-[10px] text-[#C9A24A] font-black tracking-widest uppercase mb-1">{t('الصفحات', 'Pages')}</div>
                <div className="text-sm font-bold text-[#062B24]">{book.pages || '--'}</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-[60%] lg:w-[65%] p-8 lg:p-14 flex flex-col bg-white">
            <div className={`flex items-center gap-3 mb-6 opacity-90 ${isRTL ? 'justify-start' : 'justify-start'}`}>
              <span className="text-[11px] font-black text-[#C9A24A] uppercase tracking-[0.25em]">{book.category}</span>
              <div className={`h-[1px] flex-1 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#C9A24A]/40 to-transparent`} />
            </div>

            <h1 className={`text-[#062B24] font-black text-3xl lg:text-5xl leading-tight mb-6 text-${isRTL ? 'right' : 'left'}`}
                style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
              {isRTL ? book.title_ar : book.title_en}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-10 pb-8 border-b border-[rgba(201,162,74,0.15)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F8F4EA] flex items-center justify-center text-[#C9A24A] border border-[rgba(201,162,74,0.2)]">
                  <BookOpen size={14} />
                </div>
                <span className="text-sm font-bold text-[#5A7A70] tracking-wider uppercase">{book.author}</span>
              </div>
              <div className="w-px h-5 bg-[rgba(201,162,74,0.3)] mx-1 hidden sm:block" />
              
              {book.language && (
                <div className="flex items-center gap-1.5 text-[#5A7A70] text-sm font-bold bg-[#F8F4EA] px-3 py-1 rounded-full border border-[rgba(201,162,74,0.15)]">
                  <Info size={14} /> {book.language === 'ar' ? 'عربي' : book.language === 'en' ? 'English' : 'عربي & English'}
                </div>
              )}
            </div>

            <div className="relative mb-12 flex-1">
               <h3 className="text-sm font-bold text-[#062B24] mb-4 uppercase tracking-widest">{t('عن هذا الكتاب', 'About this book')}</h3>
               <div className="relative prose prose-sm md:prose-base max-w-none leading-loose text-[#5A7A70]">
                 {isRTL ? book.description_ar : book.description_en}
               </div>
            </div>

            <div className="mt-auto border-t border-[rgba(201,162,74,0.15)] pt-8 flex flex-col gap-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-[#C9A24A] font-black tracking-widest uppercase mb-2">{t('السعر', 'Price')}</div>
                  {book.salePrice && book.salePrice < book.price ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-[#062B24]">AED {book.salePrice}</span>
                        <span className="text-xl text-[#8B9D8A] line-through">AED {book.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFEFEF] text-[#D4183D] text-xs font-bold px-3 py-1 rounded-full">
                          {t('توفير', 'Save')} AED {book.price - book.salePrice}
                        </span>
                        <span className="text-[#5A7A70] text-xs font-bold">
                          ({Math.round(((book.price - book.salePrice) / book.price) * 100)}% {t('خصم', 'off')})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-4xl font-black text-[#062B24]">AED {book.price}</span>
                  )}
                  {book.stock > 0 ? (
                    <div className="text-sm font-bold text-[#25D366] mt-2 flex items-center gap-1.5"><CheckCircle size={14} /> {t('متوفر في المخزون', 'In Stock')}</div>
                  ) : (
                    <div className="text-sm font-bold text-[#D4183D] mt-2">{t('نفذت الكمية', 'Out of Stock')}</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleBuyNow} disabled={book.stock === 0}
                  className="flex-1 px-8 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-[#062B24] transition-all hover:-translate-y-1 shadow-[0_10px_20px_rgba(201,162,74,0.3)] disabled:opacity-50 disabled:hover:translate-y-0"
                  style={{ background: book.stock > 0 ? 'linear-gradient(135deg, #C9A24A, #F0D98A)' : '#E5E7EB', color: book.stock > 0 ? BRAND.deep : '#8B9D8A' }}>
                  <CreditCard size={20} /> {t('شراء الآن', 'Buy Now')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
