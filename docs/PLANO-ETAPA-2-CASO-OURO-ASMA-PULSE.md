# Plano da Etapa 2 — Caso Ouro de Crise Asmática no Pulse

Data da auditoria: 2026-07-19  
Repositório: `/Users/marceloalmeida/Projetos/mini-consultorio-osce`  
Branch auditada: `main`  
HEAD auditado: `47f1ff398763738badb2c6ecb76f60bcf30b6369`

## 1. Objetivo e limite

Entregar uma fatia vertical técnica, isolada do fluxo principal, na qual um único processo Python mantém uma única instância de `PulseEngine` e um único paciente adulto durante toda a crise, os avanços, o oxigênio, o albuterol, os eventos, os snapshots e o encerramento. A fisiologia vem exclusivamente do Pulse; apresentação, exame e timeline são interpretações MEDIX identificadas como tal.

Não fazem parte desta etapa: migração do runner dinâmico atual, substituição de `/api/pulse/simulate`, alteração de casos não relacionados, alteração pediátrica, monitor com waveforms, WebAssembly ou exposição pública no navegador.

## 2. Estado encontrado

### 2.1 Etapa 1

A Etapa 1 está presente em `lib/dynamic-osce/pulse-runtime/` e implementa:

- processo Python persistente com stdin/stdout JSON Lines;
- registro de sessões em memória;
- uma instância `PulseEngine` por `PulseSession`;
- `PING`, `GET_ENGINE_INFO`, `CREATE_SESSION`, `ADVANCE_TIME`, `GET_SNAPSHOT`, `TERMINATE_SESSION` e `SHUTDOWN`;
- cliente e gerenciador Node com correlação por `requestId`, timeouts e encerramento seguro;
- 13 medidas reais no snapshot, sem preenchimento fisiológico sintético;
- testes Python, Node e integração real.

O contrato v1 será ampliado sem mudar o envelope nem a semântica das operações existentes.

### 2.2 Documentos

Foram localizados e lidos:

- `docs/RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md`;
- `docs/PLANO-ETAPA-1-RUNTIME-PULSE-PERSISTENTE.md`;
- `docs/RELATORIO-ETAPA-1-RUNTIME-PULSE-PERSISTENTE.md`;
- `docs/EXAME-FISICO-ADULTO-VISUAL.md`.

Não foi localizado, nem em `docs/` nem na raiz, `RELATORIO-BASE-INTEGRACAO-PULSE-MEDIX-CASO-OURO-ASMA.md`. Esta ausência limita o confronto com o segundo relatório solicitado, mas não bloqueia a execução porque a instalação e o código-fonte local do Pulse fornecem a evidência operacional.

### 2.3 Árvore de trabalho

A árvore já contém modificações e arquivos não rastreados do usuário, inclusive a Etapa 1. Todo esse estado será preservado. Não haverá alteração do índice Git, commit, push, troca de branch, remoção ou restauração.

## 3. Evidência da API real do Pulse

### 3.1 Crise asmática

- `SEAsthmaAttack` está em `pulse.cdm.patient_actions`: é uma **ação de paciente**, não uma condição de inicialização.
- A severidade usa `SEScalar0To1`, portanto aceita o intervalo fechado de 0 a 1, sem unidade.
- O exemplo `HowTo_AsthmaAttack.py` usa `pulse.process_action(asthma_attack)`.
- O cenário oficial `AsthmaAttackSevereAcute.json` usa severidade 0,75.
- `SEAsthmaAttack::IsActive()` retorna falso quando a severidade é zero. A coleção de ações remove a crise quando recebe essa ação inativa. Logo, o cancelamento real será uma nova `SEAsthmaAttack` com severidade 0.

A crise será aplicada por `APPLY_ACTION`, com tipo `asthma_attack`. `APPLY_CONDITION` existirá no protocolo e rejeitará condições não implementadas com erro estruturado; não classificará falsamente a asma como condição Pulse.

