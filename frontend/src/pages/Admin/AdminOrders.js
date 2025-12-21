import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('❌ فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, oldStatus) => {
    if (newStatus === oldStatus) return;

    const statusText = {
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };

    if (window.confirm(`هل تريد تغيير الحالة إلى "${statusText[newStatus]}"؟`)) {
      setLoading(true);
      try {
        await api.put(`/orders/${orderId}/status`, { status: newStatus });
        alert('✅ تم تحديث حالة الطلب بنجاح');
        fetchOrders();
      } catch (error) {
        console.error('Error updating order:', error);
        alert('❌ حدث خطأ أثناء تحديث الحالة');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteOrder = async (orderId, orderNumber) => {
    if (window.confirm(`هل أنت متأكد من حذف الطلب #${orderNumber}؟\nلا يمكن التراجع عن هذا الإجراء!`)) {
      setLoading(true);
      try {
        await api.delete(`/orders/${orderId}`);
        alert('✅ تم حذف الطلب بنجاح');
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('❌ حدث خطأ أثناء الحذف');
      } finally {
        setLoading(false);
      }
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

  // فلترة الطلبات
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.includes(searchTerm) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // إحصائيات
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0)
  };

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h3>📋 إدارة الطلبات</h3>
          <p className="admin-subtitle">عرض جميع طلبات المستخدمين وتحديث حالتها</p>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="orders-stats">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <span className="stat-label">إجمالي الطلبات</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card pending-stat">
          <span className="stat-icon">⏳</span>
          <div>
            <span className="stat-label">قيد الانتظار</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card processing-stat">
          <span className="stat-icon">⚙️</span>
          <div>
            <span className="stat-label">قيد المعالجة</span>
            <span className="stat-value">{stats.processing}</span>
          </div>
        </div>
        <div className="stat-card shipped-stat">
          <span className="stat-icon">🚚</span>
          <div>
            <span className="stat-label">تم الشحن</span>
            <span className="stat-value">{stats.shipped}</span>
          </div>
        </div>
        <div className="stat-card delivered-stat">
          <span className="stat-icon">✅</span>
          <div>
            <span className="stat-label">تم التسليم</span>
            <span className="stat-value">{stats.delivered}</span>
          </div>
        </div>
        <div className="stat-card revenue-stat">
          <span className="stat-icon">💰</span>
          <div>
            <span className="stat-label">إجمالي المبيعات</span>
            <span className="stat-value">{stats.totalRevenue.toFixed(2)} ريال</span>
          </div>
        </div>
      </div>

      <div className="admin-list-container">
        <div className="list-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 بحث برقم الطلب، اسم العميل، أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">جميع الطلبات</option>
              <option value="pending">⏳ قيد الانتظار</option>
              <option value="processing">⚙️ قيد المعالجة</option>
              <option value="shipped">🚚 تم الشحن</option>
              <option value="delivered">✅ تم التسليم</option>
              <option value="cancelled">❌ ملغي</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>لا توجد طلبات</h3>
            <p>{searchTerm ? 'لم يتم العثور على نتائج مطابقة' : 'لا توجد طلبات حتى الآن'}</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order._id} className="order-card admin-order-card">
                <div className="order-header" onClick={() => toggleOrderDetails(order._id)}>
                  <div className="order-info">
                    <div className="order-number">
                      <strong>رقم الطلب:</strong> #{order._id.substring(0, 10)}
                    </div>
                    <div className="order-customer">
                      👤 {order.user?.name} ({order.user?.email})
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
                    <button className="expand-btn" type="button">
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
                      <h4>⚙️ إجراءات الطلب</h4>
                      <div className="order-actions">
                        <div className="status-update">
                          <label>تحديث الحالة:</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value, order.status)}
                            className="status-select"
                            disabled={loading}
                          >
                            <option value="pending">⏳ قيد الانتظار</option>
                            <option value="processing">⚙️ قيد المعالجة</option>
                            <option value="shipped">🚚 تم الشحن</option>
                            <option value="delivered">✅ تم التسليم</option>
                            <option value="cancelled">❌ ملغي</option>
                          </select>
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteOrder(order._id, order._id.substring(0, 10))}
                          disabled={loading}
                        >
                          🗑️ حذف الطلب
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="table-footer">
            <p>عرض {filteredOrders.length} من {orders.length} طلب</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
