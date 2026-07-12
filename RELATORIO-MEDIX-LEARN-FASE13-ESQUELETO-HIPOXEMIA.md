# RELATÓRIO — MEDIX Learn · Fase 13: Esqueleto + Trilha Hipoxemia

**Data:** 2026-07-12  
**Fase:** 13 — Esqueleto do MEDIX Learn com trilha Hipoxemia completa  
**Status:** ✅ CONCLUÍDA

---

## Arquivos criados

### Rotas

| Arquivo | Rota | Tipo |
|---|---|---|
| `app/learn/page.tsx` | `/learn` | Server Component (RSC) |
| `app/learn/respiratorio/page.tsx` | `/learn/respiratorio` | Server Component (RSC) |
| `app/learn/respiratorio/hipoxemia/page.tsx` | `/learn/respiratorio/hipoxemia` | Server Component (RSC) |

### Dados (lib/medix-learn/)

| Arquivo | Propósito |
|---|---|
| `lib/medix-learn/types.ts` | Tipos TypeScript: LearnTrailData, LearnMiniCase, LearnQuestion, LearnBridge, LearnSection, LearnSystem, LearnTrailItem |
| `lib/medix-learn/trilhas/hipoxemia.ts` | Dados da trilha Hipoxemia (fonte: documento de curadoria) |
| `lib/medix-learn/index.ts` | Re-exports + array LEARN_SYSTEMS (5 sistemas) |

### Componentes (components/medix-learn/)

| Componente | Tipo | Propósito |
|---|---|---|
| `LearnShell.tsx` | RSC | Wrapper de layout (background, max-width, gap) |
| `LearnHero.tsx` | `"use client"` | Hero com título, subtítulo, badges, breadcrumb e hover nos links |
| `LearnSystemCard.tsx` | `"use client"` | Card de sistema (Respiratório, Cardiovascular, etc.) com hover |
| `LearnTrailCard.tsx` | `"use client"` | Card de trilha individual com hover |
| `LearnSectionCard.tsx` | RSC | Seção de conteúdo didático (parágrafos, itens, destaque) |
| `LearnMiniCaseCard.tsx` | RSC | Card de mini-caso completo (cenário, dados, mecanismo, pergunta, erro, ponte) |
| `LearnActiveQuestionCard.tsx` | `"use client"` | Questão ativa com expand/collapse (state local) |
| `LearnMapBox.tsx` | RSC | Mapa final em formato pré-formatado (monospace) |
| `LearnBridgeBox.tsx` | `"use client"` | Card de ponte para OSCE com hover no link |
| `LearnHomePage.tsx` | RSC | Página /learn (compõe Shell + Hero + cards de sistemas) |
| `LearnRespiratorioPage.tsx` | RSC | Página /learn/respiratorio (compõe trilhas do sistema) |
| `LearnHipoxemiaPage.tsx` | RSC | Página /learn/respiratorio/hipoxemia (trilha completa) |

---

## Rotas criadas

| URL | Conteúdo |
|---|---|
| `/learn` | Página inicial do MEDIX Learn: 5 cards de sistemas (1 ativo, 4 em breve) |
| `/learn/respiratorio` | Sistema Respiratório: 6 trilhas (1 ativa, 5 em breve) |
| `/learn/respiratorio/hipoxemia` | Trilha completa: 9 seções + 4 mini-casos + 8 questões + mapa + 2 pontes OSCE |

---

## Estrutura da trilha Hipoxemia

Baseada integralmente no documento `MEDIX-LEARN-TRILHA-HIPOXEMIA-CONTEUDO.md`.

### 9 seções de conteúdo

| # | Seção |
|---|---|
| 1 | O que é SpO₂? |
| 2 | O que a SpO₂ não mede |
| 3 | Oxigenação vs Ventilação |
| 4 | Relação V/Q |
| 5 | Shunt |
| 6 | Hipoventilação |
| 7 | Quando o oxigênio resolve |
| 8 | Quando o oxigênio não resolve |
| 9 | Semiologia da hipoxemia |

### 4 mini-casos obrigatórios

