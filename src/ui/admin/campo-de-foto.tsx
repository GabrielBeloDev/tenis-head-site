'use client';

import { useEffect, useRef, useState } from 'react';
import { recortarParaVitrine, type PosicaoDoCorte } from '@/infra/imagem/recortar-para-vitrine';

type PropsDoCampoDeFoto = Readonly<{
  fotoAtual?: string;
  posicaoDoCorte: PosicaoDoCorte;
  aoMudarPosicao: (posicao: PosicaoDoCorte) => void;
}>;

export function CampoDeFoto({ fotoAtual, posicaoDoCorte, aoMudarPosicao }: PropsDoCampoDeFoto) {
  const entrada = useRef<HTMLInputElement>(null);
  const [original, setOriginal] = useState<File | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);

  useEffect(() => () => { if (previa !== null) URL.revokeObjectURL(previa); }, [previa]);

  async function gerarPrevia(arquivo: File, posicao: PosicaoDoCorte) {
    const recortada = await recortarParaVitrine(arquivo, posicao);
    setPrevia((anterior) => {
      if (anterior !== null) URL.revokeObjectURL(anterior);
      return URL.createObjectURL(recortada);
    });
  }

  async function aoEscolher(arquivo: File | undefined) {
    if (arquivo === undefined) return;
    setOriginal(arquivo);
    await gerarPrevia(arquivo, posicaoDoCorte);
  }

  async function trocarPosicao(posicao: PosicaoDoCorte) {
    aoMudarPosicao(posicao);
    if (original !== null) await gerarPrevia(original, posicao);
  }

  const temFoto = previa !== null || fotoAtual !== undefined;

  return (
    <div className="grid gap-3">
      <input
        ref={entrada}
        name="imagem"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(evento) => void aoEscolher(evento.target.files?.[0])}
        className="sr-only"
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => { e.preventDefault(); setArrastando(false); void aoEscolher(e.dataTransfer.files[0]); }}
        className={`grid gap-4 rounded-2xl border-2 border-dashed p-5 transition sm:grid-cols-[auto_1fr] sm:items-center ${
          arrastando ? 'border-vermelho-claro bg-vermelho/5' : 'border-creme/20'
        }`}
      >
        <div className="mx-auto aspect-4/5 w-32 overflow-hidden rounded-xl bg-carvao sm:mx-0">
          {temFoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previa ?? fotoAtual} alt="" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center px-3 text-center font-mono text-[10px] leading-relaxed tracking-wide text-cinza uppercase">
              a foto fica assim
            </div>
          )}
        </div>

        <div className="text-center sm:text-left">
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            className="rounded-full bg-vermelho px-6 py-3 text-sm font-bold text-white transition hover:bg-vermelho-claro"
          >
            {temFoto ? 'Trocar a foto' : 'Escolher a foto'}
          </button>

          <p className="mt-3 text-xs leading-relaxed text-creme/60">
            {previa !== null
              ? 'É exatamente assim que o par vai aparecer no site.'
              : fotoAtual !== undefined
                ? 'Foto que está no site agora. Escolha outra só se quiser trocar.'
                : 'Pode mandar direto da galeria do celular. Aqui a foto já é cortada e reduzida, então não precisa editar antes.'}
          </p>

          {previa !== null && (
            <div className="mt-4">
              <p className="text-xs font-semibold">Cortou o tênis? Ajuste aqui:</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                {(['centro', 'base'] as const).map((posicao) => (
                  <button
                    key={posicao}
                    type="button"
                    onClick={() => void trocarPosicao(posicao)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      posicaoDoCorte === posicao
                        ? 'border-vermelho-claro text-vermelho-claro'
                        : 'border-creme/25 text-creme/70 hover:border-creme'
                    }`}
                  >
                    {posicao === 'centro' ? 'Tênis no meio' : 'Tênis embaixo'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
