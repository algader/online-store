const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

// إنشاء طلب جديد
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, phone } = req.body;

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      phone
    });

    await order.save();
    await order.populate('items.product');
    
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// الحصول على طلبات المستخدم
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// الحصول على جميع الطلبات (مشرف فقط)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// تحديث حالة الطلب (مشرف فقط)
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// حذف طلب (مشرف فقط)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;
