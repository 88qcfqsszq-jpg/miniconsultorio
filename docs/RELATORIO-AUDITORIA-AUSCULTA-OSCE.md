# Relatório de Auditoria — Ausculta nos Casos OSCE

_Data: 2026-07-02 · Auditoria somente-leitura (nenhum arquivo funcional alterado)._

## 1) Resumo executivo

- O OSCE **tem ausculta PULMONAR interativa com áudio real**, dirigida pelo diagnóstico do caso.
- O OSCE **NÃO usa** o catálogo canônico novo `lib/clinical-sounds/soundsCatalog.ts`. Ele usa um índice **próprio e paralelo**: `lib/ausculta/pulmonar-sounds.ts` (com um `export const LUNG_SOUNDS` que **colide de nome** com o do catálogo).
- **Não existe ausculta CARDÍACA nos casos.** Os 50 sons cardíacos (HS) só vivem na biblioteca do Centro Clínico; nenhum caso OSCE toca sopro/B3/B4/atrito.
- **Nenhum caso referencia `.wav` diretamente** (0 ocorrências em `data/casos-osce.ts` e `data/casos-pediatricos.ts`); o som é derivado do texto do diagnóstico/título.
- Os áudios pulmonares tocados são **100% reais e existentes**, e na maioria **clinicamente corretos**. Os riscos concentram-se em: (a) **pneumotórax e derrame tocando áudio NORMAL**; (b) **casos cardíacos sem áudio do achado que os define**; (c) **duplicação de fonte da verdade** (pulmonar-sounds vs soundsCatalog).

### Números
- Casos adultos: **61** (todos passam pela ausculta pulmonar via exame físico adulto). Pediátricos: **16** (não usam ausculta com áudio).
- Achados de ausculta pulmonar nos casos: **61** (1 padrão por caso) → **47 normais** + **14 patológicos**.
- **Compatíveis** (áudio real + tipo/foco corretos): **58**.
- **Duvidosos** (aceitável, porém simplificado): **3** — Pneumonia Atípica (crepitação focal vs. difusa), Atelectasia (fine_crackles como proxy), TEP (normal por padrão).
- **Risco didático alto / potencialmente incorreto**: **2** — Pneumotórax [62] e Derrame Pleural [16] tocam **MV normal** onde deveria haver MV **reduzido/abolido**.
- **Lacuna cardíaca** (achado-chave sem áudio): **6** casos — Pericardite, Endocardite, Estenose Mitral, Insuficiência Mitral, Estenose Aórtica, Estenose Mitral + FA.

## 2) Arquivos analisados
- Áudio/fonte: `docs/LS.csv`, `docs/HS.csv`, `public/HLS-CMDS/LS/*.wav` (50), `public/HLS-CMDS/HS/*.wav` (50), `lib/clinical-sounds/soundsCatalog.ts`.
- Ausculta OSCE: `lib/ausculta/pulmonar-sounds.ts`, `lib/ausculta/pulmonar-case-mapping.ts`, `components/ausculta/PulmonaryAuscultationPanel.tsx`, `components/ExameFisicoAdultoVisual.tsx`.
- Casos: `data/casos-osce.ts` (61 adultos), `data/casos-pediatricos.ts` (16 pediátricos).

## 3) Onde os sons são definidos hoje

| Camada | Arquivo | Papel |
|---|---|---|
| Índice de sons pulmonares (OSCE) | `lib/ausculta/pulmonar-sounds.ts` | 50 sons derivados **dos nomes dos .wav** (RAW_IDS). Tipos N/W/R/PR/FC/CC; locais RUA/LUA/RMA/LMA/RLA/LLA. Seleção com fallback de 7 passos. **Não lê o CSV** (comentário explícito). |
| Mapa diagnóstico → padrão | `lib/ausculta/pulmonar-case-mapping.ts` | `obterPadraoAuscultaPulmonarPorCaso()` decide, por regex no diagnóstico/título, qual som cada um dos 6 pontos toca. |
| UI interativa | `components/ausculta/PulmonaryAuscultationPanel.tsx` | Painel de ausculta (usado dentro de `ExameFisicoAdultoVisual`). |
| Catálogo canônico (Centro Clínico) | `lib/clinical-sounds/soundsCatalog.ts` | 100 sons (LS+HS) com metadados/CSV. **Só usado por** `SonsClinicosPage.tsx`. |

