# Relatório — FreshHeroCarousel (Hero do `/dashboard-landing` reescrito do zero)

**Data:** 30 de junho de 2026
**Status:** ✅ Hero antigo apagado por completo e substituído por um carrossel novo, isolado e estável.
**Rota:** `/dashboard-landing` (isolada; sem link na home).

---

## 1. Objetivo

Eliminar de vez o problema de **texto duplicado/sobreposto** no hero, recriando o carrossel do zero — sem reaproveitar componente, classes, lógica ou CSS antigos.

---

## 2. Arquivos alterados (somente o hero)

| Arquivo | Mudança |
|---|---|
| [components/dashboard/DashboardLanding.tsx](../components/dashboard/DashboardLanding.tsx) | Removido `HeroCarousel`/`HERO_SLIDES`; criado `FreshHeroCarousel` + `FRESH_HERO_SLIDES`; layout chama `<FreshHeroCarousel />` |
| [components/dashboard/DashboardLanding.css](../components/dashboard/DashboardLanding.css) | Removido todo o bloco `dl-hero-new*` + keyframes `dlHero*`; adicionado CSS novo `fresh-hero*` + keyframes `freshHero*` |

Nada mais foi tocado: sidebar, header, logo, painel direito, cards inferiores, layout externo, estilo glass/ice, rotas e páginas existentes.

---

## 3. O que foi removido (antigo)

- Componente `HeroCarousel` e array `HERO_SLIDES`.
- Estado/lógica antigos (`activeIndex`, `paused`, `goNext`, `goPrev`).
- Classes CSS `dl-hero-new`, `dl-hero-new-image`, `dl-hero-new-overlay`, `dl-hero-new-content`, `dl-hero-new-eyebrow`, `dl-hero-new-description`, `dl-hero-new-cta`, `dl-hero-new-arrow*`, `dl-hero-new-dots*`.
- Keyframes `dlHeroImageFade`, `dlHeroContentFade` (e a regra responsiva antiga).

**Busca global confirmou: zero resíduo antigo** (`dl-hero*`, `dlHero*`, `HeroCarousel`/`HERO_SLIDES` sem "Fresh").

---

## 4. O que foi criado (novo)

**`FreshHeroCarousel`** (componente isolado no mesmo arquivo):
- Estado próprio: `index`, `isPaused`.
- `slide = FRESH_HERO_SLIDES[index] ?? FRESH_HERO_SLIDES[0]`.
- Autoplay 5s (`window.setInterval`) com cleanup; pausa no hover (`onMouseEnter`/`onMouseLeave`).
- `nextSlide` / `prevSlide` (update funcional).
- Renderiza **apenas o slide ativo**: 1 `<img>`, 1 bloco de texto (`eyebrow` / `h1` com `span`+`strong` / `description` / CTA). `map` **só** nas bolinhas.
- `key={slide.image}` na imagem e `key={fresh-content-${index}}` no conteúdo → React desmonta o anterior e monta o novo (nunca coexistem).
- `onError` com guarda (cai para `hero-medica-holograma.png`, sem loop).
- Setas e bolinhas com `preventDefault` + `stopPropagation`.

**CSS novo** `fresh-hero*`: imagem `object-fit: cover` + `pointer-events: none`; overlay `pointer-events: none`; setas/bolinhas `z-index: 20` + `pointer-events: auto` (cliques funcionam); animações `freshHeroImageIn` (420ms) e `freshHeroTextIn` (360ms).

---

## 5. Slides

| # | Imagem | Eyebrow | Título | CTA |
|---|---|---|---|---|
| 1 | hero-medica-holograma.png | BEM-VINDO(A) | Interativo / Tutor Clínico de IA | Iniciar A Simulação ↗ |
| 2 | hero-slide-2.png | PRÁTICA CLÍNICA | Casos OSCE / Inteligentes | Ver Casos Clínicos ↗ |
| 3 | hero-slide-3.png | ATENDIMENTO | Simule Atendimentos / com a IA | Iniciar Simulação ↗ |

> As 3 imagens foram inspecionadas visualmente e estão **limpas** (sem texto embutido). O texto é 100% HTML/CSS, sobre a imagem.

---

## 6. Diagnóstico da causa-raiz (histórico)

O texto duplicado **não vinha das imagens** (verificadas limpas) **nem do código** (que renderiza 1 slide por vez). A origem era **bundle JS antigo em cache** (`.next` + navegador) servindo a versão anterior do hero. Por isso a correção incluiu, além da reescrita: `rm -rf .next` + reinício do `next dev` (bundle novo, hash novo).

---

## 7. Verificação objetiva (servidor recompilado)

| Item | Resultado |
|---|---|
| `npm run build` | ✅ compila |
| `npx tsc --noEmit` | ✅ sem erros |
| `/dashboard-landing` | **HTTP 200** |
| `/` (home) | **HTTP 200** |
| `class="fresh-hero"` no HTML | **1** section |
| `fresh-hero-content` (bloco de texto) | **1** |
| `fresh-hero-image` (imagem) | **1** |
| Classes antigas `dl-hero` no HTML | **0** |
| Texto do slide ativo no HTML | 1 ocorrência (só o ativo) |
| Texto de outros slides no HTML | 0 (não renderizados) |

→ Prova objetiva: **uma imagem + um bloco de texto por vez, sem duplicidade, sem resíduo antigo**.

---

## 8. Comportamento esperado (validar no navegador)

Após **Cmd+Shift+R** (ou aba privada) em `http://localhost:3000/dashboard-landing`:
- Carrossel troca sozinho a cada 5s; hover pausa, sair retoma.
- Seta direita avança, seta esquerda volta, bolinhas selecionam.
- Um único texto por slide; nada solto fora/abaixo do hero.
- Sidebar, header, painel direito e cards inferiores no lugar.

---

## 9. Observação sobre cache

Como o `.next` foi recriado, os chunks JS têm hash novo — um reload normal já deve pegar o bundle limpo; o hard refresh garante. Se ainda aparecer texto antigo, é exclusivamente cache persistente do Safari (testar em aba privada confirma).
