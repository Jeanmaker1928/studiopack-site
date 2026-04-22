import React from 'react';
import { Link } from 'react-router-dom';

const PackCard = ({ pack, showBuyButton = true }) => {
  const isAvailable = pack.isAvailable;

  const CardInner = () => (
    <>
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[hsl(var(--secondary)/0.3)] p-2 sm:p-4 flex items-center justify-center">
        <img
          src={pack.coverImage}
          alt={pack.title}
          className={`img-standard transition-all duration-500 ${
            isAvailable
              ? 'group-hover:scale-105 opacity-90 group-hover:opacity-100 grayscale-[10%] group-hover:grayscale-0'
              : 'blur-[4px] opacity-60 scale-105'
          }`}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300">
            <span className="text-white font-extrabold text-sm sm:text-2xl uppercase tracking-widest drop-shadow-lg font-heading">
              Em Breve
            </span>
          </div>
        )}
      </div>

      {/* Mobile: título + preço compactos */}
      <div className="p-1.5 sm:hidden flex flex-col items-center text-center">
        <h3 className={`text-[11px] font-bold leading-tight line-clamp-2 font-heading ${isAvailable ? 'text-white' : 'text-[hsl(var(--muted-foreground))]'}`}>
          {pack.title}
        </h3>
        <span className={`text-[11px] font-bold mt-0.5 ${isAvailable ? 'text-primary' : 'text-[hsl(var(--muted-foreground))]'}`}>
          {pack.price}
        </span>
      </div>

      {/* Desktop: conteúdo completo */}
      <div className="hidden sm:flex p-6 flex-grow flex-col text-center">
        <h3 className={`text-2xl font-bold mb-3 transition-colors duration-200 font-heading ${isAvailable ? 'text-white group-hover:text-primary' : 'text-[hsl(var(--muted-foreground))]'}`}>
          {pack.title}
        </h3>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${isAvailable ? 'bg-primary/10 text-primary border-primary/30' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted-foreground)/0.3)]'}`}>
            {pack.artCount}
          </span>
        </div>
        <p className="text-[hsl(var(--muted-foreground))] text-sm line-clamp-2 leading-relaxed flex-grow">
          {pack.description}
        </p>
      </div>

      <div className="hidden sm:flex p-6 pt-0 flex-col items-center justify-center border-t border-primary/10 mt-auto gap-4">
        <div className="pt-4">
          <span className={`text-3xl font-bold font-heading ${isAvailable ? 'text-primary' : 'text-[hsl(var(--muted-foreground))]'}`}>
            {pack.price}
          </span>
        </div>
        {showBuyButton && isAvailable && (
          <button className="w-full bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest transition-all duration-300 py-3 rounded-lg text-sm">
            VER DETALHES
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className={`group overflow-hidden bg-[hsl(var(--card))] border-2 transition-all duration-300 flex flex-col h-full rounded-lg ${
      isAvailable
        ? 'border-primary/20 hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer'
        : 'border-[hsl(var(--muted)/0.2)] opacity-80'
    }`}>
      {isAvailable ? (
        <Link to={`/pack/${pack.slug}`} className="block p-1.5 sm:p-4 pb-0 h-full flex flex-col">
          <CardInner />
        </Link>
      ) : (
        <div className="block p-1.5 sm:p-4 pb-0 h-full flex flex-col pointer-events-none">
          <CardInner />
        </div>
      )}
    </div>
  );
};

export default PackCard;
