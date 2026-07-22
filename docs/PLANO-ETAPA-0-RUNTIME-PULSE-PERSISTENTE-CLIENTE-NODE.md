# ETAPA 0 — Plano definitivo do runtime Pulse persistente e cliente Node

**Data:** 2026-07-19

**Repositório:** `/Users/marceloalmeida/Projetos/mini-consultorio-osce`

**Escopo:** planejamento somente; nenhum runtime foi implementado nesta etapa.

**Primeiro marco:** um processo Python, uma instância `PulseEngine`, um paciente, vários avanços temporais, snapshots estruturados e encerramento seguro.

## 1. Decisão executiva

O primeiro marco deve ser construído como uma biblioteca server-side isolada, sem ligação com a rota Next, a UI ou o provider dos casos:

```text
teste de integração / futuro adapter MEDIX
  → PulsePersistentClient (Node, uma instância)
  → um child_process Python não detached
  → NDJSON por stdin/stdout
  → pulse_persistent_runtime.py
  → uma instância PulseEngine
  → um paciente programático + AsthmaAttack 0,75
  → pull_data() em memória
  → snapshots estritos
```

A unidade de isolamento será **um processo Python por sessão Pulse**. O processo poderá receber vários comandos, mas só poderá inicializar um engine/paciente durante sua vida. Isso é menor e mais seguro que criar, já no primeiro marco, um daemon multiusuário, socket, servidor HTTP, pool de engines ou registry global no Next.

O protocolo será **NDJSON versionado sobre stdin/stdout**. Cada linha é uma mensagem JSON completa. `stdout` ficará reservado ao protocolo; diagnósticos irão para `stderr` e o log do Pulse ficará em diretório temporário privado da sessão. Não haverá CSV no caminho crítico: o runtime mapeará diretamente o array retornado por `PulseEngine.pull_data()`.

O primeiro marco não substituirá `medix-rule-based`, não alterará `PULSE_EXECUTION_ENABLED`, não mudará `/api/pulse/simulate` e não alimentará `PatientState`. Ele provará apenas a fronteira de processo e a continuidade fisiológica. A integração clínica será um marco posterior.

## 2. Documentos obrigatórios

| Documento procurado | Resultado |
|---|---|
| `docs/RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md` | localizado e lido integralmente (593 linhas) |
| `RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md` | não existe na raiz; a versão em `docs/` é a única |
| `docs/RELATORIO-BASE-INTEGRACAO-PULSE-MEDIX-CASO-OURO-ASMA.md` | **não encontrado** |
| `RELATORIO-BASE-INTEGRACAO-PULSE-MEDIX-CASO-OURO-ASMA.md` | **não encontrado** |

A ausência do relatório-base impede confrontar suas decisões textuais específicas. O plano prossegue com o relatório completo e evidência direta no código, como autorizado. Como evidência histórica complementar — não substituta do documento ausente — foram consultados integralmente:

- `RELATORIO-CASOS-DINAMICOS-BETA-FASE8-PULSE-ASMA-REAL-LOCAL.md`;
- `RELATORIO-CASOS-DINAMICOS-BETA-FASE9-PYPULSE-BUILD-LOCAL.md`.

O relatório Fase 8 está superado quanto à ausência do PyPulse. O Fase 9 registra o build funcional e modificações locais do motor/substâncias; essas modificações foram confirmadas na árvore atual.

## 3. Estado atual confirmado

### 3.1 Fluxo executável atual

```text
POST /api/pulse/simulate
  → runPulseLocalAsthmaSimulation()
  → spawn de pulse_asthma_runner.py
  → cria PulseEngine e paciente
  → aplica AsthmaAttack
  → avança uma única duração
  → grava CSV
  → processo termina
  → Node lê somente a última linha
  → normalizer aplica fallbacks
  → bridge cria PatientState derivado
```

Evidências:

- spawn por execução: `lib/dynamic-osce/pulse-local/pulse-local-runner.ts:137-161,247-280`;
- criação do engine/paciente: `lib/dynamic-osce/pulse-local/pulse_asthma_runner.py:97-110`;
- ação e avanço único: `pulse_asthma_runner.py:141-148`;
- término explícito: `pulse_asthma_runner.py:169-170`;
- última linha do CSV: `lib/dynamic-osce/pulse/pulse-real-output-reader.ts:9-11,161-205`;
- rota somente asma: `app/api/pulse/simulate/route.ts:27-69`;
- painel comparativo sem alterar o fluxo: `components/dynamic-osce/PulseLocalExperimentPanel.tsx:5-8,233-235`.

O comentário “Script Python persistente” em `pulse_asthma_runner.py:5` está incorreto. O processo recebe argumentos, executa uma vez e encerra.

### 3.2 Recursos existentes que devem ser reaproveitados

- PyPulse 4.3.2/hash curto `bb72983`, ARM64/Python 3.9:
  - `.reference-local/engine-stable/build/install/lib/PyPulse.cpython-39-darwin.so`;
  - `.reference-local/engine-stable/build/install/python/pulse/`.
- Wrapper `PulseEngine`:
  - inicialização em `.reference-local/engine-stable/src/python/pulse/engine/PulseEngine.py:124-133`;
  - avanço repetível em `:153-182`;
  - snapshot em memória em `:160-185`;
  - `clear()` em `:53-54`.
- Caso piloto e metadados: `lib/dynamic-osce/cases/piloto-asma-grave-adulto.ts`.
- Contrato conceitual de sessão: `lib/dynamic-osce/pulse/pulse-adapter.contract.ts:25-72`.
- Build local historicamente validado: `RELATORIO-CASOS-DINAMICOS-BETA-FASE9-PYPULSE-BUILD-LOCAL.md`.

