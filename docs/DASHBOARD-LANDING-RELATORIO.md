# Relatório — Dashboard Landing (`/dashboard-landing`)

**Data:** 30 de junho de 2026
**Status:** ✅ Página isolada funcional, com sidebar expansível e carrossel do hero estável.
**Escopo:** página inicial de dashboard médico/acadêmico (glassmorphism / azul gelo), criada como rota **isolada de pré-visualização**, sem alterar nenhuma página existente do Mini Consultório.

---

## 1. Arquivos

| Arquivo | Papel |
|---|---|
| [app/dashboard-landing/page.tsx](../app/dashboard-landing/page.tsx) | Rota `/dashboard-landing` (renderiza o componente) |
| [components/dashboard/DashboardLanding.tsx](../components/dashboard/DashboardLanding.tsx) | Componente da página (sidebar, header, hero, painel direito, métricas) |
| [components/dashboard/DashboardLanding.css](../components/dashboard/DashboardLanding.css) | CSS **escopado sob `.dashboard-landing`** (não vaza para o resto do app) |
| [public/assets/dashboard/README.md](../public/assets/dashboard/README.md) | Instruções de onde colocar os PNGs |

**Acesso:** `http://localhost:3000/dashboard-landing` (HTTP 200). A home `/` e demais rotas seguem **intactas** (HTTP 200).

---

## 2. Assets usados (todos servindo HTTP 200)

`/assets/dashboard/`: `hero-medica-holograma.png`, `hero-slide-2.png`, `hero-slide-3.png`, `logo-medix.png`, `case-heart.png`, `case-lung-purple.png`, `case-lung-blue.png`, `case-virus.png`, `icons-casos.png`.

- Nenhuma imagem foi gerada ou redesenhada pelo código.
- Cada `<img>` tem fallback gracioso se o arquivo faltar (logo→texto "MEDIX"; ícone de caso→círculo; slide do hero→holograma).

---

## 3. Estrutura visual

- **Sidebar esquerda** (glass): logo MEDIX no topo + 11 itens de menu (Dashboard ativo) + card "Sua jornada" (Nível 12, barra 72%, XP 2.540/3.500).
- **Header**: avatar, "Olá, Dr. João Silva" + badge PRO, subtexto, busca e 4 botões de ícone.
- **Hero central** (520px): carrossel de 3 slides.
- **Painel direito** (330px): "Casos recomendados pela IA" — 4 cards (IAM/MÉDIA, Asma/DIFÍCIL, PAC/MÉDIA, Dengue/MÉDIA) com os ícones PNG.
- **5 cards de métrica** inferiores (Disciplinas, Conteúdos, Horas, Simulados, Média de desempenho).

Paleta: fundo `#F3F8FF`, primário `#1F7BFF`, tinta `#0B1F4D`, secundário `#5C6D8A`. Glass/ice conforme spec.

---

## 4. Sidebar expansível (hover)

- **Recolhida por padrão: 92px** (só ícones) → **expande para 260px no hover** (ícones + textos).
- Implementação **sem empurrar o conteúdo**: a grid reserva `92px 1fr` e a sidebar é `position: fixed` com `z-index` alto — expande **por cima** do conteúdo.
- Transição `320ms cubic-bezier(0.16,1,0.3,1)`; rótulos animam `opacity`/`max-width`; hover de item com fundo claro + borda azul + `translateX(2px)`.
- Card "Sua jornada": recolhido mostra só a barra; textos aparecem no hover.

---

## 5. Hero — carrossel (reescrito do zero, estável)

**Por que foi reescrito:** a versão anterior empilhava todos os slides (crossfade com vários `position:absolute`/`opacity`), o que causava **sobreposição de textos** durante a troca.

**Versão atual:**
- Renderiza **apenas o slide ativo** (`const activeSlide = HERO_SLIDES[activeIndex]`); `map` é usado **só nas bolinhas**.
- `key={activeSlide.image}` / `key={activeIndex}` → React **desmonta** o slide anterior e monta o novo (um único no DOM) — sem sobreposição.
- Classes **novas** `dl-hero-new-*` (sem reaproveitar o CSS antigo, que foi removido).
- Estado: `activeIndex` + `paused`; `useEffect` com `setInterval(5000)` + cleanup; `goNext`/`goPrev` com update funcional.
- **Autoplay 5s**, **pausa no hover** (`onMouseEnter`/`onMouseLeave`), **setas** ‹ › e **bolinhas** por clique (8px inativa → 24px pill azul ativa).
- Imagem `object-fit: cover`; overlay branco/azul à esquerda (texto legível, imagem não escurece); `onError` com guarda (cai para o holograma, sem loop).
- Animações `dlHeroImageFade` (420ms) e `dlHeroContentFade` (360ms).

**Slides:**
1. BEM-VINDO(A) · Interativo / Tutor Clínico de IA · "Iniciar A Simulação ↗"
2. PRÁTICA CLÍNICA · Casos OSCE / Inteligentes · "Ver Casos Clínicos ↗"
3. ATENDIMENTO · Simule Atendimentos / com a IA · "Iniciar Simulação ↗"

---

## 6. Notas técnicas

- **Logo MEDIX:** o PNG é quase quadrado (438×450) com muito espaço transparente interno. Para destacá-lo num topo compacto, o container `.dl-logo` tem altura fixa (118px) + `overflow: hidden` e a imagem é ampliada (`scale(1.35)`) com `translateY` para enquadrar o miolo — sem recriar o arquivo. (Recorte do espaço vazio do PNG continua sendo a melhoria ideal futura.)
- **CSS escopado:** todas as regras vivem sob `.dashboard-landing`, garantindo zero impacto nas demais páginas.

---

## 7. Verificação

| Item | Resultado |
|---|---|
| `npm run build` | ✅ compila |
| `npx tsc --noEmit` | ✅ sem erros |
| `/dashboard-landing` | **HTTP 200** |
| `/` (home) | **HTTP 200** (intacta) |
| 8 assets do dashboard | **HTTP 200** cada |
| DOM do hero | 1 slide por vez, sem texto duplicado |

---

## 8. Não alterado (isolamento)

Sidebar/painel/cards/header de outras telas, HealthBench, ECG, Open-i/radiologia, exame físico, ausculta, `/api/corrigir`, casos clínicos e **todas as páginas/rotas existentes** — nenhum tocado. A rota `/dashboard-landing` permanece **isolada e sem link na home** (conforme combinado).

---

## 9. Pendências / próximos passos sugeridos

- Ligar os CTAs e itens de menu a rotas reais (ex.: "Ver Casos Clínicos" → `/faca-o-osce`), quando desejado.
- Opcional: emblema dedicado do MEDIX para o estado **recolhido** da sidebar (hoje mostra recorte central do logo).
- Opcional: recortar o espaço transparente do `logo-medix.png` para permitir um logo maior sem `scale`.
