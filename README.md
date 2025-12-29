# متجر إلكتروني - Online Store

## وصف المشروع
منصة تجارة إلكترونية متكاملة لبيع المنتجات الإلكترونية والكاميرات والإكسسوارات والألعاب. المشروع يدعم ثلاث لغات (العربية، الإنجليزية، الألمانية) مع نظام مصادقة كامل ولوحة تحكم للمشرف.

## المميزات

### للمستخدمين
- تصفح المنتجات حسب الفئات
- نظام سلة التسوق
- إتمام الطلبات وتتبعها
- تسجيل الدخول والتسجيل
- دعم ثلاث لغات مع واجهة RTL للعربية

### للمشرفين
- إدارة المنتجات (إضافة، تعديل، حذف)
- إدارة الطلبات وتحديث حالتها
- إدارة المستخدمين
- لوحة تحكم شاملة

## التقنيات المستخدمة

### Frontend
- React 18.3.1
- React Router DOM 6.28.0
- i18next (دعم متعدد اللغات)
- Axios (التواصل مع API)
- Context API (إدارة الحالة)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (المصادقة)
- bcryptjs (تشفير كلمات المرور)

## متطلبات التشغيل

- Node.js (الإصدار 14 أو أحدث)
- MongoDB (قاعدة بيانات محلية أو MongoDB Atlas)
- npm أو yarn

## التثبيت والتشغيل

### 1. استنساخ المشروع
```bash
git clone https://github.com/algader/online-store.git
cd online-store
```

### 2. إعداد Backend

```bash
cd backend
npm install
```

أنشئ ملف `.env` في مجلد backend:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/online-store
JWT_SECRET=your-secret-key-here
PORT=5001
```

شغل البيانات التجريبية:
```bash
node seed.js
```

شغل الخادم:
```bash
node server.js
```

### 3. إعداد Frontend

```bash
cd frontend
npm install
npm start
```

## البيانات التجريبية

بعد تشغيل `seed.js` ستتوفر الحسابات التالية:

**حساب المشرف:**
- البريد الإلكتروني: admin@store.com
- كلمة المرور: admin123

**حساب مستخدم:**
- البريد الإلكتروني: user@test.com
- كلمة المرور: user123

## البنية الهيكلية

```
online-store/
├── backend/
│   ├── models/          # نماذج MongoDB
│   ├── routes/          # مسارات API
│   ├── middleware/      # Middleware للمصادقة
│   ├── server.js        # نقطة دخول الخادم
│   └── seed.js          # بيانات تجريبية
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # مكونات React
│       ├── pages/       # صفحات التطبيق
│       ├── context/     # Context API
│       ├── i18n/        # ملفات الترجمة
│       └── utils/       # وظائف مساعدة
```

## API Endpoints

### المصادقة
- POST `/api/auth/register` - تسجيل مستخدم جديد
- POST `/api/auth/login` - تسجيل الدخول

### المنتجات
- GET `/api/products` - جميع المنتجات
- GET `/api/products/:id` - منتج محدد
- POST `/api/products` - إضافة منتج (مشرف)
- PUT `/api/products/:id` - تحديث منتج (مشرف)
- DELETE `/api/products/:id` - حذف منتج (مشرف)

### الطلبات
- GET `/api/orders` - طلبات المستخدم
- POST `/api/orders` - إنشاء طلب جديد
- GET `/api/orders/all` - جميع الطلبات (مشرف)
- PUT `/api/orders/:id` - تحديث حالة الطلب (مشرف)

### المستخدمين
- GET `/api/users` - جميع المستخدمين (مشرف)

## النشر

المشروع منشور على Render.com:
- Frontend: https://online-store-1-rfrp.onrender.com
- Backend: https://online-store-8i9v.onrender.com

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام التعليمي والتجاري.

## التواصل

للاستفسارات أو المساهمة في المشروع، يرجى فتح Issue على GitHub.
