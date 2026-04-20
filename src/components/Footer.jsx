import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-primary/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img src="https://horizons-cdn.hostinger.com/1a702cbe-827a-4ea2-8590-0cbc11eaf3a2/a645d29f3c459ac733eddfea1f4b01c1.png" alt="Studio Pack Logo" className="h-10 w-auto object-contain mb-6" />
            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed max-w-xs">
              Packs de estampas halftone em alta qualidade para marcas e designers. Pronto para impressão, uso comercial incluído.
            </p>
          </div>

          <div>
            <span className="text-primary font-bold uppercase tracking-wider mb-6 block">Links Rápidos</span>
            <nav className="space-y-3">
              <Link to="/" className="block text-[hsl(var(--muted-foreground))] hover:text-primary text-sm transition-colors duration-200">Home</Link>
              <Link to="/packs" className="block text-[hsl(var(--muted-foreground))] hover:text-primary text-sm transition-colors duration-200">Packs</Link>
              <Link to="/about" className="block text-[hsl(var(--muted-foreground))] hover:text-primary text-sm transition-colors duration-200">Sobre</Link>
            </nav>
          </div>

          <div>
            <span className="text-primary font-bold uppercase tracking-wider mb-6 block">Contato</span>
            <div className="space-y-4">
              <a href="mailto:halftonestudiopack@gmail.com" className="flex items-center text-[hsl(var(--muted-foreground))] hover:text-primary text-sm transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                halftonestudiopack@gmail.com
              </a>
              <div className="flex space-x-5 pt-4">
                <a href="mailto:halftonestudiopack@gmail.com" className="text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors duration-200 bg-[hsl(var(--secondary))] p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <a href="https://www.instagram.com/studi_opack/" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors duration-200 bg-[hsl(var(--secondary))] p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://wa.me/message/QHQX4MKSTS3LA1" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--muted-foreground))] hover:text-primary transition-colors duration-200 bg-[hsl(var(--secondary))] p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[hsl(var(--muted-foreground))] text-sm">
            © 2026 Studio Pack. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-[hsl(var(--muted-foreground))] hover:text-primary text-sm transition-colors duration-200">Política de Privacidade</Link>
            <Link to="#" className="text-[hsl(var(--muted-foreground))] hover:text-primary text-sm transition-colors duration-200">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
