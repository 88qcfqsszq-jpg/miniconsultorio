# Exame Físico Adulto Visual — Fase 1 (estrutura de abas + Cabeça subdividida)

**Data:** 26 de junho de 2026
**Status:** ✅ Concluída (validação visual no navegador pendente do usuário)
**Escopo:** Reorganização visual/funcional da navegação do Exame Físico Adulto Visual: abas principais, subabas, mapa de ações, registro genérico padronizado e vínculo de hotspots. **Não** altera HealthBench, cards de feedback, nota, critérios, banco de casos, ECG, exames de imagem, pediatria ou fluxo geral do OSCE.

---

## 1. Arquivos alterados (2)

| Arquivo | Mudança |
|---|---|
| `lib/adulto/exame-fisico-adulto-mapa.ts` | Estrutura de abas/subabas/ações; aba **Cabeça** subdividida; `HOTSPOTS_ADULTO` (aba+subaba); `resolverSelecao()` |
| `components/ExameFisicoAdultoVisual.tsx` | Estados nomeados, subabas dinâmicas, registro genérico, hotspots→aba/subaba, dedup |

> Não tocados: `lib/healthbench`, `components/FeedbackOSCE.tsx`, `data/casos-osce.ts`, `src/services/ecgGenerator`, `components/SimuladorECG.tsx`, `lib/paciente`, `app/api/corrigir`, `components/pediatria`, `lib/pediatria`, `app/caso/[id]/page.tsx`.

---

## 2. Estrutura final das abas

**Linha principal (ordem exata):**
```
Geral | Cabeça | Pescoço | Tórax | Abdome | Vascular/Membros
```

**Subabas (2ª linha, condicional):**
- **Cabeça** → `Face/Crânio | Olhos | Boca/Orofaringe | Ouvidos` (abre em Face/Crânio)
- **Tórax** → `Cardiovascular | Respiratório Anterior | Respiratório Posterior` (abre em Cardiovascular)
- **Vascular/Membros** → `Membros superiores | Membros inferiores` (abre em Membros superiores)
- Geral, Pescoço e Abdome não têm subabas.

Abas antigas removidas do topo (Olhos/Conjuntivas, Boca/Orofaringe, Tórax Anterior, Precórdio, Mãos e Dedos, Membros Inferiores, Tórax Posterior, Região Lombar, Membros Inferiores Posteriores) — **redistribuídas** como ações/subitens dentro das novas abas.

---

## 3. Estados internos

| Estado | Default | Uso |
|---|---|---|
| `activeMainTab` | `geral` | aba principal |
| `activeHeadSubtab` | `face_cranio` | subaba de Cabeça |
| `activeThoraxSubtab` | `cardiovascular` | subaba de Tórax |
| `activeVascularSubtab` | `membros_superiores` | subaba de Vascular/Membros |

A subaba efetiva é resolvida pela aba ativa; ao sair de uma aba com subabas, a 2ª linha some.

---

## 4. Mapa final de ações (54 ações)

| Aba / Subaba | Nº | Ações |
|---|---|---|
| Geral | 6 | estado geral; consciência/orientação; padrão respiratório geral; coloração da pele; hidratação; perfusão periférica global |
| Cabeça > Face/Crânio | 5 | fácies; simetria facial; crânio/couro cabeludo; palpar seios da face; dor facial |
| Cabeça > Olhos | 6 | conjuntivas; escleras; pupilas; reflexo fotomotor; movimentos oculares; edema palpebral |
| Cabeça > Boca/Orofaringe | 9 | lábios; mucosa oral; língua; gengivas; palato; orofaringe; amígdalas; sangramento oral; hidratação de mucosa oral |
| Cabeça > Ouvidos | 6 | pavilhão auricular; conduto auditivo externo; dor à tração do pavilhão; dor à pressão do tragus; otorreia; acuidade auditiva grosseira |
| Pescoço | 5 | turgência jugular; linfonodos cervicais; pulsos carotídeos; auscultar carótidas; tireoide |
| Tórax > Cardiovascular | 6 | precórdio; ictus cordis; frêmitos cardíacos; focos cardíacos; sopros; atrito pericárdico |
| Tórax > Respiratório Anterior | 4 | padrão respiratório; esforço respiratório; expansibilidade anterior; auscultar tórax anterior |
| Tórax > Respiratório Posterior | 5 | tórax posterior; expansibilidade posterior; frêmito toracovocal; percutir; auscultar tórax posterior |
| Abdome | 11 | inspeção; RHA; sopros; percussão; palpação superficial/profunda; Blumberg; Murphy; hepatomegalia; esplenomegalia; ascite |
| Vascular/Membros > Membros superiores | 5 | mãos e unhas; TEC; pulsos radiais; temperatura MS; sinais articulares |
| Vascular/Membros > Membros inferiores | 7 | inspeção MI; edema; panturrilhas; pulsos periféricos; temperatura/perfusão dos pés; insuf. venosa; doença arterial periférica |