### 3.3 Proteções que permanecem inalteradas

- `PULSE_EXECUTION_ENABLED=false`: `pulse-adapter.contract.ts:9-10`;
- provider do caso ouro continua `medix-rule-based`: `piloto-asma-grave-adulto.ts:177-200`;
- UI principal continua no motor de regras;
- rota e painel experimentais atuais continuam funcionais e independentes;
- normalizer/bridge existentes não são removidos nem modificados no marco 1.

## 4. Confronto entre relatório e código

| Afirmação/tema | Código atual | Veredito |
|---|---|---|
| Processo Python não é persistente | um `spawn` por chamada e `sys.exit(0)` | confirmado |
| Sessão/estado não sobrevivem entre POSTs | engine é variável local do script | confirmado |
| Runner lê somente snapshot final | reader escolhe última linha | confirmado |
| Fallback é recomendado, não executado | resposta contém `fallbackRecommended`; não chama rule engine | confirmado |
| Health check não testa engine | GET retorna constante `pulse-local-route-ready` | confirmado |
| Temporários não são removidos | CSV e log são criados; cleanup não encontrado | confirmado |
| Temperatura Pulse não é solicitada | requests não incluem temperatura; normalizer injeta 37,0 | confirmado |
| Tidal/EtCO2 são solicitados e descartados | runner pede ambos; reader não os mapeia | confirmado |
| Adapter real não existe | interface/stub lança; flag false | confirmado |
| PyPulse existe localmente | artefatos em `build/install`; Fase 9 registra execução | confirmado atualmente; Fase 8 está obsoleta |
| Pacientes/estados em arquivo faltam | cenário referencia `StandardMale.json`, ausente | confirmado; paciente programático contorna o bloqueio |
| Build é upstream reproduzível | há patches em `GastrointestinalModel.cpp` e substâncias | **não confirmado**; build local é customizado |
| Arquivo de cenário é executado pelo runner | runner nunca abre `pulseScenarioId` | falso |
| Paciente Pulse representa Marcos Andrade | caso: 34 anos/78 kg; runner: 44 anos/77 kg/177 cm | falso |
| `process_action` confirma aceitação | wrapper Python não retorna o resultado nativo | falso; sucesso da ação só pode ser inferido por ausência de exceção/efeito posterior |
| `advance_time_s` é validado | runner ignora o bool retornado | falso; marco 1 deve validar |
| Python instalado e wrappers são a mesma árvore | `setup_pulse_path` insere `src/python` na frente ao final | não garantido; pode misturar wrapper fonte e binding instalado |
| Discovery local comprova PyPulse do engine | procura apenas libs do sistema/home e a varredura ignora `build/` | falso; não usar como health do runtime |
| Scripts `npx tsx` usam dependência local | `tsx` não está em `package.json` nem `node_modules/.bin` | falso; `npx` pode tentar download |

## 5. Divergências novas que alteram o plano

### 5.1 O cenário declarado não equivale à simulação atual

`.reference-local/engine-stable/data/human/adult/scenarios/patient/AsthmaAttackSevereAcute.json:4-55`:

1. carrega `StandardMale.json`;
2. avança 30 s;
3. aplica asma 0,75;
4. avança 550 s;
5. desativa a ação;
6. avança mais 200 s.

O runner atual cria paciente programático, aplica asma imediatamente, avança 580 s e não desativa a ação. Portanto, o marco 1 usará uma **configuração explícita de sessão**, não o arquivo de cenário, e não alegará equivalência com `AsthmaAttackSevereAcute.json`.

### 5.2 O paciente do teste não é o paciente do caso MEDIX

Caso: Marcos Andrade, 34 anos, 78 kg, altura não informada (`piloto-asma-grave-adulto.ts:49-59`). Runner: `AsthmaPatientFase10`, 44 anos, 77 kg, 177 cm (`pulse_asthma_runner.py:103-110`).

O marco 1 manterá a antropometria historicamente comprovada do runner como uma **fixture técnica de persistência**, identificada como tal. Alinhar o paciente ao caso ouro exige antes definir uma altura clínica e recalibrar o estado; fica fora do marco 1. Isso evita inventar dado clínico.

### 5.3 O build local contém correções não upstream confirmadas

Foram confirmados:

- `GastrointestinalModel.cpp:97`: alocação de conteúdo gástrico;
- `GastrointestinalModel.cpp:228`: null guard;
- `substances/Glucose.json:20-38`: regulação/transport maximum.

O runtime deve publicar versão/hash/caminhos no `hello` e o teste deve registrá-los. Não deve chamar esse build de “upstream puro”.

### 5.4 O contrato conceitual existente não é o contrato de transporte

`PulseAdapter` modela operações clínicas futuras, mas não define versão de protocolo, PID, processo, correlation id, framing, timeout, backpressure, crash, schema de erro ou identidade da instância. Além disso, seus tempos estão em minutos enquanto o Pulse avança em segundos.

Decisão: não modificar nem implementar diretamente `PulseAdapter` no marco 1. Criar um contrato de transporte interno em segundos. Um adapter MEDIX poderá envolvê-lo no marco seguinte.

## 6. Escopo fechado do primeiro marco

### Incluído

- um processo Python longo;
- uma instância de `PulseEngine`;
- um paciente programático imutável;
- uma ação inicial `SEAsthmaAttack(severity=0.75)`;
- comandos `hello`, `initialize`, `snapshot`, `advance`, `shutdown`;
- três ou mais avanços no mesmo engine;
- snapshots sem CSV e sem fallback;
- cliente Node dono do processo;
- timeout fatal, detecção de crash e encerramento escalonado;
- teste de integração real e determinístico do lifecycle.

