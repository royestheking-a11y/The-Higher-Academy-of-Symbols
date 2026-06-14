import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ArrowRight, ArrowLeft, ShoppingCart, BookMarked, Tag, Info, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const BRAND = { deep: '#062B24', primary: '#1B4D42', secondary: '#3A5A50', accent: '#7BBFAD', gold: '#C9A24A', light: '#F8F4EA' };

export default function BookDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/books/${slug}` : `/api/books/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setBook(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      toast.success(t('تمت الإضافة للسلة', 'Added to cart'));
    }
  };

  if (loading) return <div className="pt-32 min-h-screen bg-[#F8F4EA] flex justify-center"><div className="w-8 h-8 border-4 border-[#C9A24A] border-t-transparent rounded-full animate-spin" /></div>;
  if (!book) return <div className="pt-32 min-h-screen bg-[#F8F4EA] text-center text-[#062B24]">{t('الكتاب غير موجود', 'Book not found')}</div>;

  return (
    <div className="pt-36 pb-20 min-h-screen bg-[#F8F4EA]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 text-[#5A7A70] hover:text-[#C9A24A] font-bold mb-8 transition-colors">
          {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {t('العودة للمتجر', 'Back to Store')}
        </button>

        <div className="bg-white rounded-3xl overflow-hidden border border-[rgba(6,43,36,0.08)] shadow-sm flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-2/5 bg-[#F8F4EA] p-8 lg:p-12 flex items-center justify-center relative">
            {book.isFeatured && (
              <div className="absolute top-6 right-6 bg-[#C9A24A] text-white px-3 py-1 rounded text-xs font-bold shadow-md">
                {t('مميز', 'Featured')}
              </div>
            )}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-[280px]">
              {book.coverImage ? (
                <img src={book.coverImage} className="w-full h-auto object-contain rounded shadow-2xl" alt={book.title_en} />
              ) : (
                <div className="w-full aspect-[2/3] bg-white rounded shadow-2xl flex items-center justify-center">
                  <BookMarked size={64} className="text-[#1B4D42] opacity-20" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="md:w-3/5 p-8 lg:p-12 flex flex-col">
            <div className="text-sm font-bold text-[#8B9D8A] uppercase tracking-wider mb-3">{book.author}</div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#062B24] mb-4 leading-tight">
              {isRTL ? book.title_ar : book.title_en}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {book.category && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F4EA] text-[#5A7A70] text-sm font-medium">
                  <Tag size={14} /> {book.category}
                </span>
              )}
              {book.language && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F4EA] text-[#5A7A70] text-sm font-medium">
                  <Info size={14} /> {book.language === 'ar' ? 'عربي' : book.language === 'en' ? 'English' : 'عربي & English'}
                </span>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-[#5A7A70] mb-8 leading-relaxed">
              {isRTL ? book.description_ar : book.description_en}
            </div>

            <div className="mt-auto border-t border-[rgba(6,43,36,0.08)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                {book.salePrice && book.salePrice < book.price ? (
                  <div>
                    <span className="text-3xl font-black text-[#C9A24A] mr-3">AED {book.salePrice}</span>
                    <span className="text-lg text-[#8B9D8A] line-through">AED {book.price}</span>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-[#062B24]">AED {book.price}</span>
                )}
                {book.stock > 0 ? (
                  <div className="text-sm font-bold text-[#25D366] mt-1 flex items-center gap-1"><CheckCircle size={14} /> {t('متوفر في المخزون', 'In Stock')}</div>
                ) : (
                  <div className="text-sm font-bold text-[#D4183D] mt-1">{t('نفذت الكمية', 'Out of Stock')}</div>
                )}
              </div>

              <button onClick={handleAddToCart} disabled={book.stock === 0}
                className="w-full sm:w-auto px-8 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: book.stock > 0 ? 'linear-gradient(135deg, #C9A24A, #D8B75B)' : '#E5E7EB', color: book.stock > 0 ? BRAND.deep : '#8B9D8A', boxShadow: book.stock > 0 ? '0 4px 15px rgba(201,162,74,0.3)' : 'none' }}>
                <ShoppingCart size={20} />
                {t('إضافة للسلة', 'Add to Cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
