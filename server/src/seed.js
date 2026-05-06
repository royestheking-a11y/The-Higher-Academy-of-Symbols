import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import User from './models/User.js';
import Lecture from './models/Lecture.js';
import Article from './models/Article.js';
import AreaOfStudy from './models/AreaOfStudy.js';
import Testimonial from './models/Testimonial.js';
import Enrollment from './models/Enrollment.js';
import ContactMessage from './models/ContactMessage.js';
import Supervisor from './models/Supervisor.js';
import Teacher from './models/Teacher.js';
import Package from './models/Package.js';
import Subscription from './models/Subscription.js';
import Notification from './models/Notification.js';
import Settings from './models/Settings.js';

await connectDB();

console.log('🌱 Seeding all collections...');

// Clear all
await Promise.all([
  User.deleteMany(), Lecture.deleteMany(), Article.deleteMany(),
  AreaOfStudy.deleteMany(), Testimonial.deleteMany(), Enrollment.deleteMany(),
  ContactMessage.deleteMany(), Supervisor.deleteMany(), Teacher.deleteMany(),
  Package.deleteMany(), Subscription.deleteMany(), Notification.deleteMany(),
  Settings.deleteMany(),
]);
console.log('🗑️  Cleared all collections');

// Users (passwords auto-hashed by pre-save hook)
const users = await User.insertMany([
  { name:'Admin', email:'admin@symbolsacademy.com', password: await bcrypt.hash('admin123',12), phone:'+971567199176', country:'UAE', role:'admin', language:'ar', enrolledCourses:[], status:'active' },
  { name:'Ahmed Al-Rashidi', name_ar:'أحمد الراشدي', email:'student@example.com', password: await bcrypt.hash('student123',12), phone:'+971501234567', country:'UAE', role:'student', language:'ar', enrolledCourses:[], status:'active' },
  { name:'Nour Suleiman', email:'nour@example.com', password: await bcrypt.hash('nour123',12), phone:'+966501234567', country:'Saudi Arabia', role:'student', language:'ar', enrolledCourses:[], status:'active' },
], { ordered: true });
console.log('✅ Users:', users.length);

