# Casos OSCE Dinâmicos — Beta

Módulo **paralelo e isolado** para casos OSCE com **evolução fisiológica**, intervenções e
reavaliação. Prepara o terreno para um futuro motor fisiológico (MEDIX/Pulse) **sem tocar** no
fluxo OSCE principal.

## Objetivo

Casos em que o estado do paciente **muda em resposta às condutas** do aluno (ex.: oxigênio
eleva a SpO₂; salbutamol reduz o broncoespasmo), com linha do tempo de eventos e feedback
próprio por rubrica dinâmica.

## Por que está separado do OSCE principal

- Não altera `data/casos-v2`, `lib/healthbench`, o feedback OSCE, exames, ECG, dashboard, login
  ou rubricas existentes.
- Vive em `lib/dynamic-osce/`, `components/dynamic-osce/` e na rota `/casos-dinamicos`.
- Única integração com o app: um item de navegação na sidebar (`Casos Dinâmicos Beta`).

## Estrutura

```
lib/dynamic-osce/
├── types.ts                       # contrato de caso e rubrica + tipos do motor
├── dynamic-case-contract.ts       # grupos obrigatórios, limites, acessores, resolvedor de path
├── dynamic-state-engine.ts        # física de regras (medix-rule-based)
├── dynamic-intervention-engine.ts # catálogo de intervenções
├── dynamic-feedback-engine.ts     # avaliação da rubrica dinâmica
├── dynamic-rubric-link.ts         # rubrica piloto + ligação caso↔rubrica
├── validators/                    # validar-dynamic-case / -rubric / -engine
├── scripts/validar-dynamic-osce.ts# validação permanente (CI-friendly)
└── cases/                         # índice + caso piloto
```

## Casos disponíveis (beta)

- **Crise Asmática Grave — Adulto** (`dynamic-asthma-severe-adult-001`) — piloto de referência.
- **Pneumotórax Hipertensivo — Adulto** (`dynamic-tension-pneumothorax-adult-001`) — emergência
  torácica; a descompressão é intervenção salvadora e **atrasar por exames é erro crítico**.

Cada caso é **1 arquivo TS** em `cases/` contendo o caso **e** a sua rubrica completa (ex.:
`cases/pneumotorax-hipertensivo-adulto.ts` exporta `pneumotoraxHipertensivoAdulto` e
`rubricaDynamicTensionPneumothoraxAdult001`). A rubrica é registrada em `dynamic-rubric-link.ts`
e o caso em `cases/index.ts`.

### Validar múltiplos casos

O script valida **todos** os casos de `DYNAMIC_CASES` (estrutura, rubrica, caso × rubrica,
caso × motor, sequência correta, sequência errada/sem tratamento, alta precoce e compatibilidade
Pulse) e retorna exit 1 em qualquer falha:

```bash
npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts
```

> Pulse real **ainda não está integrado** — o provider em execução de todos os casos é
> `medix-rule-based`; a compatibilidade Pulse é apenas declarada e validada.

## Contrato definitivo do caso dinâmico (Fase 2)

`DynamicCase` é composto por grupos **obrigatórios** (ver `types.ts`):

1. `identificacao` — caseId, titulo, subtitulo?, tipo, especialidade, sistema, nivel, tags, status, objetivoClinico
2. `paciente` — nome, idade, sexo, pesoKg?, faixaEtaria, contexto, fatoresRisco, antecedentesRelevantes, medicamentosUso, alergias
3. `diagnostico` — diagnosticoPrincipal, diagnosticosAceitos, diagnosticosDiferenciaisEsperados, diagnosticosPerigososQueDevemSerExcluidos
4. `fisiologia` — estadoInicial, estadoEsperadoSemIntervencao, criteriosMelhora/Piora/Instabilidade/AltaSegura/Internacao/UTI
5. `comunicacao` — itensEsperados
6. `anamnese` — perguntasObrigatorias, perguntasImportantes, respostasEsperadas, redFlagsAnamnese
7. `exameFisico` — manobrasObrigatorias, achadosEsperados, sinaisGravidade, sinaisAusentesImportantes
8. `exames` — examesEssenciais, examesComplementaresAceitos, examesNaoPrioritarios, interpretacoesEsperadas, examesQueMudamConduta
9. `intervencoes` — intervencoesEssenciais/Aceitas/Contraindicadas/DeResgate, respostaEsperadaPorIntervencao
10. `reavaliacao` — tempoReavaliacaoMinutos, parametrosReavaliar, respostaAdequada/Inadequada, proximaCondutaSeMelhora/SePiora
11. `errosCriticos` — errosCriticosDiagnostico/Conduta/Seguranca/Alta
12. `simulacao` — simulationProvider, pulseReady, pulseScenarioId?, pulseAdapterNotes?, pediatricSafetyAdapterRequired?, physiologicModelTags
13. `rubricaId` — aponta para a rubrica registrada em `dynamic-rubric-link.ts`

## Como criar um novo caso dinâmico

1. Crie `lib/dynamic-osce/cases/<meu-caso>.ts` exportando um `DynamicCase` que preencha **todos**
   os grupos acima.
2. Monte `fisiologia.estadoInicial` com `recomputarClinica` (números e texto coerentes).
3. Referencie intervenções por `InterventionId` conhecido do motor (ver catálogo).
4. Aponte `rubricaId` para uma rubrica registrada.
5. Registre o caso em `cases/index.ts` (`DYNAMIC_CASES`).
6. Rode o script de validação (abaixo) — ele **falha** se o contrato não estiver completo.

