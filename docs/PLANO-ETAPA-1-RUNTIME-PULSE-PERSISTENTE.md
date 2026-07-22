# Plano técnico — Etapa 1: runtime Pulse persistente

**Data:** 2026-07-19

**Repositório:** `/Users/marceloalmeida/Projetos/mini-consultorio-osce`

**Marco:** processo Python persistente → sessões Pulse persistentes → avanços incrementais → snapshots estruturados → encerramento seguro

## 1. Estado atual

- O Pulse 4.3.2 está presente em `.reference-local/engine-stable`; o binding ARM64 `PyPulse.cpython-39-darwin.so`, os wrappers Python instalados e os recursos do engine existem localmente.
- O fluxo experimental atual é isolado: `pulse-local-runner.ts` cria um subprocesso por chamada, `pulse_asthma_runner.py` cria um paciente, aplica asma, avança uma vez e termina.
- O provider principal dos casos continua `medix-rule-based`; `PULSE_EXECUTION_ENABLED` permanece `false`.
- A rota `/api/pulse/simulate`, a UI, `PatientState`, normalizers e bridges atuais não possuem sessão Pulse incremental.
- O worktree já contém alterações alheias a esta etapa. Elas serão preservadas e não serão incorporadas aos novos arquivos.
- O relatório completo foi localizado em `docs/RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md`. O relatório-base do caso-ouro de asma não foi encontrado em `docs/` nem na raiz; a ausência é uma limitação documental.

## 2. Problemas confirmados

1. Não há processo Python persistente nem correlação por `requestId`.
2. Não há `SessionManager` nem identidade estável de sessão/paciente.
3. Cada execução experimental reconstrói e estabiliza outro engine.
4. O transporte atual é resposta única + CSV; não aceita vários comandos.
5. A leitura existente usa somente a última linha e passa por normalização com fallbacks, inadequada ao novo snapshot sem valores inventados.
6. Não há timeout/cancelamento centralizado para várias requisições pendentes.
7. O health atual não testa import real, processo vivo ou readiness.
8. Hot reload pode duplicar subprocessos se o lifecycle não for guardado no processo Node.
9. Processos filhos persistentes não são apropriados a workers/serverless efêmeros.

## 3. Arquivos preservados

Não serão alterados:

- `lib/dynamic-osce/pulse-local/pulse-local-runner.ts`;
- `lib/dynamic-osce/pulse-local/pulse_asthma_runner.py`;
- `app/api/pulse/simulate/route.ts`;
- `lib/dynamic-osce/types.ts` e `PatientState`;
- adapters, normalizers, reader CSV e bridge em `lib/dynamic-osce/pulse/`;
- casos em `lib/dynamic-osce/cases/`;
- `dynamic-state-engine.ts`;
- componentes em `components/dynamic-osce/`;
- provider atual e `PULSE_EXECUTION_ENABLED`.

## 4. Arquivos reutilizados como evidência

- Lógica segura de `spawn` e descoberta configurável do runner atual, sem reutilizar seu lifecycle transitório.
- `PulseEngine.py` para `initialize_engine`, `advance_time_s`, `pull_data`, `clear`, version e hash.
- `pulse_asthma_runner.py` para construção programática compatível do adulto e setup de caminhos, sem condição/ação de asma.
- `SEDataRequest`, `SEDataRequestManager`, unidades escalares e `SEPatientConfiguration` instalados com o Pulse.
- Convenção local de testes com `node:test` e `assert/strict`.

## 5. Arquivos novos

```text
lib/dynamic-osce/pulse-runtime/
├── pulse-runtime-protocol.ts
├── pulse-runtime-errors.ts
├── pulse-runtime-types.ts
├── pulse-process-manager.ts
├── pulse-session-client.ts
├── pulse-runtime-config.ts
├── index.ts
└── python/
    ├── __init__.py
    ├── pulse_runtime_server.py
    ├── protocol.py
    ├── session_manager.py
    ├── pulse_session.py
    ├── patient_builder.py
    ├── data_request_builder.py
    ├── logging_config.py
    └── tests/
        ├── __init__.py
        ├── test_protocol.py
        ├── test_session_manager.py
        └── test_runtime_server.py

tests/pulse-runtime/
├── fixtures/fake-pulse-runtime.py
├── pulse-runtime-protocol.test.mts
├── pulse-process-manager.test.mts
├── pulse-session-client.test.mts
└── pulse-runtime.integration.test.mts
```

As extensões Node serão `.mts`, em vez do caminho meramente sugerido `.ts`, para seguir o runner de testes nativo já usado pelo repositório sem instalar `tsx`.

## 6. Arquivos que poderão ser aposentados futuramente

Somente após equivalência funcional e clínica, e não nesta etapa:

- `pulse-local-runner.ts`;
- `pulse_asthma_runner.py`;
- reader CSV do experimento;
- rota isolada `/api/pulse/simulate`.

Nenhum deles será removido, redirecionado ou marcado como obsoleto agora.

## 7. Protocolo

