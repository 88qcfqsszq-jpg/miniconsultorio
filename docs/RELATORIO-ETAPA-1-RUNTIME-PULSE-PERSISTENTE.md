# Relatório — Etapa 1: runtime Pulse persistente

**Data:** 2026-07-19

**Repositório:** `/Users/marceloalmeida/Projetos/mini-consultorio-osce`

**Status:** concluído

## 1. Resumo executivo

Foi implantada, em paralelo à integração existente, a primeira fundação funcional persistente Pulse × MEDIX:

```text
Node / MEDIX server-side
  → child_process.spawn, shell=false
  → um processo CPython 3.9 persistente
  → JSON Lines por stdin/stdout
  → PyPulse 4.3.2 / hash bb72983
  → SessionManager multi-sessão
  → uma instância PulseEngine por sessão
  → mesmo adulto e mesmo engine em avanços incrementais
  → PulseSnapshot estruturado e sem fallbacks inventados
  → TERMINATE_SESSION e SHUTDOWN seguros
```

O fluxo real foi validado com o binding local: uma sessão manteve o mesmo UUID e processo Python durante `0 → ~10 → ~20 s`; todos os 13 campos solicitados vieram finitos no build atual. A sessão foi terminada, novo avanço foi rejeitado, o runtime recebeu shutdown e o PID capturado não permaneceu ativo.

Não foram alterados UI, casos, provider, `PatientState`, normalizers, adapters, feature flag, rota atual ou runner experimental de asma. Não houve instalação, build/rebuild, commit ou push.

## 2. Estado inicial

Validação inicial obrigatória:

| Item | Valor |
|---|---|
| `pwd` | `/Users/marceloalmeida/Projetos/mini-consultorio-osce` |
| Git top-level | mesmo caminho |
| HEAD | `e39f9ed1f84f1e1c3cbae8dbce73a4ee4cd67811` |
| Branch | `main` |
| Remote | `git@github.com:88qcfqsszq-jpg/miniconsultorio.git` |
| Pulse root | `PULSE_FOUND` |

O worktree já estava sujo. Havia 16 arquivos tracked modificados e um zip tracked removido:

- `app/caso/[id]/consultorio-medix.css`;
- `app/treinamento/page.tsx`;
- `components/CasoCard.tsx`;
- `components/ChatPaciente.tsx`;
- `components/PainelGerarCaso.tsx`;
- `data/casos-v2/adultos/cardiovascular/004-dor-toracica-angina-tipica.ts`;
- `hooks/__tests__/useRealtimePaciente.test.mts`;
- `hooks/useRealtimePaciente.ts`;
- `lib/ecg/types.ts`;
- `lib/healthbench/feedback-builder.ts`;
- `lib/healthbench/rubric-adapter.ts`;
- `lib/osce/evidence-mapper.ts`;
- `lib/patient-v3/__tests__/promptBasePaciente.test.mts`;
- `lib/patient-v3/promptBasePaciente.ts`;
- `lib/voice/__tests__/realtimeClient.test.mts`;
- `lib/voice/realtimeClient.ts`;
- remoção de `public/assets/consultorio/attendance-icons/casos-v2-inline-perfeitos.zip`.

Também havia muitos arquivos/diretórios untracked do usuário, incluindo `.claude/`, documentos MEDIX, arquivos de dados, `app/treinamento/treinamento.css`, `lib/healthbench/perfil-rubrica-loader.ts`, assets zip e os relatórios/planos anteriores. Esse estado foi preservado.

## 3. Documentos lidos

| Documento | Estado |
|---|---|
| `docs/RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md` | encontrado e lido integralmente |
| `RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md` | não encontrado na raiz; não havia duplicata |
| `docs/RELATORIO-BASE-INTEGRACAO-PULSE-MEDIX-CASO-OURO-ASMA.md` | não encontrado |
| `RELATORIO-BASE-INTEGRACAO-PULSE-MEDIX-CASO-OURO-ASMA.md` | não encontrado |

