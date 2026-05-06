import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardRoot() {
  const { fontFamily, isRTL } = useLanguage();

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0B3A31',
            color: '#F8F4EA',
            border: '1px solid rgba(201,162,74,0.4)',
            fontFamily,
          },
        }}
      />
    </div>
  );
}
