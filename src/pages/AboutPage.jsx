import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  const values = [
    { icon: Target, title: 'Nossa missão', description: 'Democratizar o acesso a artes de alta qualidade, permitindo que marcas e designers criem produtos únicos sem precisar investir em ilustradores ou designers gráficos.' },
    { icon: Zap, title: 'Qualidade garantida', description: 'Todas as nossas artes são criadas em 300 DPI, formato A3, prontas para impressão profissional. Testadas e aprovadas por designers experientes.' },
    { icon: Users, title: 'Para criadores', description: 'Seja você uma marca iniciante, designer freelancer ou empresa estabelecida, nossos packs foram pensados para economizar seu tempo e acelerar sua produção.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-24 relative">
        <div className="absolute inset-0 halftone-overlay opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-tighter font-heading">
              Sobre a <span className="text-primary">Studio Pack</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-xl leading-relaxed max-w-2xl mx-auto">
              Criamos packs de estampas halftone em alta qualidade para ajudar marcas e designers a economizar tempo e criar produtos incríveis.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-20">
            <div className="bg-[hsl(var(--secondary)/0.5)] border border-primary/30 shadow-2xl shadow-primary/5 rounded-lg">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-primary mb-8 uppercase tracking-tight font-heading">
                  Nossa história
                </h2>
                <div className="space-y-6 text-white/90 leading-relaxed text-lg">
                  <p>A Studio Pack nasceu da necessidade de tornar o design de estampas mais acessível. Percebemos que muitas marcas e designers gastam tempo e recursos criando artes do zero, quando poderiam focar no que realmente importa: construir seus negócios.</p>
                  <p>Nossos packs são cuidadosamente criados por designers experientes, utilizando a técnica halftone que combina estética retrô com qualidade moderna. Cada arte é otimizada para impressão profissional, garantindo resultados impecáveis em camisetas, pôsteres, produtos personalizados e muito mais.</p>
                  <p>Acreditamos que boas ferramentas devem ser acessíveis. Por isso, oferecemos packs completos com licença comercial incluída, permitindo que você use as artes em seus produtos sem preocupações legais ou custos adicionais.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}>
                <div className="bg-[hsl(var(--card))] border-t-4 border-t-primary border border-primary/10 hover:border-primary transition-all duration-300 h-full rounded-lg">
                  <div className="p-8">
                    <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-xl">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider font-heading">{value.title}</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-base leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
