const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const User = require('./models/User');

// إنشاء واجهة للقراءة من المدخلات
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinestore')
  .then(() => console.log('✅ متصل بقاعدة البيانات'))
  .catch(err => {
    console.error('❌ خطأ في الاتصال:', err);
    process.exit(1);
  });

// دالة لتعيين مستخدم كمدير
async function makeUserAdmin() {
  try {
    // عرض جميع المستخدمين
    const users = await User.find().select('name email role');
    
    if (users.length === 0) {
      console.log('\n❌ لا يوجد مستخدمون في قاعدة البيانات');
      console.log('يرجى إنشاء حساب أولاً عبر صفحة التسجيل\n');
      process.exit(0);
    }

    console.log('\n📋 المستخدمون الحاليون:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

    // السؤال عن البريد الإلكتروني
    rl.question('\n📧 أدخل البريد الإلكتروني للمستخدم الذي تريد جعله مديراً: ', async (email) => {
      try {
        const user = await User.findOne({ email: email.trim() });
        
        if (!user) {
          console.log('\n❌ المستخدم غير موجود!\n');
          rl.close();
          process.exit(1);
        }

        if (user.role === 'admin') {
          console.log(`\n⚠️  المستخدم ${user.name} هو مدير بالفعل!\n`);
          rl.close();
          process.exit(0);
        }

        // تحديث الرتبة إلى admin
        user.role = 'admin';
        await user.save();

        console.log(`\n✅ تم تعيين ${user.name} كمدير بنجاح!\n`);
        rl.close();
        process.exit(0);
      } catch (error) {
        console.error('\n❌ خطأ:', error.message);
        rl.close();
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    rl.close();
    process.exit(1);
  }
}

// تشغيل الدالة
makeUserAdmin();
