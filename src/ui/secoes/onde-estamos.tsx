import { linkWhatsApp, LOJA, URL_MAPA } from '@/core/loja/loja';
import { Icone } from '../componentes/icone';
import { TabelaDeHorarios } from '../componentes/tabela-de-horarios';

const { latitude, longitude } = LOJA.endereco;
const CAIXA_DO_MAPA = [longitude - 0.003, latitude - 0.0015, longitude + 0.003, latitude + 0.0015].join(',');
const URL_OSM = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(CAIXA_DO_MAPA)}&layer=mapnik&marker=${latitude},${longitude}`;

export function OndeEstamos() {
  return (
    <section id="onde-estamos" className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-22">
      <p className="rotulo-secao">Onde estamos</p>
      <h2 className="titulo-display mt-3 mb-8 text-[clamp(2.4rem,6vw,4.25rem)]">Vem conhecer</h2>

      <div className="grid items-start gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-creme/10 bg-carvao">
          {/* No sandbox on purpose: with it the OSM embed ignores the bbox and opens miles out. */}
          <iframe
            title={`Mapa da ${LOJA.nome} na ${LOJA.endereco.rua}`}
            src={URL_OSM}
            loading="lazy"
            className="block h-72 w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.75)_brightness(0.95)] sm:h-[26rem]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-creme/10 px-5 py-3.5">
            <span className="font-mono text-[11px] text-cinza">
              Mapa ©{' '}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" className="underline">
                OpenStreetMap
              </a>
            </span>
            <a
              href={URL_MAPA}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-sm font-bold text-vermelho-claro"
            >
              Traçar rota no Google Maps
              <Icone nome="seta" className="size-[1.1em]" />
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-creme/10 bg-carvao p-6">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cinza uppercase">Endereço</p>
            <p className="mt-2.5 text-[17px] leading-relaxed font-semibold">
              {LOJA.endereco.rua}
              <br />
              {LOJA.endereco.bairro} · {LOJA.cidade} — {LOJA.estado}
              <br />
              CEP {LOJA.endereco.cep}
            </p>
          </div>

          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener"
            className="block rounded-2xl bg-vermelho p-6 text-white transition hover:-translate-y-1"
          >
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <Icone nome="whatsapp" className="size-[1.1em]" />
              WhatsApp
            </span>
            <span className="mt-2.5 block font-titulo text-[clamp(1.5rem,2.6vw,1.9rem)] uppercase">
              {LOJA.telefone}
            </span>
          </a>
        </div>
      </div>

      <TabelaDeHorarios />
    </section>
  );
}
