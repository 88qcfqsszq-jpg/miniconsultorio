# Relatório — Auditoria de Coerência Clínica (Mini Consultório OSCE)

_Auditoria sistêmica do fluxo: caso ativo → achados esperados → exame físico → exames complementares → ECG → feedback → relatório. Foco em correções **centrais** (não caso a caso). Não altera Dashboard, login/perfil/planos, sidebar/top bar nem conteúdo clínico._

## 1. Inventário de casos
| Fonte | Total |
|---|---|
| Adultos (`data/casos-v2/adultos/**`) | **60** — cardiovascular 20, respiratório 13, hematologia 12, infectologia 8, vascular 3, endocrinologia 2, imunologia 1, nefrologia 1 |
| Pediátricos (`data/casos-pediatricos.ts`) | **16** |
| **Total** | **76** |

Cada caso expõe: `id`, `paciente` (nome/idade/sexo), `categoria/sistema`, `diagnosticoCorreto`/`dados_ocultos_do_sistema.diagnostico_principal`, `queixaPrincipal`, `sintomas`, `sinaisVitaisCorretos`, `respostas_do_paciente` e (parcialmente) `tema`. Apenas **1 caso** define `esperadosExames.ecg.presetId` — origem do problema de ECG genérico (ver §5).

## 2. Propagação do caseId
`app/caso/[id]/page.tsx` resolve o caso (sessionStorage → `casosV2`) e propaga o **objeto do caso** (não só o id) para: `ChatPaciente`, exame físico (pediátrico/adulto), `PainelExamesComplementares`, `SimuladorECG` (`caso`), imagem (`OpenIRawImagePanel`), `LaboratoryPanel` (`caso`), SOAP e Diagnóstico. Correção final e relatório recebem os eventos coletados via `FeedbackOSCE`.
- ✅ Propagação **coerente**; nenhuma quebra de caseId encontrada.
- ⚠️ O chat também recebeu correção prévia (envia o `caso` no payload) — casos gerados agora respondem pelo quadro.

## 3. Exame físico no relatório
- O relatório (`lib/pdf/exportar-feedback-atendimento.ts`, seção "4. Exame físico realizado") lê `manobrasSolicitadas`; se vazio → **"Não registrado durante o atendimento."**
- `FeedbackOSCE` **passa** `manobrasSolicitadas` corretamente ao PDF/StudentTrace (não é bug de fiação).
- **Causa-raiz** do "Não registrado" no caso do Artur: o módulo de exame físico só emite `manobra` quando há **achado configurado** para a manobra clicada; casos sem achados físicos configurados (ou clique sem achado) ⇒ `manobrasSolicitadas` vazio ⇒ relatório mostra "não registrado" mesmo com o aluno tendo examinado.
- **Pendência (recomendação central):** um `physicalExamMapper` que **sempre registre a manobra realizada** (mesmo sem achado específico: "realizado — sem achado relevante"), em `components/pediatria/ExameFisicoPediatrico` e `components/ExameFisicoAdultoVisual` → `handleNovaManobra`. Não implementado agora por risco de alterar módulos clínicos em uso (evitar quebrar casos que já funcionam).

## 4. Exames complementares (laboratório) — CORRIGIDO
- **Problema:** exames visualizados chegavam ao relatório/feedback como o genérico **"laudo laboratorial visualizado"**, apesar de o `LaboratoryEngine` já gerar **valores objetivos determinísticos por caso** (Hb, leucócitos, plaquetas, pH/pCO₂/HCO₃/lactato, troponina, PCR, função renal/hepática, coagulograma, EAS).
- **Correção central:** novo `resumoLabPanel(result)` em `src/lab/LaboratoryEngine.ts` produz um resumo **objetivo** (analitos alterados com valor/unidade). `LaboratoryPanel` passa esse resumo em `onExamViewed(id, label, resumo)`; a página guarda em `labsResultados` e usa no payload do grader e no `FeedbackOSCE`.
- ✅ Agora o relatório mostra, por exame, algo como: _"Hemograma (moderado): Hb 8,2 g/dL ↓; Leucócitos 15.200 /mm³ ↑; Plaquetas 90.000 /mm³ ↓"_ em vez do texto genérico.

