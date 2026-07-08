export type SeasonIdentity = {
  year: number;
  period: number;
};

export type SeasonRegulation = {
  seasonKey: string;
  expectedBatteryCount: number;
  countedBatteryCount: number;
  discardAfterConfirmedBatteries: number;
  minimumParticipations: number | null;
  eligibilityStartsAfterConfirmedBatteries: number | null;
  poleBonus: number;
  bestLapBonus: number;
  penaltyPresets: number[];
  paymentLabel: string;
  refundLabel: string;
  priorityLabel: string;
  kartDrawLabel: string;
  title: string;
  summary: string;
  sections: Array<{
    title: string;
    items: string[];
  }>;
};

const DEFAULT_REGULATION: SeasonRegulation = {
  seasonKey: "default",
  expectedBatteryCount: 7,
  countedBatteryCount: 6,
  discardAfterConfirmedBatteries: 1,
  minimumParticipations: null,
  eligibilityStartsAfterConfirmedBatteries: null,
  poleBonus: 1,
  bestLapBonus: 1,
  penaltyPresets: [5],
  paymentLabel: "Valor definido pela organizacao da bateria.",
  refundLabel: "Regras administrativas informadas pela organizacao.",
  priorityLabel: "Baterias abertas conforme disponibilidade.",
  kartDrawLabel: "Sorteio dos karts conforme organizacao da bateria.",
  title: "Regulamento da temporada",
  summary: "Regras gerais de pontuacao e organizacao da temporada.",
  sections: [
    {
      title: "Pontuacao",
      items: [
        "A pontuacao usa a tabela de posicao da bateria confirmada.",
        "Pole position soma 1 ponto.",
        "Melhor volta soma 1 ponto.",
        "Penalizacoes sao subtraidas da pontuacao da bateria e a pontuacao final nunca fica negativa.",
      ],
    },
  ],
};

const REGULATION_2026_2: SeasonRegulation = {
  seasonKey: "2026-2",
  expectedBatteryCount: 7,
  countedBatteryCount: 6,
  discardAfterConfirmedBatteries: 6,
  minimumParticipations: 3,
  eligibilityStartsAfterConfirmedBatteries: 3,
  poleBonus: 2,
  bestLapBonus: 3,
  penaltyPresets: [8, 16],
  paymentLabel: "R$ 130,00 por bateria: R$ 120,00 do kart + R$ 10,00 para confraternizacao, brindes, trofeus e medalhas.",
  refundLabel: "Depois do pagamento, a devolucao e de 50% do valor. A outra metade vai automaticamente para o caixa da confraternizacao.",
  priorityLabel: "Pilotos do grupo tem prioridade ate a data limite definida pela organizacao. Depois disso, a bateria abre para outras pessoas.",
  kartDrawLabel: "Os karts continuam sendo sorteados.",
  title: "Regulamento 2026.2",
  summary: "Temporada de julho a dezembro com 7 baterias, 6 melhores resultados validos e entrada na disputa a partir de 3 participacoes.",
  sections: [
    {
      title: "Formato",
      items: [
        "Sao 7 baterias no semestre, de julho a dezembro.",
        "Entram na pontuacao final as 6 melhores baterias de cada piloto.",
        "As baterias continuam abertas para participantes de fora da disputa da temporada.",
      ],
    },
    {
      title: "Entrada na disputa",
      items: [
        "Para competir no ranking oficial da temporada, o piloto precisa correr pelo menos 3 das 7 baterias.",
        "Depois de mais de 3 baterias concluidas, pilotos com menos de 3 participacoes aparecem como nao competindo e nao ocupam posicao real no ranking.",
      ],
    },
    {
      title: "Pagamento e presenca",
      items: [
        "Valor do kart: R$ 120,00.",
        "Valor pago por piloto: R$ 130,00, sendo R$ 10,00 para confraternizacao, brindes, trofeus e medalhas.",
        "Antes de confirmar o nome na lista de presenca, o piloto deve verificar se realmente podera participar.",
        "Depois do pagamento, a devolucao e de 50% do valor. A outra metade vai automaticamente para o caixa da confraternizacao.",
      ],
    },
    {
      title: "Prioridade e karts",
      items: [
        "Pilotos do grupo tem prioridade ate a data limite definida pela organizacao.",
        "Apos a data limite, a bateria pode ser aberta para outras pessoas.",
        "O sorteio dos karts continua.",
      ],
    },
    {
      title: "Penalizacoes",
      items: [
        "Primeira penalizacao: -8 pontos.",
        "Segunda penalizacao: -16 pontos + advertencia. Na proxima bateria, larga em ultimo.",
        "Terceira penalizacao: desclassificacao e banimento da temporada.",
        "Se a penalizacao houver vitima, a vitima ganha +1 ponto.",
      ],
    },
    {
      title: "Bonus",
      items: [
        "Pole position: +2 pontos.",
        "Melhor volta: +3 pontos.",
      ],
    },
  ],
};

export function seasonRegulationFor(season: SeasonIdentity | null | undefined): SeasonRegulation {
  if (season?.year === 2026 && season.period === 2) return REGULATION_2026_2;
  return DEFAULT_REGULATION;
}
