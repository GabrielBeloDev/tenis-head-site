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
  | Readonly<{ tipo: 'aberto'; fechaAs: string }>
  | Readonly<{ tipo: 'fecha-e-reabre-hoje'; abreAs: string }>
  | Readonly<{ tipo: 'reabre-outro-dia'; abreAs: string; diaQueAbre: string }>
  | Readonly<{ tipo: 'sempre-fechado' }>;

export function estaAberta(situacao: Situacao): boolean {
  return situacao.tipo === 'aberto';
}

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
  for (const turno of semana[momento.dia].turnos) {
    if (momento.minutos < emMinutos(turno.abre)) {
      return { tipo: 'fecha-e-reabre-hoje', abreAs: turno.abre };
    }
    if (momento.minutos < emMinutos(turno.fecha)) {
      return { tipo: 'aberto', fechaAs: turno.fecha };
    }
  }

  const proximo = proximoDiaAberto(semana, momento.dia);

  // Only reachable when every day has no shifts, i.e. permanently closed.
  if (proximo === null || proximo.dia.turnos[0] === undefined) {
    return { tipo: 'sempre-fechado' };
  }

  return {
    tipo: 'reabre-outro-dia',
    abreAs: proximo.dia.turnos[0].abre,
    diaQueAbre: proximo.salto === 1 ? 'amanhã' : proximo.dia.nome.toLowerCase(),
  };
}

export function descreverSituacao(situacao: Situacao): string {
  switch (situacao.tipo) {
    case 'aberto':
      return `Aberto agora · fecha às ${situacao.fechaAs}`;
    case 'fecha-e-reabre-hoje':
      return `Fechado · abre às ${situacao.abreAs}`;
    case 'reabre-outro-dia':
      return `Fechado · abre ${situacao.diaQueAbre} às ${situacao.abreAs}`;
    case 'sempre-fechado':
      return 'Consulte os horários no WhatsApp';
  }
}