### Excluído

- rota HTTP/Next e UI;
- registry de sessões e múltiplos pacientes;
- pool/multithreading;
- ações terapêuticas após o início;
- execução/parsing do arquivo de cenário;
- conversão para `PatientState`;
- fallbacks clínicos;
- streaming de waveforms/eventos;
- persistência em disco/restauração;
- provider `pulse`/`hybrid`;
- produção, containers, Linux e WASM;
- DPOC, pneumonia, pneumotórax e pediatria.

## 7. Invariantes obrigatórios

1. Uma instância `PulsePersistentClient` possui exatamente um child process.
2. Um child process aceita no máximo um `initialize`.
3. Uma sessão possui exatamente uma instância `PulseEngine`.
4. `sessionId`, `runtimePid`, `engineInstanceId`, `patientId` e `patientProfileHash` permanecem iguais em todos os snapshots.
5. `simulationTime_s` vem de `pull_data()[0]`, nunca de contador Node.
6. O tempo é monotônico e só aumenta após `advance`.
7. Só há uma operação Pulse em execução por processo; chamadas Node concorrentes entram em FIFO.
8. Nenhum valor fisiológico ausente é preenchido com fallback.
9. Qualquer valor ausente, array com comprimento inesperado, NaN ou infinito gera erro.
10. Timeout/crash torna a sessão não reutilizável; não há restart transparente.
11. `stdout` contém apenas NDJSON do protocolo.
12. `shutdown` é idempotente no cliente e termina o processo.
13. Fechamento de stdin/EOF encerra o runtime, evitando órfão quando o Node morre.
14. Nenhum CSV é criado.
15. O marco não altera provider, rota ou estado da UI.

## 8. Arquitetura do marco 1

```text
PulsePersistentClient (Node)
│
├── valida configuração/caminhos
├── cria diretório temporário da sessão
├── spawn(Python 3.9, [runtime.py], shell=false, detached=false)
├── stdin  ── NDJSON requests ───────────────────────┐
├── stdout ◀─ NDJSON responses ──────────────────────┤
├── stderr ◀─ ring buffer diagnóstico                │
└── lifecycle/timeout/kill                           │
                                                     ▼
pulse_persistent_runtime.py
│
├── loop síncrono linha a linha
├── estado: idle | active | closing
├── uma instância PulseEngine
├── REQUEST_SPEC ordenado
├── paciente fixture técnica
└── pull_data() → PulseRuntimeSnapshot
```

Não haverá servidor TCP/HTTP/Unix socket. O pipe já fornece isolamento local, herda a vida do processo pai, não abre porta e elimina autenticação no primeiro marco.

## 9. Protocolo NDJSON v1

### 9.1 Envelope de request

```json
{
  "protocol": "medix-pulse-runtime/1",
  "requestId": "uuid",
  "command": "hello",
  "payload": {}
}
```

Campos obrigatórios:

| Campo | Regra |
|---|---|
| `protocol` | literal `medix-pulse-runtime/1` |
| `requestId` | string não vazia, única entre requests pendentes |
| `command` | enum fechado |
| `payload` | objeto; schema depende do comando |

### 9.2 Envelope de sucesso

```json
{
  "protocol": "medix-pulse-runtime/1",
  "requestId": "uuid",
  "ok": true,
  "result": {}
}
```

### 9.3 Envelope de erro

```json
{
  "protocol": "medix-pulse-runtime/1",
  "requestId": "uuid",
  "ok": false,
  "error": {
    "code": "INVALID_STATE",
    "message": "advance exige sessão active",
    "recoverable": true
  }
}
```

`details` poderá existir apenas com metadados não sensíveis. Traceback e paths locais completos não irão ao payload; ficam em `stderr`.

### 9.4 Comandos

| Comando | Estado permitido | Efeito | Resultado |
|---|---|---|---|
| `hello` | idle/active | nenhum | versão, PID, Python, Pulse, estado |
| `initialize` | idle | cria engine/paciente, aplica asma uma vez | sessão + snapshot t≈0 |
| `snapshot` | active | `pull_data()`, sem avanço | snapshot |
| `advance` | active | avança N segundos no mesmo engine | snapshot posterior |
| `shutdown` | idle/active | clear, ack, fecha loop | status terminated |

Nenhuma mensagem espontânea será emitida no v1. Isso mantém o parser simples. Eventos e streaming ficam fora do marco.

### 9.5 Códigos mínimos de erro

- `INVALID_JSON`;
- `PROTOCOL_VERSION_MISMATCH`;
- `UNKNOWN_COMMAND`;
- `VALIDATION_ERROR`;
- `INVALID_STATE`;
- `SESSION_ALREADY_INITIALIZED`;
- `SESSION_ID_MISMATCH`;
- `ENGINE_IMPORT_FAILED`;
- `ENGINE_INITIALIZATION_FAILED`;
- `ENGINE_ADVANCE_FAILED`;
- `ENGINE_SNAPSHOT_INVALID`;
- `INTERNAL_ERROR`;
- `SHUTTING_DOWN`.

Erros de validação/ordem são recuperáveis. Falhas de import, init, advance, snapshot ou erro interno do engine são fatais: o Python responde quando possível e encerra; o cliente marca `failed`.

### 9.6 Limites

