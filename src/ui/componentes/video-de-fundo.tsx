'use client';

import { useEffect, useRef, useState } from 'react';
import { Icone } from './icone';

type PropsDoVideo = Readonly<{
  fonte: string;
  poster: string;
  className?: string;
}>;

// Browsers only autoplay muted video, so sound starts off and this button is the required user gesture.
export function VideoDeFundo({ fonte, poster, className = '' }: PropsDoVideo) {
  const referencia = useRef<HTMLVideoElement>(null);
  const [comSom, setComSom] = useState(false);

  useEffect(() => {
    const video = referencia.current;
    if (video === null) return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay');
      video.pause();
    }
  }, []);

  function alternarSom() {
    const video = referencia.current;
    if (video === null) return;

    video.muted = !video.muted;
    setComSom(!video.muted);
    if (!video.muted) void video.play();
  }

  return (
    <>
      <video
        ref={referencia}
        src={fonte}
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
