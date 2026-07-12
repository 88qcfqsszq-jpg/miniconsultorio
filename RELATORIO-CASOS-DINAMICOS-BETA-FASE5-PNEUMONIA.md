# Relatório — Casos OSCE Dinâmicos Beta · Fase 5 — Pneumonia Grave Adulto

## Arquivos criados

| Arquivo | Ação |
|---------|------|
| `lib/dynamic-osce/cases/pneumonia-grave-adulto.ts` | **Criado** — caso + rubrica completa |
| `RELATORIO-CASOS-DINAMICOS-BETA-FASE5-PNEUMONIA.md` | **Criado** — este arquivo |

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `lib/dynamic-osce/types.ts` | +6 InterventionIds, +3 PatientState fields |
| `lib/dynamic-osce/dynamic-intervention-engine.ts` | +6 entradas no catálogo |
| `lib/dynamic-osce/dynamic-state-engine.ts` | +ramo pneumonia em recomputarClinica, +6 cases, +reavaliar pneumonia, +alta_precoce pneumonia |
| `lib/dynamic-osce/dynamic-feedback-engine.ts` | +20 predicados pnm-* |
| `lib/dynamic-osce/dynamic-rubric-link.ts` | +import + registro rubrica pneumonia |
| `lib/dynamic-osce/cases/index.ts` | +pneumoniaGraveAdulto em DYNAMIC_CASES |
| `lib/dynamic-osce/pulse/pulse-scenario-templates.ts` | Template pneumonia-severe-adult atualizado (requiredActions, vitais, candidates) |
| `lib/dynamic-osce/pulse/pulse-action-map.ts` | +6 entradas para Fase 5 |
| `lib/dynamic-osce/scripts/validar-dynamic-osce.ts` | +SEQ_TESTE pneumonia, +checagem case-specific |
| `lib/dynamic-osce/README-DYNAMIC-OSCE.md` | +caso 4 na lista, +nota sobre 4 casos |

---

## Resumo clínico

**Caso:** Pneumonia Adquirida na Comunidade Grave (PAC grave) — Maria Santos, 62 anos, feminina.

**Regra clínica central:** O antibiótico deve ser iniciado em **até 1 hora** da chegada do
paciente com pneumonia grave. Cada hora de atraso aumenta mortalidade. A coleta de hemoculturas
deve ser feita *antes* do antibiótico sempre que possível, mas **sem atrasar o tratamento**.

**Diferencial crítico:** TEP, pneumotórax e insuficiência cardíaca devem ser excluídos ou
considerados, especialmente pela hipoxemia aguda.

**Estado inicial:** FC 118, FR 32, PA 105/65, SpO₂ 87%, Temp 39,1°C — febril, prostrado,
dispneico, alerta, com crepitações em base direita.

---

## Novos InterventionIds (Fase 5)

| Id | Descrição |
|----|-----------|
| `oxigenio_suplementar` | O₂ por cânula/máscara; alvo SpO₂ ≥ 92% |
| `antibiotico_precoce` | ATB ≤ 1 hora — essencial e crítico |
| `coleta_culturas_sem_atrasar_antibiotico` | Hemoculturas antes do ATB, sem atraso |
| `antitermico` | Reduz febre e FC; melhora conforto |
| `hidratacao_cautelosa` | Reposição volêmica criteriosa |
| `atrasar_antibiotico_por_exames` | Erro crítico — piora prognóstico |

---

## Novos PatientState markers (Fase 5)

| Campo | Tipo | Uso |
|-------|------|-----|
| `infeccaoPulmonar` | `number?` (0–100) | Discriminador do ramo pneumonia em `recomputarClinica` e `reavaliar` |
| `cargaInflamatoria` | `number?` (0–100) | Carga inflamatória sistêmica (correlaciona com febre) |
| `fluidosAplicados` | `boolean?` | Fluidos cautelosos administrados → melhora perfusão |

---

## Rubrica — 20 pontos, 6 domínios

| Domínio | Pts | Critérios |
|---------|-----|-----------|
| Comunicação | 2 | pnm-com-apresentacao, pnm-com-explicou |
| Anamnese | 4 | pnm-anm-febre-tosse, pnm-anm-dispneia-dor, pnm-anm-comorbidades, pnm-anm-alergias-vacinacao |
| Exame físico | 3 | pnm-exf-vitais-spo2, pnm-exf-ausculta-bilateral, pnm-exf-perfusao-consciencia |
| Exames e monitorização | 3 | pnm-exm-rx-torax, pnm-exm-laboratorio, pnm-exm-gaso-lactato-culturas |
| Raciocínio clínico | 4 | pnm-rac-reconhece-pac-grave, pnm-rac-considera-sepse, pnm-rac-nao-atrasa-antibiotico, pnm-rac-sem-alta |
| Conduta e reavaliação | 4 | pnm-cond-oxigenio, pnm-cond-antibiotico-precoce, pnm-cond-suporte, pnm-cond-reavaliou-internou |

