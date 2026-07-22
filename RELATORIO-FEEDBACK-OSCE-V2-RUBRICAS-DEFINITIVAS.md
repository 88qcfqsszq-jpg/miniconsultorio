# Relatório — Feedback OSCE V2 com Rubricas Definitivas

Data: 2026-07-13

---

## Caminho das rubricas definitivas

```
data/rubricas-osce-adulto-pediatrico-ts/lib/healthbench/rubricas-osce/perfis-casos/
  adultos/    — 59 arquivos de perfil (caso-1.ts … caso-63.ts, com gaps nos IDs 35–37)
  pediatricos/— 16 arquivos de perfil (ped-01.ts … ped-16.ts) + caso-64.ts
```

Formato: TypeScript (`.ts`), exportando `PerfilRubricaCaso` (interface definida em `types.ts`)

---

## Arquivos adultos encontrados

60 perfis no total. Destaque para casos de teste:

| ID | Título | Sistema |
|----|--------|---------|
| `1` | Dor Torácica — SCA | cardiovascular |
| `2` | Pneumonia Adquirida na Comunidade | respiratório |
| `3` | Asma Aguda | respiratório |
| `9` | DPOC Exacerbação Aguda | respiratório |
| `12` | Dengue — Grupo A | infectologia |
| `13` | Endocardite Infecciosa | cardiovascular |
| … (59 total) | | |

---

## Arquivos pediátricos encontrados

17 perfis no total (16 `ped-XX` + `caso-64`):

| ID | Título | Sistema |
|----|--------|---------|
| `ped-01` | Febre em Criança de 4 Anos | infectologia |
| `ped-10` | Tuberculose Pulmonar — Criança de 7 Anos | respiratório |
| `ped-11` | Asma na Infância — Criança de 7 Anos | respiratório |
| `ped-12` | Rinossinusite Bacteriana — Criança de 9 Anos | respiratório |
| `ped-13` | Pneumonia Adquirida na Comunidade — Criança de 5 Anos | respiratório |
| `ped-14` | Linfonodomegalia Cervical — Criança de 7 Anos | infectologia |
| `ped-16` | Suspeita de Dengue — Criança de 8 Anos | infectologia |
| … (17 total) | | |

---

## Arquivos alterados

| Ação | Arquivo |
|------|---------|
| CRIADO | `lib/healthbench/perfil-rubrica-loader.ts` |
| ALTERADO | `lib/healthbench/rubric-adapter.ts` |
| ALTERADO | `lib/healthbench/feedback-builder.ts` |
| ALTERADO | `lib/osce/evidence-mapper.ts` |

---

## Arquivos NÃO alterados

- Todo `content/learn/` (MEDIX Learn) ✅
- Todo `lib/medix-learn/` ✅
- Todo `lib/dynamic-osce/` (Pulse / Casos Dinâmicos) ✅
- `lib/healthbench/grader.ts` ✅
- `lib/healthbench/grader-template.ts` ✅
- `lib/healthbench/evaluator.ts` ✅
- `lib/healthbench/transcript-normalizer.ts` ✅
- `lib/healthbench/score.ts` ✅
- `lib/healthbench/metrics.ts` ✅
- `app/api/osce/finalizar/route.ts` ✅
- `components/FeedbackOSCE.tsx` ✅
- Layout, sidebar, navbar, AppShell ✅

---

## Arquitetura final

```
POST /api/osce/finalizar
  └── evaluateHealthBenchAttempt()     [evaluator.ts]
        └── adaptarRubricaDoCaso()     [rubric-adapter.ts]
              ├── 0. carregarPerfilRubrica()   ← NOVO
              │       → converterPerfilParaItens()
              │         (focoAnamnese, focoExameFisico, examesEssenciais,
              │          focoDiagnostico, condutasEssenciais, criteriosCriticos, seguranca)
              ├── 1. caso.rubrica_correcao (mantido)
              ├── 2. caso.checklist_osce  (mantido)
              ├── 3. caso.erros_criticos  (mantido)
              └── 4. garantirCoberturaMinima()
                      (agora preenche APENAS onde perfil não cobriu)
```

---

## Como rubricas são carregadas

`lib/healthbench/perfil-rubrica-loader.ts` importa diretamente:

```typescript
import { PERFIS_RUBRICA_ADULTOS_BY_ID }    from "@/data/.../perfis-casos/adultos"
import { PERFIS_RUBRICA_PEDIATRICOS_BY_ID } from "@/data/.../perfis-casos/pediatricos"
```

Lookup por `String(caso.id)`. Adulto/pediátrico separado por:
- `caso.id.startsWith('ped-')` → pediatrico
- `caso.tipoPaciente === 'pediatrico'` → pediatrico
- Fallback: `PERFIS_RUBRICA_PEDIATRICOS_BY_ID[id]` existe → pediatrico
- Demais → adulto

---

## Como o evidence mapper funciona

