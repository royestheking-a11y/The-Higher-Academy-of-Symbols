import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Library, Check, X, Save } from 'lucide-react';
import { GeometricBackground } from '../../components/GeometricBackground';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function AdminLibrary() {
  const { t, isRTL } = useLanguage();
  const { token } = useAuth();
  const [resources, setResources] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    slug: '',
    author: '',
    category: '',
    description_ar: '',
    description_en: '',
    fileUrl: '',
    thumbnail: '',
    downloadSize: '',
    fileType: 'PDF',
    status: 'published',
    isDownloadable: false,
    isFeatured: false
  });

  const fetchResources = () => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(`${baseUrl}/api/library/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setResources(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (token) fetchResources();
  }, [token]);

  const openModal = (resource?: any) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title_ar: resource.title_ar || '',
        title_en: resource.title_en || '',
        slug: resource.slug || '',
        author: resource.author || '',
        category: resource.category || '',
        description_ar: resource.description_ar || '',
        description_en: resource.description_en || '',
        fileUrl: resource.fileUrl || '',
        thumbnail: resource.thumbnail || '',
        downloadSize: resource.downloadSize || '',
        fileType: resource.fileType || 'PDF',
        status: resource.status || 'published',
        isDownloadable: resource.isDownloadable || false,
        isFeatured: resource.isFeatured || false
      });
    } else {
      setEditingResource(null);
      setFormData({
        title_ar: '',
        title_en: '',
        slug: '',
        author: '',
        category: '',
        description_ar: '',
        description_en: '',
        fileUrl: '',
        thumbnail: '',
        downloadSize: '',
        fileType: 'PDF',
        status: 'published',
        isDownloadable: false,
        isFeatured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const url = editingResource 
        ? `${baseUrl}/api/library/${editingResource._id}`
        : `${baseUrl}/api/library`;
      
      const res = await fetch(url, {
        method: editingResource ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(editingResource ? t('تم التحديث بنجاح', 'Resource updated') : t('تمت الإضافة بنجاح', 'Resource added'));
        setIsModalOpen(false);
        fetchResources();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || t('فشل الحفظ', 'Save failed'));
      }
    } catch (err) {
      toast.error(t('حدث خطأ', 'Error occurred'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete this resource?'))) return;
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/api/library/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success(t('تم الحذف', 'Resource deleted'));
        setResources(resources.filter(r => r._id !== id));
      } else {
        toast.error(t('فشل الحذف', 'Delete failed'));
      }
    } catch (err) {
      toast.error(t('حدث خطأ', 'Error occurred'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#062B24] font-bold text-lg">{t('المكتبة الرقمية', 'Digital Library')}</h2>
        <button onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: '#062B24', boxShadow: '0 2px 0 #8B6B20' }}>
          <Plus size={15} /> {t('إضافة مورد', 'Add Resource')}
        </button>
      </div>

      <div className="bg-white border border-[rgba(6,43,36,0.08)] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead className="relative overflow-hidden text-xs uppercase" style={{ background: '#062B24' }}>
              <tr>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('العنوان', 'Title')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('التصنيف', 'Category')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('الحالة', 'Status')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('مميز', 'Featured')}</th>
                <th className="px-5 py-4 text-center relative z-10" style={{ color: '#C9A24A' }}>{t('الإجراءات', 'Actions')}</th>
              </tr>
              <div className="absolute inset-0 pointer-events-none">
                <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.6} tileSize={40} />
              </div>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[#8B9D8A]">{t('لا توجد موارد', 'No resources found')}</td></tr>
              ) : resources.map(res => (
                <tr key={res._id} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                  <td className="px-5 py-4 font-medium text-[#062B24]">{isRTL ? res.title_ar : res.title_en}</td>
                  <td className="px-5 py-4 text-[#8B9D8A]">{res.category}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      res.status === 'published' ? 'bg-[#7BBFAD] text-[#062B24]' :
                      res.status === 'draft' ? 'bg-[#8B9D8A] text-white' : 'bg-[#D4183D] text-white'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{res.isFeatured ? <Check size={16} className="text-[#7BBFAD]"/> : <X size={16} className="text-[#D4183D]"/>}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openModal(res)} title="Edit" className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: '#7BBFAD15', color: '#7BBFAD' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(res._id)} title="Delete" className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: '#D4183D15', color: '#D4183D' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col" style={{ background: '#FFFFFF' }}>
            <div className="px-8 py-5 flex items-center justify-between border-b relative overflow-hidden" style={{ background: '#062B24', borderColor: 'rgba(201,162,74,0.2)' }} dir={isRTL ? 'rtl' : 'ltr'}>
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
              <h3 className="text-xl font-bold text-[#F0D98A] relative z-10" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>
                {editingResource ? t('تعديل مورد', 'Edit Resource') : t('إضافة مورد', 'Add Resource')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8B9D8A] hover:text-[#F0D98A] transition-colors relative z-10"><X size={24} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('العنوان (عربي)', 'Title (Arabic)')}</label>
                    <input type="text" name="title_ar" value={formData.title_ar} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('العنوان (إنجليزي)', 'Title (English)')}</label>
                    <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('الرابط المختصر', 'Slug (URL)')}</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('المؤلف', 'Author')}</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('التصنيف', 'Category')}</label>
                      <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('نوع الملف', 'File Type')}</label>
                      <input type="text" name="fileType" value={formData.fileType} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} placeholder="e.g., PDF, DOCX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('حجم الملف', 'Download Size')}</label>
                    <input type="text" name="downloadSize" value={formData.downloadSize} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} placeholder="e.g., 2.5 MB" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('رابط الملف الأساسي', 'Main File URL')}</label>
                    <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('صورة الغلاف (رابط)', 'Thumbnail URL')}</label>
                    <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('الحالة', 'Status')}</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}>
                      <option value="published">{t('منشور', 'Published')}</option>
                      <option value="draft">{t('مسودة', 'Draft')}</option>
                      <option value="archived">{t('مؤرشف', 'Archived')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('الوصف (عربي)', 'Description (Arabic)')}</label>
                    <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('الوصف (إنجليزي)', 'Description (English)')}</label>
                    <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div className="flex gap-6 items-center pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isDownloadable" checked={formData.isDownloadable} onChange={handleChange} className="w-5 h-5 accent-[#C9A24A]" />
                      <span className="font-bold text-[#062B24]">{t('قابل للتحميل', 'Downloadable')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-[#C9A24A]" />
                      <span className="font-bold text-[#062B24]">{t('مورد مميز', 'Featured')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 pt-4 flex gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: '#062B24', boxShadow: '0 3px 0 #8B6B20' }}>
                <Save size={14} /> {t('حفظ', 'Save')}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm transition-all"
                style={{ background: 'rgba(212,24,61,0.08)', color: '#D4183D' }}>
                {t('إلغاء', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
