# Microcritérios Específicos por Diagnóstico — HealthBench OSCE

**Data:** 25 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Especializar os microcritérios de avaliação por diagnóstico (começando por **anemia hemolítica** e **asma**), mantendo os microcritérios genéricos como fallback. Os cards passam a cobrar comportamentos clinicamente específicos do caso, sem alterar layout, nota ou classificação.

---

## 1. Arquitetura

```
caso clínico
  ↓
identificar diagnóstico esperado (diagnostico_principal → diagnosticoCorreto → titulo)
  ↓
buscar rubrica específica por diagnóstico (aliases)
  ↓
se existir  → microcritérios ESPECÍFICOS (prioridade) + genéricos como complemento
se não      → microcritérios GENÉRICOS (fallback atual)
  ↓
HealthBench (grader) avalia cada microcritério pelo transcript
  ↓
feedback-view-builder monta os 6 cards (inalterado)
  ↓
FeedbackOSCE exibe sem alteração visual
```

---

## 2. Arquivos

### Criado (1)
- **`lib/healthbench/diagnosis-microcriteria.ts`** — `DIAGNOSIS_MICROCRITERIA` (anemia_hemolitica + asma), `identificarDiagnosticoRubrica()`, `AXIS_PARA_CAMPO`, normalização.

### Alterado (1)
- **`lib/healthbench/rubric-adapter.ts`** — identifica o diagnóstico; a cobertura mínima prioriza microcritérios específicos (genéricos como fallback); deduplicação; logs `[OSCE DIAG RUBRIC]`.

> `cards-config.ts`, `feedback-view-builder.ts`, `components/FeedbackOSCE.tsx`, `/api/corrigir`, ECG, Open-i, radiologia, exame físico visual e geração de imagens **não foram tocados**.

---

## 3. Identificação do diagnóstico

Fontes (em ordem): `caso.dados_ocultos_do_sistema.diagnostico_principal` → `caso.diagnosticoCorreto` → `caso.titulo`.
Normalização: minúsculas, remoção de acentos, espaços colapsados. Comparação por **aliases** (substring).

### Aliases
| Chave | Aliases |
|---|---|
| `anemia_hemolitica` | anemia hemolitica, anemia hemolitica autoimune, hemolise, hemolitica, aha |
| `asma` | asma, asma aguda, crise asmatica, exacerbacao asmatica, exacerbacao de asma, broncoespasmo |

---

## 4. Estrutura da rubrica específica

```ts
type DiagnosisMicrocriteria = {
  aliases: string[];
  criteriosPorCard: {
    comunicacao: string[];
    anamnese: string[];
    exameFisico: string[];
    examesComplementares: string[];
    raciocinioDiagnostico: string[];
    condutaSeguranca: string[];
  };
};
```

Mapeamento eixo → campo (`AXIS_PARA_CAMPO`): `axis:comunicacao→comunicacao`, `axis:anamnese→anamnese`, `axis:exame_fisico→exameFisico`, `axis:exames_complementares→examesComplementares`, `axis:raciocinio_clinico→raciocinioDiagnostico`, `axis:conduta_seguranca→condutaSeguranca`.

---

## 5. Regras de integração (rubric-adapter)

1. Para cada card, o **pool** de microcritérios é `[...específicos do diagnóstico, ...genéricos]` (específico tem prioridade).
2. Conta os critérios **reais** já atribuídos ao card (mesma partição do builder, `resolverAxisDoCard`).
3. Completa com o pool até atingir `minimoCobertura`, **sem duplicar** (dedup por texto normalizado).
4. Critérios adicionados são atômicos, positivos (`points: 1`), com a tag do card (`tags: [card.axis]`).
5. Critérios negativos/erros críticos seguem indo para "Conduta e Segurança".
6. O **grader (HealthBench) decide** se cada microcritério foi cumprido — nada é marcado automaticamente.
7. Sem rubrica específica → fallback genérico (comportamento anterior).

### Deduplicação
- Remove duplicatas textuais (normalizadas: minúsculas, sem acento, sem pontuação).
- Prefere o critério **específico** ao genérico equivalente.
- Não remove critérios reais do caso.

---

## 6. Logs

