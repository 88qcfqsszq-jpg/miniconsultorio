# Lote 2A — Rubricas Específicas Cardiopulmonar Adulto

**Data:** 26 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Adicionar microcritérios específicos para 6 diagnósticos cardiopulmonares adultos, com desambiguação segura entre pneumonia adulto e pediátrica, mantendo fallback genérico, nota, classificação e layout.

---

## 1. Diagnósticos do lote (6)

| Chave | Diagnóstico |
|---|---|
| `sca_iam` | Síndrome Coronariana Aguda / IAM |
| `insuficiencia_cardiaca` | Insuficiência cardíaca / IC descompensada |
| `dpoc_exacerbado` | DPOC exacerbado |
| `pneumonia_adulto` | Pneumonia adulto / PAC adulto |
| `tep` | Tromboembolismo pulmonar |
| `pneumotorax` | Pneumotórax |

Cada um com microcritérios atômicos nos 6 cards (Comunicação, Anamnese, Exame físico, Exames complementares, Raciocínio diagnóstico, Conduta e Segurança).

---

## 2. Arquivos alterados (2)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/diagnosis-microcriteria.ts` | 6 rubricas + aliases; `DiagnosticoRubricaKey` ampliado; match por **word boundary**; desambiguação de pneumonia |
| `lib/healthbench/rubric-adapter.ts` | Passa marcador de faixa etária (tipoPaciente / idade) à identificação |

> `feedback-view-builder.ts`, `cards-config.ts`, `components/FeedbackOSCE.tsx`, `/api/corrigir`, ECG, Open-i, radiologia, exame físico visual e geração de imagens **não foram tocados**.

---

## 3. Aliases adicionados

| Chave | Aliases |
|---|---|
| `sca_iam` | iam, infarto, infarto agudo do miocardio, sindrome coronariana aguda, sca, dor toracica coronariana, angina instavel |
| `insuficiencia_cardiaca` | insuficiencia cardiaca, icc, insuficiencia cardiaca descompensada, edema agudo de pulmao, congestao pulmonar |
| `dpoc_exacerbado` | dpoc, exacerbacao dpoc, dpoc exacerbado, exacerbacao de dpoc, doenca pulmonar obstrutiva cronica exacerbada |
| `pneumonia_adulto` | pneumonia adulto, pneumonia em adulto, pneumonia comunitaria, pneumonia adquirida na comunidade, pac adulto, pac, infeccao pulmonar |
| `tep` | tep, tromboembolismo pulmonar, embolia pulmonar, embolia pulmonar aguda, tromboembolia pulmonar |
| `pneumotorax` | pneumotorax, pneumotorax espontaneo, pneumotorax hipertensivo |

---

## 4. Desambiguação pneumonia adulto × pediátrica

Dois mecanismos garantem que `pneumonia_adulto` não quebre `pneumonia_pediatrica`:

1. **Match por word boundary** — o alias passou a casar como palavra(s) inteira(s) (`(?:^|[^a-z0-9])alias(?:[^a-z0-9]|$)`). Isso eliminou falsos positivos de siglas curtas, ex.: `"ic"` (alias de IC) deixou de casar dentro de "insufic**ic**iência"; `"pac"` só casa isolado.
2. **Desambiguação explícita** — quando o match é de pneumonia (adulto OU pediátrica), consulta-se um marcador pediátrico no texto:
   - regex: `crianca | lactente | escolar | pediatr | neonat | bebe | recem | pre-escolar | menor de`;
   - com marcador → `pneumonia_pediatrica`; sem → `pneumonia_adulto`.

O `rubric-adapter` injeta o marcador a partir de `caso.tipoPaciente === "pediatrico"` ou `idade < 14` ("paciente pediatrico crianca"); caso contrário "paciente adulto". A ordem dos aliases deixa de importar para pneumonia.

