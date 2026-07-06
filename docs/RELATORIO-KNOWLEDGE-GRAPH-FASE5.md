# Relatório — Clinical Knowledge Graph (Fase 5)

_Data: 2026-07-03 · Fase **100% aditiva e desacoplada**. Nenhum arquivo de runtime, tela, rota, caso ou adapter foi alterado. Único código editado fora dos novos arquivos: **nenhum**._

## Objetivo
Criar a fundação do conhecimento clínico reutilizável (`clinical-engine/knowledge/`) — a futura fonte única para Casos Canônicos, Professor IA, HealthBench, Centro Clínico, Feedback e estudos. Nesta fase, **só a base**: tipos, registry, helpers e um seed pequeno de objetos.

## Arquivos criados (18)
| Arquivo | Conteúdo |
|---|---|
| `knowledge/types/knowledge.ts` | Base + 13 tipos + união `KnowledgeNode` + `KnowledgeRelations` + `KnowledgeFutureRefs` + `KnowledgeMetadata` |
| `knowledge/symptoms/index.ts` | 7 sintomas |
| `knowledge/physical-exam/index.ts` | 5 achados físicos |
| `knowledge/lung-sounds/index.ts` | 6 sons pulmonares |
| `knowledge/heart-sounds/index.ts` | 4 sons cardíacos |
| `knowledge/laboratory/index.ts` | 4 exames laboratoriais |
| `knowledge/imaging/index.ts` | 2 imagens (RX/Angio-TC) |
| `knowledge/ecg/index.ts` | 3 nós de ECG |
| `knowledge/procedures/index.ts` | 4 procedimentos |
| `knowledge/scores/index.ts` | 5 escores |
| `knowledge/guidelines/index.ts` | 6 guidelines |
| `knowledge/drugs/index.ts` | 6 fármacos |
| `knowledge/diagnoses/index.ts` | 7 diagnósticos |
| `knowledge/flows/index.ts` | 3 fluxos |
| `knowledge/references.ts` | 3 referências (Open-i, HLS-CMDS, Centro Clínico) |
| `knowledge/registry.ts` | `KNOWLEDGE_REGISTRY` + índices |
| `knowledge/helpers/index.ts` | helpers puros |
| `knowledge/README.md` | documentação |
| `docs/RELATORIO-KNOWLEDGE-GRAPH-FASE5.md` | este relatório |

## Objetos criados (65 nós, 14 categorias)
- **Sintomas (7):** febre, tosse, dispneia, dor torácica, palpitações, síncope, hemoptise.
- **Achados físicos (5):** taquipneia, submacicez, frêmito aumentado, turgência jugular, edema de MMII.
- **Sons pulmonares (6):** crepitações, roncos, sibilos, atrito pleural, MV reduzido, MV abolido (dois últimos = silêncio didático).
- **Sons cardíacos (4):** B3, B4, sopro sistólico, sopro diastólico.
- **Laboratório (4):** hemograma, troponina, gasometria, D-dímero.
- **Imagem (2):** RX de tórax, TC/Angio-TC de tórax.
- **ECG (3):** supra de ST, taquicardia sinusal, S1Q3T3.
- **Procedimentos (4):** oxigenoterapia, nebulização, acesso venoso, intubação.
- **Escores (5):** CURB-65, Wells, Killip, NEWS2, qSOFA.
- **Guidelines (6):** pneumonia, asma, DPOC, IC, SCA, TEP.
- **Fármacos (6):** amoxicilina, salbutamol, corticosteroide, diurético, AAS, anticoagulante.
- **Diagnósticos (7):** pneumonia, asma, DPOC, IC, SCA, TEP, edema agudo de pulmão.
- **Fluxos (3):** dispneia, dor torácica, febre.
- **Referências (3):** Open-i/NLM, HLS-CMDS, Centro Clínico.

## Registry
`KNOWLEDGE_REGISTRY` (65 nós) + índices `KNOWLEDGE_BY_ID`, `KNOWLEDGE_BY_SLUG`, `KNOWLEDGE_BY_CATEGORY`, `KNOWLEDGE_BY_TAG` e `KNOWLEDGE_STATS`.

## Helpers
`findById` · `findBySlug` · `findByCategory` · `findByTag` · `findRelated(id, profundidade)` (com `visitados` — **sem ciclos infinitos**) · `searchKnowledge(termo, {categoria, limite})` · `refsQuebradas()` (integridade).

## Estrutura do grafo (relações por id)
- As relações (`refs`) são **sempre por id** (nunca objetos aninhados) → o grafo é acíclico na travessia (`findRelated` marca visitados).
- Exemplo: `ls-crepitacoes → dx-pneumonia → { img-rx-torax, score-curb65 → guide-pneumonia → drug-amoxicilina }`; `dx-ic → { hs-b3, pf-turgencia-jugular, pf-edema-mmii }`.
- **Integridade verificada:** todas as referências reais resolvem para ids existentes (0 quebradas). Diagnósticos já trazem `metadata.futureRefs.casosCanonicos` (ex.: `dx-pneumonia → "pac"`).

## Preparado para o futuro (declarado, NÃO utilizado)
`metadata.futureRefs`: `professorIA`, `centroClinico` (rotas/âncoras), `casosCanonicos` (canonicalId), `healthbench` (eixos/tags), `feedback`. Nenhum é consumido nesta fase.

## Compatibilidade
- **Casos Canônicos (v1.1.0):** os campos `soundRef/examRef/imageRef/refs` do schema já podem apontar para ids do grafo (sem alteração de casos existentes).
- **Professor IA / Centro Clínico / HealthBench / Feedback:** têm ganchos (`futureRefs`) prontos, sem conexão agora.
- **Runtime atual:** intocado — nada importa de `clinical-engine/knowledge/`.

## Validação
- ✅ **Type-check limpo** no `clinical-engine/knowledge/*` (persistem só os erros PRÉ-EXISTENTES em `ecgGenerator`).
- ✅ **Integridade de refs:** 0 referências quebradas (65 ids; todas as citações resolvem).
- ✅ **Nenhum arquivo existente alterado**; nenhuma tela, rota, runtime, caso ou adapter tocado.

## Limitações
- Seed **pequeno e ilustrativo** (65 nós), focado em respiratório/cardiovascular — não é cobertura completa.
- `futureRefs` são apenas ponteiros (o resolver/Knowledge Graph navegável virá depois).
- Sem validação automática de integridade em CI (helper `refsQuebradas()` existe para uso manual).

## Próximas fases
1. Expandir o seed por sistema (neuro, abdome, infecto, hemato, pediatria, urgência).
2. Ligar os `*Ref` dos Casos Canônicos aos ids do grafo (Fase de integração).
3. Resolver `futureRefs` em navegação real (Centro Clínico) sem alterar o runtime atual.
4. Integração opcional com Professor IA (context/knowledge-builder) atrás de flag.
5. Validação de integridade do grafo em CI.

## Confirmação de desacoplamento
O módulo `clinical-engine/knowledge/` é **completamente isolado**: não importa nada do runtime, não é importado por nenhum código de produção, não chama IA e não cria endpoint. Removê-lo não afeta o sistema.
