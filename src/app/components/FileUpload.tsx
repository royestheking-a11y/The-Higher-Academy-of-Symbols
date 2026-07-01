import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

interface FileUploadProps {
  label: string;
  accept: string;
  token: string | null;
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  folder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, accept, token, onUploadComplete, currentUrl, folder = 'symbols_academy/uploads' }) => {
  const { t, isRTL } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes('image');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error(t('حجم الملف كبير جداً (الحد الأقصى 100 ميجابايت)', 'File is too large (Max 100MB)'));
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseUrl}/api/upload`, true);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete(response.url);
          toast.success(t('تم رفع الملف بنجاح', 'File uploaded successfully'));
        } else {
          toast.error(t('فشل رفع الملف', 'Upload failed'));
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };

      xhr.onerror = () => {
        toast.error(t('خطأ في الاتصال بالخادم', 'Server connection error'));
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Upload Error:', error);
      setIsUploading(false);
      toast.error(t('حدث خطأ غير متوقع', 'An unexpected error occurred'));
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-[#062B24] mb-2">{label}</label>
      
      {currentUrl && !isUploading ? (
        <div className="relative w-full border border-dashed border-[#C9A24A] bg-[#F8F4EA] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-[rgba(201,162,74,0.3)]">
              {isImage ? <ImageIcon size={20} className="text-[#C9A24A]" /> : <FileText size={20} className="text-[#C9A24A]" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#062B24] truncate">
                {currentUrl.split('/').pop()}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-[#7BBFAD] mt-0.5 font-bold uppercase tracking-wider">
                <CheckCircle size={10} /> {t('تم الرفع', 'Uploaded')}
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => onUploadComplete('')}
            className="p-2 text-[#D4183D] hover:bg-[rgba(212,24,61,0.08)] rounded-lg transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ) : isUploading ? (
        <div className="w-full border border-[#1B4D42] bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-[#062B24] flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#C9A24A]" />
              {t('جاري الرفع...', 'Uploading...')}
            </span>
            <span className="text-sm font-black text-[#C9A24A]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#F8F4EA] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C9A24A] to-[#D8B75B] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-[rgba(6,43,36,0.15)] bg-[#F8F4EA]/50 hover:bg-[#F8F4EA] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload size={20} className="text-[#C9A24A]" />
          </div>
          <p className="text-sm font-bold text-[#062B24]">
            {t('انقر لاختيار ملف', 'Click to choose file')}
          </p>
          <p className="text-xs text-[#8B9D8A] mt-1">
            {accept.includes('pdf') ? 'PDF (Max 100MB)' : 'Images (Max 100MB)'}
          </p>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept={accept} 
        className="hidden" 
      />
    </div>
  );
};
