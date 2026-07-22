# MEDIX PATIENT V3 — SCHEMA DO CASO (CONTRATO) · V1.2
### Correção cirúrgica final · Versão CONGELADA

> Correção pontual da V1.1 em **três pontos apenas** — abertura controlada, interlocutor e não-duplicação da cronologia. Estrutura geral inalterada. Nenhum código funcional, nenhum runtime/Prompt Base/Context Builder/Validator, nenhum arquivo do app alterado, nenhum commit/push. Notação de tipos = linguagem do contrato.

---

## 1. Resumo das três correções

1. **Abertura controlada da consulta** — `DisclosurePolicy` ganha `aberturaFactIds: string[]`: referências ordenadas a `FatoPaciente.id` que compõem a abertura da estação. A ordem do array é a ordem conceitual; o texto continua gerado naturalmente. **Não** restaura `primeiraFala` nem Simulation Assets, e **não** introduz prioridade geral nas regras.
2. **Interlocutor do caso** — removida a inferência "presença de `responsavel` ⇒ pediátrico". Adicionado `interlocutor: "paciente" | "responsavel"` em `PatientKnowledge`. `identidade` descreve o paciente; `responsavel?` descreve o responsável quando existir; `interlocutor` define quem responde. Sem perfil separado para acompanhante.
3. **Não-duplicação da cronologia** — `ClinicalTruth.cronologiaVerdadeira` permanece, agora com declaração explícita de que é a linha do tempo canônica reservada; `PatientKnowledge.fatos` representa só o que o paciente percebe/sabe/relata; os dois **não** são cópias literais. Sem camada `PatientView`.

---

## 2. SCHEMA V1.2 (completo)

### Invariante de zona (propriedade do dado, não do runtime)
Duas zonas mutuamente exclusivas. **Zona do Paciente:** `patientKnowledge`, `disclosurePolicy`, `persona`, `sessionStateInicial`. **Zona Reservada:** `clinicalTruth`, `examiner`. `metadata` é neutra. Diagnóstico, interpretação, conduta e avaliação existem **apenas** na Zona Reservada — nunca em Patient Knowledge.

### Topo
```ts
interface CasoV3 {
  schemaVersion: "3.2";
  metadata:             Metadata;
  clinicalTruth:        ClinicalTruth;        // zona reservada
  patientKnowledge:     PatientKnowledge;     // zona do paciente
  disclosurePolicy:     DisclosurePolicy;     // zona do paciente (chaveada por factId)
  persona:              Persona;              // zona do paciente (imutável)
  sessionStateInicial:  SessionStateInicial;  // zona do paciente (valores de partida)
  examiner:             Examiner;             // zona reservada
}
```

### Metadata
```ts
interface Metadata {
  id: string;
  titulo: string;
  especialidade: string;
  tema?: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  tipoEstacao: "entrevista" | "exame_fisico" | "procedimento" | "integrada";
  duracaoMinutos: number;
  versaoCaso: string;
}
```

### Clinical Truth (zona reservada)
```ts
interface ClinicalTruth {
  diagnosticoPrincipal: string;
  diagnosticosDiferenciais: string[];
  // Linha do tempo clínica CANÔNICA — reservada à simulação e à avaliação.
  // NÃO é a percepção do paciente e NÃO deve ser copiada literalmente para
  // PatientKnowledge.fatos (ver "Não-duplicação da cronologia" abaixo).
  cronologiaVerdadeira: string;
  exameFisicoVerdadeiro: ExameFisicoAchados;
  sinaisVitais: SinaisVitais;
  exames: ExameResultado[];        // { nome, resultado, valorReferencia?, interpretacao }
  ecg?: EcgVerdadeiro;
  evolucao: EvolucaoClinica;
  complicacoes?: string[];
  tratamentoCorreto: CondutaEsperada;
}
```

### Patient Knowledge (zona do paciente)
```ts
interface PatientKnowledge {
  identidade: {
    nome: string;
    idade: number;
    sexo: "M" | "F";
  };
  // Quem responde durante a simulação. NÃO implica faixa etária:
  // um adulto pode ter acompanhante/cuidador e uma criança pode responder direto.
  interlocutor: "paciente" | "responsavel";
  // Presente apenas quando há um responsável/acompanhante no caso.
  responsavel?: {
    nome: string;
    parentesco: string;
  };
  fatos: FatoPaciente[];
}

type DominioFato =
  | "historiaAtual" | "sintoma" | "antecedente" | "medicamento"
  | "alergia" | "habito" | "familia" | "contextoSocial"
  | "preocupacao" | "objetivo";

interface FatoPaciente {
  id: string;             // estável; chave da Disclosure Policy
  dominio: DominioFato;
  valor: string;          // o DADO, em termos neutros — NUNCA frase pronta em 1ª pessoa
  incerto?: boolean;      // true ⇒ paciente sabe vagamente ("não lembro direito")
}
```

