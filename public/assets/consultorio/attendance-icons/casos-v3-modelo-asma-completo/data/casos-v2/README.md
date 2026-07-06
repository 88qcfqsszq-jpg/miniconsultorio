# Casos OSCE v2 — versão inline

Esta versão contém `61` casos separados por sistema.

## O que mudou

- Não há placeholders.
- Cada arquivo `.ts` contém o objeto completo do caso.
- Os exames laboratoriais detalhados estão inline no próprio caso, no campo:

```ts
exames_laboratoriais_detalhados
```

- Não depende de `shared/laboratorios.ts`.
- O arquivo `types/caso-osce-v2.ts` contém os tipos novos.
- O arquivo `data/casos-v2/index.ts` exporta todos os casos em `casosV2`.

## Observação

Esta é uma base clínica estruturada para migração. Ainda é recomendável validar caso a caso no app depois de integrar, porque o banco original tinha campos duplicados e inconsistências herdadas.
