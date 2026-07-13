# RELATÓRIO — MEDIX Learn · Fase 14: Implementação Completa (49 trilhas · 7 sistemas)

**Data:** 2026-07-12  
**Fase:** 14 — MEDIX Learn completo a partir do pacote curado V2  
**Status:** ✅ CONCLUÍDA

---

## Resumo

Expansão do MEDIX Learn de 1 trilha (Hipoxemia) para **49 trilhas em 7 sistemas**, usando o pacote curado `data/MEDIX_LEARN_COMPLETO_DETALHADO_V2/` como fonte de verdade. Nenhum conteúdo clínico inventado.

---

## Arquivos criados / modificados

### Conteúdo (content/learn/)

49 arquivos `.md` copiados do pacote V2 e renomeados com slugs:

| Sistema | Arquivos |
|---|---|
| `content/learn/respiratorio/` | 7 arquivos (hipoxemia, dispneia, sibilancia-e-broncoespasmo, tosse-e-febre, dor-toracica-pleuritica, exame-fisico-respiratorio, gasometria-basica) |
| `content/learn/cardiovascular/` | 7 arquivos |
| `content/learn/infectologia/` | 7 arquivos |
| `content/learn/neurologia/` | 7 arquivos |
| `content/learn/gastro-abdome/` | 7 arquivos |
| `content/learn/semiologia-geral/` | 7 arquivos |
| `content/learn/raciocinio-clinico/` | 7 arquivos |

### Infraestrutura (lib/medix-learn/)

| Arquivo | Propósito |
|---|---|
| `lib/medix-learn/md-parser.ts` | Parser de markdown → `LearnTrailData`; lê seções 1-4, mini-casos, questões, mapa e pontes OSCE |
| `lib/medix-learn/loader.ts` | Carrega `.md` de `content/learn/` via `fs.readFileSync`; Hipoxemia usa override TypeScript |
| `lib/medix-learn/index.ts` | Atualizado: 7 sistemas, 49 trilhas, todas `disponivel: true` |

### Componentes (components/medix-learn/)

| Arquivo | Propósito |
|---|---|
| `LearnTrailPage.tsx` | Renderizador genérico de trilha (aceita `LearnTrailData` + `systemId`) |
| `LearnSystemPage.tsx` | Renderizador genérico de sistema (aceita `systemId`, lê LEARN_SYSTEMS) |

### Rotas (app/learn/)

| Quantidade | Tipo |
|---|---|
| 7 | Páginas de sistema (`/learn/<sistema>`) |
| 48 | Páginas de trilha (`/learn/<sistema>/<trilha>`) |
| 1 | `/learn` (existente, não modificado) |

### Sidebar

| Arquivo | Alteração |
|---|---|
| `components/layout/AppSidebar.tsx` | Adicionado item `{ key: "learn", label: "MEDIX Learn", icon: "icon-simulacao.png", href: "/learn" }` em `NAV_ITEMS` e case `/learn` em `isNavActive` |

---

## Arquitetura do parser

```
content/learn/<sistema>/<trilha>.md
         ↓  (readFileSync)
     loader.ts
         ↓  (parseMdTrail)
     md-parser.ts
         ↓
    LearnTrailData
         ↓
    LearnTrailPage (RSC)
```

- Seções 1-4 → `secoes[]` com `paragrafos`, `items` e `destaque` (primeira linha do code block)
- Mini-casos → parser de estado (`## Mini-caso N —`) com 7 subsections `###`
- Questões ativas → match `**Pergunta:**` / `**Resposta esperada:**`
- Mapa final → conteúdo do code block em `# 7. Mapa final`
- Pontes → bullets extraídos de `# 8. Ponte para OSCE`

**Override Hipoxemia:** `loader.ts` devolve `trilhaHipoxemia` (TypeScript, Fase 13) quando `systemId === "respiratorio" && trailId === "hipoxemia"` — preserva conteúdo mais rico sem empobrecimento.

---

## Validações

| Validação | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ exit 0, sem erros |
| `npm run build` | ✅ sucesso |
| Rotas `/learn` | ✅ Static |
| Rotas `/learn/respiratorio` até `/learn/raciocinio-clinico` (7) | ✅ Static |
| Rotas das 49 trilhas | ✅ Static (todas) |
| Hipoxemia preservada | ✅ usa TypeScript override |
| Conteúdo dos outros 48 do V2 | ✅ nenhum conteúdo inventado |

---

## Regras respeitadas

