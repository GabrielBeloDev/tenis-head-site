import { LOJA, URL_INSTAGRAM } from '@/core/loja/loja';
import { Icone } from '../componentes/icone';
import { VideoDeFundo } from '../componentes/video-de-fundo';

export function ALoja() {
  return (
    <section id="a-loja" className="mx-auto mt-16 max-w-[1280px] px-5 sm:px-8 lg:mt-22 lg:px-12">
      <div className="grid overflow-hidden rounded-2xl border-t border-creme/10 lg:grid-cols-2">
        <div className="relative min-h-80 bg-grafite lg:min-h-[26rem]">
          <VideoDeFundo
            fonte="/assets/dono.mp4"
            poster="/assets/dono-poster.jpg"
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="px-1 py-10 lg:px-10 lg:py-14">
          <p className="rotulo-secao">A loja</p>
          <h2 className="titulo-display mt-4 text-[clamp(2.4rem,4.6vw,4rem)]">
            Uma parede
            <br />
            inteira de
            <br />
            <span className="text-vermelho">par bom</span>
          </h2>

          <p className="mt-5 max-w-lg text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-creme/75">
            A {LOJA.nome} é loja física em {LOJA.cidade}, com uma parede inteira de tênis pra você
            ver, pegar e experimentar antes de levar. Cada par que entra é conferido antes de ir pra
            prateleira, e é isso que sustenta o preço justo com qualidade impecável.
          </p>
          <p className="mt-4 max-w-lg text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-creme/75">
            Atende quem quer um par só e quem monta grade pra revender, com a mesma atenção. Você
            fala direto com quem está na loja, do primeiro oi até o par na sua mão.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-creme/20 px-4 py-2.5 text-[13px] font-semibold">
              <Icone nome="pino" className="size-[1.05em]" />
              {LOJA.endereco.bairro} · {LOJA.cidade} — {LOJA.estado}
            </span>
            <a
              href={URL_INSTAGRAM}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-creme/20 px-4 py-2.5 text-[13px] font-semibold transition hover:border-creme"
            >
              <Icone nome="instagram" className="size-[1.05em]" />
              {LOJA.instagram}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