- Transporte: JSON Lines, uma requisição por linha em `stdin`, uma resposta por linha em `stdout`.
- Versão: `protocolVersion: "1"`.
- Operações exclusivas: `PING`, `GET_ENGINE_INFO`, `CREATE_SESSION`, `ADVANCE_TIME`, `GET_SNAPSHOT`, `TERMINATE_SESSION`, `SHUTDOWN`.
- Toda requisição Node recebe UUID em `requestId`.
- O manager correlaciona resposta e promise pelo identificador; resposta desconhecida/duplicada é falha de protocolo.
- `warnings` sempre é array; erros usam `{code,message,details?}`.
- JSON inválido gera erro estruturado com `requestId` recuperável; sem identificador recuperável, usa identificador reservado do runtime.
- `stdout` é canal exclusivo do protocolo. Logging, diagnóstico e tracebacks sanitizados ficam em `stderr`.

## 8. Lifecycle do processo

```text
idle → spawning → PING/readiness → ready → shutdown solicitado → stopped
                       ↘ erro/timeout/exit → failed → stopped
```

1. Resolver configuração e validar paths sem executar shell.
2. Criar diretório temporário por processo para logs nativos do Pulse.
3. `spawn(python, [server])` com `shell: false`, pipes separados e `cwd` do Pulse compatível com recursos.
4. Instalar listeners antes de enviar comandos.
5. Validar readiness com `PING` dentro do timeout.
6. Manter um único filho por `PulseProcessManager`.
7. Em falha fatal, rejeitar todas as promises e encerrar o filho.
8. Em `stop`, enviar `SHUTDOWN`, aguardar saída e usar `SIGTERM`/`SIGKILL` somente como fallback temporizado.
9. Limpar leitores, pendências, temporários e referências.

Não haverá restart automático nesta etapa.

## 9. Lifecycle da sessão

```text
CREATE_SESSION → active → GET_SNAPSHOT / ADVANCE_TIME* → TERMINATE_SESSION → terminated
```

- `SessionManager` guarda mapa `sessionId → PulseSession` e conjunto limitado de IDs terminados.
- Cada `PulseSession` possui exatamente uma instância `PulseEngine`.
- `ADVANCE_TIME` valida duração, chama `advance_time_s` na mesma instância, extrai novo vetor e atualiza snapshot/tempo/timestamps.
- `TERMINATE_SESSION` chama `clear`, invalida referências, remove a sessão ativa e registra término.
- `SHUTDOWN` bloqueia novos comandos, termina todas as sessões, responde e encerra o loop.

## 10. Modelo de paciente

Defaults:

```json
{
  "name": "MEDIX Standard Adult",
  "sex": "male",
  "ageYears": 44,
  "weightKg": 77,
  "heightCm": 177
}
```

Faixas operacionais básicas, não clínicas/pediátricas: nome não vazio e limitado; sexo `male|female`; idade 18–100 anos; peso 30–250 kg; altura 120–230 cm. O builder cria `SEPatientConfiguration`, define data root e usa as unidades Pulse `yr`, `kg` e `cm`.

## 11. DataRequests mínimos

Solicitações confirmadas nos `SE*System.cpp`, requests padrão, HowTos ou cenários do Pulse:

| Campo do snapshot | Pulse | Unidade do protocolo |
|---|---|---|
| `simulationTimeSeconds` | posição zero de `pull_data()` | s |
| `heartRate` | `HeartRate` | 1/min |
| `systolicPressure` | `SystolicArterialPressure` | mmHg |
| `diastolicPressure` | `DiastolicArterialPressure` | mmHg |
| `meanArterialPressure` | `MeanArterialPressure` | mmHg |
| `respiratoryRate` | `RespirationRate` | 1/min |
| `spo2` | `OxygenSaturation` | % no limite do protocolo |
| `temperatureC` | `CoreTemperature` | °C |
| `tidalVolumeMl` | `TidalVolume` | mL |
| `minuteVentilationLMin` | `TotalPulmonaryVentilation` | L/min |
| `airwayResistance` | `InspiratoryRespiratoryResistance` | cmH2O s/L |
| `pao2MmHg` | Aorta/Oxygen/PartialPressure | mmHg |
| `paco2MmHg` | Aorta/CarbonDioxide/PartialPressure | mmHg |
| `pH` | `BloodPH` | unitless |

O vetor será mapeado pela mesma ordem usada na criação das requests. Valores ausentes, não finitos ou inválidos serão omitidos e registrados em `unavailableFields`; não haverá fallback numérico.

## 12. Snapshot

O contrato é independente de `PatientState`:

```text
PulseSnapshot
├── sessionId
├── simulationTimeSeconds
├── vitals (campos numéricos opcionais)
├── respiratory (campos numéricos opcionais)
├── unavailableFields[]
└── warnings[]
```

Não inclui texto clínico, diagnóstico, estado do caso, ações, eventos ou interpretação. SpO2 será multiplicada por 100 apenas quando o valor Pulse estiver em fração `[0,1]`; qualquer representação inesperada será preservada somente se finita e acompanhada de warning.

## 13. Erros

O Python implementará os códigos mínimos pedidos. O Node representará erro remoto, timeout, spawn, protocolo, stdin e encerramento como `PulseRuntimeError`, preservando código, `requestId`, `sessionId`, detalhes e causa quando seguros.

