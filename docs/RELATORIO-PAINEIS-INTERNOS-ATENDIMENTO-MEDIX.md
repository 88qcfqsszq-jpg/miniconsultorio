# Relatório — Painéis internos do Atendimento MEDIX

**Data:** 1 de julho de 2026
**Escopo:** somente leitura/mapeamento de `app/caso/[id]/page.tsx` e componentes internos do menu Atendimento. **Nenhum arquivo alterado.**

## 1. Resumo executivo

O menu **Atendimento** troca o painel central via o estado `menuAtivo` (desktop) e `abaAtiva` (layout mobile). A coluna central **sempre** renderiza o `ChatPaciente` no topo e, abaixo, um painel condicional conforme `menuAtivo`.

Estado atual do redesign MEDIX:
- **Já MEDIX:** topbar, sidebar global, menu Atendimento, ChatPaciente, FormularioSOAP, PainelDiagnostico, card **lateral** de Sinais Vitais.
- **Ainda no visual antigo (Tailwind branco):** os 6 painéis internos que abrem pelo menu — ResumoAnamnese, Exame Físico (pediátrico inline + adulto em modal), Exames de Imagem (Open-i), Exames, Sinais Vitais **central**, ECG.

Ponto crítico: **Exame Físico do adulto abre um MODAL** (`ExameFisicoAdultoVisual`), não um painel central; só o **pediátrico** renderiza inline. Vários painéis alimentam a pontuação (manobras, exames, ECG), exigindo cautela.

## 2. Controle do menuAtivo

- Declarado em `page.tsx:576`: `const [menuAtivo, setMenuAtivo] = useState<...>("paciente")`.
- Valores possíveis: `"paciente" | "exame" | "imagemRadiologica" | "exames" | "sinaisVitais" | "ecg"`.
- Estado paralelo `abaAtiva` (`page.tsx:570`) — mesmos valores, usado **apenas no layout mobile** (`lg:hidden`).
- Itens do menu (desktop) chamam: `item.id === "exame" ? abrirExameFisico("menu") : setMenuAtivo(item.id)`.
- `abrirExameFisico(origem)` (`page.tsx:583`): **se adulto** → `setModalExameAdultoAberto(true)` (abre modal); **se pediátrico + menu** → `setMenuAtivo("exame")`; senão → `setAbaAtiva("exame")`.
- `isAdulto = caso?.tipoPaciente !== "pediatrico"` (`page.tsx:580`).

## 3. Mapa das abas do Atendimento

| Aba | Valor menuAtivo | Componente | Arquivo | Props principais | Visual atual | Risco |
|---|---|---|---|---|---|---|
| Paciente | `paciente` | `ResumoAnamnese` | components/ResumoAnamnese.tsx | `mensagens` | Antigo | Baixo |
| Exame Físico (adulto) | `exame` → **modal** | `ExameFisicoAdultoVisual` | components/ExameFisicoAdultoVisual.tsx | `caso`, `achadosEncontrados`, `onAchadoEncontrado`, `onFechar` | Antigo (modal) | **Alto** |
| Exame Físico (pediátrico) | `exame` (inline) | `ExameFisicoPediatrico` | components/pediatria/ExameFisicoPediatrico.tsx | `caso`, `onAchadoEncontrado`, `achadosEncontrados`, `onFechar` | Antigo | **Alto** |
| Exames de Imagem | `imagemRadiologica` | `OpenIRawImagePanel` | components/OpenIRawImagePanel.tsx | `imageUrl`, `loading`, `error`, `query` | Antigo | Médio |
| Exames | `exames` | `PainelExamesComplementares` | components/PainelExamesComplementares.tsx | `casoId`, `examesSolicitados`, `onNovoExame`, `desabilitado` | Antigo | Médio-alto |
| Sinais Vitais (central) | `sinaisVitais` | **JSX inline** na page | app/caso/[id]/page.tsx (≈862-908) | usa `sinaisVitaisSolicitados`, `caso.sinaisVitaisCorretos` | Antigo (branco) | Baixo |
| ECG | `ecg` | `SimuladorECG` | components/SimuladorECG.tsx | `padrao`, `caso`, `onClose`, `onECGGerado` | Antigo | **Alto** |

## 4. Detalhamento por aba

### 1) Paciente
- Renderiza `ResumoAnamnese` com `mensagens` (histórico do chat). Display puro dos dados de anamnese. Sem escrita de estado crítico. **Reestilizável só com CSS** (ou wrapper).