- tamanho máximo por linha: 1 MiB;
- `advance.seconds`: número finito, maior que 0 e no máximo 600 por comando;
- severidade: finita e no intervalo [0,1];
- nenhum campo extra é aceito nos payloads do v1;
- um request por vez no runtime; Node serializa em FIFO;
- o Python não cria threads.

## 10. Inicialização da sessão

Request:

```json
{
  "protocol": "medix-pulse-runtime/1",
  "requestId": "uuid",
  "command": "initialize",
  "payload": {
    "sessionId": "uuid",
    "model": "HumanAdultWholeBody",
    "patient": {
      "patientId": "pulse-persistence-smoke-adult-001",
      "name": "PulsePersistenceSmokeAdult",
      "sex": "Male",
      "age_yr": 44,
      "weight_kg": 77,
      "height_cm": 177
    },
    "condition": {
      "type": "AsthmaAttack",
      "severity": 0.75
    }
  }
}
```

Essa fixture reproduz a antropometria comprovada pelo runner atual. Ela não é Marcos Andrade e não será apresentada como paciente clínico MEDIX.

Sequência Python obrigatória:

1. validar estado/payload;
2. instanciar `PulseEngine(data_root_dir=engine_root + "/")`;
3. desabilitar log no console;
4. apontar log para o diretório temporário da sessão;
5. construir `SEPatientConfiguration`;
6. construir `SEDataRequestManager` sem `results_filename`;
7. chamar e validar `initialize_engine(...) is True`;
8. criar `SEAsthmaAttack` e definir severidade;
9. chamar `process_action` uma única vez;
10. criar `engineInstanceId` imutável;
11. produzir snapshot;
12. mudar estado para `active`.

Limitação conhecida: `PulseEngine.process_action` e `process_actions` não propagam o bool do binding (`PulseEngine.py:206-219`). O marco 1 considera a ação aceita se não houver exceção e o engine continuar avançando com snapshots válidos. Não será usado acesso a membro privado do wrapper.

## 11. Contrato do snapshot

```json
{
  "sessionId": "uuid",
  "sequence": 3,
  "runtimePid": 12345,
  "engineInstanceId": "uuid",
  "patientId": "pulse-persistence-smoke-adult-001",
  "patientProfileHash": "sha256-canônico",
  "simulationTime_s": 120.0,
  "engine": {
    "pulseVersion": "4.3.2",
    "pulseHash": "bb72983",
    "timeStep_s": 0.02,
    "model": "HumanAdultWholeBody"
  },
  "vitals": {
    "heartRate_per_min": 74.1,
    "systolicArterialPressure_mmHg": 114.5,
    "diastolicArterialPressure_mmHg": 75.0,
    "respirationRate_per_min": 18.8,
    "oxygenSaturation_fraction": 0.949,
    "coreTemperature_degC": 37.0
  },
  "respiratory": {
    "tidalVolume_mL": 310.0,
    "endTidalCarbonDioxideFraction": 0.052
  }
}
```

Os números do exemplo são ilustrativos; o teste não deve exigir esses valores exatos.

### 11.1 DataRequests ordenadas

A constante Python `REQUEST_SPEC` será a única fonte para criar requests e mapear o vetor:

1. `HeartRate` — `1/min`;
2. `SystolicArterialPressure` — `mmHg`;
3. `DiastolicArterialPressure` — `mmHg`;
4. `RespirationRate` — `1/min`;
5. `OxygenSaturation` — unitless/fração;
6. `CoreTemperature` — `degC`;
7. `TidalVolume` — `mL`;
8. `EndTidalCarbonDioxideFraction` — unitless.

`pull_data()[0]` é tempo; índices 1–8 seguem a ordem acima. Antes de emitir, o runtime exige comprimento 9 e todos os valores finitos.

### 11.2 Sem normalizer ou fallback

O runtime não chama `normalizePulseOutputs`, pois esse módulo injeta 80 bpm, 16 irpm, 95%, 120/75 e 37 °C quando faltam dados (`pulse-output-normalizer.ts:62-115`). No marco 1, ausência é falha observável.

A transformação de fração de SpO₂ para percentual será responsabilidade do futuro adapter clínico. O contrato v1 mantém `oxygenSaturation_fraction` para preservar a unidade nativa sem ambiguidade.

### 11.3 Prova de identidade

`patientProfileHash` será SHA-256 do UTF-8 de JSON com chaves em ordem lexicográfica, sem espaços e separadores `,`/`:`; Python usa `json.dumps(..., sort_keys=True, separators=(",", ":"), ensure_ascii=False)` e Node reproduz a mesma canonicalização. `engineInstanceId` é criado somente após init. Juntos com PID/session/time, esses campos detectam reinitialização acidental.

## 12. Cliente Node

API mínima proposta:

```ts
class PulsePersistentClient {
  start(): Promise<PulseRuntimeHello>;
  initialize(config: PulseInitializeRequest): Promise<PulseRuntimeSnapshot>;
  snapshot(): Promise<PulseRuntimeSnapshot>;
  advance(seconds: number): Promise<PulseRuntimeSnapshot>;
  close(): Promise<void>;
  get state(): "new" | "spawning" | "idle" | "active" | "closing" | "closed" | "failed";
}
```

### 12.1 Responsabilidades

- resolver os paths por opção explícita/env/default;
- executar preflight antes do spawn;
- usar `spawn` com `shell:false`, `detached:false`, stdio pipes e `cwd=<engine>/bin`;
- criar `requestId` com `crypto.randomUUID()`;
- enquadrar/parser NDJSON por linha;
- validar manualmente envelopes e snapshots, sem dependência nova;
- manter fila FIFO e no máximo uma operação Pulse ativa;
- respeitar backpressure de stdin;
- manter ring buffer limitado de stderr;
- correlacionar respostas;
- rejeitar promises pendentes em crash;
- marcar fatal/timeout como `failed`;
- executar encerramento escalonado e cleanup do diretório temporário.

