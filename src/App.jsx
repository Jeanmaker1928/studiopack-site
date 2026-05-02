import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import PacksPage from './pages/PacksPage';
import PackDetailPage from './pages/PackDetailPage';
import AboutPage from './pages/AboutPage';
import SuccessPage from './pages/SuccessPage';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/packs" element={<PacksPage />} />
          <Route path="/pack/:slug" element={<PackDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sucesso" element={<SuccessPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
