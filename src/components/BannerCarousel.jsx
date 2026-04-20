import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';

const banners = [
  {
    id: 1,
    title: 'LENDAS DO BASQUETE',
    subtitle: '+80 IMAGENS - R$64,90',
    image: 'https://horizons-cdn.hostinger.com/1a702cbe-827a-4ea2-8590-0cbc11eaf3a2/4a19b6810e661081ed95207c638ab6e0.png',
    link: '/pack/lendas-do-basquete'
  },
  {
    id: 2,
    title: 'LENDAS DO ROCK',
    subtitle: '+80 IMAGENS - R$64,90',
    image: 'https://horizons-cdn.hostinger.com/1a702cbe-827a-4ea2-8590-0cbc11eaf3a2/31bfdc4f92e4e4fbae46aec1945f55d3.png',
    link: '/pack/lendas-do-rock'
  }
];

const BannerCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => { emblaApi.off('select', onSelect); clearInterval(interval); };
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-[1600px] mx-auto">
      <div className="overflow-hidden rounded-none md:rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-[400px] md:h-[500px] lg:h-[600px]">
              <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/75" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight uppercase font-heading">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-2xl text-primary font-bold mb-8 tracking-wider">
                  {banner.subtitle}
                </p>
                <Link to={banner.link}>
                  <button className="bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest px-8 py-4 text-base md:text-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] rounded-lg">
                    VER DETALHES
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button 
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 hidden md:flex items-center justify-center text-white backdrop-blur-sm transition-all"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button 
        onClick={() => emblaApi && emblaApi.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 hidden md:flex items-center justify-center text-white backdrop-blur-sm transition-all"
        aria-label="Próxima"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
