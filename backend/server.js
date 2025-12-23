const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://online-store-frontend.onrender.com',
    'http://localhost:3000'  // Für lokale Entwicklung
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB متصل بنجاح'))
.catch((err) => console.error('❌ خطأ في الاتصال بـ MongoDB:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'مرحباً بك في متجرنا الإلكتروني' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