A coluna **Ações** muda dinamicamente conforme aba/subaba.

---

## 5. Registro padronizado (Fase 1)

Ao clicar numa ação, registra-se uma frase **genérica**:
```
[Exame Visual] <caminho> — <Ação>: manobra realizada.
```
Exemplos verificados:
```
[Exame Visual] Geral — Inspecionar estado geral: manobra realizada.
[Exame Visual] Cabeça > Face/Crânio — Inspecionar fácies: manobra realizada.
[Exame Visual] Cabeça > Olhos — Inspecionar conjuntivas: manobra realizada.
[Exame Visual] Cabeça > Boca/Orofaringe — Inspecionar orofaringe: manobra realizada.
[Exame Visual] Cabeça > Ouvidos — Pesquisar otorreia: manobra realizada.
[Exame Visual] Tórax > Cardiovascular — Palpar ictus cordis: manobra realizada.
[Exame Visual] Tórax > Respiratório Posterior — Auscultar tórax posterior: manobra realizada.
[Exame Visual] Abdome — Pesquisar hepatomegalia: manobra realizada.
[Exame Visual] Vascular/Membros > Membros inferiores — Palpar edema: manobra realizada.
```
> Na **Fase 2**, "manobra realizada" será substituído por achados reais dependentes do caso ativo. Os `achadosPossiveis` já estão no mapa, prontos para isso.

**Dedup:** registros idênticos não são duplicados; a ação já registrada exibe ✓.

---

## 6. Coluna Registrados

Cada item exibe 3 linhas: **ação** / **região-subaba** / **texto completo do registro**. Texto com quebra (`break-words`), sem corte.

---

## 7. Hotspots (imagem frontal)

Selecionam aba **e** subaba ao clicar:

| Hotspot | → aba/subaba |
|---|---|
| Cabeça / Face | `cabeca > face_cranio` |
| Olhos | `cabeca > olhos` |
| Pescoço | `pescoco` |
| Precórdio | `torax > cardiovascular` |
| Tórax anterior | `torax > respiratorio_anterior` |
| Tórax posterior | `torax > respiratorio_posterior` |
| Abdome | `abdome` |
| Membros superiores | `vascular_membros > membros_superiores` |
| Membros inferiores | `vascular_membros > membros_inferiores` |

Pontos discretos (13px), com destaque para o ativo. Coordenadas `%` aproximadas para a foto frontal — **ajustáveis** se desalinharem (sem mexer em mais nada).

---

## 8. Imagem e integrações preservadas

- Imagem do paciente **inalterada**: feminina realista (`/images/boneco/feminino-frontal-realista.png`) / masculino (`/images/boneco/boneco-frente.png`). Pediátricas intactas.
- Registro segue a cadeia existente: `onAchadoEncontrado → handleAchadoExameAdulto (page) → handleNovaManobra → manobrasSolicitadas → physicalExamEvents`. Sem fluxo paralelo.

---

## 9. Preparação para a Fase 2 (sem implementar)

`MAPA_EXAME_ADULTO` traz, por ação: `id`, `label`, e `achadosPossiveis: string[]` (listas clínicas já presentes onde aplicável; vazias nas novas ações). `resolverSelecao(mainTab, subTab)` devolve ações + categoria + caminho. Nenhum campo de diagnóstico/peso/pontuação/função clínica foi adicionado — reservados para a Fase 2.

---

## 10. Verificações

| Item | Status |
|---|---|
| Build (`npm run build`) | ✅ compila (só erro pré-existente de ECG) |
| Tipos dos arquivos da Fase 1 | ✅ sem erros |
| 6 abas na ordem correta | ✅ |
| Cabeça com 4 subabas (abre em Face/Crânio) | ✅ |
| Tórax (3) e Vascular/Membros (2) mantidos | ✅ |
| Hotspots → aba/subaba | ✅ (9 hotspots) |
| Registro genérico no formato | ✅ |
| Dedup de registros | ✅ |
| Caso adulto carrega | ✅ HTTP 200 |
| HealthBench, feedback, nota, casos, ECG, imagem, pediatria, page.tsx | ✅ intactos |

---

## 11. Pendente (não executável pelo agente)

Validação **visual/interativa** no navegador (23 testes do comando): aberta de abas/subabas, troca de ações, cliques de hotspots e ausência de erros no console. A lógica subjacente está validada por testes de unidade. Se algum hotspot estiver fora de posição na nova imagem, reportar qual ponto para ajuste apenas das coordenadas `%`.
