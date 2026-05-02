import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const PRICE_FULL = 6490;  // R$ 64,90
export const PRICE_BUMP = 3245;  // R$ 32,45

export const CartProvider = ({ children }) => {
  const [mainSlug, setMainSlug] = useState(null);
  const [bumpSlug, setBumpSlug] = useState(null);

  const addToCart = (slug) => {
    setMainSlug(slug);
    setBumpSlug(null);
  };

  const selectOrderBump = (slug) => setBumpSlug(slug);
  const removeOrderBump = () => setBumpSlug(null);
  const clearCart = () => { setMainSlug(null); setBumpSlug(null); };

  const items = [
    ...(mainSlug ? [{ slug: mainSlug, price: PRICE_FULL }] : []),
    ...(bumpSlug ? [{ slug: bumpSlug, price: PRICE_BUMP }] : []),
  ];

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;

  const formatBRL = (cents) =>
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <CartContext.Provider value={{
      mainSlug, bumpSlug,
      items, total, count,
      addToCart, selectOrderBump, removeOrderBump, clearCart,
      formatBRL, PRICE_FULL, PRICE_BUMP,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
