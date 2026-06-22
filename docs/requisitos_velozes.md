# Velozes – Requisitos do Sistema

## 1. Visão geral

O **Velozes** será um sistema web mobile first para acompanhar um campeonato amador de kart. O objetivo principal é substituir a planilha atualmente usada para controle de pontuação, oferecendo uma experiência pública mais visual, simples e instalável como PWA.

O sistema deve permitir que qualquer pessoa acompanhe o ranking, calendário de corridas, perfil dos competidores e dados de desempenho. Também deve oferecer um painel administrativo simples para importação de resultados oficiais, inserção manual, correção de dados e aplicação de penalizações.

O produto será desenvolvido como um **web app PWA**, construído com **Next.js**, versionado com **Git**, publicado no **GitHub** como projeto open source sob licença **MIT** e hospedado na **Vercel**, no plano gratuito **Hobby**.

---

## 2. Objetivos do sistema

- Substituir a planilha de classificação do campeonato.
- Exibir ranking geral e pontuação por etapa/mês.
- Mostrar calendário de corridas.
- Exibir perfil individual dos competidores.
- Exibir análise de corrida e dados volta a volta quando houver lap-to-lap.
- Permitir upload de PDF oficial da corrida pelo administrador.
- Permitir inserção manual de resultados pelo administrador.
- Permitir upload público de lap-to-lap pelos competidores, sem login.
- Validar lap-to-lap com base no resultado oficial.
- Manter o sistema simples, mobile first, instalável e compatível com deploy gratuito.

---

## 3. Stack e requisitos técnicos

### 3.1 Stack principal

- **Next.js** como framework principal.
- Aplicação web responsiva e mobile first.
- Suporte a instalação como **Progressive Web App**.
- Versionamento com **Git**.
- Repositório público no **GitHub**.
- Licença **MIT**.
- Deploy na **Vercel**, plano **Hobby**.

### 3.2 PWA

O sistema deve incluir:

- `manifest.webmanifest` ou equivalente.
- Ícones de instalação.
- Nome completo do app.
- Nome curto do app.
- Cor de tema.
- Configuração para instalação em dispositivos móveis.
- Layout responsivo adequado para uso como app instalado.

### 3.3 Segurança e versionamento

Como o projeto será open source, nenhuma informação sensível deve ser versionada.

Não devem ser commitados:

- API keys.
- Tokens.
- Senhas.
- Secrets.
- Variáveis de ambiente reais.
- Arquivos `.env` com valores sensíveis.
- Credenciais de banco.
- Credenciais de serviços externos.
- Dados privados ou arquivos de corrida que não devam ser públicos.

O repositório deve conter apenas arquivos seguros, como:

- `.env.example`.
- README.
- LICENSE.
- Documentação de setup.
- Código-fonte.
- Configurações sem secrets.

---

## 4. Perfis de usuário

### 4.1 Visitante público

Usuário sem login.

Pode:

- Ver Home pública.
- Ver ranking.
- Ver calendário.
- Ver perfil dos competidores.
- Ver detalhes de corrida disponíveis.
- Selecionar seu nome e enviar lap-to-lap.

Não pode:

- Editar resultados.
- Importar resultado oficial.
- Corrigir pontuação.
- Aplicar penalizações.

### 4.2 Administrador

Usuário autenticado por login simplificado, inicialmente com senha única.

Pode:

- Acessar painel administrativo.
- Importar PDF oficial da corrida.
- Inserir resultados manualmente.
- Editar dados de resultados.
- Aplicar penalizações.
- Corrigir pilotos.
- Resolver nomes duplicados.
- Salvar e recalcular pontuações.
- Ver histórico de importações.

---

## 5. Navegação principal

A navegação pública deve seguir o modelo mobile first com bottom navigation.

Telas principais:

- Home.
- Calendário.
- Ranking.
- Pilotos / Competidores.
- Perfil do competidor.
- Detalhe da corrida.
- Upload de lap-to-lap.
- Admin.

