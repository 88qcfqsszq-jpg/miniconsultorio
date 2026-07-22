# Relatório da Etapa 2 — Caso Ouro de Crise Asmática no Pulse

Data: 2026-07-19  
Repositório: `/Users/marceloalmeida/Projetos/mini-consultorio-osce`  
Branch: `main`  
HEAD inicial: `47f1ff398763738badb2c6ecb76f60bcf30b6369`  
Status: **parcial por capacidade ausente na distribuição local do Pulse**

## 1. Resumo executivo

Foi entregue e validada a fatia vertical técnica do Caso Ouro até o limite real da instalação local:

```text
CLI protegida por feature flag
  -> serviço técnico do Caso Ouro
     -> cliente Node tipado
        -> um processo Python persistente
           -> uma PulseSession persistente
              -> um paciente adulto + um PulseEngine
                 -> crise real + avanços + oxigênio real + eventos + snapshots

snapshots + histórico + eventos + ações
  -> apresentação clínica MEDIX derivada
  -> exame físico adulto MEDIX derivado
  -> timeline deduplicada
```

A crise asmática e o oxigênio são ações Pulse reais. A severidade 0,75 foi selecionada após cinco calibrações reais. A cânula nasal a 1 `L/min` foi escolhida após comparar regimes de oxigênio; ela resolveu a hipoxemia sem disparar hiperoxemia até 300 s.

O albuterol não pôde ser aplicado. O arquivo local `substances/Albuterol.json` existe, mas contém apenas propriedades físico-químicas e não contém a seção `Aerosolization` exigida pelo modelo de inalador. A primeira chamada nativa foi rejeitada pelo Pulse com `Inhaler substance must have aerosolization data`. O dispatcher passou então a verificar essa precondição e retorna `RESOURCE_NOT_FOUND`, com `resource: "Albuterol"` e `missingSection: "Aerosolization"`, antes da chamada nativa. Nenhum benefício farmacológico foi inventado.

Consequentemente, progressão sem tratamento, oxigênio, eventos, cancelamentos e lifecycle parcial foram validados. Albuterol isolado, combinação, tratamento tardio com broncodilatador e o lifecycle integral permanecem bloqueados. Essa é a razão única para o status parcial.

## 2. Estado inicial e auditoria

- Diretório e raiz Git confirmados no repositório solicitado.
- Branch `main`; HEAD inicial `47f1ff398763738badb2c6ecb76f60bcf30b6369`.
- A árvore já estava extensamente suja, com alterações e arquivos não rastreados do usuário. O índice não foi modificado.
- Pulse local encontrado em `.reference-local/engine-stable`, versão 4.3.2, build hash `bb72983`.
- Runtime persistente da Etapa 1 localizado em `lib/dynamic-osce/pulse-runtime/` e validado antes e depois da extensão.
- Runner experimental anterior e rota `/api/pulse/simulate` preservados.
- Implementação React adulta real localizada em `components/ExameFisicoAdultoVisual.tsx`, integrada em `app/caso/[id]/page.tsx`.
- Estado existente de `manobrasSolicitadas`, modal, callbacks e caminhos pediátricos não foi alterado.
- O runner dinâmico atual mantém estado local; não foi encontrado store global adequado que justificasse acoplamento nesta etapa.

## 3. Documentos consultados

Lidos integralmente:

- `docs/RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md`;
- `docs/PLANO-ETAPA-1-RUNTIME-PULSE-PERSISTENTE.md`;
- `docs/RELATORIO-ETAPA-1-RUNTIME-PULSE-PERSISTENTE.md`;
- `docs/EXAME-FISICO-ADULTO-VISUAL.md`.

Não foi localizado, nem em `docs/` nem na raiz:

- `RELATORIO-BASE-INTEGRACAO-PULSE-MEDIX-CASO-OURO-ASMA.md`.

A ausência desse segundo relatório é uma limitação documental. A decisão técnica foi confrontada com o relatório disponível, o código-fonte, wrappers, exemplos, protobufs, recursos e execução real do Pulse local.

