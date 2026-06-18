import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, PackageCheck, X, Save, Trash2, Box, Truck } from 'lucide-react';
import { GeometricBackground } from '../../components/GeometricBackground';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function AdminOrders() {
  const { t, isRTL } = useLanguage();
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ paymentStatus: '', shippingStatus: '', trackingNumber: '' });

  const fetchOrders = () => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/orders` : '/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const openViewModal = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const openEditModal = (order: any) => {
    setSelectedOrder(order);
    setEditForm({
      paymentStatus: order.paymentStatus || 'pending',
      shippingStatus: order.shippingStatus || 'pending',
      trackingNumber: order.trackingNumber || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        toast.success(t('تم تحديث حالة الطلب بنجاح', 'Order status updated successfully'));
        setIsEditModalOpen(false);
        fetchOrders();
      } else {
        toast.error(t('فشل في تحديث الطلب', 'Failed to update order'));
      }
    } catch (err) {
      toast.error(t('حدث خطأ في النظام', 'System error occurred'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('هل أنت متأكد من حذف هذا الطلب نهائياً؟', 'Are you sure you want to permanently delete this order?'))) return;
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success(t('تم حذف الطلب', 'Order deleted'));
        setOrders(orders.filter(o => o._id !== id));
      } else {
        toast.error(t('فشل في حذف الطلب', 'Failed to delete order'));
      }
    } catch (err) {
      toast.error(t('حدث خطأ', 'Error occurred'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#062B24] font-bold text-lg">{t('طلبات المتجر', 'Store Orders')}</h2>
      </div>

      <div className="bg-white border border-[rgba(6,43,36,0.08)] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead className="relative overflow-hidden text-xs uppercase" style={{ background: '#062B24' }}>
              <tr>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('رقم الطلب', 'Order No.')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('العميل', 'Customer')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('الإجمالي', 'Total')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('الدفع', 'Payment')}</th>
                <th className="px-5 py-4 relative z-10" style={{ color: '#C9A24A' }}>{t('الشحن', 'Shipping')}</th>
                <th className="px-5 py-4 text-center relative z-10" style={{ color: '#C9A24A' }}>{t('الإجراءات', 'Actions')}</th>
              </tr>
              <div className="absolute inset-0 pointer-events-none">
                <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.12} strokeWidth={0.6} tileSize={40} />
              </div>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-[#8B9D8A]">{t('لا توجد طلبات', 'No orders found')}</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} className="hover:bg-[rgba(6,43,36,0.02)]" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                  <td className="px-5 py-4 font-mono font-medium text-[#062B24]">{o.orderNumber}</td>
                  <td className="px-5 py-4 text-[#8B9D8A]">{o.customerDetails?.name}</td>
                  <td className="px-5 py-4 font-medium text-[#C9A24A]">AED {o.totalAmount}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${o.paymentStatus === 'paid' ? 'bg-[#7BBFAD] text-[#062B24]' : 'bg-[#C9A24A] text-white'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${o.shippingStatus === 'shipped' || o.shippingStatus === 'delivered' ? 'bg-[#7BBFAD] text-[#062B24]' : 'bg-[#8B9D8A] text-white'}`}>
                      {o.shippingStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openViewModal(o)} title="View Details" className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: '#C9A24A15', color: '#C9A24A' }}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEditModal(o)} title="Update Status" className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: '#7BBFAD15', color: '#7BBFAD' }}>
                        <PackageCheck size={16} />
                      </button>
                      <button onClick={() => handleDelete(o._id)} title="Delete" className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: '#D4183D15', color: '#D4183D' }}>
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

      {/* View Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col" style={{ background: '#FFFFFF' }}>
            <div className="px-8 py-5 flex items-center justify-between border-b relative overflow-hidden" style={{ background: '#062B24', borderColor: 'rgba(201,162,74,0.2)' }} dir={isRTL ? 'rtl' : 'ltr'}>
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
              <h3 className="text-xl font-bold text-[#F0D98A] relative z-10" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>{t('تفاصيل الطلب', 'Order Details')} - {selectedOrder.orderNumber}</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-[#8B9D8A] hover:text-[#F0D98A] transition-colors relative z-10"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#062B24] mb-2 flex items-center gap-2"><ShoppingCart size={16}/> {t('معلومات الطلب', 'Order Info')}</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t('التاريخ:', 'Date:')}</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t('الدفع:', 'Payment:')}</strong> {selectedOrder.paymentStatus}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t('الشحن:', 'Shipping:')}</strong> {selectedOrder.shippingStatus}</p>
                  {selectedOrder.trackingNumber && <p className="text-sm text-gray-600 mb-1"><strong>{t('تتبع:', 'Tracking:')}</strong> {selectedOrder.trackingNumber}</p>}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#062B24] mb-2 flex items-center gap-2"><Truck size={16}/> {t('بيانات العميل', 'Customer Data')}</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t('الاسم:', 'Name:')}</strong> {selectedOrder.customerDetails?.name}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t('الهاتف:', 'Phone:')}</strong> {selectedOrder.customerDetails?.phone}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t('المدينة:', 'City:')}</strong> {selectedOrder.customerDetails?.city}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t('العنوان:', 'Address:')}</strong> {selectedOrder.customerDetails?.address}</p>
                </div>
              </div>
              
              <h4 className="font-bold text-[#062B24] mb-4 flex items-center gap-2"><Box size={16}/> {t('المنتجات', 'Items')}</h4>
              <div className="space-y-3 mb-6">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#062B24]">{item.bookId?.title_en || item.bookId?.title_ar || 'Book'} x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-[#C9A24A]">AED {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center p-4 bg-[#062B24] text-white rounded-xl">
                <span className="font-bold">{t('الإجمالي', 'Total')}</span>
                <span className="text-xl font-black text-[#C9A24A]">AED {selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl flex flex-col" style={{ background: '#FFFFFF' }}>
            <div className="px-8 py-5 flex items-center justify-between border-b relative overflow-hidden" style={{ background: '#062B24', borderColor: 'rgba(201,162,74,0.2)' }} dir={isRTL ? 'rtl' : 'ltr'}>
              <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
              <h3 className="text-xl font-bold text-[#F0D98A] relative z-10" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif' }}>{t('تحديث حالة الطلب', 'Update Order Status')}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#8B9D8A] hover:text-[#F0D98A] transition-colors relative z-10"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
              <div>
                <label className="block text-sm font-bold text-[#062B24] mb-2">{t('حالة الدفع', 'Payment Status')}</label>
                <select 
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}
                  value={editForm.paymentStatus}
                  onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value})}
                >
                  <option value="pending">{t('قيد الانتظار', 'Pending')}</option>
                  <option value="paid">{t('مدفوع', 'Paid')}</option>
                  <option value="failed">{t('فشل', 'Failed')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#062B24] mb-2">{t('حالة الشحن', 'Shipping Status')}</label>
                <select 
className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}
                  value={editForm.shippingStatus}
                  onChange={(e) => setEditForm({...editForm, shippingStatus: e.target.value})}
                >
                  <option value="pending">{t('قيد التجهيز', 'Pending')}</option>
                  <option value="shipped">{t('تم الشحن', 'Shipped')}</option>
                  <option value="delivered">{t('تم التوصيل', 'Delivered')}</option>
                  <option value="cancelled">{t('ملغي', 'Cancelled')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#062B24] mb-2">{t('رقم التتبع (اختياري)', 'Tracking Number (Optional)')}</label>
                <input 
                  type="text"
className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A]" style={{ background: '#F8F4EA', border: '1.5px solid rgba(6,43,36,0.12)', color: '#1E1E1E' }}
                  value={editForm.trackingNumber}
                  onChange={(e) => setEditForm({...editForm, trackingNumber: e.target.value})}
                  placeholder={t('أدخل رقم التتبع', 'Enter tracking number')}
                />
              </div>
            </div>
            <div className="px-8 pb-8 pt-4 flex gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
              <button onClick={handleUpdateStatus} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: '#062B24', boxShadow: '0 3px 0 #8B6B20' }}>
                <Save size={14} /> {t('حفظ', 'Save')}
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm transition-all"
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