// Lectures
const lectures = await Lecture.insertMany([
  { title_ar:'علم التأويل', title_en:'The Science of Interpretation', slug:'science-of-interpretation', description_ar:'دراسة معمّقة في علم التأويل وأسسه المنهجية.', description_en:'A deep study of the science of interpretation.', price:200, duration:'8 ساعات / 8 Hours', lessonsCount:8, lecturer_ar:'د. فاطمة فاضل العيساوي', lecturer_en:'Dr. Fatima Fadel Al-Issawi', category:'interpretation', category_ar:'التأويل', category_en:'Interpretation', level_ar:'متوسط', level_en:'Intermediate', language_ar:'العربية', language_en:'Arabic', certificate:true, featured:true, status:'published', enrolled:234, rating:4.9, reviews:47, whatYouLearn_ar:['أساسيات علم التأويل','المدارس الفكرية الكبرى'], whatYouLearn_en:['Fundamentals of interpretation','Major intellectual schools'], requirements_ar:['معرفة أساسية باللغة العربية'], requirements_en:['Basic knowledge of Arabic'], targetStudents_ar:['الباحثون في العلوم الإنسانية'], targetStudents_en:['Humanities researchers'], curriculum:[{module_ar:'الوحدة الأولى',module_en:'Module 1: Introduction',lessons:[{title_ar:'ما هو علم التأويل؟',title_en:'What is the Science of Interpretation?',duration:'45 min',free:true}]}], faq:[{q_ar:'هل يتضمن الكورس شهادة؟',q_en:'Does the course include a certificate?',a_ar:'نعم',a_en:'Yes'}] },
  { title_ar:'الاختزال العربي', title_en:'Arabic Shorthand', slug:'arabic-shorthand', description_ar:'نظام الكتابة الاختزالية في اللغة العربية.', description_en:'Arabic shorthand writing systems.', price:300, duration:'12 ساعة / 12 Hours', lessonsCount:12, lecturer_ar:'د. فاطمة فاضل العيساوي', lecturer_en:'Dr. Fatima Fadel Al-Issawi', category:'shorthand', category_ar:'الاختزال', category_en:'Shorthand', level_ar:'مبتدئ إلى متوسط', level_en:'Beginner to Intermediate', language_ar:'العربية', language_en:'Arabic', certificate:true, featured:true, status:'published', enrolled:189, rating:4.8, reviews:38, whatYouLearn_ar:['أنظمة الاختزال العربي'], whatYouLearn_en:['Classical Arabic shorthand systems'], requirements_ar:['إجادة القراءة والكتابة العربية'], requirements_en:['Proficiency in Arabic reading and writing'], targetStudents_ar:['الصحفيون'], targetStudents_en:['Journalists'], curriculum:[], faq:[] },
  { title_ar:'التشفير والمرموز عند العرب', title_en:'Cryptography and the Cryptogram among the Arabs', slug:'cryptography-arabs', description_ar:'رحلة علمية في عالم التشفير والأسرار عند العرب.', description_en:'A scientific journey into Arab cryptography.', price:1000, duration:'10 ساعات / 10 Hours', lessonsCount:10, lecturer_ar:'د. فاطمة فاضل العيساوي', lecturer_en:'Dr. Fatima Fadel Al-Issawi', category:'cryptography', category_ar:'التشفير', category_en:'Cryptography', level_ar:'متقدم', level_en:'Advanced', language_ar:'العربية', language_en:'Arabic', certificate:true, featured:true, status:'published', enrolled:156, rating:5.0, reviews:52, whatYouLearn_ar:['تاريخ التشفير العربي'], whatYouLearn_en:['History of Arabic cryptography'], requirements_ar:['اهتمام بالتراث العلمي العربي'], requirements_en:['Interest in Arabic scientific heritage'], targetStudents_ar:['الباحثون المتقدمون'], targetStudents_en:['Advanced researchers'], curriculum:[], faq:[] },
  { title_ar:'السيميائيات النصية', title_en:'Text Semiotics', slug:'text-semiotics', description_ar:'دراسة العلامات والرموز في النصوص.', description_en:'Study of signs and symbols in texts.', price:300, duration:'9 ساعات / 9 Hours', lessonsCount:9, lecturer_ar:'د. فاطمة فاضل العيساوي', lecturer_en:'Dr. Fatima Fadel Al-Issawi', category:'semiotics', category_ar:'السيميائيات', category_en:'Semiotics', level_ar:'متوسط', level_en:'Intermediate', language_ar:'العربية', language_en:'Arabic', certificate:true, featured:true, status:'published', enrolled:145, rating:4.7, reviews:29, whatYouLearn_ar:['مبادئ السيميائيات'], whatYouLearn_en:['Principles of semiotics'], requirements_ar:[], requirements_en:[], targetStudents_ar:[], targetStudents_en:[], curriculum:[], faq:[] },
  { title_ar:'الكتابة الموضوعاتية', title_en:'Object Writing', slug:'object-writing', description_ar:'فن استلهام الكتابة من الموضوعات والأشياء.', description_en:'The art of drawing writing inspiration from objects.', price:300, duration:'7 ساعات / 7 Hours', lessonsCount:7, lecturer_ar:'د. فاطمة فاضل العيساوي', lecturer_en:'Dr. Fatima Fadel Al-Issawi', category:'research', category_ar:'البحث', category_en:'Research', level_ar:'مبتدئ', level_en:'Beginner', language_ar:'العربية', language_en:'Arabic', certificate:false, featured:false, status:'published', enrolled:98, rating:4.6, reviews:18, whatYouLearn_ar:[], whatYouLearn_en:[], requirements_ar:[], requirements_en:[], targetStudents_ar:[], targetStudents_en:[], curriculum:[], faq:[] },
  { title_ar:'الدلالة والمعنى', title_en:'Semantics', slug:'semantics', description_ar:'علم دراسة المعنى اللغوي وتطور الدلالات.', description_en:'The science of linguistic meaning.', price:100, duration:'5 ساعات / 5 Hours', lessonsCount:5, lecturer_ar:'د. فاطمة فاضل العيساوي', lecturer_en:'Dr. Fatima Fadel Al-Issawi', category:'semantics', category_ar:'الدلالة', category_en:'Semantics', level_ar:'مبتدئ', level_en:'Beginner', language_ar:'العربية', language_en:'Arabic', certificate:false, featured:false, status:'published', enrolled:312, rating:4.8, reviews:64, whatYouLearn_ar:[], whatYouLearn_en:[], requirements_ar:[], requirements_en:[], targetStudents_ar:[], targetStudents_en:[], curriculum:[], faq:[] },
  { title_ar:'عالم الرموز', title_en:'World of Symbols', slug:'world-of-symbols', description_ar:'رحلة شاملة في عالم الرموز والدلالات البشرية.', description_en:'A comprehensive journey into symbols.', price:200, duration:'12 ساعة / 12 Hours', lessonsCount:12, lecturer_ar:'د. فاطمة فاضل العيساوي', lecturer_en:'Dr. Fatima Fadel Al-Issawi', category:'symbolism', category_ar:'الرمزية', category_en:'Symbolism', level_ar:'مبتدئ', level_en:'Beginner', language_ar:'العربية', language_en:'Arabic', certificate:true, featured:true, status:'published', enrolled:178, rating:4.8, reviews:35, whatYouLearn_ar:['تعريف الرمز وأنواعه'], whatYouLearn_en:['Definition of symbol and its types'], requirements_ar:[], requirements_en:[], targetStudents_ar:['المبتدئون في دراسة الرمزية'], targetStudents_en:['Beginners in symbolic studies'], curriculum:[], faq:[] },
]);
console.log('✅ Lectures:', lectures.length);