## 4. API Pulse confirmada

### 4.1 Crise asmática

- `SEAsthmaAttack` é uma **ação de paciente**, não uma condição.
- Severidade: escalar adimensional 0–1.
- Aplicação: `PulseEngine.process_action(SEAsthmaAttack)`.
- Atualização: uma nova ação de asma substitui a severidade ativa.
- Cancelamento real: nova `SEAsthmaAttack` com severidade zero; o código nativo considera a ação inativa e a remove.

Portanto, o Caso Ouro usa:

```json
{"action":"asthma_attack","severity":0.75}
```

`APPLY_CONDITION` foi adicionado por compatibilidade do protocolo, mas rejeita qualquer condição pós-inicialização com `UNSUPPORTED_CONDITION`. A asma não é classificada incorretamente como condição.

### 4.2 Oxigênio

- Ação real: `SESupplementalOxygen`.
- Dispositivos confirmados e tipados: `NasalCannula`, `SimpleMask`, `NonRebreatherMask`.
- Fluxo: `L/min`; volume do reservatório: `L`.
- Persistência confirmada entre avanços.
- Atualização confirmada pela reaplicação da ação.
- Cancelamento real: ação com `NullDevice`; no avanço seguinte o circuito retorna à via aérea livre.

Configuração selecionada para o Caso Ouro:

```json
{
  "action": "supplemental_oxygen",
  "device": "nasal_cannula",
  "flow": {"value": 1, "unit": "L/min"},
  "volume": {"value": 1000, "unit": "L"}
}
```

### 4.3 Albuterol

A via modelada pelo Pulse é:

1. `EquipmentAction.InhalerConfiguration` com substância `Albuterol`;
2. dose medida de 90 `ug`, perda de bocal 0,04 e espaçador de 500 `mL`;
3. `PatientAction.ConsciousRespiration` com expiração forçada, `UseInhaler`, inspiração forçada e pausa.

O wrapper Python omite a serialização de `InhalerConfiguration` e não expõe convenientemente `SEUseInhaler`. Foi implementado um adapter por protobuf oficial e `process_actions`, sem modificar o Pulse. A interface e a validação de dose/unidades estão prontas, mas o recurso local é incompleto:

```json
{
  "Name": "Albuterol",
  "State": "Liquid",
  "Density": "presente",
  "MolarMass": "presente",
  "RelativeDiffusionCoefficient": "presente",
  "SolubilityCoefficient": "presente",
  "Aerosolization": "ausente"
}
```

Não foi encontrado outro recurso broncodilatador local com os dados necessários. Não houve tentativa de inventar distribuição de partículas, coeficientes ou farmacodinâmica. Albuterol é uma administração discreta e não é exposto como cancelável.

## 5. Protocolo e runtime

O envelope JSON Lines v1 foi preservado. Operações adicionadas:

| Operação | Resultado |
|---|---|
| `APPLY_CONDITION` | dispatcher tipado; rejeição explícita nesta fatia |
| `APPLY_ACTION` | asma, oxigênio e interface de albuterol |
| `CANCEL_ACTION` | somente asma e oxigênio, que têm cancelamento Pulse real |
| `GET_EVENTS` | histórico de mudanças e eventos ativos |

Continuam funcionais: `PING`, `GET_ENGINE_INFO`, `CREATE_SESSION`, `ADVANCE_TIME`, `GET_SNAPSHOT`, `TERMINATE_SESSION` e `SHUTDOWN`.

Erros exercitados: `UNSUPPORTED_CONDITION`, `INVALID_ACTION_PAYLOAD`, `INVALID_SEVERITY`, `UNSUPPORTED_ACTION`, `INVALID_DEVICE`, `INVALID_FLOW`, `INVALID_DOSE`, `INVALID_UNIT`, `RESOURCE_NOT_FOUND`, `ACTION_APPLICATION_FAILED`, `ACTION_CANCELLATION_FAILED` e `EVENT_COLLECTION_FAILED`.

