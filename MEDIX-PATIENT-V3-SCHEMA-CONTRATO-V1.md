# MEDIX PATIENT V3 — SCHEMA DO CASO (CONTRATO)
### Contrato de estrutura de dados · Version 1.0 · Draft

> Documento de **contrato**, não de implementação. A notação de tipos abaixo (estilo TypeScript) é a **linguagem do contrato**, não código wired ao app — nenhum arquivo funcional foi criado ou alterado, nada foi implementado, nenhum commit/push. Deriva diretamente da `MEDIX PATIENT V3 SPECIFICATION` e da `AUDITORIA 01`.
>
> Objetivo: fixar, de forma inequívoca, **como qualquer caso clínico deve ser representado** para o Patient V3 — quais são os campos, seus tipos, o que é público ao paciente e o que nunca pode chegar a ele.

---

## 0. Invariante de fronteira (a regra que o schema existe para garantir)

Todo caso V3 se divide em **duas zonas mutuamente exclusivas**:

| Zona | Seções | Pode alcançar o runtime do paciente? |
|---|---|---|
| **Zona do Paciente** | Patient Knowledge · Disclosure Policy · Persona · Session State · Simulation Assets (parte) | **Sim**, filtrada pela Disclosure Policy |
| **Zona Reservada** | Clinical Truth · Examiner | **Nunca** — nem sob rótulo "não revele" |

`Metadata` é neutra (administrativa) e não contém verdade clínica.

**Contrato do Validator:** a única entrada que o Prompt Base pode receber é um `PatientRuntimeContext` (Seção 10), derivado exclusivamente da Zona do Paciente. Qualquer caminho que leve `ClinicalTruth` ou `Examiner` ao prompt do paciente é uma violação de contrato.

> Isto corrige diretamente o achado central da AUDITORIA 01: hoje `diagnostico_principal` + diferenciais entram no prompt do paciente sob "DIAGNÓSTICO (NÃO REVELE)". No V3 isso é estruturalmente impossível: diagnóstico vive só em `ClinicalTruth` (Zona Reservada).

---

## 1. Forma de topo

```ts
interface CasoV3 {
  schemaVersion: "3.0";        // versão do contrato, obrigatória
  metadata:          Metadata;
  clinicalTruth:     ClinicalTruth;      // Zona Reservada
  patientKnowledge:  PatientKnowledge;   // Zona do Paciente
  disclosurePolicy:  DisclosurePolicy;   // Zona do Paciente (chaveada por factId)
  persona:           Persona;            // Zona do Paciente (imutável)
  sessionState:      SessionStateSpec;   // Zona do Paciente (mutável em runtime)
  simulationAssets:  SimulationAssets;   // Zona do Paciente (parte) / neutra
  examiner:          Examiner;           // Zona Reservada
}
```

**Single Source of Truth (Princípio 1):** cada fato existe em **exatamente um** lugar. O conteúdo de um fato mora em `PatientKnowledge`; sua política mora em `DisclosurePolicy` referenciando o mesmo `factId`. Verdade clínica mora só em `ClinicalTruth`. Nada é duplicado. *(Alvo de deduplicação herdado do caso atual: `respostas_do_paciente` vs `respostaPaciente`; `sinais_vitais.corretos` vs `sinaisVitaisCorretos`; `exames_complementares_disponiveis` vs `exames.laboratoriais` vs `exames_laboratoriais_detalhados`.)*

---

## 2. Metadata

```ts
interface Metadata {
  id: string;                 // estável, único
  titulo: string;
  especialidade: string;      // ex.: "Cardiovascular"
  tema?: string;              // ex.: "Dor Torácica"
  nivel: "iniciante" | "intermediario" | "avancado";
  tipoEstacao: "entrevista" | "exame_fisico" | "procedimento" | "integrada";
  duracaoMinutos: number;     // duração da estação OSCE
  palavrasChave: string[];    // keywords / subtópicos
  versaoCaso: string;         // versionamento do conteúdo do caso (semver)
}
```
**Mapa atual →** `id, titulo, sistema, tema, nivel, tipo_estacao, tempo_osce_minutos, subtopicosOSCE/temaOSCE`.

