# MEDIX PATIENT V3 — SCHEMA DO CASO (CONTRATO) · V1.1
### Revisão de simplificação · Versão definitiva para congelamento

> Revisão crítica da V1.0 com um único objetivo: **o menor contrato possível capaz de representar todos os casos do Medix**. Nenhum código funcional, nenhum TypeScript wired, nenhuma alteração de código, nenhum commit. A notação de tipos é apenas a linguagem do contrato. **Nada de runtime, Prompt Base, Context Builder ou Validator** — este documento descreve apenas o dado do caso clínico.

---

## 1. Campos que devem ser REMOVIDOS

| Item removido | Seção V1.0 | Por quê |
|---|---|---|
| **Simulation Assets (bloco inteiro)** | 8 | Não é dado clínico. `voiceProfile` **já é derivado** do caso hoje (`lib/voice/voiceProfile.ts#derivarVoiceProfile`, confirmado na AUDITORIA 01) → é derivação, não armazenamento. `gestos/expressaoFacial/animacoes/voiceProfileHints` pertencem aos módulos de Voz/Avatar/UI. `primeiraFala` é derivável dos fatos `espontanea` + Persona. Bloco não pertence ao caso. |
| **PatientRuntimeContext (bloco inteiro)** | 10 | É runtime/derivação — fora do escopo do contrato do caso. Um contexto derivado não é dado do caso. |
| **`persona.ansiedadeBasal`** | 6 | **Duplica** `sessionStateInicial.ansiedade`. A ansiedade de base é exatamente o valor inicial da dimensão de ansiedade da sessão. Guardar o mesmo número duas vezes viola Single Source of Truth. |
| **`persona.estiloComunicacao` (string livre)** | 6 | Subsumido por `expansividade` + `objetividade` + `letramentoSaude`. Campo-guarda-chuva vago que sobrepõe os demais. |
| **`persona.escolaridade`** | 6 | Vira um **fato** (`contextoSocial`) — é algo que o paciente sabe sobre si e pode declarar. Seu efeito no comportamento já é capturado por `letramentoSaude`. Não é traço separado. (ver Seção 3) |
| **`identidade.ehPediatrico`** | 4 | **Derivável** de `idade` e/ou da presença de `responsavel`. Não armazenar o que se deduz. |
| **`metadata.palavrasChave`** | 2 | Metadado de busca/administração, não de representação clínica do caso. Não é necessário para representar o caso. |
| **`sessionState.faixaValida`** | 7 | É a convenção global fixa 0–10, não dado por-caso. Convenção não vira campo. |
| **`disclosurePolicy.default`** | 5 | Convenção global (`perguntaDireta`), não dado por-caso. |
| **`RegraRevelacao.gatilhos`** e **`.prioridade`** | 5 | Servem à desambiguação de detecção/ordenação — concerns de derivação, não do contrato do caso. |
| **Política `naoSabe`** e **`naoLembra`** (enum) | 5 | Não são *timing* de revelação; são *estado de conhecimento* do fato → duplicam `FatoPaciente.natureza` (ver Seção 5 do pedido / abaixo). |
| **Política `proibido`** (enum) | 5 | Redundante: se o paciente não pode conhecer algo, esse algo **não é** `PatientKnowledge` — vive em `ClinicalTruth`. Ausência já significa "não verbalizável". |
| **`FatoPaciente.natureza` (como enum de 3 valores)** | 4 | Reduzido a um único flag `incerto?` (ver Seção 5 abaixo). `sabe` é o default implícito; `naoSabe` = fato ausente. |

## 2. Campos que devem PERMANECER

- **Metadata:** `id`, `titulo`, `especialidade`, `tema?`, `nivel`, `tipoEstacao`, `duracaoMinutos`, `versaoCaso`.
- **`schemaVersion`** (topo) — distinto de `versaoCaso` (contrato vs conteúdo). Ambos justificados.
- **Clinical Truth:** todo o bloco (zona reservada) — diagnóstico, diferenciais, cronologia verdadeira, exame físico real, sinais vitais (números), exames + interpretação, ECG, evolução, complicações, tratamento correto.
- **Patient Knowledge:** `identidade` (nome, idade, sexo, `responsavel?`) + `fatos[]`.
- **Disclosure Policy:** `regras[]` com timing.
- **Persona:** `expansividade`, `objetividade`, `letramentoSaude`.
- **Session State (inicial):** dimensões afetivas de partida.
- **Examiner:** todo o bloco (zona reservada) — rubricas, checklist, erros críticos, feedback, critérios.