O Python mantém stdout exclusivo para respostas JSON Lines; logs e erros de infraestrutura permanecem em stderr. O CLI não imprime PID, caminhos locais, configuração interna nem traceback.

## 6. Caso Ouro

- ID: `gold-asthma-severe-adult`.
- Título: `Crise Asmática Aguda Grave`.
- Provider: `pulse`.
- Nível de validação: `gold`.
- População: adulto.
- Paciente fisiológico: homem, 44 anos, 77 kg, 177 cm.

A narrativa fixa cobre diagnóstico de asma, tratamento habitual e de resgate, adesão, internações, UTI, intubação prévia, alergias, tabagismo, gatilho provável, duração da crise, medidas já tentadas, sintomas associados e contexto social. Ela é armazenada separadamente e não altera o engine.

## 7. Calibração real da asma

Todos os números desta seção vieram de Pulse 4.3.2. Foram arredondados apenas para leitura. Cada severidade usou uma sessão nova, dentro de um processo Python persistente, com snapshots em 0, 30, 90, 210 e 300 s.

### 7.1 Baseline comum

| FC | PAS | PAD | PAM | FR | SpO₂ | VC mL | VM L/min | Resistência | PaO₂ | PaCO₂ | pH |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 72,00 | 114,25 | 73,60 | 95,32 | 12,00 | 97,39 | 526,87 | 6,32 | 1,50 | 88,64 | 39,34 | 7,420 |

### 7.2 Comparação aos 300 s

| Severidade | FC | PAS/PAD (PAM) | FR | SpO₂ | VC mL | VM | Resistência | PaO₂ | PaCO₂ | pH | Eventos relevantes |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 0,30 | 71,97 | 114,28/73,57 (95,33) | 12,40 | 97,38 | 530,38 | 6,57 | 2,16 | 89,59 | 40,27 | 7,411 | nenhum |
| 0,55 | 72,01 | 114,30/73,58 (95,34) | 13,95 | 97,34 | 481,66 | 6,72 | 6,29 | 89,45 | 40,77 | 7,406 | nenhum |
| **0,75** | 74,87 | 113,61/74,50 (95,31) | 18,63 | 94,70 | 298,70 | 5,57 | 21,50 | 71,43 | 45,27 | 7,365 | `Hypoxia` iniciou e terminou |
| 0,85 | 118,86 | 109,75/82,22 (96,15) | 21,13 | 89,39 | 238,68 | 5,04 | 41,85 | 55,64 | 48,79 | 7,335 | hipoxia, taquicardia, taquipneia e acidose ativas |
| 0,90 | 143,92 | 107,58/83,80 (95,63) | 35,71 | 80,30 | 117,50 | 4,20 | 58,71 | 44,08 | 53,42 | 7,299 | hipoxia, taquicardia, taquipneia e acidose ativas |

0,30 e 0,55 foram insuficientes para uma crise grave. 0,85 e 0,90 produziram deterioração muito intensa; em 0,90 houve FR zero no snapshot de 30 s, seguida de taquicardia e hipoxemia profundas. A severidade **0,75** apresentou alteração mecânica importante, hipoxemia clinicamente relevante e evolução reprodutível sem colapso imediato, preservando espaço para resposta ao tratamento.

### 7.3 Série temporal selecionada, sem tratamento

| t s | FC | PAS/PAD (PAM) | FR | SpO₂ | VC mL | VM | Resistência | PaO₂ | PaCO₂ | pH |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 72,00 | 114,25/73,60 (95,32) | 12,00 | 97,39 | 526,87 | 6,32 | 1,50 | 88,64 | 39,34 | 7,420 |
| 30 | 72,35 | 114,72/74,56 (95,92) | 12,99 | 95,56 | 197,71 | 2,57 | 21,50 | 75,45 | 43,89 | 7,377 |
| 90 | 87,76 | 113,00/78,02 (96,10) | 17,14 | 92,32 | 255,68 | 4,38 | 21,48 | 61,17 | 44,57 | 7,371 |
| 210 | 77,12 | 113,46/75,07 (95,47) | 18,63 | 94,51 | 300,56 | 5,60 | 21,49 | 70,13 | 44,86 | 7,368 |
| 300 | 74,87 | 113,61/74,50 (95,31) | 18,63 | 94,70 | 298,70 | 5,57 | 21,50 | 71,43 | 45,27 | 7,365 |