---

## 3. Clinical Truth (Zona Reservada — nunca ao paciente)

```ts
interface ClinicalTruth {
  diagnosticoPrincipal: string;
  diagnosticosDiferenciais: string[];
  cronologiaVerdadeira: string;              // linha do tempo real do quadro
  exameFisicoVerdadeiro: ExameFisicoAchados; // achados reais por região
  sinaisVitais: SinaisVitais;                // valores reais (números)
  exames: ExameResultado[];                  // labs/imagem com resultado + interpretação
  ecg?: EcgVerdadeiro;                        // padrão/derivações/interpretação
  evolucao: EvolucaoClinica;                 // como o quadro muda conforme conduta
  complicacoes?: string[];
  tratamentoCorreto: CondutaEsperada;
}

interface ExameResultado {
  nome: string;
  resultado: string;
  valorReferencia?: string;
  interpretacao: string;   // interpretação é verdade clínica → nunca vai ao paciente
}
```
**Mapa atual →** `dados_ocultos_do_sistema`, `exame_fisico(_interativo)`, `sinais_vitais`, `exames_complementares_disponiveis`/labs detalhados, `ecgGerado`/`ecg`, `sinaisVitais.evolucao`, `conduta_esperada`. **Toda esta seção é Zona Reservada.**

> Nota: os módulos de exame físico, exames complementares e sinais vitais (que hoje já consomem esses dados fora do prompt do paciente) continuam lendo daqui — o V3 não muda esses módulos, apenas garante que este bloco não vaze para o paciente.

---

## 4. Patient Knowledge (Zona do Paciente)

Conjunto de **fatos atômicos** que uma pessoa real conheceria. Cada fato tem `id` estável (referenciado pela Disclosure Policy) e conteúdo já em **linguagem leiga**.

```ts
interface PatientKnowledge {
  identidade: Identidade;
  fatos: FatoPaciente[];      // história atual, sintomas, antecedentes, medicamentos,
                              // alergias, hábitos, família, contexto social,
                              // preocupações, objetivos — TUDO como fatos atômicos
}

interface Identidade {
  nome: string;
  idade: number;
  sexo: "M" | "F";
  ehPediatrico: boolean;
  responsavel?: { nome: string; parentesco: string }; // se pediátrico
}

type DominioFato =
  | "historiaAtual" | "sintoma" | "antecedente" | "medicamento"
  | "alergia" | "habito" | "familia" | "contextoSocial"
  | "preocupacao" | "objetivo";

interface FatoPaciente {
  id: string;                 // estável, único; chave da Disclosure Policy
  dominio: DominioFato;
  conteudo: string;           // em linguagem leiga, do jeito que o paciente diria
  // Natureza epistêmica do fato (Regra 7): o paciente pode legitimamente não saber.
  natureza?: "sabe" | "naoSabe" | "naoLembra";
}
```

**Mapa atual →** `caso.paciente.*` (nome/idade/sexo/queixa/histórico/antecedentes/medicamentos/alergias) + `respostas_do_paciente`. **Lacunas a preencher** (achadas na auditoria do caso SCA, hoje ausentes): `habito`, `contextoSocial`, `preocupacao`, `objetivo`, e detalhamento de `medicamento` (dose/horário/adesão).

**Regra 2/7 no schema:** só existe como fato o que está autorizado. O que não é fato **não existe** para o paciente → resposta natural "Não sei / Não lembro / Nunca me disseram". O runtime nunca fabrica um fato ausente.

---

## 5. Disclosure Policy (Zona do Paciente — chaveada por `factId`)

Uma política por fato. Enum **oficial** exatamente como na spec.

