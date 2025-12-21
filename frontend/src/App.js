import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import Admin from './pages/Admin/Admin';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Returns from './pages/Returns';


const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, token } = React.useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/returns" element={<Returns />} />
            <Route 
              path="/cart" 
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute adminOnly={true}>
                  <Admin />
                </PrivateRoute>
              } 
            />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
