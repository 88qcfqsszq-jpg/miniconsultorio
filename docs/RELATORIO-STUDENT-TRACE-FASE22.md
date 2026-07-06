# Relatório — Student Trace Engine + Correção dos elogios falsos (Fase 22)

_Correção de bug **crítico** de veracidade. NÃO altera nota, HealthBench, OSCE, Centro Clínico, rotas principais; não cria login/banco/memória/chat/streaming/voz. Torna o **rastro real do aluno** a única fonte de elogio._

## Causa-raiz do erro
O Professor IA elogiou "você auscultou o tórax e identificou crepitações" mesmo sem o aluno ter auscultado. **O LLM não inventou** — ele repetiu uma "força" vinda do pipeline. A `openingLine` e o `acknowledge_strength` eram derivados de `context.avaliacao.competencias.acertos` (**HealthBench**, que no dry-run/preview era **mock** com essa ação como "cumprida"). Ou seja: o elogio vinha do **gabarito/avaliação**, não do que o aluno **fez**. A correção não é trocar o modelo — é mudar a **fonte do elogio**.

## Regra estabelecida
- **ELOGIO = StudentTrace** — só ações com evidência real de evento.
- **GABARITO = Gold Standard** — o que deveria ser feito; **nunca** vira elogio.
- **ERRO = HealthBench + TraceValidation** — o que faltou / foi inseguro.

## Arquivos criados
- `lib/professor-ia/student-trace.ts` — tipos + `buildStudentTrace` + `summarizeStudentTrace` + `validateTraceAgainstGoldStandard` + `validateProfessorMessageAgainstTrace` (guardrail) + `NEUTRAL_OPENING`.
- `scripts/audit-professor-ia-student-trace.mjs` — auditoria de regressão dos 4 cenários.
- `scripts/fixtures/trace-{A,B,C,D}-*.json` — ProfessorLessons dos 4 cenários.
- `docs/RELATORIO-STUDENT-TRACE-FASE22.md` — este relatório.

## Arquivos alterados
- `interfaces.ts` — `studentTrace?`/`studentTraceSummary?`/`traceValidation?` no contexto.
- `context-builder.ts` — constrói o trace a partir dos dados de atendimento + summary + validation.
- `lesson-planner.ts` — `acknowledge_strength` **só** de `confirmedStrengths`; sem evidência → sem elogio; omissões viram `identify_error`.
- `professor-lesson.ts` — `openingLine` de `confirmedStrengths` (neutra sem evidência); campo `studentBase` (permitidos/proibidos/omissões).
- `orchestrator.ts` — prompt com regra forte de elogio + `confirmedStrengths`/`forbiddenPraise`/`missingRequiredItems`; **guardrail pós-geração**.
- `preview-builder.ts` — aceita dados reais do atendimento → trace real.
- `components/FeedbackOSCE.tsx` — mapeia (defensivamente) os dados reais para o preview.
- `components/professor-ia/ProfessorIAPreview.tsx` — seção "🔎 Base do Professor IA" (auditoria visual).
- `lib/professor-ia/index.ts`, `README.md`.

## Tipos criados
`StudentTrace` · `StudentTraceEvent` · `StudentTraceEventType` (16 tipos) · `StudentTraceEvidence` · `StudentTraceSummary` · `StudentTraceStrength` · `StudentTraceWeakness` · `StudentTraceOmission` · `StudentTraceCriticalMismatch` · `StudentTraceValidationResult` (+ `StudentTraceInput`, `EvidenceStrength`, `GuardrailResult`).

## Como o StudentTrace funciona
`buildStudentTrace(dadosDoAtendimento)` gera **eventos** com `evidenceStrength` (strong/medium/weak): perguntas, exame físico, ausculta, sinais vitais, exames pedidos, imagens, ECG, SOAP, diagnóstico, diferenciais, conduta, medicação, tempo. `summarizeStudentTrace` deriva `confirmedStrengths` **apenas** de eventos strong/medium — se não há evento `auscultation_performed`, **não** existe a força "auscultou o tórax". `validateTraceAgainstGoldStandard` compara com o gabarito e produz `completedRequiredItems`, `missingRequiredItems`, `confirmedWeaknesses`, `criticalMismatches` e **`forbiddenPraise`** (frases proibidas para ações **sem evidência de evento** — independe do gabarito: prescrever sem dose ainda é ter prescrito).

