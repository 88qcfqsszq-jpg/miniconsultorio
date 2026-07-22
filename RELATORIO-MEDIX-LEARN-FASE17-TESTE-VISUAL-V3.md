# Relatório Fase 17 — Teste Visual Completo MEDIX Learn V3

Data: 2026-07-13
Commit auditado: 26ef00b (Fase 16 — conteúdo V3 curado integrado)

---

## Objetivo

Validar visualmente o MEDIX Learn após integração dos 49 arquivos `.md` curados. Nenhuma alteração de código, conteúdo, layout ou parser foi realizada nesta fase.

---

## Infraestrutura

### Build

```
TypeScript: zero erros (npx tsc --noEmit)
Build: 92/92 páginas estáticas geradas com sucesso
Erros de build: nenhum
```

### Rotas HTTP

Todos os 57 endpoints `/learn` retornaram HTTP 200:
- `/learn` (índice) ✅
- 7 páginas de sistema (`/learn/{sistema}`) ✅
- 49 páginas de trilha (`/learn/{sistema}/{trilha}`) ✅

### Conteúdo genérico

Varredura nos 49 arquivos `.md` e nas páginas renderizadas:
```
"apresentação típica"    → 0 ocorrências
"Mecanismo dominante de" → 0 ocorrências
"queixa principal" (como placeholder)  → 0 ocorrências
```
**Conclusão: nenhum arquivo com conteúdo de template genérico.** Todas as 49 trilhas têm conteúdo clínico específico.

---

## Auditoria de Conteúdo (por sistema)

### Respiratório — 7 trilhas ✅
- PONTO-CHAVE e NÃO ERRE: presentes como texto inline (ex: dispneia, linha 34-38)
- Mini-casos: cenários clínicos específicos (asma, IC, TEP, acidose)
- Mapa final: árvores ASCII completas
- Questões: 4 por trilha, específicas

### Cardiologia — 7 trilhas ✅
- Mesmo padrão; marcadores inline funcionando
- CUIDADO e RACIOCÍNIO presentes em vários arquivos

### Neurologia — 7 trilhas ✅ (com Finding 2 — ver abaixo)
- Conteúdo clínico específico e detalhado
- Mini-casos com cenários corretos
- `dadosChave` populados via `### Achados-chave` correto
- Finding 2 afeta apenas o PONTO-CHAVE da área de objetivo (não os mini-casos)

### Gastro/Abdome — 7 trilhas ✅
- Conteúdo V3 curado (Jul 13) corretamente integrado
- Conflito de naming (3 pares duplicados) resolvido em Fase 16
- Mapa de `dor-abdominal` com 4 nós completos

### Infectologia — 7 trilhas (Finding 1 afeta 6/7 — ver abaixo)
- `dengue-e-arboviroses`: formato correto, renderiza normalmente ✅
- 6 trilhas restantes: `dadosChave` vazio nos mini-casos (ver Finding 1)
- Conteúdo das seções (microaula, fisiologia, semiologia, raciocínio) correto em todas

### Semiologia Geral — 7 trilhas ✅
- Anamnese, comunicação, sinais vitais etc: conteúdo específico
- PONTO-CHAVE inline nas seções correto
- Mini-casos com `### Achados-chave` correto em todas

### Raciocínio Clínico — 7 trilhas ✅
- SOAP, hipóteses, diagnóstico diferencial, erros cognitivos etc
- Conteúdo específico para cada trilha
- Questões ativas com respostas não genéricas

---

## Findings

---

### Finding 1 — ALTO: 6 trilhas de infectologia com `### Dados-chave` não reconhecido

**Afeta:** 6 das 7 trilhas de infectologia

```
content/learn/infectologia/antimicrobianos-basicos.md
content/learn/infectologia/febre-e-sindrome-infecciosa.md
content/learn/infectologia/infeccao-urinaria-e-pielonefrite.md
content/learn/infectologia/meningite-e-sinais-meningeos.md
content/learn/infectologia/sepse-e-choque-septico.md
content/learn/infectologia/tuberculose-e-tosse-cronica.md
```

**Não afetada:** `dengue-e-arboviroses.md` (usa `### Achados-chave` correto)

**Causa:**
O parser (`lib/medix-learn/md-parser.ts`, linha 159) espera exatamente `### Achados-chave`:
```typescript
if (l.match(/^### Achados-chave/i)) { flushSub(currentMC); subsection = "achados"; continue; }
```

Os 6 arquivos de infectologia usam `### Dados-chave` nos mini-casos em vez de `### Achados-chave`. O parser não reconhece esse header e os itens são descartados.

Adicionalmente, os mesmos 6 arquivos omitem `### Mecanismo principal` nos mini-casos, fazendo `mecanismo` ficar vazio também.

**Impacto visual:**
- Mini-casos renderizam sem `dadosChave` (seção "→ achados" vazia no card)
- `mecanismo` vazio (sem subtítulo de mecanismo nos cards)
- Cenário, pergunta central, resposta esperada, erro comum e ponte para OSCE: presentes e corretos

**Correção recomendada (Fase 18):**
Duas opções:
1. Corrigir nos arquivos `.md`: renomear `### Dados-chave` → `### Achados-chave` nos 6 arquivos afetados
2. Corrigir no parser: adicionar linha no match de subsection para aceitar `Dados-chave` como alias de `achados`