### 12.2 Resolução de ambiente

Ordem:

1. opções do construtor;
2. `PULSE_PYTHON_BIN` e `PULSE_ENGINE_ROOT`;
3. defaults locais atuais.

Default Python:

`/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/bin/python3.9`

Default root:

`<repo>/.reference-local/engine-stable`

O ambiente do child incluirá:

- `PYTHONUNBUFFERED=1`;
- `PYTHONDONTWRITEBYTECODE=1`;
- `PYTHONNOUSERSITE=1`;
- `PULSE_ENGINE_ROOT`;
- `PULSE_RUNTIME_DIR`;
- `PYTHONPATH=<engine>/build/install/lib:<engine>/build/install/python`.

`src/python` não será incluído. Isso evita que o wrapper fonte sombreie o wrapper instalado e se desalinhe do binding nativo.

### 12.3 Preflight

Falhar antes do spawn se faltar:

- Python 3.9 executável;
- engine root;
- `build/install/lib/PyPulse.cpython-39-darwin.so`;
- `build/install/python/pulse/engine/PulseEngine.py`;
- `bin/PulseConfiguration.json`;
- `config/DynamicStabilization.json`;
- diretórios `substances/`, `environments/`, `ecg/`.

O `hello` confirma import, versão/hash, PID, Python e estado do runtime. O timestep só é conhecido/publicado depois que o objeto engine é criado no `initialize`. Um arquivo existente não basta para health.

### 12.4 Compatibilidade com Next

O cliente é Node-only. Ele não deve ser importado por componente client. No marco 1 será chamado exclusivamente pelo teste de integração. Uma rota Next não é prova adequada de persistência porque a vida do processo servidor depende do ambiente de execução/deployment. Wiring HTTP e registry ficam para o marco seguinte, depois que a fronteira de processo estiver validada.

## 13. Runtime Python

### 13.1 Estado interno

```text
boot
  → idle
      ├─ hello ───────────────→ idle
      ├─ initialize sucesso ──→ active
      └─ shutdown ────────────→ closing → exit 0

active
  ├─ hello/snapshot ──────────→ active
  ├─ advance sucesso ─────────→ active
  ├─ initialize ──────────────→ erro recuperável, active
  └─ shutdown ────────────────→ clear → ack → exit 0

qualquer falha fatal
  → resposta de erro se possível → clear → exit não zero
```

### 13.2 Loop

O runtime será síncrono e bloqueará lendo `sys.stdin`. Para cada linha:

1. limitar tamanho;
2. parsear JSON;
3. validar envelope/protocolo;
4. despachar conforme estado;
5. emitir exatamente uma resposta JSON em uma linha;
6. `flush=True`.

EOF chama cleanup e encerra. `SIGINT`/`SIGTERM` acionam uma flag/cleanup sem escrever protocolo inconsistente.

### 13.3 Snapshot em memória

Não configurar `SEDataRequestManager.results_filename`. Depois de init/advance:

- chamar `eng.pull_data()`;
- copiar valores para tipos Python nativos;
- validar comprimento/finite;
- usar tempo do índice 0;
- incrementar `sequence`;
- emitir o objeto estruturado.

Isso elimina o custo de 29.001 linhas/2,2 MB observado na simulação histórica de 580 s e remove a necessidade do reader CSV no caminho persistente.

### 13.4 Validação de avanço

`advance_time_s(seconds)` retorna bool (`PulseEngine.py:172-182`). O runtime deve exigir `True`. Em `False`, responder `ENGINE_ADVANCE_FAILED`, marcar a sessão fatal e encerrar. O código atual ignora esse retorno.

### 13.5 Imports e logs

Imports de PyPulse acontecem uma vez no boot. `hello` só responde após import bem-sucedido. O Pulse terá `log_to_console(False)`; seu log irá a `PULSE_RUNTIME_DIR/pulse-engine.log`. Nenhum `print` de depuração será permitido em stdout. Exceções inesperadas usam traceback em stderr e erro sanitizado no protocolo.

## 14. Encerramento e falhas

### 14.1 Encerramento normal

1. Node muda para `closing`;
2. deixa terminar o request já em voo ou rejeita novas chamadas;
3. envia `shutdown`;
4. Python chama `eng.clear()`, remove referências, responde `terminated`, fecha;
5. Node aguarda exit code 0;
6. fecha readline/pipes;
7. remove somente o diretório temporário exato criado para a sessão;
8. muda para `closed`.

`close()` repetido retorna sem erro.

### 14.2 Escalonamento

Se o ack/exit não ocorrer:

1. timeout de shutdown: 5 s;
2. enviar `SIGTERM` e aguardar 2 s;
3. usar `SIGKILL` como último recurso;
4. marcar fechamento forçado nos diagnósticos.

O client nunca usa glob, path amplo ou variável não resolvida para cleanup.

### 14.3 Timeout de request

- Timeout de `initialize`: 60 s inicialmente, configurável.
- Timeout de `advance`: 30 s para até 600 s simulados, configurável.
- Timeout de `hello/snapshot`: 5 s.

Após timeout, não basta rejeitar a promise: o estado fisiológico pode ter avançado sem que o Node saiba. Portanto:

- marcar cliente `failed`;
- rejeitar todos os requests pendentes;
- terminar o child;
- não reiniciar automaticamente.

