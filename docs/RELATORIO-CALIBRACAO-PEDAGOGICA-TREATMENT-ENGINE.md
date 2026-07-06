# Relatório — Calibração Pedagógica do TreatmentResponseEngine

_O Mini Consultório é um simulador de **raciocínio clínico**, não de variabilidade biológica. A resposta terapêutica passa a ser **determinística pela qualidade da conduta**: boa conduta → boa evolução. A **decisão** de alta/observação/hospital continua em `evaluateDisposition` (algumas doenças permanecem em observação/hospital mesmo com boa resposta). Arquitetura preservada — só a lógica clínica da resposta foi alterada._

## Regra principal (nova filosofia)
| Conduta | Resposta terapêutica | Fisiologia |
|---|---|---|
| **Adequada** | **Boa resposta** (obrigatória) | melhora conforme a fisiopatologia esperada |
| **Parcial** | Resposta parcial | melhora incompleta |
| **Inadequada** | Sem resposta | quadro praticamente inalterado |
| **Ausente** | Sem resposta | história natural |
| **Perigosa** | Piora clínica | deterioração leve/moderada |

Deixou de existir "boa conduta, mas o paciente não respondeu". Não há variabilidade aleatória penalizando conduta correta — o motor já era determinístico (seed por caso+tempo+conduta) e agora o **rótulo** de resposta é ditado pela adequação, não por heurística de sinais.

## Regras alteradas
- `classifyTherapeuticResponse` reescrita: recebe a **adequação** e devolve o status (adequada→boa, parcial→parcial, inadequada/ausente→sem, perigosa→piora). Removida a heurística que comparava sinais de entrada/saída (podia rotular "sem resposta" com conduta correta).
- `TreatmentResponseEngine`: usa o mapeamento por adequação; a `disposition` continua vinda de `evaluateDisposition` (destino independente da resposta).

## Intervenções calibradas (fisiologia coerente)
- **Antitérmico (dipirona/paracetamol/AINE)** — a febre **cai como esperado** conforme o tempo: 39,5 → ~38,2 (60 min) → ~37,7–37,3 (120 min). Não fica "presa" em 39,x com boa resposta.
- **Oxigênio** — SpO₂ ↑ rápido; FR ↓; FC ↓ se era secundária à hipóxia.
- **Salbutamol/Ipratrópio** — FR ↓, SpO₂ ↑ (broncoespasmo cede); leve ↑ transitório da FC (beta-agonista).
- **Corticoide** — melhora progressiva (sem efeito máximo imediato — via perfil).
- **Hidratação oral** — FC ↓, PA/perfusão ↑ discretas. **Hidratação venosa** — FC ↓↓, PA ↑↑ mais rápido.
- **Nitrato** — dor isquêmica ↓, PA ↓ (sem hipotensão incoerente — efeito limitado e reclampado).
- **Insulina** — glicemia ↓ **progressiva** (nunca instantânea).
- **Glicose (nova)** — corrige hipoglicemia: glicemia ↑ rápido para faixa segura; taquicardia adrenérgica cede.
- **Antibiótico** — **não** normaliza febre/PCR/leucograma em 2 h (sem efeito imediato nos sinais); a melhora clínica vem do perfil + suporte.

## Sinais vitais / perfis modificados
- Efeito do antitérmico reforçado (fração de redução até ~0,85 do excedente, conforme tempo e adequação).
- Nova intervenção **`glucose`** (glicose/dextrose/G50/glicose oral/açúcar) reconhecida em `extractInterventions`.
- Novo perfil **`hipoglicemia`** (glicemia melhora forte; pode alta após correção; observar recorrência) + regra em `analyzeTreatment` (`required: glucose`).

## Boa resposta ≠ alta (destino permanece clínico)
Verificado que respostas boas **não** liberam alta quando a doença exige observação/hospital:
- **IAM**: dor/FC melhoram, PA estabiliza → **encaminhamento hospitalar**.
- **Sepse / Pneumonia grave / TEP / IC descompensada / Dengue com alarme / Cetoacidose / Choque / Hemorragia / Emergência hipertensiva**: melhoram parcialmente → **hospital**.

## Doenças testadas (conduta correta / parcial / inadequada / perigosa · 120 min)
| Doença | Correta | Parcial | Inadequada | Perigosa/Ausente |
|---|---|---|---|---|
| Asma leve-moderada | Boa · ALTA | Parcial · ALTA | Sem · OBS | Sem · OBS |
| DPOC exacerbação | Boa · HOSP | Parcial · OBS | Sem · HOSP | Sem · HOSP |
| Pneumonia grave | Boa · HOSP | Parcial · HOSP | Sem · HOSP | Sem · HOSP |
| Dengue clássica | Boa · ALTA | Parcial · OBS | Sem · OBS | **Piora · OBS** |
| Dengue com alarme | Boa · HOSP | Parcial · HOSP | Sem · HOSP | **Piora · HOSP** |
| Sepse | Boa · HOSP | Parcial · HOSP | Sem · HOSP | Sem · HOSP |
| IAM/SCA | Boa · HOSP | Parcial · HOSP | Sem · HOSP | Sem · HOSP |
| TEP | Boa · HOSP | Parcial · HOSP | Sem · HOSP | Sem · HOSP |
| IC descompensada | Boa · HOSP | Parcial · HOSP | Sem · HOSP | Sem · HOSP |
| HAS (urgência) | Boa · OBS | — · OBS | Sem · OBS | Sem · OBS |
| Hipoglicemia | Boa · ALTA | Parcial · ALTA | Sem · OBS | Sem · OBS |
| Cetoacidose | Boa · HOSP | Parcial · HOSP | Sem · HOSP | Sem · HOSP |

## Resultados-chave
- **Febre**: 39,5 °C + antitérmico com conduta adequada → 37,7 °C (60 min) / 37,3 °C (120 min) → **boa resposta · alta**. Nunca fica em 39,2–39,4 com boa conduta.
- **Hipoglicemia**: glicemia 42 + glicose (correta) → 105 mg/dL → **boa resposta · alta**; sem glicose → permanece baixa → **observação**.
- ✅ Conduta correta ⇒ **boa resposta** em todas as doenças testadas.
- ✅ Conduta parcial ⇒ resposta parcial; inadequada/ausente ⇒ sem resposta; perigosa ⇒ piora.
- ✅ Boa resposta **não** vira alta em doença grave (destino por `evaluateDisposition`).
- ✅ Determinismo mantido; `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).

## Arquivos alterados (calibração)
- `src/treatment/treatmentResponseProfiles.ts` — `classifyTherapeuticResponse` por adequação; matriz de efeitos + glicose.
- `src/treatment/TreatmentResponseEngine.ts` — resposta terapêutica por adequação.
- `src/treatment/applyTreatmentResponseToVitals.ts` — antitérmico reforçado; efeito de glicose.
- `src/treatment/treatmentTypes.ts` / `treatmentKeywords.ts` / `analyzeTreatment.ts` — intervenção `glucose`.
- `src/vitals/vitalProfiles.ts` — perfil `hipoglicemia` + resolvedor.

## Pontos para revisão médica
- Frações de melhora por intervenção e curva temporal (30–120 min) — calibração fina por especialidade.
- Metas de correção (febre, glicemia na hipoglicemia/cetoacidose) e velocidade.
- Definição de "conduta adequada" por caso (regras `required`/`partialAny`) — validar o que caracteriza boa conduta em cada doença.
- Perfis que toleram sinais fora do padrão (ex.: DPOC com SpO₂ 88–92%).
