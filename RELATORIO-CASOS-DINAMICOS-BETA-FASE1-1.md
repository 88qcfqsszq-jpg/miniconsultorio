# Relatório — Casos OSCE Dinâmicos (Beta) · Fase 1.1

Auditoria visual, isolamento de alterações e hardening funcional. **Sem expandir casos.**

## 1. Auditoria do working tree (`git status --short`)

### Pertencem à Fase 1/1.1 Beta
- `?? lib/dynamic-osce/` (motor, rubrica, validadores, cases, README, script)
- `?? components/dynamic-osce/` (7 componentes)
- `?? app/casos-dinamicos/` (rota)
- `?? RELATORIO-CASOS-DINAMICOS-BETA-FASE1.md`
- `?? RELATORIO-CASOS-DINAMICOS-BETA-FASE1-1.md` (este)
- `M  components/layout/AppSidebar.tsx` (item de nav + estado ativo — 2 linhas)

### Modificados de tarefas ANTERIORES (NÃO tocar; fora de commit isolado do Beta)
- `M  app/treinamento/page.tsx`
- `M  components/CasoCard.tsx`
- `M  components/PainelGerarCaso.tsx`
- `?? app/treinamento/treinamento.css`

### Zip/binários NÃO relacionados (NÃO tocar — apenas reportados)
- `D  public/assets/consultorio/attendance-icons/casos-v2-inline-perfeitos.zip`
- `?? data/casos-v2/rubricas-osce-adulto-pediatrico-ts.zip`
- `?? public/assets/consultorio/attendance-icons/casos-v2-adulto.zip`

> Estas alterações de `.zip` **não foram feitas por mim** e não envolvem código-fonte de
> `data/casos-v2` (são binários). Mantidos intocados conforme a regra de não deletar binários.

## 2. AppSidebar

- Item "Casos Dinâmicos Beta" inserido no **mesmo padrão** dos demais (`key/label/icon/href`),
  renderizado pelo mesmo `NAV_ITEMS.map` — sem alterar layout, espaçamento ou comportamento.
- Estado ativo restrito: `if (href === "/casos-dinamicos") return pathname.startsWith("/casos-dinamicos")`.
- Nenhum item anterior foi alterado.
- **Ajuste nesta fase:** troquei o ícone do item novo de `icon-conteudos.png` (duplicava o do
  Guia) para `icon-simulacao.png` (asset existente, distinto de todos os itens atuais).
- **Removível trivialmente:** apagar 1 linha em `NAV_ITEMS` + 1 linha em `isNavActive`.

## 3. Auditoria visual (`components/dynamic-osce`)

Revisados os 8 arquivos + a rota. Estado: página abre, título/subtítulo/aviso Beta claros,
visual coerente com o app (azul-gelo + acentos roxos), espaçamentos confortáveis, card legível,
painel de estado claro (vitais com alerta em SpO₂<92/FR>28), intervenções por categoria,
timeline compreensível e feedback legível.

**Ajuste feito (dentro de `components/dynamic-osce`, sem CSS global):**
- Runner: grid de 2 colunas (`1fr / 320px`) **quebrava em mobile** (a timeline colapsava a coluna
  principal). Tornei responsivo via `matchMedia("(max-width: 860px)")` → empilha em 1 coluna em
  telas estreitas; cabeçalho ganhou `flexWrap`. Sem CSS global, sem tocar dashboard/sidebar.

## 4. Auditoria clínica do piloto

Coerência confirmada (crise **grave**, não suavizada):
- SpO₂ 88% ar ambiente, FR 34, FC 118, fala entrecortada, sibilos difusos + MV reduzido, broncoespasmo 80/100.
- O₂ eleva SpO₂; salbutamol reduz broncoespasmo (FR↓, FC↑ discreto); ipratrópio soma na crise grave;
  corticoide conta como conduta correta **sem** melhora imediata artificial; reavaliação valorizada;
  alta com hipoxemia/esforço = **erro crítico**; internação/escalonamento valorizados.

**Ajuste feito (coerência de texto, sem alterar gravidade):** em `recomputarClinica`, o estado
inicial (SpO₂ 88) exibia "dispneico, **em melhora parcial**" — sugeria melhora em t=0. Corrigido o
limiar/texto para faixas neutras: `<90` "grave", `<94` "hipoxemia leve a moderada", senão
"respondendo ao tratamento". A gravidade inicial permanece intacta.

