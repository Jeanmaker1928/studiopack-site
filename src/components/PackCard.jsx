import React from 'react';
import { Link } from 'react-router-dom';

const PackCard = ({ pack, showBuyButton = true }) => {
  const isAvailable = pack.isAvailable;

  const CardInner = () => (
    <>
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[hsl(var(--secondary)/0.3)] p-4 flex items-center justify-center">
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
            <span className="text-white font-extrabold text-2xl uppercase tracking-widest drop-shadow-lg font-heading">
              Em Breve
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col text-center">
        <h3 className={`text-2xl font-bold mb-3 transition-colors duration-200 font-heading ${isAvailable ? 'text-white group-hover:text-primary' : 'text-[hsl(var(--muted-foreground))]'}`}>
          {pack.title}
        </h3>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${isAvailable ? 'bg-primary/10 text-primary border-primary/30' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted-foreground)/0.3)]'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1.5 -mt-0.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/></svg>
            {pack.artCount}
          </span>
        </div>
        <p className="text-[hsl(var(--muted-foreground))] text-sm line-clamp-2 leading-relaxed flex-grow">
          {pack.description}
        </p>
      </div>

      <div className="p-6 pt-0 flex flex-col items-center justify-center border-t border-primary/10 mt-auto gap-4">
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
        <Link to={`/pack/${pack.slug}`} className="block p-4 pb-0 h-full flex flex-col">
          <CardInner />
        </Link>
      ) : (
        <div className="block p-4 pb-0 h-full flex flex-col pointer-events-none">
          <CardInner />
        </div>
      )}
    </div>
  );
};

export default PackCard;