---

## Respostas fisiológicas do motor

| Intervenção | Efeito no motor |
|-------------|-----------------|
| `oxigenio_suplementar` | SpO₂ +5 (teto 97%), FR -2 |
| `antibiotico_precoce` | antibioticoAplicado=true, cargaInflamatoria -5; sem melhora imediata dos vitais |
| `antitermico` | temp -0,8°C, FC -8 bpm |
| `hidratacao_cautelosa` | se PA < 100: PA +10/+5; FC -5; fluidosAplicados=true |
| `coleta_culturas_sem_atrasar_antibiotico` | estabilidade, sem efeito fisiológico |
| `atrasar_antibiotico_por_exames` | infeccaoPulmonar +10, cargaInflamatoria +10, SpO₂ -2, ERRO CRÍTICO |
| `reavaliar` (sem ATB + SpO₂<90%) | SpO₂ -3, FR +2, PA -4, infeccaoPulmonar +5 |
| `reavaliar` (com ATB + SpO₂≥92%) | tendencia=melhora |
| `alta_precoce` | ERRO CRÍTICO se SpO₂<92% ou FR>26 ou sem ATB |

---

## Compatibilidade Pulse/MEDIX

| Campo | Valor |
|-------|-------|
| `simulationProvider` | `medix-rule-based` (atual) |
| `pulseReady` | `true` |
| `conditionId` | `pneumonia-severe-adult` |
| `compatibility` | `strong` |
| `suggestedSimulationProvider` | `hybrid` |
| `requiresMedixOverlay` | `true` |
| `pediatricSafetyAdapterRequired` | `false` |
| Cenários Pulse candidatos | `Pneumonia.json`, `PneumoniaSevere.json`, `SepsisPneumonia.json` |

O `conditionId` `pneumonia-severe-adult` já existia no `pulse-capability-map.ts`. Nenhum arquivo de
capacidade foi alterado.

---

## Diferenciação clínica vs casos anteriores

| | Asma | Pneumotórax | DPOC | **Pneumonia** |
|---|---|---|---|---|
| Alvo SpO₂ | ≥ 92% | ≥ 92% | 88–92% | **≥ 92%** |
| Intervenção salvadora | Broncodilatadores | Descompressão | O₂ controlado + BD | **Antibiótico precoce** |
| Erro crítico principal | Alta insegura | Atrasar descompressão | Hiperóxia / sedação | **Atrasar antibiótico** |
| Marcador discriminador | `broncoespasmo > 0` | `tensaoPneumotorax` definido | `retencaoCO2` definido | **`infeccaoPulmonar` definido** |
| Risco sistêmico | Baixo (se tratado) | Alto (hemodinâmico) | Alto (hipercápnia) | **Alto (sepse)** |
| Avaliação de sepse | Não | Não | Não | **✅ Sim** |

---

## Resultados de validação

### Script (npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts)

```
RESUMO: ✅ TODAS as checagens passaram (4 caso(s)).
```

### TypeScript (npx tsc --noEmit)

```
(sem saída — 0 erros)
```

### Build (npm run build)

```
✓ Compiled successfully
35 páginas geradas, sem erros.
```

---

## Riscos remanescentes

- Pulse não integrado: `medix-rule-based` continua como único provider em execução.
- `pulseScenarioCandidates` (Pneumonia.json etc.) não foram verificados no repositório Pulse
  local — são referências conceituais para uso futuro.
- Motor não modela evolução temporal contínua (estado evolui por clique, não por tempo real).
- Antibiótico não produz melhora fisiológica imediata nos vitais — comportamento correto para
  fins didáticos, mas difere da expectativa de um aluno que espera feedback imediato.

---

## Confirmação de isolamento

Não foram tocados: `data/casos-v2`, `lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`,
`app/treinamento`, ECG, laboratório, exames, dashboard, feedback principal, AppShell, AppSidebar.
Casos existentes (asma, pneumotórax, DPOC) não foram alterados; validam corretamente.

Nenhuma dependência nova. Pulse não integrado. Sem commit.