Evento Pulse: `Hypoxia` iniciou em 58,50 s e terminou em 172,62 s. A apresentação final foi classificada pelo MEDIX como `severe`, escore 8, com as evidências mantidas no resultado.

## 8. Calibração e resposta ao oxigênio

Regimes maiores foram rejeitados para o caso porque causaram hiperoxemia no modelo:

| Regime | Momento observado | PaO₂ | Evento ativo |
|---|---:|---:|---|
| cânula 3,5 L/min | 180 s | 137,77 | `ModerateHyperoxemia` |
| máscara simples 5 L/min | 180 s | 221,15 | `SevereHyperoxemia` |
| máscara simples 7,5 L/min | 180 s | 274,00 | `SevereHyperoxemia` |
| não reinalante 10 L/min | 180 s | 294,37 | `SevereHyperoxemia` |
| não reinalante 10 L/min | 300 s | 513,36 | `SevereHyperoxemia` |
| **cânula 1 L/min** | 300 s | **107,55** | nenhuma hiperoxemia ativa |

Ação aplicada aos 90 s na configuração escolhida:

| t s | FC | PAS/PAD (PAM) | FR | SpO₂ | VC mL | VM | Resistência | PaO₂ | PaCO₂ | pH |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 90, antes | 87,76 | 113,00/78,02 (96,10) | 17,14 | 92,32 | 255,68 | 4,38 | 21,48 | 61,17 | 44,57 | 7,371 |
| 120 | 81,65 | 112,61/76,52 (95,40) | 18,07 | 94,69 | 284,47 | 5,14 | 21,46 | 71,17 | 45,14 | 7,366 |
| 180 | 73,07 | 113,96/74,17 (95,36) | 17,96 | 97,08 | 282,06 | 5,07 | 21,49 | 90,30 | 45,94 | 7,359 |
| 300 | 72,17 | 114,16/73,62 (95,27) | 18,75 | 97,95 | 305,87 | 5,74 | 21,50 | 107,55 | 50,88 | 7,318 |

`Hypoxia` terminou em 114,46 s. O oxigênio melhorou SpO₂ e PaO₂, mas não reduziu a resistência, como deve ocorrer sem broncodilatador. `RespiratoryAcidosis` iniciou em 212,84 s e permaneceu ativa; o interpretador final marcou `life-threatening`, escore 13. Esse resultado foi mantido, não mascarado.

## 9. Albuterol, combinação e tratamento tardio

Não há snapshots pós-broncodilatador porque a ação não foi aplicada. A tabela registra o último estado realmente produzido:

| Cenário | Último estado real antes da tentativa | Ações realmente aplicadas | Resultado da tentativa | Snapshot pós-albuterol |
|---|---|---|---|---|
| albuterol isolado | crise, 90 s | asma | `RESOURCE_NOT_FOUND` | não produzido |
| combinação | crise, 90 s | asma + oxigênio | `RESOURCE_NOT_FOUND` | não produzido |
| tratamento tardio | crise, 210 s | asma + oxigênio | `RESOURCE_NOT_FOUND` | não produzido |
| lifecycle | crise + oxigênio | asma + oxigênio; ambos depois cancelados | `RESOURCE_NOT_FOUND` | não produzido |

O erro CLI sanitizado foi:

```json
{"name":"PulseRuntimeError","code":"RESOURCE_NOT_FOUND","message":"Pulse Albuterol resource has no aerosolization data required by the inhaler model."}
```