### Disclosure Policy (zona do paciente)
```ts
type PoliticaRevelacao =
  | "espontanea"      // pode surgir sem gatilho
  | "perguntaAberta"  // sai em pergunta ampla
  | "perguntaDireta"  // só com pergunta específica  (default de convenção p/ fatos sem regra)
  | "sensivel";       // só após abertura relacional

interface DisclosurePolicy {
  // Fatos que compõem a abertura da estação, na ordem conceitual do array.
  // Referenciam FatoPaciente.id. Controlam APENAS o início — o texto final
  // é gerado naturalmente; nenhuma frase pronta é armazenada.
  aberturaFactIds: string[];
  regras: {
    factId: string;
    politica: PoliticaRevelacao;
  }[];
}
```

### Persona (zona do paciente — imutável) — inalterada
```ts
interface Persona {
  expansividade: number;    // 0–10 (lacônico ↔ falante)
  objetividade: number;     // 0–10 (divaga ↔ direto)
  letramentoSaude: "baixo" | "medio" | "alto";
}
```

### Session State inicial (zona do paciente) — inalterado
```ts
interface SessionStateInicial {
  ansiedade: number;    // 0–10
  medo: number;
  confianca: number;
  cooperacao: number;
  frustracao: number;
}
```

### Examiner (zona reservada) — inalterado
```ts
interface Examiner {
  rubricas: RubricaItem[];
  checklist: ChecklistItem[];
  errosCriticos: ErroCritico[];
  feedback: FeedbackModelo;
  criteriosAprovacao: string[];
}
```

---

## Não-duplicação da cronologia (declaração normativa)

- `ClinicalTruth.cronologiaVerdadeira` é a **linha do tempo clínica canônica**, reservada à simulação e à avaliação.
- `PatientKnowledge.fatos` representa **somente o que o paciente percebe, sabe e consegue relatar**.
- Os dois blocos **não devem ser cópias literais** um do outro.
- Diferenças de **percepção, memória ou linguagem** pertencem a `PatientKnowledge` (ex.: "começou de repente à noite" vs. horário exato canônico; `incerto?` para o que o paciente lembra vagamente).
- Informações **diagnósticas e interpretações** pertencem **somente** a `ClinicalTruth`.
- **Não** existe camada `PatientView`; a fronteira Clinical Truth × Patient Knowledge basta no nível do dado.

---

## 3. Regras de integridade referencial

1. **`regras[].factId` ⊂ `PatientKnowledge.fatos[].id`** — todo `factId` referenciado na Disclosure Policy deve existir em `PatientKnowledge.fatos`.
2. **`aberturaFactIds[] ⊂ `PatientKnowledge.fatos[].id`** — todo id de abertura deve existir em `PatientKnowledge.fatos`.
3. **Unicidade de `FatoPaciente.id`** — nenhum `factId` pode se repetir dentro de `PatientKnowledge.fatos`.
4. **Zonas reservadas** — `ClinicalTruth` e `Examiner` permanecem reservados; nenhum dos seus campos pertence à Zona do Paciente.

> Notas de integridade (sem introduzir estruturas): recomenda-se que os `aberturaFactIds` refiram fatos cuja política permita abertura (tipicamente `espontanea`), e que não haja `factId` repetido entre `aberturaFactIds` — mas ambos são coerência de conteúdo do caso, não novos campos.

---

## 4. Declaração final de congelamento

Estrutura geral idêntica à V1.1 aprovada; apenas os três pontos autorizados foram corrigidos. Simulation Assets, PatientRuntimeContext, `gatilhos`/`prioridade`/`default` por caso e Patient View **não** foram reintroduzidos; as quatro políticas de revelação foram mantidas; `Persona`, `SessionStateInicial` e `FatoPaciente.valor` permanecem inalterados.

O MEDIX PATIENT V3 — SCHEMA DO CASO V1.2 está congelado. Qualquer mudança futura exigirá um caso clínico real que demonstre que o contrato atual é insuficiente.
