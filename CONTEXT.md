# Velozes

Glossario do dominio do app Velozes, um sistema para acompanhamento de campeonato amador de kart.

## Language

**Piloto**:
Pessoa identificada por nome completo que participa das baterias do campeonato e tem resultados, pontuacao, ranking e historico associados ao seu nome. UF e um dado auxiliar opcional vindo do documento, mas nao faz parte da identidade do piloto. Dois pilotos com o mesmo nome completo sao conflito, mesmo quando o documento informa UFs diferentes.
_Avoid_: Competidor, corredor, driver

**Bateria**:
Unidade numerada de uma temporada que pode existir como evento planejado antes do resultado confirmado e depois gerar pontuacao dos pilotos. Sua identidade publica principal e ordinal, como "1ª Bateria" ou "7ª Bateria"; mes e apenas um rotulo auxiliar.
_Avoid_: Corrida, etapa

**Bateria Planejada**:
Bateria cadastrada no calendario, ainda sem resultado confirmado.
_Avoid_: Evento solto

**Bateria em Revisao**:
Bateria com importacao ou edicao pendente que ainda nao alterou o resultado confirmado.
_Avoid_: Resultado parcialmente publicado

**Bateria Confirmada**:
Bateria com resultado confirmado e apta a afetar ranking, perfis e historico.
_Avoid_: Bateria importada

**Bateria Cancelada**:
Bateria que nao acontecera ou foi anulada e nao deve gerar pontuacao, ausencia ou descarte.
_Avoid_: Bateria ausente

**Circuito Internacional Paladino**:
Local padrao das baterias do campeonato, situado no Conde, PB.
_Avoid_: Local variavel

**Temporada**:
Periodo competitivo do campeonato que agrupa um conjunto de baterias, normalmente um semestre com sete baterias. Seu nome publico segue o formato "Temporada AAAA.N", como "Temporada 2026.1".
_Avoid_: Campeonato, semestre

**Temporada Ativa**:
Temporada selecionada administrativamente como padrao para as telas publicas do app.
_Avoid_: Temporada atual por data

**Ranking**:
Classificacao dos pilotos dentro de uma temporada, incluindo todo piloto que aparece em pelo menos uma bateria da temporada e ordenada pela pontuacao apos o descarte aplicavel. Deve deixar visivel a relacao entre pontuacao bruta, descarte e pontuacao final.
_Avoid_: Classificacao geral historica

**Descarte**:
Pior resultado de um piloto que nao entra na pontuacao do ranking quando a temporada ja possui pelo menos duas baterias.
_Avoid_: Abono, exclusao

**Desempate**:
Ordem de criterios usada para classificar pilotos com a mesma pontuacao de ranking, considerando pontuacao bruta, melhores posicoes e resultado recente.
_Avoid_: Criterio manual

**Ausencia**:
Falta de resultado de um piloto em uma bateria confirmada da temporada; vale zero ponto e pode ser considerada no descarte. Quando um piloto aparece pela primeira vez depois do inicio da temporada, as baterias confirmadas anteriores contam como ausencia.
_Avoid_: NC, falta

**NC**:
Resultado de um piloto que aparece no resultado oficial da bateria, mas nao foi classificado; vale zero ponto e nao recebe bonus.
_Avoid_: Ausencia, desclassificado

**Resultado de Bateria**:
Desempenho confirmado de um piloto em uma bateria, incluindo posicao, status, bonus, penalizacoes e pontuacao final. Um piloto nao pode ter mais de um resultado na mesma bateria, e a pontuacao final nao pode ser negativa.
_Avoid_: Resultado de corrida, lancamento

**Resultado Confirmado**:
Conjunto de resultados de bateria aprovado administrativamente e usado como fonte de verdade para ranking, perfis e historico.
_Avoid_: PDF oficial como verdade final

**Revisao de Resultado**:
Alteracao pendente sobre uma bateria que ainda nao substitui o resultado confirmado nem afeta o ranking publico.
_Avoid_: Substituicao automatica

**Importacao**:
Processamento temporario de um arquivo para extrair dados estruturados; o arquivo original nao e armazenado pelo sistema.
_Avoid_: Arquivamento de PDF

**Lap-to-lap**:
Arquivo complementar de um piloto em uma bateria, usado para analise volta a volta e substituivel por novo envio validado pelo fluxo publico, sem responsabilidade administrativa.
_Avoid_: Resultado oficial

**Lap-to-lap Validado**:
Lap-to-lap aceito porque seus dados conferem com o resultado confirmado do piloto na bateria, considerando normalizacao de nome e truncamento indicado por reticencias. Seus dados estruturados sao publicos.
_Avoid_: Lap-to-lap divergente

**Acesso Administrativo**:
Acesso por senha unica que permite revisar importacoes, confirmar resultados e aplicar correcoes administrativas.
_Avoid_: Usuario administrador, conta de admin

**Pole Position**:
Bonus de pontuacao concedido ao piloto sinalizado pelo administrador como pole position da bateria.
_Avoid_: Pole inferida

**Melhor Volta**:
Bonus de pontuacao concedido ao piloto com o menor tempo de volta registrado no resultado oficial da bateria.
_Avoid_: Volta rapida

**Penalizacao**:
Ajuste negativo de pontuacao aplicado administrativamente ao resultado de bateria de um piloto, normalmente com valor padrao de cinco pontos.
_Avoid_: Punicao, desconto
