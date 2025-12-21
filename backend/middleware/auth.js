const jwt = require('jsonwebtoken');

// Middleware للتحقق من المصادقة
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'لا يوجد رمز مصادقة' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'رمز المصادقة غير صالح' });
  }
};

// Middleware للتحقق من صلاحيات المشرف
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'يجب أن تكون مشرفاً للوصول إلى هذه الصفحة' });
  }
};

module.exports = { auth, adminAuth };
