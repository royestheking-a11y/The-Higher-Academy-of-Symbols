import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ConfirmModalProps {
  isOpen: boolean;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, titleAr, titleEn, messageAr, messageEn, onConfirm, onCancel
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop with a deep, blurred glass effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#062B24]/70 backdrop-blur-md"
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-[2rem] bg-white/95 backdrop-blur-2xl shadow-[0_30px_60px_rgba(6,43,36,0.3)] border border-white/60"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Soft decorative background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-400/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C9A24A]/10 rounded-full blur-2xl pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-5 end-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 text-[#5A7A70] hover:bg-gray-100 hover:text-[#062B24] transition-colors z-20 shadow-sm border border-gray-100/50"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="px-8 pt-10 pb-8 text-center relative z-10">
              {/* Icon Container with glowing ring */}
              <div className="mx-auto w-20 h-20 mb-6 relative group">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative w-full h-full bg-gradient-to-br from-red-50 to-red-100/40 border border-red-100 rounded-[1.5rem] shadow-inner flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <AlertTriangle size={34} className="text-[#D4183D] drop-shadow-sm" strokeWidth={2.2} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#062B24] mb-3 tracking-tight" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: '1.75rem' }}>
                {t(titleAr, titleEn)}
              </h3>
              <p className="text-[#5A7A70] text-[15px] font-medium leading-relaxed max-w-[90%] mx-auto">
                {t(messageAr, messageEn)}
              </p>
            </div>

            {/* Buttons Area */}
            <div className="px-8 pb-8 flex items-center justify-center gap-4 relative z-10">
              <button
                onClick={onCancel}
                className="flex-1 py-3.5 px-5 rounded-2xl text-[#062B24] font-bold text-[15px] bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 transition-all duration-200 active:scale-95"
              >
                {t('إلغاء الأمر', 'Cancel')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3.5 px-5 rounded-2xl text-white font-bold text-[15px] shadow-[0_8px_20px_rgba(212,24,61,0.3)] hover:shadow-[0_10px_25px_rgba(212,24,61,0.4)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 border border-red-400/20"
                style={{ background: 'linear-gradient(135deg, #E62547, #C31230)' }}
              >
                {t('نعم، بالتأكيد', 'Yes, confirm')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
