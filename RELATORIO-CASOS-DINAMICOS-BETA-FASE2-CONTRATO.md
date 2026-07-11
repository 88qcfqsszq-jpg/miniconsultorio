# Relatório — Casos OSCE Dinâmicos (Beta) · Fase 2 · Contrato

Criação do **contrato clínico-fisiológico definitivo** para casos e rubricas dinâmicas,
normalização do caso piloto, hardening de validadores e script permanente. **Nenhum caso novo
criado. Nenhum fluxo principal alterado.**

## Alterações feitas

### Contrato (tipos)
- `lib/dynamic-osce/types.ts` — `DynamicCase` reescrito como contrato forte com 13 grupos
  obrigatórios (identificação, paciente, diagnóstico, fisiologia, comunicação, anamnese, exame
  físico, exames, intervenções, reavaliação, erros críticos, simulação, rubricaId). `DynamicRubric`
  reforçado (rubricaId, caseId, totalPontos:20, critérios com `obrigatorio`, `tipoEvidencia`,
  `referenciasCaso`, `aliasesAceitos`, `penalidadeSeAusente?`, `erroCriticoAssociado?`).
  Adicionado `DOMINIOS_OBRIGATORIOS`.
- `lib/dynamic-osce/dynamic-case-contract.ts` — grupos obrigatórios, limites vitais, acessores de
  UI (`checklist*`, `intervencoesDoCaso`) e resolvedor de caminho (`resolveCaseField`,
  `referenciaCasoValida`) para validar `referenciasCaso`.

### Rubrica e feedback
- `lib/dynamic-osce/dynamic-rubric-link.ts` — rubrica piloto normalizada ao novo contrato; cada
  critério aponta para campos reais do caso via `referenciasCaso`. IDs de critério preservados.
- `lib/dynamic-osce/dynamic-feedback-engine.ts` — ajuste `total → totalPontos` (predicados por id
  inalterados).

### Caso piloto (essência clínica preservada)
- `lib/dynamic-osce/cases/piloto-asma-grave-adulto.ts` — normalizado ao contrato completo.
  Mantidos: SpO₂ 88%, FR 34, fala entrecortada, sibilos difusos, broncoespasmo 80/100, e a lógica
  O₂/salbutamol/ipratrópio/corticoide/magnésio/observação/internação/UTI. Gravidade **não**
  suavizada. `manobrasObrigatorias` passou a incluir "Uso de musculatura acessória" e "Fala /
  frases" (parte da avaliação de gravidade).
- `lib/dynamic-osce/cases/index.ts` — `getDynamicCase` por `identificacao.caseId`.

### Componentes do beta (lidos do contrato nested)
- `DynamicCaseCard.tsx`, `DynamicCasesBetaPage.tsx`, `DynamicCaseRunner.tsx` — passam a ler o
  contrato via acessores/paths (`identificacao.*`, `diagnostico.diagnosticoPrincipal`,
  `fisiologia.estadoInicial`, `simulacao.simulationProvider`, `checklist*`, `intervencoesDoCaso`).
  Card agora mostra o `status` do caso.

### Motor
- `dynamic-state-engine.ts` — **não** precisou mudar (compatível com `applyIntervention`, feedback
  e script). Apenas leitura via `fisiologia.estadoInicial`.

## Contrato final

Ver `lib/dynamic-osce/README-DYNAMIC-OSCE.md` (seção "Contrato definitivo"). Campos obrigatórios:
os 13 grupos de `DynamicCase` e a rubrica de 20 pontos em 6 domínios, com critérios ligados a
evidências reais do caso.

## Validações adicionadas

