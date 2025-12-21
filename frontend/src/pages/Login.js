import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // التحقق من صحة المدخلات
  const validateForm = () => {
    const newErrors = {};

    // التحقق من البريد الإلكتروني
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // إزالة رسالة الخطأ عند الكتابة
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // التحقق من المدخلات قبل الإرسال
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      login(response.data.token, response.data.user);
      
      // رسالة نجاح
      alert('✅ تم تسجيل الدخول بنجاح!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      setServerError(message);
      
      // رسائل خطأ مخصصة
      if (error.response?.status === 400) {
        setServerError('⚠️ البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (error.response?.status === 404) {
        setServerError('❌ المستخدم غير موجود. يرجى إنشاء حساب جديد');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>تسجيل الدخول</h2>
          <p>أدخل بياناتك للوصول إلى حسابك</p>
        </div>

        {serverError && (
          <div className="alert alert-error">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              البريد الإلكتروني <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="example@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">⚠️ {errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              كلمة المرور <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">⚠️ {errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? '⏳ جاري تسجيل الدخول...' : '🔐 تسجيل الدخول'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ليس لديك حساب؟{' '}
            <Link to="/register" className="auth-link">
              سجل الآن
            </Link>
          </p>
        </div>

        <div className="demo-accounts">
          <p className="demo-title">🎯 حسابات تجريبية:</p>
          <div className="demo-item">
            <strong>مشرف:</strong> admin@store.com / admin123
          </div>
          <div className="demo-item">
            <strong>مستخدم:</strong> user@test.com / user123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