## 3. Campos que devem MUDAR DE LUGAR

| Campo | De → Para | Motivo |
|---|---|---|
| `escolaridade` | `Persona` → **fato** `contextoSocial` em `PatientKnowledge` | É algo que o paciente *sabe e declara*, não um traço de comportamento. O efeito comunicacional já está em `letramentoSaude`. |
| `dorPercebida` | `SessionState` → **fato** `sintoma` em `PatientKnowledge` | Dor é sintoma (dado do paciente), não emoção. Mantê-la em dois lugares (fato + estado) duplicaria a intensidade. (Decisão de projeto reversível: se o Medix precisar de *flutuação dinâmica* de dor na sessão, ela volta ao Session State — mas por padrão é fato.) |

## 4. Responsabilidades incorretas identificadas

1. **Simulation Assets no caso** — mistura responsabilidade de apresentação (voz/avatar/UI) com dado clínico. Corrigido pela remoção.
2. **`ansiedadeBasal` na Persona vs `ansiedade` no Session State** — mesma grandeza em dois donos. Persona (imutável) deveria descrever traços; o valor de repouso da ansiedade é o ponto de partida do estado, não um traço separado.
3. **`naoSabe`/`naoLembra`/`proibido` na Disclosure Policy** — misturam *estado de conhecimento* e *ausência de conhecimento* com *timing de revelação*. São três responsabilidades diferentes coladas num só enum.
4. **`escolaridade` como traço** — confunde "fato que o paciente sabe sobre si" com "traço que molda a fala".
5. **`gatilhos`/`prioridade`/`default`** — dados que só existem para servir a lógica de derivação, indevidamente dentro do contrato do caso.

---

## 5. SCHEMA REVISADO (V1.1)

### Invariante de zona (propriedade do dado, não do runtime)
Duas zonas mutuamente exclusivas. **Zona do Paciente:** `patientKnowledge`, `disclosurePolicy`, `persona`, `sessionStateInicial`. **Zona Reservada:** `clinicalTruth`, `examiner`. `metadata` é neutra. Diagnóstico, interpretação, conduta e avaliação existem **apenas** na Zona Reservada — nunca em Patient Knowledge.

### Topo
```ts
interface CasoV3 {
  schemaVersion: "3.1";
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
    responsavel?: { nome: string; parentesco: string };  // presença ⇒ caso pediátrico
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
  valor: string;          // o DADO, em termos neutros — NUNCA uma frase pronta em 1ª pessoa
  incerto?: boolean;      // true ⇒ paciente sabe vagamente ("não lembro direito")
}
```
> **Ponto 2 (dado estruturado vs frase pronta):** `conteudo: "Tomo Losartana."` vira `valor: "Losartana 50 mg, 1x/dia, uso diário"`. Guarda-se o **dado**, não a fala pronta. **Vantagem:** Single Source of Truth (a dose existe uma vez, não pode se contradizer entre turnos) e elimina o anti-padrão de frase decorada/robótica. **Desvantagem evitada:** criar subcampos tipados por domínio (`dose`, `horario`, `adesao`, `localizacao`, `irradiacao`, `caracter`…) explodiria o schema por domínio — isso é overengineering. Solução mínima: um `valor` neutro em texto, sem estrutura por-domínio.

### Disclosure Policy (zona do paciente)
```ts
type PoliticaRevelacao =
  | "espontanea"      // pode surgir sem gatilho
  | "perguntaAberta"  // sai em pergunta ampla
  | "perguntaDireta"  // só com pergunta específica  (default de convenção p/ fatos sem regra)
  | "sensivel";       // só após abertura relacional (fundiu aposEmpatia + aposRapport)

interface DisclosurePolicy {
  regras: { factId: string; politica: PoliticaRevelacao }[];
}
```
> **Ponto 4 (8 → 4 políticas):** removidas `naoSabe`/`naoLembra` (são estado de conhecimento, hoje em `incerto?`/ausência), removida `proibido` (ausência do fato já significa isso), e fundidas `aposEmpatia` + `aposRapport` numa única `sensivel` (ambas = "revelar só após abertura relacional"; o Medix não precisa distinguir os dois gatilhos no contrato).

