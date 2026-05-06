import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import { toPng, toJpeg } from 'html-to-image';
import { Award, Download, FileImage, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA' };

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  courseName: string;
  date: string;
}

export default function CertificateModal({ isOpen, onClose, userName, courseName, date }: CertificateModalProps) {
  const { t, isRTL } = useLanguage();
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!certificateRef.current) return;
    try {
      toast.loading(t('جارٍ معالجة الصورة...', 'Processing image...'), { id: 'cert-dl' });
      
      // html-to-image is much more robust for high-dpi exports
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipAutoScale: true,
      });

      const link = document.createElement('a');
      link.download = `Certificate-${courseName.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success(t('تم تحميل الصورة بنجاح', 'Image downloaded successfully'), { id: 'cert-dl' });
    } catch (err) {
      console.error('Image generation failed:', err);
      toast.error(t('فشل تحميل الصورة. يرجى المحاولة مرة أخرى.', 'Failed to download image. Please try again.'), { id: 'cert-dl' });
    }
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      toast.loading(t('جارٍ إنشاء ملف PDF...', 'Generating PDF...'), { id: 'cert-dl' });
      
      const dataUrl = await toJpeg(certificateRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate-${courseName.replace(/\s+/g, '-')}.pdf`);
      
      toast.success(t('تم تحميل ملف PDF بنجاح', 'PDF downloaded successfully'), { id: 'cert-dl' });
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error(t('فشل إنشاء ملف PDF. يرجى المحاولة مرة أخرى.', 'Failed to generate PDF. Please try again.'), { id: 'cert-dl' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(6,43,36,0.85)] backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: 'rgba(6,43,36,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,162,74,0.1)' }}>
                  <Award className="text-[#C9A24A]" size={20} />
                </div>
                <h2 className="text-[#062B24] font-bold text-lg">{t('شهادة الإتمام', 'Certificate of Completion')}</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-[rgba(6,43,36,0.05)] text-[#5A7A70] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content / Preview */}
            <div className="flex-1 overflow-auto p-8 flex flex-col items-center bg-[#F8F6F0]">
              
              {/* The Certificate itself */}
              <div 
                ref={certificateRef}
                className={`relative w-[1000px] h-[700px] shrink-0 bg-white flex flex-col items-center p-12 text-center overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}
                style={{ 
                  fontFamily: isRTL ? "'Amiri', serif" : "'Inter', sans-serif",
                  border: '25px solid #062B24',
                }}
              >
                {/* Decorative Borders - Inside the main border */}
                <div className="absolute inset-4 border-[1px] border-[#C9A24A] opacity-40 pointer-events-none" />
                <div className="absolute inset-6 border-[2px] border-[#C9A24A] pointer-events-none" />
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-[6px] border-l-[6px] border-[#C9A24A]" />
                <div className="absolute top-0 right-0 w-32 h-32 border-t-[6px] border-r-[6px] border-[#C9A24A]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[6px] border-l-[6px] border-[#C9A24A]" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[6px] border-r-[6px] border-[#C9A24A]" />

                {/* Logo Section */}
                <div className="mt-0 mb-2">
                  <img src="/symbolacademy.png" alt="Logo" className="w-20 h-20 mx-auto mb-2" />
                  {isRTL ? (
                    <>
                      <div className="text-[#062B24] text-lg font-bold">الأكاديمية العليا للرموز</div>
                      <div className="text-[#C9A24A] tracking-[0.2em] text-[10px] font-bold uppercase mt-1">The Higher Academy of Symbols</div>
                    </>
                  ) : (
                    <>
                      <div className="text-[#062B24] tracking-[0.3em] text-[12px] font-bold uppercase">
                        The Higher Academy of Symbols
                      </div>
                      <div className="text-[#C9A24A] text-[10px] font-bold mt-1">الأكاديمية العليا للرموز</div>
                    </>
                  )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-start mt-4">
                  <h1 className={`text-[#C9A24A] font-bold mb-5 tracking-[0.25em] uppercase ${isRTL ? 'text-6xl' : 'text-5xl'}`} style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.05)' }}>
                    {isRTL ? 'شهادة إتمام' : 'Certificate'}
                  </h1>
                  <p className="text-[#5A7A70] text-[17px] italic mb-3">
                    {isRTL ? 'تمنح هذه الشهادة لـ' : 'This is to certify that'}
                  </p>
                  <div className="w-full max-w-2xl border-b-2 border-[#062B24] mb-5 pb-1">
                    <span className={`${isRTL ? 'text-6xl' : 'text-5xl'} text-[#062B24] font-bold`} style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
                      {userName}
                    </span>
                  </div>
                  <p className="text-[#5A7A70] text-[17px] italic mb-3">
                    {isRTL ? 'قد أكمل بنجاح دورة' : 'has successfully completed the course'}
                  </p>
                  <div className={`text-[#C9A24A] font-bold tracking-wide max-w-3xl ${isRTL ? 'text-4xl' : 'text-[30px] leading-tight'}`}>
                    {courseName}
                  </div>
                </div>

                {/* Footer / Signatures */}
                <div className={`absolute bottom-12 left-0 right-0 px-24 flex items-end justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="text-center w-64">
                    <div className="border-b border-[#062B24] pb-1.5 mb-2 text-[#062B24] font-bold text-lg">
                      {date}
                    </div>
                    <div className="text-[#8B9D8A] text-[10px] font-bold uppercase tracking-[0.2em]">
                      {isRTL ? 'تاريخ الإصدار' : 'Date of Issue'}
                    </div>
                  </div>

                  <div className="text-center w-[400px]">
                    <div className="mb-0" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Allura', cursive" }}>
                      <span className={`${isRTL ? 'text-4xl' : 'text-[34px]'} text-[#062B24] whitespace-nowrap font-bold italic`}>
                        {isRTL ? 'د. فاطمة فاضل العيساوي' : 'Dr. Fatima Fadel Al-Issawi'}
                      </span>
                    </div>
                    <div className="border-t border-[#062B24] pt-2.5 mt-1">
                      <div className="text-[#8B9D8A] text-[9px] font-bold uppercase tracking-[0.25em] mt-1">
                        {isRTL ? 'رئيس الأكاديمية وبروفيسور' : 'Academy President & Professor'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Watermark Seal */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.02] pointer-events-none">
                   <svg viewBox="0 0 100 100" fill="none" stroke="#C9A24A" strokeWidth="1">
                      <circle cx="50" cy="50" r="45" />
                      <circle cx="50" cy="50" r="40" strokeDasharray="2 2" />
                      <path d="M50 20 L55 35 L70 35 L58 45 L63 60 L50 50 L37 60 L42 45 L30 35 L45 35 Z" fill="#C9A24A" />
                   </svg>
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 bg-white border-t flex items-center justify-center gap-4" style={{ borderColor: 'rgba(6,43,36,0.08)' }}>
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(201,162,74,0.1)', color: BRAND.gold, border: '1px solid rgba(201,162,74,0.3)' }}
              >
                <FileImage size={18} />
                {t('تحميل كصورة', 'Download as Image')}
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 3px 0 #8B6B20' }}
              >
                <FileText size={18} />
                {t('تحميل ملف PDF', 'Download PDF File')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
