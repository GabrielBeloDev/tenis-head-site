'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { linkWhatsApp, LOJA, URL_INSTAGRAM } from '@/core/loja/loja';
import { Icone } from '../componentes/icone';

type PropsDoMenu = Readonly<{ secoes: readonly Readonly<{ destino: string; texto: string }>[] }>;

export function MenuDoSite({ secoes }: PropsDoMenu) {
  const [aberto, setAberto] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (evento: KeyboardEvent) => { if (evento.key === 'Escape') setAberto(false); };
    document.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [aberto]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-expanded={aberto}
        aria-label="Abrir menu"
        className="flex size-11 items-center justify-center rounded-xl border border-creme/20 transition hover:border-creme"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6">
          <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
        </svg>
      </button>

      {aberto && montado && createPortal(
        // Rendered on the body: a fixed child of the sticky header stays trapped in its stacking context.
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-preto/80 backdrop-blur-sm"
          />

          <nav className="absolute inset-y-0 right-0 flex w-80 max-w-[88vw] flex-col gap-1 overflow-y-auto border-l border-creme/15 bg-preto p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-titulo text-xl uppercase">Menu</span>
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar menu"
                className="flex size-10 items-center justify-center rounded-xl border border-creme/20 transition hover:border-creme"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                  <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5z" />
                </svg>
              </button>
            </div>

            {secoes.map(({ destino, texto }) => (
              <a
                key={destino}
                href={destino}
                onClick={() => setAberto(false)}
                className="rounded-xl px-4 py-4 font-titulo text-2xl uppercase transition hover:bg-carvao"
              >
                {texto}
              </a>
            ))}

            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener"
              onClick={() => setAberto(false)}
              className="mt-6 flex items-center justify-center gap-2.5 rounded-full bg-vermelho px-6 py-4 font-bold text-white"
            >
              <Icone nome="whatsapp" className="size-5" />
              Chamar no WhatsApp
            </a>

            <a
              href={URL_INSTAGRAM}
              target="_blank"
              rel="noopener"
              onClick={() => setAberto(false)}
              className="mt-3 flex items-center justify-center gap-2.5 rounded-full border border-creme/25 px-6 py-4 font-bold"
            >
              <Icone nome="instagram" className="size-5" />
              {LOJA.instagram}
            </a>

            <p className="mt-6 text-center font-mono text-[10px] leading-relaxed tracking-[0.18em] text-cinza uppercase">
              {LOJA.endereco.rua}
              <br />
              {LOJA.endereco.bairro} · {LOJA.cidade} — {LOJA.estado}
            </p>
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}
