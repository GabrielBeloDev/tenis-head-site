import { LOJA } from '@/core/loja/loja';

const CHAMADAS = [
  `Até ${LOJA.descontoMaximo}% OFF`,
  'Varejo e atacado',
  'Originais conferidos',
  `Grade a partir de ${LOJA.minimoAtacado} pares`,
  `${LOJA.cidade} · ${LOJA.estado}`,
];

export function Ticker() {
  const fita = [...CHAMADAS, ...CHAMADAS].join(' ★ ');

  return (
    <div aria-hidden="true" className="overflow-hidden bg-vermelho py-3 whitespace-nowrap text-white">
      <div className="fita-animada inline-block font-mono text-[13px] font-bold tracking-[0.24em] uppercase">
        {fita} ★ {fita} ★
      </div>
    </div>
  );
}