```ts
type PoliticaRevelacao =
  | "espontanea"      // pode surgir sem ser perguntado (abertura)
  | "perguntaAberta"  // sai em pergunta ampla ("como está?", "conte mais")
  | "perguntaDireta"  // só quando perguntado especificamente
  | "aposEmpatia"     // só depois de acolhimento explícito do examinador
  | "aposRapport"     // só depois de vínculo estabelecido ao longo da consulta
  | "naoSabe"         // o paciente genuinamente não sabe
  | "naoLembra"       // o paciente não recorda com precisão
  | "proibido";       // nunca verbalizável (não pertence ao conhecimento do paciente)

interface RegraRevelacao {
  factId: string;                 // referencia FatoPaciente.id (Single Source of Truth)
  politica: PoliticaRevelacao;
  gatilhos?: string[];            // termos/intenções que disparam (p/ perguntaDireta)
  prioridade?: number;            // desempate quando vários fatos são elegíveis
}

interface DisclosurePolicy {
  regras: RegraRevelacao[];       // idealmente 1 regra por FatoPaciente.id
  default?: PoliticaRevelacao;    // política p/ fatos sem regra explícita (sugestão: "perguntaDireta")
}
```

**Mapa atual →** **não existe** como dado. Hoje a revelação progressiva é instruída em prosa dentro do prompt (`prompts.ts`). No V3 vira dado por-fato. **Estrutura nova.**

Semântica de cada política (contrato de comportamento que o runtime deve honrar):

| Política | Quando o fato pode aparecer |
|---|---|
| `espontanea` | Logo, sem gatilho — inclusive na primeira fala |
| `perguntaAberta` | Diante de pergunta ampla |
| `perguntaDireta` | Só com pergunta específica (usa `gatilhos`) |
| `aposEmpatia` | Só após acolhimento explícito do examinador |
| `aposRapport` | Só após vínculo acumulado (heurística de sessão) |
| `naoSabe` / `naoLembra` | Nunca como conteúdo positivo; produz resposta de desconhecimento |
| `proibido` | Nunca (não deveria sequer ser um `FatoPaciente`; serve de trava explícita) |

---

## 6. Persona (Zona do Paciente — imutável na consulta)

```ts
interface Persona {
  ansiedadeBasal: number;      // 0–10, traço estável
  expansividade: number;       // 0–10 (lacônico ↔ falante)
  escolaridade: "fundamental" | "medio" | "superior";
  letramentoSaude: "baixo" | "medio" | "alto";
  objetividade: number;        // 0–10 (divaga ↔ direto)
  estiloComunicacao: string;   // descrição curta e estável do jeito de falar
}
```
**Regra:** a Persona **nunca muda** durante a consulta. **Mapa atual →** não existe como campo (só implícito na prosa e na faixa etária pediátrica). **Estrutura nova.**

---

## 7. Session State (Zona do Paciente — mutável em runtime)

```ts
interface SessionStateSpec {
  // Valores INICIAIS de cada dimensão (0–10). O estado corrente é do runtime,
  // não do caso — o caso define apenas o ponto de partida e as faixas válidas.
  inicial: {
    ansiedade: number;
    medo: number;
    confianca: number;
    cooperacao: number;
    frustracao: number;
    dorPercebida: number;
  };
  faixaValida?: { min: number; max: number };  // default 0–10
}
```
**Regra:** muda a cada resposta em runtime (não persistido no caso). O caso só declara o **ponto inicial**. **Mapa atual →** não existe (a voz infere apenas "paciente_respondendo"). **Estrutura nova.**

---

## 8. Simulation Assets (Zona do Paciente, parte / neutra)

```ts
interface SimulationAssets {
  primeiraFala?: string;              // fala de abertura, se o formato exigir
  pausas?: string[];                  // marcadores de pausa/silêncio
  gestos?: string[];
  expressaoFacial?: string[];
  voiceProfileHints?: Record<string, string>; // pistas p/ o módulo de voz (não nomes de voz reais)
  animacoes?: string[];
}
```
**Mapa atual →** `respostas_do_paciente.inicial` (primeira fala), `voiceProfile` (voz). **Contrato:** assets são consumidos por outros módulos (voz/UI); não introduzem verdade clínica.

