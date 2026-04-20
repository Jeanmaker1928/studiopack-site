import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackCard from '@/components/PackCard';
import { packs } from '@/data/PacksData';

const PacksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPacks = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return packs;
    let results = packs.filter(pack => {
      if (pack.title.toLowerCase().includes(term)) return true;
      if (pack.description.toLowerCase().includes(term)) return true;
      const isMusicTerm = term.includes('música') || term.includes('musica') || term.includes('banda') || term.includes('cantor') || term.includes('rock') || term.includes('pop');
      if (isMusicTerm) {
        const musicSlugs = ['lendas-do-rock', 'cantores-e-bandas-brasileiras', 'lendas-do-k-pop', 'icones-da-musica-internacional'];
        if (musicSlugs.includes(pack.slug)) return true;
      }
      return false;
    });
    if (results.length === 0) return packs.slice(0, 3);
    return results;
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 uppercase tracking-tighter font-heading">
              Nossos <span className="text-primary">Packs</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Escolha a coleção perfeita para elevar o nível dos seus produtos com artes exclusivas e prontas para impressão.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] h-5 w-5" />
              <input 
                type="text"
                placeholder="Buscar packs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 bg-[hsl(var(--secondary)/0.5)] border border-primary/20 focus:ring-2 focus:ring-primary focus:outline-none text-lg rounded-xl w-full text-white placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPacks.map((pack, index) => (
              <motion.div key={pack.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }} className="h-full">
                <PackCard pack={pack} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PacksPage;