## 5. ECG — CORRIGIDO (preset por diagnóstico + laudo contextual)
- **Problema:** `SimuladorECG` escolhia o preset por `esperadosExames.ecg` → `tema` → **idade** (fallback). Como quase nenhum caso define `esperadosExames.ecg` e o mapa de temas cobre poucos temas, a maioria caía no **normal por idade** (ex.: `normal_lactente`) — inclusive em cardiopatia cianótica — sem contexto. O `ECG_CASE_MAPPING` por diagnóstico estava **subutilizado**.
- **Correção central:** novo resolvedor `resolveECGPresetForCase(caso)` em `lib/ecg/ecg-case-mapping.ts`, com prioridade **esperado → tema → DIAGNÓSTICO → idade**:
  - diagnósticos com preset (FA → `fibrilacao_atrial`; TSV/palpitação → `taquicardia_supraventricular`; bradicardia/BAV → `bradicardia_sinusal`; IAM/SCA/angina → `taquicardia_sinusal_adulto`);
  - diagnósticos **cardíacos sem preset específico** (cardiopatia congênita/cianótica, Tetralogia de Fallot, TGA, sopro, CIV/CIA, estenose/insuficiência valvar, IC, pericardite, miocardite, arritmia…) → **normal por idade + laudo CONTEXTUAL**: _"ECG sem alterações específicas neste simulador. Um ECG normal NÃO exclui o diagnóstico — correlacionar com ecocardiograma, radiografia e o quadro clínico."_;
  - não-cardíacos → normal por idade (sem alarme).
- `SimuladorECG` passou a usar o resolvedor e injeta o laudo contextual no `aviso` do ECG gerado.
- ✅ Teste: cardiopatia cianótica (lactente) → `normal_lactente` **com contexto**; IAM → `taquicardia_sinusal_adulto`; FA → `fibrilacao_atrial`; pneumonia → `normal_pre_escolar` (simples).

## 6. Laboratório (motor)
`src/lab/LaboratoryEngine.ts` já é **determinístico por caseId** e coerente com a patologia (via `ClinicalTag`), com 9 painéis (hemograma, renal, eletrólitos, inflamatórios, gasometria, cardíacos, hepática, coagulograma, urina). A auditoria **não** transformou tudo em patológico — os resultados seguem a tag do caso. A correção do §4 apenas **expõe** esses valores ao relatório/feedback.

## 7. Feedback
- Hoje o feedback reconhece exame físico via `lib/osce/evidence-mapper.ts` (Fase 27) e não penaliza quando há evidência de manobra. Persiste a limitação do §3: sem manobra registrada, não há o que reconhecer.
- **Pendência (recomendação):** diferenciar explicitamente _não realizado_ / _realizado incompleto_ / _realizado adequado_ / _realizado sem interpretação_ em `lib/healthbench/feedback-view-builder.ts`, consumindo o `physicalExamMapper` do §3.

## 8. Relatório exportado
- Registra: dados do caso, avaliação por competência, anamnese, exame físico (§3), exames + **agora resultados objetivos** (§4), diagnóstico, conduta, SOAP.
- **Pendência (recomendação):** de-duplicar exames repetidos (ex.: ECG solicitado várias vezes) agrupando por nome em `lib/pdf/exportar-feedback-atendimento.ts`.

## 9. Problemas sistêmicos encontrados
1. **ECG genérico por idade** em casos patológicos (sem mapeamento por diagnóstico). → **corrigido** (§5).
2. **Labs como "visualizado"** sem valores. → **corrigido** (§4).
3. **Exame físico "não registrado"** quando o caso não tem achados configurados / clique sem achado. → **documentado + recomendação** (§3).
4. Feedback não distingue graus de execução do exame físico. → recomendação (§7).
5. Relatório pode repetir o mesmo exame. → recomendação (§8).

## 10. Arquivos modificados (nesta auditoria)
- `lib/ecg/ecg-case-mapping.ts` — `resolveECGPresetForCase` (resolvedor central, diagnosis-aware + contexto).
- `components/SimuladorECG.tsx` — usa o resolvedor; injeta laudo contextual.
- `src/lab/LaboratoryEngine.ts` — `resumoLabPanel` (resumo objetivo).
- `src/components/LaboratoryPanel.tsx` — passa o resultado objetivo em `onExamViewed`.
- `app/caso/[id]/page.tsx` — `labsResultados` + uso do resultado objetivo no payload/feedback.

_(Correções centrais; sem alterar conteúdo clínico dos casos, layout do Dashboard, login/perfil/planos ou sidebar.)_

## Correção global (motores centrais)
- **examResultMapper** → coberto por `LaboratoryEngine` + `resumoLabPanel` (labs objetivos).
- **ecgCaseMapper** → `resolveECGPresetForCase` (ECG por diagnóstico + contexto).
- **physicalExamMapper / feedbackEvidenceMapper / reportEvidenceMapper** → recomendados (§3, §7, §8) — pendentes por segurança.

## Pendências
- `physicalExamMapper`: sempre registrar a manobra realizada (mesmo sem achado) — §3.
- Diferenciação de graus no feedback do exame físico — §7.
- De-duplicação de exames repetidos no relatório — §8.

