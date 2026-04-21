import React, { useState, useRef, useEffect } from 'react';

const ZOOM = 3;
const CIRCLE_RADIUS = 150; // px — raio do círculo de zoom mobile

const calcBgPos = (pct) => {
  // Centraliza o ponto exato do cursor no círculo de zoom
  return ((pct / 100 - 1 / (2 * ZOOM)) / (1 - 1 / ZOOM)) * 100;
};

const VerticalGalleryCarousel = ({ images, title, isAvailable, currentIndex, onIndexChange, onHover }) => {
  const [mobileZoom, setMobileZoom] = useState(null);
  const containerRef = useRef(null);
  const isTouchingRef = useRef(false);

  // Bloqueia o scroll da página enquanto o dedo estiver na imagem
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const block = (e) => { if (isTouchingRef.current) e.preventDefault(); };
    el.addEventListener('touchmove', block, { passive: false });
    return () => el.removeEventListener('touchmove', block);
  }, []);

  const nextImage = () => onIndexChange((currentIndex + 1) % images.length);
  const prevImage = () => onIndexChange((currentIndex - 1 + images.length) % images.length);

  // ── Desktop ──────────────────────────────────────────────
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    onHover?.(true, x, y);
  };
  const handleMouseLeave = () => onHover?.(false, 50, 50);

  // ── Mobile ───────────────────────────────────────────────
  const updateZoom = (touch) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const xPct = Math.max(0, Math.min(100, (touchX / w) * 100));
    const yPct = Math.max(0, Math.min(100, (touchY / h) * 100));

    // Posiciona o círculo acima do dedo, mantendo dentro do container
    const diameter = CIRCLE_RADIUS * 2;
    const gap = 20;
    let cx = Math.max(CIRCLE_RADIUS, Math.min(w - CIRCLE_RADIUS, touchX));
    let cy = Math.max(CIRCLE_RADIUS, Math.min(h - CIRCLE_RADIUS, touchY - diameter - gap));

    setMobileZoom({
      left: cx - CIRCLE_RADIUS,
      top: cy - CIRCLE_RADIUS,
      bgX: calcBgPos(xPct),
      bgY: calcBgPos(yPct),
    });
  };

  const handleTouchStart = (e) => {
    isTouchingRef.current = true;
    updateZoom(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    if (!isTouchingRef.current) return;
    updateZoom(e.touches[0]);
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    setMobileZoom(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <button onClick={prevImage} aria-label="Anterior" className="flex-shrink-0 text-white/30 hover:text-primary transition-colors duration-200">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <div
          ref={containerRef}
          className="relative flex-1 aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 bg-[hsl(var(--secondary)/0.2)] p-4 flex items-center justify-center cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[currentIndex]}
            alt={title}
            className={`img-standard transition-all duration-500 ${!isAvailable ? 'blur-[8px] opacity-60' : ''}`}
          />
          <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />

          {/* Círculo de zoom mobile — flutua acima do dedo */}
          {mobileZoom && (
            <div
              className="absolute z-30 rounded-full overflow-hidden border-4 border-primary/70 shadow-2xl pointer-events-none"
              style={{
                width: CIRCLE_RADIUS * 2,
                height: CIRCLE_RADIUS * 2,
                left: mobileZoom.left,
                top: mobileZoom.top,
                backgroundImage: `url(${images[currentIndex]})`,
                backgroundSize: `${ZOOM * 100}%`,
                backgroundPosition: `${mobileZoom.bgX}% ${mobileZoom.bgY}%`,
                backgroundColor: 'black',
              }}
            />
          )}

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
