import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { ArrowLeft, ShoppingBag, Zap, Tag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { packs } from '@/data/PacksData';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { mainSlug, bumpSlug, items, total, formatBRL, addToCart, selectOrderBump, removeOrderBump, PRICE_BUMP } = useCart();
  const [step, setStep] = useState('review'); // 'review' | 'payment'
  const [sessionItems, setSessionItems] = useState(null);

  // Packs disponíveis para order bump (todos exceto o pack principal)
  const bumpOptions = packs.filter(p => p.isAvailable && p.slug !== mainSlug);

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: sessionItems }),
    });
    const data = await res.json();
    return data.clientSecret;
  }, [sessionItems]);

  const handleGoToPayment = () => {
    setSessionItems(items);
    setStep('payment');
  };

  // Carrinho vazio
  if (!mainSlug) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <ShoppingBag className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Seu carrinho está vazio</h2>
            <Link to="/packs">
              <button className="bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-all">
                Ver Packs
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mainPack = packs.find(p => p.slug === mainSlug);
  const bumpPack  = bumpSlug ? packs.find(p => p.slug === bumpSlug) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">

          {/* Voltar */}
          {step === 'review' ? (
            <button
              onClick={() => navigate(`/pack/${mainSlug}`)}
              className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors mb-6 uppercase tracking-wider text-sm font-bold"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          ) : (
            <button
              onClick={() => setStep('review')}
              className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors mb-6 uppercase tracking-wider text-sm font-bold"
            >
              <ArrowLeft size={16} />
              Editar pedido
            </button>
          )}

          <AnimatePresence mode="wait">

            {/* ─── ETAPA 1: REVISÃO ─── */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tighter font-heading mb-6">
                  Seu Pedido
                </h1>

                {/* Item principal */}
                <div className="bg-[hsl(var(--secondary)/0.3)] rounded-xl border border-primary/10 p-4 mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={mainPack?.coverImage}
                      alt={mainPack?.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{mainPack?.title}</p>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">{mainPack?.artCount}</p>
                    </div>
                    <p className="text-primary font-bold text-lg flex-shrink-0">
                      {formatBRL(64.90 * 100)}
                    </p>
                  </div>
                </div>

                {/* Order Bump */}
                <div className="border border-primary/40 rounded-xl overflow-hidden mb-6">
                  <div className="bg-primary/10 px-4 py-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-primary font-bold text-sm uppercase tracking-wide">
                      Oferta especial — 50% OFF no 2º pack
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    {bumpOptions.map(pack => {
                      const selected = bumpSlug === pack.slug;
                      return (
                        <label
                          key={pack.slug}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selected
                              ? 'border-primary bg-primary/5'
                              : 'border-white/10 hover:border-primary/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selected}
                            onChange={() => selected ? removeOrderBump() : selectOrderBump(pack.slug)}
                          />
                          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                            selected ? 'bg-primary border-primary' : 'border-white/30'
                          }`}>
                            {selected && <CheckCircle2 className="w-3 h-3 text-black" />}
                          </div>
                          <img
                            src={pack.coverImage}
                            alt={pack.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{pack.title}</p>
                            <p className="text-[hsl(var(--muted-foreground))] text-xs">{pack.artCount}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-primary font-bold">{formatBRL(PRICE_BUMP)}</p>
                            <p className="text-[hsl(var(--muted-foreground))] text-xs line-through">R$ 64,90</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Cupom */}
                <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] text-sm mb-6 bg-[hsl(var(--secondary)/0.2)] rounded-lg px-4 py-3 border border-white/5">
                  <Tag className="w-4 h-4 flex-shrink-0" />
                  <span>Tem um cupom de desconto? Insira na próxima etapa.</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-6 px-1">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-primary font-extrabold text-2xl">{formatBRL(total)}</span>
                </div>

                {/* CTA */}
                <button
                  onClick={handleGoToPayment}
                  className="w-full bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest py-5 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  Ir para pagamento →
                </button>
              </motion.div>
            )}

            {/* ─── ETAPA 2: PAGAMENTO ─── */}
            {step === 'payment' && sessionItems && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tighter font-heading mb-6">
                  Pagamento
                </h1>
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
