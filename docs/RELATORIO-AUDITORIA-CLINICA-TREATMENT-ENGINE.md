# Relatório — Auditoria Clínica do TreatmentResponseEngine

_Fase de **calibração clínica**. A arquitetura foi preservada (nenhum módulo recriado); apenas ajustes de comportamento clínico e segurança da decisão. Fluxo inalterado: conduta → extractInterventions → analyzeTreatment → generateDischargeVitals → applyTreatmentResponseToVitals → evaluateDisposition._

## Problema encontrado (reproduzido)
Paciente febril (39,5 °C) que recebeu **Dipirona** e foi reavaliado após 120 min permanecia com temperatura ≈39,2–39,5 °C e o sistema classificava **"Estável para alta"**.

Causa-raiz confirmada por auditoria de ponta a ponta:
1. `extractInterventions` reconhecia dipirona, mas **não** "novalgina", e **não** contava ibuprofeno/AINE como antitérmico.
2. `applyTreatmentResponseToVitals` não modelava a redução da febre pela conduta — quando o perfil tinha temperatura "estável" (ex.: `normal_inespecifico`), a febre não caía.
3. `evaluateDisposition` só penalizava temperatura **> 39,5 °C**; 38,5–39,5 °C passava como "alta segura".

Teste (perfil inespecífico, 39,5 °C, dipirona, 120 min):
- **Antes:** temp 39,5 → 39,5 · disposição **alta_segura** ❌
- **Depois:** temp 39,5 → 38,3 · disposição **observação** · reason "Febre persistente após reavaliação." ✅

## Correções realizadas
1. **Reconhecimento de antitérmicos** (`treatmentKeywords.ts`): acrescentados *novalgina, tylenol, ibuprofeno, AINE, anti-inflamatório, nimesulida, diclofenaco, naproxeno, cetoprofeno* como antitérmicos (o risco de AINE/AAS na dengue continua tratado à parte).
2. **Temperatura em `evaluateDisposition`** (regra calibrada):
   - < 38,0 °C → não penaliza;
   - 38,0–38,4 °C → **observação** (avaliar contexto antes da alta);
   - ≥ 38,5 °C → **nunca alta simples** (mínimo observação) + reason "Febre persistente após reavaliação."; se houve antitérmico e ≥60 min, acrescenta "Resposta insuficiente ao antitérmico".
3. **Matriz de evolução por intervenção** (`applyTreatmentResponseToVitals.ts` + `INTERVENTION_EFFECTS`): cada intervenção passa a ter efeito fisiológico próprio, parcial e escalado pelo tempo/adequação.
4. **Antitérmico/antibiótico não normalizam febre alta em 2 h**: antitérmico reduz a febre **parcialmente** (no máx. ~50 % do excedente em 120 min); antibiótico **não** tem efeito imediato sobre febre/FC. Insulina reduz glicemia **progressivamente** (não imediata).
5. **Contexto clínico em `evaluateDisposition`** (`context` opcional, retrocompatível): considera tempo de observação, antitérmico e adequação da conduta — não só limites absolutos.
6. **Status de Resposta Terapêutica** (`classifyTherapeuticResponse`): Boa resposta / Resposta parcial / Sem resposta / Piora clínica, exibido **antes** da decisão final. Sem conduta → "Sem resposta" (evita "boa resposta" sem tratamento).
7. **Novos perfis de alto risco**: `choque` e `hemorragia` (antes caíam em `normal_inespecifico` e podiam receber alta) → `nuncaAltaDireta`. Separação **emergência hipertensiva** (lesão de órgão-alvo → hospital) de **urgência hipertensiva** (observação).

## Parâmetros calibrados / limites modificados
| Sinal | Antes | Depois | Justificativa |
|---|---|---|---|
| Temperatura | penaliza só > 39,5 (observação) | ≥ 38,5 nunca alta; 38,0–38,4 observação | Febre persistente contraindica alta simples |
| SpO₂ | < 88 hospital · < 92 obs | **< 90 hospital · < 94 obs** | Alta exige SpO₂ ≥ 94% |
| FR | > 32 hospital · ≥ 25 obs | **> 30 hospital · ≥ 24 obs** | Taquipneia persistente contraindica alta |
| FC / PA / glicemia / dor | — | inalterados | Já compatíveis |
| Antitérmico (efeito) | inexistente | redução **parcial** da febre | Não normaliza febre alta em 2 h |
| Antibiótico (efeito) | inexistente | **sem** normalização de febre em 2 h | Farmacocinética real |
| Insulina (efeito) | via perfil | redução **progressiva** da glicemia | Correção lenta e segura |