Não existe comparação fisiológica válida de albuterol ou combinação nesta distribuição. Preencher colunas com tendências esperadas seria fabricar dados.

## 10. Cancelamento e lifecycle

Em um fluxo manual real, a mesma sessão recebeu asma 0,75, avançou a 90 s, recebeu cânula 1 L/min, avançou a 120 s, cancelou oxigênio e asma e avançou até 180 s:

| Estado | t s | SpO₂ | VC mL | VM | Resistência | PaO₂ | PaCO₂ | pH |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| baseline | 0 | 97,39 | 526,87 | 6,32 | 1,50 | 88,64 | 39,34 | 7,420 |
| crise | 90 | 92,32 | 255,68 | 4,38 | 21,48 | 61,17 | 44,57 | 7,371 |
| oxigênio | 120 | 94,69 | 284,47 | 5,14 | 21,46 | 71,17 | 45,14 | 7,366 |
| 60 s após cancelamentos | 180 | 98,00 | 547,85 | 6,82 | 1,50 | 97,32 | 38,31 | 7,431 |

O PID permaneceu o mesmo durante a sessão, todos os snapshots mantiveram o mesmo `sessionId`, `activeSessionCount` foi 1 durante o fluxo e 0 após `TERMINATE_SESSION`. O processo foi encerrado por `SHUTDOWN` no teardown. O teste formal de lifecycle também tentou albuterol, verificou o bloqueio explícito e continuou o encerramento seguro.

## 11. Eventos

O coletor usa a API nativa do mesmo engine para:

- habilitar mudanças de evento;
- preservar `SimTime` do protobuf;
- coletar início e fim;
- consultar eventos ativos e duração;
- marcar origem `source: "pulse"`.

Cada evento tem ID, nome Pulse, estado, tempo fisiológico, categoria, gravidade, origem e horário. Categoria e gravidade são metadados MEDIX; o nome e a ocorrência permanecem nativos. Eventos cíclicos `StartOfCardiacCycle`, `StartOfInhale` e `StartOfExhale` são contados, mas não entram no histórico clínico.

Eventos realmente observados na calibração: `Bradypnea`, `Hypoxia`, `Tachycardia`, `Tachypnea`, `RespiratoryAcidosis`, `RespiratoryAlkalosis`, `ModerateHyperoxemia` e `SevereHyperoxemia`.

## 12. Timeline

A timeline em memória registra marcos, não timesteps:

- sessão e baseline;
- ação aplicada ou cancelada;
- avanço e snapshot;
- início/fim de evento;
- mudança de apresentação;
- exame solicitado;
- erro;
- término.

Cada entrada contém ID, `sessionId`, tempo fisiológico, tipo, origem, título, dados e horário. Eventos usam IDs vistos; apresentação usa assinatura de estado; ambos evitam duplicação. O fluxo CLI de oxigênio produziu 24 entradas.

## 13. Apresentação clínica derivada

O interpretador é puro e combina snapshot atual, baseline/histórico, tendência, eventos, duração e ações. A saída inclui gravidade, aparência, fala, esforço, cianose, perfusão, avisos e a lista das evidências usadas.

Redução aparente de sibilos não é interpretada como melhora quando volume corrente, ventilação ou entrada de ar estão criticamente baixos. O teste focal cobre explicitamente essa prioridade de segurança.

## 14. Exame físico adulto dinâmico

Uma camada pura do Caso Ouro produz achados nas seções geral, respiratória, cardiovascular, neurológica e perfusão. Cada achado informa `pulse`, `medix-derived` ou `case-fixed`, além das evidências e do tempo fisiológico.

O resultado muda conforme o snapshot do instante solicitado. No fluxo CLI de oxigênio aos 300 s foram gerados 9 achados. Nenhuma regra fisiológica foi colocada em React; o componente adulto, modal, callbacks, manobras existentes e comportamento pediátrico permaneceram intactos.

## 15. Exposição técnica e feature flag

