# Relatório — Ausculta Pulmonar Interativa Completa (Exame Físico Adulto Visual)

**Data:** 29 de junho de 2026
**Status:** ✅ Implementado e validado
**Escopo:** Ausculta pulmonar interativa no adulto, cobrindo todos os tipos de som do acervo (incluindo normal), com seleção por diagnóstico e registro estruturado para o feedback. **Não** altera pediátrico, HealthBench/rubricas/nota, ECG, Open-i/radiologia, `/api/corrigir` nem o layout geral.

---

## 1. Arquivos

### Criados (3) — entregues na 1ª etapa, expandidos nesta
- `lib/ausculta/pulmonar-sounds.ts` — índice dos 50 sons + seleção/fallback.
- `lib/ausculta/pulmonar-case-mapping.ts` — padrões clínicos por diagnóstico.
- `components/ausculta/PulmonaryAuscultationPanel.tsx` — painel (imagem + 6 pontos + áudio + escolha).

### Alterado (1)
- `components/ExameFisicoAdultoVisual.tsx` — ação de ausculta abre o painel na coluna VISUALIZAÇÃO; registro pela cadeia existente.

> Não tocados: `components/pediatria/*`, `lib/pediatria/*`, `lib/healthbench/*`, ECG, `app/api/openi`, `lib/radiology`, `app/api/corrigir`, `lib/adulto/exame-fisico-adulto-mapa.ts`.

---

## 2. Paths reais
- **Áudios:** `/HLS-CMDS/LS/<id>.wav` (`public/HLS-CMDS/LS/`) — **HTTP 200**.
- **Imagem:** `/images/boneco/ausculta_fundo_transparente.png` — **HTTP 200**.

---

## 3. Índice dos sons
- **Total: 50** (todos com `id`, `gender`, `type`, `typeLabel`, `location`, `locationLabel`, `audioUrl`).
- **Por tipo:** Normal 12 · Coarse Crackles 9 · Pleural Rub 9 · Rhonchi 8 · Wheezing 7 · Fine Crackles 5.
- **Por localização:** LUA 11 · RLA 10 · LMA 9 · LLA 8 · RUA 7 · RMA 5.
- **Sons normais incluídos** e usados como base dos pontos não acometidos.

> **Nota técnica:** o `LS.csv` tinha terminação CRLF e nomenclatura divergente de crackles (`_C_`/`_G_` vs arquivos `_FC_`/`_CC_`). O índice é derivado dos **nomes reais dos `.wav`** (auto-descritivos), não do CSV — todos os 50 `audioUrl` apontam para arquivos existentes.

---

## 4. Padrões clínicos (13) — `obterPadraoAuscultaPulmonarPorCaso`

| key | Diagnóstico | Sons | Achado esperado |
|---|---|---|---|
| normal | Ausculta normal / default | todos normal | MV presente bilateralmente, sem ruídos adventícios |
| asma | Asma / broncoespasmo | todos wheezing | Sibilos expiratórios difusos |
| dpoc | DPOC exacerbado | wheezing + roncos médios | Sibilos e roncos difusos |
| pneumonia_direita | Pneumonia (base D) | RLA coarse, resto normal | Crepitações grossas em base direita |
| pneumonia_esquerda | Pneumonia (base E) | LLA coarse, resto normal | Crepitações grossas em base esquerda |
| edema_pulmonar | IC / edema pulmonar | RMA/LMA/RLA/LLA fine | Crepitações finas bibasais |
| bronquite | Bronquite / secreção | roncos médios/inferiores | Roncos em campos médios e inferiores |
| pleurite | Pleurite | atrito focal (RLA/LLA) | Atrito pleural focal |
| atelectasia | Atelectasia pós-op | RLA fine | Crepitações/redução focal em base (TODO MV reduzido) |
| pneumotorax | Pneumotórax | normal (fallback) | MV reduzido/abolido no hemitórax (TODO áudio) |
| derrame_pleural | Derrame pleural | normal (fallback) | MV reduzido em base (TODO áudio) |
| tuberculose | Tuberculose | RUA coarse | Crepitações focais em campo superior |

