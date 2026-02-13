# شرح Docker والتكوين المفصل

## 🐳 ما هو Docker؟

Docker هو أداة للتطوير والنشر توفر بيئة معزولة وآمنة تسمى **Containers**. كل container هو مثل جهاز كمبيوتر صغير مستقل يحتوي على:
- التطبيق (Backend/Frontend)
- نظام التشغيل (Linux Alpine)
- المكتبات والأدوات المطلوبة

### الفائدة:
✅ نفس البيئة على كل الأجهزة (جهازك، جهاز زميلك، السيرفر)  
✅ لا تضارب في الإصدارات  
✅ سهل البدء والإيقاف  
✅ معزول تماماً - لا يؤثر على باقي البرامج

---

## 📦 مكونات المشروع

### 1️⃣ **MongoDB Container** 
```
الصورة: mongo:latest
المنفذ: 27017
الوظيفة: قاعدة البيانات
الحالة: معزول في container - لا يحتاج تثبيت على الجهاز
```

### 2️⃣ **Backend Container** 
```
الصورة: node:18-alpine + app code
المنفذ: 5001:5000
الوظيفة: API Server
الملف: backend/Dockerfile
```

### 3️⃣ **Frontend Container**
```
الصورة: node:18-alpine + React app
المنفذ: 3000
الوظيفة: React App
الملف: frontend/Dockerfile
```

---

## 🔧 الملفات المهمة

### **docker-compose.yml** (الملف الرئيسي)

```yaml
version: '3.8'  # نسخة Docker Compose

services:
  mongodb:           # الخدمة الأولى
    image: mongo:latest  # الصورة الجاهزة
    ports:
      - "27017:27017"    # المنفذ المحلي : المنفذ داخل container
  
  backend:           # الخدمة الثانية
    build: ./backend   # بناء من Dockerfile
    ports:
      - "5001:5000"    # تعديل: المنفذ المحلي من 5000 إلى 5001
    depends_on:
      - mongodb        # ينتظر MongoDB يبدأ أولاً
  
  frontend:          # الخدمة الثالثة
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

---

## 🐳 **Dockerfile شرح**

### **backend/Dockerfile:**
```dockerfile
FROM node:18-alpine        # استخدام صورة Node.js الخفيفة
WORKDIR /app               # مجلد العمل داخل Container
COPY package*.json ./      # نسخ ملفات package
RUN npm install            # تثبيت المكتبات
COPY . .                   # نسخ كل الملفات
EXPOSE 5000                # فتح المنفذ
CMD ["node", "server.js"]  # الأمر الذي يبدأ عند التشغيل
```

### **frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🚀 أوامر Docker الأساسية

### **البدء**
```bash
docker compose up              # تشغيل بدون rebuild
docker compose up --build      # تشغيل مع بناء الصور من جديد
docker compose up -d           # تشغيل في الخلفية
```

### **الإيقاف**
```bash
docker compose down            # إيقاف الحاويات
docker compose down -v         # إيقاف وحذف البيانات
```

### **المراقبة**
```bash
docker compose ps              # عرض حالة الحاويات
docker compose logs -f         # مشاهدة السجلات الحية
docker compose logs backend    # سجلات خدمة معينة
```

### **تنفيذ أوامر داخل Container**
```bash
docker exec -it onlinestore-backend sh    # الدخول للـ Backend
docker exec onlinestore-backend node seed.js  # تشغيل seed
```

---

## 🔌 **الشبكة والاتصال**

Docker يخلق شبكة خاصة بين الحاويات:

```
┌─────────────┐
│  Frontend   │
│ :3000       │
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────┐
│  Backend    │
│ :5001       │ (5000 داخل container)
└──────┬──────┘
       │ MongoDB Query
       ↓
┌─────────────┐
│  MongoDB    │
│ :27017      │
└─────────────┘
```

### **الاتصالات:**
- Frontend يطلب من Backend عبر: `http://localhost:5001/api`
- Backend يطلب من MongoDB عبر: `mongodb://mongodb:27017/onlinestore`
  (اسم الـ container يعمل كـ hostname!)

---

## 📊 **حياة البيانات**

### **Volumes** (التخزين الدائم)
```yaml
mongo-data:/data/db      # حفظ بيانات MongoDB
```
- البيانات تبقى حتى بعد إيقاف Container
- حذفها بـ: `docker compose down -v`

### **Hot Reload** (التطوير الحي)
```yaml
volumes:
  - ./backend:/app       # أي تعديل محلي يظهر مباشرة
  - /app/node_modules    # لكن node_modules منفصل
```

---

## 🐛 **المشاكل الشائعة والحل**

### ❌ **خطأ: Port already in use**
```bash
# الحل: قتل العملية على المنفذ
lsof -i :5000 | xargs kill -9
lsof -i :3000 | xargs kill -9
```

### ❌ **خطأ: Cannot connect to MongoDB**
```bash
# السبب: قد لم تبدأ MongoDB بعد
# الحل: إعادة تشغيل docker compose up
```

### ❌ **خطأ: npm install fails**
```bash
# الحل: حذف volumes وإعادة البناء
docker compose down -v
docker compose up --build
```

---

## 📈 **مزايا هذا التكوين**

| الميزة | الفائدة |
|--------|---------|
| **معزول** | كل خدمة مستقلة في container |
| **سهل التطوير** | Hot reload للتعديلات |
| **لا حاجة لتثبيت** | كل شيء في Docker |
| **نفس البيئة** | يعمل على أي جهاز |
| **سهل النشر** | يعمل على Production |

---

## 🎯 **الخطوات من الصفر**

### 1️⃣ **التثبيت الأول:**
```bash
docker compose up --build
```
- ينزل الصور من DockerHub
- يبني الـ Dockerfiles
- يشغل كل الخدمات

### 2️⃣ **التطوير:**
```bash
docker compose up
```
- التعديلات تظهر مباشرة (Hot Reload)

### 3️⃣ **التوقف:**
```bash
docker compose down
```
- إيقاف آمن لكل الحاويات
- البيانات تبقى

### 4️⃣ **التنظيف الكامل:**
```bash
docker compose down -v
```
- حذف كل شيء بما فيه البيانات

---

## 🌐 **الوصول للتطبيق**

| الخدمة | الرابط |
|--------|--------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| MongoDB | mongodb://localhost:27017 |

---

## 📝 **ملخص سريع**

```bash
# إعادة تشغيل كامل
docker compose down -v && docker compose up --build

# مشاهدة السجلات
docker compose logs -f

# الدخول للـ Backend
docker exec -it onlinestore-backend sh

# تشغيل البيانات الأولية
docker exec -it onlinestore-backend node seed.js
```

---

## 🎓 **تعلم أكثر**

- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- Best Practices: https://docs.docker.com/develop/dev-best-practices