A ausência das duas localizações possíveis do relatório-base de asma é a limitação documental desta etapa. Ela não bloqueou o marco porque condições, ações e asma ficaram explicitamente fora do escopo.

Também foram lidos o plano anterior disponível, o prompt integral desta etapa, os arquivos focais da integração atual, wrappers/headers relevantes do Pulse e a documentação local desta versão do Next sobre código server-only e limitações de handlers implantados como funções efêmeras.

## 4. Arquitetura implementada

O Python é um servidor de linha única e síncrono no transporte. O Node pode manter várias promises pendentes; o Python consome cada comando de forma determinística e as respostas são correlacionadas por UUID.

```text
PulseSessionClient
  ↓ request tipado
PulseProcessManager ── pending Map<requestId, Promise>
  ↓ stdin JSONL                 ↑ stdout JSONL
pulse_runtime_server.py ── RuntimeServer
  ↓
SessionManager ── Map<sessionId, PulseSession>
  ↓                          ↓
PulseSession A              PulseSession B
  ↓                          ↓
PulseEngine A               PulseEngine B
```

O bootstrap tenta o import uma vez. Mesmo sem PyPulse, `PING`, `GET_ENGINE_INFO` e `SHUTDOWN` continuam disponíveis; `CREATE_SESSION` retorna `ENGINE_IMPORT_FAILED`. Não há rota HTTP nova nem side effect de spawn ao importar os módulos Node.

## 5. Arquivos criados

Planejamento/relatório:

- `docs/PLANO-ETAPA-1-RUNTIME-PULSE-PERSISTENTE.md`;
- `docs/RELATORIO-ETAPA-1-RUNTIME-PULSE-PERSISTENTE.md`.

Node/TypeScript:

- `lib/dynamic-osce/pulse-runtime/pulse-runtime-protocol.ts`;
- `lib/dynamic-osce/pulse-runtime/pulse-runtime-errors.ts`;
- `lib/dynamic-osce/pulse-runtime/pulse-runtime-types.ts`;
- `lib/dynamic-osce/pulse-runtime/pulse-runtime-config.ts`;
- `lib/dynamic-osce/pulse-runtime/pulse-process-manager.ts`;
- `lib/dynamic-osce/pulse-runtime/pulse-session-client.ts`;
- `lib/dynamic-osce/pulse-runtime/index.ts`.

Python:

- `lib/dynamic-osce/pulse-runtime/python/__init__.py`;
- `lib/dynamic-osce/pulse-runtime/python/logging_config.py`;
- `lib/dynamic-osce/pulse-runtime/python/protocol.py`;
- `lib/dynamic-osce/pulse-runtime/python/patient_builder.py`;
- `lib/dynamic-osce/pulse-runtime/python/data_request_builder.py`;
- `lib/dynamic-osce/pulse-runtime/python/pulse_session.py`;
- `lib/dynamic-osce/pulse-runtime/python/session_manager.py`;
- `lib/dynamic-osce/pulse-runtime/python/pulse_runtime_server.py`.

Testes Python:

- `lib/dynamic-osce/pulse-runtime/python/tests/__init__.py`;
- `lib/dynamic-osce/pulse-runtime/python/tests/test_protocol.py`;
- `lib/dynamic-osce/pulse-runtime/python/tests/test_session_manager.py`;
- `lib/dynamic-osce/pulse-runtime/python/tests/test_runtime_server.py`.

Testes Node:

- `tests/pulse-runtime/fixtures/fake-pulse-runtime.py`;
- `tests/pulse-runtime/ts-extension-loader.mjs`;
- `tests/pulse-runtime/pulse-runtime-protocol.test.mts`;
- `tests/pulse-runtime/pulse-process-manager.test.mts`;
- `tests/pulse-runtime/pulse-session-client.test.mts`;
- `tests/pulse-runtime/pulse-runtime.integration.test.mts`.

Total desta etapa: 27 arquivos novos, incluindo plano e este relatório.

