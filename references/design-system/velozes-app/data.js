// Velozes app — fake demo data (pt-BR)
window.VZ_DATA = {
  season: "Temporada 2024",
  nextEvent: {
    date: "12/06",
    dateLabel: { mon: "JUN", day: "12", dow: "QUA" },
    title: "1ª Etapa – Velozes 2024",
    circuit: "Autódromo Internacional",
    city: "Curitiba – PR",
    countdown: { dias: "05", horas: "14", min: "32", seg: "18" },
    inDays: "Falta 5 dias",
  },
  avgSpeed: "248,7",
  podium: [
    { pos: 1, name: "Lucas Almeida", uf: "PR", pts: 87 },
    { pos: 2, name: "Bruno Costa", uf: "SP", pts: 72 },
    { pos: 3, name: "Felipe Martins", uf: "MG", pts: 61 },
    { pos: 4, name: "Rafael Souza", uf: "SP", pts: 49 },
    { pos: 5, name: "Thiago Oliveira", uf: "RS", pts: 43 },
  ],
  events: [
    { mon: "JUN", day: "12", dow: "QUA", title: "1ª Etapa – Velozes 2024", circuit: "Autódromo Internacional", city: "Curitiba – PR", inDays: "Falta 5 dias", next: true, track: "M30 50 C 40 20, 70 20, 75 40 S 95 70, 85 80 S 55 75, 50 60 S 25 80, 30 50 Z" },
    { mon: "JUL", day: "15", dow: "SEG", title: "2ª Etapa – Velozes 2024", circuit: "Autódromo de Interlagos", city: "São Paulo – SP", inDays: "Falta 38 dias", next: false, track: "M25 60 C 20 35, 55 25, 70 35 S 92 45, 80 62 S 60 78, 45 72 S 28 78, 25 60 Z" },
    { mon: "AGO", day: "07", dow: "QUA", title: "3ª Etapa – Velozes 2024", circuit: "Autódromo Velopark", city: "Nova Santa Rita – RS", inDays: "Falta 61 dias", next: false, track: "M35 30 C 60 20, 80 35, 70 50 S 85 75, 65 80 S 45 70, 50 55 S 25 55, 35 30 Z" },
  ],
  ranking: [
    { pos: 1, name: "Lucas Almeida", uf: "PR", total: 316, months: { Jan: 87, Fev: 81, Mar: 76, Abr: 72 } },
    { pos: 2, name: "Bruno Costa", uf: "SP", total: 283, months: { Jan: 72, Fev: 78, Mar: 68, Abr: 65 } },
    { pos: 3, name: "Felipe Martins", uf: "MG", total: 240, months: { Jan: 61, Fev: 63, Mar: 59, Abr: 57 } },
    { pos: 4, name: "Rafael Souza", uf: "SP", total: 197, months: { Jan: 49, Fev: 52, Mar: 46, Abr: 50 } },
    { pos: 5, name: "Thiago Oliveira", uf: "RS", total: 171, months: { Jan: 43, Fev: 45, Mar: 41, Abr: 42 } },
  ],
  pointsTable: [
    ["1º", 24], ["2º", 22], ["3º", 20], ["4º", 18], ["5º", 16],
    ["6º", 14], ["7º", 12], ["8º", 10], ["9º", 8], ["10º", 7],
  ],
  profile: {
    name: "Lucas Almeida",
    uf: "PR",
    rankBadge: "1º lugar",
    totalPts: 87,
    posGeral: { value: "1º", of: "de 18" },
    bestLap: { value: "00:49.352", etapa: "8ª etapa" },
    bestRace: { value: "1º lugar", etapa: "5ª etapa" },
    evolution: [10, 5, 3, 2, 1, 1, 1, 1, 1, 1], // ranking position per etapa
    races: [
      { day: "10", mon: "MAI", etapa: "8ª etapa", track: "Autódromo Internacional – Curitiba, PR", pos: "1º", pts: 25 },
      { day: "26", mon: "ABR", etapa: "7ª etapa", track: "Circuito dos Cristais – Curvelo, MG", pos: "2º", pts: 18 },
      { day: "12", mon: "ABR", etapa: "6ª etapa", track: "Autódromo de Interlagos – São Paulo, SP", pos: "3º", pts: 15 },
      { day: "29", mon: "MAR", etapa: "5ª etapa", track: "Velocitta – Mogi Guaçu, SP", pos: "1º", pts: 25 },
      { day: "15", mon: "MAR", etapa: "4ª etapa", track: "Goiânia Race Track – Goiânia, GO", pos: "4º", pts: 12 },
    ],
  },
  race: {
    title: "Corrida • 8ª Etapa",
    driver: "Lucas Almeida",
    posGeral: "1º",
    stats: {
      bestLap: "00:48.732",
      totalTime: "14:32.184",
      gapLeader: "—",
      gapPrev: "+2.318",
      lastLap: "00:49.215",
      totalLaps: "18",
    },
    // lap times in seconds for the lap-by-lap chart
    laps: [48.1, 48.4, 48.5, 49.0, 50.0, 48.6, 50.8, 48.5, 48.4, 48.2, 49.2, 49.4, 48.5, 49.0, 48.9, 49.9, 50.2, 47.6, 47.3, 48.4],
  },
  admin: {
    event: { circuit: "Autódromo Internacional", city: "Curitiba – PR", date: "12/06/2024" },
    result: [
      { pos: "1º", name: "Lucas Almeida" },
      { pos: "2º", name: "Bruno Costa" },
      { pos: "3º", name: "Felipe Martins" },
      { pos: "4º", name: "Rafael Souza" },
      { pos: "5º", name: "Thiago Oliveira" },
    ],
    imports: [
      { file: "resultado_oficial_1206.pdf", at: "12/06/2024 • 14:32", status: "Processado" },
      { file: "resultado_corrigido_1206.pdf", at: "12/06/2024 • 13:10", status: "Processado" },
    ],
  },
};