## Dados reais mapeados (do FeedbackOSCE)
- chat do aluno → `question_asked`; exame físico/manobras → `physical_exam_performed`/`auscultation_performed`/`body_region_clicked`; exames solicitados → `exam_requested`; sinais vitais → `vital_signs_requested`; imagens → `image_opened`; hipótese → `diagnosis_submitted`; diferenciais → `differential_submitted`; conduta → `conduct_submitted`/`treatment_plan_submitted`/`medication_submitted`; SOAP → `soap_filled`; tempo → `time_spent`.
- **Ainda não disponíveis/garantidos no Feedback:** cliques de região anatômica e áudio de ausculta específicos, ECG aberto, detalhamento das manobras (dependem do formato real das props). Mapeamento é **defensivo**: o que não existir vira **ausência de evidência** → comportamento **conservador** (sem elogio).

## Cenários (auditoria de regressão — estrutural, determinística)
| Cenário | opening | confirmedStrengths | elogia ausculta? |
|---|---|---|---|
| **A** — dx+conduta, **sem** ausculta/RX | "Você foi bem em: Formulou a hipótese diagnóstica…" | dx, conduta, medicação | ❌ (proibido) |
| **B** — pediu RX, **sem** ausculta | "Você foi bem em: Solicitou Radiografia de tórax…" | RX, dx | ❌ (proibido) |
| **C** — ausculta **comprovada** | "Você foi bem em: Auscultou o tórax…" | ausculta, RX | ✅ (permitido) |
| **D** — **sem** StudentTrace | "Vamos revisar seu atendimento e corrigir o ponto mais importante com segurança." | (nenhuma) | ❌ |

**Resultado:** 12/12 checagens estruturais ✅. Critério crítico "'auscultou' só aparece com evidência real" = **✅ SIM**. No endpoint (modelo real), o cenário A respondeu _"Você foi bem em formular a hipótese diagnóstica de pneumonia. Agora vamos corrigir um ponto crítico: você prescreveu um antibiótico… mas com dose."_ — **sem** mencionar ausculta. O **guardrail** foi verificado bloqueando elogio proibido (substitui por texto neutro).

## Restrição final — atendida
1. ✅ Não elogia **ausculta** quando o aluno não auscultou (A, B, D).
2. ✅ Não elogia **exame** quando o aluno não pediu (A, D — não elogia RX; forbiddenPraise inclui "solicitou rx").
3. ✅ Não elogia **conduta** quando o aluno não escreveu (D neutro; forbiddenPraise inclui "prescreveu" só quando não há evento).
4. ✅ **Fallback conservador** sem StudentTrace suficiente (D = abertura neutra, nenhum elogio específico).

## Confirmações
- Nota, HealthBench, Feedback (não substituído), OSCE, Centro Clínico: **inalterados**.
- Sem banco/login/memória/chat/streaming/voz. `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).

## Limitações
- Mapeamento dos dados reais do Feedback é **defensivo** e depende do formato das props (`manobrasSolicitadas`, `examesSolicitados`, `diagnostico`); onde o formato divergir, o trace fica parcial → conservador (não elogia).
- Detecção de "dose" na conduta é heurística (regex `mg/ml/dose/…`).
- HealthBench do preview ainda é mock (usado só para ERRO, nunca para elogio).

## Próximos passos
1. Padronizar no atendimento a emissão de eventos ricos (cliques, áudio de ausculta, ECG) para um StudentTrace de alta evidência.
2. Persistir o StudentTrace por tentativa (quando houver login/banco) e alimentar o Student Model longitudinal.
3. Endurecer o guardrail (cobrir sinônimos/parafraseamentos) e adicionar verificação de "recurso fora da lista".