---

## 9. Examiner (Zona Reservada — nunca ao paciente)

```ts
interface Examiner {
  rubricas: RubricaItem[];
  checklist: ChecklistItem[];
  errosCriticos: ErroCritico[];
  feedback: FeedbackModelo;
  criteriosAprovacao: string[];
}
```
**Mapa atual →** `checklist_oculto_examinador`, `rubrica_correcao`, `feedback_modelo`, `erros_criticos`, `criterios_de_gravidade`, `feedbackDetalhado`. **Já hoje ficam fora do prompt do paciente** (confirmado na AUDITORIA 01) — o V3 apenas formaliza essa fronteira.

---

## 10. PatientRuntimeContext — a ÚNICA entrada permitida ao Prompt Base

Contrato do que o executor (prompt genérico e reutilizável) pode receber. Derivado por um **Patient Context Builder** e conferido por um **Patient Validator**.

```ts
interface PatientRuntimeContext {
  identidade: Identidade;
  persona: Persona;
  estadoAtual: SessionStateSpec["inicial"];   // snapshot corrente do Session State
  fatosAutorizados: FatoPaciente[];           // SOMENTE fatos elegíveis agora,
                                              // após aplicar DisclosurePolicy + histórico
  primeiraFala?: string;
}
```

**Proibições estruturais (contrato do Validator):** `PatientRuntimeContext` **não** contém — e não há caminho que o faça conter — `ClinicalTruth`, `Examiner`, nem qualquer `FatoPaciente` cuja política atual seja `proibido`/`naoSabe`/`naoLembra` como conteúdo positivo. O Prompt Base constrói cada resposta usando **apenas** Persona + Session State + fatos autorizados + histórico já revelado (Regra 6).

---

## 11. Regras de Ouro → onde o schema as garante

| Regra | Garantia estrutural no schema |
|---|---|
| 1. Verdade clínica nunca muda | `ClinicalTruth` é imutável e fica fora do runtime do paciente |
| 2. Nunca inventa fatos | Só `FatoPaciente` existentes são visíveis; sem fato → desconhecimento |
| 3. Nunca interpreta exames | `interpretacao` mora em `ClinicalTruth` (Zona Reservada) |
| 4. Nunca diagnostica | `diagnosticoPrincipal` mora em `ClinicalTruth` (Zona Reservada) |
| 5. Nunca oferece tratamento | `tratamentoCorreto` mora em `ClinicalTruth` (Zona Reservada) |
| 6. Resposta só de Persona+State+fatos+histórico | `PatientRuntimeContext` (Seção 10) é a única entrada |
| 7. Inexistente → "não sei/não lembro" | `natureza` do fato + políticas `naoSabe`/`naoLembra` + `default` |

---

## 12. Decisões humanas em aberto (não decididas aqui)

1. **Granularidade dos fatos** — quão atômico é um `FatoPaciente` (um sintoma = um fato? ou "dor" = um fato com subcampos?).
2. **`default` da Disclosure Policy** — sugestão `perguntaDireta`; confirmar.
3. **Heurística de `aposRapport`/`aposEmpatia`** — como o runtime decide que houve empatia/rapport (fora do schema; é regra de runtime).
4. **Transições do Session State** — o schema fixa só o valor inicial; a máquina de transição é decisão de runtime, não de caso.
5. **Compatibilidade com casos gerados dinamicamente** — se o gerador de casos passará a emitir V3 nativamente ou via camada de conversão.
6. **Estratégia de migração** dos ~60 casos atuais para V3 (entregável separado, não coberto por este contrato).

---

*Contrato de schema apenas. Nenhum código funcional foi escrito, nenhum arquivo existente foi alterado, nada foi implementado, nenhum commit, nenhum push.*
