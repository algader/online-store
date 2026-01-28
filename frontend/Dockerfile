FROM node:18-alpine

WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت dependencies
RUN npm install

# نسخ باقي الملفات
COPY . .

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "start"]