## 6. Arquivos alterados

Nenhum arquivo preexistente foi alterado por esta etapa. Toda a implantação está em caminhos novos.

## 7. Arquivos preservados

Foram explicitamente preservados e permanecem fora do novo wiring:

- `lib/dynamic-osce/pulse-local/pulse-local-runner.ts`;
- `lib/dynamic-osce/pulse-local/pulse_asthma_runner.py`;
- `app/api/pulse/simulate/route.ts`;
- `lib/dynamic-osce/types.ts` e `PatientState`;
- `lib/dynamic-osce/dynamic-state-engine.ts`;
- `lib/dynamic-osce/pulse/` existente;
- `lib/dynamic-osce/cases/`;
- `components/dynamic-osce/`;
- `simulationProvider: medix-rule-based`;
- `PULSE_EXECUTION_ENABLED=false`;
- todas as alterações preexistentes do worktree.

O runner antigo não foi reexecutado, mas ficou integralmente inalterado. Nenhum caso foi migrado.

## 8. Protocolo

Versão: `"1"`.

Operações implementadas, e somente estas:

- `PING`;
- `GET_ENGINE_INFO`;
- `CREATE_SESSION`;
- `ADVANCE_TIME`;
- `GET_SNAPSHOT`;
- `TERMINATE_SESSION`;
- `SHUTDOWN`.

Cada linha de entrada contém uma requisição JSON; cada linha de saída contém uma resposta. O envelope inclui `requestId`, `ok`, `warnings` e, quando aplicável, `sessionId`, `data`, erro estruturado, versão e tempo.

O parser Python valida versão, operação, identificadores e formato do payload. JSON malformado tenta recuperar `requestId` com limite de tamanho; quando impossível usa `unavailable`. O encoder usa `allow_nan=False`. O parser Node rejeita JSON inválido, envelope inválido, versão errada, warnings inválidos, erro não estruturado e tempo não finito.

## 9. Lifecycle do processo

Estados Node:

```text
idle → starting → ready → stopping → stopped
             ↘ falha fatal → failed
```

O manager:

1. resolve configuração;
2. valida script, Pulse root, working directory e Python absoluto quando aplicável;
3. cria diretório temporário seguro;
4. usa `spawn(python, ['-u', script])`, `shell:false`;
5. instala leitores separados;
6. confirma readiness com `PING`;
7. mantém pending promises por `requestId`;
8. em shutdown, envia `SHUTDOWN`, espera saída e usa `SIGTERM`/`SIGKILL` apenas como fallback;
9. em queda/erro fatal, rejeita pendências e libera automaticamente readers, guard e temporário após o fechamento;
10. instala guard `process.once('exit')` para sinalizar o filho se o processo Node encerrar.

Não há restart automático.

## 10. Lifecycle da sessão

`SessionManager` possui mapa interno de sessões e registro limitado dos últimos 2.048 IDs encerrados. UUID v4 gera `sessionId` seguro.

`CREATE_SESSION` valida o payload, constrói o paciente e DataRequests, cria uma única instância `PulseEngine`, estabiliza e guarda o snapshot inicial.

`ADVANCE_TIME`:

1. valida sessão e duração finita `>0` e `≤3600 s`;
2. chama `advance_time_s` na mesma instância;
3. não reconstrói paciente/engine;
4. extrai o novo vetor;
5. atualiza tempo, snapshot e timestamp.

`TERMINATE_SESSION` chama `clear`, invalida a referência nativa, remove a sessão ativa e bloqueia acesso posterior. Ele não encerra o runtime. `SHUTDOWN` bloqueia o manager, termina todas as sessões, responde e sai do loop.

## 11. Paciente padrão

```json
{
  "name": "MEDIX Standard Adult",
  "sex": "male",
  "ageYears": 44,
  "weightKg": 77,
  "heightCm": 177
}
```

O payload aceita overrides desses campos. Faixas operacionais básicas: idade 18–100 anos, peso 30–250 kg e altura 120–230 cm. Essa validação não é apresentada como validação clínica ou pediátrica; o runtime é adulto.

