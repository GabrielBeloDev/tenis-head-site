'use client';

import { useEffect, useRef, useState } from 'react';
import { Icone } from './icone';

type PropsDoVideo = Readonly<{
  fonte: string;
  fonteAltaResolucao: string;
  poster: string;
  className?: string;
}>;

const LARGURA_PARA_ALTA_RESOLUCAO = 1024;

export function VideoDeFundo({ fonte, fonteAltaResolucao, poster, className = '' }: PropsDoVideo) {
  const referencia = useRef<HTMLVideoElement>(null);
  const [comSom, setComSom] = useState(false);
  // Escolhido depois de montar: no servidor não dá para saber a largura da tela, e mandar
  // 1080p para quem está no 4G custa alguns segundos de espera no primeiro carregamento.
  const [origem, setOrigem] = useState(fonte);

  useEffect(() => {
    if (window.innerWidth >= LARGURA_PARA_ALTA_RESOLUCAO) setOrigem(fonteAltaResolucao);

    const video = referencia.current;
    if (video !== null && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay');
      video.pause();
    }
  }, [fonteAltaResolucao]);

  function alternarSom() {
    const video = referencia.current;
    if (video === null) return;

    video.muted = !video.muted;
    setComSom(!video.muted);
    if (!video.muted) void video.play();
  }

  return (
    <>
      {/* Browsers only autoplay muted video, so sound starts off and this button is the required user gesture. */}
      <video
        ref={referencia}
        src={origem}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className={className}
      />
      <button
        type="button"
        onClick={alternarSom}
        aria-pressed={comSom}
        className="absolute top-4 right-4 z-20 flex size-11 items-center justify-center rounded-full border border-creme/25 bg-preto/60 text-creme backdrop-blur-md transition hover:border-creme/60 hover:bg-preto/80"
      >
        <Icone nome={comSom ? 'som-ligado' : 'som-mudo'} className="size-5" />
        <span className="sr-only">{comSom ? 'Desligar o som do vídeo' : 'Ligar o som do vídeo'}</span>
      </button>
    </>
  );
}