`lib/osce/evidence-mapper.ts` expande exames agrupados via `GRUPOS_EXAME`:

| Exame solicitado | Evidências reconhecidas |
|-----------------|------------------------|
| Hemograma | hemoglobina, hematócrito, leucócitos, **neutrófilos, linfócitos** (adicionados), plaquetas |
| Marcadores inflamatórios | PCR, procalcitonina |
| Gasometria | pH, PaO₂, PaCO₂, HCO₃, lactato |
| Função hepática | AST/TGO, ALT/TGP, FA, GGT, bilirrubinas, albumina |
| Função renal | ureia, creatinina, TFG |
| Eletrólitos | sódio, potássio, cloro, magnésio, cálcio |

Exame físico — novo mapeamento adicionado:

| Regex | Evidência |
|-------|-----------|
| `neurolog|glasgow|pupilas|deficit focal|reflexo…` | `realizou exame neurológico` |

---

## Exemplos de evidências reconhecidas

```
Caso 12 (Dengue Adulto) — PerfilRubricaCaso carregado:
  focoAnamnese[]:      10 itens (queixa, febre, sangramento, hidratação…)
  focoExameFisico[]:   8 itens (sinais vitais, perfusão, pele, abdome…)
  examesEssenciais[]:  5 itens (hemograma, hematócrito, plaquetas, função hepática, testes específicos)
  condutasEssenciais[]:4 itens (hidratação, antitérmico, evitar AINEs, observação)
  criteriosCriticos[]: 0
  seguranca[]:         3 itens (orientar sinais de alarme, reavaliar, alta segura)
  Total itens do perfil: ~30 itens atômicos por caso

Caso 3 (Asma) — examesEssenciais:
  "oximetria", "radiografia de tórax quando indicada", "gasometria se grave"
  → gasometria expande para: ph, paco2, pao2, hco3, lactato

Caso ped-16 (Dengue pediátrico) — focoExameFisico:
  "sinais vitais pediátricos", "estado geral", "hidratação e perfusão",
  "pele e mucosas", "dor abdominal/hepatomegalia quando aplicável"
```

---

## Casos testados

| Caso | ID | Tipo | Perfil? | Build? | TSC? |
|------|----|------|---------|--------|------|
| Dengue clássica adulto | 12 | adulto | ✅ caso-12.ts | ✅ | ✅ |
| Pneumonia (PAC) | 2 | adulto | ✅ caso-2.ts | ✅ | ✅ |
| Asma aguda | 3 | adulto | ✅ caso-3.ts | ✅ | ✅ |
| Asma pediátrica | ped-11 | pediatrico | ✅ ped-11.ts | ✅ | ✅ |
| Dengue pediátrica | ped-16 | pediatrico | ✅ ped-16.ts | ✅ | ✅ |
| Caso sem perfil (ex: 35) | 35 | adulto | ❌ → fallback | ✅ | ✅ |

---

## Validações executadas

```
npx tsc --noEmit
→ zero erros ✅

rm -rf .next/ && npm run build
→ 92/92 páginas estáticas ✅
→ zero erros de build ✅
→ 2 avisos DEP0205 (depreciação Node.js não relacionada a esta fase) ✅
```

---

## Como o feedback-builder usa MEDIX Learn

`lib/healthbench/feedback-builder.ts` detecta temas nos critérios não cumpridos e adiciona sugestões de revisão:

```
Revisão sugerida no MEDIX Learn:
- Sepse e choque séptico → /learn/infectologia/sepse-e-choque-septico
- Dispneia → /learn/respiratorio/dispneia
- Sinais vitais e gravidade → /learn/semiologia-geral/sinais-vitais-e-gravidade
```

Mapeamentos disponíveis: sepse, pneumonia/PAC, dispneia, hipoxemia, sinais vitais,
síndromes diagnósticas, AVC/déficit focal, exame neurológico, rebaixamento, abdome agudo, meningite.

MEDIX Learn **não foi alterado**. Apenas links/referências no texto do feedback.

---

## Pendências

- **Teste browser real**: validar fluxo completo no navegador (dev server rodando em `http://localhost:3006`)
- **Casos 35–37**: não têm `PerfilRubricaCaso` — usam fallback genérico (comportamento anterior preservado)
- **Comunicação**: `PerfilRubricaCaso` não tem campo `focoComunicacao`; o card de comunicação recebe cobertura pela `garantirCoberturaMinima()` com critérios genéricos (comportamento anterior mantido)

---

## Confirmação de escopo

- Layout, cores, sidebar, AppShell: **não alterados** ✅
- MEDIX Learn (content/learn/, lib/medix-learn/): **não alterado** ✅
- Pulse (lib/dynamic-osce/pulse/): **não alterado** ✅
- Casos Dinâmicos (lib/dynamic-osce/, components/dynamic-osce/): **não alterados** ✅
- app/treinamento/page.tsx, CasoCard.tsx, PainelGerarCaso.tsx: **não alterados** ✅
