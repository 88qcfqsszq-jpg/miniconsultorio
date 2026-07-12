# Relatório — Casos OSCE Dinâmicos (Beta) · Fase 4 · DPOC Exacerbado

## Resumo executivo

Terceiro caso dinâmico completo criado: **"DPOC Exacerbado — Adulto"** (`dynamic-copd-exacerbation-adult-001`).
Padrão 1 caso = 1 arquivo TS mantido. Todos os 3 casos validam com 100% das checagens.

| Caso | caseId | Status |
|---|---|---|
| Crise Asmática Grave | `dynamic-asthma-severe-adult-001` | ✅ intacto |
| Pneumotórax Hipertensivo | `dynamic-tension-pneumothorax-adult-001` | ✅ intacto |
| **DPOC Exacerbado** | `dynamic-copd-exacerbation-adult-001` | ✅ novo |

## Regra clínica central

**O₂ alvo 88–92% no DPOC com retenção de CO₂.** Hiperóxia pode piorar a hipercapnia por mecanismos multifatoriais (efeito Haldane, desigualdade V/Q, alteração do drive respiratório); por isso, na exacerbação de DPOC, o oxigênio deve ser titulado para alvo de SpO₂ 88–92%, com monitorização clínica e gasométrica quando indicado. A intervenção `oxigenio_alto_fluxo_sem_controle` em paciente com `retencaoCO2` definido:
- Gera `erroCritico` imediatamente
- Aumenta `retencaoCO2` em 25 pontos
- Reduz `fr` em 4 irpm (efeito da hipercapnia progressiva)
- Marcador `hiperoxia = true` → reavaliar piora SpO₂ em –10% (agravamento hipercápnico)

## Novos InterventionIds (Fase 4)

| Id | Label | Categoria | Efeito no motor |
|---|---|---|---|
| `oxigenio_controlado` | O₂ controlado (alvo 88–92%) | suporte | SpO₂ +5, teto 92% |
| `oxigenio_alto_fluxo_sem_controle` | O₂ alto fluxo s/ controle | suporte | **ERRO CRÍTICO** em DPOC; hiperoxia=true; CO₂ piora |
| `ventilacao_nao_invasiva` | VNI (CPAP/BiPAP) | procedimento | FR –6, SpO₂ +3 (teto 92% em DPOC), CO₂ –15 |
| `antibiotico_se_indicado` | Antibiótico (se indicado) | medicação | antibioticoAplicado=true; sem efeito fisiológico imediato |
| `sedativo_sem_indicacao` | Sedativo sem indicação | medicação | **ERRO CRÍTICO** em DPOC; FR –6, SpO₂ –6 |

## Novos marcadores de PatientState (Fase 4)

| Marcador | Tipo | Descrição |
|---|---|---|
| `retencaoCO2` | `number?` | 0–100; discriminador do ramo DPOC em `recomputarClinica` |
| `broncodilatacaoDpoc` | `number?` | 0–100; obstrução DPOC (reduzida por salbutamol/ipratrópio) |
| `oxigenioControlado` | `boolean?` | O₂ em modo titulado 88–92% |
| `hiperoxia` | `boolean?` | Hiperóxia instalada; reavaliar piora SpO₂ se presente |
| `vniAplicada` | `boolean?` | VNI em curso |
| `antibioticoAplicado` | `boolean?` | Antibiótico administrado |

## Estado inicial do caso

```
FC: 108 bpm | FR: 30 irpm | PA: 145/85 mmHg | SpO₂: 84% | Temp: 37,8°C
retencaoCO2: 60 | broncodilatacaoDpoc: 70 | hiperoxia: false
```

## Rubrica dinâmica — 20 pontos, 6 domínios

| Domínio | Pts | Critérios obrigatórios |
|---|---|---|
| Comunicação | 2 | — |
| Anamnese | 4 | dispneia, DPOC/tabag, escarro, broncodilatador |
| Exame físico | 3 | sinais vitais/SpO₂, ausculta bilateral |
| Exames e monitorização | 3 | gasometria, oximetria contínua, alvo SpO₂ 88–92% |
| Raciocínio clínico | 4 | reconhece DPOC, identifica risco hiperóxia, não deu alta |
| Conduta e reavaliação | 4 | O₂ controlado, dupla broncodilatação, corticoide |

