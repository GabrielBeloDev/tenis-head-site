import { describe, expect, it } from 'vitest';
import {
  descreverSituacao,
  descreverTurnos,
  emMinutos,
  estaAberta,
  situacaoEm,
  type DiaDaSemana,
  type Semana,
} from './horario-loja';
import { momentoNaLoja, SEMANA_DA_LOJA } from './semana-da-loja';

const DOMINGO = 0 as const;
const SEGUNDA = 1 as const;
const TERCA = 2 as const;
const SABADO = 6 as const;

const as = (hora: string) => emMinutos(hora);
const situacaoAs = (dia: DiaDaSemana, hora: string) => situacaoEm(SEMANA_DA_LOJA, { dia, minutos: as(hora) });
const textoAs = (dia: DiaDaSemana, hora: string) => descreverSituacao(situacaoAs(dia, hora));

describe('situação da loja ao longo do dia', () => {
  it('está fechada antes de abrir e informa o horário de abertura', () => {
    expect(textoAs(SEGUNDA, '07:00')).toBe('Fechado · abre às 08:30');
  });

  it('está aberta durante o turno da manhã', () => {
    expect(textoAs(SEGUNDA, '10:00')).toBe('Aberto agora · fecha às 12:00');
  });

  it('está fechada no intervalo do almoço e aponta a reabertura', () => {
    expect(textoAs(SEGUNDA, '13:00')).toBe('Fechado · abre às 14:30');
  });

  it('está aberta durante o turno da tarde', () => {
    expect(textoAs(SEGUNDA, '15:00')).toBe('Aberto agora · fecha às 19:30');
  });

  it('aponta o dia seguinte depois de fechar', () => {
    expect(textoAs(SEGUNDA, '20:00')).toBe('Fechado · abre amanhã às 08:30');
  });

  it('trata a meia-noite como fechada, e não como fim de expediente do dia anterior', () => {
    expect(textoAs(SEGUNDA, '00:00')).toBe('Fechado · abre às 08:30');
  });
});

describe('exceções que já causaram informação errada no site', () => {
  it('abre 14:00 na terça, e não 14:30 como nos outros dias', () => {
    expect(situacaoAs(TERCA, '14:10')).toEqual({ tipo: 'aberto', fechaAs: '19:30' });
    expect(situacaoAs(SEGUNDA, '14:10')).toEqual({ tipo: 'fecha-e-reabre-hoje', abreAs: '14:30' });
  });

  it('abre domingo de manhã, ao contrário do que dizia o texto fixo antigo', () => {
    expect(situacaoAs(DOMINGO, '10:00')).toEqual({ tipo: 'aberto', fechaAs: '12:00' });
  });

  it('fecha domingo à tarde e aponta para segunda', () => {
    expect(textoAs(DOMINGO, '15:00')).toBe('Fechado · abre amanhã às 08:30');
  });

  it('no sábado à noite aponta para o domingo de manhã', () => {
    expect(textoAs(SABADO, '20:00')).toBe('Fechado · abre amanhã às 08:30');
  });
});

describe('bordas dos turnos', () => {
  it('considera aberta no minuto exato da abertura', () => {
    expect(estaAberta(situacaoAs(SEGUNDA, '08:30'))).toBe(true);
  });

  it('considera fechada no minuto exato do fechamento', () => {
    expect(estaAberta(situacaoAs(SEGUNDA, '12:00'))).toBe(false);
    expect(estaAberta(situacaoAs(SEGUNDA, '19:30'))).toBe(false);
  });
});

describe('varredura da semana inteira', () => {
  it('concorda com um modelo independente nos 10080 minutos', () => {
    const divergencias: string[] = [];

    for (const dia of [0, 1, 2, 3, 4, 5, 6] as const) {
      for (let minutos = 0; minutos < 1440; minutos++) {
        const calculado = estaAberta(situacaoEm(SEMANA_DA_LOJA, { dia, minutos }));
        const esperado = SEMANA_DA_LOJA[dia].turnos.some(
          (turno) => minutos >= as(turno.abre) && minutos < as(turno.fecha),
        );
        if (calculado !== esperado) divergencias.push(`dia ${dia} minuto ${minutos}`);
      }
    }

    expect(divergencias).toEqual([]);
  });

  it('nunca produz texto vazio', () => {
    for (const dia of [0, 1, 2, 3, 4, 5, 6] as const) {
      for (let minutos = 0; minutos < 1440; minutos += 7) {
        expect(descreverSituacao(situacaoEm(SEMANA_DA_LOJA, { dia, minutos }))).not.toBe('');
      }
    }
  });
});

describe('descrição dos turnos', () => {
  it('junta os dois turnos do dia', () => {
    expect(descreverTurnos(SEMANA_DA_LOJA[SEGUNDA])).toBe('08:30–12:00 · 14:30–19:30');
  });

  it('descreve o domingo com um turno só', () => {
    expect(descreverTurnos(SEMANA_DA_LOJA[DOMINGO])).toBe('08:30–12:00');
  });

  it('diz "Fechado" para dia sem turno, em vez de devolver string vazia', () => {
    expect(descreverTurnos({ nome: 'Feriado', turnos: [] })).toBe('Fechado');
  });
});

describe('loja permanentemente fechada', () => {
  const semanaFechada: Semana = {
    0: { nome: 'Domingo', turnos: [] },
    1: { nome: 'Segunda', turnos: [] },
    2: { nome: 'Terça', turnos: [] },
    3: { nome: 'Quarta', turnos: [] },
    4: { nome: 'Quinta', turnos: [] },
    5: { nome: 'Sexta', turnos: [] },
    6: { nome: 'Sábado', turnos: [] },
  };

  it('não quebra e não anuncia abertura inexistente', () => {
    const texto = descreverSituacao(situacaoEm(semanaFechada, { dia: SEGUNDA, minutos: 600 }));
    expect(texto).toBe('Consulte os horários no WhatsApp');
  });
});

describe('conversão do relógio para o fuso da loja', () => {
  it('usa o horário de São Luís, e não o de quem acessa', () => {
    const momento = momentoNaLoja(new Date('2026-07-25T23:30:00Z'));
    expect(momento).toEqual({ dia: SABADO, minutos: 20 * 60 + 30 });
    expect(estaAberta(situacaoEm(SEMANA_DA_LOJA, momento))).toBe(false);
  });

  it('vira o dia junto com o fuso da loja, e não com o UTC', () => {
    expect(momentoNaLoja(new Date('2026-07-26T02:00:00Z')).dia).toBe(SABADO);
  });

  it('trata a meia-noite local como hora 0, e não como hora 24', () => {
    expect(momentoNaLoja(new Date('2026-07-26T03:00:00Z')).minutos).toBe(0);
  });
});