## 5. Validadores

Cobrem: estado inicial (PatientState + faixas vitais), arrays obrigatórios não-vazios, provider
consistente, rubrica (soma=20, domínios, ids únicos), motor (direção das respostas).
**Adicionado nesta fase** em `validar-dynamic-case`:
- toda intervenção do caso é reconhecida pelo motor (`CATALOGO_INTERVENCOES`);
- `rubricaId` resolve para rubrica registrada (`linkRubrica`).

## 6. Script permanente

`lib/dynamic-osce/scripts/validar-dynamic-osce.ts` — valida todos os casos/rubricas/compatibilidade,
simula a sequência correta do piloto e o erro crítico de alta precoce, imprime relatório e retorna
**exit 1** se houver erro. Instrução adicionada ao README.

## 7. Resultados

**`npm run build`:** ✅ compilado, TypeScript 0 erros, rota `○ /casos-dinamicos` gerada.

**`npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts`:** ✅ exit 0 — todas as checagens:
```
✅ Estrutura do caso válida
✅ rubricaId resolve para rubrica registrada
✅ Rubrica coerente (soma=20, domínios, ids únicos)
✅ Motor reconhece intervenções e responde na direção esperada
✅ SpO₂ melhora com a conduta (88% → 95%)
✅ Broncoespasmo reduz (80 → 40)
✅ Nenhum erro crítico na sequência correta
✅ Conduta completa + registro pontua 20/20
✅ Soma dos domínios = nota (20 = 20)
✅ Alta com paciente grave gera erro crítico
✅ Feedback registra o erro crítico
✅ Critério 'não deu alta com hipoxemia' NÃO cumprido
RESULTADO: ✅ TODAS as checagens passaram (1 caso).
```

## 8. Confirmação de isolamento

Fora da sidebar (2 linhas), **nenhum** arquivo do app principal foi tocado. Não foram modificados:
`data/casos-v2`, `lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`, `app/treinamento`, ECG,
laboratório, exames, feedback principal, dashboard, CSS global. Nenhum zip/binário alterado.
Nenhum caso novo criado. Sem Pulse. Sem commit.

## Riscos remanescentes

- Anamnese/exame/comunicação são auto-registro (checkboxes) — não capturam interação real ainda.
- Responsividade via JS (`matchMedia`) tem leve flicker na 1ª montagem (aceitável em beta).
- Ícone da sidebar reutiliza asset existente (sem asset dedicado ao Beta).
- Estado evolui por ação (clique), não por tempo contínuo.

## Próximos passos recomendados

- Adapter `pulse` com a mesma assinatura `applyIntervention`.
- Capturar anamnese/exame por interação real (chat/exame) em vez de checkboxes.
- Novos casos dinâmicos (DPOC, anafilaxia, choque) reusando o motor + script de validação.
- Evolução por tempo contínuo (tick).

## Anexos — listas de arquivos

### Pertencem ao Beta (candidatos a commit isolado)
```
lib/dynamic-osce/**            (novos: types, contract, engines, rubric-link, validators, cases, scripts, README)
components/dynamic-osce/**      (novos: 7 componentes)
app/casos-dinamicos/page.tsx    (novo)
RELATORIO-CASOS-DINAMICOS-BETA-FASE1.md      (novo)
RELATORIO-CASOS-DINAMICOS-BETA-FASE1-1.md    (novo)
components/layout/AppSidebar.tsx (modificado: +2 linhas)
```

### NÃO pertencem ao Beta (manter FORA de commit isolado)
```
app/treinamento/page.tsx        (M — tarefa anterior)
components/CasoCard.tsx          (M — tarefa anterior)
components/PainelGerarCaso.tsx   (M — tarefa anterior)
app/treinamento/treinamento.css  (?? — tarefa anterior)
public/assets/consultorio/attendance-icons/casos-v2-inline-perfeitos.zip  (D — não relacionado)
data/casos-v2/rubricas-osce-adulto-pediatrico-ts.zip                       (?? — não relacionado)
public/assets/consultorio/attendance-icons/casos-v2-adulto.zip             (?? — não relacionado)
```