### 14.4 Crash/EOF/protocolo quebrado

- exit inesperado rejeita pendências com code, signal e últimas linhas limitadas de stderr;
- resposta sem request pendente ou protocolo incompatível é fatal;
- JSON inválido emitido pelo runtime é fatal no Node;
- request inválido enviado pelo caller é rejeitado antes de chegar ao Python;
- restart só é explícito e cria **nova sessão/paciente**, nunca continuação silenciosa.

### 14.5 Fallback

O cliente de baixo nível nunca cai para `medix-rule-based`. Fallback é decisão do futuro adapter/orquestrador. Um fallback silencioso violaria a garantia “mesmo paciente/sessão”.

## 15. Arquivos do marco 1

Todos são futuros; **nenhum foi criado nesta etapa**.

| Arquivo | Ação futura | Responsabilidade |
|---|---|---|
| `lib/dynamic-osce/pulse-runtime/protocol.ts` | criar | tipos v1, enums, validators, snapshot |
| `lib/dynamic-osce/pulse-runtime/pulse-persistent-client.ts` | criar | spawn, fila, NDJSON, lifecycle, timeout |
| `lib/dynamic-osce/pulse-runtime/pulse_persistent_runtime.py` | criar | loop Python, engine único, snapshot |
| `lib/dynamic-osce/pulse-runtime/index.ts` | criar | exports server-side da camada |
| `lib/dynamic-osce/pulse-runtime/__tests__/pulse-persistent-runtime.integration.test.mts` | criar | prova real do marco |

Não modificar no marco 1:

- `pulse_asthma_runner.py`;
- `pulse-local-runner.ts`;
- `app/api/pulse/simulate/route.ts`;
- `PulseLocalExperimentPanel.tsx`;
- `pulse-adapter.contract.ts`;
- `pulse-output-normalizer.ts`;
- `pulse-medix-bridge.ts`;
- casos/providers/UI;
- `package.json`, lockfile ou configurações.

Essa separação permite rollback removendo somente `lib/dynamic-osce/pulse-runtime/`.

## 16. Ordem de implementação executável

### Passo 1 — congelar protocolo

Criar `protocol.ts` com unions discriminadas e validadores manuais. Aceite: TypeScript estrito; request/response/snapshot inválidos são rejeitados; nenhuma dependência.

### Passo 2 — runtime Python

Implementar loop, preflight de import, state machine, init, request spec, snapshot, advance e shutdown. Aceite leve: com input inválido/hello sem engine, framing e erros funcionam sem iniciar fisiologia. Não implementar ações terapêuticas.

### Passo 3 — cliente Node

Implementar spawn seguro, parser, request map/FIFO, state machine, timeout/crash e close. Aceite: `start()` só resolve após `hello` válido; nenhum stdout não protocolar é tolerado.

### Passo 4 — integração real

Criar o teste com um processo/engine/paciente e avanços 60+60+60 s. Aceite: todas as identidades constantes, tempo cumulativo, valores finitos, close/exit 0.

### Passo 5 — verificações

Executar, nessa ordem:

```sh
./node_modules/.bin/tsc --noEmit
node --test lib/dynamic-osce/pulse-runtime/__tests__/pulse-persistent-runtime.integration.test.mts
git diff --check
git status --short
```

Node local é v26.0.0 e executa TypeScript erasable em `.mts`; assim não é necessário instalar `tsx`. O teste deve ser marcado como integração local Pulse e falhar claramente se os pré-requisitos não existirem — nunca “passar por fallback”.

## 17. Teste de integração do marco

Fluxo obrigatório em `try/finally`:

1. criar client;
2. `start()`;
3. registrar `hello`;
4. `initialize(fixture)`;
5. guardar snapshot S0;
6. `snapshot()` e confirmar tempo inalterado;
7. `advance(60)` → S1;
8. `advance(60)` → S2;
9. `advance(60)` → S3;
10. confirmar invariantes;
11. tentar segundo `initialize` e esperar `SESSION_ALREADY_INITIALIZED` sem matar sessão;
12. obter outro snapshot e provar que a sessão continua;
13. `close()`;
14. provar exit 0 e estado `closed`;
15. no `finally`, chamar `close()` novamente.

Não testar valores clínicos exatos. Os números dependem do engine/build. Testar:

- finitude;
- faixas físicas amplas;
- monotonicidade temporal;
- identidade e continuidade;
- nenhum fallback;
- nenhum reinitialize;
- encerramento.

Tolerância de tempo: diferença esperada ± um timestep reportado, com teto de 0,05 s.

## 18. Critérios de aceite definitivos

O marco passa somente se todos forem verdadeiros:

| ID | Critério |
|---|---|
| A01 | exatamente um PID Python entre start e close |
| A02 | exatamente um `engineInstanceId` |
| A03 | `sessionId`, patient id/hash invariáveis |
| A04 | S0/Snapshot inicial têm mesmo tempo |
| A05 | tempos após avanços são cumulativos ≈ 60, 120, 180 s |
| A06 | cada snapshot tem todos os oito measurements finitos |
| A07 | `oxygenSaturation_fraction` fica em [0,1] |
| A08 | FC/FR/PA/tidal/temperatura são positivos e dentro de limites físicos amplos definidos no teste |
| A09 | nenhum `usedFallbacks` existe no protocolo |
| A10 | segundo init falha sem criar outro engine |
| A11 | request após erro recuperável ainda funciona |
| A12 | `advance_time_s` False falharia o marco; sucesso é verificado |
| A13 | shutdown recebe ack e child sai code 0 |
| A14 | `close()` é idempotente |
| A15 | chamada após close falha localmente |
| A16 | nenhum CSV é criado |
| A17 | diretório temporário da sessão é removido após close |
| A18 | provider, flag, rota, UI e casos permanecem byte-idênticos |
| A19 | TypeScript passa sem emit |
| A20 | teste não aceita fallback e não baixa/instala nada |