// Articles
const articles = await Article.insertMany([
  { title_ar:'المنهج الرمزي في القرآن الكريم وقواعده', title_en:'The Symbolic Approach in the Holy Quran and Its Rules', slug:'symbolic-approach-quran', excerpt_ar:'دراسة تحليلية لأنماط الرمزية في القرآن الكريم.', excerpt_en:'An analytical study of symbolic patterns in the Holy Quran.', content_ar:'<p>يُعدّ القرآن الكريم من أبرز النصوص التي اعتمدت على الأسلوب الرمزي...</p>', content_en:'<p>The Holy Quran is one of the most prominent texts that employed symbolic style...</p>', author_ar:'د. فاطمة فاضل العيساوي', author_en:'Dr. Fatima Fadel Al-Issawi', category_ar:'الدراسات الرمزية', category_en:'Symbolic Studies', tags:['symbolism','quran','semiotics'], date:'2025-03-15', readTime:8, featured:true, status:'published', image:null },
  { title_ar:'الذكاء الاصطناعي ودوره في خدمة المنهجية الرمزية', title_en:'Artificial Intelligence and Its Role in Serving the Quranic Symbolic Methodology', slug:'ai-quranic-symbolic-methodology', excerpt_ar:'كيف يمكن توظيف الذكاء الاصطناعي لخدمة البحث في الرمزية؟', excerpt_en:'How can AI be employed to serve symbolism research?', content_ar:'<p>يفتح الذكاء الاصطناعي آفاقاً جديدة أمام الدراسات الرمزية...</p>', content_en:'<p>AI opens new horizons for symbolic studies...</p>', author_ar:'د. فاطمة فاضل العيساوي', author_en:'Dr. Fatima Fadel Al-Issawi', category_ar:'تقنية وبحث', category_en:'Technology & Research', tags:['AI','symbolism','research'], date:'2025-02-20', readTime:6, featured:true, status:'published', image:null },
  { title_ar:'كلمة المؤسِّسة', title_en:'Opening Remarks by the Founder', slug:'founders-opening-remarks', excerpt_ar:'رسالة المؤسِّسة في افتتاح الأكاديمية.', excerpt_en:"Founder's message at the academy opening.", content_ar:'<p>بسم الله الرحمن الرحيم، وبعد... يسرني أن أرحب بكم في الأكاديمية العليا للرموز...</p>', content_en:'<p>In the name of God... It is my pleasure to welcome you to the Higher Academy of Symbols...</p>', author_ar:'د. فاطمة فاضل العيساوي', author_en:'Dr. Fatima Fadel Al-Issawi', category_ar:'من المؤسِّسة', category_en:'From the Founder', tags:['founder','academy','vision'], date:'2024-09-01', readTime:5, featured:false, status:'published', image:null },
  { title_ar:'أنا الفينيق', title_en:'I Am the Phoenix', slug:'i-am-the-phoenix', excerpt_ar:'مقال أدبي يستعرض رمزية الفينيق في الثقافة العربية.', excerpt_en:"A literary article exploring the phoenix's symbolism.", content_ar:'<p>الفينيق... ذلك الطائر الأسطوري الذي يولد من رماده...</p>', content_en:'<p>The Phoenix... that legendary bird born from its ashes...</p>', author_ar:'د. فاطمة فاضل العيساوي', author_en:'Dr. Fatima Fadel Al-Issawi', category_ar:'أدب وفكر', category_en:'Literature & Thought', tags:['phoenix','symbolism','identity'], date:'2024-11-10', readTime:7, featured:false, status:'published', image:'/symbolacademy.png' },
]);
console.log('✅ Articles:', articles.length);