### 3.2 Oxigênio

- A classe real é `SESupplementalOxygen`, ação de paciente.
- Dispositivos confirmados: `NasalCannula`, `SimpleMask` e `NonRebreatherMask`.
- A implementação do modelo respiratório define o circuito correspondente e mantém a ação ativa entre avanços.
- Fluxo usa `L/min` e volume do reservatório usa `L`.
- O cancelamento real usa dispositivo `None`; no próximo timestep o modelo volta a via aérea para `Free` e remove a ação.

A interface tipada aceitará apenas os três dispositivos confirmados e unidades explícitas. A seleção do dispositivo e do fluxo ficará condicionada à calibração real. A calibração subsequente selecionou cânula nasal a 1 `L/min`; máscaras e fluxos maiores produziram hiperoxemia no modelo.

### 3.3 Albuterol

- O recurso real é `Albuterol`, presente em `substances/Albuterol.json`.
- A administração real usa `EquipmentAction.InhalerConfiguration` seguida de `PatientAction.ConsciousRespiration` com `UseInhaler`.
- O cenário oficial usa dose medida de 90 `ug`, perda de bocal 0,04 e espaçador de 500 `mL`.
- O modelo deposita a substância no pulmão e calcula broncodilatação local; não será criada melhora artificial pelo MEDIX.
- Não há nebulização dedicada confirmada nesta instalação.
- Albuterol por inalador é uma ação discreta, portanto não terá `CANCEL_ACTION`.

Limitação do wrapper: a serialização Python de `InhalerConfiguration` está comentada e `UseInhaler` não é tratado pelo serializador de respiração consciente. A adaptação usará as mensagens protobuf oficiais instaladas (`ActionListData`, `InhalerConfigurationData` e `ConsciousRespirationData`) e o método nativo `process_actions` já encapsulado por `PulseEngine`, sem modificar o Pulse nem escrever arquivos de cenário.

Gate obrigatório do plano: antes da chamada nativa, o dispatcher validará que `substances/Albuterol.json` contém a seção `Aerosolization`, exigida pelo modelo do inalador. A execução real posterior encontrou o arquivo, mas sem essa seção; por isso `albuterol_inhaler` falha fechado com `RESOURCE_NOT_FOUND`, sem chamar o motor nem produzir benefício artificial. Esse achado torna a entrega parcial e é detalhado no relatório final.

### 3.4 Eventos

O Pulse expõe mudanças e eventos ativos, entre eles `Hypoxia`, `Hypercapnia`, `Tachypnea`, `Tachycardia`, `RespiratoryAcidosis`, `RespiratoryAlkalosis`, `MaximumPulmonaryVentilationRate` e eventos do oxigênio suplementar. A coleta será habilitada no mesmo engine e preservará o `SimTime` protobuf. Eventos cíclicos de alta frequência (`StartOfCardiacCycle`, `StartOfInhale`, `StartOfExhale`) não entrarão na timeline clínica.

Categorias e gravidades serão metadados MEDIX sobre nomes nativos, nunca novos eventos apresentados como Pulse.

## 4. Arquitetura escolhida

```text
CLI técnica (feature flag)
  -> GoldAsthmaTechnicalService
     -> PulseSessionClient
        -> PulseProcessManager (um processo Python)
           -> SessionManager
              -> PulseSession (um paciente + um PulseEngine)
                 -> dispatcher de ações / coletor de eventos

Snapshot Pulse + histórico + eventos + ações
  -> interpretador puro de apresentação MEDIX
  -> interpretador puro de exame adulto MEDIX
  -> timeline técnica deduplicada
```

O serviço técnico será em memória, server-only por natureza e acessado por CLI. Essa opção evita expor PID, caminhos, traceback ou controle do processo ao navegador e não exige alteração de rota ou componente React.

## 5. Protocolo e tipos

