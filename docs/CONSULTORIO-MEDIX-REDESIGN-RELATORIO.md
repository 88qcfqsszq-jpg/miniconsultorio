# Relatório — Redesign visual MEDIX da página de atendimento (passo 1)

**Data:** 1 de julho de 2026
**Rota:** `/caso/[id]` (página de atendimento OSCE)
**Status:** ✅ Primeiro passo estrutural aplicado — tema MEDIX + sidebar global + menu de atendimento com ícones PNG. **Zero alteração de lógica.**

---

## 1. Objetivo
Migrar a página de atendimento para o visual MEDIX aprovado (azul-gelo, branco translúcido, glassmorphism, bordas azuladas, botões azul vivo), **sem tocar** em lógica clínica, casos, backend, rotas, estado do paciente, envio de mensagem, SOAP ou feedback.

---

## 2. Arquivos criados
| Arquivo | Papel |
|---|---|
| [app/caso/[id]/consultorio-medix.css](../app/caso/%5Bid%5D/consultorio-medix.css) | Tema MEDIX **escopado** sob `.consultorio-medix` (paleta, fundo azul-gelo, cards glass, sidebar global, menu de atendimento) |
| [components/consultorio/MedixGlobalSidebar.tsx](../components/consultorio/MedixGlobalSidebar.tsx) | Sidebar global recolhida (82px, fixa) — **somente visual**, sem lógica |

## 3. Arquivo alterado (apenas JSX/classe visual)
[app/caso/[id]/page.tsx](../app/caso/%5Bid%5D/page.tsx):
- Import do CSS + do `MedixGlobalSidebar`.
- Root `min-h-screen bg-white` → `min-h-screen consultorio-medix` (fundo azul-gelo + `padding-left` p/ a sidebar no desktop) e render de `<MedixGlobalSidebar />`.
- Menu **"ATENDIMENTO"** reestilizado: card glass, itens com PNGs reais, item ativo em azul vivo. Handlers preservados.
- Card **Sinais Vitais** com classe glass `medix-card`.

Nenhuma outra parte do arquivo (handlers, estado, chamadas de API, fluxo OSCE, SOAP, feedback) foi modificada.

---

## 4. Paleta (variáveis CSS, conforme spec)
`--medix-bg:#EEF7FF` · `--medix-card:rgba(246,251,255,.78)` · `--medix-card-strong:rgba(255,255,255,.88)` · `--medix-border:rgba(139,190,245,.32)` · `--medix-primary:#2E86FF` · `--medix-primary-2:#4AA3FF` · `--medix-ink:#0B1F4D` · `--medix-muted:#5C6D8A` · `--medix-soft:#E7F3FF`.
Botões primários: `linear-gradient(135deg,#4AA3FF,#1F7BFF)`. Cards: glass `blur(24px) saturate(150%)` + borda azulada + sombra leve.

---

## 5. Sidebar global MEDIX
- Fixa à esquerda, **82px**, altura quase total (top/bottom 16px), glass azul-gelo, borda clara, sombra suave, cantos arredondados.
- Logo MEDIX no topo + 11 ícones (assets de `sidebar-icons/`) + card de progresso no rodapé.
- Recolhida fixa (não expande no hover, como pedido para não atrapalhar o atendimento).
- Aparece só no desktop (`≥1024px`); no mobile some para não cobrir o conteúdo.

## 6. Menu de atendimento
- Card glass "ATENDIMENTO" com 6 itens usando os PNGs de `attendance-icons/`:
  Paciente → `icon-paciente.png` · Exame Físico → `icon-exame-fisico.png` · Exames de Imagem → `icon-exames-imagem.png` · Exames → `icon-exames.png` · Sinais Vitais → `icon-sinais-vitais.png` · ECG → `icon-ecg.png`.
- Item ativo (`menuAtivo`) em **azul vivo MEDIX**; hover suave. Cliques mantêm `setMenuAtivo`/`abrirExameFisico`.

---

## 7. Verificação
| Item | Resultado |
|---|---|
| `npm run build` | ✅ compila |
| `npx tsc --noEmit` | ✅ sem erros |
| `/caso/2` | **HTTP 200** |
| 6 ícones de atendimento | **HTTP 200** cada |
| logo-medix.png | **HTTP 200** |

Lógica intacta: chamadas de API, estado das mensagens, microfone, fluxo do paciente, cálculo de feedback, SOAP, dados clínicos, casos e rotas **não** foram alterados.

---

## 8. Observação sobre os 3 botões a remover
Os botões "Sem alergias conhecidas", "Histórico" e "Dados do paciente" **não existem no código atual** (busca em `page.tsx`, `ChatPaciente.tsx`, `ResumoAnamnese.tsx` — nenhuma ocorrência). Provavelmente eram de um mockup anterior. Nada a remover; se surgirem em outro componente, basta apontar.

---

## 9. Pendências (próximos passos, por componente — para casar 100% com o mockup)
Itens que vivem **dentro de componentes** e exigem passes dedicados (baixo risco, feitos um a um e verificáveis):
1. **Chat** (`components/ChatPaciente.tsx`) — barra azul no tom do botão Enviar, "Lucas Ferreira · 28 anos · masculino", status Online, placeholder circular neutro; balões azul MEDIX; card informativo do rodapé.
2. **SOAP** (`components/FormularioSOAP.tsx`) — badges S/O/A/P azuis, campos glass com borda azul clara.
3. **Diagnóstico e Conduta** (`components/PainelDiagnostico.tsx`) — glass completo.
4. **Responsivo** — menu de atendimento como abas horizontais no mobile; SOAP abaixo do chat.

---

## 10. Conclusão
Primeiro passo entregue de forma **segura e coesa**: a página de atendimento já abre no visual MEDIX (fundo azul-gelo, sidebar global recolhida, menu de atendimento glass com ícones PNG e item ativo azul), preservando integralmente a funcionalidade. Os refinamentos restantes são internos aos componentes de chat/SOAP/diagnóstico e podem ser aplicados em sequência.
