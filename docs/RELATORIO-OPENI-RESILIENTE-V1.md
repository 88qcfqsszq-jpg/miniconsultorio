# Relatório — Open-i Resiliente V1 (fallback de queries + cache robusto)

**Data:** 29 de junho de 2026
**Status:** ✅ Implementado e validado (lógica por mock; upstream Open-i indisponível no momento)
**Escopo:** Camada de busca de imagens (Open-i). **Não** troca a fonte nem altera HealthBench, feedback, rubricas, ECG, exame físico, `/api/corrigir` ou layout principal.

---

## 1. Resumo

Substituída a busca de imagem por uma única query fraca (ex.: `atelectases`) por uma **cascata resiliente**: query primária + fallbacks em inglês, com **cache de sucesso por query e por diagnóstico**, **distinção de tipos de falha** e **falha amigável** quando o upstream está fora. O caso "Atelectasia pós-operatória basal" deixa de depender de uma única query.

---

## 2. Arquivos alterados (2)

| Arquivo | Mudança |
|---|---|
| `app/api/openi/raw/route.ts` | Reescrito: mapa de configs, cascata, cache (query+diagnóstico+negativo curto), distinção de falhas, logs `[OPENI RESILIENT]` |
| `components/OpenIRawImagePanel.tsx` | Mensagem amigável (mantida da auditoria); contrato da UI (`success/imageUrl/query/fromCache`) preservado |

> Não tocados: `lib/radiology/providers/*` (NIH/VinDr/TCIA), OHIF/DICOM, ECG, HealthBench, feedback, rubricas, exame físico, `/api/corrigir`, layout.

---

## 3. Mapa de queries com fallback

`type OpenIQueryConfig = { id, primaryQuery, fallbackQueries[], aliases[] }`.
`resolverConfig` casa por **alias** (normalizado sem acento, mais específico primeiro); `montarPlano` gera `[primaryQuery, ...fallbackQueries]` (query explícita do usuário, se houver, entra na frente).

| Diagnóstico | Primária | Fallbacks |
|---|---|---|
| Atelectasia | `postoperative atelectasis chest xray` | `atelectasis chest xray`, `lobar atelectasis chest radiograph`, `segmental atelectasis chest xray`, `post operative atelectasis radiograph` |
| Pneumonia | `pneumonia chest xray consolidation` | lobar / chest radiograph / airspace consolidation / community acquired |
| Pneumotórax | `pneumothorax chest xray pleural line` | spontaneous / radiograph / large / apical |
| Derrame pleural | `pleural effusion chest xray` | meniscus sign / large / unilateral / costophrenic blunting |
| Edema pulmonar | `pulmonary edema chest xray` | cardiogenic / interstitial / alveolar / CHF |
| Tuberculose | `pulmonary tuberculosis chest xray` | apical cavitation / active / tb radiograph / upper lobe |
| (Asma, DPOC) | asthma / emphysema | fallbacks simples (preservados) |

Aliases PT/EN por config (ex.: atelectasia, atelectasia pós-operatória, postoperative atelectasis, lobar atelectasis…).

---

## 4. Executor em cascata

Para cada query, em ordem:
1. **cache por query** (sucesso) → retorna `fromCache:true`;
2. consulta Open-i (`buscarOpenIQuery`, timeout 6s);
3. **sucesso** → cacheia por query **e** por diagnóstico, limpa cache negativo, retorna `queryUsada`;
4. **falha** → registra em `attemptedQueries` e segue.

**Distinção de falha (TAREFA 4):**
- `vazio` (JSON válido, lista vazia) / `sem_imagem` (sem `imgLarge`) = **query fraca** → tenta **todas** as queries;
- `http_error` / `invalid_response` (HTML) / `timeout` = **upstream fora** → **aborta após 2** falhas (não martela) e marca `indisponivel`.

---

## 5. Cache

- **Sucesso por query** e **sucesso por diagnóstico normalizado** (atalho: diagnóstico já resolvido reutiliza sem bater no upstream).
- Se uma **fallback** funciona, o diagnóstico passa a usar esse sucesso (`fromCache:true`) — resolve o caso da atelectasia.
- **Negativo curto** por diagnóstico (TTL **10 min**), só quando o upstream esteve fora; limpo ao primeiro sucesso. Não há cache negativo permanente.

---

## 6. Tratamento de Open-i fora + mensagem

`success:false`, `upstreamStatus:"indisponivel"`, `attemptedQueries` no debug, **sem quebrar a tela**. Mensagem ao usuário: "Não encontramos imagem adequada no Open-i para este diagnóstico. Tente solicitar outro exame ou use curadoria manual/fonte alternativa."

---

## 7. Debug e logs

- `GET /api/openi/raw?diagnostico=...&debug=true` → `{ success, configId, diagnosticoNormalizado, upstreamStatus, attemptedQueries[{query,upstreamStatus,totalBrutos,totalValidos,motivo}], queryUsada }`.
- Logs `console.log/console.warn`: `[OPENI RESILIENT] diagnosticoOriginal / diagnosticoNormalizado / queryPrimaria / fallbackQueries / tentandoQuery / resultadoQuery / selectedQuery / cacheHit / upstreamIndisponivel / falhaFinal`. Nenhum `console.error` (sem overlay vermelho).

---

## 8. Testes

### 8.1 App real (upstream fora agora)
Atelectasia → `configId: atelectasia_pos_operatoria`; tenta `postoperative atelectasis chest xray` → `atelectasis chest xray`; `upstreamStatus: indisponivel`; mensagem amigável; não quebra.

### 8.2 Mock (lógica de fallback/cache)
| Teste | Resultado |
|---|---|
| T1 — 1ª vazia, 2ª retorna imagem | ✅ `success`, `queryUsada: atelectasis chest xray` |
| T2 — repetir mesmo diagnóstico | ✅ `fromCache: true` (cache por diagnóstico) |
| T3 — todas vazias (upstream OK) | ✅ tenta as **5** queries em ordem; `sem_imagem` |
| T4 — upstream fora (HTML) | ✅ aborta após 2; `indisponivel`; mensagem amigável; não quebra |
| T5 — primária OK | ✅ sucesso imediato |

### 8.3 Não-regressão
- Build compila; contrato da UI inalterado (tela continua lendo `success/imageUrl/query`).
- Tuberculose/asma: a lógica de config + cache está correta (cache em memória reseta no rebuild; revalida ao vivo quando o Open-i normalizar).
- HealthBench, feedback, rubricas, ECG, exame físico, layout: inalterados.

---

## 9. Limitação atual

O **upstream Open-i está indisponível** neste momento (retorna HTML para queries não cacheadas). Por isso a confirmação "imagem real aparecendo" depende de o Open-i normalizar; a **lógica resiliente** está validada por mock e pela cascata real. Quando voltar, atelectasia tentará as 5 queries, cacheará o 1º sucesso e não dependerá mais de `atelectases`.

---

## 10. Como reverter

`app/api/openi/raw/route.ts` é a única peça de lógica. Reverter = restaurar a versão anterior do arquivo (tradução simples + cache por query, sem cascata). A mensagem amigável em `OpenIRawImagePanel.tsx` pode ser mantida independentemente.

---

## 11. Próximos passos sugeridos (não implementados)

1. Revalidar ao vivo quando o Open-i normalizar (qual fallback de atelectasia realmente retorna imagem).
2. Expandir o mapa para mais diagnósticos torácicos conforme necessidade.
3. Só então considerar fonte alternativa (NIH/VinDr/TCIA) — fora do escopo desta tarefa.

> Nenhuma fonte nova foi adicionada; apenas resiliência sobre o Open-i.
