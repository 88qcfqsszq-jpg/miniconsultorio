# Reimplementação Limpa do Módulo Open-i Raw

**Data:** 24 de junho de 2026
**Status:** ✅ Módulo concluído e testado · ⚠️ Build bloqueado por erro pré-existente de ECG (fora de escopo)

---

## Objetivo

Substituir o módulo antigo de Exames de Imagem (instável por acúmulo de scoring,
fallback, curadoria e imagens artificiais) por um **módulo novo, limpo, paralelo e
honesto**, com fluxo Open-i bruto:

> Consultar o Open-i pelo termo e exibir a **primeira imagem retornada**, com aviso
> claro de que não houve curadoria radiológica.

---

## Arquitetura nova

```
caso clínico
  ↓
diagnóstico oculto do caso  (dados_ocultos_do_sistema.diagnostico_principal)
  ↓
tradução simples PT-BR → termo inglês
  ↓
GET /api/openi/raw?diagnosis=...
  ↓
consulta Open-i (https://openi.nlm.nih.gov/api/search?query=...&coll=cxr&m=1&n=5)
  ↓
pega o PRIMEIRO item de data.list → imgLarge
  ↓
normaliza para URL absoluta
  ↓
frontend recebe imageUrl
  ↓
<OpenIRawImagePanel> exibe imagem + aviso, ou "indisponível"
```

---

## Arquivos criados

| Arquivo | Função |
|---|---|
| `app/api/openi/raw/route.ts` | Endpoint novo e independente. Tradução PT-BR→EN, consulta Open-i, retorna 1ª imageUrl. |
| `components/OpenIRawImagePanel.tsx` | Componente novo, depende só de `imageUrl/loading/error/query/source`. |

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `app/caso/[id]/page.tsx` | Estados novos (`openIImageUrl/openIQuery/openILoading/openIError`), `useEffect` limpo que busca em `/api/openi/raw` e limpa a imagem ao trocar de caso. Aba "Exames de Imagem" (mobile + desktop) agora renderiza `OpenIRawImagePanel`. Import antigo de `PainelAnaliseImagem` removido. |
| `data/casos-osce.ts` | Correção de campos inválidos do caso 61 (`palpacao_ictus`→`ictus`, `edema_maleolar`→`edema`, `hepatomegalia`→`visceromegalias`) que impediam o type-check. |

## Arquivos antigos preservados (sem uso)

Mantidos no projeto, **não importados** pela aba Exames de Imagem:

- `components/PainelAnaliseImagem.tsx`
- `app/api/exams/references/route.ts`
- `lib/radiology/providers/openiCloudProvider.ts`
- `lib/radiology/openiCuratedReferences.ts`
- demais providers/curadoria antigos

---

## Regras respeitadas

Sem scoring · sem fallback de imagem · sem curadoria · sem `openiCuratedReferences` ·
sem `expected_keywords` · sem `critical_blockers` · sem `scoreRelevancia` ·
sem `caso.imagemRadiologica` · sem imagens artificiais · sem reaproveitar imagem
anterior · sem imagem padrão · sem download · sem HEAD · sem análise de pixels.

**Nota sobre robustez:** a API do Open-i é intermitente (às vezes responde lento e
estoura o timeout, devolvendo lista vazia). O endpoint reexecuta a **mesma query**
até 3 vezes. Isto **não é fallback de imagem** — é apenas repetir a busca idêntica.

---

## Tradução PT-BR → termo Open-i

Termos plurais foram necessários porque os singulares retornam vazio na API atual:

| Diagnóstico | Termo Open-i |
|---|---|
| pneumonia / PAC / pneumonia atípica | `pneumonia` |
| tuberculose | `tuberculosis` |
| asma / crise asmática | `asthma` |
| dpoc / enfisema | `emphysema` |
| derrame pleural | `pleural effusion` |
| atelectasia / atelectasia pós-operatória | `atelectases` (plural) |
| pneumotórax / pneumotórax espontâneo | `pneumothoraces` (plural) |
| cardiomegalia | `cardiomegaly` |
| insuficiência cardíaca / ICC / edema pulmonar | `pulmonary edema` |
| bronquiolite | `bronchiolitis` |

---

## Tabela de testes — backend (`/api/openi/raw`)

Duas rodadas consecutivas, 6/6 estável após a lógica de retry:

| Diagnóstico | query usada | success | imageId | imageUrl |
|---|---|---|---|---|
| pneumonia | pneumonia | ✅ true | CXR2961 | https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png |
| atelectasia | atelectases | ✅ true | CXR2036 | https://openi.nlm.nih.gov/imgs/512/31/2036/CXR2036_IM-0680-1001.png |
| asma | asthma | ✅ true | CXR1912 | https://openi.nlm.nih.gov/imgs/512/308/1912/... |
| dpoc | emphysema | ✅ true | CXR551 | https://openi.nlm.nih.gov/imgs/512/.../CXR551... |
| derrame pleural | pleural effusion | ✅ true | CXR2046 | https://openi.nlm.nih.gov/imgs/512/41/2046/CXR2046_IM-0688-1001.png |
| pneumotórax | pneumothoraces | ✅ true | CXR3945 | https://openi.nlm.nih.gov/imgs/512/336/3945/CXR3945_IM-2014-1001.png |

