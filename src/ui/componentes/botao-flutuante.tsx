'use client';

import { useEffect, useState } from 'react';
import { linkWhatsApp } from '@/core/loja/loja';
import { Icone } from './icone';

export function BotaoFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('section');
    if (hero === null) return;

    // Enquanto o hero está na tela o botão é redundante e pousa em cima do CTA de lá.
    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(entrada !== undefined && !entrada.isIntersecting),
      { threshold: 0.25 },
    );

    observador.observe(hero);
    return () => observador.disconnect();
  }, []);

  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener"
      aria-hidden={!visivel}
      tabIndex={visivel ? undefined : -1}
      className={`fixed right-4 bottom-4 z-60 inline-flex items-center gap-2.5 rounded-full bg-vermelho px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_18px_40px_-12px_rgba(224,27,34,0.6)] transition duration-300 hover:bg-vermelho-claro sm:right-7 sm:bottom-7 ${
        visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Icone nome="whatsapp" className="size-5" />
      <span className="sr-only sm:not-sr-only">Chamar no WhatsApp</span>
    </a>
  );
}
