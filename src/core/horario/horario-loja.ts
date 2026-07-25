export type Turno = Readonly<{ abre: string; fecha: string }>;

export type DiaDeFuncionamento = Readonly<{
  nome: string;
  turnos: readonly Turno[];
}>;

export type Semana = Readonly<Record<DiaDaSemana, DiaDeFuncionamento>>;

export type DiaDaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type MomentoNaLoja = Readonly<{
  dia: DiaDaSemana;
  minutos: number;
}>;

export type Situacao =
  | Readonly<{ aberto: true; fechaAs: string }>
  | Readonly<{ aberto: false; abreAs: string; nesteDia: boolean; diaQueAbre: string }>;

const MINUTOS_POR_HORA = 60;
const DIAS_NA_SEMANA = 7;

export function emMinutos(hora: string): number {
  const [h, m] = hora.split(':');
  return Number(h) * MINUTOS_POR_HORA + Number(m);
}

export function descreverTurnos(dia: DiaDeFuncionamento): string {
  if (dia.turnos.length === 0) return 'Fechado';
  return dia.turnos.map(({ abre, fecha }) => `${abre}–${fecha}`).join(' · ');
}

function proximoDiaAberto(semana: Semana, dia: DiaDaSemana): { dia: DiaDeFuncionamento; salto: number } | null {
  for (let salto = 1; salto <= DIAS_NA_SEMANA; salto++) {
    const indice = ((dia + salto) % DIAS_NA_SEMANA) as DiaDaSemana;
    const candidato = semana[indice];
    if (candidato.turnos.length > 0) return { dia: candidato, salto };
  }
  return null;
}

export function situacaoEm(semana: Semana, momento: MomentoNaLoja): Situacao {
  const hoje = semana[momento.dia];

  for (const turno of hoje.turnos) {
    if (momento.minutos < emMinutos(turno.abre)) {
      return { aberto: false, abreAs: turno.abre, nesteDia: true, diaQueAbre: hoje.nome };
    }
    if (momento.minutos < emMinutos(turno.fecha)) {
      return { aberto: true, fechaAs: turno.fecha };
    }
  }

  const proximo = proximoDiaAberto(semana, momento.dia);

  // Only reachable when every day has no shifts, i.e. permanently closed.
  if (proximo === null || proximo.dia.turnos[0] === undefined) {
    return { aberto: false, abreAs: '', nesteDia: false, diaQueAbre: '' };
  }

  return {
    aberto: false,
    abreAs: proximo.dia.turnos[0].abre,
    nesteDia: false,
    diaQueAbre: proximo.salto === 1 ? 'amanhã' : proximo.dia.nome.toLowerCase(),
  };
}

export function descreverSituacao(situacao: Situacao): string {
  if (situacao.aberto) return `Aberto agora · fecha às ${situacao.fechaAs}`;
  if (situacao.abreAs === '') return 'Consulte os horários no WhatsApp';
  if (situacao.nesteDia) return `Fechado · abre às ${situacao.abreAs}`;
  return `Fechado · abre ${situacao.diaQueAbre} às ${situacao.abreAs}`;
}
