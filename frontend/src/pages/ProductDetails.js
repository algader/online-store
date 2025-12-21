import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('⚠️ يرجى تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }
    
    if (product.stock === 0) {
      alert('❌ المنتج غير متوفر حالياً');
      return;
    }

    if (quantity > product.stock) {
      alert(`⚠️ الكمية المتوفرة فقط ${product.stock}`);
      return;
    }

    // إضافة المنتج بالكمية المحددة
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    alert(`✅ تمت إضافة ${quantity} من ${product.name} إلى السلة`);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      alert(`⚠️ الحد الأقصى المتوفر ${product.stock}`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>المنتج غير موجود</h2>
        <button className="btn" onClick={() => navigate('/')}>
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#3498db',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        ← العودة
      </button>

      <div className="product-details-container">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
          
          {/* شارة الفئة */}
          <div className="product-category-badge">
            {product.category}
          </div>
          
          {/* شارة نفاد المخزون */}
          {product.stock === 0 && (
            <div className="product-out-of-stock-badge">
              نفذت الكمية
            </div>
          )}
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>
          
          <div className="product-price-large">
            {product.price.toLocaleString()} ريال
          </div>

          <div className="product-stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">
                ✅ متوفر في المخزون ({product.stock} قطعة)
              </span>
            ) : (
              <span className="out-of-stock">
                ❌ غير متوفر حالياً
              </span>
            )}
          </div>

          <div className="product-description-box">
            <h3>وصف المنتج</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-details-section">
            <h4>التصنيف</h4>
            <p>{product.category}</p>
          </div>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>الكمية:</label>
              <div className="quantity-controls">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-actions">
            <button 
              className="btn btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? '❌ غير متوفر' : '🛒 إضافة إلى السلة'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
