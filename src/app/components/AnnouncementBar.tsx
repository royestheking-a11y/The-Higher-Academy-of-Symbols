import { useState } from 'react';
import { X, MegaphoneIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const { t, isRTL } = useLanguage();
  const { settings } = useData();

  if (!visible || !settings?.announcementEnabled) return null;

  return (
    <div
      style={{ background: 'linear-gradient(90deg, #C9A24A, #D8B75B, #C9A24A)', fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}
      className="relative w-full py-2.5 px-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <MegaphoneIcon size={15} className="text-[#062B24] shrink-0" />
        <Link
          to={settings?.announcementLink || '/lectures'}
          className="text-[#062B24] text-sm font-semibold hover:underline transition-all"
        >
          {t(settings?.announcement_ar ?? '', settings?.announcement_en ?? '')}
        </Link>
        <button
          onClick={() => setVisible(false)}
          className="absolute end-4 top-1/2 -translate-y-1/2 text-[#062B24] hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}