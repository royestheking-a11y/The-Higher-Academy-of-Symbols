import { Outlet, ScrollRestoration } from 'react-router';
import { Toaster } from 'sonner';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { useLanguage } from '../context/LanguageContext';

export default function Root() {
  const { fontFamily } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily, background: '#F8F4EA' }}>
      <ScrollRestoration />
      {/* Fixed header wrapper — announcement bar sits above navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
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