## Como testar
1. `npm run build` (deve compilar).
2. Abrir 3 casos adultos e 3 pediátricos e, em cada um:
   - **ECG**: gerar o traçado e conferir preset/ laudo. Sugestões:
     - Adulto: `id 1` (SCA), `020` (IAMCSST), `021` (Fibrilação Atrial).
     - Pediátrico: `Insuficiência cardíaca por cardiopatia congênita`, `Febre/Infecção viral`, `Puericultura`.
   - **Labs**: abrir 2–3 exames na aba "Exames Laboratoriais"; finalizar e ver no relatório os **valores objetivos** (não "visualizado").
3. Conferir no relatório final a coerência exame↔diagnóstico.

## Critérios de aceite
- ✅ `npm run build` passa sem erro.
- ✅ Exames complementares (labs) retornam **resultados objetivos coerentes** com o diagnóstico (via `ClinicalTag`).
- ✅ ECG **não** usa preset genérico inadequado em caso patológico — é escolhido por diagnóstico/idade, com **laudo contextual** quando normal não exclui.
- ✅ Laboratórios deixam de aparecer só como "laudo laboratorial visualizado".
- ✅ Exame físico realizado é sempre registrado (ver §11) — o relatório não mostra "Não registrado" quando o aluno examinou.
- ✅ Auditoria documentada neste arquivo.

---

## 11. Exame físico — CORRIGIDO (registrar toda manobra realizada)
**Causa-raiz (pediátrico):** em `components/pediatria/ExameFisicoPediatrico.tsx`, `handleRealizarAcao` **retornava sem emitir** manobra quando `obterAchadoExameFisicoPed` não encontrava achado configurado (`if (!achado) { setErro(...); return; }`) → `manobrasSolicitadas` vazio → relatório "Não registrado". Além disso, o objeto pediátrico emitido usava `acaoRealizada`/`descricao`, mas o relatório e o `evidence-mapper` leem `textDigitado`/`resposta`/`categoria` — então mesmo achados registrados não eram bem reconhecidos.
_(O módulo **adulto** `ExameFisicoAdultoVisual` já registrava sempre, com fallback `getDescricaoTecnicaNormal` — não precisou de correção.)_

**Correção central implementada:**
- Novo **`lib/osce/physical-exam-mapper.ts`**:
  - `montarManobraExameFisico({ acaoId, titulo, sistema, achado })` → **sempre** retorna um registro padronizado (nunca null). Com achado → usa o achado; sem achado → `"Exame realizado — sem achado patológico relevante configurado para esta manobra."`. Inclui os campos padrão `textDigitado`, `resposta`, `categoria` (via `sistemaParaCategoria`) e `normal`, mantendo `acaoRealizada`/`regiao`/`descricao` (compatibilidade).
  - `sistemaParaCategoria(sistema)` mapeia o sistema pediátrico para a categoria da `ManobraRealizada`.
  - `classificarExameFisico(manobras)` + `ESTADO_EXAME_LABEL` — classifica: **não realizado / realizado sem achado / realizado com achado** (apresentação, sem tocar em scoring).
- `components/pediatria/ExameFisicoPediatrico.tsx` — `handleRealizarAcao` usa o mapper e **emite toda manobra clicada**; a aba visual (`handleRegistrarAchadoDefinitivo`) passou a incluir `textDigitado`/`resposta`/`categoria`.
- `lib/pdf/exportar-feedback-atendimento.ts` — a seção "4. Exame físico realizado" agora mostra a **classificação** do exame e cada manobra como `nome — achado (sem achado relevante)`, agrupada por região, na ordem realizada.

**Não transformou exames em patológicos:** manobras sem achado são marcadas como normais (`normal: true`), com texto neutro.

**Testes:**
- `montarManobraExameFisico` com achado → `{textDigitado:"Avaliar hidratação", resposta:"Mucosas ressecadas…", categoria:"geral", normal:false}`; sem achado → `{textDigitado:"Ausculta cardíaca", resposta:"Exame realizado — sem achado…", categoria:"cardiovascular", normal:true}`.
- `npm run build` ✓ · `tsc --noEmit` 0 erros (fora de `ecgGenerator`).
- Recomendado testar manualmente 3 adultos + 3 pediátricos clicando em manobras e finalizando (ver "Como testar").

**Arquivos modificados (§11):** `lib/osce/physical-exam-mapper.ts` (novo), `components/pediatria/ExameFisicoPediatrico.tsx`, `lib/pdf/exportar-feedback-atendimento.ts`.

**Pendências restantes:**
- Feedback com as 4 diferenciações completas — falta o estado **"realizado, mas não interpretou o achado"** (exige cruzar manobras↔SOAP/diagnóstico). Os outros 3 estados já são reconhecidos (evidence-mapper + `classificarExameFisico`). Não implementado por exigir mexer na lógica do HealthBench (risco de scoring).
- De-duplicação de exames repetidos no relatório (ex.: ECG solicitado várias vezes) — §8.
