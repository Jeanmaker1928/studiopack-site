import React, { useState } from 'react';

const VerticalGalleryCarousel = ({ images, title, isAvailable, currentIndex, onIndexChange, onHover }) => {
  const [touchStartX, setTouchStartX] = useState(null);

  const nextImage = () => onIndexChange((currentIndex + 1) % images.length);
  const prevImage = () => onIndexChange((currentIndex - 1 + images.length) % images.length);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onHover?.(true, x, y);
  };

  const handleMouseLeave = () => onHover?.(false, 50, 50);

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
    setTouchStartX(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <button onClick={prevImage} aria-label="Anterior" className="flex-shrink-0 text-white/30 hover:text-primary transition-colors duration-200">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <div
          className="relative flex-1 aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 bg-[hsl(var(--secondary)/0.2)] p-4 flex items-center justify-center cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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

        <button onClick={nextImage} aria-label="Próxima" className="flex-shrink-0 text-white/30 hover:text-primary transition-colors duration-200">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div className="flex w-full gap-2 justify-between">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onIndexChange(idx)}
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