## 12. DataRequests confirmados

| Snapshot | DataRequest Pulse | Unidade | Evidência runtime |
|---|---|---|---|
| tempo | índice zero de `pull_data` | s | finito |
| `heartRate` | `HeartRate` | 1/min | finito |
| `systolicPressure` | `SystolicArterialPressure` | mmHg | finito |
| `diastolicPressure` | `DiastolicArterialPressure` | mmHg | finito |
| `meanArterialPressure` | `MeanArterialPressure` | mmHg | finito |
| `respiratoryRate` | `RespirationRate` | 1/min | finito |
| `spo2` | `OxygenSaturation` | convertido de fração para % | finito |
| `temperatureC` | `CoreTemperature` | °C | finito |
| `tidalVolumeMl` | `TidalVolume` | mL | finito |
| `minuteVentilationLMin` | `TotalPulmonaryVentilation` | L/min | finito |
| `airwayResistance` | `InspiratoryRespiratoryResistance` | cmH2O s/L | finito |
| `pao2MmHg` | Aorta/Oxygen/PartialPressure | mmHg | finito |
| `paco2MmHg` | Aorta/CarbonDioxide/PartialPressure | mmHg | finito |
| `pH` | `BloodPH` | unitless | finito |

Os nomes foram confirmados estaticamente em sistemas/HowTos/requests do Pulse e dinamicamente no build atual.

## 13. Campos indisponíveis

Nenhum dos 13 campos ficou indisponível no teste real do adulto padrão e build atual.

O contrato continua preparado para disponibilidade parcial: valor ausente, fora do vetor ou não finito é omitido do objeto e adicionado como caminho em `unavailableFields`; um warning enumera os campos. Não há `0`, `37`, média calculada ou outro fallback silencioso.

SpO2 em `[0,1]` é convertida para porcentagem. Valor já em `(1,100]` é preservado com warning; escala fora desses limites é omitida.

## 14. Snapshot final

Snapshot real após o segundo avanço de 10 s, arredondado aqui somente para legibilidade do relatório:

```json
{
  "simulationTimeSeconds": 19.999999999999662,
  "vitals": {
    "heartRate": 72.0263,
    "systolicPressure": 114.2456,
    "diastolicPressure": 73.5883,
    "meanArterialPressure": 95.3220,
    "respiratoryRate": 12.0,
    "spo2": 97.3868,
    "temperatureC": 37.0475
  },
  "respiratory": {
    "tidalVolumeMl": 526.5118,
    "minuteVentilationLMin": 6.3181,
    "airwayResistance": 1.50015,
    "pao2MmHg": 88.7209,
    "paco2MmHg": 39.4385,
    "pH": 7.41927
  },
  "unavailableFields": [],
  "warnings": []
}
```

O snapshot completo também contém o mesmo `sessionId` UUID dos snapshots inicial e intermediário.

## 15. Tratamento de logs

- `logging_config.py` remove handlers existentes e configura somente `StreamHandler(sys.stderr)`.
- `stdout` é escrito exclusivamente por `emit(encode_message(...))`.
- O teste do servidor parseia todas as linhas de stdout como JSON e confirma que o diagnóstico de import aparece somente em stderr.
- Logs nativos do Pulse têm console desabilitado e arquivo direcionado ao diretório temporário privado do processo; o manager remove esse diretório ao encerrar.
- O Node mantém buffer circular das últimas 200 linhas de stderr e emite evento `stderr` separado.

## 16. Tratamento de erros

Códigos Python implementados/emitidos:

- `INVALID_JSON`;
- `INVALID_REQUEST`;
- `UNSUPPORTED_PROTOCOL_VERSION`;
- `UNKNOWN_OPERATION`;
- `ENGINE_IMPORT_FAILED`;
- `ENGINE_INITIALIZATION_FAILED`;
- `SESSION_NOT_FOUND`;
- `SESSION_ALREADY_TERMINATED`;
- `INVALID_ADVANCE_DURATION`;
- `ADVANCE_FAILED`;
- `SNAPSHOT_FAILED`;
- `INTERNAL_ERROR`;
- `SHUTTING_DOWN`.

