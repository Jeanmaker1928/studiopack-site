import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Download, Grip, Clock, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BenefitCard from '@/components/BenefitCard';
import BannerCarousel from '@/components/BannerCarousel';
import PackCard from '@/components/PackCard';
import { packs } from '@/data/PacksData';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPacks = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return null;
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

  const featuredSlugs = ['lendas-do-basquete', 'lendas-do-futebol', 'lendas-do-rock'];
  const displayPacks = filteredPacks || packs.filter(p => featuredSlugs.includes(p.slug));

  const benefits = [
    { icon: Zap, title: 'Alta resolução', description: 'Todas as artes em 300 DPI, formato A3, prontas para impressão profissional em qualquer tamanho.' },
    { icon: Download, title: 'Pronto para estampar', description: 'Arquivos otimizados em PNG e PSD editável. Basta baixar e começar a produzir seus produtos.' },
    { icon: Grip, title: 'Técnica Halftone', description: 'Pontos que simulam tons contínuos. Estampas mais leves, respiráveis e sem o aspecto emborrachado.' },
    { icon: Clock, title: 'Download imediato', description: 'Acesso instantâneo após a compra. Receba o link do Google Drive direto no seu email.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-background border-b border-primary/20 pt-8 pb-12">
        <BannerCarousel />
      </section>

      {/* Packs Principais */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="w-full lg:w-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight font-heading">
                Packs <span className="text-primary">Principais</span>
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mt-3 text-lg">As coleções mais vendidas para sua marca</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-72 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] h-5 w-5" />
                <input 
                  type="text"
                  placeholder="Buscar packs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 bg-[hsl(var(--secondary)/0.5)] border border-primary/20 focus:ring-2 focus:ring-primary focus:outline-none text-base rounded-xl w-full text-white placeholder:text-[hsl(var(--muted-foreground))]"
                />
              </div>
              <Link to="/packs" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold uppercase tracking-widest px-8 py-4 text-base transition-all duration-300 shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] rounded-lg">
                  Ver Todos
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 lg:gap-10">
            {displayPacks.map((pack, index) => (
              <motion.div key={pack.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="h-full">
                <PackCard pack={pack} showBuyButton={true} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-[hsl(var(--secondary)/0.3)] border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight font-heading">
              Por que escolher <span className="text-primary">Studio Pack</span>
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mx-auto leading-relaxed">
              Qualidade profissional e praticidade para seus projetos
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <BenefitCard {...benefit} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
