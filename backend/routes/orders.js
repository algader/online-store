const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, phone } = req.body;

    // التحقق من صحة البيانات المدخلة
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'لا توجد عناصر في الطلب' });
    }

    if (!shippingAddress || !phone) {
      return res.status(400).json({ message: 'العنوان والهاتف مطلوبان' });
    }

    let calculatedItems = [];
    let totalAmount = 0;
    let stockUpdates = [];

    for (const item of items) {
      // التحقق من أن العنصر يحتوي على productId والكمية فقط
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ message: 'كل عنصر يجب أن يحتوي على productId والكمية' });
      }

      // جلب المنتج من قاعدة البيانات
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `المنتج ${item.productId} غير موجود` });
      }

      // التحقق من أن الكمية موجبة
      if (item.quantity <= 0) {
        return res.status(400).json({ message: 'الكمية يجب أن تكون أكبر من صفر' });
      }

      if (item.quantity > product.countInStock) {
        return res.status(400).json({ 
          message: `المنتج "${product.name}" متوفر فقط ${product.countInStock} وحدات، أنت طلبت ${item.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      calculatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // تسجيل تحديث المخزون
      stockUpdates.push({
        productId: product._id,
        quantityToDeduct: item.quantity
      });
    }

    const deducted = [];
    try {
      for (const update of stockUpdates) {
        const result = await Product.updateOne(
          { _id: update.productId, countInStock: { $gte: update.quantityToDeduct } },
          { $inc: { countInStock: -update.quantityToDeduct } }
        );

        if (!result || result.modifiedCount === 0) {
          throw new Error('INSUFFICIENT_STOCK');
        }

        deducted.push(update);
      }
    } catch (stockError) {
      // محاولة استرجاع المخزون في حال فشل أحد التحديثات
      for (const update of deducted) {
        await Product.updateOne(
          { _id: update.productId },
          { $inc: { countInStock: update.quantityToDeduct } }
        );
      }

      if (stockError.message === 'INSUFFICIENT_STOCK') {
        return res.status(400).json({ message: 'الكمية المطلوبة غير متوفرة حالياً' });
      }

      throw stockError;
    }

    // إنشاء الطلب بالأسعار المحسوبة على الخادم
    const order = new Order({
      user: req.user.id,
      items: calculatedItems,
      totalAmount: totalAmount, // المجموع المحسوب على الخادم بأمان
      shippingAddress,
      phone
    });

    // حفظ الطلب بعد خصم المخزون بنجاح
    await order.save();

    await order.populate('items.product');

    res.status(201).json({
      message: 'تم إنشاء الطلب بنجاح وتم تحديث المخزون',
      order
    });
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