O Node acrescenta erros locais estruturados para configuração, spawn, readiness, processo não pronto, stdin, stdout inválido, timeout, resposta desconhecida/duplicada, queda e processo parado. Queda fatal rejeita todas as promises pendentes. Tracebacks internos, quando existirem, ficam em stderr; a resposta recebe mensagem controlada e tipo da exceção.

## 17. Timeouts

Default: 45.000 ms por comando/readiness, configurável por `MEDIX_PULSE_RUNTIME_TIMEOUT_MS` entre 100 e 300.000 ms.

Cada request possui timer independente. Um timeout torna o stream não confiável, muda o manager para `failed`, rejeita todas as pendências e sinaliza o filho. O teste usa 120 ms com um runtime fake bloqueado e confirma rejeição de duas promises, término e ausência do PID.

## 18. Estratégia de singleton/hot reload

`getPulseProcessManager()` guarda a instância sob `Symbol.for('medix.pulse-runtime.process-manager')` em `globalThis`. Imports repetidos/hot reload dentro do mesmo processo Node reutilizam o manager vivo. Manager `failed` ou `stopped` não é reutilizado; uma nova instância exige chamada explícita ao getter. `disposePulseProcessManager()` remove a referência e encerra o filho.

O teste confirmou a mesma referência e o mesmo PID em duas obtenções. Não há singleton entre workers, processos, containers ou réplicas.

## 19. Limitações serverless

Esta implementação é local/serverful. Subprocesso persistente, mapa em memória e sessão incremental não são garantidos em função serverless efêmera; handlers podem cair entre requisições ou executar em workers diferentes.

Um servidor persistente, como instância/container no Render, pode executar o Python como filho ou sidecar. Produção distribuída poderá exigir serviço dedicado. O protocolo e o `PulseSessionClient` preservam a substituição futura do backend. WASM não foi iniciado nesta etapa.

## 20. Testes criados

Python, 10 testes:

- parsing válido/inválido, recuperação de requestId, versão/operação e NaN;
- PING, engine info, JSON inválido, shutdown e separação stdout/stderr;
- sessões únicas, defaults, snapshot inicial, mesma instância, dois avanços, tempo crescente, validação, término e shutdown.

Node, 11 testes unitários:

- serialização, UUID e parsing;
- spawn/readiness, stderr, correlação concorrente;
- spawn inexistente;
- timeout e rejeição de pendências;
- stdout inválido;
- exit inesperado;
- shutdown/órfão;
- singleton;
- cliente create/get/dois advances/terminate/erro local.

Integração real, um teste:

- probe PyPulse;
- PING/info/create/get/advance 10/advance 10;
- mesmo ID, tempo crescente, finitude e ausência explícita;
- terminate, erro pós-término e shutdown.

## 21. Testes executados

1. `npx --no-install tsc --noEmit --pretty false`.
2. `npx --no-install eslint lib/dynamic-osce/pulse-runtime/*.ts tests/pulse-runtime/*.mts tests/pulse-runtime/*.mjs`.
3. unittest com o CPython 3.9 do Xcode e `PYTHONDONTWRITEBYTECODE=1`.
4. Node test unitário com type stripping nativo e loader local de extensão.
5. Node test de integração real separado.
6. `py_compile` dos oito módulos de implementação sob CPython 3.9, com cache redirecionado para temporário e removido.
7. Fluxo real manual via `PulseProcessManager`.
8. checagens de whitespace, status, diff e artefatos gerados.

## 22. Resultados