Operações novas no protocolo v1:

- `APPLY_CONDITION`: dispatcher tipado; nesta fatia, nenhuma condição Pulse pós-inicialização é fingida como suportada;
- `APPLY_ACTION`: `asthma_attack`, `supplemental_oxygen` e `albuterol_inhaler`;
- `CANCEL_ACTION`: somente `asthma_attack` e `supplemental_oxygen`;
- `GET_EVENTS`: mudanças históricas deduplicadas e eventos ativos.

Erros estáveis incluirão: `UNSUPPORTED_CONDITION`, `INVALID_ACTION_PAYLOAD`, `INVALID_SEVERITY`, `UNSUPPORTED_ACTION`, `INVALID_DEVICE`, `INVALID_FLOW`, `INVALID_DOSE`, `INVALID_UNIT`, `RESOURCE_NOT_FOUND`, `ACTION_APPLICATION_FAILED`, `ACTION_CANCELLATION_FAILED` e `EVENT_COLLECTION_FAILED`.

Os tipos TypeScript espelharão payloads e resultados. As operações antigas e seu envelope permanecerão inalterados.

## 6. Caso Ouro

Pasta: `lib/dynamic-osce/cases/gold/asthma-severe/`.

Identidade:

- ID `gold-asthma-severe-adult`;
- título `Crise Asmática Aguda Grave`;
- provider `pulse`;
- validação `gold`;
- população adulta;
- paciente fisiológico homem, 44 anos, 77 kg e 177 cm.

A narrativa clínica será fixa e separada. Ela cobrirá diagnóstico prévio, tratamento de controle e resgate, adesão, internações, UTI, intubação, alergias, tabagismo, gatilho, duração, tentativas prévias, sintomas associados e contexto social. Nenhum item narrativo alterará diretamente o engine.

A severidade final ficará definida somente depois da matriz real 0,30/0,55/0,75/0,85/0,90.

## 7. Timeline, apresentação e exame

### Timeline

Uma timeline própria e limitada registrará somente marcos: criação, baseline, ação, cancelamento, avanço, snapshot relevante, início/fim de evento, mudança de apresentação, solicitação de exame, erro e encerramento. Cada item terá ID, `sessionId`, tempo fisiológico, tipo, origem, título, dados e horário ISO. IDs de evento e assinaturas de apresentação evitarão duplicação.

### Apresentação

O interpretador puro combinará snapshot atual, baseline/histórico, duração, eventos e ações. Gravidade, aparência, fala, esforço, cianose, perfusão e avisos carregarão evidências explícitas. Queda de ventilação/volume corrente e aumento de CO2 terão precedência de segurança sobre uma aparente redução de sibilância.

### Exame adulto

A implementação React real foi localizada em `components/ExameFisicoAdultoVisual.tsx`, integrada por `app/caso/[id]/page.tsx`; o estado de manobras vive nessa página. O runner dinâmico isolado usa estado local em `components/dynamic-osce/DynamicCaseRunner.tsx`; não há store global que deva ser substituída.

As regras ficarão em módulo puro próprio do Caso Ouro. O resultado terá exame geral, respiratório, cardiovascular, neurológico e perfusão, com tempo, evidências e origem `pulse`, `medix-derived` ou `case-fixed`. Nesta etapa técnica, a CLI solicitará esse exame no instante corrente. O componente React, `onNovaManobra`/`onAchadoEncontrado`, `manobrasSolicitadas`, modal e pediatria permanecerão intactos.

## 8. Feature flag e exposição

Flag obrigatória: `MEDIX_PULSE_GOLD_ASTHMA_ENABLED=true`.

Sem o valor literal `true`, o serviço falhará antes de criar a sessão e a CLI não executará. Não haverá import com side effect, rota nova nem mudança do caso principal. A CLI permitirá lifecycle completo e cenários de calibração/validação, emitindo somente dados clínicos/técnicos sanitizados.