| Mini-caso | Mecanismo | Cor |
|---|---|---|
| Asma grave | V/Q alterado por broncoconstrição | Âmbar |
| Pneumonia | V/Q + shunt parcial por exsudato alveolar | Verde |
| TEP | V/Q alto / espaço morto (perfusão reduzida) | Azul |
| Pneumotórax hipertensivo | Colapso pulmonar + choque obstrutivo | Vermelho |

Cada mini-caso exibe: cenário, dados-chave, mecanismo, pergunta central + resposta esperada, erro comum, ponte OSCE.

### 8 questões ativas

Expandíveis com click — `LearnActiveQuestionCard` usa `"use client"` com `useState`. Cada questão exige raciocínio, não memorização.

### Mapa final

Árvore de mecanismos de hipoxemia em formato monospace (`pre`): baixa FiO₂, hipoventilação, V/Q alterado (baixo e alto), shunt, causa mecânica.

### 2 pontes para OSCE

- **MEDIX OSCE Ciclo Básico** → `/faca-o-osce` (5 casos sugeridos + 5 competências)
- **MEDIX OSCE Clínico** → `/casos-dinamicos` (4 casos dinâmicos sugeridos + 5 competências)

---

## Navegação — sidebar

`AppSidebar.tsx` **não foi alterado** (regra absoluta da sessão).

Acesso ao MEDIX Learn disponível via URL direta `/learn` ou navegação manual.

Recomendação para Fase 14: adicionar item `{ key: "learn", label: "MEDIX Learn", icon: "icon-conteudos.png", href: "/learn" }` em `NAV_ITEMS` na `AppSidebar.tsx` quando liberado.

---

## Confirmações

| Item | Status |
|---|---|
| OSCE Ciclo Básico (`app/faca-o-osce`, `app/caso/[id]`) não alterado | ✅ |
| OSCE Clínico / casos-dinamicos não alterado | ✅ |
| Pulse não alterado | ✅ |
| `app/treinamento`, `CasoCard.tsx`, `PainelGerarCaso.tsx` não alterados | ✅ |
| Pendências antigas intocadas | ✅ |
| Nenhum mini-caso inventado fora do documento | ✅ |
| Sidebar não alterada | ✅ (regra absoluta) |
| Sem commit | ✅ |

---

## Validações

| Validação | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ exit 0, sem erros |
| `npm run build` | ✅ sucesso |
| `/learn` no build output | ✅ (Static) |
| `/learn/respiratorio` no build output | ✅ (Static) |
| `/learn/respiratorio/hipoxemia` no build output | ✅ (Static) |

**Correção aplicada durante build:** os componentes com event handlers (`onMouseOver`/`onMouseOut`) precisaram de `"use client"` — `LearnHero`, `LearnSystemCard`, `LearnTrailCard`, `LearnBridgeBox`. Em Next.js App Router, event handlers não podem existir em Server Components. Adicionado `"use client"` nesses quatro componentes.

---

## Limitações

1. **Sidebar:** entrada "MEDIX Learn" não adicionada (regra absoluta de não alterar AppSidebar nesta sessão).
2. **Sem progresso salvo:** o estado de progresso do aluno (lições concluídas) não foi implementado — previsto para Fase 15+.
3. **Questões sem avaliação:** as questões ativas mostram resposta ao clicar, mas não avaliam a resposta livre do aluno.
4. **Sem animações de transição:** as seções são renderizadas estáticas, sem animação de entrada.
5. **Conteúdo completo apenas na Hipoxemia:** outras trilhas e sistemas são "em breve".

---

## Próximos passos recomendados

**Fase 14 — Sidebar:**  
Adicionar item `MEDIX Learn` no `NAV_ITEMS` da `AppSidebar` com `isNavActive` para `/learn`.

**Fase 15 — Componentes reutilizáveis avançados:**  
`LearnProgressSidebar` (sidebar de progresso interno), `ClinicalPearl` (destaque pedagógico), avaliação de resposta nas questões ativas.

**Fase 16 — Segunda trilha:**  
`/learn/respiratorio/dispneia` com estrutura análoga à Hipoxemia.

**Fase 17 — Progresso persistido:**  
`localStorage` ou banco para marcar trilhas concluídas e questões respondidas.
