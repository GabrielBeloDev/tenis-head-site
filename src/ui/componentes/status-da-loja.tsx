'use client';

import { useEffect, useState } from 'react';
import { descreverSituacao, estaAberta, situacaoEm, type MomentoNaLoja } from '@/core/horario/horario-loja';
import { momentoNaLoja, SEMANA_DA_LOJA } from '@/core/horario/semana-da-loja';

const UM_MINUTO = 60_000;

export function useMomentoNaLoja(): MomentoNaLoja | null {
  // Null until mounted: resolving on the server would hydrate-mismatch when the minute ticks over.
  const [momento, setMomento] = useState<MomentoNaLoja | null>(null);

  useEffect(() => {
    const atualizar = () => setMomento(momentoNaLoja(new Date()));
    atualizar();
    const intervalo = setInterval(atualizar, UM_MINUTO);
    return () => clearInterval(intervalo);
  }, []);

  return momento;
}

export function SeloDeStatus() {
  const momento = useMomentoNaLoja();
  const situacao = momento === null ? null : situacaoEm(SEMANA_DA_LOJA, momento);

  const corDoPonto =
    situacao === null ? 'bg-cinza' : estaAberta(situacao) ? 'bg-[#7dffa8]' : 'bg-vermelho';

  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-creme/25 px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase backdrop-blur-sm">
      <span className={`size-2 shrink-0 rounded-full ${corDoPonto}`} />
      {situacao === null ? `Loja física em São Luís · MA` : descreverSituacao(situacao)}
    </span>
  );
}