## Cenários testados pelo script de validação

| Cenário | Sequência | SpO₂ final | Erro crítico | Resultado |
|---|---|---|---|---|
| Correto | monitorizacao → O₂ controlado → salbutamol → ipratrópio → corticoide → antibiótico → VNI → reavaliar | 92% (+8) | ✗ | 20/20 ✅ |
| Sem tratamento | O₂ alto fluxo sem controle → reavaliar | 78% (–6) | ✅ hiperóxia | SpO₂ piora ✅ |
| Alta precoce | alta_precoce (SpO₂=84%<88%) | — | ✅ | erroCritico ✅ |

## Arquivos criados

- `lib/dynamic-osce/cases/dpoc-exacerbado-adulto.ts` — caso + rubrica (1 arquivo)

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `lib/dynamic-osce/types.ts` | +5 InterventionIds; +6 marcadores opcionais em PatientState |
| `lib/dynamic-osce/dynamic-intervention-engine.ts` | +5 entradas no catálogo |
| `lib/dynamic-osce/dynamic-state-engine.ts` | `alvoSpo2` com teto DPOC; ramo DPOC em `recomputarClinica`; `salbutamol`/`ipratropio` afetam `broncodilatacaoDpoc`; `reavaliar` com ramos hiperóxia/DPOC; `alta_precoce` com critério DPOC; +5 novos cases |
| `lib/dynamic-osce/dynamic-feedback-engine.ts` | +20 predicados `dpoc-*` |
| `lib/dynamic-osce/dynamic-rubric-link.ts` | Import + registro da rubrica DPOC |
| `lib/dynamic-osce/cases/index.ts` | Import + registro do caso DPOC |
| `lib/dynamic-osce/pulse/pulse-scenario-templates.ts` | Template `copd-exacerbation-adult` atualizado: fisiologia inicial, `requiredActions: [oxigenio_controlado, ...]`, `dangerousDelays` corretos |
| `lib/dynamic-osce/pulse/pulse-action-map.ts` | +5 entradas para os novos InterventionIds |
| `lib/dynamic-osce/scripts/validar-dynamic-osce.ts` | SEQ_TESTE DPOC adicionado; check de conduta definitiva tornado caso-específico |
| `lib/dynamic-osce/README-DYNAMIC-OSCE.md` | Terceiro caso documentado |

## Resultado do script de validação

```
RESUMO: ✅ TODAS as checagens passaram (3 caso(s)).
```

Todos os casos: asma (25 checks), pneumotórax (30 checks + 13 do avaliador contextual), DPOC (22 checks).

## Resultado type-check / build

- `npx tsc --noEmit` → **0 erros**
- `npm run build` → **✓ Compiled successfully** + rota `○ /casos-dinamicos` gerada

## Diferenciação clínica vs casos anteriores

| | Asma | Pneumotórax | DPOC |
|---|---|---|---|
| Alvo SpO₂ | ≥ 92% | ≥ 92% | **88–92%** |
| Intervenção salvadora | Broncodilatadores | Descompressão | O₂ controlado + broncodilatadores |
| Erro crítico principal | Alta insegura | Atrasar descompressão | Hiperóxia / sedação |
| Marcador discriminador | `broncoespasmo > 0` | `tensaoPneumotorax` definido | `retencaoCO2` definido |
| VNI relevante | Não | Não | ✅ Sim |

## Correção Fase 4.1 — refinamento clínico DPOC

Auditoria realizada após criação da Fase 4. Todas as correções são em arquivos existentes; nenhum
novo caso ou funcionalidade foi adicionado.

### Mudanças aplicadas

