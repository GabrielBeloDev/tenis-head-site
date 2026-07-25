import Image from 'next/image';
import { linkWhatsApp, LOJA, URL_INSTAGRAM } from '@/core/loja/loja';
import { Icone } from '../componentes/icone';

export function ChamadaFinal() {
  return (
    <section className="mx-auto mt-16 max-w-[1280px] px-5 sm:px-8 lg:mt-22 lg:px-12">
      <div className="flex flex-col items-start justify-between gap-8 bg-creme px-6 py-12 text-preto sm:px-10 lg:flex-row lg:items-center lg:px-12 lg:py-16">
        <div>
          <h2 className="titulo-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9]">
            Achou seu par?
            <br />
            <span className="text-vermelho">Chama agora.</span>
          </h2>
          <p className="mt-4 max-w-md text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-[#57534e]">
            Respondemos rápido no WhatsApp com foto real, tamanhos disponíveis e valor já com
            desconto.
          </p>
        </div>

        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-preto px-8 py-5 text-[17px] font-bold text-white transition hover:-translate-y-0.5 lg:w-auto"
        >
          <Icone nome="whatsapp" className="size-[1.2em]" />
          WhatsApp {LOJA.telefone}
        </a>
      </div>
    </section>
  );
}

export function Rodape() {
  const links = [
    { destino: linkWhatsApp(), icone: 'whatsapp', texto: 'WhatsApp' },
    { destino: URL_INSTAGRAM, icone: 'instagram', texto: LOJA.instagram },
    { destino: LOJA.linkBio, icone: 'link', texto: 'fans.link/tenishead' },
  ] as const;

  return (
    <footer>
      {/* Bottom padding clears the fixed CTA, which would otherwise sit on top of these links at max scroll. */}
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5 px-5 pt-8 pb-28 font-mono text-xs tracking-[0.1em] text-cinza uppercase sm:px-8 lg:px-12">
        <span className="flex items-center gap-3">
          <Image src="/assets/logo.jpg" alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
          {LOJA.nome} · {LOJA.chamada} · {LOJA.cidade} — {LOJA.estado}
        </span>

        <span className="flex flex-wrap gap-5">
          {links.map(({ destino, icone, texto }) => (
            <a
              key={texto}
              href={destino}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 transition hover:text-creme"
            >
              <Icone nome={icone} className="size-[1.1em]" />
              {texto}
            </a>
          ))}
        </span>
      </div>
      <div className="faixa-listrada" />
    </footer>
  );
}

