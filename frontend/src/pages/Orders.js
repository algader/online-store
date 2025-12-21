import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'badge-pending', icon: '⏳', text: 'قيد الانتظار' },
      processing: { class: 'badge-processing', icon: '⚙️', text: 'قيد المعالجة' },
      shipped: { class: 'badge-shipped', icon: '🚚', text: 'تم الشحن' },
      delivered: { class: 'badge-delivered', icon: '✅', text: 'تم التسليم' },
      cancelled: { class: 'badge-cancelled', icon: '❌', text: 'ملغي' }
    };

    const statusInfo = statusMap[status] || statusMap.pending;

    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.icon} {statusInfo.text}
      </span>
    );
  };

  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('ar-SA', options);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل الطلبات...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>📦 طلباتي</h2>
        <p className="page-subtitle">عرض جميع طلباتك ومتابعة حالتها</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h3>لا توجد طلبات بعد</h3>
          <p>لم تقم بإجراء أي طلبات حتى الآن</p>
          <a href="/" className="btn btn-primary">تصفح المنتجات</a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header" onClick={() => toggleOrderDetails(order._id)}>
                <div className="order-info">
                  <div className="order-number">
                    <strong>رقم الطلب:</strong> #{order._id.substring(0, 10)}
                  </div>
                  <div className="order-date">
                    📅 {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="order-summary">
                  <div className="order-status">
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="order-total">
                    <strong>{order.totalAmount.toFixed(2)} ريال</strong>
                  </div>
                  <button className="expand-btn">
                    {expandedOrder === order._id ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="order-details">
                  <div className="order-section">
                    <h4>📦 المنتجات المشتراة ({order.items.length})</h4>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-image">
                            {item.product?.image ? (
                              <img src={item.product.image} alt={item.product?.name} />
                            ) : (
                              <div className="no-image">📦</div>
                            )}
                          </div>
                          <div className="item-details">
                            <div className="item-name">{item.product?.name || 'منتج محذوف'}</div>
                            <div className="item-price">
                              {item.price} ريال × {item.quantity}
                            </div>
                          </div>
                          <div className="item-total">
                            {(item.price * item.quantity).toFixed(2)} ريال
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-section">
                    <h4>📍 معلومات الشحن</h4>
                    <div className="shipping-info">
                      <div className="info-row">
                        <span className="info-label">العنوان:</span>
                        <span className="info-value">{order.shippingAddress?.address}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">المدينة:</span>
                        <span className="info-value">{order.shippingAddress?.city}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">الرمز البريدي:</span>
                        <span className="info-value">{order.shippingAddress?.postalCode}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">رقم الهاتف:</span>
                        <span className="info-value">{order.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-section">
                    <h4>💰 ملخص الطلب</h4>
                    <div className="order-summary-details">
                      <div className="summary-row">
                        <span>المجموع الفرعي:</span>
                        <span>{order.totalAmount.toFixed(2)} ريال</span>
                      </div>
                      <div className="summary-row">
                        <span>الشحن:</span>
                        <span className="free-shipping">مجاني</span>
                      </div>
                      <div className="summary-row total-row">
                        <strong>المجموع الإجمالي:</strong>
                        <strong className="total-amount">{order.totalAmount.toFixed(2)} ريال</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