| # | Arquivo | Campo / Trecho | Antes | Depois |
|---|---------|----------------|-------|--------|
| 1 | `cases/dpoc-exacerbado-adulto.ts` | `estadoInicialBase.clinical.estadoGeral` | "dispneico e letárgico (hipercápnia grave)" | "dispneico, cansado, ansioso, alerta" |
| 2 | `cases/dpoc-exacerbado-adulto.ts` | `criteriosPiora[0]` | "> 94% (hiperóxia)" | "> 92% (acima do alvo — risco de hipercapnia progressiva)" |
| 3 | `cases/dpoc-exacerbado-adulto.ts` | `errosCriticosConduta[0]` | "(hiperóxia → narcose)" | "(hiperóxia pode agravar hipercapnia por mecanismos múltiplos)" |
| 4 | `cases/dpoc-exacerbado-adulto.ts` | `pulseScenarioCandidates[1]` | `COPDExacerbationSevere.json` | `COPDSevereEmphysema.json` |
| 5 | `dynamic-state-engine.ts` | DPOC `recomputarClinica` — ordem de checks | `spo2 < 88` avaliado antes de `s.hiperoxia` | `s.hiperoxia` avaliado PRIMEIRO (sonolência/confusão apenas por hiperóxia ou falha) |
| 6 | `dynamic-state-engine.ts` | comentário `oxigenio_alto_fluxo_sem_controle` | "suprime drive hipóxico → narcose" | "pode piorar hipercapnia por mecanismos multifatoriais (efeito Haldane, V/Q, drive)" |
| 7 | `RELATORIO-CASOS-DINAMICOS-BETA-FASE4-DPOC.md` | "Regra clínica central" | Drive hipóxico como mecanismo isolado | Multifatorial: Haldane, V/Q, drive; alvo 88–92% com monitorização clínica e gasométrica |

### Motivação clínica

**Sonolência/confusão não são sintomas iniciais de DPOC exacerbado.** Em hipercapnia crônica o
paciente está adaptado ao CO₂ elevado — ansiedade, taquipneia e uso de musculatura acessória são
o quadro típico. Letargia é sinal de deterioração (narcose hipercápnica) e deve aparecer apenas
como consequência da hiperóxia iatrogênica ou de falha terapêutica.

**A hiperóxia em DPOC não age por um único mecanismo.** A visão simplificada do "drive hipóxico"
foi superada. Os três mecanismos atualmente aceitos são:
1. **Efeito Haldane** — O₂ desloca CO₂ da hemoglobina, elevando CO₂ livre no plasma.
2. **Desigualdade V/Q** — O₂ reverte vasoconstricção hipóxica, aumentando perfusão de zonas
   mal-ventiladas e elevando PCO₂ arterial.
3. **Alteração do drive respiratório** — O₂ reduz o estímulo ventilatório já comprometido,
   sobretudo em hipercapnia crônica com set-point elevado.

**Cenário Pulse corrigido.** `COPDExacerbationSevere.json` não existe no repositório de referência;
substituído por `COPDSevereEmphysema.json`, que corresponde ao fenótipo enfisema/hiperinsuflado
modelado pelo engine.

### Critérios de aceitação Fase 4.1 — resultado

- [x] `estadoGeral` inicial = "dispneico, cansado, ansioso, alerta" (sem letargia)
- [x] Sonolência/confusão apenas como consequência de hiperóxia (`s.hiperoxia`) ou falha
- [x] Hiperóxia descrita com linguagem multifatorial (Haldane, V/Q, drive)
- [x] `pulseScenarioCandidates` aponta somente para arquivos existentes no repositório Pulse
- [x] Todos os 3 casos validam (`npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts`)
- [x] `npx tsc --noEmit` — 0 erros
- [x] `npm run build` compila com sucesso
- [x] Fluxo OSCE principal, AppShell, ECG, HealthBench — intocados
- [x] Sem commit

## Confirmação de isolamento

Não foram tocados: `data/casos-v2`, `lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`,
`app/treinamento`, ECG, laboratório, exames, dashboard, feedback principal, AppShell, AppSidebar.

Nenhuma dependência nova. Pulse não integrado. Sem commit.
