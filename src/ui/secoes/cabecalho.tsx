import Image from 'next/image';
import { linkWhatsApp, LOJA } from '@/core/loja/loja';
import { Icone } from '../componentes/icone';
import { MenuDoSite } from './menu-do-site';

const SECOES = [
  { destino: '#destaques', texto: 'Destaques' },
  { destino: '#como-comprar', texto: 'Como comprar' },
  { destino: '#a-loja', texto: 'A loja' },
  { destino: '#onde-estamos', texto: 'Onde estamos' },
] as const;

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-50 border-b border-creme/10 bg-preto/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <a href="#topo" className="flex min-w-0 items-center gap-3">
          <Image
            src="/assets/logo.jpg"
            alt=""
            width={48}
            height={48}
            className="size-11 shrink-0 rounded-full object-cover sm:size-12"
            priority
          />
          <span className="min-w-0">
            <span className="block font-titulo text-lg tracking-wide uppercase sm:text-xl">{LOJA.nome}</span>
            <span className="mt-0.5 block truncate font-mono text-[9px] tracking-[0.18em] text-cinza uppercase sm:text-[10px]">
              {LOJA.chamada} · {LOJA.cidade} — {LOJA.estado}
            </span>
          </span>
        </a>

        <nav className="hidden gap-7 lg:flex">
          {SECOES.map(({ destino, texto }) => (
            <a
              key={destino}
              href={destino}
              className="text-[15px] font-semibold tracking-[0.14em] text-creme/80 uppercase transition hover:text-creme"
            >
              {texto}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2.5 rounded-full bg-vermelho px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-vermelho-claro lg:inline-flex"
          >
            <Icone nome="whatsapp" className="size-[1.1em]" />
            Chamar no WhatsApp
          </a>

          <MenuDoSite secoes={SECOES} />
        </div>
      </div>
    </header>
  );
}
