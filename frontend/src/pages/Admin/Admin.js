import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const Admin = () => {
  const location = useLocation();

  return (
    <div className="container">
      <h2 style={{ margin: '20px 0' }}>لوحة تحكم المشرف</h2>
      <div className="admin-dashboard">
        <div className="admin-sidebar">
          <nav>
            <Link 
              to="/admin/products" 
              className={location.pathname === '/admin/products' ? 'active' : ''}
            >
              إدارة المنتجات
            </Link>
            <Link 
              to="/admin/orders"
              className={location.pathname === '/admin/orders' ? 'active' : ''}
            >
              إدارة الطلبات
            </Link>
            <Link 
              to="/admin/users"
              className={location.pathname === '/admin/users' ? 'active' : ''}
            >
              إدارة المستخدمين
            </Link>
          </nav>
        </div>
        <div className="admin-content">
          <Routes>
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<AdminProducts />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
