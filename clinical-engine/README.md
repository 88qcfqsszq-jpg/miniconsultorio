# Clinical Engine — Casos Canônicos (Fase 2)

> **Status:** módulo **aditivo e desacoplado**. Ainda **NÃO conectado** ao sistema.
> Não altera OSCE, Feedback, HealthBench, Centro Clínico, rotas, layout ou casos antigos.
> Não cria endpoint, não abre chat, não chama IA.

## Objetivo
Definir o **Caso Canônico** — modelo oficial, completo e único para descrever um caso
clínico — e criar o **primeiro caso** (PAC) como referência. O Caso Canônico é a fonte
que, no futuro, alimentará **OSCE (via adapter), HealthBench, Centro Clínico e Professor IA**,
sem duplicar dados espalhados.

## Estrutura
```
clinical-engine/
├── types/
│   └── canonical-case.ts        # 15 blocos + CanonicalCase
├── cases/
│   └── pac.ts                   # CANONICAL_PAC (dados reais do caso legado id 2)
├── helpers/
│   └── canonical-case-adapter.ts# toLegacyOSCECase(): Canônico → formato legado
└── README.md
```

## Os 15 blocos do Caso Canônico
1. Identificação · 2. Paciente · 3. História clínica · 4. Script do paciente ·
5. Exame físico · 6. Ausculta (ancorada no `soundsCatalog`) · 7. Exames ·
8. Imagens (termo Open-i) · 9. ECG · 10. Diagnóstico (por que é / por que não é) ·
11. Conduta · 12. Rubrica HealthBench (compatível) · 13. Feedback esperado ·
14. Centro Clínico relacionado · 15. Professor IA.

## Adapter (Canônico → Legado)
`toLegacyOSCECase(canonicalCase)` devolve um objeto no formato de `data/casos-osce.ts`
(`id`, `dados_visiveis_ao_estudante`, `dados_ocultos_do_sistema`, `paciente`,
`respostas_do_paciente`, `sinaisVitaisCorretos`, `exame_fisico_interativo`,
`exames_complementares_disponiveis`, `checklist_osce`, `rubrica_correcao`,
`erros_criticos`, …). **Não é conectado nesta fase** — é só a ponte verificável.

## Compatibilidade
- A **rubrica/checklist/erros** do canônico são **idênticos** aos do legado id 2 →
  o `rubric-adapter.ts` do HealthBench os consumiria sem mudança.
- A **ausculta** referencia arquivos reais do `soundsCatalog` (ex.: `M_CC_LLA.wav`).
- Os **links** do bloco 14 apontam para rotas reais do Centro Clínico.

## Como será usado no futuro (visão)
```
CanonicalCase (pac.ts)
   ├── toLegacyOSCECase() ─────────► pipeline OSCE atual (sem alteração)
   ├── rubrica/checklist/erros ────► HealthBench (rubric-adapter)
   ├── conhecimentoRelacionado ────► Centro Clínico (links)
   └── professorIA + feedback ─────► Professor IA (lib/professor-ia)
```

## Garantia
100% aditivo. Remover a pasta `clinical-engine/` não afeta nada. Nenhum arquivo
existente foi modificado.
