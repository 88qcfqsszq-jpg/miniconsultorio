# Clinical Knowledge Graph — Fundação (Fase 5)

> **Status:** camada de conhecimento **preparada, 100% desacoplada**. Não importa runtime,
> não chama IA, não cria endpoint, não conecta a OSCE/Feedback/HealthBench/Professor IA/Centro Clínico.
> Remover a pasta `clinical-engine/knowledge/` não afeta nada no sistema.

## Objetivo
Ser a **única fonte oficial** de conhecimento clínico reutilizável (sintomas, achados, sons,
exames, imagens, ECG, procedimentos, escores, guidelines, drogas, diagnósticos, fluxos, referências),
para no futuro alimentar Casos Canônicos, Professor IA, HealthBench, Centro Clínico, Feedback e estudos.

## Arquitetura
```
clinical-engine/knowledge/
├── types/knowledge.ts     # tipos fortes (base + 13 tipos + união KnowledgeNode)
├── symptoms/              ├── physical-exam/     ├── lung-sounds/    ├── heart-sounds/
├── laboratory/           ├── imaging/            ├── ecg/            ├── procedures/
├── scores/               ├── guidelines/         ├── drugs/          ├── diagnoses/
├── flows/                ├── references.ts       # KnowledgeReference
├── registry.ts           # KNOWLEDGE_REGISTRY + índices (id/slug/categoria/tag)
├── helpers/index.ts      # findById/findBySlug/findByTag/findByCategory/findRelated/searchKnowledge
└── README.md
```

## Modelo de dados
Todo nó (`KnowledgeNode`) tem: `id`, `slug`, `nome`, `descricao`, `categoria`, `tags`, `refs`, `version`, `metadata`.
- **`refs`** (relações) são **sempre por id** (nunca objetos aninhados) → evita ciclos; `findRelated` usa `visitados`.
- **`metadata.futureRefs`** (declarado, NÃO usado): `professorIA`, `centroClinico`, `casosCanonicos`, `healthbench`, `feedback`.
- Tipos específicos adicionam campos: sons (`arquivo`/`soundCatalogRef`/`silencioDidatico`/`proxy`), imagens (`modalidade`/`termoOpenI`), exames, ECG, escores, guidelines, drogas, diagnósticos, fluxos, referências.

## Registry
`KNOWLEDGE_REGISTRY: KnowledgeNode[]` agrega tudo. Índices: `KNOWLEDGE_BY_ID`, `KNOWLEDGE_BY_SLUG`,
`KNOWLEDGE_BY_CATEGORY`, `KNOWLEDGE_BY_TAG`, e `KNOWLEDGE_STATS`.

## Helpers (puros)
`findById(id)` · `findBySlug(slug)` · `findByCategory(cat)` · `findByTag(tag)` ·
`findRelated(id, profundidade?)` (sem ciclos) · `searchKnowledge(termo, {categoria, limite})` ·
`refsQuebradas()` (integridade).

## Grafo (exemplo — sem ciclos infinitos)
```
ls-crepitacoes ──▶ dx-pneumonia ──▶ img-rx-torax
       │                 └──▶ score-curb65 ──▶ guide-pneumonia ──▶ drug-amoxicilina
       └──▶ dx-ic ──▶ hs-b3, pf-turgencia-jugular, pf-edema-mmii
```

## Como cada consumidor usará (FUTURO — não conectado)
- **Caso Canônico:** os `*Ref` do schema v1.1.0 (`soundRef`/`examRef`/`imageRef`/`refs`) apontarão para ids daqui, eliminando duplicação.
- **Professor IA:** `metadata.futureRefs.professorIA` + `findRelated` para montar mini-aulas e perguntas ancoradas.
- **Centro Clínico:** `metadata.futureRefs.centroClinico` (rotas/âncoras) para "conteúdo relacionado".
- **HealthBench:** `metadata.futureRefs.healthbench` (eixos/tags) para mapear critérios a conhecimento.
- **Feedback:** `metadata.futureRefs.feedback` para explicações ricas ("por que a dose importa").

## O que ainda falta (próximas fases)
1. Popular mais nós (centenas) por sistema.
2. Ligar os `*Ref` dos Casos Canônicos aos ids do grafo.
3. Um resolver que traduza `futureRefs` em navegação real (sem alterar o runtime atual).
4. Ferramentas de curadoria/validação de integridade em CI.

## Garantia
100% aditivo e isolado. Nenhum arquivo fora de `clinical-engine/knowledge/` foi alterado.
