import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">🛍️ متجرنا الإلكتروني</h3>
          <p className="footer-description">
            نحن متجر إلكتروني متخصص في بيع أفضل المنتجات الإلكترونية والكاميرات والإكسسوارات والألعاب. 
            نقدم لعملائنا أجود المنتجات بأسعار منافسة مع خدمة توصيل سريعة وموثوقة.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">روابط سريعة</h4>
          <ul className="footer-links">
            <li><a href="/">الرئيسية</a></li>
            <li><a href="/cart">عربة التسوق</a></li>
            <li><a href="/orders">طلباتي</a></li>
            <li><a href="/login">تسجيل الدخول</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">الفئات</h4>
          <ul className="footer-links">
            <li><a href="/?category=إلكترونيات">إلكترونيات</a></li>
            <li><a href="/?category=كاميرات">كاميرات</a></li>
            <li><a href="/?category=إكسسوارات">إكسسوارات</a></li>
            <li><a href="/?category=ألعاب">ألعاب</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">تواصل معنا</h4>
          <ul className="footer-contact">
            <li>
              <span className="contact-icon">📧</span>
              <a href="mailto:info@ourstore.com">info@ourstore.com</a>
            </li>
            <li>
              <span className="contact-icon">📱</span>
              <a href="tel:+966123456789">+966 12 345 6789</a>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span>الرياض، المملكة العربية السعودية</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">تابعنا</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <i className="social-icon">📘</i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
              <i className="social-icon">🐦</i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <i className="social-icon">📷</i>
            </a>
            <a href="https://wa.me/966123456789" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
              <i className="social-icon">💬</i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {currentYear} متجرنا الإلكتروني. جميع الحقوق محفوظة.
        </p>
        <div className="footer-bottom-links">
          <a href="/privacy">سياسة الخصوصية</a>
          <span className="separator">|</span>
          <a href="/terms">شروط الاستخدام</a>
          <span className="separator">|</span>
          <a href="/returns">سياسة الإرجاع</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
