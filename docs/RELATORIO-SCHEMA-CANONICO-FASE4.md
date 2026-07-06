# Relatório — Auditoria e Congelamento do Schema Canônico (Fase 4)

_Data: 2026-07-03 · Auditoria + ajustes **estritamente aditivos** ao schema. Nenhum arquivo de runtime (OSCE/Feedback/HealthBench/Centro Clínico/rotas/layout) foi alterado. Único arquivo de código editado: `clinical-engine/types/canonical-case.ts`._

## Escopo
Revisão do `CanonicalCase` (v1.0.0 → **v1.1.0**) antes de converter mais casos, garantindo suporte a Professor IA, HealthBench, Centro Clínico, multimodalidade de imagem, sons, ECG, laboratório, adulto/pediátrico e conhecimento reutilizável.

## Auditoria — cobertura dos 15 blocos (antes)
| # | Bloco | v1.0.0 | Observação |
|---|---|---|---|
| 1 | Identificação | ✅ | completo |
| 2 | Paciente | ✅ | personalidade/colaboração/linguagem/emocional |
| 3 | História | ✅ | HDA/antecedentes/red flags |
| 4 | Script do paciente | ✅ | vago×completo |
| 5 | Exame físico | ✅ | vitais + sistemas |
| 6 | Ausculta | ✅ | pulmonar/cardíaca + silêncio didático |
| 7 | Exames | 🟡 | genérico, **sem categoria** (lab/imagem/ECG/proc/escore) |
| 8 | Imagens | 🟡 | só `tipo/termoOpenI/achados/interpretacao` — **sem modalidade/região/curadoria** |
| 9 | ECG | ✅ | indicado/achado/justificativa |
| 10 | Diagnóstico | ✅ | por que é / por que não é |
| 11 | Conduta | ✅ | tratamento/gravidade/internação/alta |
| 12 | Rubrica HealthBench | ✅ | rubrica/checklist/erros/microcritérios (compatível) |
| 13 | Feedback esperado | ✅ | resposta modelo/checklist/erros/plano |
| 14 | Centro Clínico | ✅ | links com href/âncoras |
| 15 | Professor IA | 🟡 | ok, **sem `recursosRelacionados`** |
| — | Conhecimento reutilizável | ❌ | **inexistente** (sem `refs`) |

## Problemas encontrados
1. **Imagens sem multimodalidade:** não distinguiam RX/TC/USG/RM/Eco, nem região, indicação, fonte, curadoria ou obrigatoriedade.
2. **Exames sem categoria:** laboratório, imagem, ECG, procedimento e escore eram indistintos.
3. **Ausculta sem proxy explícito** nem id de som para referência cruzada.
4. **Professor IA sem recursos relacionados** estruturados.
5. **Sem referências de conhecimento reutilizável** (Knowledge Graph futuro).
6. **Sem metadados** de curadoria/versão/faixa etária do caso.

## Ajustes realizados (todos RETROCOMPATÍVEIS — campos novos são opcionais)
- `CANONICAL_CASE_SCHEMA_VERSION`: **1.0.0 → 1.1.0**.
- **CanonicalImaging** (multimodalidade): `modalidade` (`RX|TC|USG|RM|Eco|Cintilografia|Angio-TC|Outros`), `regiaoAnatomica`, `indicacao`, `fonte`, `imageUrl`, `pegadinhas`, `obrigatoriedade` (`obrigatorio|opcional|complementar`), `curadoria` (`curada|automatica|pendente`), `nivelConfianca` (0..1), `imageRef`.
- **CanonicalExam**: `categoria` (`laboratorio|imagem|ecg|procedimento|escore|outro`), `obrigatoriedade`, `examRef`.
- **CanonicalAuscultationFinding**: `foco`, `proxy` (áudio aproximado), `soundRef`.
- **CanonicalProfessorGuidance**: `recursosRelacionados?: CanonicalKnowledgeLink[]`.
- **CanonicalKnowledgeRefs** (novo) + `CanonicalCase.refs?`: `knowledgeRefs`, `symptomRefs`, `examRefs`, `imageRefs`, `soundRefs`, `flowRefs`, `guidelineRefs` — **apenas ponteiros por id** (o Knowledge Graph NÃO foi criado).
- **CanonicalCase.meta?**: `autor`, `curadoria`, `versaoCaso`, `atualizadoEm`, `faixaEtaria` (`adulto|pediatrico|ambos`).

## Campos adicionados (resumo)
| Bloco | Novos campos (opcionais) |
|---|---|
| Imagens | modalidade, regiaoAnatomica, indicacao, fonte, imageUrl, pegadinhas, obrigatoriedade, curadoria, nivelConfianca, imageRef |
| Exames | categoria, obrigatoriedade, examRef |
| Ausculta | foco, proxy, soundRef |
| Professor IA | recursosRelacionados |
| Caso (topo) | refs (7 arrays de ids), meta |

## Impacto nos casos existentes
- **Zero.** Todos os 6 casos (PAC + Asma + DPOC + IC + SCA + TEP) **continuam compilando sem edição** — os campos novos são opcionais. A versão do schema é lida via constante, então todos passam automaticamente a `1.1.0`.
- **Type-check limpo** em `clinical-engine/*` e `lib/professor-ia/*`.

## Compatibilidade
- **HealthBench:** intacta — `rubrica/checklist/erros` inalterados; o `adapter` (`toLegacyOSCECase`) continua funcionando (os campos novos não são consumidos por ele). Nada no motor muda.
- **Professor IA:** melhorada — `recursosRelacionados` e `refs` dão ao `lib/professor-ia` pontos de ancoragem adicionais (sem conexão nesta fase).
- **Multimodalidade:** agora explícita (RX/TC/USG/RM/Eco/Angio-TC), com região, indicação, fonte, curadoria e obrigatoriedade por imagem; exames categorizados (lab/imagem/ECG/procedimento/escore).
- **Sons:** cobertos (real, silêncio didático, proxy, arquivo/origem do soundsCatalog, foco/localização, soundRef).
- **Adulto/Pediátrico:** `paciente.tipoPaciente` + `meta.faixaEtaria` cobrem ambos.

## Riscos
- **Baixo.** Mudança apenas de tipos, aditiva, em módulo não importado por produção. Remover a pasta não afeta nada.
- Ao popular os campos novos nos próximos casos, manter os `*Ref` como ids estáveis (evitar acoplamento a URLs voláteis).
- O `adapter` cobre o essencial do pipeline legado; casos que usem campos específicos exigirão ampliação futura (documentado).

## Recomendações
1. **Congelar a v1.1.0** como base para a próxima leva de conversões.
2. Nas próximas conversões, preencher `modalidade`/`categoria`/`obrigatoriedade` (baixo custo, alto valor para OSCE e Professor IA).
3. Definir um **catálogo de ids** para `refs` (exam/imagem/som/fluxo) antes de construir o Knowledge Graph.
4. Adicionar, quando houver caso pediátrico canônico, exemplos que exercitem `meta.faixaEtaria = "pediatrico"`.

## Decisão final
**✅ Schema PRONTO PARA CONGELAMENTO na versão 1.1.0.** Cobre os 15 blocos, multimodalidade de imagem, exames categorizados, sons (real/silêncio/proxy), ECG, Professor IA e referências de conhecimento reutilizável — de forma retrocompatível. Não há necessidade de nova revisão estrutural antes de converter mais casos; futuras extensões seguem o mesmo padrão aditivo (campos opcionais + bump de minor version).