Opção 1 é mais segura (sem risco de regressão no parser).

---

### Finding 2 — MÉDIO: 7 trilhas de neurologia com PONTO-CHAVE na área de cabeçalho (perdido pelo parser)

**Afeta:** todas as 7 trilhas de neurologia

```
content/learn/neurologia/avc-e-deficit-focal.md
content/learn/neurologia/cefaleia-e-sinais-de-alarme.md
content/learn/neurologia/crise-convulsiva.md
content/learn/neurologia/dor-lombar-e-sinais-neurologicos.md
content/learn/neurologia/exame-neurologico-essencial.md
content/learn/neurologia/rebaixamento-de-consciencia.md
content/learn/neurologia/vertigem-e-tontura.md
```

**Causa:**
Esses arquivos colocam o PONTO-CHAVE na **área de objetivo**, em linha 9, antes de `# 1. Microaula`:
```markdown
> **PONTO-CHAVE:** no AVC, tempo é cérebro. ...
```

O parser (`parseSections`) só processa conteúdo a partir de `# 1.` e ignora silenciosamente o cabeçalho. O blockquote `> **PONTO-CHAVE:**` nessa posição não é capturado.

Outros 42 arquivos colocam `**PONTO-CHAVE:**  ` inline dentro das seções (ex: linha 37 de `dispneia.md`), onde o parser os processa corretamente.

**Impacto visual:**
- Usuário não vê o PONTO-CHAVE de objetivo nas 7 trilhas de neurologia
- O restante do conteúdo (seções, mini-casos, mapa, questões) renderiza corretamente

**Correção recomendada (Fase 18):**
Nos 7 arquivos de neurologia, mover o PONTO-CHAVE do cabeçalho para dentro de `# 1. Microaula`, com formatação inline:
```markdown
**PONTO-CHAVE:**  
[texto do ponto-chave aqui]
```

---

### Finding 3 — BAIXO: Blockquotes `>` dentro de seções renderizam como `&gt; texto`

**Afeta:** arquivos com marcadores `> CUIDADO:` ou `> RACIOCÍNIO:` dentro das seções

**Exemplo:** `content/learn/respiratorio/dispneia.md`, seção 3 (`semiologia`):
```markdown
**CUIDADO:**  
Silêncio auscultatório em paciente asmático grave...
```

Quando um marcador usa a sintaxe blockquote `> CUIDADO:`, o HTML gerado exibe literalmente `&gt; CUIDADO:` (o caractere `>` visível, sem estilo de callout).

**Impacto visual:**
- Texto com `>` no início aparece em linha como caractere literal
- Não há estilo de callout ou caixa destacada
- Legível mas visualmente inferior ao que os autores intencionaram

**Correção recomendada:**
Substituir `> CUIDADO:` por `**CUIDADO:**  ` (mesmo padrão dos demais marcadores) nos arquivos afetados, ou adicionar suporte a blockquote no parser/componentes.

---

## Resumo de Findings

| # | Severidade | Descrição | Arquivos |
|---|-----------|-----------|---------|
| 1 | **Alto** | 6 infectologia: `### Dados-chave` não reconhecido → `dadosChave` vazio | 6 |
| 2 | **Médio** | 7 neurologia: PONTO-CHAVE no cabeçalho → perdido pelo parser | 7 |
| 3 | **Baixo** | Blockquotes `>` em seções → `&gt; texto` sem estilo | variável |

---

## O que funciona corretamente

- 92/92 páginas com build estático bem-sucedido ✅
- 57/57 rotas HTTP 200 ✅
- 0/49 trilhas com conteúdo genérico ✅
- TypeScript: zero erros ✅
- PONTO-CHAVE e NÃO ERRE inline (dentro de seções): renderizam como texto bold em todas as 42 trilhas corretas ✅
- Mini-casos específicos com cenários clínicos reais ✅
- Mapas ASCII completos em todas as trilhas ✅
- Questões ativas com respostas não genéricas ✅
- Sistema de 7 sistemas e 49 trilhas completo ✅
- Sidebar com link para `/learn` funcional ✅
- `dengue-e-arboviroses` (infectologia): formato correto, mini-casos completos ✅

---

## Próximos passos recomendados (Fase 18)

1. **Corrigir Finding 1**: renomear `### Dados-chave` → `### Achados-chave` nos 6 arquivos de infectologia. Adicionar `### Mecanismo principal` se ausente.
2. **Corrigir Finding 2**: mover PONTO-CHAVE dos 7 arquivos de neurologia para dentro de `# 1. Microaula` com formatação inline.
3. **Corrigir Finding 3** (opcional): padronizar marcadores `> CUIDADO:` e `> RACIOCÍNIO:` para `**CUIDADO:**  ` e `**RACIOCÍNIO:**  `.

---

## Estado do repositório ao final da Fase 17

```
git status --short:
M  app/treinamento/page.tsx          ← excluído permanentemente
 M components/CasoCard.tsx           ← excluído permanentemente
 M components/PainelGerarCaso.tsx    ← excluído permanentemente
...

git diff --cached --name-only: (vazio — nenhum arquivo staged)
```

Nenhum commit criado nesta fase.
