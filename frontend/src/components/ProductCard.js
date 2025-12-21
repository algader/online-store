import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    
    if (!user) {
      alert(t('product.loginRequired') || 'يرجى تسجيل الدخول أولاً');
      return;
    }
    if (product.stock === 0) {
      alert(t('product.unavailable') || 'المنتج غير متوفر حالياً');
      return;
    }
    addToCart(product);
    alert(t('product.addedSuccess') || '✅ تمت إضافة المنتج إلى السلة بنجاح');
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />

        {/* شارة الفئة */}
        <div className="category-badge-card">
          {product.category}
        </div>

        {/* شارة نفاد المخزون */}
        {product.stock === 0 && (
          <div className="out-of-stock-badge">
            {t('product.outOfStock')}
          </div>
        )}
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description">
          {product.description}
        </p>
        
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-amount">{product.price.toLocaleString()}</span>
            <span className="price-currency">{t('product.price')}</span>
          </div>
          <div className={`product-card-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${t('product.available')} (${product.stock})` : t('product.outOfStock')}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
        >
          {product.stock === 0 ? `❌ ${t('product.unavailable')}` : `🛒 ${t('product.addToCart')}`}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
