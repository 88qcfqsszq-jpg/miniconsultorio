# Relatório — Casos OSCE Dinâmicos (Beta) · Fase 3 · Pneumotórax Hipertensivo

Segundo caso dinâmico completo (1 arquivo TS = caso + rubrica), seguindo o contrato da Fase 2 e o
mapa Pulse/MEDIX da Fase 2.5. **Pulse não executado. Nenhum fluxo principal alterado.**

## Arquivos criados

- `lib/dynamic-osce/cases/pneumotorax-hipertensivo-adulto.ts` — caso completo + rubrica
  (`pneumotoraxHipertensivoAdulto`, `rubricaDynamicTensionPneumothoraxAdult001`).
- `RELATORIO-CASOS-DINAMICOS-BETA-FASE3-PNEUMOTORAX.md` (este).

## Arquivos alterados (todos do Beta)

- `lib/dynamic-osce/types.ts` — 11 novos `InterventionId` (torácicos/suporte), `InterventionCategory`
  ganhou `"procedimento"`, `PatientState` ganhou marcadores opcionais de pneumotórax
  (`tensaoPneumotorax`, `descomprimido`, `drenado`, `acessoVenoso`, `dorControlada`).
- `lib/dynamic-osce/dynamic-intervention-engine.ts` — catálogo das 11 novas intervenções.
- `lib/dynamic-osce/dynamic-state-engine.ts` — `recomputarClinica` com ramo de pneumotórax;
  `applyIntervention` com regras para descompressão, drenagem, O₂ alto fluxo, fluidos, RX/USG,
  aguardar exames e alta precoce; `reavaliar` piora sem descompressão.
- `lib/dynamic-osce/dynamic-feedback-engine.ts` — predicados `pn-*` da rubrica de pneumotórax.
- `lib/dynamic-osce/dynamic-rubric-link.ts` — registra a rubrica do novo arquivo.
- `lib/dynamic-osce/cases/index.ts` — registra o novo caso.
- `lib/dynamic-osce/pulse/pulse-action-map.ts` — acesso venoso, RX e USG torácicos.
- `lib/dynamic-osce/validators/validar-dynamic-engine.ts` — checagens de asma condicionadas a
  broncoespasmo; checagem de descompressão; alta insegura aceita `alta`/`alta_precoce`.
- `lib/dynamic-osce/scripts/validar-dynamic-osce.ts` — sequências de teste por caso (asma e
  pneumotórax), incluindo sequência errada com atraso terapêutico.
- `lib/dynamic-osce/README-DYNAMIC-OSCE.md` — casos disponíveis, padrão 1 caso = 1 arquivo, validação.

## Resumo clínico do caso

Adulto, dor torácica súbita + dispneia intensa após trauma torácico fechado. Estado inicial
**grave**: FC 132, FR 36, PA 90/60, SpO₂ 84%, MV abolido unilateral, hipertimpanismo, turgência
jugular, perfusão lentificada (tensão intratorácica 85/100). Diagnóstico: pneumotórax
hipertensivo; diferenciais perigosos: tamponamento, TEP maciço, IAM, dissecção, hemotórax.

## Rubrica criada (20 pontos, 6 domínios)

Comunicação (2), Anamnese (4), Exame físico (3), Exames e monitorização (3), Raciocínio (4),
Conduta e reavaliação (4). Cobra: reconhecer a tensão, dor súbita/dispneia, trauma/procedimento,
ausculta comparativa/percussão, jugulares/traqueia/perfusão, monitorização, **não atrasar por
RX se instável**, diferenciais perigosos, **descompressão imediata**, drenagem, reavaliação e
**não dar alta**. Critérios com `referenciasCaso` apontando a campos reais do caso (validados).

## Respostas fisiológicas (motor rule-based)

- **O₂ alto fluxo isolado**: SpO₂ sobe pouco; segue grave (não resolve a causa).
- **Descompressão**: SpO₂ e PA sobem, FR/FC caem — melhora crítica.
- **Drenagem após descompressão**: estabilização sustentada.
- **Fluidos sem descompressão**: suporte parcial da PA; não resolve.
- **Aguardar exames / RX antes da descompressão (instável)**: SpO₂/PA caem, FR sobe + **erro crítico**.
- **Alta precoce**: **erro crítico** automático.
- **Sem conduta / reavaliar sem descompressão**: deterioração progressiva.

## Compatibilidade Pulse/MEDIX

`conditionId: tension-pneumothorax-adult` (**strong**), `suggestedSimulationProvider: hybrid`,
cenários reais candidatos (`TensionPneumothoraxClosedVaried/OpenVaried/Bilateral.json`),
`requiresMedixOverlay: true`, provider em execução `medix-rule-based`. Pulse não executado.

## Validações executadas

- **`npm run build`** — ✅ `Compiled successfully`, `Finished TypeScript`, 35 páginas, rota
  `○ /casos-dinamicos`. `tsc --noEmit` = **0 erros**.
