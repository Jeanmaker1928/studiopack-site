import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const PRICE_FULL = 6490;  // R$ 64,90
export const PRICE_BUMP = 3245;  // R$ 32,45

export const CartProvider = ({ children }) => {
  const [mainSlug, setMainSlug] = useState(null);
  const [bumpSlugs, setBumpSlugs] = useState([]);   // múltiplos bumps
  const [coupon, setCouponState] = useState(null);  // { code, promoId, percentOff, amountOff }

  const addToCart = (slug) => {
    setMainSlug(slug);
    setBumpSlugs([]);
    setCouponState(null);
  };

  const toggleOrderBump = (slug) => {
    setBumpSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const applyCoupon = (couponData) => setCouponState(couponData);
  const removeCoupon = () => setCouponState(null);
  const clearCart = () => { setMainSlug(null); setBumpSlugs([]); setCouponState(null); };

  const items = [
    ...(mainSlug ? [{ slug: mainSlug, price: PRICE_FULL }] : []),
    ...bumpSlugs.map(s => ({ slug: s, price: PRICE_BUMP })),
  ];

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);

  const discount = coupon
    ? coupon.percentOff
      ? Math.round(subtotal * coupon.percentOff / 100)
      : coupon.amountOff ?? 0
    : 0;

  const total = Math.max(0, subtotal - discount);
  const count = items.length;

  const formatBRL = (cents) =>
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <CartContext.Provider value={{
      mainSlug, bumpSlugs, coupon,
      items, subtotal, discount, total, count,
      addToCart, toggleOrderBump, applyCoupon, removeCoupon, clearCart,
      formatBRL, PRICE_FULL, PRICE_BUMP,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