// Areas of Study
const areas = await AreaOfStudy.insertMany([
  { name_ar:'الرمزية', name_en:'Symbolism', slug:'symbolism', icon:'Star', description_ar:'دراسة الأنظمة الرمزية عبر الثقافات واللغات.', description_en:'Study of symbolic systems across cultures.', order:1, status:'published' },
  { name_ar:'السيميائيات', name_en:'Semiotics', slug:'semiotics', icon:'Eye', description_ar:'علم العلامات والإشارات والمعاني.', description_en:'The science of signs, signals, and meanings.', order:2, status:'published' },
  { name_ar:'علم التأويل', name_en:'Interpretation Science', slug:'interpretation', icon:'BookOpen', description_ar:'منهجية قراءة النصوص وفهم طبقاتها الدلالية.', description_en:'Methodology of reading texts.', order:3, status:'published' },
  { name_ar:'الاختزال العربي', name_en:'Arabic Shorthand', slug:'shorthand', icon:'PenLine', description_ar:'نظام الكتابة الرمزية المختزلة في اللغة العربية.', description_en:'The system of abbreviated symbolic writing.', order:4, status:'published' },
  { name_ar:'الدلالة', name_en:'Semantics', slug:'semantics', icon:'MessageSquare', description_ar:'دراسة المعنى اللغوي وتطور الدلالات.', description_en:'Study of linguistic meaning.', order:5, status:'published' },
  { name_ar:'التشفير', name_en:'Cryptography', slug:'cryptography', icon:'Lock', description_ar:'علم تحويل المعاني الواضحة إلى صور مشفرة.', description_en:'The science of converting meanings into encrypted forms.', order:6, status:'published' },
  { name_ar:'دراسات المخطوطات', name_en:'Manuscript Studies', slug:'manuscripts', icon:'ScrollText', description_ar:'الدراسة الأكاديمية للمخطوطات المتعلقة بالرمزية.', description_en:'Academic study of manuscripts.', order:7, status:'published' },
  { name_ar:'كتابة البحث العلمي', name_en:'Scientific Research Writing', slug:'research-writing', icon:'FileText', description_ar:'تدريب الباحثين على كتابة الأبحاث الأكاديمية.', description_en:'Training in academic research writing.', order:8, status:'published' },
  { name_ar:'فلسفة التصميم الهندسي', name_en:'Philosophy of Engineering Design', slug:'design-philosophy', icon:'Compass', description_ar:'العلاقة بين الهندسة والفلسفة والرمزية.', description_en:'The relationship between engineering and symbolism.', order:9, status:'published' },
  { name_ar:'الكتابة الموضوعاتية', name_en:'Object Writing', slug:'object-writing', icon:'Pen', description_ar:'فن استلهام الكتابة من عوالم المادة والأشياء.', description_en:'The art of drawing writing inspiration from objects.', order:10, status:'published' },
  { name_ar:'المنهج الرمزي في القرآن الكريم', name_en:'Symbolic Approach in the Holy Quran', slug:'symbolic-quran', icon:'BookOpen', description_ar:'دراسة المنهج الرمزي في القرآن الكريم.', description_en:'Study of the symbolic approach in the Holy Quran.', order:11, status:'published' },
  { name_ar:'مناهج البحث العلمي', name_en:'Research Methods', slug:'research-methods', icon:'FileText', description_ar:'كتابة البحث العلمي ومناهجه الأكاديمية.', description_en:'Scientific research writing and academic methodologies.', order:12, status:'published' },
]);
console.log('✅ Areas:', areas.length);

