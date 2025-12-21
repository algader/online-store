// سكريبت لإضافة بيانات تجريبية
// استخدم هذا الملف لإضافة منتجات ومستخدمين تجريبيين

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// استيراد النماذج
const User = require('./models/User');
const Product = require('./models/Product');

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ متصل بقاعدة البيانات'))
  .catch(err => console.error('❌ خطأ في الاتصال:', err));

// بيانات المستخدمين التجريبيين
const users = [
  {
    name: 'المشرف',
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'محمد أحمد',
    email: 'user@test.com',
    password: 'user123',
    role: 'user',
    address: 'الرياض، حي النخيل',
    phone: '0501234567'
  }
];

// بيانات المنتجات التجريبية
const products = [
  {
    name: 'لابتوب Dell XPS 13',
    description: 'لابتوب خفيف الوزن بمعالج قوي مثالي للعمل والدراسة',
    price: 4500,
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300',
    stock: 10
  },
  {
    name: 'سماعات Sony WH-1000XM5',
    description: 'سماعات لاسلكية مع إلغاء ضوضاء متقدم',
    price: 1200,
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300',
    stock: 20
  },
  {
    name: 'ساعة Apple Watch Series 9',
    description: 'ساعة ذكية مع مستشعرات صحية متقدمة',
    price: 1800,
    category: 'إكسسوارات',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300',
    stock: 12
  },
  {
    name: 'iPad Air M2',
    description: 'تابلت متعدد الاستخدامات بشاشة 10.9 بوصة',
    price: 2800,
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
    stock: 8
  },
  {
    name: 'كاميرا Canon EOS R6',
    description: 'كاميرا احترافية بدقة 20 ميجابكسل',
    price: 9500,
    category: 'كاميرات',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300',
    stock: 5
  },
  {
    name: 'PlayStation 5',
    description: 'جهاز ألعاب من الجيل التالي',
    price: 2100,
    category: 'ألعاب',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300',
    stock: 7
  },
  {
    name: 'شاشة Samsung 4K',
    description: 'شاشة 55 بوصة بتقنية QLED',
    price: 3200,
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
    stock: 6
  }
];

// دالة لإضافة البيانات
const seedDatabase = async () => {
  try {
    // حذف البيانات القديمة
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  تم حذف البيانات القديمة');

    // إضافة المستخدمين
    for (let userData of users) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      await User.create(userData);
    }
    console.log('✅ تم إضافة المستخدمين');

    // إضافة المنتجات
    await Product.insertMany(products);
    console.log('✅ تم إضافة المنتجات');

    console.log('\n📊 البيانات التجريبية:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 حساب المشرف:');
    console.log('   البريد: admin@store.com');
    console.log('   كلمة المرور: admin123');
    console.log('');
    console.log('👤 حساب مستخدم:');
    console.log('   البريد: user@test.com');
    console.log('   كلمة المرور: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
};

// تنفيذ السكريبت
seedDatabase();

