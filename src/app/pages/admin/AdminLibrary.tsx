import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Library, Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLibrary() {
  const { t, isRTL } = useLanguage();
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/library` : '/api/library')
      .then(r => r.ok ? r.json() : [])
      .then(data => setResources(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(201,162,74,0.1)] flex items-center justify-center text-[#C9A24A]">
            <Library size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#062B24]">{t('المكتبة الرقمية', 'Digital Library')}</h2>
            <p className="text-sm text-[#8B9D8A]">{t('إدارة الملفات والموارد والكتب', 'Manage files, resources and books')}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#062B24] text-white rounded-xl text-sm font-bold hover:bg-[#1B4D42] transition-colors">
          <Plus size={16} /> {t('إضافة مورد', 'Add Resource')}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead className="bg-[#F8F4EA] text-[#5A7A70] uppercase text-xs">
              <tr>
                <th className="px-6 py-4">{t('العنوان', 'Title')}</th>
                <th className="px-6 py-4">{t('التصنيف', 'Category')}</th>
                <th className="px-6 py-4">{t('المؤلف', 'Author')}</th>
                <th className="px-6 py-4">{t('مميز', 'Featured')}</th>
                <th className="px-6 py-4 text-center">{t('الإجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#8B9D8A]">{t('لا توجد موارد', 'No resources found')}</td></tr>
              ) : resources.map(res => (
                <tr key={res._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-[#062B24]">{isRTL ? res.title_ar : res.title_en}</td>
                  <td className="px-6 py-4">{res.category}</td>
                  <td className="px-6 py-4">{res.author}</td>
                  <td className="px-6 py-4">{res.isFeatured ? <Check size={16} className="text-green-500"/> : <X size={16} className="text-red-500"/>}</td>
                  <td className="px-6 py-4 flex items-center justify-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
