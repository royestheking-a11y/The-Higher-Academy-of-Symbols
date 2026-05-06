import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { BookOpen, Clock, Users, Star, Award, Play, GraduationCap, Globe, ChevronDown, ChevronUp, CheckCircle2, Target, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GeometricBackground } from '../components/GeometricBackground';

const BRAND = { deep: '#062B24', mid: '#0B3A31', gold: '#C9A24A', goldLight: '#F0D98A', ivory: '#F8F4EA' };

export default function LectureDetail() {
  const { slug } = useParams();
  const { t, isRTL, fontFamily } = useLanguage();
  const { lectures } = useData();
  const { currentUser } = useAuth();
  const [openModule, setOpenModule] = useState<number | null>(0);

  const lecture = (lectures as any[]).find((l: any) => l.slug === slug);

  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BRAND.ivory, fontFamily }}>
        <div className="text-center">
          <BookOpen size={48} className="text-[#C9A24A] mx-auto mb-4 opacity-50" />
          <p className="text-[#5A7A70] text-lg">{t('المحاضرة غير موجودة', 'Lecture not found')}</p>
          <Link to="/lectures" className="mt-4 inline-block text-[#C9A24A] hover:underline">{t('العودة للمحاضرات', 'Back to Lectures')}</Link>
        </div>
      </div>
    );
  }

  const relatedLectures = (lectures as any[]).filter((l: any) => l.id !== lecture.id && l.category === lecture.category && l.status === 'published').slice(0, 3);

  return (
    <div style={{ background: BRAND.ivory, fontFamily, minHeight: '100vh' }}>
      {/* Hero */}
      <div className="relative pt-36 pb-12 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
        <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.18} strokeWidth={0.8} tileSize={80} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[#6B8B80] text-xs mb-6">
            <Link to="/" className="hover:text-[#C9A24A] transition-colors">{t('الرئيسية', 'Home')}</Link>
            <span>/</span>
            <Link to="/lectures" className="hover:text-[#C9A24A] transition-colors">{t('المحاضرات', 'Lectures')}</Link>
            <span>/</span>
            <span className="text-[#C9A24A]">{t(lecture.title_ar, lecture.title_en)}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs" style={{ background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', color: BRAND.gold }}>
                {t(lecture.category_ar, lecture.category_en)}
              </div>
              <h1 className="text-[#F0D98A] mb-4" style={{ fontFamily: isRTL ? 'Amiri, Tajawal, sans-serif' : 'Cormorant Garamond, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: '700', lineHeight: '1.25' }}>
                {t(lecture.title_ar, lecture.title_en)}
              </h1>
              <p className="text-[#A0B9B0] text-base mb-5 leading-relaxed">{t(lecture.description_ar, lecture.description_en)}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#8B9D8A]">
                <div className="flex items-center gap-2"><GraduationCap size={16} className="text-[#C9A24A]" />{t(lecture.lecturer_ar, lecture.lecturer_en)}</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= Math.floor(lecture.rating) ? '#C9A24A' : 'none'} className="text-[#C9A24A]" />)}
                  <span className="ms-1">{lecture.rating} ({lecture.reviews} {t('تقييم', 'reviews')})</span>
                </div>
                <div className="flex items-center gap-1"><Users size={14} className="text-[#C9A24A]" />{lecture.enrolled} {t('مسجّل', 'enrolled')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {(t(lecture.whatYouLearn_ar?.[0] || '', lecture.whatYouLearn_en?.[0] || '')) && (
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 className="text-[#062B24] font-semibold mb-4 text-base">{t('ماذا ستتعلم؟', "What You'll Learn")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(isRTL ? lecture.whatYouLearn_ar : lecture.whatYouLearn_en)?.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[#C9A24A] mt-0.5 shrink-0" />
                      <span className="text-[#3A5A50] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            {lecture.curriculum && lecture.curriculum.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="p-5 relative overflow-hidden" style={{ background: BRAND.deep }}>
                  <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
                  <h2 className="text-[#F0D98A] font-semibold relative z-10">{t('المنهج الدراسي', 'Course Curriculum')}</h2>
                </div>
                {lecture.curriculum.map((module: any, mi: number) => (
                  <div key={mi} style={{ borderBottom: '1px solid rgba(6,43,36,0.08)', background: 'white' }}>
                    <button
                      onClick={() => setOpenModule(openModule === mi ? null : mi)}
                      className="w-full flex items-center justify-between p-5 hover:bg-[rgba(6,43,36,0.03)] transition-all text-start"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(201,162,74,0.15)', color: BRAND.gold }}>{mi + 1}</div>
                        <span className="text-[#062B24] font-medium text-sm">{t(module.module_ar, module.module_en)}</span>
                      </div>
                      {openModule === mi ? <ChevronUp size={16} className="text-[#C9A24A]" /> : <ChevronDown size={16} className="text-[#8B9D8A]" />}
                    </button>
                    {openModule === mi && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        {module.lessons.map((lesson: any, li: number) => (
                          <div key={li} className="flex items-center justify-between px-5 py-3 hover:bg-[rgba(201,162,74,0.03)]" style={{ borderTop: '1px solid rgba(6,43,36,0.05)' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: lesson.free ? 'rgba(201,162,74,0.15)' : 'rgba(6,43,36,0.08)' }}>
                                <Play size={11} className={lesson.free ? 'text-[#C9A24A]' : 'text-[#8B9D8A]'} />
                              </div>
                              <span className="text-[#3A5A50] text-xs">{t(lesson.title_ar, lesson.title_en)}</span>
                              {lesson.free && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(201,162,74,0.15)', color: BRAND.gold }}>{t('مجاني', 'Free')}</span>}
                            </div>
                            <span className="text-[#8B9D8A] text-xs">{lesson.duration}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Requirements */}
            {(isRTL ? lecture.requirements_ar : lecture.requirements_en)?.length > 0 && (
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)' }}>
                <h2 className="text-[#062B24] font-semibold mb-4 text-base">{t('المتطلبات', 'Requirements')}</h2>
                <ul className="space-y-2">
                  {(isRTL ? lecture.requirements_ar : lecture.requirements_en).map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-[#3A5A50] text-sm">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: BRAND.gold }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Target Students */}
            {(isRTL ? lecture.targetStudents_ar : lecture.targetStudents_en)?.length > 0 && (
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)' }}>
                <h2 className="text-[#062B24] font-semibold mb-4 text-base">{t('لمن هذا البرنامج؟', 'Who Is This For?')}</h2>
                <ul className="space-y-2">
                  {(isRTL ? lecture.targetStudents_ar : lecture.targetStudents_en).map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-[#3A5A50] text-sm">
                      <Target size={14} className="text-[#C9A24A] mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Lectures */}
            {relatedLectures.length > 0 && (
              <div>
                <h2 className="text-[#062B24] font-semibold mb-5 text-base">{t('محاضرات ذات صلة', 'Related Lectures')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedLectures.map((rel: any) => (
                    <Link key={rel.id} to={`/lectures/${rel.slug}`} className="p-4 rounded-xl transition-all block hover:-translate-y-1" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div className="text-[#062B24] text-sm font-medium mb-1 line-clamp-2">{t(rel.title_ar, rel.title_en)}</div>
                      <div className="text-[#C9A24A] font-bold text-sm">${rel.price}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-3xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(6,43,36,0.15)', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
                {/* Price Header */}
                <div className="p-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.deep}, ${BRAND.mid})` }}>
                  <GeometricBackground strokeColor="#C9A24A" strokeOpacity={0.15} strokeWidth={0.7} tileSize={60} />
                  <div className="relative z-10">
                    <div className="text-[#F0D98A] text-3xl font-bold mb-1">${lecture.price}</div>
                    <div className="text-[#8B9D8A] text-xs">{t('رسوم المحاضرة', 'Lecture Fee')}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {[
                    { icon: Clock, label_ar: 'المدة', label_en: 'Duration', value: t(lecture.duration.split('/')[0].trim(), lecture.duration.split('/')[1]?.trim() || lecture.duration) },
                    { icon: Play, label_ar: 'الدروس', label_en: 'Lessons', value: `${lecture.lessonsCount} ${t('درس', 'lessons')}` },
                    { icon: GraduationCap, label_ar: 'المحاضر', label_en: 'Lecturer', value: t(lecture.lecturer_ar, lecture.lecturer_en) },
                    { icon: Globe, label_ar: 'اللغة', label_en: 'Language', value: t(lecture.language_ar, lecture.language_en) },
                    { icon: Target, label_ar: 'المستوى', label_en: 'Level', value: t(lecture.level_ar, lecture.level_en) },
                    { icon: Award, label_ar: 'الشهادة', label_en: 'Certificate', value: lecture.certificate ? t('متاحة', 'Available') : t('غير متاحة', 'Not Available') },
                  ].map((item, i) => {
                    const IconComp = item.icon;
                    return (
                      <div key={i} className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid rgba(6,43,36,0.06)' }}>
                        <div className="flex items-center gap-2 text-[#8B9D8A] text-xs">
                          <IconComp size={14} className="text-[#C9A24A]" />
                          {t(item.label_ar, item.label_en)}
                        </div>
                        <span className="text-[#1E1E1E] text-xs font-medium text-end">{item.value}</span>
                      </div>
                    );
                  })}

                  <Link
                    to={currentUser ? `/checkout/${lecture.slug}` : "/register"}
                    className="w-full py-4 rounded-2xl text-sm font-semibold text-center block mt-4 transition-all"
                    style={{ background: 'linear-gradient(135deg, #C9A24A, #D8B75B)', color: BRAND.deep, boxShadow: '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.2)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 0 #8B6B20, 0 3px 10px rgba(0,0,0,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 0 #8B6B20, 0 6px 20px rgba(0,0,0,0.2)'; }}
                  >
                    {currentUser ? t('سجّل في المحاضرة', 'Enroll in Lecture') : t('سجّل الآن', 'Register Now')}
                  </Link>

                  <Link
                    to="/contact"
                    className="w-full py-3.5 rounded-2xl text-sm font-medium text-center flex items-center justify-center gap-2 border transition-all hover:bg-[rgba(6,43,36,0.04)]"
                    style={{ borderColor: 'rgba(6,43,36,0.2)', color: BRAND.deep }}
                  >
                    <MessageSquare size={15} />
                    {t('تواصل للتسجيل', 'Contact for Enrollment')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}