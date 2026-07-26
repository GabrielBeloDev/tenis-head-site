'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icone } from '../componentes/icone';

type Destino = Readonly<{ href: string; texto: string; desenho: string }>;

const DESTINOS: readonly Destino[] = [
  { href: '/admin', texto: 'Vitrine', desenho: 'M4 5h6v6H4V5zm10 0h6v6h-6V5zM4 13h6v6H4v-6zm10 0h6v6h-6v-6z' },
  { href: '/admin/novo', texto: 'Adicionar par', desenho: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z' },
];

function IconeDoDestino({ desenho }: Readonly<{ desenho: string }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6 shrink-0">
      <path d={desenho} />
    </svg>
  );
}

function Conteudo({ email, aoNavegar = () => {} }: Readonly<{ email: string; aoNavegar?: () => void }>) {
  const caminho = usePathname();

  return (
    <div className="flex h-full flex-col gap-2 p-5">
      <p className="font-titulo text-xl uppercase">Painel</p>
      <p className="mb-4 truncate font-mono text-[10px] tracking-wide text-cinza uppercase">{email}</p>

      {DESTINOS.map(({ href, texto, desenho }) => (
        <Link
          key={href}
          href={href}
          onClick={aoNavegar}
          aria-current={caminho === href ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-semibold transition ${
            caminho === href ? 'bg-vermelho text-white' : 'text-creme/70 hover:bg-carvao hover:text-creme'
          }`}
        >
          <IconeDoDestino desenho={desenho} />
          {texto}
        </Link>
      ))}

      <a
        href="/"
        target="_blank"
        rel="noopener"
        onClick={aoNavegar}
        className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-semibold text-creme/70 transition hover:bg-carvao hover:text-creme"
      >
        <Icone nome="seta" className="size-5" />
        Ver o site
      </a>
    </div>
  );
}

export function NavegacaoLateral({ email }: Readonly<{ email: string }>) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-creme/10 lg:block">
      <div className="sticky top-0 h-dvh">
        <Conteudo email={email} />
      </div>
    </aside>
  );
}

export function BotaoDoMenu({ email }: Readonly<{ email: string }>) {
  const [aberto, setAberto] = useState(false);
  const [montado, setMontado] = useState(false);
  const caminho = usePathname();

  useEffect(() => setMontado(true), []);

  useEffect(() => setAberto(false), [caminho]);

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
        aria-label="Abrir menu do painel"
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
            className="absolute inset-0 bg-preto/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-creme/15 bg-preto shadow-2xl">
            <Conteudo email={email} aoNavegar={() => setAberto(false)} />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
