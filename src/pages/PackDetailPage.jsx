import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { getPackBySlug, packSpecificContent } from '@/data/PacksData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerticalGalleryCarousel from '@/components/VerticalGalleryCarousel';
import CheckoutModal from '@/components/CheckoutModal';

const PackDetailPage = () => {
  const { slug } = useParams();
  const pack = getPackBySlug(slug);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (pack) window.scrollTo(0, 0);
  }, [pack]);

  const handleHover = (hovering, x, y) => {
    setIsHovering(hovering);
    if (hovering) setMousePos({ x, y });
  };

  if (!pack) {
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

  const content = packSpecificContent[pack.slug] || packSpecificContent['lendas-do-futebol'];
  const displayImages = pack.galleryImages?.length > 0 ? pack.galleryImages : [pack.coverImage];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/packs" className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors mb-6 md:mb-10 uppercase tracking-wider text-sm font-bold">
            <ArrowLeft size={16} />
            Voltar para Packs
          </Link>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Info panel */}
            <div className="w-full md:w-1/2 order-2 md:order-1 relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {isHovering ? (
                  <motion.div
                    key="zoom"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    {(() => {
                      const zoom = 3;
                      const bgX = ((mousePos.x / 100 - 1 / (2 * zoom)) / (1 - 1 / zoom)) * 100;
                      const bgY = ((mousePos.y / 100 - 1 / (2 * zoom)) / (1 - 1 / zoom)) * 100;
                      return (
                        <div
                          className="w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full overflow-hidden border-4 border-primary/60 shadow-2xl shadow-primary/20"
                          style={{
                            backgroundImage: `url(${displayImages[currentIndex]})`,
                            backgroundSize: `${zoom * 100}%`,
                            backgroundPosition: `${bgX}% ${bgY}%`,
                            backgroundColor: 'black',
                          }}
                        />
                      );
                    })()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col"
                  >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 uppercase tracking-tighter font-heading">
                      {pack.title}
                    </h1>

                    <div className="mb-4 md:mb-6 flex flex-wrap gap-3">
                      <span className="bg-primary text-black font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wide inline-flex items-center">
                        {pack.artCount}
                      </span>
                      {!pack.isAvailable && (
                        <span className="border border-[hsl(var(--muted-foreground)/0.3)] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] font-semibold text-sm py-1.5 px-4 uppercase tracking-wider rounded-full">
                          Em Breve
                        </span>
                      )}
                    </div>

                    <p className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl mb-10 md:mb-14 leading-relaxed">
                      {pack.description}
                    </p>

                    <div className="mb-2 md:mb-10 pb-6 md:pb-10 border-b border-primary/20">
                      <div className={`text-4xl md:text-5xl font-bold mb-6 md:mb-8 font-heading ${pack.isAvailable ? 'text-primary' : 'text-[hsl(var(--muted-foreground))]'}`}>
                        {pack.price}
                      </div>
                      {pack.isAvailable ? (
                        <button
                          className="w-full bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest py-4 md:py-5 text-base md:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 rounded-lg"
                          onClick={() => setShowCheckout(true)}
                        >
                          Comprar Agora
                        </button>
                      ) : (
                        <button disabled className="w-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest py-4 md:py-5 text-base md:text-lg cursor-not-allowed rounded-lg">
                          Disponível em Breve
                        </button>
                      )}
                    </div>

                    {pack.benefits && pack.benefits.length > 0 && (
                      <div className="space-y-4 bg-[hsl(var(--secondary)/0.3)] p-5 md:p-6 rounded-xl border border-primary/10 mt-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 font-heading">
                          O que está incluído:
                        </h3>
                        {pack.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-[hsl(var(--muted-foreground))]">
                            <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-sm md:text-base">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full md:w-1/2 order-1 md:order-2">
              <VerticalGalleryCarousel
                images={displayImages}
                title={pack.title}
                isAvailable={pack.isAvailable}
                currentIndex={currentIndex}
                onIndexChange={setCurrentIndex}
                onHover={handleHover}
              />
            </motion.div>
          </div>

          {/* Extra Content */}
          <div className="mt-12 md:mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-[hsl(var(--secondary)/0.2)] rounded-2xl p-6 md:p-8 lg:p-12 border border-primary/10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-tight font-heading">
                Sobre este pack
              </h2>

              <div className="mb-8 md:mb-12">
                <h3 className="text-lg md:text-xl font-bold text-primary mb-4 leading-snug">
                  {content.title}
                </h3>
                <div className="space-y-4 text-[hsl(var(--muted-foreground))] text-base md:text-lg leading-relaxed mb-6">
                  {content.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}
                </div>
                <ul className="space-y-3 mb-6 ml-2">
                  {content.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[hsl(var(--muted-foreground))] text-sm md:text-base">
                      <span className="text-primary font-bold mt-1.5">•</span>
                      <span><strong className="text-white">{bullet.title}:</strong> {bullet.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[hsl(var(--muted-foreground))] text-base md:text-lg leading-relaxed italic border-l-2 border-primary/30 pl-4">
                  {content.conclusion}
                </p>
              </div>

              <div className="bg-background p-6 md:p-8 rounded-xl border border-primary/20 relative overflow-hidden">
                <Sparkles className="absolute top-4 right-4 text-primary/20 h-16 w-16 md:h-24 md:w-24" />
                <h3 className="text-lg md:text-xl font-bold mb-4 text-primary uppercase tracking-wider font-heading">
                  Como funciona o halftone?
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] text-sm md:text-base leading-relaxed relative z-10">
                  O halftone (ou retícula) é uma técnica que utiliza pequenos pontos para simular tons contínuos. Na estamparia, ele <strong className="text-white">quebra áreas chapadas</strong> da arte, resultando em uma estampa muito mais leve e com <strong className="text-white">melhor respirabilidade</strong> na camiseta. Além de proporcionar transições visuais mais suaves, reduz drasticamente o aspecto "emborrachado" e pesado das impressões tradicionais.
                </p>
              </div>

              {pack.isAvailable && (
                <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 bg-primary/5 p-5 md:p-6 rounded-xl border border-primary/20">
                  <p className="text-base md:text-lg font-medium text-white text-center sm:text-left">
                    Pronto para começar? Clique em Comprar abaixo.
                  </p>
                  <button
                    className="bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest px-6 md:px-8 py-4 w-full sm:w-auto rounded-lg transition-all"
                    onClick={() => setShowCheckout(true)}
                  >
                    Comprar Agora
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {showCheckout && (
        <CheckoutModal
          packSlug={slug}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default PackDetailPage;
