import React, { useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPackBySlug } from '@/data/PacksData';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const packSlug = searchParams.get('pack');
  const pack = getPackBySlug(packSlug);

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packSlug }),
    });
    const data = await res.json();
    return data.clientSecret;
  }, [packSlug]);

  const options = { fetchClientSecret };

  if (!packSlug || !pack) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Pack não encontrado</h2>
            <Link to="/packs">
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all">
                Voltar para Packs
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Link
            to={`/pack/${packSlug}`}
            className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors mb-6 uppercase tracking-wider text-sm font-bold"
          >
            <ArrowLeft size={16} />
            Voltar para {pack.title}
          </Link>

          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
