import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const PRICE_FULL = 6490;  // R$ 64,90
const PRICE_BUMP = 3245;  // R$ 32,45

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp-cart')) || []; }
    catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sp-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (slug) => {
    if (!cartItems.includes(slug)) {
      setCartItems((prev) => [...prev, slug]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (slug) => {
    setCartItems((prev) => prev.filter((s) => s !== slug));
  };

  const clearCart = () => setCartItems([]);

  // Primeiro pack preço cheio, demais 50% off
  const getItemPrice = (index) => (index === 0 ? PRICE_FULL : PRICE_BUMP);

  const getTotal = () =>
    cartItems.reduce((sum, _, i) => sum + getItemPrice(i), 0);

  const formatBRL = (cents) =>
    `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        getTotal,
        getItemPrice,
        formatBRL,
        PRICE_FULL,
        PRICE_BUMP,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
