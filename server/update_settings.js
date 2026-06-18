import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './src/db.js';
import Settings from './src/models/Settings.js';

async function updateDB() {
  await connectDB();
  console.log('Connected. Updating Settings collection...');
  
  const result = await Settings.updateMany({}, {
    $set: {
      siteName_ar: 'الأكاديمية العليا للرموز والشفرة',
      siteName_en: 'The Higher Academy of Symbols and Code',
      heroTitle_ar: 'الأكاديمية العليا للرموز والشفرة',
      heroTitle_en: 'The Higher Academy of Symbols and Code',
      heroDescription_en: 'A specialized educational and research academy dedicated to symbolism, interpretation, and semiotics.',
      aboutText_ar: 'الأكاديمية العليا للرموز والشفرة مؤسسة تعليمية ذكية تُعنى بالبحث العلمي والتعليم المبتكر.',
      aboutText_en: 'The Higher Academy of Symbols and Code is a smart educational institution focused on rigorous scientific research.',
      founderTitle_ar: 'مؤسِّسة الأكاديمية العليا للرموز والشفرة',
      founderTitle_en: 'Founder of The Higher Academy of Symbols and Code'
    }
  });

  console.log('Update Result:', result);
  await mongoose.disconnect();
}

updateDB();
