import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A' };

export default function NotFound() {
  const { t, isRTL, fontFamily } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})`, fontFamily }}>
      <div>
        <div className="text-[#C9A24A] font-bold mb-4" style={{ fontSize: 'clamp(5rem, 15vw, 10rem)', fontFamily: 'Cormorant Garamond, serif', lineHeight: '1' }}>404</div>
        <h1 className="text-[#F0D98A] mb-3" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '700' }}>
          {t('الصفحة غير موجودة', 'Page Not Found')}
        </h1>
        <p className="text-[#8B9D8A] text-sm mb-8 max-w-md mx-auto">
          {t('الصفحة التي تبحث عنها غير موجودة أو تم نقلها.', 'The page you are looking for does not exist or has been moved.')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.2)' }}
        >
          {t('العودة للرئيسية', 'Back to Home')}
        </Link>
      </div>
    </div>
  );
}
