'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icone } from '../componentes/icone';

type Destino = Readonly<{ href: string; texto: string; desenho: string }>;

const DESTINOS: readonly Destino[] = [
  { href: '/admin', texto: 'Vitrine', desenho: 'M4 5h6v6H4V5zm10 0h6v6h-6V5zM4 13h6v6H4v-6zm10 0h6v6h-6v-6z' },
  { href: '/admin/novo', texto: 'Adicionar', desenho: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z' },
];

function IconeDoDestino({ desenho }: Readonly<{ desenho: string }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6 shrink-0">
      <path d={desenho} />
    </svg>
  );
}

export function NavegacaoLateral({ email }: Readonly<{ email: string }>) {
  const caminho = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-creme/10 lg:block">
      <div className="sticky top-0 flex h-dvh flex-col gap-2 p-5">
        <p className="font-titulo text-xl uppercase">Painel</p>
        <p className="mb-4 truncate font-mono text-[10px] tracking-wide text-cinza uppercase">{email}</p>

        {DESTINOS.map(({ href, texto, desenho }) => (
          <Link
            key={href}
            href={href}
            aria-current={caminho === href ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
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
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold text-creme/70 transition hover:bg-carvao hover:text-creme"
        >
          <Icone nome="seta" className="size-5" />
          Ver o site
        </a>
      </div>
    </aside>
  );
}

export function NavegacaoInferior() {
  const caminho = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-creme/15 bg-preto/95 backdrop-blur-lg lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {DESTINOS.map(({ href, texto, desenho }) => (
          <Link
            key={href}
            href={href}
            aria-current={caminho === href ? 'page' : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
              caminho === href ? 'text-vermelho-claro' : 'text-creme/60'
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
          className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-creme/60"
        >
          <Icone nome="seta" className="size-6" />
          Ver o site
        </a>
      </div>
    </nav>
  );
}