A exposição escolhida foi CLI server-side:

`lib/dynamic-osce/scripts/run-gold-asthma-pulse.mts`

Ela oferece calibração, progressão, oxigênio, albuterol, combinação, tratamento tardio e lifecycle por meio do serviço técnico, que expõe criação, snapshot, ações, avanços, eventos, timeline, apresentação, exame e término.

A flag obrigatória é:

```text
MEDIX_PULSE_GOLD_ASTHMA_ENABLED=true
```

Sem o valor literal `true`, o serviço lança `GOLD_ASTHMA_FEATURE_DISABLED` antes de iniciar o gerenciador; o teste confirma estado `idle` e ausência de PID. Não foi criada rota nem página e o fluxo principal não importa o Caso Ouro.

## 16. Arquivos

### Criados na Etapa 2

- `docs/PLANO-ETAPA-2-CASO-OURO-ASMA-PULSE.md`;
- `docs/RELATORIO-ETAPA-2-CASO-OURO-ASMA-PULSE.md`;
- `lib/dynamic-osce/pulse-runtime/python/action_dispatcher.py`;
- `lib/dynamic-osce/pulse-runtime/python/event_collector.py`;
- `lib/dynamic-osce/pulse-runtime/python/tests/test_action_dispatcher.py`;
- `lib/dynamic-osce/pulse-runtime/python/tests/test_event_collector.py`;
- os 12 módulos em `lib/dynamic-osce/cases/gold/asthma-severe/`;
- `lib/dynamic-osce/scripts/run-gold-asthma-pulse.mts`;
- quatro testes em `tests/pulse-gold-asthma/`.

### Alterados na Etapa 2

- `lib/dynamic-osce/pulse-runtime/python/protocol.py`;
- `lib/dynamic-osce/pulse-runtime/python/pulse_session.py`;
- `lib/dynamic-osce/pulse-runtime/python/session_manager.py`;
- `lib/dynamic-osce/pulse-runtime/python/pulse_runtime_server.py`;
- `lib/dynamic-osce/pulse-runtime/python/tests/test_session_manager.py`;
- `lib/dynamic-osce/pulse-runtime/pulse-runtime-protocol.ts`;
- `lib/dynamic-osce/pulse-runtime/pulse-runtime-types.ts`;
- `lib/dynamic-osce/pulse-runtime/pulse-session-client.ts`;
- `lib/dynamic-osce/pulse-runtime/index.ts`;
- `tests/pulse-runtime/fixtures/fake-pulse-runtime.py`;
- `tests/pulse-runtime/pulse-session-client.test.mts`.

### Explicitamente preservados

- `lib/dynamic-osce/pulse-local/` e runner anterior;
- `app/api/pulse/simulate/route.ts`;
- fluxo principal de casos dinâmicos;
- `components/ExameFisicoAdultoVisual.tsx`;
- `app/caso/[id]/page.tsx`;
- pediatria;
- caso existente de asma e todos os outros casos;
- dependências e configurações;
- índice Git e trabalho preexistente do usuário.

## 17. Testes e validações executados

| Verificação | Resultado |
|---|---|
| unitários Python | 18 aprovados |
| `npx --no-install tsc --noEmit --pretty false` | aprovado |
| ESLint focal, sem instalação | aprovado |
| Node focal + regressão Etapa 1 | aprovado; integração real da Etapa 1 incluída |
| matriz real Etapa 2 | 7/7 aprovados, 0 skips, ~80 s |
| CLI com flag ausente | falha fechada esperada antes de sessão |
| CLI real de oxigênio | aprovado até 300 s |
| CLI real de albuterol | falha esperada `RESOURCE_NOT_FOUND` |
| calibração 0,30/0,55/0,75/0,85/0,90 | concluída |
| calibração de cinco regimes de oxigênio | concluída |
| lifecycle/cancelamento real | aprovado até o limite do albuterol |

