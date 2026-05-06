import { useState } from 'react';
import { Link } from 'react-router';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export function Footer() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { settings } = useData();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const quickLinks = [
    { label_ar: 'الرئيسية', label_en: 'Home', to: '/' },
    { label_ar: 'عن الأكاديمية', label_en: 'About', to: '/about' },
    { label_ar: 'المحاضرات', label_en: 'Lectures', to: '/lectures' },
    { label_ar: 'المقالات', label_en: 'Articles', to: '/articles' },
    { label_ar: 'مجالات الدراسة', label_en: 'Areas of Study', to: '/areas-of-study' },
    { label_ar: 'تواصل معنا', label_en: 'Contact Us', to: '/contact' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{ background: '#062B24', fontFamily }}>
      {/* Gold divider */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C9A24A, #F0D98A, #C9A24A, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Logo + About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="rounded-full overflow-hidden shrink-0"
                style={{ width: 52, height: 52, boxShadow: '0 3px 16px rgba(201,162,74,0.4)', background: '#062B24' }}
              >
                <img src="/symbolacademy.png" alt="The Higher Academy of Symbols" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div>
                <div className="text-[#F0D98A] text-base font-bold leading-tight">
                  {t('الأكاديمية العليا للرموز', 'The Higher Academy of Symbols')}
                </div>
              </div>
            </div>
            <p className="text-[#8B9D8A] text-sm leading-relaxed mb-5">
              {t(settings?.aboutText_ar ?? '', settings?.aboutText_en ?? '')}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#C9A24A] hover:text-[#062B24] transition-all duration-200"
                  style={{ background: 'rgba(201,162,74,0.12)', border: '1px solid rgba(201,162,74,0.25)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#C9A24A'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,162,74,0.12)'}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-[#F0D98A] text-sm font-semibold uppercase tracking-widest mb-5">
              {t('روابط سريعة', 'Quick Links')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-[#8B9D8A] hover:text-[#C9A24A] text-sm transition-colors group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 transition-all group-hover:scale-125"
                      style={{ background: '#C9A24A' }}
                    />
                    {t(link.label_ar, link.label_en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h3 className="text-[#F0D98A] text-sm font-semibold uppercase tracking-widest mb-5">
              {t('تواصل معنا', 'Contact Us')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C9A24A] mt-0.5 shrink-0" />
                <span className="text-[#8B9D8A] text-sm">{t(settings?.address_ar ?? '', settings?.address_en ?? '')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#C9A24A] shrink-0" />
                <div className="space-y-1">
                  <a href={`tel:${settings?.phone1}`} className="block text-[#8B9D8A] hover:text-[#C9A24A] text-sm transition-colors" dir="ltr">{settings?.phone1}</a>
                  <a href={`tel:${settings?.phone2}`} className="block text-[#8B9D8A] hover:text-[#C9A24A] text-sm transition-colors" dir="ltr">{settings?.phone2}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#C9A24A] shrink-0" />
                <a href={`mailto:${settings?.email}`} className="text-[#8B9D8A] hover:text-[#C9A24A] text-sm transition-colors break-all">{settings?.email}</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-[#F0D98A] text-sm font-semibold uppercase tracking-widest mb-5">
              {t('النشرة البريدية', 'Newsletter')}
            </h3>
            <p className="text-[#8B9D8A] text-sm mb-4">
              {t('اشترك للحصول على آخر المحاضرات والمقالات.', 'Subscribe for the latest lectures and articles.')}
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl text-sm text-[#C9A24A] text-center" style={{ background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.3)' }}>
                {t('شكراً! تم اشتراكك بنجاح.', 'Thank you! Successfully subscribed.')}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('بريدك الإلكتروني', 'Your email address')}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-[#F8F4EA] placeholder-[#4A6B60] outline-none"
                  style={{ background: 'rgba(11,58,49,0.8)', border: '1px solid rgba(201,162,74,0.25)', fontFamily }}
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: '#062B24', boxShadow: '0 3px 0 #8B6B20' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 #8B6B20'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 3px 0 #8B6B20'; }}
                >
                  <Send size={15} />
                  {t('اشتراك', 'Subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(201,162,74,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#4A6B60] text-xs text-center">
            {t(
              `© 2026 الأكاديمية العليا للرموز. جميع الحقوق محفوظة.`,
              `© 2026 The Higher Academy of Symbols. All rights reserved.`
            )}
          </p>
          <p className="text-[#4A6B60] text-xs flex items-center gap-1">
            {t('تصميم وتطوير', 'Designed & Developed by')}
            <a href="https://rizqara.tech" target="_blank" rel="noopener noreferrer" className="text-[#C9A24A] hover:text-[#F0D98A] transition-colors flex items-center gap-1 font-medium">
              Aurangzeb Sunny (Rizqara Tech) <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}