A área administrativa pode ser acessada por um ícone discreto de cadeado.

---

## 6. Home pública

A Home deve funcionar como resumo rápido do campeonato.

### Deve exibir

- Nome ou marca do sistema.
- Ícone discreto de acesso ao admin.
- Próximo evento.
- Data da próxima corrida.
- Nome da bateria/etapa.
- Circuito/kartódromo.
- Local.
- Contagem regressiva.
- Botão para ver calendário.
- Link ou acesso ao regulamento.
- Ranking atual ou pódio atual.
- Top 3 ou top 5 competidores.
- Pontuação dos líderes.
- Botão para ver ranking completo.
- Indicador/insight geral da temporada, se aplicável.

### Observações

A Home não deve substituir o ranking completo. Ela deve ser uma tela de entrada com informações resumidas.

---

## 7. Calendário

A tela de calendário deve listar eventos do campeonato.

### Deve exibir

- Próximos eventos.
- Eventos anteriores.
- Data da corrida.
- Nome da etapa/bateria.
- Circuito/kartódromo.
- Cidade/UF.
- Status do evento, quando aplicável.
- Botão para ver eventos anteriores.
- Aviso de que datas e locais podem sofrer alteração.

### Regras

- O calendário pode começar como uma lista de cards.
- Não é necessário implementar calendário mensal visual no MVP.
- Deve suportar mais de uma corrida no mesmo mês.

---

## 8. Ranking geral

A tela de ranking é a substituição principal da planilha atual.

### Deve exibir

- Temporada selecionada.
- Filtros por mês/etapa e visão geral.
- Lista de competidores ranqueados.
- Posição geral.
- Nome do competidor.
- UF.
- Pontuação por etapa.
- Pontuação total.
- Acesso ao perfil do competidor.
- Card explicando como funciona a pontuação.

### Regras

- O ranking deve ser ordenado automaticamente pela pontuação total.
- O maior total de pontos fica em primeiro lugar.
- A pontuação final deve considerar pontos por posição, bônus e penalizações.
- O sistema deve suportar duas ou mais corridas no mesmo mês.
- Etapas no mesmo mês não devem depender apenas do nome do mês como identificador.
- A identificação visual pode usar “Junho 1”, “Junho 2”, “Bateria 06”, “Bateria 07” ou outra nomenclatura clara.

---

## 9. Sistema de pontuação

A pontuação oficial extraída da planilha atual é:

| Posição | Pontos |
|---:|---:|
| 1º | 24 |
| 2º | 22 |
| 3º | 20 |
| 4º | 18 |
| 5º | 16 |
| 6º | 14 |
| 7º | 12 |
| 8º | 10 |
| 9º | 8 |
| 10º | 7 |
| 11º | 6 |
| 12º | 5 |
| 13º | 4 |
| 14º | 3 |
| 15º | 2 |
| 16º | 1 |

### Bônus e penalizações

| Evento | Pontos |
|---|---:|
| Pole position | +1 |
| Melhor volta | +1 |
| NC, não classificado | 0 |
| Penalização padrão | -5 |

### Fórmula

```text
pontuação_da_corrida = pontos_por_posição + bônus_pole_position + bônus_melhor_volta + penalizações
```

Exemplo:

```text
1º lugar + pole position + melhor volta = 24 + 1 + 1 = 26 pontos
```

---

## 10. Perfil do competidor

A tela de perfil deve consolidar os dados de um competidor.

### Deve exibir

- Nome completo.
- UF.
- Posição geral.
- Pontuação total.
- Melhor volta geral.
- Melhor corrida.
- Gráfico de evolução no campeonato.
- Lista de corridas disputadas.
- Resultado em cada corrida.
- Pontuação em cada corrida.
- Botão para enviar lap-to-lap.
- Acesso à análise da temporada.

### Observações

- O perfil deve ser alimentado pelo report oficial.
- Quando houver lap-to-lap validado, o perfil deve permitir acesso a análises mais detalhadas.
- O sistema deve indicar que o histórico do piloto é consolidado por nome completo.