| Regra | Status |
|---|---|
| OSCE Ciclo Básico não alterado | ✅ |
| OSCE Clínico / casos-dinamicos não alterado | ✅ |
| Pulse não alterado | ✅ |
| `app/caso/[id]`, `app/faca-o-osce`, `app/treinamento` não alterados | ✅ |
| `CasoCard.tsx`, `PainelGerarCaso.tsx` não alterados | ✅ |
| AppShell.tsx, AppShell.css não alterados | ✅ |
| AppSidebar: apenas NAV_ITEMS + isNavActive, sem layout/cores/lógica | ✅ |
| Sem zips, CSVs, logs ou binários no commit | ✅ |
| Sem conteúdo inventado fora dos `.md` da curadoria | ✅ |
| `data/MEDIX_LEARN_COMPLETO_DETALHADO_V2/` não commitado | ✅ |

---

## Correção pós-teste visual — React key duplicada

**Erro encontrado no navegador:**
```
Encountered two children with the same key, `→`.
Keys should be unique so that components maintain their identity across updates.
```

**Causa:** o parser de markdown (`md-parser.ts`) converte os achados-chave de cada mini-caso em `{ label: "→", valor: item }`. No `LearnMiniCaseCard.tsx`, o `.map()` usava `key={d.label}`, resultando em `key="→"` para todos os itens de cada mini-caso — duplicata garantida em qualquer trilha do V2.

**Arquivos corrigidos:**

| Arquivo | Chave problemática | Chave corrigida |
|---|---|---|
| `components/medix-learn/LearnMiniCaseCard.tsx` | `key={d.label}` | `key={\`${miniCase.id}-dado-${i}\`}` |
| `components/medix-learn/LearnHero.tsx` | `key={crumb.href}` | `key={\`crumb-${i}\`}` |
| `components/medix-learn/LearnHero.tsx` | `key={b}` | `key={\`badge-${i}\`}` |
| `components/medix-learn/LearnBridgeBox.tsx` | `key={c}` | `key={\`caso-${i}\`}` |
| `components/medix-learn/LearnBridgeBox.tsx` | `key={comp}` | `key={\`${bridge.modulo}-comp-${i}\`}` |
| `components/medix-learn/LearnTrailPage.tsx` | `key={obj}` | `key={\`obj-${i}\`}` |
| `components/medix-learn/LearnHipoxemiaPage.tsx` | `key={obj}` | `key={\`obj-${i}\`}` |

**Validações:**
- `npx tsc --noEmit` → ✅ sem erros
- `npm run build` → ✅ 92/92 páginas estáticas geradas
- Nenhuma alteração de conteúdo clínico, layout ou visual

---

## Correção pós-teste visual — Internal Server Error

**Sintoma:** após a correção das keys, todas as páginas `/learn` retornavam `Internal Server Error` (HTTP 500) no navegador.

**Erro real (terminal):** ao subir um dev server **limpo** e acessar as rotas, o log do Next.js registrou HTTP 200 em todas — nenhum stack trace, nenhum erro de compilação, nenhum `server-only`/`fs`.

**Causa raiz:** o HTTP 500 vinha de um **dev server antigo (Turbopack)** que estava em execução ininterrupta desde antes das edições — inclusive antes de `lib/medix-learn/extra-systems.ts` existir. As sucessivas edições (keys) e a criação do novo módulo deixaram o cache incremental do Turbopack em `.next/` inconsistente com o grafo de módulos real. O processo servia bundles obsoletos → 500. **Não havia bug de código.**

**Auditoria estrutural realizada (para descartar causas de código):**

| Verificação | Resultado |
|---|---|
| Client component importa `loader.ts`/`md-parser.ts`/`fs`/`server-only`? | ❌ Nenhum — `loader.ts` só é importado por `page.tsx` (Server Components) |
| `loader.ts` protegido com `import "server-only"` | ✅ |
| Import circular em `lib/medix-learn/*` | ❌ Nenhum |
| Ícone da sidebar (`icon-simulacao.png`) existe | ✅ presente em `sidebar-icons/` |
| Slugs `content/learn/**` batem com as rotas | ✅ 49/49 |

**Correção aplicada (sem alteração de código):**
1. `kill` do dev server obsoleto;
2. `rm -rf .next` (limpeza total do cache Turbopack);
3. `npm run build` limpo → ✅ **92/92** páginas estáticas (SSG chama `loadTrail`/`fs` em build-time);
4. `npm run dev` fresco.

**Validação final — todas HTTP 200, zero erros no log:**

| Rota | Status |
|---|---|
| `/learn` | ✅ 200 |
| `/learn/respiratorio` · `/hipoxemia` | ✅ 200 |
| `/learn/cardiovascular` | ✅ 200 |
| `/learn/infectologia` | ✅ 200 |
| `/learn/neurologia` | ✅ 200 |
| `/learn/gastro-abdome` | ✅ 200 |
| `/learn/semiologia-geral` | ✅ 200 |
| `/learn/raciocinio-clinico` | ✅ 200 |

**Confirmação:** nenhum arquivo `.md` de conteúdo clínico foi alterado; nenhuma mudança de código foi necessária para resolver o 500 (era estado de cache do dev). As correções de keys permanecem as únicas alterações de código deste ciclo.