A matriz real tem seis subcenários e uma raiz: progressão e oxigênio validam tendências; albuterol, combinação e tardio validam a falha fechada real; lifecycle valida sessão/processo persistentes, cancelamentos e teardown.

A inspeção global por `pgrep` não foi disponibilizada pelo sandbox (`Cannot get process list`) e a elevação solicitada não foi autorizada. A ausência de órfãos foi verificada pelo próprio contrato observável: `activeSessionCount=0`, processo em `stopped`, saída do filho aguardada no teardown e teste da Etapa 1 para shutdown gracioso.

## 18. Critérios atendidos

- Etapa 1 segue funcional e retrocompatível.
- Mesmo processo, sessão, engine e paciente recebem crise, avanços, oxigênio e eventos.
- Crise nativa produz alteração mensurável e severidade foi calibrada.
- Oxigênio e cancelamentos usam ações Pulse reais.
- Payloads, severidade, dose, unidades, dispositivos e ações inválidas são rejeitados.
- Eventos nativos, tempos, ativos e transições são coletados.
- Snapshots usam apenas valores Pulse; não há fallback fisiológico inventado.
- Timeline, apresentação e exame adulto são tipados e testáveis.
- Lógica fisiológica fica fora de React.
- Feature flag falha fechada antes de criar processo/sessão.
- Fluxo principal, pediatria, rota antiga, runner antigo e outros casos permanecem inalterados.
- Não houve instalação, commit, push ou alteração do índice Git.

## 19. Critérios pendentes

- Aplicação real de albuterol ou outro broncodilatador.
- Medição da resposta fisiológica ao broncodilatador.
- Comparação real de albuterol isolado, combinação e tratamento tardio.
- Repetição de dose, somente após confirmar recurso completo e suporte.
- Lifecycle integral incluindo uma administração broncodilatadora bem-sucedida.

## 20. Limitações e riscos

1. **Recurso Albuterol incompleto:** bloqueio atual e reproduzível. Acrescentar somente a chave `Aerosolization` por conta própria seria inseguro; é necessário um pacote oficial e completo compatível com Pulse 4.3.2.
2. **Possíveis requisitos subsequentes:** após corrigir aerossolização, o recurso ainda deve ser auditado quanto a farmacocinética/farmacodinâmica antes de considerar a resposta válida.
3. **Oxigênio dependente do modelo:** regimes clinicamente usuais produziram hiperoxemia extrema; a cânula 1 L/min é uma calibração específica desta versão/paciente, não uma recomendação clínica geral.
4. **Oxigênio não trata a mecânica:** com asma mantida e sem broncodilatador, PaCO₂ subiu e ocorreu acidose apesar da correção de SpO₂.
5. **API nativa encapsulada:** o adapter do inalador usa protobuf e método nativo por lacuna do wrapper Python; requer teste de regressão ao atualizar Pulse.
6. **CLI técnica:** é deliberadamente isolada; integrar à UI exigirá novo marco, autorização e desenho de estado server-side.
7. **Relatório-base ausente:** reduz a rastreabilidade documental externa, embora não afete os resultados medidos.

## 21. Próximo passo mínimo

Obter, sem editar manualmente seus parâmetros, a distribuição oficial de substâncias compatível com Pulse 4.3.2 que contenha o recurso completo de `Albuterol`, validar hash/proveniência e repetir:

1. preflight do recurso;
2. albuterol isolado;
3. combinação;
4. tratamento tardio;
5. lifecycle integral;
6. comparação por tendências de resistência, ventilação, FC, gases, pH e eventos.

O contrato, adapter e testes já deixam esse próximo passo localizado. Até lá, a flag deve permanecer desligada fora da validação técnica.

## 22. Comandos e evidências principais