- **`npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts`** — ✅ exit 0, **2 casos**. Destaques
  do pneumotórax:
  ```
  Sequência correta: SpO₂ 84→96, PA 90→120, sem erro, 20/20, soma=nota ✅
  Sequência errada:  SpO₂ 84→77, erro crítico de atraso, descompressão NÃO pontua ✅
  Alta precoce:      erro crítico, 'não deu alta' NÃO cumprido ✅
  Pulse/MEDIX:       strong, provider medix-rule-based, Pulse não executado ✅
  ```
  O caso de asma continua ✅ (20/20, alta = erro crítico).

## Riscos remanescentes

- Anamnese/exame/comunicação por auto-registro (checkboxes), não interação real.
- Fisiologia por regras determinísticas (não Pulse).
- Ações farmacológicas não respiratórias são conduta correta sem efeito imediato de vitais.
- `npm run build` pode acusar `ENOTEMPTY` transitório quando há `next dev` do usuário rodando em
  paralelo (corrida no cache `.next`); compilação e type-check passam — confirmado por `tsc --noEmit`.

## Correção Fase 3.1 — template Pulse específico por caso

**Defeito corrigido:** o script validava o template Pulse com um id **hardcoded**
(`asthma-severe-adult`) para todos os casos — logo o pneumotórax exibia o template errado.

**Correção** (`lib/dynamic-osce/scripts/validar-dynamic-osce.ts`): a checagem passou a usar o
`scenarioTemplateId` derivado do próprio caso (`pulseCompatibility.conditionId`), e foi acrescida
a verificação de que o template **cobre as intervenções essenciais** do caso.

Resultado do log (por caso):
```
asma        → ✅ Template de cenário existe (asthma-severe-adult)
pneumotórax → ✅ Template de cenário existe (tension-pneumothorax-adult)
ambos       → ✅ Template cobre as intervenções essenciais do caso
```

**Ajuste de coerência** (`pulse-scenario-templates.ts`): o template `tension-pneumothorax-adult`
teve `requiredActions` alinhado para `["descompressao_toracica", "oxigenio_alto_fluxo",
"drenagem_toracica"]`, batendo com as intervenções essenciais do caso.

**Auditoria confirmada (sem alterações necessárias):**
- Caso: `conditionId="tension-pneumothorax-adult"`, `pulseScenarioId=…TensionPneumothoraxClosedVaried.json`,
  `pulseScenarioIsPlaceholder=false`, `rubricaId`/`caseId` coerentes. ✓
- capability-map: `tension-pneumothorax-adult` = **strong**, 3 cenários (Closed/Open/Bilateral). ✓
- action-map: descompressao_toracica, drenagem_toracica, oxigenio_alto_fluxo, aguardar_exames,
  alta_precoce presentes. ✓
- state-engine: descompressão reduz tensão (−70) e melhora SpO₂/PA; drenagem estabiliza;
  aguardar exames/RX antes da descompressão piora + erro; alta precoce = erro crítico. ✓
- feedback: sequência errada **não pontua** `pn-cond-descompressao`; alta precoce torna
  `pn-rac-sem-alta` **não cumprido**. ✓

**Validações Fase 3.1:** `npx tsx …validar-dynamic-osce.ts` → exit 0 (2 casos, templates corretos);
`tsc --noEmit` → 0 erros; `npm run build` → `Compiled successfully` + `Finished TypeScript`, rota
`/casos-dinamicos` gerada (sem `ENOTEMPTY` nesta execução).

## Confirmação de isolamento

Tudo em `lib/dynamic-osce/**` (+ relatório na raiz). Não foram tocados: `data/casos-v2`,
`lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`, `app/treinamento`, ECG, laboratório, exames,
dashboard, feedback principal. Nenhuma dependência nova. Pulse não integrado. Sem commit.
```
Arquivos da Fase 3:
lib/dynamic-osce/cases/pneumotorax-hipertensivo-adulto.ts   (novo — caso + rubrica)
lib/dynamic-osce/types.ts                                   (intervenções/categoria/markers)
lib/dynamic-osce/dynamic-intervention-engine.ts             (catálogo)
lib/dynamic-osce/dynamic-state-engine.ts                    (fisiologia pneumotórax)
lib/dynamic-osce/dynamic-feedback-engine.ts                 (predicados pn-*)
lib/dynamic-osce/dynamic-rubric-link.ts                     (registro rubrica)
lib/dynamic-osce/cases/index.ts                             (registro caso)
lib/dynamic-osce/pulse/pulse-action-map.ts                  (3 ações)
lib/dynamic-osce/validators/validar-dynamic-engine.ts       (guards)
lib/dynamic-osce/scripts/validar-dynamic-osce.ts            (sequências por caso)
lib/dynamic-osce/README-DYNAMIC-OSCE.md                     (doc)
```
