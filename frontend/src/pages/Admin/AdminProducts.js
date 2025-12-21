import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('❌ فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (formData.price <= 0) {
      alert('⚠️ السعر يجب أن يكون أكبر من صفر');
      return;
    }

    if (formData.stock < 0) {
      alert('⚠️ المخزون لا يمكن أن يكون سالباً');
      return;
    }

    setLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        alert('✅ تم تحديث المنتج بنجاح');
      } else {
        await api.post('/products', formData);
        alert('✅ تم إضافة المنتج بنجاح');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ حدث خطأ: ' + (error.response?.data?.message || 'فشل في حفظ المنتج'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: ''
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج "${name}"؟\nلا يمكن التراجع عن هذا الإجراء!`)) {
      setLoading(true);
      try {
        await api.delete(`/products/${id}`);
        alert('✅ تم حذف المنتج بنجاح');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ حدث خطأ أثناء الحذف');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  // فلترة المنتجات حسب البحث
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h3>📦 إدارة المنتجات</h3>
          <p className="admin-subtitle">إضافة وتعديل وحذف المنتجات من المتجر</p>
        </div>
        <button 
          className={showForm ? "btn btn-secondary" : "btn btn-primary"}
          onClick={() => {
            if (showForm) {
              handleCancelEdit();
            } else {
              setShowForm(true);
              setEditingProduct(null);
              resetForm();
            }
          }}
          disabled={loading}
        >
          {showForm ? '❌ إلغاء' : '➕ إضافة منتج جديد'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-container">
          <h4>{editingProduct ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}</h4>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>اسم المنتج <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: آيفون 13 برو"
                  required
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label>الفئة <span className="required">*</span></label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">-- اختر الفئة --</option>
                  <option value="إلكترونيات">إلكترونيات</option>
                  <option value="كاميرات">كاميرات</option>
                  <option value="إكسسوارات">إكسسوارات</option>
                  <option value="ألعاب">ألعاب</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>الوصف <span className="required">*</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف تفصيلي للمنتج..."
                required
                rows="4"
                maxLength="500"
              />
              <small>{formData.description.length}/500 حرف</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>السعر (ريال) <span className="required">*</span></label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="999"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>المخزون <span className="required">*</span></label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>رابط الصورة</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="معاينة" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? '⏳ جاري الحفظ...' : (editingProduct ? '💾 تحديث المنتج' : '✅ إضافة المنتج')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} disabled={loading}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list-container">
        <div className="list-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 بحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="products-count">
            عدد المنتجات: <strong>{filteredProducts.length}</strong>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>لا توجد منتجات</h3>
            <p>{searchTerm ? 'لم يتم العثور على نتائج' : 'ابدأ بإضافة منتجات جديدة'}</p>
          </div>
        ) : (
          <div className="products-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الصورة</th>
                  <th>الاسم</th>
                  <th>الفئة</th>
                  <th>السعر</th>
                  <th>المخزون</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="table-product-image"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                      />
                    </td>
                    <td>
                      <div className="product-name-cell">
                        <strong>{product.name}</strong>
                        <small>{product.description?.substring(0, 50)}...</small>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td className="price-cell">{product.price} ريال</td>
                    <td>
                      <span className={`stock-badge ${product.stock > 10 ? 'stock-good' : product.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                        {product.stock > 0 ? `${product.stock} قطعة` : 'نفذ'}
                      </span>
                    </td>
                    <td>
                      {product.stock > 0 ? (
                        <span className="status-active">✅ متاح</span>
                      ) : (
                        <span className="status-inactive">❌ غير متاح</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-edit" 
                          onClick={() => handleEdit(product)}
                          title="تعديل"
                          disabled={loading}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon btn-delete" 
                          onClick={() => handleDelete(product._id, product.name)}
                          title="حذف"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