```
[OSCE DIAG RUBRIC] diagnóstico identificado: <chave|nenhum>
[OSCE DIAG RUBRIC] rubrica específica aplicada: <chave>
[OSCE DIAG RUBRIC] fallback genérico usado
[OSCE DIAG RUBRIC] critérios específicos adicionados: <n>
[OSCE DIAG RUBRIC] critérios duplicados removidos: <n>
[OSCE RUBRIC MICRO] cobertura para card: <nome> { reais, adicionados, especificos, totalCobertura }
```

---

## 7. Testes

### Caso 44 — Anemia hemolítica
- Log: `rubrica específica aplicada: anemia_hemolitica`; **19 critérios específicos** adicionados; 1 duplicado removido.

| Card | nº crit. | Exemplos específicos |
|---|---|---|
| Comunicação | 4 | Apresentou-se… |
| Anamnese | 4 | fadiga/dispneia; icterícia/colúria; medicamentos; autoimune/familiar |
| **Exame físico** | 4 | **palidez cutâneo-mucosa; icterícia em escleras; perfusão; sinais vitais/estabilidade** |
| **Exames complementares** | 3 | **reticulócitos; hemograma; bilirrubina/LDH/haptoglobina/Coombs** |
| Raciocínio | 4 | reconheceu hemólise; correlação anemia+reticulocitose+icterícia |
| **Conduta e Segurança** | 5 | **investigação etiológica; gravidade; sinais de alarme; encaminhamento** |

### Caso 3 — Asma
- Log: `rubrica específica aplicada: asma`; **14 critérios específicos** adicionados; 1 duplicado removido.

| Card | nº crit. | Exemplos específicos |
|---|---|---|
| Comunicação | 4 | Apresentou-se… |
| Anamnese | 4 | histórico de asma; gatilhos; broncodilatador prévio |
| **Exame físico** | 4 | **ausculta pulmonar (sibilos); SpO2/FR/FC; esforço respiratório** |
| **Exames complementares** | 3 | **"diagnóstico de crise asmática é principalmente clínico"; oximetria; pico de fluxo** (RX não obrigatório) |
| Raciocínio | 4 | reconheceu crise asmática; classificação de gravidade |
| **Conduta e Segurança** | 5 | broncodilatador; corticoide; reavaliação; sinais de alarme |

### Caso 1 — SCA (sem rubrica específica)
- Log: `fallback genérico usado`. Cards preenchidos com critérios reais do caso + genéricos. Nenhum card vazio; sistema não quebra.

---

## 8. Confirmações

| # | Item | Status |
|---|---|---|
| 1 | Rubricas específicas (anemia, asma) | ✅ |
| 2 | Fallback genérico para não mapeados | ✅ (caso 1) |
| 3 | Específicos no caso 44 | ✅ 19 |
| 4 | Específicos no caso 3 | ✅ 14 |
| 5 | Exame físico clinicamente específico | ✅ (anemia: palidez/icterícia; asma: ausculta/SpO2/esforço) |
| 6 | Critérios atômicos | ✅ |
| 7 | Dedup específico × genérico | ✅ |
| 8 | Nota = soma dos 6 cards | ✅ (caso 44: 14.0/20) |
| 9 | Classificação textual usa nota visual | ✅ (builder não alterado) |
| 10 | Layout inalterado / sem 7º card | ✅ |
| 11 | ECG, Open-i, radiologia, exame físico visual, imagens, /api/corrigir | ✅ intactos |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG**; o app compila e roda em dev.

---

## 9. Critério de sucesso

Para diagnósticos mapeados, os cards avaliam comportamentos clínicos específicos do caso:
- **Anemia hemolítica:** Exame físico cobra palidez/icterícia/sinais vitais; Exames cobra reticulócitos/bilirrubina/LDH/haptoglobina/Coombs; Conduta cobra investigação etiológica e sinais de alarme.
- **Asma:** Exame físico cobra saturação/esforço/ausculta; Exames entende que asma é diagnóstico clínico (RX não obrigatório); Conduta cobra broncodilatador/corticoide/reavaliação.

Diagnósticos ainda não mapeados continuam com a base genérica funcionando.

---

## 10. Próximos passos sugeridos

1. Adicionar rubricas específicas para mais diagnósticos frequentes (pneumonia, DPOC, SCA, ICC, TEP, pneumotórax, derrame pleural).
2. Validar no navegador com atendimentos reais completos.
3. Opcional: permitir que critérios específicos tragam peso/relevância própria, se no futuro a pontuação por card deixar de ser uniforme.