## Matriz de evolução esperada por intervenção
- **Antitérmico/AINE** → temperatura ↓ parcial (não normaliza febre alta em 2 h).
- **Oxigênio** → SpO₂ ↑ rápido.
- **Broncodilatador** → FR ↓, SpO₂ ↑, FC ↑ discreta (beta-agonista).
- **Hidratação oral** → FC ↓, PA ↑ (perfusão). **Hidratação venosa** → FC ↓↓, PA ↑↑.
- **Analgesia** → dor ↓. **Nitrato** → dor isquêmica ↓, PA ↓.
- **Insulina** → glicemia ↓ progressiva. **Antibiótico** → sem normalização de febre/PCR/leucograma em 2 h.

## Diagnósticos de alto risco — nunca alta simples (verificado)
IAM/SCA · TEP · Sepse · Dengue com alarme · Pneumonia grave · IC descompensada · Crise asmática grave · DPOC grave · Cetoacidose · **Choque** · **Hemorragia importante** · **Emergência hipertensiva** — todos forçados a observação/hospital por `evaluateDisposition`, independentemente da qualidade da conduta.

## Testes executados (120 min) — disposição × qualidade da conduta
| Diagnóstico | Correta | Parcial | Inadequada | Sem conduta |
|---|---|---|---|---|
| Asma leve-moderada | ALTA | ALTA | Observação | Observação |
| Pneumonia grave | HOSP | HOSP | HOSP | HOSP |
| Sepse | HOSP | HOSP | HOSP | HOSP |
| Dengue clássica | ALTA | ALTA | Observação | Observação |
| IAM/SCA | HOSP | HOSP | HOSP | HOSP |
| TEP | HOSP | HOSP | HOSP | HOSP |
| IC descompensada | HOSP | HOSP | HOSP | HOSP |
| Cetoacidose | HOSP | HOSP | HOSP | HOSP |
| Emergência hipertensiva | HOSP | HOSP | HOSP | HOSP |
| Urgência hipertensiva | Observação | Observação | Observação | Observação |
| Viral febril | ALTA | ALTA | Observação | Observação |
| Anemia ferropriva | ALTA | ALTA | ALTA | ALTA |
| Choque | HOSP | — | — | HOSP |
| Hemorragia importante | HOSP | — | — | HOSP |

Além disso:
- **Bug da febre**: 39,5 °C + dipirona por 120 min → agora **observação** (antes alta). Virose que efetivamente normaliza a febre (39,8 → 36,5) → alta (correto).
- **Status de resposta terapêutica** coerente (boa/parcial/sem/piora) e exibido antes da decisão.
- ✅ **Nenhum quadro de alto risco recebeu alta simples.**
- ✅ **Determinismo** mantido (mesmo caso + conduta + tempo → mesmos sinais e disposição).
- ✅ `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).

## Arquivos alterados (calibração)
- `src/treatment/treatmentKeywords.ts` — antitérmicos ampliados.
- `src/treatment/applyTreatmentResponseToVitals.ts` — matriz de efeitos por intervenção; antitérmico parcial.
- `src/treatment/treatmentResponseProfiles.ts` — `ADEQUACY_WEIGHT`, `INTERVENTION_EFFECTS`, `classifyTherapeuticResponse`.
- `src/treatment/treatmentTypes.ts` — tipo `TherapeuticResponse` + rótulos.
- `src/treatment/analyzeTreatment.ts` — regras para `choque`, `hemorragia`, `emergencia_hipertensiva`.
- `src/treatment/TreatmentResponseEngine.ts` — passa `context` à disposição; calcula resposta terapêutica.
- `src/vitals/evaluateDisposition.ts` — temperatura calibrada; SpO₂/FR ajustados; `context` opcional.
- `src/vitals/vitalProfiles.ts` — perfis `choque`, `hemorragia`, `emergencia_hipertensiva`; split urgência/emergência HAS.
- `src/components/VitalsReassessment.tsx` — exibe o status de resposta terapêutica antes da decisão.

## Pontos que ainda exigem revisão médica
- Magnitudes da matriz de intervenções (fatores de melhora/piora) — calibração fina por especialidade.
- Limiares de alta (SpO₂ ≥ 94, FR < 24, febre) — validar contra protocolos locais (ex.: DPOC tolera SpO₂ 88–92).
- Fração de redução da febre por antitérmico e curva temporal (30–120 min).
- Velocidade de queda da glicemia sob insulina e metas de correção.
- Reconhecimento textual de "alta/encaminhamento" na conduta (hoje a segurança vem dos perfis, não da leitura de "alta" no texto).
- Casos de anemia/quadros crônicos com sinais vitais normais: a disposição é de baixo risco por design — confirmar que a triagem clínica desses casos não depende só dos sinais vitais.