| Validação | Resultado |
|---|---|
| Typecheck completo | passou, zero diagnóstico |
| ESLint focal | passou, zero diagnóstico |
| Python CPython 3.9 | 10/10 passaram |
| Node unitário | 11/11 passaram |
| Integração real | 1/1 passou, ~9,8 s |
| Compile Python 3.9 | passou |
| Fluxo manual real | passou |
| `git diff --check` tracked | passou, sem saída |
| Trailing whitespace nos arquivos novos | nenhum após revisão |
| `.pyc`/`.DS_Store` nos caminhos novos | nenhum |

O fluxo manual informou Pulse `4.3.2`, hash `bb72983`, o mesmo PID `94599`, o mesmo sessionId `75c4c21b-981a-4308-b27f-f5c71b5895e3` e tempos `0`, `9.999999999999876`, `19.999999999999662`. Após `stop`, `childAliveAfterStop` foi `false`.

Os 27 arquivos novos somam 3.547 linhas. Como permanecem untracked, o `git diff --stat` comum não os inclui; ele mostra exclusivamente o diff tracked preexistente: 17 arquivos, 1.703 inserções e 749 remoções. Nenhum desses 17 arquivos foi tocado nesta etapa.

## 23. Falhas ou skips

Não houve teste falho nem skip: PyPulse estava disponível.

Limitações da validação:

- `pgrep` retornou erro de acesso ao serviço `sysmond` e `ps` foi bloqueado pelo sandbox; não foi possível inventariar globalmente processos do usuário.
- A alternativa mais precisa para o escopo foi aplicada: cada teste capturou o PID filho, enviou shutdown/sinais quando necessário e usou `process.kill(pid, 0)` para confirmar que aquele PID não existia depois.
- O runner Node nativo emitiu warnings de ferramenta sobre loader experimental e pacote sem `type: module`; não são falhas de teste nem alteração de runtime. Nenhuma configuração do projeto foi mudada para silenciá-los.

## 24. Critérios de aceite

Foram avaliados os critérios obrigatórios: processo único, import único por processo, sessão/engine persistentes, dois avanços, tempo crescente, snapshot, ausência explícita, streams separados, timeout, queda, término, shutdown, preservação da integração, testes e ausência de operações Git externas.

## 25. Critérios atendidos

- Um processo Python persistente para vários comandos: atendido.
- PyPulse importado no bootstrap uma vez por processo: atendido.
- Uma sessão/engine e paciente persistentes: atendido.
- Mesmo `sessionId` em dois avanços: atendido.
- Tempo crescente: atendido.
- Snapshot tipado: atendido.
- Sem números inventados: atendido.
- stdout somente JSON Lines e logs stderr: atendido.
- Timeout e queda inesperada: atendidos.
- Rejeição de todas as pendências: atendida.
- Sessão terminável e runtime desligável: atendidos.
- Singleton/hot reload no processo Node: atendido.
- Sem órfão observável por PID: atendido.
- Runner/rota/UI/casos/provider/flag preservados: atendido.
- Typecheck, lint, unitários, integração e manual: atendidos.
- Sem dependência, build, commit ou push: atendido.

## 26. Critérios não atendidos

Nenhum critério obrigatório desta etapa ficou pendente.

Itens deliberadamente fora do escopo permanecem não implementados: condições, ações, asma, medicamentos, oxigênio, eventos, séries, streaming, UI, integração de casos, save/load, restart automático, produção distribuída e WASM.

## 27. Riscos remanescentes

1. Cada sessão aloca engine nativo; limites de concorrência/memória ainda precisam ser medidos.
2. Não há TTL/quota de sessão; o consumidor deve terminar sessões.
3. Sessões não sobrevivem à queda do processo e não há save/load.
4. `globalThis` não coordena múltiplos workers/containers.
5. O binding atual é específico de macOS ARM64/CPython 3.9.
6. O runtime ainda não está ligado a autenticação, rate limiting ou rota pública.
7. Falha nativa irrecuperável derruba o processo; restart automático foi excluído.
8. O relatório-base do caso-ouro de asma estava ausente.
9. Os warnings do loader de teste deverão ser reavaliados quando o projeto padronizar um runner TS; nenhuma dependência foi instalada agora.