---

## 11. Detalhe da corrida

A tela de detalhe da corrida deve mostrar a performance de um competidor em uma corrida específica.

### Dados vindos do report oficial

- Bateria.
- Data/hora.
- Circuito.
- Piloto.
- UF.
- Posição.
- Status, classificado ou NC.
- Pontos obtidos.
- Melhor volta.
- Número da melhor volta.
- Tempo total.
- Diferença para o líder.
- Diferença para o anterior.
- Tempo da última volta.
- Total de voltas.
- Velocidade média.
- Bônus.
- Penalizações.

### Dados vindos do lap-to-lap

Quando houver lap-to-lap validado, a tela deve exibir:

- Gráfico de tempo volta a volta.
- Gráfico de variação entre voltas.
- Melhor volta destacada.
- Insights da corrida.
- Status “lap-to-lap validado”.

### Estado sem lap-to-lap

Se não houver lap-to-lap:

```text
Envie o lap-to-lap para visualizar a análise volta a volta desta corrida.
```

---

## 12. Upload público de lap-to-lap

Usuários comuns devem poder enviar lap-to-lap sem autenticação.

### Fluxo

1. Usuário acessa o perfil do competidor ou tela de upload.
2. Seleciona o piloto correspondente.
3. Envia o PDF lap-to-lap.
4. O sistema extrai os dados do arquivo.
5. O sistema valida os dados contra o report oficial.
6. Se os dados baterem, associa o lap-to-lap ao resultado da corrida.
7. Se houver divergência, rejeita ou envia para revisão do administrador.

### Validações

O sistema deve validar:

- Nome do competidor no PDF.
- Melhor volta extraída do lap-to-lap.
- Número da melhor volta, quando possível.
- Número do competidor, quando possível.
- Compatibilidade com o resultado oficial da corrida.

### Mensagens

Sucesso:

```text
Lap-to-lap validado com sucesso. Nome e melhor volta conferem com o resultado oficial.
```

Erro:

```text
Não foi possível validar este lap-to-lap. O nome ou a melhor volta não conferem com o resultado oficial.
```

---

## 13. Painel administrativo

O painel administrativo deve permitir que o administrador alimente e corrija o sistema.

### Acesso

- Login simplificado com senha.
- Acesso via ícone de cadeado.
- Após login, o administrador pode ver ações extras nas telas.

### Funcionalidades

- Selecionar corrida/evento.
- Upload de PDF oficial.
- Inserção manual de resultado.
- Revisão da importação.
- Edição de resultados.
- Aplicação de penalizações.
- Inclusão de competidores.
- Correção de nome/UF.
- Salvar e recalcular ranking.
- Ver importações recentes.
- Ver histórico de importações.

### Revisão após upload

Após importar o PDF oficial, o sistema deve mostrar uma revisão antes de confirmar.

A revisão deve exibir:

- Bateria.
- Circuito.
- Data/hora.
- Quantidade de competidores encontrados.
- Quantidade de classificados.
- Quantidade de NC.
- Melhor volta geral.
- Pilotos novos detectados.
- Pilotos já existentes encontrados por nome completo.
- Alertas de dados ausentes ou inconsistentes.

---

## 14. Importação do report oficial

O report oficial tem estrutura fixa.

### Campos do report oficial

- `POS`: posição.
- `#`: número do competidor.
- `Nome`: nome completo.
- `MV`: número da melhor volta.
- `TMV`: tempo da melhor volta.
- `TT`: tempo total.
- `DL`: diferença para o líder.
- `DA`: diferença para o anterior.
- `TUV`: tempo da última volta.
- `TV`: total de voltas.
- `VM`: velocidade média em km/h.
- `UF`: unidade federativa.

### Metadados extraídos

- Categoria.
- Bateria.
- Tipo, como “Corrida”.
- Circuito.
- Data/hora.
- Kartódromo ou clube, quando disponível.
- Melhor volta geral da corrida.
- Piloto da melhor volta geral.

