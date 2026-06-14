import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, PackageCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminOrders() {
  const { t, isRTL } = useLanguage();
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    fetch(baseUrl ? `${baseUrl}/api/orders` : '/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(201,162,74,0.1)] flex items-center justify-center text-[#C9A24A]">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#062B24]">{t('طلبات المتجر', 'Store Orders')}</h2>
            <p className="text-sm text-[#8B9D8A]">{t('إدارة طلبات الكتب والشحن', 'Manage book orders and shipping')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead className="bg-[#F8F4EA] text-[#5A7A70] uppercase text-xs">
              <tr>
                <th className="px-6 py-4">{t('رقم الطلب', 'Order No.')}</th>
                <th className="px-6 py-4">{t('العميل', 'Customer')}</th>
                <th className="px-6 py-4">{t('الإجمالي', 'Total')}</th>
                <th className="px-6 py-4">{t('الدفع', 'Payment')}</th>
                <th className="px-6 py-4">{t('الشحن', 'Shipping')}</th>
                <th className="px-6 py-4 text-center">{t('الإجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-[#8B9D8A]">{t('لا توجد طلبات', 'No orders found')}</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-bold text-[#062B24]">{o.orderNumber}</td>
                  <td className="px-6 py-4">{o.customerDetails?.name}</td>
                  <td className="px-6 py-4 font-bold text-[#C9A24A]">AED {o.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${o.shippingStatus === 'shipped' || o.shippingStatus === 'delivered' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {o.shippingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center gap-2">
                    <button className="p-2 text-[#C9A24A] hover:bg-[rgba(201,162,74,0.1)] rounded-lg"><Eye size={16} /></button>
                    <button className="p-2 text-[#062B24] hover:bg-gray-100 rounded-lg"><PackageCheck size={16} /></button>
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
