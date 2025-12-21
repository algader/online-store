import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      
      // استخراج الفئات الفريدة
      const uniqueCategories = ['all', ...new Set(response.data.map(p => p.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'all': t('home.allCategories'),
      'الإلكترونيات': t('home.electronics'),
      'الكاميرات': t('home.cameras'),
      'الإكسسوارات': t('home.accessories'),
      'الألعاب': t('home.games')
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return <div className="loading">{t('home.loading') || 'Loading...'}</div>;
  }

  return (
    <div className="container">
      <h2 style={{ margin: '20px 0', color: '#2c3e50' }}>{t('home.title')}</h2>
      
      {/* فلتر الفئات */}
      <div style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap',
        alignItems: 'center' 
      }}>
        <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{t('home.filterByCategory') || 'تصفية حسب الفئة:'}:</span>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '8px 20px',
              border: selectedCategory === category ? 'none' : '2px solid #3498db',
              backgroundColor: selectedCategory === category ? '#3498db' : 'white',
              color: selectedCategory === category ? 'white' : '#3498db',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
              transition: 'all 0.3s',
              fontSize: '0.95rem'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category) {
                e.target.style.backgroundColor = '#ecf0f1';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category) {
                e.target.style.backgroundColor = 'white';
              }
            }}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>

      {/* عداد المنتجات */}
      <div style={{ 
        marginBottom: '20px', 
        color: '#7f8c8d',
        fontSize: '0.95rem'
      }}>
        {t('home.showing') || 'عرض'} {filteredProducts.length} {t('home.of') || 'من'} {products.length} {t('home.products') || 'منتج'}
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#7f8c8d'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{t('home.noProducts') || 'لا توجد منتجات في هذه الفئة'}</p>
          <p>{t('home.tryAnother') || 'جرب فئة أخرى'}</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
