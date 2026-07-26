import { linkWhatsApp, LOJA, URL_INSTAGRAM } from '@/core/loja/loja';
import { Icone } from '../componentes/icone';
import { SeloDeStatus } from '../componentes/status-da-loja';
import { VideoDeFundo } from '../componentes/video-de-fundo';

export function Hero() {
  return (
    <section className="relative flex min-h-[36rem] items-end overflow-hidden lg:min-h-[46rem]">
      <VideoDeFundo
        fonte="/assets/loja.mp4"
        fonteAltaResolucao="/assets/loja-1080.mp4"
        poster="/assets/loja-poster.jpg"
        className="absolute inset-0 size-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-preto/55 via-preto/25 to-preto/95" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-20 pb-10 sm:px-8 lg:px-12 lg:pb-14">
        <SeloDeStatus />

        <h1 className="mt-5 font-titulo text-[clamp(2.75rem,9vw,8rem)] leading-[0.86] tracking-tight uppercase">
          Preço justo,
          <br />
          qualidade <span className="text-vermelho">impecável</span>
        </h1>

        <p className="mt-5 max-w-lg text-[clamp(1rem,1.7vw,1.3rem)] leading-relaxed text-creme/80">
          Do jeito que você merece. Sneakers conferidos par por par — leve um par no varejo ou monte
          sua grade no atacado, e feche direto no WhatsApp.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-vermelho px-7 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-vermelho-claro"
          >
            <Icone nome="whatsapp" className="size-[1.15em]" />
            Ver disponibilidade
          </a>
          <a
            href={URL_INSTAGRAM}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-creme/30 px-7 py-4 text-base font-bold transition hover:-translate-y-0.5 hover:border-creme"
          >
            <Icone nome="instagram" className="size-[1.15em]" />
            {LOJA.instagram}
          </a>
        </div>

        <p className="mt-5 font-mono text-[11px] leading-relaxed tracking-[0.12em] text-creme/60 uppercase sm:text-xs">
          Varejo a partir de 1 par
          <span className="mx-2 text-vermelho-claro">·</span>
          atacado a partir de {LOJA.minimoAtacado}
        </p>
      </div>
    </section>
  );
}
