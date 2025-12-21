import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('❌ فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const validateAdminForm = () => {
    const errors = {};

    if (!newAdminData.name || newAdminData.name.length < 2) {
      errors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    }

    if (!newAdminData.email) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(newAdminData.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!newAdminData.password || newAdminData.password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (newAdminData.password !== newAdminData.confirmPassword) {
      errors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (!validateAdminForm()) {
      return;
    }

    setLoading(true);
    try {
      // إنشاء حساب مشرف جديد
      await api.post('/auth/register', {
        name: newAdminData.name,
        email: newAdminData.email,
        password: newAdminData.password,
        role: 'admin'
      });

      alert('✅ تم إنشاء حساب المشرف بنجاح!');
      setShowAddAdminForm(false);
      setNewAdminData({ name: '', email: '', password: '', confirmPassword: '' });
      setFormErrors({});
      fetchUsers();
    } catch (error) {
      console.error('Error creating admin:', error);
      const message = error.response?.data?.message || 'فشل في إنشاء الحساب';
      if (message.includes('موجود')) {
        alert('❌ البريد الإلكتروني مستخدم بالفعل');
      } else {
        alert('❌ ' + message);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId, userName, userRole) => {
    if (userRole === 'admin') {
      alert('⚠️ لا يمكن حذف حساب المشرف!');
      return;
    }

    if (window.confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟\nسيتم حذف جميع بيانات المستخدم وطلباته!`)) {
      setLoading(true);
      try {
        await api.delete(`/users/${userId}`);
        alert('✅ تم حذف المستخدم بنجاح');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('❌ حدث خطأ أثناء الحذف');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('ar-SA', options);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({ ...newAdminData, [name]: value });
    
    // إزالة الخطأ عند الكتابة
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // فلترة المستخدمين
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h3>👥 إدارة المستخدمين</h3>
          <p className="admin-subtitle">عرض وإدارة جميع المستخدمين المسجلين وإنشاء حسابات مشرفين جدد</p>
        </div>
        <button
          className={showAddAdminForm ? "btn btn-secondary" : "btn btn-success"}
          onClick={() => {
            setShowAddAdminForm(!showAddAdminForm);
            if (showAddAdminForm) {
              setNewAdminData({ name: '', email: '', password: '', confirmPassword: '' });
              setFormErrors({});
            }
          }}
          disabled={loading}
        >
          {showAddAdminForm ? '❌ إلغاء' : '👑 إضافة مشرف جديد'}
        </button>
      </div>

      {/* نموذج إضافة مشرف */}
      {showAddAdminForm && (
        <div className="admin-form-container">
          <h4>👑 إنشاء حساب مشرف جديد</h4>
          <p className="form-note">⚠️ حساب المشرف له صلاحيات كاملة على النظام</p>
          <form onSubmit={handleAddAdmin} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>الاسم الكامل <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={newAdminData.name}
                  onChange={handleFormChange}
                  placeholder="اسم المشرف"
                  className={formErrors.name ? 'input-error' : ''}
                />
                {formErrors.name && (
                  <span className="error-message">⚠️ {formErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={newAdminData.email}
                  onChange={handleFormChange}
                  placeholder="admin@example.com"
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && (
                  <span className="error-message">⚠️ {formErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>كلمة المرور <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={newAdminData.password}
                  onChange={handleFormChange}
                  placeholder="••••••••"
                  className={formErrors.password ? 'input-error' : ''}
                />
                {formErrors.password && (
                  <span className="error-message">⚠️ {formErrors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label>تأكيد كلمة المرور <span className="required">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newAdminData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="••••••••"
                  className={formErrors.confirmPassword ? 'input-error' : ''}
                />
                {formErrors.confirmPassword && (
                  <span className="error-message">⚠️ {formErrors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? '⏳ جاري الإنشاء...' : '✅ إنشاء حساب المشرف'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddAdminForm(false);
                  setNewAdminData({ name: '', email: '', password: '', confirmPassword: '' });
                  setFormErrors({});
                }}
                disabled={loading}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* إحصائيات */}
      <div className="users-stats">
        <div className="stat-card">
          <span className="stat-label">المجموع</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-card admin-stat">
          <span className="stat-label">مشرفين</span>
          <span className="stat-value">{adminCount}</span>
        </div>
        <div className="stat-card user-stat">
          <span className="stat-label">مستخدمين</span>
          <span className="stat-value">{userCount}</span>
        </div>
      </div>

      <div className="admin-list-container">
        <div className="list-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 بحث عن مستخدم (اسم، بريد إلكتروني، هاتف)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">جميع المستخدمين</option>
              <option value="admin">المشرفين فقط</option>
              <option value="user">المستخدمين فقط</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>لا توجد نتائج</h3>
            <p>{searchTerm ? 'لم يتم العثور على مستخدمين مطابقين' : 'لا يوجد مستخدمين'}</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>المستخدم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الدور</th>
                  <th>معلومات الاتصال</th>
                  <th>تاريخ التسجيل</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className={user.role === 'admin' ? 'admin-row' : ''}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                          {user.role === 'admin' && <span className="admin-badge">👑</span>}
                        </div>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {user.role === 'admin' ? '🔐 مشرف' : '👤 مستخدم'}
                      </span>
                    </td>
                    <td>
                      <div className="contact-info">
                        {user.address && (
                          <div className="contact-item">
                            <small>📍 {user.address}</small>
                          </div>
                        )}
                        {user.phone && (
                          <div className="contact-item">
                            <small>📞 {user.phone}</small>
                          </div>
                        )}
                        {!user.address && !user.phone && (
                          <span className="no-info">لا توجد معلومات</span>
                        )}
                      </div>
                    </td>
                    <td className="date-cell">
                      <div className="date-info">
                        <div>{formatDate(user.createdAt)}</div>
                        <small>{new Date(user.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</small>
                      </div>
                    </td>
                    <td>
                      {user.role === 'admin' ? (
                        <button 
                          className="btn-icon btn-disabled"
                          title="لا يمكن حذف المشرف"
                          disabled
                        >
                          🔒
                        </button>
                      ) : (
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => deleteUser(user._id, user.name, user.role)}
                          title="حذف المستخدم"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className="table-footer">
            <p>عرض {filteredUsers.length} من {users.length} مستخدم</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
