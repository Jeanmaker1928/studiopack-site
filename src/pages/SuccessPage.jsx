import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SuccessPage = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-grow flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="text-primary w-20 h-20" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tighter font-heading mb-4">
          Compra <span className="text-primary">Confirmada!</span>
        </h1>

        <p className="text-[hsl(var(--muted-foreground))] text-lg mb-6 leading-relaxed">
          Obrigado pela sua compra! Seu pack está a caminho.
        </p>

        <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-xl p-5 mb-10 text-left">
          <Mail className="text-primary w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-bold text-sm mb-1">Verifique seu email</p>
            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
              Os PDFs com os links de acesso foram enviados para o email que você informou no checkout. Pode levar até 5 minutos para chegar.
            </p>
          </div>
        </div>

        <Link to="/packs">
          <button className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-all duration-300">
            Ver Mais Packs
          </button>
        </Link>
      </motion.div>
    </main>
    <Footer />
  </div>
);

export default SuccessPage;