### Regras

- O PDF oficial é a fonte de verdade do resultado da corrida.
- O sistema deve reconhecer competidores classificados e NC.
- Competidores NC recebem 0 ponto.
- O sistema deve calcular pontos usando a tabela oficial.
- O administrador pode revisar e corrigir dados antes de confirmar.

---

## 15. Importação do lap-to-lap

O lap-to-lap tem estrutura fixa e é individual por competidor.

### Campos do lap-to-lap

- Nome do competidor no topo do arquivo.
- `#`: número do competidor.
- `VLT`: número da volta.
- `TV`: tempo da volta.
- `DMV`: diferença para a melhor volta.
- `DLCAT`: diferença para referência/categoria.
- `TT`: tempo acumulado.
- `VM`: velocidade média.

### Regras

- O lap-to-lap complementa o report oficial.
- O lap-to-lap não substitui o resultado oficial.
- O lap-to-lap serve para gráficos, análise e insights.
- O sistema deve calcular a melhor volta a partir das linhas de volta.
- A melhor volta calculada deve bater com o `TMV` do report oficial do piloto.

---

## 16. Identidade do competidor

A identidade do competidor ao longo das corridas será definida por:

```text
nome completo
```

Exemplo:

```text
Otacilio Saraiva Maia Neto
```

### Regras

- O sistema deve usar nome completo para rastrear o mesmo competidor ao longo da temporada.
- UF é metadado opcional do documento e não compõe a identidade do piloto.
- Se um piloto aparecer novamente com o mesmo nome completo, deve ser tratado como o mesmo competidor.
- Se um piloto novo aparecer no report oficial, o sistema deve sugerir criação automática.
- Se houver dois competidores com o mesmo nome completo, mesmo com UFs diferentes, o sistema deve exibir alerta e pedir renomeação de um deles.

### Mensagem de alerta

```text
Nome duplicado detectado. Renomeie um dos pilotos antes de confirmar a importação.
```

---

## 17. Estados e mensagens do sistema

### Estados de sucesso

- PDF oficial importado.
- Resultado salvo.
- Ranking recalculado.
- Lap-to-lap validado.
- Competidor criado.

### Estados de atenção

- Nome duplicado.
- Piloto novo detectado.
- UF ausente.
- Dados incompletos.
- Importação pendente de revisão.
- Resultado já importado para a corrida.

### Estados de erro

- PDF fora do padrão.
- Arquivo inválido.
- Falha ao processar PDF.
- Nome do lap-to-lap não confere.
- Melhor volta do lap-to-lap não confere.
- Corrida não encontrada.

### Estados vazios

- Nenhuma corrida cadastrada.
- Nenhum evento futuro.
- Nenhum lap-to-lap enviado.
- Ranking ainda não iniciado.
- Nenhuma importação recente.

---

## 18. Modelo de dados inicial

### Competidor

```text
id
nomeCompleto
uf opcional
nomeExibicao
ativo
createdAt
updatedAt
```

### Temporada

```text
id
ano
nome
ativa
createdAt
updatedAt
```

### Corrida

```text
id
temporadaId
etapa
bateria
tipo
categoria
circuito
local
dataHora
status
arquivoOficialId
createdAt
updatedAt
```

### ResultadoCorrida

```text
id
corridaId
competidorId
numeroCompetidor
posicao
status
numeroMelhorVolta
tempoMelhorVolta
tempoTotal
diferencaParaLider
diferencaParaAnterior
tempoUltimaVolta
totalVoltas
velocidadeMedia
pontosPorPosicao
bonusPolePosition
bonusMelhorVolta
penalizacao
pontosFinais
createdAt
updatedAt
```

### LapToLap

```text
id
corridaId
competidorId
arquivoId
statusValidacao
nomeExtraido
numeroCompetidorExtraido
melhorVoltaExtraida
numeroMelhorVoltaExtraida
createdAt
updatedAt
```

### Volta