// Testimonials
await Testimonial.insertMany([
  { name:'أحمد الراشدي', name_en:'Ahmed Al-Rashidi', country_ar:'الإمارات العربية المتحدة', country_en:'United Arab Emirates', course_ar:'علم التأويل', course_en:'The Science of Interpretation', rating:5, message_ar:'محاضرة استثنائية غيّرت منظوري الكامل.', message_en:'An exceptional lecture that completely changed my perspective.', status:'published' },
  { name:'نور الهدى سليمان', name_en:'Nour Al-Huda Suleiman', country_ar:'المملكة العربية السعودية', country_en:'Saudi Arabia', course_ar:'التشفير والمرموز عند العرب', course_en:'Cryptography among the Arabs', rating:5, message_ar:'موضوع التشفير عند العرب كان غائباً تماماً عن مناهجنا.', message_en:'Arab cryptography was completely absent from our curricula.', status:'published' },
  { name:'رنا المغربي', name_en:'Rana Al-Maghribi', country_ar:'المغرب', country_en:'Morocco', course_ar:'السيميائيات النصية', course_en:'Text Semiotics', rating:5, message_ar:'التعليم الرقمي بهذا المستوى نادر جداً في العالم العربي.', message_en:'Digital education at this level is very rare in the Arab world.', status:'published' },
  { name:'خالد العتيبي', name_en:'Khalid Al-Utaybi', country_ar:'الكويت', country_en:'Kuwait', course_ar:'الاختزال العربي', course_en:'Arabic Shorthand', rating:5, message_ar:'لم أكن أعلم أن الاختزال العربي بهذا الغنى والعمق.', message_en:'I did not know Arabic shorthand was this rich and deep.', status:'published' },
  { name:'ليلى حسن', name_en:'Layla Hassan', country_ar:'مصر', country_en:'Egypt', course_ar:'الدلالة والمعنى', course_en:'Semantics', rating:4, message_ar:'مواد علمية رائعة ومنهجية واضحة.', message_en:'Wonderful scientific materials and clear methodology.', status:'published' },
]);
console.log('✅ Testimonials seeded');

// Enrollments (link student-2 to lecture-1 and lecture-3)
const student = users[1];
const admin = users[0];
await Enrollment.insertMany([
  { userId: student._id, userLegacyId:'student-001', userName: student.name, userEmail: student.email, courseId: lectures[0]._id, courseLegacyId:'lec-001', courseTitle: lectures[0].title_en, amount:200, paymentMethod:'card', paymentStatus:'paid', enrollmentStatus:'approved', transactionId:'TXN-001' },
  { userId: student._id, userLegacyId:'student-001', userName: student.name, userEmail: student.email, courseId: lectures[2]._id, courseLegacyId:'lec-003', courseTitle: lectures[2].title_en, amount:1000, paymentMethod:'bank_transfer', paymentStatus:'paid', enrollmentStatus:'approved', transactionId:'TXN-002' },
]);
console.log('✅ Enrollments seeded');

// Contact Messages
await ContactMessage.insertMany([
  { name:'سارة عبدالله', email:'sara@example.com', phone:'+966501234567', subject_ar:'استفسار عن التسجيل', subject_en:'Enrollment Inquiry', message_ar:'أود الاستفسار عن إجراءات التسجيل', message_en:'I would like to inquire about enrollment procedures', date:'2025-04-20', status:'new' },
  { name:'Omar Al-Farsi', email:'omar@example.com', phone:'+971501111222', subject_ar:'سؤال عن الشهادات', subject_en:'Question about Certificates', message_ar:'هل الشهادات معتمدة دولياً؟', message_en:'Are the certificates internationally accredited?', date:'2025-04-18', status:'replied' },
]);
console.log('✅ Contact messages seeded');

