import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Store, Check, X, Save } from 'lucide-react';
import { GeometricBackground } from '../../components/GeometricBackground';
import { FileUpload } from '../../components/FileUpload';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function AdminBooks() {
  const { t, isRTL } = useLanguage();
  const { token } = useAuth();
  const [books, setBooks] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    slug: '',
    author: '',
    isbn: '',
    description_ar: '',
    description_en: '',
    price: 0,
    salePrice: 0,
    stock: 0,
    coverImage: '',
    pdfPreview: '',
    language: 'ar',
    category: '',
    isFeatured: false,
    pages: 0
  });

  const fetchBooks = () => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/books` : '/api/books')
      .then(r => r.ok ? r.json() : [])
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openModal = (book?: any) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title_ar: book.title_ar || '',
        title_en: book.title_en || '',
        slug: book.slug || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description_ar: book.description_ar || '',
        description_en: book.description_en || '',
        price: book.price || 0,
        salePrice: book.salePrice || 0,
        stock: book.stock || 0,
        coverImage: book.coverImage || '',
        pdfPreview: book.pdfPreview || '',
        language: book.language || 'ar',
        category: book.category || '',
        isFeatured: book.isFeatured || false,
        pages: book.pages || 0
      });
    } else {
      setEditingBook(null);
      setFormData({
        title_ar: '',
        title_en: '',
        slug: '',
        author: '',
        isbn: '',
        description_ar: '',
        description_en: '',
        price: 0,
        salePrice: 0,
        stock: 0,
        coverImage: '',
        pdfPreview: '',
        language: 'ar',
        category: '',
        isFeatured: false,
        pages: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const url = editingBook 
        ? `${baseUrl}/api/books/${editingBook._id}`
        : `${baseUrl}/api/books`;
      
      const res = await fetch(url, {
        method: editingBook ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(editingBook ? t('تم تحديث الكتاب', 'Book updated') : t('تمت إضافة الكتاب', 'Book added'));
        setIsModalOpen(false);
        fetchBooks();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || t('فشل الحفظ', 'Save failed'));
      }
    } catch (err) {
      toast.error(t('حدث خطأ', 'Error occurred'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('هل أنت متأكد من حذف هذا الكتاب؟', 'Are you sure you want to delete this book?'))) return;
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success(t('تم حذف الكتاب', 'Book deleted'));
        setBooks(books.filter(b => b._id !== id));
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
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#062B24] font-bold text-lg">{t('إصدارات المتجر', 'Store Books')}</h2>
        <button onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: '#062B24', boxShadow: '0 2px 0 #8B6B20' }}>
          <Plus size={15} /> {t('إضافة كتاب', 'Add Book')}
        </button>
      </div>

      <div className="bg-white border border-[rgba(6,43,36,0.08)] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead className="relative overflow-hidden text-xs uppercase" style={{ background: '#062B24' }}>
              <tr>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('الكتاب', 'Book')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('السعر', 'Price')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('المخزون', 'Stock')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('مميز', 'Featured')}</th>
                <th className="px-5 py-4 text-center relative z-10" style={{ color: '#C9A24A' }}>{t('الإجراءات', 'Actions')}</th>
              </tr>
              <div className="absolute inset-0 pointer-events-none">
                <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.6} tileSize={40} />
              </div>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[#8B9D8A]">{t('لا توجد كتب', 'No books found')}</td></tr>
              ) : books.map(b => (
                <tr key={b._id} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                  <td className="px-5 py-4 font-medium text-[#062B24]">{isRTL ? b.title_ar : b.title_en}</td>
                  <td className="px-5 py-4 font-medium text-[#C9A24A]">AED {b.salePrice || b.price}</td>
                  <td className="px-5 py-4 text-[#8B9D8A]">{b.stock}</td>
                  <td className="px-5 py-4">{b.isFeatured ? <Check size={16} className="text-[#7BBFAD]"/> : <X size={16} className="text-[#D4183D]"/>}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openModal(b)} title="Edit" className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: '#7BBFAD15', color: '#7BBFAD' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(b._id)} title="Delete" className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: '#D4183D15', color: '#D4183D' }}>
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
                {editingBook ? t('تعديل كتاب', 'Edit Book') : t('إضافة كتاب', 'Add Book')}
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
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">ISBN</label>
                    <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} />
                  </div>
                  <FileUpload 
                    label={t('صورة الغلاف', 'Cover Image')} 
                    accept="image/*" 
                    token={token} 
                    currentUrl={formData.coverImage} 
                    folder="symbols_academy/store"
                    onUploadComplete={(url) => setFormData({ ...formData, coverImage: url })} 
                  />
                  <FileUpload 
                    label={t('ملف PDF التجريبي', 'PDF Preview/Book File')} 
                    accept="application/pdf" 
                    token={token} 
                    currentUrl={formData.pdfPreview} 
                    folder="symbols_academy/store"
                    onUploadComplete={(url) => setFormData({ ...formData, pdfPreview: url })} 
                  />
                  <div className="flex gap-6 items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-[#C9A24A]" />
                      <span className="font-bold text-[#062B24]">{t('كتاب مميز', 'Featured Book')}</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('السعر الأصلي', 'Original Price')}</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('سعر العرض', 'Sale Price')}</label>
                      <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('المخزون', 'Stock')}</label>
                      <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('عدد الصفحات', 'Pages')}</label>
                      <input type="number" name="pages" value={formData.pages} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('اللغة', 'Language')}</label>
                      <select name="language" value={formData.language} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}>
                        <option value="ar">Arabic</option>
                        <option value="en">English</option>
                        <option value="both">Bilingual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#062B24] mb-2">{t('التصنيف', 'Category')}</label>
                      <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('الوصف (عربي)', 'Description (Arabic)')}</label>
                    <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#062B24] mb-2">{t('الوصف (إنجليزي)', 'Description (English)')}</label>
                    <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }} required />
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
