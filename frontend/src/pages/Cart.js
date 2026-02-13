import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('❌ السلة فارغة');
      return;
    }

    if (!shippingAddress || !phone) {
      alert('⚠️ يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        shippingAddress,
        phone
      };

      await api.post('/orders', orderData);
      clearCart();
      alert('✅ تم إنشاء الطلب بنجاح!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ حدث خطأ أثناء إنشاء الطلب: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      if (window.confirm('هل تريد حذف هذا المنتج من السلة؟')) {
        removeFromCart(itemId);
      }
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    if (window.confirm(`هل تريد حذف "${itemName}" من السلة؟`)) {
      removeFromCart(itemId);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>السلة فارغة</h2>
          <p>لم تضف أي منتجات بعد</p>
          <button 
            className="btn" 
            onClick={() => navigate('/')}
            style={{ marginTop: '20px' }}
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px' }}>🛒 سلة التسوق</h2>
      
      <div className="cart-layout">
        {/* قائمة المنتجات */}
        <div className="cart-items-section">
          <h3>المنتجات ({cart.length})</h3>
          
          {cart.map(item => (
            <div key={item._id} className="cart-item-detailed">
              <div className="cart-item-image">
                <img 
                  src={item.image} 
                  alt={item.name}
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              
              <div className="cart-item-details">
                <h4 
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </h4>
                <p className="cart-item-category">{item.category}</p>
                <p className="cart-item-price">{item.price.toLocaleString()} ريال</p>
              </div>

              <div className="cart-item-quantity">
                <label>الكمية:</label>
                <div className="quantity-controls-cart">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                    min="1"
                    className="quantity-input"
                  />
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-subtotal">
                <span className="subtotal-label">المجموع:</span>
                <span className="subtotal-value">
                  {(item.price * item.quantity).toLocaleString()} ريال
                </span>
              </div>

              <button 
                className="cart-item-remove"
                onClick={() => handleRemoveItem(item._id, item.name)}
                title="حذف من السلة"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* ملخص الطلب */}
        <div className="cart-summary">
          <h3>ملخص الطلب</h3>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>عدد المنتجات:</span>
              <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="summary-row">
              <span>المجموع الفرعي:</span>
              <span>{getTotalPrice().toLocaleString()} ريال</span>
            </div>
            <div className="summary-row">
              <span>الشحن:</span>
              <span className="free-shipping">مجاني</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>المجموع الكلي:</span>
              <span>{getTotalPrice().toLocaleString()} ريال</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="checkout-form">
            <h4>معلومات التوصيل</h4>
            
            <div className="form-group">
              <label>عنوان التوصيل *</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                placeholder="أدخل عنوان التوصيل الكامل (المدينة، الحي، الشارع، رقم المنزل)"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>رقم الهاتف *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="0501234567 oder +49123456789"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-success btn-checkout"
              disabled={loading}
            >
              {loading ? '⏳ جاري المعالجة...' : '✅ إتمام الطلب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
