# Relatório — Exames Laboratoriais (LaboratoryEngine)

_Feature aditiva e escalável. O botão único "Hemograma" foi promovido para "Exames Laboratoriais" (o Hemograma continua dentro do painel). Nenhum fluxo existente alterado (Paciente, Exame Físico, Exames de Imagem, ECG, chat, SOAP, diagnóstico, conduta, feedback intactos). Laboratório fictício; padrões didáticos/genéricos._

## Objetivo atendido
Uma **única** seção "Exames Laboratoriais" na barra de atendimento (sem 9 botões), com cards internos para: Hemograma, Função renal, Eletrólitos, Marcadores inflamatórios, Gasometria, Marcadores cardíacos, Função hepática, Coagulograma e Urina tipo 1. Cada card renderiza um laudo coerente com o caso.

## Arquivos criados
**Núcleo (`src/lab/`):**
- `labTypes.ts` — tipos padronizados (`LabPanelResult`, `LabAnalyte`, `ClinicalTag`, `LabContext`…).
- `labUtils.ts` — PRNG determinístico, geração de valor por direção (aditiva p/ homeostáticos, multiplicativa p/ marcadores), formatação e montagem de analitos.
- `labReferenceRanges.ts` — faixas de referência por analito (com `kind` h/m e clamps).
- `labProfiles.ts` — `resolveClinicalTag(caso)` → **tag clínica única** que dirige todos os painéis (garante coerência) + `gravidadeDaTag` + `dadosPaciente`.
- `LaboratoryEngine.ts` — `generateLabs({ caso, requestedTests })` + registro `LAB_TESTS` (escalável).
- `LabReport.tsx` — laudo **genérico** (componente único usado por todos os painéis não-hemograma).

**Módulos (`src/lab/modules/<nome>/generate.ts`)** — cada um com seus perfis (colocados no próprio `generate.ts`) + gerador: `hemograma` (encapsula o existente), `renal`, `electrolytes`, `inflammation`, `gasometry`, `cardiac`, `hepatic`, `coagulation`, `urinalysis`.

**UI:** `src/components/LaboratoryPanel.tsx` — painel com cards + laudo selecionado.

**Docs:** `docs/RELATORIO-LABORATORY-ENGINE.md`.

## Arquivos modificados
- `app/caso/[id]/page.tsx` — **apenas**: troca do import `HemogramaReport` por `LaboratoryPanel`; renomeada a aba `hemograma`→`laboratorio` ("Exames Laboratoriais") nas **duas** listas (desktop + mobile), na mesma posição (após "Exames"); os dois blocos de conteúdo renderizam `<LaboratoryPanel caso={caso} />`.

## O que foi migrado do Hemograma
Os 3 arquivos da fase anterior foram **mantidos e reutilizados** (não removidos):
- `src/data/hemogramaProfiles.ts`, `src/utils/generateHemograma.ts`, `src/components/HemogramaReport.tsx`.
O módulo `src/lab/modules/hemograma/generate.ts` **encapsula** `generateHemograma` no formato padronizado do engine; o painel renderiza o Hemograma pelo laudo dedicado `HemogramaReport` (visual preservado). O botão "Hemograma" isolado deixou de existir na sidebar; o Hemograma agora é o **primeiro card** dentro de "Exames Laboratoriais".

## Exames implementados nesta fase
Hemograma, Função renal (Ureia, Creatinina, TFG estimada), Eletrólitos (Na, K, Cl, Mg, Ca), Marcadores inflamatórios (PCR, VHS, Procalcitonina), Gasometria (pH, PaCO₂, PaO₂, HCO₃, SatO₂, Lactato, BE), Marcadores cardíacos (Troponina, CK-MB, NT-proBNP), Função hepática (AST, ALT, FA, GGT, BT, BD, Albumina), Coagulograma (TP, INR, TTPa, Fibrinogênio, D-dímero), Urina tipo 1 (densidade, pH, proteína, glicose, cetônicos, sangue, nitrito, esterase, leucócitos, hemácias, bactérias, cilindros).

**Preparado para (não implementado agora):** Líquor, líquido pleural/ascítico, microbiologia, sorologias, hormônios, toxicologia — bastará registrar novos módulos em `LAB_TESTS`.