### Persona (zona do paciente — imutável)
```ts
interface Persona {
  expansividade: number;    // 0–10 (lacônico ↔ falante)
  objetividade: number;     // 0–10 (divaga ↔ direto)
  letramentoSaude: "baixo" | "medio" | "alto";
}
```
> **Ponto 3 (dividir Persona / Communication Profile?):** **não dividir** — criar "Communication Profile" seria um conceito novo, contra as regras. Em vez disso, a Persona foi *enxugada* a 3 traços estáveis que de fato moldam a fala. `ansiedadeBasal` saiu (duplicava o estado inicial), `estiloComunicacao` saiu (vago/sobreposto), `escolaridade` virou fato.

### Session State inicial (zona do paciente — valores de partida)
```ts
interface SessionStateInicial {
  ansiedade: number;    // 0–10
  medo: number;
  confianca: number;
  cooperacao: number;
  frustracao: number;
}
```
> Só valores **iniciais**. A mudança dessas dimensões durante a consulta é derivação (fora do contrato). `dorPercebida` saiu (virou fato `sintoma`).

### Examiner (zona reservada)
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

## 6. Explicação das mudanças (respostas aos pontos específicos)

**1. Simulation Assets pertence ao caso?** Não. Removido. `voiceProfile` já é *derivado* do caso hoje; gestos/expressão/animações/voz são de Voz/Avatar/UI; `primeiraFala` é derivável dos fatos `espontanea`. Nenhum é dado clínico.

**2. Frase pronta vs dado estruturado?** Guardar o **dado neutro** (`valor`), não a frase em 1ª pessoa, e **não** explodir em subcampos por domínio. Ganha-se SSoT e perde-se o efeito "decorado"; evita-se o overengineering de tipar cada domínio.

**3. Dividir Persona?** Não dividir (evitar conceito novo). Persona enxugada para 3 traços; escolaridade→fato; ansiedadeBasal→removido (dup); estiloComunicacao→removido (vago).

**4. 8 políticas são necessárias?** Não. Reduzidas a **4**: `espontanea`, `perguntaAberta`, `perguntaDireta`, `sensivel`. As demais eram estado de conhecimento (→`incerto?`/ausência) ou fusíveis.

**5. `natureza` duplica a Disclosure Policy?** **Sim, a duplicação existia** — `natureza:"naoSabe"|"naoLembra"` cobria o mesmo que as políticas `naoSabe`/`naoLembra`. Resolvido colocando o *estado de conhecimento* em **um só lugar**: a Disclosure Policy volta a ser **puro timing**, e a incerteza epistêmica fica num único flag `incerto?` no fato. Fatos totalmente desconhecidos simplesmente **não existem** em Patient Knowledge.

**6. Falta um "Patient View" entre Clinical Truth e Runtime Context?** **Não** — e o Runtime Context nem pertence a este contrato. A separação **Clinical Truth (reservada) × Patient Knowledge (do paciente)** já é a fronteira completa **no nível do dado**. Uma "view"/projeção é derivação, e derivação não se armazena → não é parte de um contrato de dados. Adicionar uma camada intermediária seria estrutura sem dado próprio (overengineering). Portanto: nenhuma camada nova; a fronteira de zona basta.

**7. Outros campos redundantes?** Listados na Seção 1: `ehPediatrico` (derivável de idade/responsável), `palavrasChave` (metadado de busca), `faixaValida` (convenção 0–10), `default`/`gatilhos`/`prioridade` da política (derivação), `ansiedadeBasal` (dup do estado inicial).

---

### Resumo quantitativo
- Blocos de topo: **8 → 7** (removido Simulation Assets; PatientRuntimeContext nunca foi dado de caso).
- Políticas de revelação: **8 → 4**.
- Campos da Persona: **6 → 3**.
- Dimensões de Session State: **6 → 5**.
- Duplicações eliminadas: `natureza`×política, `ansiedadeBasal`×estado inicial, e os três pares de dados clínicos herdados do caso atual (respostas/respostaPaciente; sinais_vitais/sinaisVitaisCorretos; três fontes de exames) permanecem alvo de SSoT na migração.

---

**O schema está maduro para congelamento.**