> **Duas fontes de verdade paralelas** para os sons pulmonares (mesmos 50 .wav): `pulmonar-sounds.ts` e `soundsCatalog.ts`. Colisão de nome no símbolo `LUNG_SOUNDS`.

## 4) Achados de ausculta nos casos (por padrão)

| Padrão (key) | Nº de casos | Som(ns) tocado(s) | Foco | Correção clínica |
|---|---|---|---|---|
| normal | 47 | MV normal bilateral | 6 pontos | ✅ (ver ressalva cardíaca) |
| pneumonia_dir | 3 | coarse_crackles | base direita (RLA) | ✅ correto |
| asma | 3 | wheezing difuso | bilateral | ✅ correto |
| dpoc | 3 | wheezing + rhonchi | difuso/médio | ✅ correto |
| edema/IC | 1 | fine_crackles bibasal | RMA/LMA/RLA/LLA | ✅ correto |
| tuberculose | 1 | coarse_crackles | ápice (RUA) | ✅ correto |
| atelectasia | 1 | fine_crackles (proxy) | base direita | ⚠️ proxy de MV reduzido |
| derrame | 1 | **normal** | — | ❌ deveria ser MV reduzido |
| pneumotorax | 1 | **normal** | — | ❌ deveria ser MV abolido |

Casos patológicos identificados (ids): PAC [2], Asma [3], Pneumonia Atípica [6], IC Sistólica [8], DPOC Exacerbação [9], TB [11], Derrame Pleural [16], Asma [31], Status Asthmaticus [32], DPOC Estável [33], DPOC Exacerbação [34], PCP/HIV [57], Pneumotórax [62], Atelectasia [63].

## 5) Tabela de incompatibilidades / riscos

| Caso (id) | Diagnóstico | Achado esperado | O que o áudio faz | Classificação |
|---|---|---|---|---|
| [62] | Pneumotórax | MV **abolido** no hemitórax | Toca **MV normal** | ❌ Risco alto (ensina errado) |
| [16] | Derrame Pleural | MV **reduzido** + macicez em base | Toca **MV normal** | ❌ Risco alto |
| [63] | Atelectasia | MV reduzido focal | Toca **fine_crackles** (proxy) | ⚠️ Duvidoso (proxy) |
| [6] | Pneumonia Atípica | Padrão difuso/intersticial | coarse_crackles **focal** base D | ⚠️ Duvidoso (simplificação) |
| TEP (—) | Tromboembolismo Pulmonar | Frequentemente normal/atrito | **normal** (default) | ⚠️ Defensável |
| [7] | Pericardite Aguda | **Atrito pericárdico** | Sem áudio cardíaco | ⚠️ Lacuna |
| [13] | Endocardite Infecciosa | **Sopro** (regurgitante) | Sem áudio cardíaco | ⚠️ Lacuna |
| [14] | Estenose Mitral | **Sopro diastólico** (ápice) | Sem áudio cardíaco | ⚠️ Lacuna |
| [23] | Insuficiência Mitral | **Sopro sistólico** (ápice→axila) | Sem áudio cardíaco | ⚠️ Lacuna |
| [24] | Estenose Aórtica | **Sopro sistólico** (foco aórtico) | Sem áudio cardíaco | ⚠️ Lacuna |
| [26] | Estenose Mitral + FA | Sopro diastólico + ritmo irregular | Sem áudio cardíaco | ⚠️ Lacuna |