## 9. Arquivos previstos

### Criados

- `lib/dynamic-osce/pulse-runtime/python/action_dispatcher.py`;
- `lib/dynamic-osce/pulse-runtime/python/event_collector.py`;
- testes Python focais para dispatchers/eventos;
- módulos em `lib/dynamic-osce/cases/gold/asthma-severe/` para tipos, configuração, paciente, ações, eventos, timeline, apresentação, exame, cenários, serviço técnico e barrel;
- `lib/dynamic-osce/scripts/run-gold-asthma-pulse.mts`;
- testes Node unitários e de integração real em `tests/pulse-gold-asthma/`;
- `docs/RELATORIO-ETAPA-2-CASO-OURO-ASMA-PULSE.md`.

### Alterados

- protocolo, sessão, gerenciador e servidor Python da Etapa 1;
- protocolo, tipos, cliente e barrel TypeScript da Etapa 1;
- fixture e testes da Etapa 1 somente para cobrir compatibilidade das operações novas.

### Preservados

- `lib/dynamic-osce/pulse-local/` e runner experimental;
- `app/api/pulse/simulate/route.ts`;
- `lib/dynamic-osce/dynamic-state-engine.ts` e runner principal;
- `components/ExameFisicoAdultoVisual.tsx` e integração atual;
- todos os componentes pediátricos;
- casos existentes, incluindo o piloto de asma baseado em regras;
- configurações e dependências do projeto.

## 10. Calibração e validação

Cada severidade válida terá baseline, 30 s, 90 s, 210 s e 300 s, salvo interrupção por evento irreversível/falha segura. Serão coletadas as 13 medidas do snapshot e eventos. A escolha privilegiará alteração mensurável e progressiva, comprometimento ventilatório/oxigenação relevante, ausência de colapso imediato, resposta tratável e repetibilidade.

Depois serão executados em sessões novas, mas no mesmo processo persistente quando possível:

1. progressão sem tratamento;
2. oxigênio;
3. albuterol;
4. combinação;
5. tratamento tardio;
6. lifecycle completo com cancelamento e encerramento.

Comparações usarão tendências, invariantes, faixas e tolerâncias, não valores exatos congelados. Resultado inesperado do Pulse será registrado como limitação, não corrigido pelo MEDIX.

## 11. Testes e critérios de aceite

Serão executados:

- unitários Python para validação, mesma sessão/engine, ações, cancelamento e eventos;
- unitários Node para protocolo, cliente, timeline, apresentação, exame e flag;
- toda a suíte da Etapa 1;
- integração real dos seis cenários;
- typecheck;
- lint focal dos arquivos tocados;
- fluxo CLI manual;
- verificação de processos filhos;
- `git diff --check`, revisão de diff e status.

Aceite exige: uma sessão/engine persistentes; crise e tratamentos nativos; severidade calibrada; alterações mensuráveis; eventos coletados sem falsa origem; snapshot sem fallback; interpretação e exame puros; flag fechada por padrão; regressão da Etapa 1 verde; fluxo principal, pediatria e outros casos inalterados; nenhum commit/push.

## 12. Riscos e mitigação

- **Wrapper de inalador incompleto:** protobuf oficial + chamada nativa encapsulada, validada com integração real; falha explícita se a API interna não estiver disponível.
- **Evento com volume excessivo:** excluir somente eventos de ciclo e limitar histórico, preservando todos os eventos clínicos.
- **Crise extrema instável:** matriz gradual e parada segura diante de estado irreversível/falha.
- **Resposta clínica diferente da expectativa:** relatar medidas reais; nenhuma compensação sintética.
- **Efeito do albuterol depende da técnica respiratória:** reutilizar a sequência do cenário oficial e avançar tempo suficiente para completar o comando.
- **Árvore suja:** editar apenas arquivos planejados e revisar o diff focal, sem tocar no índice Git.
