const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

// الحصول على جميع المنتجات
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// الحصول على منتج واحد
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// إنشاء منتج جديد (مشرف فقط)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, stock, countInStock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
      countInStock: countInStock || stock || 0  // إذا لم يُحدد، استخدم stock
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// تحديث منتج (مشرف فقط)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, stock, countInStock } = req.body;

    const updateData = { name, description, price, category, image };

    if (typeof stock === 'number') {
      updateData.stock = stock;
    }

    if (typeof countInStock === 'number') {
      updateData.countInStock = countInStock;
    } else if (typeof stock === 'number') {
      // إذا لم يُحدد countInStock، استخدم stock كقيمة افتراضية
      updateData.countInStock = stock;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// حذف منتج (مشرف فقط)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;