Cada padrão tem `key`, `label`, `descricao`, `sonsPorPonto`, `achadoEsperado` e `interpretacoesAceitas`. Lateralidade ("esquerda"/"lobo inferior esquerdo") muda pneumonia e pleurite para o lado correspondente. **13/13 corretos** no teste.

---

## 5. Seleção por sexo
`selecionarSomPulmonar`/`obterSomNormalPorLocalizacao` recebem `sexoPreferido` (de `caso.sexo`): tentam o sexo do paciente primeiro, com fallback para qualquer sexo. Nunca falham só por sexo.

## 6. Fallback (7 passos)
1) tipo+loc+sexo → 2) tipo+loc → 3) tipo+outraLoc+sexo → 4) tipo+outraLoc → 5) normal+loc → 6) qualquer normal → 7) null. Validado: `pleural_rub/RLA/F` (inexistente) → `M_PR_RLA`.

---

## 7. Painel
- Imagem `ausculta_fundo_transparente.png` + **6 pontos** clicáveis (RUA, LUA, RMA, LMA, RLA, LLA), com contador de registrados (✓ verde).
- Ao clicar: toca o áudio do ponto; botão "▶ Ouvir novamente".
- 7 opções de resposta (incluindo **Murmúrio vesicular reduzido/abolido**, necessária para pneumotórax/derrame).
- **Não revela** tipo real, ID do áudio nem "correto/incorreto" antes da resposta.
- Permite auscultar/registrar 1 ou vários pontos; registros preservados ao trocar de região (lista compartilhada `manobrasSolicitadas`).

---

## 8. Registro e feedback
Ao registrar um ponto, gera `ManobraRealizada`:
```
categoria: "respiratorio"
textDigitado: "[Ausculta Pulmonar] RLA — Ausculta pulmonar"
resposta: "[Ausculta Pulmonar] Local: Base direita (RLA). Som esperado: Crepitações finas.
           Resposta do aluno: Crepitações finas. Áudio: M_FC_RLA.
           Achado: Crepitações finas em base direita. Reconhecimento correto: sim."
```
Fluxo: painel → `onRegistrarAchado` → `onAchadoEncontrado` → `manobrasSolicitadas` → `physicalExamEvents` → transcript-normalizer → **HealthBench** (E2E confirmado: grades geradas com o achado de ausculta). O campo "Reconhecimento correto" guarda a avaliação da interpretação do aluno (aceita variações conforme `interpretacoesAceitas`).

---

## 9. Testes

### Por padrão (13/13 ✅)
normal, asma, dpoc, pneumonia direita, pneumonia esquerda, IC/edema, bronquite, pleurite, atelectasia, pneumotórax, derrame, tuberculose, e default→normal.

### Estruturais
- 50 sons indexados; todos com `locationLabel`; 0 `audioUrl` sem arquivo.
- `obterSomNormalPorLocalizacao` e fallback de 7 passos OK.
- Build compila; caso adulto **HTTP 200**; imagem e áudio servidos (HTTP 200).

### Não-regressão
- Outras ações de Tórax/Precórdio/Abdome/Membros seguem registrando direto.
- Pediátrico, HealthBench, ECG, Open-i/radiologia, feedback, rubricas, `/api/corrigir`: **inalterados** (verificado por timestamp).

---

## 10. Logs
`[AUSCULTA PULMONAR] caso / diagnostico / padrao / ponto selecionado / audio selecionado / resposta aluno / registrado` — `console.log`/`console.warn` (sem `console.error`).

---

## 11. Limitações / TODO
- **Pneumotórax e derrame** usam som normal como fallback (sem áudio de MV abolido) + achado textual correto; a opção "Murmúrio reduzido/abolido" existe para o aluno.
- **Atelectasia** usa crepitações finas em base (TODO: áudio de MV reduzido).
- TODOs marcados no código para incluir áudio específico de murmúrio reduzido/abolido quando disponível.

---

## 12. Critério final
✅ Em **Tórax > Respiratório → Auscultar tórax**, o aluno vê a imagem com 6 pontos, ouve o som correspondente ao caso (todos os padrões do acervo, inclusive normal), registra sua interpretação e o achado entra de forma estruturada no feedback final — sem afetar pediátrico, ECG, Open-i, HealthBench, rubricas, `/api/corrigir` ou layout.
