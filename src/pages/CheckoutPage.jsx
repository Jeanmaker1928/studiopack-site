import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { ArrowLeft, ShoppingBag, Zap, Tag, CheckCircle2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { packs } from '@/data/PacksData';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    mainSlug, bumpSlugs, coupon,
    items, subtotal, discount, total,
    toggleOrderBump, applyCoupon, removeCoupon,
    formatBRL, PRICE_BUMP,
  } = useCart();

  const [step, setStep] = useState('review');
  const [sessionItems, setSessionItems] = useState(null);
  const [sessionPromoId, setSessionPromoId] = useState(null);

  // Cupom
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const bumpOptions = packs.filter(p => p.isAvailable && p.slug !== mainSlug);
  const mainPack = packs.find(p => p.slug === mainSlug);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        applyCoupon(data);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Cupom inválido');
      }
    } catch {
      setCouponError('Erro ao validar cupom. Tente novamente.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleGoToPayment = () => {
    setSessionItems(items);
    setSessionPromoId(coupon?.promoId ?? null);
    setStep('payment');
  };

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: sessionItems,
        promotionCodeId: sessionPromoId,
      }),
    });
    const data = await res.json();
    return data.clientSecret;
  }, [sessionItems, sessionPromoId]);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">

          {step === 'review' ? (
            <button
              onClick={() => navigate(`/pack/${mainSlug}`)}
              className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors mb-6 uppercase tracking-wider text-sm font-bold"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          ) : (
            <button
              onClick={() => setStep('review')}
              className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors mb-6 uppercase tracking-wider text-sm font-bold"
            >
              <ArrowLeft size={16} /> Editar pedido
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

                {/* Pack principal */}
                <div className="bg-[hsl(var(--secondary)/0.3)] rounded-xl border border-primary/10 p-4 mb-4">
                  <div className="flex items-center gap-4">
                    <img src={mainPack?.coverImage} alt={mainPack?.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{mainPack?.title}</p>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">{mainPack?.artCount}</p>
                    </div>
                    <p className="text-primary font-bold text-lg flex-shrink-0">{formatBRL(6490)}</p>
                  </div>
                </div>

                {/* Order Bump */}
                {bumpOptions.length > 0 && (
                  <div className="border border-primary/40 rounded-xl overflow-hidden mb-4">
                    <div className="bg-primary/10 px-4 py-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-primary font-bold text-sm uppercase tracking-wide">
                        Oferta especial — 50% OFF em outros packs
                      </p>
                    </div>
                    <div className="p-4 space-y-3">
                      {bumpOptions.map(pack => {
                        const selected = bumpSlugs.includes(pack.slug);
                        return (
                          <label
                            key={pack.slug}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              selected ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/40'
                            }`}
                          >
                            <div
                              onClick={() => toggleOrderBump(pack.slug)}
                              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                                selected ? 'bg-primary border-primary' : 'border-white/30'
                              }`}
                            >
                              {selected && <CheckCircle2 className="w-3 h-3 text-black" />}
                            </div>
                            <img src={pack.coverImage} alt={pack.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onClick={() => toggleOrderBump(pack.slug)} />
                            <div className="flex-1 min-w-0" onClick={() => toggleOrderBump(pack.slug)}>
                              <p className="text-white font-semibold text-sm truncate">{pack.title}</p>
                              <p className="text-[hsl(var(--muted-foreground))] text-xs">{pack.artCount}</p>
                            </div>
                            <div className="text-right flex-shrink-0" onClick={() => toggleOrderBump(pack.slug)}>
                              <p className="text-primary font-bold">{formatBRL(PRICE_BUMP)}</p>
                              <p className="text-[hsl(var(--muted-foreground))] text-xs line-through">R$ 64,90</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Cupom */}
                <div className="bg-[hsl(var(--secondary)/0.2)] rounded-xl border border-white/5 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="text-white font-bold text-sm uppercase tracking-wide">Cupom de desconto</span>
                  </div>

                  {coupon ? (
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-primary font-bold text-sm">{coupon.name}</p>
                        <p className="text-[hsl(var(--muted-foreground))] text-xs">
                          {coupon.percentOff ? `${coupon.percentOff}% de desconto` : `${formatBRL(coupon.amountOff)} de desconto`}
                        </p>
                      </div>
                      <button onClick={removeCoupon} className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="SEUCUPOM"
                        className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-[hsl(var(--muted-foreground))] text-sm focus:outline-none focus:border-primary/50 uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-primary text-black font-bold px-4 py-2.5 rounded-lg text-sm uppercase tracking-wide hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                </div>

                {/* Totais */}
                <div className="space-y-2 mb-6 px-1">
                  <div className="flex items-center justify-between text-[hsl(var(--muted-foreground))]">
                    <span>Subtotal</span>
                    <span>{formatBRL(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-primary">
                      <span>Desconto ({coupon?.name})</span>
                      <span>− {formatBRL(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-white font-extrabold text-xl pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-primary">{formatBRL(total)}</span>
                  </div>
                </div>

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
