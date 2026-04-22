import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ZOOM = 6;
const CIRCLE_RADIUS = 80;

const calcBgPos = (pct) =>
  ((pct / 100 - 1 / (2 * ZOOM)) / (1 - 1 / ZOOM)) * 100;

const HINT_STYLES = `
  @keyframes hint-press {
    0%, 100% { transform: translateY(0px) scale(1); }
    25%, 60% { transform: translateY(10px) scale(0.9); }
  }
  @keyframes hint-ripple {
    0%   { transform: scale(0.4); opacity: 0.7; }
    100% { transform: scale(2.2); opacity: 0; }
  }
`;

const ZoomHint = () => (
  <motion.div
    key="hint"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl overflow-hidden md:hidden pointer-events-none"
  >
    <style>{HINT_STYLES}</style>
    {/* Fundo amarelo semitransparente */}
    <div className="absolute inset-0 bg-primary/30" />
    {/* Retícula sobre o fundo */}
    <div className="absolute inset-0 halftone-overlay opacity-40" />

    <p className="relative z-10 text-white font-extrabold text-xs uppercase tracking-widest text-center px-4 font-heading"
       style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)' }}>
      Segure para dar zoom
    </p>

    {/* Ícone de dedo com animação de pressionar */}
    <div className="relative z-10 flex items-center justify-center w-16 h-16">
      {/* Ripple 1 */}
      <div
        className="absolute w-10 h-10 rounded-full bg-black/25"
        style={{ animation: 'hint-ripple 2s ease-out infinite' }}
      />
      {/* Ripple 2 defasado */}
      <div
        className="absolute w-10 h-10 rounded-full bg-black/15"
        style={{ animation: 'hint-ripple 2s ease-out 0.7s infinite' }}
      />
      {/* Dedo indicador levantado */}
      <div style={{ animation: 'hint-press 2s ease-in-out infinite' }}>
        <svg width="30" height="30" viewBox="0 0 64 80" fill="white" stroke="black" strokeWidth="2" strokeLinejoin="round">
          {/* Dedo indicador */}
          <rect x="26" y="4" width="12" height="36" rx="6" />
          {/* Palma / mão fechada */}
          <rect x="14" y="34" width="36" height="28" rx="10" />
          {/* Dedos fechados (indicação visual) */}
          <line x1="14" y1="44" x2="50" y2="44" strokeWidth="1.5" stroke="black" opacity="0.3"/>
        </svg>
      </div>
    </div>
  </motion.div>
);

const VerticalGalleryCarousel = ({ images, title, isAvailable, currentIndex, onIndexChange, onHover }) => {
  const [mobileZoom, setMobileZoom] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef(null);
  const isTouchingRef = useRef(false);
  const hasDiscoveredRef = useRef(false);
  const hintTimersRef = useRef([]);

  // Bloqueia scroll ao tocar na imagem
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const block = (e) => { if (isTouchingRef.current) e.preventDefault(); };
    el.addEventListener('touchmove', block, { passive: false });
    return () => el.removeEventListener('touchmove', block);
  }, []);

  // Ciclo da dica: aguarda 2s → mostra 4s → oculta 4s → repete
  // Reseta toda vez que o usuário entra na página (sem localStorage)
  useEffect(() => {
    const clearTimers = () => {
      hintTimersRef.current.forEach(clearTimeout);
      hintTimersRef.current = [];
    };

    const schedule = (delay) => {
      if (hasDiscoveredRef.current) return;
      const t1 = setTimeout(() => {
        if (hasDiscoveredRef.current) return;
        setShowHint(true);
        const t2 = setTimeout(() => {
          setShowHint(false);
          schedule(4000);
        }, 4000);
        hintTimersRef.current.push(t2);
      }, delay);
      hintTimersRef.current.push(t1);
    };

    schedule(2000);
    return clearTimers;
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
    const xPct = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setMobileZoom({
      clientX: touch.clientX,
      clientY: touch.clientY,
      bgX: calcBgPos(xPct),
      bgY: calcBgPos(yPct),
    });
  };

  const handleTouchStart = (e) => {
    isTouchingRef.current = true;
    // Marca como descoberto e para o ciclo
    if (!hasDiscoveredRef.current) {
      hasDiscoveredRef.current = true;
      setShowHint(false);
      hintTimersRef.current.forEach(clearTimeout);
      hintTimersRef.current = [];
    }
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
            className={`img-standard transition-all duration-500 ${!isAvailable ? 'blur-[8px] opacity-60' : ''} ${showHint ? 'blur-[3px] md:blur-0' : ''}`}
          />
          <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />

          {/* Dica de zoom — apenas mobile, some ao tocar */}
          <AnimatePresence>
            {showHint && <ZoomHint />}
          </AnimatePresence>

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

      {/* Círculo de zoom mobile — fixed no viewport, acima do dedo */}
      {mobileZoom && (
        <div
          className="fixed z-50 rounded-full overflow-hidden border-4 border-primary/70 shadow-2xl pointer-events-none"
          style={{
            width: CIRCLE_RADIUS * 2,
            height: CIRCLE_RADIUS * 2,
            left: mobileZoom.clientX - CIRCLE_RADIUS,
            top: mobileZoom.clientY - CIRCLE_RADIUS * 2 - 24,
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: `${ZOOM * 100}%`,
            backgroundPosition: `${mobileZoom.bgX}% ${mobileZoom.bgY}%`,
            backgroundColor: 'black',
          }}
        />
      )}

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
