import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import PacksPage from './pages/PacksPage';
import PackDetailPage from './pages/PackDetailPage';
import AboutPage from './pages/AboutPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/packs" element={<PacksPage />} />
        <Route path="/pack/:slug" element={<PackDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sucesso" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
