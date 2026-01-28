# أوامر Docker للمشروع

## البدء

### 1. بناء وتشغيل جميع الخدمات
```bash
docker-compose up --build
```

### 2. تشغيل في الخلفية (Detached mode)
```bash
docker-compose up -d
```

### 3. إيقاف الخدمات
```bash
docker-compose down
```

### 4. إيقاف وحذف كل البيانات
```bash
docker-compose down -v
```

## مراقبة الخدمات

### عرض السجلات (Logs)
```bash
# جميع الخدمات
docker-compose logs -f

# Backend فقط
docker-compose logs -f backend

# Frontend فقط
docker-compose logs -f frontend

# MongoDB فقط
docker-compose logs -f mongodb
```

### حالة الـ Containers
```bash
docker-compose ps
```

## الدخول إلى الـ Containers

### Backend
```bash
docker exec -it onlinestore-backend sh
```

### Frontend
```bash
docker exec -it onlinestore-frontend sh
```

### MongoDB
```bash
docker exec -it onlinestore-mongodb mongosh
```

## تنفيذ seed البيانات

```bash
docker exec -it onlinestore-backend node seed.js
```

## إعادة البناء

### إعادة بناء خدمة معينة
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### إعادة بناء كل شيء
```bash
docker-compose build --no-cache
docker-compose up
```

## الروابط

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## نصائح

1. تأكد من أن Docker Desktop يعمل
2. المنافذ 3000, 5000, 27017 يجب أن تكون متاحة
3. للتطوير، التعديلات ستظهر مباشرة بفضل الـ volumes
4. لحذف كل شيء بما في ذلك البيانات: `docker-compose down -v`

## مشاكل شائعة

### المنفذ مستخدم
```bash
# إيقاف العملية التي تستخدم المنفذ
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### مشكلة في الاتصال بقاعدة البيانات
```bash
# إعادة تشغيل MongoDB
docker-compose restart mongodb
```

### حذف الصور القديمة
```bash
docker system prune -a
```