## 19. Critérios de rejeição

O marco falha se:

- novo processo for criado a cada avanço;
- engine for reinicializado entre snapshots;
- Node calcular tempo em vez de usar o engine;
- CSV continuar sendo a interface entre processos;
- stdout misturar logs e protocolo;
- timeout permitir continuar uma sessão de estado desconhecido;
- faltar valor e aparecer número padrão;
- teste aceitar “Pulse indisponível” como sucesso;
- código for ligado à rota/UI antes da prova isolada;
- `PULSE_EXECUTION_ENABLED` for alterado;
- o runtime alegar executar `AsthmaAttackSevereAcute.json` sem reproduzir sua timeline.

## 20. Riscos e mitigação

| Risco | Impacto | Mitigação no marco 1 |
|---|---|---|
| Build local customizado não reproduzível | resultados/crashes variam | publicar version/hash; fixar paths; não prometer upstream |
| Python 3.9/macOS ARM64 hard-coded | baixa portabilidade | opções/env + preflight; portabilidade fora do marco |
| `process_action` não retorna bool | aceitação não observável diretamente | no-exception + advance/snapshot; registrar limitação |
| Engine bloqueia event loop Python | shutdown atrasado durante advance | comandos limitados, timeout fatal e kill escalonado |
| Node morre e deixa Python | processo órfão | child não detached; runtime sai em EOF |
| logs contaminam stdout | protocolo quebra | Pulse console off; protocolo exclusivo; stderr separado |
| resposta tardia após timeout | estado Node/Pulse diverge | timeout envenena e mata sessão |
| chamadas concorrentes | dois avanços sobrepostos | FIFO, uma operação in-flight |
| fallback oculta dado ausente | falso estado clínico | snapshot estrito, sem normalizer |
| reinit silencioso | “mesmo paciente” falso | init único + IDs/hash + state machine |
| cenário e runner têm timelines diferentes | falsa equivalência clínica | config explícita; scenario executor fora do marco |
| caso MEDIX não tem altura | paciente inventado | fixture técnica declarada; alinhamento posterior |
| temp/log residual após crash duro | lixo local | dir exclusivo; cleanup normal; política de varredura futura |
| child exposto ao browser | risco de bundle/segurança | módulo Node-only; sem route/UI no marco |
| uso de `npx tsx` baixar pacote | viola segurança | teste com Node 26 e `node --test` |

## 21. Relação com o contrato PulseAdapter

O cliente persistente é uma camada inferior:

```text
PulseAdapter (futuro: semântica MEDIX, fallback, minutos, ações)
  → PulsePersistentClient (transporte/lifecycle, segundos)
  → runtime Python
  → PyPulse
```

No marco 2, um adapter poderá:

- manter `PulseScenarioSession` coerente;
- converter minutos MEDIX para segundos;
- mapear `PulseActionRequest`;
- transformar `PulseRuntimeSnapshot` para estado clínico;
- decidir fallback;
- gerenciar registry de sessões.

O contrato atual precisará ser revisto antes disso: seus métodos recebem um objeto de sessão potencialmente stale, `applyAction` retorna snapshot mas não sessão atualizada e não modela falha de processo. Essa revisão não pertence ao marco 1.

## 22. Marcos posteriores — fora desta entrega

### Marco 2 — adapter de asma

- envolver o cliente com semântica `PulseAdapter`;
- alinhar paciente do caso ouro, após definir altura;
- decidir se usa timeline explícita ou cenário JSON;
- adicionar ação de broncodilatador/oxigênio;
- criar normalização estrita sem defaults silenciosos;
- comparar Pulse × estado MEDIX.

### Marco 3 — sessão HTTP

- escolher deployment com processo long-lived;
- registry por session id com TTL;
- rotas create/advance/action/snapshot/delete;
- autenticação, quota e limites;
- shutdown em deploy/restart;
- fallback no orquestrador, não no cliente.

### Marco 4 — UI/híbrido

- ligar caso ouro sob feature flag;
- preservar rubrica/comunicação MEDIX;
- mostrar fonte/indisponibilidade dos dados;
- só então considerar mudar provider.

Waveforms, outros casos, múltiplos engines e WASM ficam além desses marcos.

## 23. Decisões fechadas

| Questão | Decisão do marco 1 |
|---|---|
| Transporte | NDJSON sobre stdin/stdout |
| Topologia | um processo por sessão |
| Sessões por processo | uma |
| Engine por processo | um |
| Concorrência | FIFO, uma operação |
| Fonte de tempo | `pull_data()[0]` |
| Fonte de snapshot | array em memória |
| CSV | não |
| Paciente | fixture técnica 44/77/177 |
| Condição | AsthmaAttack 0,75 aplicada no init |
| Cenário JSON | não executado |
| Dados ausentes | erro, nunca fallback |
| Logs | stderr + arquivo temporário Pulse |
| Restart | explícito, nunca transparente |
| HTTP/UI | não |
| Provider/flag | inalterados |
| Dependência nova | nenhuma |
| Test runner | Node 26 `node --test` |
| Rollback | remover diretório novo |

## 24. Evidências principais

