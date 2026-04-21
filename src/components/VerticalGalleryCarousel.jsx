import React, { useState } from 'react';

const VerticalGalleryCarousel = ({ images, title, isAvailable }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <button
          onClick={prevImage}
          aria-label="Anterior"
          className="flex-shrink-0 text-white/30 hover:text-primary transition-colors duration-200"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 bg-[hsl(var(--secondary)/0.2)] p-4 flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={title}
          className={`img-standard transition-all duration-500 ${!isAvailable ? 'blur-[8px] opacity-60' : ''}`}
        />
        <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
            <span className="text-white font-extrabold text-3xl md:text-4xl uppercase tracking-widest drop-shadow-2xl font-heading">
              Em Breve
            </span>
          </div>
        )}
        </div>

        <button
          onClick={nextImage}
          aria-label="Próxima"
          className="flex-shrink-0 text-white/30 hover:text-primary transition-colors duration-200"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div className="flex w-full gap-2 justify-between">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)} 
            className="thumbnail-container flex-1"
            aria-label={`Ver imagem ${idx + 1}`}
          >
            <div className={`thumbnail-inner ${currentIndex === idx ? 'thumbnail-selected' : 'thumbnail-unselected'}`}>
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="img-standard" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VerticalGalleryCarousel;