**Caso** (`validar-dynamic-case`): grupos obrigatórios completos; estadoInicial válido + faixas;
critérios de alta/internação/UTI presentes; anamnese/exame/exames/comunicação essenciais não
vazios; erros críticos de conduta/segurança/alta não vazios; toda intervenção reconhecida pelo
motor; `simulationProvider='pulse'` exige `pulseReady=true` + `pulseScenarioId`; pediátrico com
Pulse exige `pediatricSafetyAdapterRequired=true`; `pulseReady=false` não exige scenarioId;
rubricaId resolve.

**Rubrica** (`validar-dynamic-rubric`): soma 20; 6 domínios obrigatórios; cada domínio com ≥1
critério; sem pontos negativos; sem domínio zerado; cada critério com `referenciasCaso` que
resolvem a campos reais e não vazios do caso; `rubrica.caseId == caso.caseId`.

**Motor** (`validar-dynamic-engine`): intervenções essenciais e de resgate reconhecidas; cada
`respostaEsperadaPorIntervencao` produz efeito fisiológico ou mensagem; direções corretas
(O₂↑SpO₂, salbutamol↓broncoespasmo, corticoide sem efeito imediato); alta insegura gera erro
crítico.

## Resultado do build

`npm run build` — ✅ compilado, TypeScript **0 erros**, rota `○ /casos-dinamicos` gerada.

## Resultado do script

`npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts` — ✅ **exit 0**, todas as checagens:
```
Validação estrutural do caso: ✅
Validação da rubrica: ✅   |   Caso × rubrica: ✅ (soma 20)
Validação caso × motor: ✅
Sequência correta: SpO₂ 88%→95%, broncoespasmo 80→40, 20/20, soma=nota ✅
Sequência sem tratamento: SpO₂ 88%→84% (piora) ✅
Erro crítico (alta precoce): erro crítico + critério 'não deu alta' NÃO cumprido ✅
RESUMO: ✅ TODAS as checagens passaram (1 caso).
```

## Limitações atuais

- Sem Pulse real; motor por regras determinísticas.
- Anamnese/exame/comunicação por auto-registro (checkboxes), não por interação real.
- Estado evolui por ação (clique), não por tempo contínuo.
- Um único caso (piloto); expansão fica para a Fase 3.

## Próximos passos (Fase 3)

- Criar novos casos dinâmicos (DPOC, anafilaxia, choque) usando o contrato + checklist.
- Adapter `pulse` real implementando `applyIntervention`.
- Captura de anamnese/exame por interação real (chat/exame) em vez de checkboxes.
- Evolução por tempo contínuo (tick).

## Confirmação — nenhum app principal alterado

Fora do item de navegação já existente na sidebar (Fase 1), **nada** do app principal foi tocado
nesta fase. Não foram modificados: `data/casos-v2`, `lib/healthbench`, `app/caso/[id]`,
`app/faca-o-osce`, `app/treinamento`, ECG, laboratório, exames, feedback principal, dashboard.
Todas as mudanças da Fase 2 ficaram em `lib/dynamic-osce/**` e `components/dynamic-osce/**`.
Nenhum caso novo criado. Sem Pulse. Sem commit.
```
Arquivos tocados na Fase 2 (todos do Beta):
lib/dynamic-osce/types.ts
lib/dynamic-osce/dynamic-case-contract.ts
lib/dynamic-osce/dynamic-rubric-link.ts
lib/dynamic-osce/dynamic-feedback-engine.ts
lib/dynamic-osce/cases/piloto-asma-grave-adulto.ts
lib/dynamic-osce/cases/index.ts
lib/dynamic-osce/validators/validar-dynamic-case.ts
lib/dynamic-osce/validators/validar-dynamic-rubric.ts
lib/dynamic-osce/validators/validar-dynamic-engine.ts
lib/dynamic-osce/scripts/validar-dynamic-osce.ts
lib/dynamic-osce/README-DYNAMIC-OSCE.md
components/dynamic-osce/DynamicCaseCard.tsx
components/dynamic-osce/DynamicCasesBetaPage.tsx
components/dynamic-osce/DynamicCaseRunner.tsx
```