## 28. Próximos passos para a crise de asma

Próximo marco recomendado, após aprovação deste baseline:

1. localizar/restaurar o relatório-base de asma e fixar golden inputs/outputs;
2. adicionar `APPLY_ACTION` com contrato explícito e restrito;
3. mapear `SEAsthmaAttack` com severidade/unidades validadas;
4. testar ação na mesma sessão adulta já criada;
5. comparar baseline → asma → avanços → intervenção, com tolerâncias clínicas;
6. somente depois criar adapter/rota paralela protegida por flag;
7. manter `medix-rule-based` como principal até equivalência demonstrada;
8. não reutilizar fallbacks do normalizer como saída Pulse.

## 29. Evidências com caminhos e símbolos

| Evidência | Caminho/símbolo |
|---|---|
| protocolo e guards | `pulse-runtime-protocol.ts`: `createPulseRuntimeRequest`, `parsePulseRuntimeResponseLine` |
| configuração | `pulse-runtime-config.ts`: `resolvePulseRuntimeConfig` |
| processo/pending/timeout | `pulse-process-manager.ts`: `PulseProcessManager`, `sendRaw`, `failProcess`, `stop` |
| singleton | `pulse-process-manager.ts`: `getPulseProcessManager` |
| cliente de sessão | `pulse-session-client.ts`: `PulseSessionClient` |
| loop JSONL | `python/pulse_runtime_server.py`: `main`, `RuntimeServer.handle` |
| import único/info | `python/pulse_runtime_server.py`: `load_pulse`, `engine_info` |
| mapa de sessões | `python/session_manager.py`: `SessionManager` |
| engine persistente | `python/pulse_session.py`: `PulseSession.advance_time` |
| paciente adulto | `python/patient_builder.py`: `DEFAULT_PATIENT`, `build_patient_configuration` |
| requests/snapshot | `python/data_request_builder.py`: `DATA_REQUEST_SPECS`, `extract_snapshot` |
| logs | `python/logging_config.py`: `configure_logging` |
| integração real | `tests/pulse-runtime/pulse-runtime.integration.test.mts` |
| falhas Node | `tests/pulse-runtime/pulse-process-manager.test.mts` |

Evidência Pulse consultada: `PulseEngine.py` para `initialize_engine`, `advance_time_s`, `pull_data`, `clear`, version/hash; `SECardiovascularSystem.cpp`, `SERespiratorySystem.cpp`, `SEBloodChemistrySystem.cpp`, `SEEnergySystem.cpp` e requests padrão/HowTos para nomes/unidades.

## 30. Comandos executados

Principais comandos de leitura/validação:

```sh
pwd
git status --short
git rev-parse --show-toplevel
git rev-parse HEAD
git branch --show-current
git remote -v
test -d .reference-local/engine-stable
find . -maxdepth 4 ...
rg -n ...
sed -n ...
npx --no-install tsc --noEmit --pretty false
npx --no-install eslint lib/dynamic-osce/pulse-runtime/*.ts tests/pulse-runtime/*.mts tests/pulse-runtime/*.mjs
PYTHONDONTWRITEBYTECODE=1 <python3.9> -B -m unittest discover ...
PYTHONPYCACHEPREFIX=/private/tmp/... <python3.9> -m py_compile ...
node --experimental-strip-types --loader ./tests/pulse-runtime/ts-extension-loader.mjs --test ...
node --experimental-strip-types --loader ... --input-type=module -e '<fluxo manual>'
pgrep -fl ...
ps -ax ...
git diff --check
git diff --stat
git status --short --untracked-files=all
```

`pgrep` e `ps` foram somente tentativas read-only e tiveram a limitação descrita. O único delete realizado removeu caches Python gerados pela própria checagem em caminhos exatos; nenhum arquivo do usuário foi removido.

Não foram executados `npm install`, build/rebuild, simulação de asma, alteração de índice Git, commit, push, troca de branch ou comando Git destrutivo.