// Supervisors
await Supervisor.insertMany([
  { serialNo:16, name:'Fatima alissawi', name_ar:'فاطمة العيساوي', email:'fatima@symbolsacademy.com', phone:'', specialty_ar:'الإشراف الأكاديمي', specialty_en:'Academic Supervision', bio_ar:'', bio_en:'', status:'active' },
  { serialNo:18, name:'HDOO', name_ar:'HDOO', email:'fatimaalissawi1981f@gmail.com', phone:'', specialty_ar:'الإشراف الأكاديمي', specialty_en:'Academic Supervision', bio_ar:'', bio_en:'', status:'active' },
]);
console.log('✅ Supervisors seeded');

// Teachers
await Teacher.insertMany([
  { serialNo:7, name:'Dr. Fatima Fadel Al-Issawi', name_ar:'د. فاطمة فاضل العيساوي', email:'info@symbolsacademy.com', phone:'+971567199176', specialty_ar:'الرمزية والسيميائيات والتأويل', specialty_en:'Symbolism, Semiotics & Interpretation', bio_ar:'أكاديمية وباحثة متخصصة في الدراسات الرمزية.', bio_en:'Academic and researcher specializing in symbolic studies.', status:'active' },
]);
console.log('✅ Teachers seeded');

// Packages
await Package.insertMany([
  { serialNo:1, name_ar:'الباقة المجانية لسنة', name_en:'Free Package for One Year', price:0, duration_days:360, features_ar:['الوصول لجميع المحاضرات المجانية','دعم البريد الإلكتروني','شهادة مشاركة'], features_en:['Access to all free lectures','Email support','Participation certificate'], status:'active' },
]);
console.log('✅ Packages seeded');

// Settings
await Settings.create({
  siteName_ar:'الأكاديمية العليا للرموز', siteName_en:'The Higher Academy of Symbols',
  tagline_ar:'حيث تتحول العلامات إلى معرفة', tagline_en:'Where symbols become structured knowledge',
  heroTitle_ar:'الأكاديمية العليا للرموز', heroTitle_en:'The Higher Academy of Symbols',
  heroSubtitle_ar:'نحو فهم أعمق للرموز والمعاني من حولنا', heroSubtitle_en:'Toward a Deeper Understanding of Symbols and Meanings',
  heroDescription_ar:'منصة تعليمية وبحثية متخصصة في دراسة الرموز والتأويل والسيميائيات.', heroDescription_en:'A specialized educational and research academy dedicated to symbolism, interpretation, and semiotics.',
  aboutText_ar:'الأكاديمية العليا للرموز مؤسسة تعليمية ذكية تُعنى بالبحث العلمي والتعليم المبتكر.', aboutText_en:'The Higher Academy of Symbols is a smart educational institution focused on rigorous scientific research.',
  vision_ar:'مؤسسة تعليمية ذكية تُعنى بالبحث الرفيع والأثر الإيجابي.', vision_en:'A smart educational institution concerned with high-level research.',
  mission_ar:'إعداد باحثين في الرموز والشيفرات والتشفير.', mission_en:'Preparing researchers in symbols, codes, and cryptography.',
  phone1:'+971567199176', phone2:'+963967115779', email:'info@symbolsacademy.com',
  address_ar:'الإمارات العربية المتحدة - دبي', address_en:'UAE - Dubai',
  announcement_ar:'التسجيل مفتوح الآن في محاضرة التشفير والمرموز عند العرب', announcement_en:'Registration is now open for Cryptography and the Cryptogram among the Arabs',
  announcementLink:'/lectures/cryptography-arabs', announcementEnabled:true,
  founderName_ar:'د. فاطمة فاضل العيساوي', founderName_en:'Dr. Fatima Fadel Al-Issawi',
  founderTitle_ar:'مؤسِّسة الأكاديمية العليا للرموز', founderTitle_en:'Founder of The Higher Academy of Symbols',
  founderBio_ar:'أكاديمية وباحثة متخصصة في الدراسات الرمزية والسيميائيات.', founderBio_en:'Academic and researcher specializing in symbolic studies and semiotics.',
  logoUrl:'https://res.cloudinary.com/dtzearvwx/image/upload/symbols_academy/logo/symbolacademy',
});
console.log('✅ Settings seeded');

console.log('\n🎉 Database seeded successfully!');
console.log('📧 Admin: admin@symbolsacademy.com / admin123');
console.log('📧 Student: student@example.com / student123');
await mongoose.disconnect();
