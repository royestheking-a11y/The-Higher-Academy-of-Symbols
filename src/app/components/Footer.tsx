import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Youtube, ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export function Footer() {
  const { t, language, setLanguage, isRTL, fontFamily } = useLanguage();
  const { settings } = useData();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Load Google Translate Script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'ar', layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      };
    }
  }, []);

  const quickLinks = [
    { label_ar: 'الرئيسية', label_en: 'Home', to: '/' },
    { label_ar: 'عن الأكاديمية', label_en: 'About', to: '/about' },
    { label_ar: 'المحاضرات', label_en: 'Lectures', to: '/lectures' },
    { label_ar: 'المقالات', label_en: 'Articles', to: '/articles' },
    { label_ar: 'مجالات الدراسة', label_en: 'Areas of Study', to: '/areas-of-study' },
    { label_ar: 'المكتبة الرقمية', label_en: 'Digital Library', to: '/library' },
    { label_ar: 'المتجر الأكاديمي', label_en: 'Academy Store', to: '/store' },
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
                <img src="/symbolacademy.png" alt="The Higher Academy of Symbols and Code" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div>
                <div className="text-[#F0D98A] text-base font-bold leading-tight">
                  {t('الأكاديمية العليا للرموز والشيفرة', 'The Higher Academy of Symbols and Code')}
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

            {/* Language Selector */}
            <div className="mt-8">
              <h3 className="text-[#F0D98A] text-sm font-semibold uppercase tracking-widest mb-3">
                {t('اللغة', 'Language')}
              </h3>
              <div className="relative inline-flex items-center">
                <Globe size={16} className="absolute start-3 text-[#C9A24A]" />
                <select 
                  value={language} 
                  onChange={(e) => {
                    const lang = e.target.value;
                    setLanguage(lang);
                    
                    // Set google translate cookies for absolute reliability
                    document.cookie = `googtrans=/ar/${lang}; path=/`;
                    if (window.location.hostname !== 'localhost') {
                      document.cookie = `googtrans=/ar/${lang}; domain=.${window.location.hostname}; path=/`;
                    }
                    
                    const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (googleSelect) {
                      googleSelect.value = lang;
                      googleSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                      window.location.reload();
                    }
                  }} 
                  className="appearance-none bg-[#0B3A31] border border-[rgba(201,162,74,0.25)] text-[#F8F4EA] text-sm rounded-xl py-2.5 ps-9 pe-8 focus:outline-none focus:border-[#C9A24A] transition-colors cursor-pointer w-full max-w-[200px]" 
                  style={{ fontFamily }}
                >
                  <option value="af">Afrikaans</option>
                  <option value="sq">Albanian</option>
                  <option value="am">Amharic</option>
                  <option value="ar">Arabic</option>
                  <option value="hy">Armenian</option>
                  <option value="az">Azerbaijani</option>
                  <option value="eu">Basque</option>
                  <option value="be">Belarusian</option>
                  <option value="bn">Bengali</option>
                  <option value="bs">Bosnian</option>
                  <option value="bg">Bulgarian</option>
                  <option value="ca">Catalan</option>
                  <option value="ceb">Cebuano</option>
                  <option value="ny">Chichewa</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                  <option value="zh-TW">Chinese (Traditional)</option>
                  <option value="co">Corsican</option>
                  <option value="hr">Croatian</option>
                  <option value="cs">Czech</option>
                  <option value="da">Danish</option>
                  <option value="nl">Dutch</option>
                  <option value="en">English</option>
                  <option value="eo">Esperanto</option>
                  <option value="et">Estonian</option>
                  <option value="tl">Filipino</option>
                  <option value="fi">Finnish</option>
                  <option value="fr">French</option>
                  <option value="fy">Frisian</option>
                  <option value="gl">Galician</option>
                  <option value="ka">Georgian</option>
                  <option value="de">German</option>
                  <option value="el">Greek</option>
                  <option value="gu">Gujarati</option>
                  <option value="ht">Haitian Creole</option>
                  <option value="ha">Hausa</option>
                  <option value="haw">Hawaiian</option>
                  <option value="iw">Hebrew</option>
                  <option value="hi">Hindi</option>
                  <option value="hmn">Hmong</option>
                  <option value="hu">Hungarian</option>
                  <option value="is">Icelandic</option>
                  <option value="ig">Igbo</option>
                  <option value="id">Indonesian</option>
                  <option value="ga">Irish</option>
                  <option value="it">Italian</option>
                  <option value="ja">Japanese</option>
                  <option value="jw">Javanese</option>
                  <option value="kn">Kannada</option>
                  <option value="kk">Kazakh</option>
                  <option value="km">Khmer</option>
                  <option value="rw">Kinyarwanda</option>
                  <option value="ko">Korean</option>
                  <option value="ku">Kurdish (Kurmanji)</option>
                  <option value="ky">Kyrgyz</option>
                  <option value="lo">Lao</option>
                  <option value="la">Latin</option>
                  <option value="lv">Latvian</option>
                  <option value="lt">Lithuanian</option>
                  <option value="lb">Luxembourgish</option>
                  <option value="mk">Macedonian</option>
                  <option value="mg">Malagasy</option>
                  <option value="ms">Malay</option>
                  <option value="ml">Malayalam</option>
                  <option value="mt">Maltese</option>
                  <option value="mi">Maori</option>
                  <option value="mr">Marathi</option>
                  <option value="mn">Mongolian</option>
                  <option value="my">Myanmar (Burmese)</option>
                  <option value="ne">Nepali</option>
                  <option value="no">Norwegian</option>
                  <option value="or">Odia (Oriya)</option>
                  <option value="ps">Pashto</option>
                  <option value="fa">Persian</option>
                  <option value="pl">Polish</option>
                  <option value="pt">Portuguese</option>
                  <option value="pa">Punjabi</option>
                  <option value="ro">Romanian</option>
                  <option value="ru">Russian</option>
                  <option value="sm">Samoan</option>
                  <option value="gd">Scots Gaelic</option>
                  <option value="sr">Serbian</option>
                  <option value="st">Sesotho</option>
                  <option value="sn">Shona</option>
                  <option value="sd">Sindhi</option>
                  <option value="si">Sinhala</option>
                  <option value="sk">Slovak</option>
                  <option value="sl">Slovenian</option>
                  <option value="so">Somali</option>
                  <option value="es">Spanish</option>
                  <option value="su">Sundanese</option>
                  <option value="sw">Swahili</option>
                  <option value="sv">Swedish</option>
                  <option value="tg">Tajik</option>
                  <option value="ta">Tamil</option>
                  <option value="tt">Tatar</option>
                  <option value="te">Telugu</option>
                  <option value="th">Thai</option>
                  <option value="tr">Turkish</option>
                  <option value="tk">Turkmen</option>
                  <option value="uk">Ukrainian</option>
                  <option value="ur">Urdu</option>
                  <option value="ug">Uyghur</option>
                  <option value="uz">Uzbek</option>
                  <option value="vi">Vietnamese</option>
                  <option value="cy">Welsh</option>
                  <option value="xh">Xhosa</option>
                  <option value="yi">Yiddish</option>
                  <option value="yo">Yoruba</option>
                  <option value="zu">Zulu</option>
                </select>
                <div className="absolute end-3 pointer-events-none text-[#C9A24A]">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <div id="google_translate_element" style={{ display: 'none' }}></div>
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
              `© 2026 الأكاديمية العليا للرموز والشيفرة. جميع الحقوق محفوظة.`,
              `© 2026 The Higher Academy of Symbols and Code. All rights reserved.`
            )}
          </p>
          <p className="text-[#4A6B60] text-xs flex items-center gap-1">
            {t('تصميم وتطوير', 'Designed & Developed by')}
            <a href="#" className="text-[#C9A24A] hover:text-[#F0D98A] transition-colors flex items-center gap-1 font-medium">
              Aurangzeb Sunny <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}