Comandos:
```bash
curl -s "http://localhost:3000/api/openi/raw?diagnosis=pneumonia&debug=true" | python3 -m json.tool
curl -s "http://localhost:3000/api/openi/raw?diagnosis=atelectasia&debug=true" | python3 -m json.tool
# ... asma, dpoc, derrame%20pleural, pneumotorax
```

---

## Tabela de testes — frontend

**Pendente de validação visual no navegador** (casos corretos confirmados na auditoria
de mapeamento). IDs corretos para teste:

| Caso | Diagnóstico | URL | imageUrl API | src DOM | imagem exibida? | status |
|---|---|---|---|---|---|---|
| 2 | Pneumonia | /caso/2 | CXR2961 | _a verificar_ | _a verificar_ | ⏳ |
| 3 | Asma | /caso/3 | CXR1912 | _a verificar_ | _a verificar_ | ⏳ |
| 9 | DPOC | /caso/9 | CXR551 | _a verificar_ | _a verificar_ | ⏳ |
| 16 | Derrame Pleural | /caso/16 | CXR2046 | _a verificar_ | _a verificar_ | ⏳ |
| 62 | Pneumotórax | /caso/62 | CXR3945 | _a verificar_ | _a verificar_ | ⏳ |
| 63 | Atelectasia | /caso/63 | CXR2036 | _a verificar_ | _a verificar_ | ⏳ |

Verificação no console do navegador:
```js
const img = document.querySelector('[data-testid="openi-raw-image"]');
console.log(img?.src);   // deve ser igual ao imageUrl da API
```

Teste de troca rápida obrigatório: caso 2 → caso 62 → caso 2.
A imagem anterior **nunca** persiste (o `useEffect` limpa `openIImageUrl` ao trocar de caso).

---

## Status do build

```
npm run build
→ ✓ Compiled successfully    (o módulo Open-i Raw compila sem erros)
→ ✗ Failed to type check
   Type error: Property 'I' does not exist on type 'TransformacaoDerivacoesConfig'.
   src/services/ecgGenerator/leadTransform.ts:286
```

### ⚠️ Erro PRÉ-EXISTENTE de ECG (fora de escopo — NÃO corrigido)

- **Onde:** `src/services/ecgGenerator/types.ts` define
  `interface TransformacaoDerivacoesConfig { [lead in ECGLead]?: ... }`.
  Sintaxe de *mapped type* (`[lead in ...]`) **não é válida dentro de `interface`** —
  só em `type`. Por isso o TS trata o tipo como vazio e `CONFIG_DERIVACOES.I` falha em
  `leadTransform.ts:286`.
- **Pré-existente:** o erro está no módulo ECG, que **não faz parte deste trabalho** e
  não foi tocado (alterações experimentais foram revertidas via `git checkout`).
- **Por que não foi corrigido:** instrução explícita de não mexer em ECG /
  `src/services/ecgGenerator` / `leadTransform` / `CONFIG_DERIVACOES`.
- **Correção sugerida (quando autorizado):** trocar `interface` por `type` e tipar
  `CONFIG_DERIVACOES` com `satisfies` para preservar as 12 chaves concretas.

Este erro bloqueia o `next build` completo, mas **não tem relação com o módulo
Open-i Raw**, que compila e funciona em dev.

---

## Limitações (honestidade)

- O sistema **não faz curadoria radiológica**.
- A imagem é **a primeira retornada** pelo Open-i para o termo.
- A imagem **pode não ser a melhor imagem didática** para o diagnóstico.
- O objetivo é **honestidade e simplicidade**, não precisão radiológica.
- O aviso amarelo deixa isso explícito ao aluno.

---

## Critérios de sucesso

| # | Critério | Status |
|---|---|---|
| 1 | Endpoint novo `/api/openi/raw` | ✅ |
| 2 | Componente novo `OpenIRawImagePanel` | ✅ |
| 3 | Aba "Exames de Imagem" usa o novo componente | ✅ |
| 4 | Backend retorna imageUrl para termos que o Open-i encontra | ✅ 6/6 |
| 5 | Frontend exibe exatamente essa imageUrl | ⏳ validação visual pendente |
| 6 | Sem fallback | ✅ |
| 7 | Sem scoring | ✅ |
| 8 | Sem imagem curada artificial | ✅ |
| 9 | Imagem anterior não persiste ao trocar de caso | ✅ (limpa no `useEffect`) |
| 10 | Build passa | ⚠️ módulo compila; bloqueado por erro pré-existente de ECG |

---

## Status final

**Módulo Open-i Raw: concluído e validado no backend (6/6).**
Pendências honestas, não declaradas como "pronto para produção":
1. Validação visual no navegador (src do DOM == imageUrl da API).
2. `npm run build` verde — depende da correção do erro **pré-existente** de ECG,
   que está **fora do escopo** desta tarefa.