**Checagens específicas solicitadas:**
- Som de base tocando no ápice? **Não** (TB usa ápice corretamente; pneumonia/IC usam base).
- Som unilateral tocando bilateral? **Não** (pneumonia é focal em 1 ponto).
- Pneumonia difusa sem justificativa? **Não** — pneumonia é focal; só "atípica" é simplificada.
- Asma/DPOC com crepitação por engano? **Não** — asma=sibilos, DPOC=sibilos+roncos.
- Pneumotórax com sibilos/crepitações? **Não** — usa normal (mas o problema é ser normal, não reduzido).
- B3/B4 usados como sopro? **N/A** — não há ausculta cardíaca nos casos.
- FA/Taquicardia tratadas como sopro? **N/A**.
- Atrito pericárdico confundido com Pleural Rub? **Não** — Pleural Rub é usado só em pleurite (pulmonar); pericardite não toca nada.

## 6) Riscos didáticos
1. **Alto:** Pneumotórax e Derrame Pleural tocam MV normal → o aluno pode auscultar "normal" e descartar a hipótese. Origem: **não há áudio de MV reduzido/abolido na base HLS-CMDS** (limitação da fonte). Já sinalizado como `TODO` no código.
2. **Médio:** 6 casos **cardíacos** cujo achado definidor (sopro/atrito) **não tem áudio** — o exame físico não permite "ouvir" o que define o diagnóstico. Os 50 sons cardíacos existem, mas não estão ligados aos casos.
3. **Baixo:** Atelectasia (proxy) e Pneumonia Atípica (focal) — simplificações aceitáveis.
4. **Manutenção:** duplicação de fonte da verdade (pulmonar-sounds vs soundsCatalog) e colisão de nome `LUNG_SOUNDS` — risco de divergência futura.

## 7) Arquitetura atual (respostas objetivas)
- **O OSCE já usa soundsCatalog.ts?** ❌ Não. Usa `lib/ausculta/pulmonar-sounds.ts`.
- **O OSCE usa outro sistema de sons?** ✅ Sim, o sistema `lib/ausculta/*` (pulmonar apenas).
- **Áudio real ou só texto?** **Áudio real** para pulmonar (50 .wav) + achado textual; **cardíaco é só texto** (sem áudio).
- **Há duplicação de fonte da verdade?** ✅ Sim — dois índices dos mesmos 50 .wav pulmonares, com colisão de nome.
- **Arquivos a migrar depois:** `lib/ausculta/pulmonar-sounds.ts` (unificar com o catálogo), `lib/ausculta/pulmonar-case-mapping.ts` (pneumotórax/derrame/atelectasia + passar a referenciar o catálogo), e **criar** o correlato cardíaco (`lib/ausculta/cardiaco-case-mapping.ts` + painel) ligado a `ExameFisicoAdultoVisual`.

## 8) Recomendação de migração
Unificar em torno de **uma única fonte da verdade** (`lib/clinical-sounds/soundsCatalog.ts`), adicionando ao catálogo um helper de seleção equivalente ao `selecionarSomPulmonar` (por tipo/local/gênero, com fallback), e fazer `pulmonar-case-mapping` e o painel consumirem o catálogo. Depois, estender para cardíaca reutilizando os 50 HS.

## 9) Plano de correção em etapas (proposta — nenhuma aplicada aqui)
1. **Unificar fonte da verdade (pulmonar):** apontar `pulmonar-sounds.ts` para o catálogo canônico (ou reexportar), eliminando a colisão `LUNG_SOUNDS`. Sem mudança visual.
2. **Corrigir pneumotórax/derrame/atelectasia:** enquanto não houver áudio de MV reduzido/abolido, exibir o ponto acometido como **"MV reduzido/abolido — sem áudio nesta base"** (silêncio honesto) em vez de tocar normal.
3. **Criar ausculta cardíaca por caso:** `cardiaco-case-mapping.ts` (diagnóstico → foco + tipo HS real) + painel cardíaco em `ExameFisicoAdultoVisual`, cobrindo Estenose Mitral/Aórtica, Insuf. Mitral, Endocardite, Pericardite (nota: atrito pericárdico não existe na base → tratar como conceito sem áudio), IC (B3/B4).
4. **Validação:** Playwright por caso confirmando que o áudio tocado corresponde ao diagnóstico e ao foco; regressão de HealthBench/feedback inalterada.

---
_Nenhum arquivo funcional foi modificado nesta auditoria. Único arquivo criado: este relatório._
