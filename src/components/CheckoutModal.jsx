import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

const CheckoutModal = ({ packSlug, onClose }) => {
  const [iframeUrl, setIframeUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packSlug }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setIframeUrl(data.url);
        else setError('Não foi possível abrir o checkout. Tente novamente.');
      })
      .catch(() => setError('Erro de conexão. Tente novamente.'));
  }, [packSlug]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <span className="text-sm font-semibold text-gray-700">Finalizar Compra</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 relative">
            {!iframeUrl && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={onClose}
                    className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {iframeUrl && (
              <iframe
                src={iframeUrl}
                className="w-full h-full border-0"
                title="Checkout"
                allow="payment"
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
