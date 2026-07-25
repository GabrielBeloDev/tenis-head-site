import type { DiaDaSemana, MomentoNaLoja, Semana } from './horario-loja';

// Store timezone, never the visitor's: otherwise remote visitors see the wrong open/closed state.
export const FUSO_DA_LOJA = 'America/Fortaleza';

const MANHA = { abre: '08:30', fecha: '12:00' } as const;
const TARDE = { abre: '14:30', fecha: '19:30' } as const;
const TARDE_DE_TERCA = { abre: '14:00', fecha: '19:30' } as const;

export const SEMANA_DA_LOJA: Semana = {
  0: { nome: 'Domingo', turnos: [MANHA] },
  1: { nome: 'Segunda', turnos: [MANHA, TARDE] },
  2: { nome: 'Terça', turnos: [MANHA, TARDE_DE_TERCA] },
  3: { nome: 'Quarta', turnos: [MANHA, TARDE] },
  4: { nome: 'Quinta', turnos: [MANHA, TARDE] },
  5: { nome: 'Sexta', turnos: [MANHA, TARDE] },
  6: { nome: 'Sábado', turnos: [MANHA, TARDE] },
};

export const ORDEM_DE_EXIBICAO: readonly DiaDaSemana[] = [1, 2, 3, 4, 5, 6, 0];

const INDICE_POR_ABREVIACAO: Readonly<Record<string, DiaDaSemana>> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

export function momentoNaLoja(agora: Date): MomentoNaLoja {
  const formatador = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO_DA_LOJA,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const partes = new Map(formatador.formatToParts(agora).map((parte) => [parte.type, parte.value]));
  const abreviacao = partes.get('weekday') ?? '';
  const dia = INDICE_POR_ABREVIACAO[abreviacao];

  if (dia === undefined) {
    throw new Error(`Intl devolveu um dia da semana inesperado: "${abreviacao}"`);
  }

  return { dia, minutos: Number(partes.get('hour')) * 60 + Number(partes.get('minute')) };
}
