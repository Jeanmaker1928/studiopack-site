import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import PacksPage from './pages/PacksPage';
import PackDetailPage from './pages/PackDetailPage';
import AboutPage from './pages/AboutPage';
import SuccessPage from './pages/SuccessPage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/packs" element={<PacksPage />} />
          <Route path="/pack/:slug" element={<PackDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/sucesso" element={<SuccessPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
