import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packs', path: '/packs' },
    { name: 'Sobre', path: '/about' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png"
              alt="Studio Pack Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-wider transition-all duration-200 relative group ${
                  isActive(link.path) ? 'text-primary' : 'text-white hover:text-primary'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-200 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                onClick={() => navigate('/checkout')}
                className="relative p-2 text-white hover:text-primary transition-colors"
                aria-label="Carrinho"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              </button>
            )}
            <button
              className="md:hidden p-2 text-white hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-primary/20">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-primary border-l-2 border-primary pl-3'
                    : 'text-white hover:text-primary pl-3'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
