# Relatório — Evidence Mapper para Exame Físico e Exames Laboratoriais (Fase 27)

_Reconhecimento de evidências REAIS do atendimento. A nota muda **apenas** porque ações reais (exames clicados, exame físico do log, sinais vitais) passam a ser reconhecidas — nenhuma lógica de scoring/rubrica/HealthBench foi alterada. A **Fase 26 (normalização textual) foi preservada** (nada em `normalizeFeedbackText`/`feedback-view-builder` de normalização foi tocado)._

## Problema
O feedback não reconhecia: (1) exame físico do log; (2) exames laboratoriais clicados/visualizados na aba "Exames Laboratoriais" (que **não eram registrados** em lugar nenhum); (3) exames agrupados (Hemograma, Marcadores inflamatórios) e seus analitos.

## Arquivos criados
- `lib/osce/evidence-mapper.ts` — mapa central: `expandExamName`, `mapPhysicalExamEvidence`, `mapEvidences`, `isValidExamToken`.

## Arquivos alterados
- `src/components/LaboratoryPanel.tsx` — nova prop `onExamViewed(id, label)`: **visualizar um laudo é uma ação real** → dispara o registro da evidência (por clique; o hemograma pré-exibido só conta se clicado).
- `app/caso/[id]/page.tsx` — estado `labsVisualizados` + handler; e integração do Evidence Mapper em:
  1. **payload do servidor** (`/api/osce/finalizar`): `examRequests` expandidos (Hemograma → analitos) + `labsVisualizados`; `physicalExamEvents` com uma entrada de evidências do exame físico reconhecidas do log;
  2. **camada de consistência** do view (`examesTexto` e `achadosTexto` recebem `evidencias.examesTextoExpandido`/`achadosTextoExpandido`);
  3. **FeedbackOSCE** (que alimenta **StudentTrace, PDF e Professor IA**): os labs visualizados entram na lista `examesSolicitados` passada ao componente, sendo reconhecidos por todos os consumidores.

## Evidências mapeadas
- **Hemograma** → hemograma, hemoglobina, hematócrito, leucócitos, leucograma, plaquetas, hemoconcentração, série vermelha/branca.
- **Marcadores inflamatórios** → PCR, proteína C reativa, VHS, procalcitonina.
- **Coagulograma** → TAP/TP, INR, TTPa, tempo de protrombina, D-dímero.
- **Urina** → EAS, urina tipo 1, sumário de urina.
- **Gasometria / Marcadores cardíacos / Função hepática / Função renal / Eletrólitos** → analitos respectivos.
- **Sinais vitais** (se solicitados) → PA, FC, FR, temperatura, SpO₂.
- **Exame físico (do log/manobras)** → avaliou estado geral / hidratação / perfusão / abdome; pesquisou hepatomegalia-visceromegalia; pesquisou sangramentos/petéquias (inclui prova do laço); realizou ausculta pulmonar / cardíaca; exame cardiovascular; avaliou membros/extremidades.

## Antes/depois (caso Dengue — Ana Paula Santos)
| Ação real | Antes | Depois |
|---|---|---|
| Clica **Hemograma** no painel | não registrado (painel não gravava) | conta como hemograma **+ hemoglobina, hematócrito, leucograma, leucócitos, plaquetas, hemoconcentração** |
| Clica **Marcadores inflamatórios** | não registrado | conta como **PCR** (+ VHS, procalcitonina) |
| Exame físico no log (hidratação, abdome, hepatomegalia, prova do laço, tórax) | texto cru, pouco reconhecido | evidências normalizadas: "avaliou hidratação", "avaliou abdome", "pesquisou hepatomegalia/visceromegalia", "pesquisou sangramentos/petéquias", "realizou ausculta pulmonar" |
| Sinais vitais solicitados | parcial | PA/FC/FR/temp/SpO₂ reconhecidos |
| **Nenhum** lab clicado | — | permanece **"não registrado"** (não inventa) |
| Texto inválido como "por" | risco de virar exame | **descartado** (`isValidExamToken`) |

Verificado por script: `expandExamName("Hemograma")` inclui hemoglobina/hematócrito/plaquetas/leucograma ✓; `expandExamName("Marcadores inflamatórios")` inclui PCR ✓; `mapPhysicalExamEvidence` extrai as evidências do log ✓; sem labs clicados → conjunto vazio ✓; `isValidExamToken("por") === false` ✓.

## Confirmações exigidas
- ✅ **Hemograma** reconhece hemoglobina / hematócrito / plaquetas / leucograma (e leucócitos/hemoconcentração).
- ✅ **Marcadores inflamatórios** reconhecem **PCR** (e VHS/procalcitonina).
- ✅ **Exame físico** vem do **log real** (manobras) — não de texto livre presumido.
- ✅ Se nenhum exame laboratorial foi clicado → mantém "não registrado" (não inventa exame).
- ✅ Tokens inválidos ("por") não contam como exame.
- ✅ A nota muda **apenas** por reconhecer evidências reais (scoring/pesos/rubrica intactos).
- ✅ **Fase 26 preservada** — `normalizeFeedbackText` e a normalização no `feedback-view-builder` permanecem intactas.

## Integração
- **HealthBench/feedback engine**: `examRequests`/`physicalExamEvents` do payload enriquecidos → o grader do servidor detecta os analitos; a camada de consistência (`examesTexto`/`achadosTexto`) reforça no view.
- **StudentTrace / PDF / Professor IA**: os labs visualizados entram em `examesSolicitados` passado ao `FeedbackOSCE`, de onde o `buildStudentTrace`, o texto do PDF e o `open-chat-context` os leem.

## Validação
- ✅ `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).
- ✅ Testes unitários do mapper (acima) confirmam os grupos, o exame físico e as guardas.

## Riscos / revisão
- O reconhecimento pelo grader do servidor depende de detecção textual dos analitos — o mapper injeta os sinônimos corretos; se a rubrica de um caso usar termos muito específicos, ampliar os sinônimos do grupo em `GRUPOS_EXAME`.
- O hemograma pré-exibido só conta ao ser **clicado** (decisão conservadora para não creditar sem ação).
- Revisão médica recomendada para calibrar quais analitos cada grupo deve "provar" por caso.

## Próximos passos
- Expandir grupos (ex.: perfil lipídico/glicêmico) conforme novos módulos do LaboratoryEngine.
- Opcional: registrar também o hemograma ao abrir a aba (se a equipe considerar "visualizar" = "ver o primeiro laudo").
