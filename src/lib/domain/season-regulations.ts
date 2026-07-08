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
  paymentLabel: "Valor definido pela organização da bateria.",
  refundLabel: "Regras administrativas informadas pela organização.",
  priorityLabel: "Baterias abertas conforme disponibilidade.",
  kartDrawLabel: "Sorteio dos karts conforme organização da bateria.",
  title: "Regulamento da temporada",
  summary: "Regras gerais de pontuação e organização da temporada.",
  sections: [
    {
      title: "Pontuação",
      items: [
        "A pontuação usa a tabela de posição da bateria confirmada.",
        "Pole position soma 1 ponto.",
        "Melhor volta soma 1 ponto.",
        "Penalizações são subtraídas da pontuação da bateria e a pontuação final nunca fica negativa.",
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
  paymentLabel: "R$ 130,00 por bateria: R$ 120,00 do kart + R$ 10,00 para confraternização, brindes, troféus e medalhas.",
  refundLabel: "Depois do pagamento, a devolução é de 50% do valor. A outra metade vai automaticamente para o caixa da confraternização.",
  priorityLabel: "Pilotos do grupo têm prioridade até a data limite definida pela organização. Depois disso, a bateria abre para outras pessoas.",
  kartDrawLabel: "Os karts continuam sendo sorteados.",
  title: "Regulamento 2026.2",
  summary: "Temporada de julho a dezembro com 7 baterias, 6 melhores resultados válidos e entrada na disputa a partir de 3 participações.",
  sections: [
    {
      title: "Formato",
      items: [
        "São 7 baterias no semestre, de julho a dezembro.",
        "Entram na pontuação final as 6 melhores baterias de cada piloto.",
        "As baterias continuam abertas para participantes de fora da disputa da temporada.",
      ],
    },
    {
      title: "Entrada na disputa",
      items: [
        "Para competir no ranking oficial da temporada, o piloto precisa correr pelo menos 3 das 7 baterias.",
        "Depois de mais de 3 baterias concluídas, pilotos com menos de 3 participações aparecem como não competindo e não ocupam posição real no ranking.",
      ],
    },
    {
      title: "Pagamento e presença",
      items: [
        "Valor do kart: R$ 120,00.",
        "Valor pago por piloto: R$ 130,00, sendo R$ 10,00 para confraternização, brindes, troféus e medalhas.",
        "Antes de confirmar o nome na lista de presença, o piloto deve verificar se realmente poderá participar.",
        "Depois do pagamento, a devolução é de 50% do valor. A outra metade vai automaticamente para o caixa da confraternização.",
      ],
    },
    {
      title: "Prioridade e karts",
      items: [
        "Pilotos do grupo têm prioridade até a data limite definida pela organização.",
        "Após a data limite, a bateria pode ser aberta para outras pessoas.",
        "O sorteio dos karts continua.",
      ],
    },
    {
      title: "Penalizações",
      items: [
        "Primeira penalização: -8 pontos.",
        "Segunda penalização: -16 pontos + advertência. Na próxima bateria, larga em último.",
        "Terceira penalização: desclassificação e banimento da temporada.",
        "Se a penalização houver vítima, a vítima ganha +1 ponto.",
      ],
    },
    {
      title: "Bônus",
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