### 2) Exame Físico
- **Adulto:** clicar abre **MODAL** `ExameFisicoAdultoVisual` (overlay full-screen, `page.tsx:1059`), não o painel central. Usa **hotspots sobre o boneco**, e inclui a **Ausculta Pulmonar interativa** (áudios `.wav`), registrando `ManobraRealizada` → `handleAchadoExameAdulto` → `handleNovaManobra` → `manobrasSolicitadas` → payload/HealthBench.
- **Pediátrico:** renderiza inline `ExameFisicoPediatrico` (mesmo fluxo de manobras).
- **Risco alto:** hotspots posicionados, áudio de ausculta, e o texto das manobras alimenta a **pontuação**. Reestilizar só o "chrome" externo (moldura/cabeçalho), sem tocar hotspots/coordenadas/registro.

### 3) Exames de Imagem
- `OpenIRawImagePanel` exibe a imagem radiológica vinda do **Open-i** (estados `openIImageUrl`/`openILoading`/`openIError`/`openIQuery`, preenchidos por fetch). O texto "exame de imagem visualizado…" entra no payload (`page.tsx:417`). Visual = card com imagem + estados loading/erro. **Médio** (CSS + cuidado com estados de loading/erro).

### 4) Exames
- `PainelExamesComplementares` — seleção/solicitação de exames laboratoriais/complementares. `onNovoExame` → `handleNovoExame` → `examesSolicitados` → payload/pontuação. **Médio-alto** (CSS reestilizável, mas mexer em JSX arrisca o fluxo de solicitação).

### 5) Sinais Vitais (central)
- **JSX inline** dentro da `page.tsx` (≈862-908): card branco com botão "Solicitar Sinais Vitais" + grade 3 colunas de valores. É **diferente** do card **lateral** (coluna esquerda), que já foi reestilizado para MEDIX no Passo 5.
- Controla/usa `sinaisVitaisSolicitados` (impacta avaliação — se o aluno solicitou) e `caso.sinaisVitaisCorretos`.
- **Baixo risco:** é JSX na própria page, reestilizável igual ao Passo 5 (reaproveitar `medix-vitals-*`), mantendo o gating do "Solicitar".

### 6) ECG
- `SimuladorECG` (`padrao` do caso, `caso`, `onClose`, `onECGGerado`). Usa o **gerador de ECG** (`src/services/ecgGenerator`) e renderiza traçado próprio (canvas/SVG). `onECGGerado` → `handleECGGerado` (estado). **Alto risco** (renderização técnica do traçado; reestilizar só a moldura, nunca o canvas/lógica).

## 5. Componentes e arquivos envolvidos

