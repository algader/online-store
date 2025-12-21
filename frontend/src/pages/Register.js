import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

 
  const validateForm = () => {
    const newErrors = {};

  
    if (!formData.name) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.name.length < 2) {
      newErrors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    } else if (formData.name.length > 50) {
      newErrors.name = 'الاسم يجب أن يكون أقل من 50 حرف';
    }

  
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

  
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    } else if (formData.password.length > 100) {
      newErrors.password = 'كلمة المرور طويلة جداً';
    }

    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    

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

   
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
     
      login(response.data.token, response.data.user);
      
  
      alert('🎉 تم إنشاء الحساب بنجاح! مرحباً بك');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      
     
      if (message.includes('موجود')) {
        setServerError('❌ البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد آخر');
      } else if (error.response?.status === 400) {
        setServerError('⚠️ البيانات المدخلة غير صالحة. يرجى المحاولة مرة أخرى');
      } else {
        setServerError(`❌ ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };


  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    
    if (password.length < 6) return { text: 'ضعيفة', color: '#e74c3c', width: '33%' };
    if (password.length < 10) return { text: 'متوسطة', color: '#f39c12', width: '66%' };
    return { text: 'قوية', color: '#27ae60', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>إنشاء حساب جديد</h2>
          <p>انضم إلينا وابدأ التسوق الآن</p>
        </div>

        {serverError && (
          <div className="alert alert-error">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              الاسم الكامل <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              placeholder="أدخل اسمك الكامل"
              autoComplete="name"
            />
            {errors.name && (
              <span className="error-message">⚠️ {errors.name}</span>
            )}
          </div>

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
              autoComplete="new-password"
            />
            {passwordStrength && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div 
                    className="password-strength-fill"
                    style={{ 
                      width: passwordStrength.width, 
                      backgroundColor: passwordStrength.color 
                    }}
                  />
                </div>
                <span style={{ color: passwordStrength.color, fontSize: '0.85rem' }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
            {errors.password && (
              <span className="error-message">⚠️ {errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              تأكيد كلمة المرور <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="error-message">⚠️ {errors.confirmPassword}</span>
            )}
            {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className="success-message">✅ كلمات المرور متطابقة</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? '⏳ جاري إنشاء الحساب...' : '🎉 إنشاء حساب'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="auth-link">
              سجل الدخول
            </Link>
          </p>
        </div>

        <div className="auth-note">
          <p>📝 ملاحظة: بإنشاء حساب، سيتم تسجيل دخولك تلقائياً</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
