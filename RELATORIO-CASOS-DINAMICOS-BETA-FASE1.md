# Relatório — Casos OSCE Dinâmicos (Beta) · Fase 1

## Resumo

Criado um módulo **paralelo e isolado** "Casos OSCE Dinâmicos — Beta", com rota nova
`/casos-dinamicos`, motor de estado próprio (regras determinísticas), rubrica dinâmica
piloto e feedback simples. Um caso piloto — **"Crise Asmática Grave — Adulto"** — demonstra
evolução fisiológica em resposta a intervenções. O fluxo OSCE principal permanece intocado.

## Arquivos criados (21)

### Lógica (`lib/dynamic-osce/`)
- `types.ts` — tipos centrais (PatientState, Intervention, DynamicCase, rubrica, feedback).
- `dynamic-case-contract.ts` — contrato/limites de um caso + guardas de forma.
- `dynamic-state-engine.ts` — física de regras `medix-rule-based` (`applyIntervention`).
- `dynamic-intervention-engine.ts` — catálogo de intervenções.
- `dynamic-feedback-engine.ts` — avaliação da rubrica dinâmica (predicados por critério).
- `dynamic-rubric-link.ts` — rubrica piloto (20 pts) + ligação caso↔rubrica.
- `validators/validar-dynamic-case.ts` — valida forma/faixas do caso.
- `validators/validar-dynamic-rubric.ts` — valida somatórios/ids da rubrica.
- `validators/validar-dynamic-engine.ts` — auto-teste do motor (direção das respostas).
- `cases/index.ts` — registro de casos dinâmicos.
- `cases/piloto-asma-grave-adulto.ts` — caso piloto.
- `README-DYNAMIC-OSCE.md` — documentação do módulo.

### UI (`components/dynamic-osce/`)
- `DynamicCasesBetaPage.tsx` — página beta (título, subtítulo, aviso, lista/runner).
- `DynamicCaseCard.tsx` — card de caso na lista.
- `DynamicCaseRunner.tsx` — orquestra estado, intervenções, auto-registro, timeline, feedback.
- `DynamicPatientStatePanel.tsx` — sinais vitais + quadro clínico + tendência.
- `DynamicInterventionsPanel.tsx` — botões de intervenção.
- `DynamicTimelinePanel.tsx` — linha do tempo de eventos.
- `DynamicBetaNotice.tsx` — aviso "não substitui os casos OSCE atuais".

### Rota e relatório
- `app/casos-dinamicos/page.tsx` — rota nova (padrão de `/guia`).
- `RELATORIO-CASOS-DINAMICOS-BETA-FASE1.md` — este relatório.

## Arquivo existente alterado (1)

- `components/layout/AppSidebar.tsx` — **+2 linhas**: um item de navegação
  "Casos Dinâmicos Beta" → `/casos-dinamicos` e a linha de estado ativo correspondente.
  Nenhum botão/rota existente foi alterado ou removido.

## Fluxo implementado

1. `/casos-dinamicos` abre a página beta com título, subtítulo e aviso beta.
2. Lista o caso piloto; "Iniciar caso dinâmico" abre o runner.
3. O runner mostra o **estado fisiológico inicial** (FC 118, FR 34, PA 135/85, SpO₂ 88%,
   sibilos difusos, frases entrecortadas).
4. O aluno faz auto-registro (comunicação/anamnese/exame), solicita exames e aplica
   **intervenções**; cada ação chama `applyIntervention` e atualiza o estado.
5. As respostas seguem as regras: O₂ eleva SpO₂; salbutamol reduz broncoespasmo (FR↓/FC↑);
   ipratrópio dá ganho adicional; corticoide conta como conduta sem melhora imediata;
   sem conduta o quadro piora; alta com hipoxemia/esforço → **erro crítico**.
6. A **timeline** registra cada evento com tendência (melhora/estabilidade/piora).
7. "Finalizar Beta" gera **feedback simples** da rubrica dinâmica (20 pts, 6 domínios),
   com acertos, pontos a melhorar e erro crítico quando aplicável.

## Limitações atuais (beta)

- Sem Pulse real — apenas o motor de regras (`simulationProvider: 'medix-rule-based'`).
- Não usa o feedback OSCE principal nem HealthBench.
- Anamnese/exame/comunicação são auto-registro (checkboxes), não capturados por
  chat/exame físico reais.
- Não persiste tentativas nem alimenta desempenho/dashboard.
- Visual funcional e limpo, porém propositalmente simples.

## Próximos passos sugeridos

- Adapter `pulse` implementando a mesma assinatura `applyIntervention`.
- Capturar anamnese/exame por interação real (chat/exame) em vez de checkboxes.
- Mais casos dinâmicos (DPOC, anafilaxia, choque) reutilizando o motor.
- Evolução por tempo contínuo (tick) além de por ação.

## O que NÃO foi alterado no app principal

`data/casos-v2`, `lib/healthbench/*` (rubricas/feedback), `app/caso/[id]`,
`app/faca-o-osce`, `app/treinamento`, APIs atuais, ECG, laboratório, exames,
dashboard principal, login/planos, `AppShell`/CSS da sidebar e o layout principal
(exceto o único item de navegação adicionado). Nenhum arquivo existente foi deletado.

## Build

`npm run build` — sucesso; rota `/casos-dinamicos` gerada como estática (○); TypeScript 0 erros.