## Perfis clínicos mapeados (tags)
`pneumonia`, `sepse`, `virose`, `dengue`, `dengue_alarme`, `febre_amarela`, `tuberculose`, `iam_sca`, `ic`, `tep`, `pericardite`, `dpoc`, `asma`, `anemia`, `irc`, `dka`, `itu`, `pielonefrite`, `hepatite`, `colestase`, `civd`, `pti`, `policitemia`, `les_hiv`, `desidratacao`, `normal`. Cada painel só desvia do normal para as tags que clinicamente o afetam.

## Coerência clínica (verificada por script)
- **Pneumonia**: hemograma inflamatório + PCR/VHS/PCT↑ + gasometria hipoxêmica; cardíaco/coag/urina normais.
- **Dengue**: leucopenia + plaquetopenia + AST/ALT↑ + PCR discreta (procalcitonina normal); demais normais.
- **Sepse**: altera hemograma, renal, eletrólitos, PCR/PCT, gasometria (acidose + lactato↑), hepática e coagulograma.
- **IAM/SCA**: troponina/CK-MB↑; hemograma com leucocitose leve; demais normais.
- **IC**: NT-proBNP↑, troponina leve↑, Na/K↓, hipoxemia leve.
- **TEP**: D-dímero↑, gasometria (PaO₂↓, PaCO₂↓, pH↑); hemograma inespecífico.
- **DPOC**: poliglobulia (Hb/Ht↑) + gasometria com retenção de CO₂ (PaCO₂↑, pH↓, HCO₃↑).
- **Tuberculose**: anemia leve + VHS/PCR↑.
- **Anemia ferropriva**: microcítica (VCM↓, RDW↑).
- **Cetoacidose**: acidose metabólica (pH/HCO₃↓, BE↓) + eletrólitos (Na↓/K↑) + urina (glicose/cetônicos↑) + azotemia pré-renal.
- **HAS (inespecífico)**: todos os painéis normais.

Determinístico por caseId (não muda ao trocar de aba). `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).

## Casos não mapeados (tag `normal` → laudos normais, com coerência)
Casos sem padrão laboratorial característico geram laudos normais: HAS, valvopatias, arritmias, pericardite (parcial), cardiomegalia, pneumotórax, atelectasia, insuficiência venosa, DAOP, febre reumática, e casos pediátricos de puericultura/desenvolvimento/PA elevada/maus-tratos/cardiopatias congênitas. É o comportamento seguro esperado.

## Como testar (manual)
1. Abrir um caso (`/caso/2` pneumonia, `/caso/38` dengue, `/caso/59` sepse, `/caso/1` SCA, `/caso/8` IC, `/caso/10` TEP, `/caso/9` DPOC, `/caso/11` TB, `/caso/43` anemia, `/caso/5` HAS, `/caso/60` cetoacidose).
2. Clicar em **Exames Laboratoriais** (após "Exames").
3. Alternar entre os cards (Hemograma, Renal, Eletrólitos, Inflamatórios, Gasometria, Cardíacos, Hepática, Coagulograma, Urina) — o card com alteração tem um ponto âmbar.
4. Conferir a coerência (ex.: SCA → troponina↑ mas hemograma quase normal; pneumonia → PCR alta e hemograma inflamatório).
5. Trocar entre abas (Paciente/Exames/Sinais Vitais/ECG) e voltar — dados preservados; laudos não mudam.
6. Desktop e mobile.

## Riscos / revisão médica manual
- Perfis **didáticos e genéricos** — magnitudes calibradas para ensino, não para exatidão individual. **Revisão médica recomendada** antes de uso avaliativo.
- Estrutura de módulos: cada módulo tem `generate.ts` com **perfis colocados no próprio arquivo** (não um `profiles.ts` separado) e usa o **laudo genérico compartilhado** `LabReport.tsx` (em vez de um `report.tsx` por módulo) — decisão para evitar duplicação; funcionalmente equivalente e escalável.
- CHCM do hemograma é **derivado** (Hb/Ht) no gerador existente, então a direção "hipocrômica" do perfil ferropriva nem sempre se reflete no CHCM (artefato menor herdado; não altera o diagnóstico visual — VCM/RDW já sinalizam).
- eTFG usa MDRD simplificado e só sinaliza ↓ quando < 60 (evita falso-positivo em idosos normais).
- Ícone do menu desktop reutiliza `icon-exames.png` (não há asset dedicado de laboratório).

## Próximos módulos recomendados
Líquor (LCR), líquido pleural/ascítico (com critérios de Light/GASA), gasometria venosa, perfil lipídico/glicêmico, função tireoidiana, marcadores tumorais — todos plugáveis via `LAB_TESTS` sem refatorar o núcleo.
