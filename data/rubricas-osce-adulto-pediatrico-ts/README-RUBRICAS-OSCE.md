# Rubricas OSCE — Adulto e Pediatria

Gerado em: 2026-07-11T04:16:17.292050Z

## Decisão de arquitetura

A rubrica **não deve ser uma rubrica completa por caso**. Isso geraria duplicação e ficaria difícil de manter.

A estrutura entregue usa:

1. `rubrica-adulto-generica.ts` — matriz de pontuação adulta, total 20 pontos.
2. `rubrica-pediatrica-generica.ts` — matriz de pontuação pediátrica, total 20 pontos.
3. `perfis-casos/*` — arquivos leves por caso, com foco de anamnese, exame físico, exames essenciais, conduta, segurança e critérios críticos.
4. `resolver-rubrica-osce.ts` — escolhe automaticamente adulto/pediatria pelo `tipo` ou pelo `caseId`.

Essa é a melhor divisão: rubrica base genérica + perfil específico por caso.

## Estrutura

Copie a pasta abaixo para o projeto:

```txt
lib/healthbench/rubricas-osce
```

## Integração mínima

Em qualquer avaliador/feedback final:

```ts
import { resolverRubricaOSCE } from '@/lib/healthbench/rubricas-osce'

const { rubrica, perfilCaso } = resolverRubricaOSCE({
  caseId: caso.id,
  tipo: caso.tipo,
})
```

Use `rubrica.dominios` para montar nota por domínio e use `perfilCaso` para critérios específicos do caso.

## Quantidade de perfis gerados

- Adultos: 60
- Pediátricos: 17

## Observação importante

Esses arquivos são a base estrutural em TypeScript. A integração no motor atual deve ligar:

- fala/anamnese registrada;
- exames físicos clicados;
- exames complementares pedidos;
- diagnóstico/conduta final;
- geração do feedback HealthBench/OSCE.

Não substitua o motor de feedback de uma vez sem auditar os pontos de entrada atuais.