- auditoria: `pwd`, `git rev-parse --show-toplevel`, `git branch --show-current`, `git rev-parse HEAD`, `git status --short` e buscas `rg` no MEDIX/Pulse;
- Python: `/usr/bin/python3 -m unittest discover -s lib/dynamic-osce/pulse-runtime/python/tests -p 'test_*.py'`;
- typecheck: `npx --no-install tsc --noEmit --pretty false`;
- lint focal: `npx --no-install eslint` sobre runtime, Caso Ouro, CLI e testes focais;
- Node: `node --experimental-strip-types --loader ./tests/pulse-runtime/ts-extension-loader.mjs --test ...`;
- integração real: mesmo comando com `MEDIX_PULSE_REAL_INTEGRATION=1` e `MEDIX_PULSE_GOLD_ASTHMA_ENABLED=true`;
- CLI oxigênio: `run-gold-asthma-pulse.mts --scenario oxygen --severity 0.75`;
- CLI albuterol: `run-gold-asthma-pulse.mts --scenario albuterol --severity 0.75`;
- calibrações adicionais: scripts Node inline usando `GoldAsthmaTechnicalService`, uma sessão por gravidade/regime e o mesmo `PulseProcessManager`;
- auditoria final: `git diff --stat`, `git diff --check`, `git status --short`, HEAD e branch.

## 23. Auditoria Git final

Esta seção deve ser lida com uma particularidade: o runtime da Etapa 1 e os diretórios de testes já estavam não rastreados no início. Assim, `git diff` não representa os arquivos novos/modificados dentro desses diretórios; `git status --short` é a evidência complementar. Nenhum arquivo foi adicionado ao índice.

HEAD final observado: `79dd12f8e16942ad6c2433a3f65ba161592c97a4`, ainda em `main`. O reflog mostra quatro commits concorrentes entre 16:45 e 17:10, todos relativos a Patient Turn Guard; seus nove caminhos não se sobrepõem aos arquivos desta etapa. O agente desta tarefa não executou commit. `git diff --cached --name-only` terminou vazio, confirmando índice intacto.

`git diff --stat` final — este bloco contém somente alterações rastreadas externas/preexistentes; arquivos da Etapa 1/2 estão sob diretórios ainda não rastreados:

```text
 app/caso/[id]/consultorio-medix.css                |   38 +-
 app/treinamento/page.tsx                           |  166 +--
 components/CasoCard.tsx                            |  119 +-
 components/ChatPaciente.tsx                        |   88 +-
 components/PainelGerarCaso.tsx                     |   69 +-
 .../004-dor-toracica-angina-tipica.ts              | 1251 +++++++++++---------
 hooks/__tests__/useRealtimePaciente.test.mts       |   29 +
 hooks/useRealtimePaciente.ts                       |   39 +-
 lib/ecg/types.ts                                   |   49 +
 lib/healthbench/feedback-builder.ts                |   71 +-
 lib/healthbench/rubric-adapter.ts                  |   35 +-
 lib/osce/evidence-mapper.ts                        |    3 +-
 lib/voice/__tests__/realtimeClient.test.mts        |  277 +++++
 lib/voice/realtimeClient.ts                        |  131 +-
 .../attendance-icons/casos-v2-inline-perfeitos.zip |  Bin 256536 -> 0 bytes
 15 files changed, 1619 insertions(+), 746 deletions(-)
```

`git diff --check`: exit code 0, sem saída. Como o Git não inclui arquivos não rastreados nesse comando, os arquivos da etapa foram verificados adicionalmente por TypeScript, ESLint e testes Python/Node.

`git status --short` mantém as alterações rastreadas preexistentes e mostra, entre outros itens do usuário, os novos caminhos desta entrega:

```text
?? docs/PLANO-ETAPA-2-CASO-OURO-ASMA-PULSE.md
?? docs/RELATORIO-ETAPA-2-CASO-OURO-ASMA-PULSE.md
?? lib/dynamic-osce/cases/gold/
?? lib/dynamic-osce/pulse-runtime/
?? lib/dynamic-osce/scripts/run-gold-asthma-pulse.mts
?? tests/
```

O status completo foi preservado na saída terminal final; nada foi staged, restaurado, removido ou limpo por esta tarefa.
