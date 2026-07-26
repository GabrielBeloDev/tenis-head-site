'use client';

import { descreverTurnos } from '@/core/horario/horario-loja';
import { ORDEM_DE_EXIBICAO, SEMANA_DA_LOJA } from '@/core/horario/semana-da-loja';
import { useMomentoNaLoja } from './status-da-loja';

export function TabelaDeHorarios() {
  const momento = useMomentoNaLoja();

  return (
    <div className="mt-4 rounded-2xl border border-creme/10 bg-carvao p-5 sm:p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-cinza uppercase">Funcionamento</p>

      <table className="mt-4 w-full border-collapse">
        <caption className="sr-only">Horário de funcionamento da Tênis Head</caption>
        <thead>
          <tr>
            <th scope="col" className="pb-3 text-left font-mono text-[10px] font-medium tracking-[0.2em] text-cinza uppercase">
              Dia
            </th>
            <th scope="col" className="pb-3 text-right font-mono text-[10px] font-medium tracking-[0.2em] text-cinza uppercase">
              Horário
            </th>
          </tr>
        </thead>
        <tbody>
          {ORDEM_DE_EXIBICAO.map((indice) => {
            const dia = SEMANA_DA_LOJA[indice];
            const ehHoje = momento?.dia === indice;

            return (
              <tr key={indice} {...(ehHoje ? { 'aria-current': 'date' as const } : {})}>
                <th
                  scope="row"
                  className={`border-t border-creme/10 py-2.5 text-left text-[15px] ${
                    ehHoje
                      ? 'pl-3 font-bold text-creme shadow-[inset_3px_0_var(--color-vermelho-claro)]'
                      : 'font-medium text-creme/80'
                  }`}
                >
                  {dia.nome}
                </th>
                <td
                  className={`border-t border-creme/10 py-2.5 text-right font-mono text-[13px] whitespace-nowrap ${
                    ehHoje ? 'font-bold text-creme' : 'text-creme/80'
                  }`}
                >
                  {descreverTurnos(dia)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
