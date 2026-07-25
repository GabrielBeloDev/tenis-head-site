import Image from 'next/image';
import { linkWhatsApp, LOJA, URL_INSTAGRAM } from '@/core/loja/loja';
import { etiquetaDoProduto, type Produto } from '@/core/produtos/produto';
import { Icone } from '../componentes/icone';

type PropsDaVitrine = Readonly<{ produtos: readonly Produto[] }>;

export function Vitrine({ produtos }: PropsDaVitrine) {
  return (
    <section id="destaques" className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-22">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="rotulo-secao">Vitrine atualizada pela loja</p>
          <h2 className="titulo-display mt-3 text-[clamp(2.4rem,6vw,4.25rem)]">Chegou na loja</h2>
        </div>
        <p className="max-w-xs text-[15px] leading-relaxed text-creme/60">
          Os pares abaixo são trocados sempre que chega grade nova. Gostou de algum? Toca no card e
          fala com a gente.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {produtos.map((produto, indice) => (
          <a
            key={produto.id}
            href={linkWhatsApp(produto.nome)}
            target="_blank"
            rel="noopener"
            className="group flex flex-col overflow-hidden rounded-2xl border border-creme/10 bg-carvao transition hover:-translate-y-1 hover:border-vermelho"
          >
            <div className="relative bg-grafite">
              <Image
                src={produto.imagem}
                alt={`${produto.marca} ${produto.nome}`}
                width={600}
                height={750}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                priority={indice < 2}
                className="aspect-4/5 w-full object-cover"
              />
              {produto.destaque && indice === 0 && (
                <span className="absolute top-3 left-3 rounded-full bg-vermelho px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-white uppercase">
                  Novidade
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-3.5 sm:p-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-cinza uppercase">
                {etiquetaDoProduto(produto)}
              </span>
              <span className="mt-2 font-titulo text-[clamp(1.15rem,2vw,1.5rem)] leading-tight uppercase">
                {produto.nome}
              </span>
              <span className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                <span className="text-sm font-bold">Consultar valor</span>
                <span className="rounded-full border border-vermelho-claro px-2 py-1.5 font-mono text-[10px] font-bold tracking-wide text-vermelho-claro uppercase">
                  até {LOJA.descontoMaximo}% OFF
                </span>
              </span>
            </div>
          </a>
        ))}

        <a
          href={URL_INSTAGRAM}
          target="_blank"
          rel="noopener"
          className="col-span-2 flex min-h-52 flex-col justify-between gap-5 rounded-2xl bg-gradient-to-br from-vermelho to-[#7a0d11] p-6 text-white transition hover:-translate-y-1 lg:col-span-1"
        >
          <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase">
            <Icone nome="instagram" className="size-4" />
            9,3 mil seguidores
          </span>
          <span className="flex items-center gap-3 font-titulo text-[clamp(1.6rem,3vw,2.1rem)] leading-none uppercase">
            Todo o estoque no Instagram
            <Icone nome="seta" className="size-6 shrink-0" />
          </span>
        </a>
      </div>
    </section>
  );
}