- Erros recuperáveis de comando não encerram o processo.
- Corrupção de `stdout`, resposta desconhecida/duplicada, timeout e queda do filho são fatais para o manager atual.
- Tracebacks podem ser registrados em `stderr`, nunca em resposta/stdout; a resposta pública recebe mensagem controlada.

## 14. Timeouts

- Default configurável: `MEDIX_PULSE_RUNTIME_TIMEOUT_MS`, inicialmente 45 s por comando/readiness.
- O timeout deve ser inteiro positivo dentro de limite operacional.
- Cada pending request possui timer próprio e é removida exatamente uma vez.
- Timeout torna o processo não confiável: pendências são rejeitadas e o processo é finalizado, sem restart automático.
- Shutdown tem janela graciosa e sinais de fallback.

## 15. Testes

### Python unitário

- parsing/validação e erros do protocolo;
- manager com sessão fake injetada: unicidade, criação, snapshot, dois avanços na mesma instância, tempo crescente, término e erros;
- subprocesso do servidor sem Pulse: `PING`, `GET_ENGINE_INFO`, JSON inválido, separação stdout/stderr e `SHUTDOWN`.

### Node unitário

- protocolo, UUID e guards;
- manager com fixture Python: spawn/readiness/correlação/stderr/timeout/stdout inválido/exit/pending rejection/shutdown;
- cliente: create/get/advance/terminate, sessão estável e bloqueio local após término.

### Integração real

- condicionada a Python/PyPulse disponíveis;
- PING → info → create → snapshot → advance 10 s → advance 10 s → terminate → erro pós-término → shutdown;
- checagem de IDs, tempo crescente, finitude somente dos campos presentes e ausência de defaults inventados.

## 16. Critérios de aceite

- Processo Python único permanece vivo em vários comandos.
- PyPulse é importado uma vez no bootstrap do processo.
- O mesmo engine/paciente/sessionId é reutilizado em dois avanços.
- Tempo cresce e snapshot respeita campos opcionais/unavailable.
- Protocolo e logs não compartilham stream.
- Timeout, corrupção, queda e pendências são tratados.
- Sessão e processo encerram com segurança, sem filho observavelmente ativo.
- Testes unitários passam e integração real passa quando o engine está disponível.
- Nenhum arquivo preservado, UI, provider ou caso é alterado.
- Nenhuma dependência, commit ou push.

## 17. Limitações locais e serverless

- O artefato atual é ARM64 e CPython 3.9; outro ambiente precisa de build/instalação compatíveis e configuração explícita.
- Inicialização programática estabiliza fisiologia e pode levar vários segundos.
- `globalThis` evita duplicação apenas dentro do mesmo processo Node; não coordena workers, containers ou réplicas.
- Funções serverless efêmeras não garantem processo filho ou memória entre requisições. Esta versão é local/serverful.
- Produção persistente poderá usar child process, sidecar ou serviço dedicado. O cliente tipado mantém o backend substituível.

## 18. Riscos

1. Recursos Pulse são resolvidos parcialmente por diretório corrente/data root.
2. DataRequest reconhecida estaticamente ainda pode retornar não finito no build/paciente atual.
3. Interrupção durante chamada nativa pode exigir sinal forçado.
4. Múltiplas sessões consomem memória nativa significativa; não haverá política de quota nesta etapa.
5. Lifecycle global não atravessa múltiplos workers do Next.
6. Tipos Node importados acidentalmente no browser causariam poisoning; módulos com `child_process` serão marcados `server-only` e exports serão separados com cuidado.
7. O relatório-base de asma ausente limita o confronto documental, sem bloquear este marco sem asma.

## 19. Decisões adotadas

- Implementação paralela, não migração.
- JSON Lines sobre pipes, sem socket/streaming.
- Mapa multi-sessão no Python, um engine por sessão.
- Snapshot próprio sem `PatientState` e sem normalizer existente.
- Ausência explícita em vez de fallback.
- Python iniciado mesmo quando PyPulse não importa, permitindo `PING`/info; `CREATE_SESSION` retorna `ENGINE_IMPORT_FAILED`.
- Dependência injetável para sessões e opções de spawn, permitindo testes leves.
- Singleton `globalThis` opt-in pela função pública, sem side effect ao importar módulos.
- Sem rota HTTP nova nesta etapa.

## 20. Ordem efetiva da implementação

1. Registrar estado inicial e ler relatórios/código/Pulse relevante.
2. Criar este plano.
3. Criar protocolo, logging, patient/data request builders e runtime Python.
4. Criar SessionManager/PulseSession e testes Python.
5. Criar tipos/protocolo/config/erros Node.
6. Criar process manager, singleton e session client.
7. Criar fixture/testes Node e integração real condicional.
8. Executar compile/import checks, typecheck, lint focal, testes unitários e fluxo real.
9. Verificar processos, `git diff --check`, diff/status e arquivos preservados.
10. Produzir `docs/RELATORIO-ETAPA-1-RUNTIME-PULSE-PERSISTENTE.md` com evidências e resultados reais.
