'use client';

import { useId, useState } from 'react';

type PropsDaDica = Readonly<{ texto: string }>;

export function Dica({ texto }: PropsDaDica) {
  const id = useId();
  const [aberta, setAberta] = useState(false);

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label="O que é isso?"
        aria-describedby={aberta ? id : undefined}
        aria-expanded={aberta}
        onClick={(evento) => {
          // Otherwise the click bubbles to the <label> and moves focus, closing this.
          evento.preventDefault();
          setAberta((estava) => !estava);
        }}
        onMouseEnter={() => setAberta(true)}
        onMouseLeave={() => setAberta(false)}
        onFocus={() => setAberta(true)}
        onBlur={() => setAberta(false)}
        className="flex size-4.5 items-center justify-center rounded-full border border-creme/30 text-[10px] font-bold text-creme/60 transition hover:border-vermelho-claro hover:text-vermelho-claro"
      >
        ?
      </button>

      {aberta && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-xl border border-creme/15 bg-preto px-3.5 py-2.5 text-xs leading-relaxed font-normal text-creme/85 normal-case shadow-2xl"
        >
          {texto}
        </span>
      )}
    </span>
  );
}