```text
id
lapToLapId
numeroVolta
tempoVolta
diferencaMelhorVolta
diferencaCategoria
tempoAcumulado
velocidadeMedia
createdAt
updatedAt
```

### Importacao

```text
id
corridaId
tipo
nomeArquivo
status
mensagemErro
createdAt
createdBy
```

---

## 19. Design system

O design system deve ser inspirado na logo “Velocidade Quase Máxima”.

### Direção visual

- Kart.
- Velocidade.
- Competição.
- Vermelho, preto, branco e cinzas.
- Visual esportivo, mas limpo.
- Interface de produto, não arte promocional.
- Mobile first.

### Paleta base

- Vermelho principal para ação e destaque.
- Preto para contraste e força visual.
- Branco e cinzas claros para fundo e cards.
- Verde para sucesso.
- Amarelo/laranja para alerta.
- Vermelho escuro para erro.

### Componentes principais

- Header.
- Bottom navigation.
- Cards.
- Ranking cards.
- Botões.
- Inputs.
- Chips.
- Alerts.
- Badges de status.
- Gráficos.
- Tabelas mobile friendly.

---

## 20. Wireframes e protótipos

### Histórico do processo

Foram criados wireframes manuais iniciais para:

- Home.
- Ranking.
- Perfil do competidor.
- Detalhe da corrida.
- Calendário.
- Admin.

Depois, foi criado um prompt de design system inspirado na logo do projeto. Esse prompt foi repassado para Claude Design, que construiu um design system e protótipos iniciais para:

- Home.
- Profile / Perfil.
- Race / Corrida.
- Ranking.
- Calendar / Calendário.

Esses protótipos serão repassados para Codex, que irá implementar o código.

### Diretriz importante

A primeira versão validada dos wireframes deve ser considerada baseline visual e estrutural. Novas regras e documentos devem gerar ajustes incrementais, não redesenhos completos sem necessidade.

---

## 21. MVP sugerido

### MVP 1

- Home pública.
- Calendário simples.
- Ranking público.
- Perfil básico do competidor.
- Sistema de pontuação.
- Admin com senha.
- Inserção manual de resultados.
- Cálculo de ranking.

### MVP 2

- Upload de PDF oficial.
- Parser do report oficial.
- Revisão da importação.
- Edição de resultados.
- Penalizações.
- Recalcular ranking.

### MVP 3

- Upload público de lap-to-lap.
- Parser de lap-to-lap.
- Validação por nome e melhor volta.
- Gráficos volta a volta.
- Insights de corrida.

### MVP 4

- Dashboards mais ricos.
- Comparativos entre pilotos.
- Análise de consistência.
- Histórico de alterações.
- Melhorias no painel admin.

---

## 22. Questões em aberto

- Qual será o critério de desempate no ranking?
- Como identificar pole position no report oficial, se o PDF não trouxer essa informação diretamente?
- A penalização será sempre -5 ou poderá ter valores customizados?
- O admin poderá editar lap-to-lap validado?
- O sistema terá banco persistente no MVP ou começará com dados versionados/mockados?
- O upload de arquivos será armazenado onde, considerando Vercel Hobby e projeto open source?
- Haverá autenticação real no futuro ou a senha simples será mantida?
- O ranking deve permitir descarte de pior resultado ou todos os resultados contam?
- Pilotos convidados entram no ranking geral ou aparecem apenas na corrida?

---

## 23. Resumo

O Velozes será um PWA mobile first para campeonato amador de kart. O sistema substituirá a planilha atual, exibindo ranking, calendário, perfis e análise de corrida. O PDF oficial será a fonte de verdade dos resultados, enquanto o lap-to-lap será usado como complemento analítico. A identidade dos pilotos será controlada por nome completo. O admin poderá importar PDFs, inserir dados manualmente, corrigir resultados e recalcular o ranking. O projeto será open source, licenciado sob MIT, desenvolvido em Next.js, publicado no GitHub e hospedado na Vercel Hobby.
