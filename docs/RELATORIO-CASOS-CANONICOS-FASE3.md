# Relatório — Casos Canônicos (Fase 3)

_Data: 2026-07-03 · Etapa **aditiva e compatível**. Nenhum arquivo funcional existente foi alterado._

## Arquivos criados
| Arquivo | Caso | id legado |
|---|---|---|
| `clinical-engine/cases/asma.ts` | Asma Aguda | **3** |
| `clinical-engine/cases/dpoc.ts` | DPOC - Exacerbação Aguda | **9** |
| `clinical-engine/cases/insuficiencia-cardiaca.ts` | Insuficiência Cardíaca Esquerda (Sistólica) | **8** |
| `clinical-engine/cases/sindrome-coronariana.ts` | Dor Torácica - SCA (IAMCSST) | **1** |
| `clinical-engine/cases/tep.ts` | Tromboembolismo Pulmonar | **10** |
| `clinical-engine/cases/index.ts` | Registro (`CANONICAL_CASES`, índices por id) | — |
| `docs/RELATORIO-CASOS-CANONICOS-FASE3.md` | Este relatório | — |

## Arquivos modificados
**Nenhum.** Só criação em `clinical-engine/cases/*` + este relatório. `data/casos-osce.ts`, caso PAC canônico, HealthBench, Feedback, OSCE, Centro Clínico, rotas e layout **intactos**.

## Casos convertidos (todos com os 15 blocos)
Cada arquivo segue o padrão do `CANONICAL_PAC`: identificação · paciente · história · script do paciente · exame físico · ausculta · exames · imagens · ECG · diagnóstico (por que é / por que não é) · conduta · rubrica HealthBench · feedback esperado · Centro Clínico relacionado · Professor IA.

## Dados migrados 1:1 do legado (verificados)
| Caso | rubrica (critérios · pesos) | checklist | erros críticos | sinais vitais |
|---|---|---|---|---|
| Asma (3) | Gravidade 25 · Broncodilatador 25 · Corticoide 20 · Oxigenio 15 | 6 críticos | 2 (2 / 2.5) | 130/85, FC110, FR28, T36.9, SpO₂88 |
| DPOC (9) | Diag.Dif 15 · Oxigenação 25 · Broncodilatador 30 | 7 críticos | 2 (2.5 / 2) | 140/85, FC105, FR32, T37.2, SpO₂85 |
| IC (8) | Sinais 20 · Descongestiva 25 · FEVE 25 | 7 críticos | 2 (2.5 / 2) | 150/95, FC102, FR28, T36.8, SpO₂90 |
| SCA (1) | Coleta 15 · Diagnóstico 25 · Conduta 20 | 4 críticos | 2 (2 / 2.5) | 160/95, FC102, FR20, T36.8, SpO₂96 |
| TEP (10) | Fatores 15 · Diagnóstico 25 · Anticoagulante 30 | 6 críticos | 2 (2.5 / 2) | 130/85, FC115, FR28, T37.0, SpO₂91 |

Também migrados fielmente: paciente (nome/idade/sexo/queixa), diagnóstico principal, diagnósticos diferenciais, respostas do paciente, achados de ausculta e conduta correta.

## Ancoragem em sons/imagens (soundsCatalog / Open-i)
- **Asma** → Sibilos `M_W_RUA.wav`.
- **DPOC** → Sibilos `M_W_RUA.wav` + Roncos `M_R_LUA.wav`.
- **IC** → Crepitações finas `M_FC_RLA.wav` (pulmonar) + **B3** `F_S3_A.wav` (cardíaca).
- **SCA** → cardíaca normal `M_N_RUSB.wav` (o achado-chave é o **ECG com supra de ST**).
- **TEP** → pulmonar **normal** `M_N_RUA.wav` (ponto didático: ausculta/RX normais NÃO excluem TEP).
- Imagens com termo Open-i: cardiomegalia (IC), hiperinsuflação (asma/DPOC), `pulmonary embolism ct` (TEP — nota: Open-i é coleção de RX, pode não retornar). Marcado como enriquecimento onde aplicável.

## Dados enriquecidos (didáticos, não presentes explícitos no legado)
- Script do paciente **vago × completo** (pergunta ruim × dirigida).
- **Red flags** estruturadas.
- **Por que não é** de cada diferencial.
- Critérios de **internação/alta**.
- **Feedback esperado** (resposta modelo, checklist nota máxima, erros comuns, pegadinhas, plano de reforço).
- **Professor IA** (reforços, perguntas socráticas, erros a explorar, mini-aula, plano de treino).
- **Links** do Centro Clínico (semiologia/fluxos/exames/imagens/sons).
> Antecedentes/medicações marcados "(enriquecimento)" onde inferidos clinicamente e não explícitos no legado.

## Pendências
- Alguns antecedentes/medicações foram inferidos (marcados como enriquecimento) por não estarem detalhados no legado.
- Escores interativos (Wells no TEP, CURB-65, Killip na SCA) citados textualmente, ainda não como recurso navegável.
- Casos com múltiplas variantes no banco (Asma ids 31/32; DPOC 33/34) não foram deduplicados — usou-se o caso "canônico" principal (3 e 9).

## Compatibilidade (confirmada)
- ✅ **Type-check limpo** em `clinical-engine/*`.
- ✅ **15 blocos** em cada caso (verificado por script).
- ✅ **Rubrica/checklist/erros** idênticos ao legado (contagens conferidas).
- ✅ **Adapter** `toLegacyOSCECase` aceita qualquer `CanonicalCase` → cada novo caso converte para o formato de `data/casos-osce.ts` (garantido por tipo).
- ✅ OSCE, Feedback, HealthBench, Centro Clínico e rotas **não foram tocados**.

## Como alimentará o futuro
- **HealthBench:** `toLegacyOSCECase(caso)` → `rubrica_correcao/checklist_osce/erros_criticos` no formato que o `rubric-adapter.ts` já consome (nota equivalente aos casos 1/3/8/9/10).
- **Professor IA:** blocos `feedbackEsperado` + `professorIA` alimentam `MaterialDidatico` e a orientação socrática do `lib/professor-ia`.
- **Centro Clínico:** bloco 14 traz `href` reais para conteúdo relacionado.

## Riscos
- **Baixo:** módulo isolado; nada em produção importa de `clinical-engine/`. Remover a pasta não afeta nada.
- Ao conectar futuramente, garantir que o adapter cubra todos os campos que cada caso específico usa no runtime (o shape atual cobre o essencial do pipeline).

## Próximos passos
1. Converter os casos restantes do banco (HAS, Pericardite, Endocardite, Estenoses, TB, Dengue, DAOP, pediátricos).
2. Ampliar o adapter para campos opcionais usados por casos específicos.
3. Criar testes de **equivalência de nota** (legado × `toLegacyOSCECase(canônico)`) antes de qualquer troca.
4. Introduzir um `registry` atrás de flag para permitir, no futuro, um caso canônico substituir o legado sem alterar o fluxo.
5. Ligar os casos canônicos ao `lib/professor-ia` num protótipo isolado.
