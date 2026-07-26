import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';
import { format, parseISO, subMonths, isAfter, startOfMonth } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA' };
const COLORS = ['#C9A24A', '#062B24', '#5A7A70', '#8B9D8A', '#D8B75B'];

export default function AdminAnalytics() {
  const { t, isRTL, fontFamily } = useLanguage();
  const { users, enrollments, lectures, subscriptions } = useData();

  // 1. Prepare Data for KPIs
  const totalRevenue = useMemo(() => {
    const enrollRev = (enrollments as any[]).reduce((sum, e) => sum + (e.amount || 0), 0);
    const subRev = (subscriptions as any[]).reduce((sum, s) => sum + (s.price || 0), 0);
    return enrollRev + subRev;
  }, [enrollments, subscriptions]);

  const totalUsers = users?.length || 0;
  const activeStudents = (users as any[])?.filter(u => u.role === 'student').length || 0;
  const totalEnrollments = enrollments?.length || 0;

  // 2. Prepare Data for Revenue Over Time (Last 6 Months)
  const revenueData = useMemo(() => {
    const data: Record<string, number> = {};
    const sixMonthsAgo = subMonths(new Date(), 6);
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthStr = format(monthStart, 'MMM yyyy');
      data[monthStr] = 0;
    }

    (enrollments as any[]).forEach(e => {
      if (e.createdAt && e.amount > 0) {
        const date = parseISO(e.createdAt);
        if (isAfter(date, sixMonthsAgo)) {
          const monthStr = format(startOfMonth(date), 'MMM yyyy');
          if (data[monthStr] !== undefined) {
            data[monthStr] += e.amount;
          }
        }
      }
    });

    (subscriptions as any[]).forEach(s => {
      if (s.createdAt && s.price > 0) {
        const date = parseISO(s.createdAt);
        if (isAfter(date, sixMonthsAgo)) {
          const monthStr = format(startOfMonth(date), 'MMM yyyy');
          if (data[monthStr] !== undefined) {
            data[monthStr] += s.price;
          }
        }
      }
    });

    return Object.keys(data).map(key => ({
      name: key,
      revenue: data[key]
    }));
  }, [enrollments, subscriptions]);

  // 3. Prepare Data for User Roles Pie Chart
  const roleData = useMemo(() => {
    const roles = { admin: 0, student: 0, teacher: 0, supervisor: 0 };
    (users as any[]).forEach(u => {
      if (roles[u.role as keyof typeof roles] !== undefined) {
        roles[u.role as keyof typeof roles]++;
      }
    });
    return [
      { name: t('الطلاب', 'Students'), value: roles.student },
      { name: t('الأساتذة', 'Teachers'), value: roles.teacher },
      { name: t('المشرفون', 'Supervisors'), value: roles.supervisor },
      { name: t('الإدارة', 'Admins'), value: roles.admin },
    ].filter(d => d.value > 0);
  }, [users, t]);

  // 4. Prepare Data for Top Lectures by Enrollment
  const topLecturesData = useMemo(() => {
    const counts: Record<string, { name: string, count: number }> = {};
    (enrollments as any[]).forEach(e => {
      if (e.courseTitle) {
        if (!counts[e.courseTitle]) {
          counts[e.courseTitle] = { name: e.courseTitle, count: 0 };
        }
        counts[e.courseTitle].count++;
      }
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5
      .map(d => ({
        name: d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name,
        enrollments: d.count
      }));
  }, [enrollments]);

  const kpiCards = [
    { label_ar: 'إجمالي الإيرادات', label_en: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10B981' },
    { label_ar: 'الطلاب النشطين', label_en: 'Active Students', value: activeStudents.toLocaleString(), icon: Users, color: '#3B82F6' },
    { label_ar: 'إجمالي التسجيلات', label_en: 'Total Enrollments', value: totalEnrollments.toLocaleString(), icon: BookOpen, color: '#8B5CF6' },
    { label_ar: 'متوسط قيمة الطلب', label_en: 'Avg. Order Value', value: `$${totalEnrollments > 0 ? (totalRevenue / totalEnrollments).toFixed(2) : 0}`, icon: TrendingUp, color: '#F59E0B' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-1 w-full mx-auto" style={{ maxWidth: '1400px' }}>
      <div className="mb-6">
        <h1 className="text-[#062B24] font-bold" style={{ fontFamily: isRTL ? 'Amiri, sans-serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem,3vw,1.8rem)' }}>
          {t('التحليلات والإحصائيات', 'Analytics & Insights')}
        </h1>
        <p className="text-[#5A7A70] text-sm mt-1">
          {t('نظرة شاملة على أداء الأكاديمية والمبيعات', 'Comprehensive overview of academy performance and sales')}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card, i) => {
          const IconComp = card.icon;
          return (
            <div key={i} className="p-5 rounded-2xl flex items-center gap-4" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${card.color}15` }}>
                <IconComp size={24} style={{ color: card.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-[#8B9D8A] text-[11px] font-semibold uppercase tracking-wider mb-1 truncate">{t(card.label_ar, card.label_en)}</div>
                <div className="text-[#062B24] font-bold text-2xl truncate">{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Area Chart: Revenue Over Time */}
        <div className="lg:col-span-2 p-5 rounded-2xl flex flex-col" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <h3 className="text-[#062B24] font-bold mb-6 text-base">{t('نمو الإيرادات (آخر 6 أشهر)', 'Revenue Growth (Last 6 Months)')}</h3>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND.gold} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={BRAND.gold} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(6,43,36,0.1)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#8B9D8A' }} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#8B9D8A' }} dx={-10} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: fontFamily }}
                  labelStyle={{ fontWeight: 'bold', color: BRAND.deep, marginBottom: '4px' }}
                  itemStyle={{ color: BRAND.gold, fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value}`, t('الإيرادات', 'Revenue')]}
                />
                <Area type="monotone" dataKey="revenue" stroke={BRAND.gold} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Users */}
        <div className="p-5 rounded-2xl flex flex-col" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <h3 className="text-[#062B24] font-bold mb-2 text-base">{t('توزيع المستخدمين', 'User Distribution')}</h3>
          <div className="h-[300px] w-full mt-auto" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily }}
                  itemStyle={{ color: BRAND.deep, fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#5A7A70', fontFamily }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart: Top Lectures */}
        <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <h3 className="text-[#062B24] font-bold mb-6 text-base">{t('الدورات الأكثر تسجيلاً', 'Top Enrolled Courses')}</h3>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLecturesData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(6,43,36,0.1)" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#8B9D8A' }} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#5A7A70' }} dx={-10} width={120} />
                <Tooltip 
                  cursor={{ fill: 'rgba(201,162,74,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily }}
                  formatter={(value: number) => [value, t('التسجيلات', 'Enrollments')]}
                />
                <Bar dataKey="enrollments" fill={BRAND.gold} radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