Teste de identificação (a mesma "PAC" muda conforme a faixa):
- "Pneumonia Adquirida na Comunidade (PAC)" + adulto → `pneumonia_adulto`
- "Pneumonia Adquirida na Comunidade (PAC)" + pediátrico → `pneumonia_pediatrica`
- "Pneumonia pediátrica" → `pneumonia_pediatrica`

---

## 5. Regras mantidas (Lote 1)

- Microcritérios atômicos; específicos têm prioridade; genéricos completam a cobertura mínima.
- Deduplicação por texto normalizado.
- HealthBench (grader) decide se cada microcritério foi cumprido.
- Consistência: card com acertos positivos não fica 0 sem penalidade crítica visível; senão `[FEEDBACK HB CONSISTENCY ERROR]` + piso mínimo.

---

## 6. Testes

### Identificação isolada (10/10 ✅)
SCA/IAMCSST, IAM, IC sistólica, DPOC exacerbação, PAC adulto, PAC pediátrico, pneumonia pediátrica, TEP, pneumotórax → corretos; HAS → `null` (fallback).

### Ponta a ponta (casos reais)
| Caso | Diagnóstico | Rubrica aplicada | Específicos | Consistência |
|---|---|---|---|---|
| 1 | SCA/IAMCSST | `sca_iam` | 17 | ✅ |
| 8 | Insuficiência Cardíaca | `insuficiencia_cardiaca` | 15 | ✅ |
| 9 | DPOC Exacerbação | `dpoc_exacerbado` | 14 | ✅ |
| 10 | TEP | `tep` | 15 | ✅ |
| 2 | PAC (adulto) | `pneumonia_adulto` | 15 | ✅ |
| 62 | Pneumotórax | `pneumotorax` | 16 | ✅ |

- **0 erros** `[FEEDBACK HB CONSISTENCY ERROR]`.
- Nota = soma dos 6 cards (header == distribuição) em todos.
- Notas baixas refletem atendimento de teste sintético/genérico — não é bug.

---

## 7. Exemplos de especificidade clínica

- **SCA/IAM:** ECG precoce, troponina seriada, reperfusão urgente se supra, antiagregação com checagem de contraindicações.
- **IC:** turgência jugular, B3, estertores, diurético se congestão, BNP/NT-proBNP.
- **DPOC:** purulência do escarro, gasometria se retenção de CO₂, antibiótico conforme escarro/gravidade, O₂ com alvo evitando hiperóxia.
- **Pneumonia adulto:** ausculta (crepitações/sopro tubário), RX quando indicado, antibiótico conforme gravidade, sinais de sepse.
- **TEP:** escore de probabilidade, D-dímero, angioTC, anticoagulação conforme risco/contraindicações, trombólise se maciço.
- **Pneumotórax:** murmúrio reduzido/assimetria, descompressão imediata se hipertensivo, drenagem se grande/sintomático.

---

## 8. Confirmações

| Item | Status |
|---|---|
| 6 rubricas do lote implementadas | ✅ |
| Pneumonia adulto não quebrou pediátrica | ✅ (word boundary + marcador) |
| Todos os 6 cards com critérios específicos | ✅ |
| Card com acertos não fica 0 | ✅ (0 consistency errors) |
| Critério negativo não acionado não vira acerto | ✅ |
| Evidência no card correto | ✅ |
| Nota = soma dos 6 cards | ✅ |
| Classificação textual usa nota visual | ✅ |
| Fallback genérico preservado | ✅ (HAS → fallback) |
| Layout inalterado / sem 7º card | ✅ |
| ECG, Open-i, radiologia, exame físico visual, imagens, /api/corrigir | ✅ intactos |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

---

## 9. Próximos passos sugeridos

1. Lote 2B: ICC crônica estável, arritmias, valvopatias, pericardite, dissecção de aorta, derrame pleural.
2. Outros sistemas: abdome agudo, ITU/pielonefrite, sepse, AVC, cetoacidose.
3. Validação no navegador com atendimentos reais completos.