| Conclusão | Evidência |
|---|---|
| runner é transitório | `lib/dynamic-osce/pulse-local/pulse-local-runner.ts:137-161` |
| Python encerra após uma execução | `lib/dynamic-osce/pulse-local/pulse_asthma_runner.py:160-170` |
| engine criado por execução | `pulse_asthma_runner.py:97-125` |
| um único avanço | `pulse_asthma_runner.py:141-148` |
| reader usa última linha | `lib/dynamic-osce/pulse/pulse-real-output-reader.ts:161-205` |
| fallbacks clínicos | `lib/dynamic-osce/pulse/pulse-output-normalizer.ts:62-115` |
| bridge preserva overlay rule-based | `lib/dynamic-osce/pulse/pulse-medix-bridge.ts:71-81` |
| adapter é stub/flag false | `lib/dynamic-osce/pulse/pulse-adapter.contract.ts:9-10,75-84` |
| route health é constante | `app/api/pulse/simulate/route.ts:19-21` |
| UI não aplica resultado | `components/dynamic-osce/PulseLocalExperimentPanel.tsx:5-8,233-235` |
| caso segue rule-based | `lib/dynamic-osce/cases/piloto-asma-grave-adulto.ts:177-200` |
| caso e runner têm pacientes diferentes | caso `:49-59`; runner `:103-110` |
| cenário requer StandardMale e timeline distinta | `.reference-local/engine-stable/data/human/adult/scenarios/patient/AsthmaAttackSevereAcute.json:4-55` |
| engine suporta avanços repetidos | `.reference-local/engine-stable/src/python/pulse/engine/PulseEngine.py:153-182` |
| snapshot direto existe | `PulseEngine.py:160-185` |
| tempo é índice 0 | `PulseEngine.py:197-204` |
| process_action não propaga retorno | `PulseEngine.py:206-219` |
| discovery não verifica o build local | `lib/dynamic-osce/pulse/pulse-local-discovery.ts:12-13,182-210` |
| patches locais confirmados | `GastrointestinalModel.cpp:93-100,226-229`; `substances/Glucose.json:19-39` |
| configuração depende do data root e do cwd | `PulseConfiguration.cpp:469-483`; `Controller.cpp:446-453`; `bin/PulseConfiguration.json` |
| PyPulse instalado | `build/install/lib/PyPulse.cpython-39-darwin.so`; `build/install/python/pulse/` |
| `tsx` não é dependência | `package.json:21-29`; ausência em `node_modules/.bin` |
| TypeScript é strict/noEmit | `tsconfig.json:3-12` |

Caminhos sem prefixo `.reference-local/engine-stable/` na tabela referem-se ao Pulse local.

## 25. Comandos seguros usados nesta etapa

Somente leitura, além da criação deste relatório por `apply_patch`:

```sh
pwd
find . -maxdepth 2 -type f -name '<relatório>'
rg --files lib/dynamic-osce app/api/pulse components/dynamic-osce
rg -n '<símbolos>' <diretórios>
sed -n '<faixa>p' <arquivo>
nl -ba <arquivo>
wc -l <arquivos>
find .reference-local/engine-stable/build/install ...
node --version
python3 --version
git status --short
```

Não foram executados import PyPulse, engine, simulação, teste, build, instalação, commit ou push nesta etapa.

## 26. Limitações e perguntas abertas

Limitações:

- relatório-base do caso ouro ausente;
- hash Git completo/upstream do Pulse não confirmado;
- build contém patches locais;
- nenhuma simulação foi repetida nesta etapa;
- M1 prova continuidade técnica, não equivalência clínica;
- altura do paciente MEDIX não está definida;
- portabilidade Linux/deployment não foi avaliada.

Perguntas que não bloqueiam o marco 1, mas bloqueiam o marco 2:

1. Qual altura oficial de Marcos Andrade?
2. A timeline desejada é o JSON oficial (30+550, clear, +200) ou asma contínua do runner?
3. O baseline da UI (SpO₂ 88%, FR 34, FC 118) deve ser calibrado por condição/estado Pulse ou permanecer overlay MEDIX?
4. O build customizado será formalmente versionado/vendorado?
5. Qual ambiente long-lived hospedará o runtime quando sair do teste local?
6. Quais ações terapêuticas constituem o mínimo clínico da asma?

## 27. Definition of Done da futura implementação

A implementação do primeiro marco estará concluída quando:

- os cinco arquivos planejados existirem;
- nenhum arquivo listado como “não modificar” tiver mudado;
- preflight e hello validarem o build real;
- o teste produzir S0, S1, S2 e S3 do mesmo PID/engine/paciente;
- os tempos forem cumulativos;
- os snapshots forem completos e sem defaults;
- segundo init for rejeitado sem quebrar a sessão;
- shutdown for confirmado com exit 0;
- não houver CSV/órfão/temp residual no caminho normal;
- `tsc --noEmit`, teste de integração e `git diff --check` passarem;
- nenhuma dependência tiver sido instalada;
- provider e feature flag continuarem desligados.

## 28. Conclusão

O menor primeiro passo seguro não é trocar a rota atual nem “tornar o script existente persistente” por um loop improvisado. É introduzir uma fronteira de processo explícita e testável: um cliente Node dono de um único Python, protocolo NDJSON estrito, uma única instância Pulse, snapshot direto em memória, IDs que provam continuidade e encerramento fail-closed.

Esse marco remove as duas maiores ambiguidades atuais — reinicialização a cada chamada e CSV como contrato — sem misturar, ainda, fisiologia com regras MEDIX, HTTP ou UI. Ao final dele haverá evidência objetiva de que o mesmo paciente Pulse atravessou vários avanços temporais na mesma sessão.