| Arquivo | Função na tela | Risco visual | Só CSS? | Precisa JSX? | Lógica crítica |
|---|---|---|---|---|---|
| app/caso/[id]/page.tsx | Orquestra menuAtivo + Sinais Vitais central inline | Baixo (só o bloco vitais) | Parcial | Sim (só bloco vitais) | menuAtivo, payload |
| components/ResumoAnamnese.tsx | Resumo da anamnese | Baixo | Sim | Opcional | Não (display) |
| components/ExameFisicoAdultoVisual.tsx | Modal exame físico adulto + ausculta | Alto | Não recomendado | Sim (arriscado) | **Sim** (manobras→score, áudio, hotspots) |
| components/pediatria/ExameFisicoPediatrico.tsx | Exame físico pediátrico | Alto | Parcial | Sim (arriscado) | **Sim** (manobras→score) |
| components/OpenIRawImagePanel.tsx | Imagem radiológica (Open-i) | Médio | Majoritariamente | Talvez | Estados de fetch |
| components/PainelExamesComplementares.tsx | Solicitação de exames | Médio-alto | Parcial | Provável | **Sim** (examesSolicitados→score) |
| components/SimuladorECG.tsx | Traçado ECG | Alto | Só moldura | Não no traçado | **Sim** (gerador ECG/canvas) |
| src/services/ecgGenerator/* | Geração do ECG | — | Não tocar | Não | **Sim** (lógica pura) |

## 6. Dependências críticas

| Painel | Estado local | API/fetch | Dados do caso | Feedback/score | Imagens ext. | ECG gen | Áudio | Hotspots | Modal | ref/useEffect |
|---|---|---|---|---|---|---|---|---|---|---|
| Paciente | mensagens | — | — | indireto (anamnese) | — | — | — | — | — | — |
| Exame Físico | manobrasSolicitadas | — | caso | **sim** | — | — | **sim** (ausculta) | **sim** | **sim** (adulto) | sim |
| Exames de Imagem | openI* | **sim** (Open-i) | caso | indireto (payload) | **sim** | — | — | — | — | sim |
| Exames | examesSolicitados | — | casoId | **sim** | — | — | — | — | — | — |
| Sinais Vitais (central) | sinaisVitaisSolicitados | — | caso.sinaisVitaisCorretos | **sim** (solicitou?) | — | — | — | — | — | — |
| ECG | estado ECG | — | caso.ecg.padrao | indireto | — | **sim** | — | — | — | sim |

## 7. Ordem recomendada para redesign visual

Recomendação **baseada em risco (menor → maior)** — difere da preferência inicial (que começava por Exame Físico/alto risco):

1. **Sinais Vitais central** — JSX inline na page; reaproveitar `medix-vitals-*` do Passo 5. **Risco baixo.**
2. **Paciente (ResumoAnamnese)** — display puro. **Risco baixo.**
3. **Exames (PainelExamesComplementares)** — CSS + wrapper; cuidado com `onNovoExame`. **Risco médio.**
4. **Exames de Imagem (OpenIRawImagePanel)** — CSS na moldura + estados loading/erro. **Risco médio.**
5. **Exame Físico (adulto modal + pediátrico)** — só moldura/cabeçalho; **não tocar** hotspots, coordenadas, ausculta/áudio, registro de manobras. **Risco alto.**
6. **ECG (SimuladorECG)** — só moldura; **não tocar** o canvas/traçado nem o gerador. **Risco alto.**

## 8. Testes necessários por etapa

| Etapa | Editar | NÃO editar | Só CSS? | Teste depois |
|---|---|---|---|---|
| Sinais Vitais central | page.tsx (bloco vitais) + css | lógica solicitar | Quase | Solicitar → grade aparece; scoring do "solicitou" intacto |
| ResumoAnamnese | ResumoAnamnese.tsx (classes) + css | dados/mensagens | Sim | Enviar msg → resumo atualiza |
| Exames | PainelExamesComplementares.tsx + css | onNovoExame/estado | Parcial | Solicitar exame → aparece em examesSolicitados |
| Exames de Imagem | OpenIRawImagePanel.tsx + css | fetch/estados | Majoritário | Abrir aba → imagem/loading/erro corretos |
| Exame Físico | moldura no page/modal + css | hotspots, áudio, manobras | Só moldura | Registrar manobra → entra no payload; ausculta toca |
| ECG | moldura + css | canvas, ecgGenerator | Só moldura | Gerar ECG → traçado correto; onECGGerado dispara |

## 9. Pontos de atenção para não quebrar lógica

- **Não** auto-exibir Sinais Vitais sem "Solicitar" (afeta a avaliação de "aluno solicitou sinais vitais") e vazaria dados.
- Exame Físico do **adulto é modal** (`ExameFisicoAdultoVisual`), não painel central — reestilizar a moldura do modal, preservando hotspots/coordenadas e a Ausculta Pulmonar (áudios).
- Manobras (`manobrasSolicitadas`), exames (`examesSolicitados`) e ECG alimentam o **payload/HealthBench** — não alterar handlers `handleNovaManobra`/`handleNovoExame`/`handleECGGerado`/`handleAchadoExameAdulto`.
- `SimuladorECG` e `src/services/ecgGenerator/*` contêm lógica de geração do traçado — **não tocar**; reestilizar só a moldura externa.
- Open-i depende de fetch assíncrono — preservar estados `openILoading`/`openIError`.
- Preferir sempre **CSS escopado** sob `.consultorio-medix` e classes novas, evitando editar o JSX interno de componentes de alto risco.

## 10. Conclusão

Os 6 painéis internos ainda estão no visual antigo. O caminho seguro é reestilizar do **menor para o maior risco**: Sinais Vitais central e ResumoAnamnese primeiro (baixo), depois Exames e Exames de Imagem (médio), deixando Exame Físico e ECG por último (alto), sempre limitando-se a moldura/CSS e sem tocar hotspots, áudio, canvas do ECG, nem os handlers que alimentam a pontuação.

---

**Relatório criado:** sim.
**Caminho:** `docs/RELATORIO-PAINEIS-INTERNOS-ATENDIMENTO-MEDIX.md`
**Build:** ✅ `npm run build` compila.
**tsc:** ⚠️ `npx tsc --noEmit` acusa erros **pré-existentes** em `src/services/ecgGenerator/leadTransform.ts` (propriedades de derivações no tipo `TransformacaoDerivacoesConfig`) — **não relacionados** à página de atendimento nem a este mapeamento, e o build de produção não é bloqueado por eles.
**Alterações funcionais:** nenhuma (tarefa somente de leitura/relato).
