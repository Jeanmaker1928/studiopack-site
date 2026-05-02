import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getPackBySlug } from '@/data/PacksData';

const CartDrawer = () => {
  const {
    cartItems, removeFromCart, isCartOpen, setIsCartOpen,
    getTotal, getItemPrice, formatBRL, clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
      });
      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error(err);
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[hsl(var(--card))] border-l border-primary/20 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-primary w-5 h-5" />
                <h2 className="text-white font-bold uppercase tracking-wider text-sm font-heading">
                  Carrinho
                  {cartItems.length > 0 && (
                    <span className="ml-2 bg-primary text-black text-xs font-black px-1.5 py-0.5 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-20">
                  <ShoppingCart className="text-white/20 w-16 h-16" />
                  <p className="text-[hsl(var(--muted-foreground))] text-sm">
                    Seu carrinho está vazio.<br />Adicione um pack para começar.
                  </p>
                </div>
              ) : (
                <>
                  {cartItems.length > 1 && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 text-xs text-primary font-bold text-center">
                      ⚡ Packs extras com 50% OFF aplicado!
                    </div>
                  )}
                  {cartItems.map((slug, index) => {
                    const pack = getPackBySlug(slug);
                    if (!pack) return null;
                    const price = getItemPrice(index);
                    return (
                      <div
                        key={slug}
                        className="flex items-center gap-3 bg-[hsl(var(--secondary)/0.3)] rounded-xl p-3 border border-primary/10"
                      >
                        <img
                          src={pack.coverImage}
                          alt={pack.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{pack.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-primary font-bold text-sm">{formatBRL(price)}</span>
                            {index > 0 && (
                              <span className="text-white/40 line-through text-xs">{formatBRL(6490)}</span>
                            )}
                            {index > 0 && (
                              <span className="bg-primary/20 text-primary text-[9px] font-black px-1 py-0.5 rounded uppercase">50% off</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(slug)}
                          className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-5 py-4 border-t border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))] text-sm font-medium uppercase tracking-wider">Total</span>
                  <span className="text-primary text-2xl font-bold font-heading">{formatBRL(getTotal())}</span>
                </div>
                {cartItems.length > 1 && (
                  <p className="text-[hsl(var(--muted-foreground))] text-xs text-right">
                    Você economizou {formatBRL(6490 * cartItems.length - getTotal())}!
                  </p>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {isCheckingOut ? 'Aguarde...' : 'Finalizar Compra'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