## Como criar uma rubrica dinâmica

Rubrica de **20 pontos** em **6 domínios obrigatórios**: Comunicação (2), Anamnese (4),
Exame físico (3), Exames e monitorização (3), Raciocínio clínico (4), Conduta e reavaliação (4).

Cada critério declara:
- `id`, `descricao`, `pontos`;
- `obrigatorio`;
- `tipoEvidencia` (comunicacao | anamnese | exameFisico | exameComplementar | interpretacao | diagnostico | conduta | reavaliacao | seguranca);
- `referenciasCaso` — caminhos dot-path para campos **reais** do caso que sustentam o critério
  (validado automaticamente);
- `aliasesAceitos`;
- opcionalmente `penalidadeSeAusente` e `erroCriticoAssociado`.

Registre em `dynamic-rubric-link.ts` (`REGISTRO_RUBRICAS`) e defina `rubrica.caseId` igual ao
`identificacao.caseId` do caso. O motor de feedback casa critérios por `id` (ver
`dynamic-feedback-engine.ts`).

## Compatibilidade futura com Pulse

`simulacao.simulationProvider = 'medix-rule-based' | 'pulse'`. Para habilitar o Pulse num caso:

1. `pulseReady: true` e informe `pulseScenarioId`.
2. Casos **pediátricos** com Pulse exigem `pediatricSafetyAdapterRequired: true`.
3. Descreva o mapeamento em `pulseAdapterNotes` e marque `physiologicModelTags`.
4. Implemente um adapter com a mesma assinatura `applyIntervention`; selecione por
   `simulationProvider`. `medix-rule-based` permanece como fallback offline/educacional.

Os validadores já checam essa consistência (provider=pulse exige pulseReady + scenarioId).

## Validação

```bash
npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts
```

Valida todos os casos, rubricas, caso × rubrica, caso × motor; simula a sequência correta, a
sequência sem tratamento e o erro crítico de alta precoce. Retorna exit code `1` em falha.

## Checklist antes de adicionar um novo caso

- [ ] Todos os 13 grupos do contrato preenchidos.
- [ ] `estadoInicial` dentro das faixas plausíveis e clinicamente coerente.
- [ ] Critérios de alta segura / internação / UTI definidos.
- [ ] Erros críticos de conduta, segurança e alta não vazios.
- [ ] Intervenções essenciais e de resgate reconhecidas pelo motor.
- [ ] Rubrica soma 20, 6 domínios, cada critério com `referenciasCaso` válidas.
- [ ] `rubrica.caseId` == `identificacao.caseId`.
- [ ] Se `simulationProvider='pulse'`: `pulseReady=true` + `pulseScenarioId` (+ adapter pediátrico se aplicável).
- [ ] `npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts` passa (exit 0).
- [ ] `npm run build` passa.

## MEDIX rule-based, Pulse ou hybrid? (Fase 2.5)

O motor **em execução** hoje é sempre `medix-rule-based`. A escolha futura é declarada em
`simulacao.pulseCompatibility` (ver `lib/dynamic-osce/pulse/`) e orientada pelo
`pulse-capability-map`:

- **MEDIX rule-based** — quando o Pulse não modela bem o caso (SCA completa, arboviroses,
  hematologia, pediatria sem adaptador, casos sociais/comunicacionais).
- **Pulse** — fisiologia aguda que o engine modela diretamente (asma, pneumotórax, DPOC,
  pneumonia, hemorragia, ARDS) — **sempre com overlay MEDIX** para rubrica e avaliação.
- **Hybrid** — Pulse gera a fisiologia; MEDIX cuida de comunicação, anamnese, raciocínio e
  rubrica. É a recomendação para os casos fortes.

### Por que pediatria exige safety adapter

O `engine-stable` **não tem base pediátrica equivalente**. Rodar fisiologia adulta para uma
criança é inseguro. Por isso, casos pediátricos com Pulse exigem
`pediatricSafetyAdapterRequired=true` e permanecem em `medix-rule-based` até existir um
adaptador pediátrico validado.

### Por que Pulse é motor fisiológico, não avaliador OSCE

O Pulse simula vitais e fisiologia. Ele **não** decide se o aluno passou, não avalia
comunicação/anamnese/raciocínio e não substitui a rubrica. A nota continua vindo da rubrica
dinâmica MEDIX; o Pulse apenas alimenta o painel de reavaliação (melhora/estabilidade/piora).

### Como casos nascem compatíveis com Pulse sem depender dele

Cada caso declara `pulseCompatibility` (conditionId, status, provider sugerido, cenários
candidatos, overlay, segurança pediátrica). Os validadores conferem essa declaração e o script
checa o mapeamento — **sem executar o Pulse**. Quando o adaptador existir, o caso já estará
pronto: só trocar o provider em execução.

## O que ainda NÃO está integrado (beta)

- Sem Pulse real (apenas o motor de regras).
- Não usa o feedback OSCE principal nem HealthBench.
- Anamnese/exame/comunicação são auto-registro (checkboxes), não capturados por chat/exame reais.
- Não persiste tentativas nem alimenta desempenho/dashboard.
- Estado evolui por ação (clique), não por tempo contínuo.
