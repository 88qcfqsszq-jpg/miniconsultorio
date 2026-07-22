# Relatório de auditoria completa — Pulse Engine × MEDIX

**Data:** 2026-07-19  
**Modo:** auditoria somente leitura; este relatório é a única gravação produzida.  
**Raiz MEDIX:** `/Users/marceloalmeida/Projetos/mini-consultorio-osce`  
**Raiz Pulse:** `/Users/marceloalmeida/Projetos/mini-consultorio-osce/.reference-local/engine-stable`

## 1. Resumo executivo

A cópia local contém o Pulse 4.3.2, seu código C++, API C, wrappers Python, binding PyPulse ARM64 e bibliotecas instaladas. O import local de `PyPulse` foi confirmado e informou versão `4.3.2`, hash curto `bb72983` e classe `PulseEngine`. Isso confirma carregamento do módulo, não uma simulação fisiológica atual completa.

O núcleo simula fisiologia adulta de corpo inteiro: química sanguínea, cardiovascular, drogas, endócrino, energia, gastrointestinal, hepático, nervoso, renal, respiratório e tecidos, além de ambiente, compartimentos e equipamentos. Oferece inicialização/estabilização, condições, ações, avanço por passo, requisições de dados, eventos, avaliações e persistência. Python expõe o fluxo essencial e grande parte das ações/condições por serialização, mas não espelha todos os objetos C++ como classes Python de alto nível.

O motor não produz somente números isolados: `DataRequest`s podem ser coletadas a cada passo e gravadas como séries em CSV. Há ECG sintético amostrado; classe/schema admitem 12 leads, mas `ecg/StandardECG.json` traz somente Lead III e três formas (sinusal, fibrilação ventricular e taquicardia ventricular). Não há evidência de ECG clínico de 12 derivações pronto. Pressão arterial, fluxos/volumes respiratórios e CO2 podem alimentar curvas. Não foi encontrado gerador dedicado de pletismografia/capnograma nem monitor interativo pronto. Há geradores Python de imagens estáticas a partir de CSV.

A integração MEDIX principal continua `medix-rule-based`. Os quatro casos beta declaram esse provider. Um experimento separado inicia um subprocesso Python por solicitação, somente para asma, simula do zero, lê apenas a última linha do CSV, normaliza poucos sinais e mostra resultado sem alterar o estado principal. Não há processo persistente, sessão incremental ou envio das intervenções da UI ao Pulse; o fallback é recomendado no retorno, não executado automaticamente pelo runner.

A distribuição local está incompleta para muitos exemplos: não contém os pacientes/estados referenciados, `substances/compounds` está vazio e cenários citam compostos ausentes como `Saline` e `PackedRBC`. O caminho Pulse declarado pelo caso de pneumonia também não existe. Presença de código/cenário, portanto, não equivale a execução garantida nesta cópia.

A API C tem opção CMake explicitamente destinada a iOS/WASM. Núcleo e fachada C são candidatos, mas não existe target Emscripten nem build WASM comprovado. Protobuf, filesystem e recursos JSON exigem adaptação/empacotamento; Python, pybind11 e o subprocesso Node atual não devem compor o runtime browser.

## 2. Escopo, método e limitações

Foram inventariados **20.116 arquivos do Pulse** e **33 arquivos da integração MEDIX** nos diretórios solicitados: **20.149 arquivos examinados por inventário e buscas automatizadas**. Arquivos-chave foram abertos diretamente por trechos/símbolos. “Examinado” não significa leitura manual integral de todo artefato gerado: 16.832 arquivos são do `build`, incluindo objetos e terceiros.

Foram usados comandos de leitura (`find`, `du`, `file`, `rg`, `sed`, `nl`, `git`) e import Python com `-B`/`PYTHONDONTWRITEBYTECODE=1`. Não houve instalação, rebuild, alteração do índice, teste pesado, nova simulação, commit ou push.

Limitações:

- O Pulse não contém `.git`; branch, tag e hash completo são **não confirmados**. O hash curto veio do artefato compilado.
- Não há `patients/` nem `states/` utilizáveis; muitos cenários referenciam arquivos ausentes. Executabilidade individual é **não confirmada**.
- Apenas o import nativo foi testado. Inicialização/simulação atuais não foram executadas para evitar workload potencialmente pesado.
- Artefatos gerados, documentação e checksums foram inventariados/buscados, não lidos integralmente.
- Não houve compilação WASM; a avaliação é estática inicial.
- O worktree já estava substancialmente alterado e foi preservado.

## 3. Versão auditada

| Item | Resultado | Evidência |
|---|---|---|
| MEDIX root | confirmado | `git rev-parse --show-toplevel` |
| MEDIX HEAD | `5ac96191a5d69c20390769027741c39858e408a3` | `git rev-parse HEAD` |
| Remote | `git@github.com:88qcfqsszq-jpg/miniconsultorio.git` | `git remote -v` |
| Submódulos | nenhum declarado/enumerado | sem `.gitmodules`; `git submodule status` vazio |
| Pulse | `4.3.2` | `.reference-local/engine-stable/CMakeLists.txt:46` |
| Build Pulse | hash curto `bb72983` | `build/Innerbuild/PulseConfig.cmake:32-33`; import PyPulse |
| Branch/tag/hash completo | **não confirmado** | Pulse sem `.git`; `.git/info/exclude:7` exclui `.reference-local/` |
| Licença | Apache 2.0 | `.reference-local/engine-stable/LICENSE:1-3` |
| Proveniência | Pulse/Kitware 2018–2025; fork BioGears 6.1.1; Eigen, protobuf, Abseil, pybind11 | `.reference-local/engine-stable/NOTICE:3-19` |
| README/CMake | presentes | `ReadMe.md`, `CMakeLists.txt`, `src/CMakeLists.txt`, `data/CMakeLists.txt` |

## 4. Caminhos auditados

- C/C++ e CDM: `.reference-local/engine-stable/src/c/`, `src/cpp/`
- Python/PyPulse: `.reference-local/engine-stable/src/python/`, `src/python/pybind/`
- Schema/protobuf: `.reference-local/engine-stable/src/schema/`
- Recursos: `data/`, `substances/`, `ecg/`, `environments/`, `config/`, `bin/`
- Build: `.reference-local/engine-stable/build/install/`
- Testes/validação/docs: `src/cpp/**/test*`, `data/human/adult/scenarios/validation/`, `docs/`
- MEDIX: `lib/dynamic-osce/pulse/`, `pulse-local/`, `scripts/`, `app/api/pulse/`, `components/dynamic-osce/`, casos/types/state engine.

## 5. Arquitetura confirmada

Fluxo nativo:

```text
SEPatientConfiguration ou estado serializado
  → Controller::InitializeEngine
  → estabilização/configuração dos sistemas
  → condições iniciais
  → SEAction / ProcessActions
  → Controller::AdvanceModelTime
  → EngineTracker + SEDataRequestManager
  → vetor numérico / CSV + eventos/logs
  → SerializeToFile/String
```

Evidências: `Controller::InitializeEngine` em `.reference-local/engine-stable/src/cpp/engine/common/controller/Controller.cpp:326-333`; `AdvanceModelTime` em `:601-701`; API C em `src/c/PulseEngineC.cpp:60-225`; Python em `src/python/pulse/engine/PulseEngine.py:77-219`.

Fluxo MEDIX experimental:

```text
PulseLocalExperimentPanel
 → POST /api/pulse/simulate
 → runPulseLocalAsthmaSimulation
 → novo subprocesso pulse_asthma_runner.py
 → PulseEngine → PyPulse.Engine/PulseEngineThunk
 → Controller + sistemas C++
 → CSV temporário
 → reader (última linha)
 → normalizePulseOutputs
 → pulseVitalsToPatientState
 → resposta isolada do painel
```

Evidências: `components/dynamic-osce/PulseLocalExperimentPanel.tsx`; `app/api/pulse/simulate/route.ts:33-93`; `lib/dynamic-osce/pulse-local/pulse-local-runner.ts:94-280`; `pulse_asthma_runner.py:97-170`; reader, normalizer e bridge em `lib/dynamic-osce/pulse/`.

Persistência JSON/binária em arquivo/string existe (`PulseEngineC.cpp:84-105`; `PulseEngine.py:77-118`), mas MEDIX não usa. Encerramento nativo: `Deallocate` (`PulseEngineC.cpp:65-69`). O runner termina em `pulse_asthma_runner.py:169-170`; o comentário “persistente” em `:5` contradiz o comportamento real.

## 6. Inventário resumido

Tamanho total Pulse: **1,3 GB**.

| Diretório | Arquivos | Tamanho | Função | Relevância |
|---|---:|---:|---|---|
| `build/` | 16.832 | 1,2 GB | objetos, terceiros, binários/instalação | contém PyPulse local; não é pacote web |
| `src/` | 1.819 | 41 MB | C/C++, Python, schemas, testes | motor/APIs |
| `data/` | 983 | 11 MB | cenários adultos/validação | templates; dependências ausentes |
| `docs/` Pulse | 377 | 59 MB | Doxygen, validação, imagens | referência, não UI |
| `cmake/` | 24 | 244 KB | build | futuro porte |
| `substances/` | 43 | 172 KB | substâncias JSON | catálogo incompleto |
| `bin/` | 13 | 92 KB | configs/utilitários | `VitalsMonitor.json` |
| `config/` | 1 | 36 KB | config do engine | runtime |
| `ecg/` | 1 | 16 KB | ondas ECG | Lead III, três tipos |
| `environments/` | 1 | 4 KB | ambiente | runtime |

Extensões predominantes: `.h` 3.551; `.make` 2.552; `.cpp` 1.693; `.cmake` 1.474; `.o` 960; `.d` 960; `.cc` 950; sem extensão 923; `.txt` 900; `.py` 610; `.java` 585; `.ts` 518; `.sha512` 454; `.cs` 436; `.proto` 389; `.json` 305; `.a` 204; `.png` 185; `.c` 147; `.md` 144.

```text
engine-stable/
├── src/c/                         API C/ABI
├── src/cpp/cdm/                   modelo de dados
├── src/cpp/engine/common/         controlador/modelos
├── src/python/pulse/              wrapper/serialização
├── src/python/pybind/             PyPulse
├── src/schema/pulse/              protobuf
├── data/human/adult/scenarios/    226 cenários JSON
├── substances/                    43 JSON; compounds vazio
├── ecg/StandardECG.json           Lead III
├── environments/                  ambiente
├── docs/                          docs/gráficos
└── build/install/                 artefatos ARM64
```

Não foram encontrados pacientes/estados em arquivo nem catálogo pediátrico.

## 7. API Python e PyPulse

| Python | C++/binding | Entrada/saída | Local | MEDIX |
|---|---|---|---|---|
| `PulseEngine` | `PyPulse.Engine`/`PulseEngineThunk` | modelo + root → engine | import confirmado | runner asma |
| `initialize_engine` | `InitializeEngine` | paciente + requests → bool | binding presente | sim |
| serialize file/string | métodos homônimos | JSON/binário → bool/string | presente | não |
| `process_action(s)` | `ProcessActions` | ações serializadas | presente | asma apenas |
| `advance_time(_s)` | `AdvanceTimeStep` | passo/duração → bool | presente | uma duração integral |
| `pull_data` | `PullDataPtr` | array NumPy de double | presente | CSV/final |
| eventos/logs | pull/keep handlers | JSON/callbacks | presente | não |
| config override | `SetConfigurationOverride` | JSON → bool | presente | não |
| `EnginePool` | `PulseEnginePool` | múltiplos engines | presente | não |

Fontes: `.reference-local/engine-stable/src/python/pulse/engine/PulseEngine.py:21-243`; `src/python/pybind/PulseEngines.cpp:16-55`; `src/python/pybind/PyPulse.cpp:20-66`.

O enum Python declara corpo inteiro, mecânica ventilatória e hemodinâmica (`PulseEngine.py:22-25`), mas o construtor traduz explicitamente apenas mecânica ventilatória; os demais caem em corpo inteiro (`:39-44`). O binding expõe dois valores. Seleção Python de hemodinâmica: **não confirmada/possivelmente incorreta**.

`SEDataRequest` cria requests de paciente, fisiologia, ambiente, ação, compartimentos gasoso/líquido/térmico/tecidual, substância e equipamentos (anestesia, BVM, ECG, ECMO, inalador, ventilador): `src/python/pulse/cdm/engine.py:467-633`. `SEDataRequestManager` define filename e amostras/s (`:736-757`). Esse mecanismo genérico, não getters Python por sistema, expõe a maior parte dos escalares. Serializadores estão em `src/python/pulse/cdm/io/`.

Condições Python em `patient_conditions.py`: ARDS, anemia crônica, insuficiência cardíaca crônica (marcador), DPOC, derrame pericárdico crônico, estenose renal, disfunção sistólica ventricular, desidratação, troca alveolar prejudicada, pneumonia, fibrose, shunt e sepse. `SEConsumeMeal` existe no C++, não foi encontrado como condição Python nesse módulo.

Ações Python em `patient_actions.py`: exacerbação ARDS, estresse, obstrução, arritmia, asma, lesão cerebral, broncoconstrição, modificação cardiovascular, compressões manual/automática/instantânea, curativo oclusivo, exacerbação DPOC, respiração consciente, nutrientes, dispneia, exercício, hemorragia, hemotórax, troca alveolar, intubação, ventilação, descompressão, derrame pericárdico, pneumonia, shunt, fadiga, mecânica respiratória, bolus/infusões, oxigênio, pneumotórax, toracostomia e micção.

Python possui BVM, ECMO, ventilador e ambiente. Máquina de anestesia/falhas e configuração de inalador existem no C++, mas equivalentes Python de topo não foram encontrados; `SEUseInhaler` existe. Falhas são sobretudo bool/logs/exceções genéricas, sem hierarquia pública específica.

## 8. Núcleo C++

Símbolos centrais: `Controller::InitializeEngine/AdvanceModelTime` em `src/cpp/engine/common/controller/Controller.cpp`; `pulse::Engine` em `src/cpp/engine/common/Engine.cpp`; `EngineTracker`; persistência `PBState` em `src/cpp/engine/io/protobuf/PBState.cpp`; fachada C completa em `src/c/PulseEngineC.cpp:60-235`.

| Artefato | Arquitetura | Tamanho |
|---|---|---:|
| `build/install/bin/PyPulse.cpython-39-darwin.so` | Mach-O ARM64 | 10.566.576 B |
| `build/install/bin/libPulseC.dylib` | Mach-O ARM64 | 13.986.592 B |
| `build/install/lib/libPulseC.dylib` | Mach-O ARM64 | 13.986.592 B |
| `build/install/bin/PulseScenarioDriver` | Mach-O ARM64 | 13.988.240 B |
| `build/install/lib/libPulse.a` | estático | 80.298.808 B |
| `build/install/lib/libPulseTests.a` | estático | 22.966.792 B |

Build Release, Python 3.9 do Xcode. Pode ser usado imediatamente como artefato ARM64/Python 3.9, limitado pelos recursos ausentes. `libPulse.a`, `libPulseC.dylib` e driver existem; cenários com pacientes/estados/compostos ausentes não são garantidos.

## 9. Sistemas fisiológicos

| Sistema real | Arquivos/classes | Saídas representativas | Python/MEDIX |
|---|---|---|---|
| Química sanguínea/hematologia | `BloodChemistryModel.*`, `SEBloodChemistrySystem.h` | pH, base excess, BUN, hematócrito, Hb, saturações, osmolalidade, RBC/WBC, PaO2/PaCO2 | DataRequest; MEDIX só opcionais mínimos |
| Cardiovascular | `CardiovascularModel.*`, `SECardiovascularSystem.h` | HR/ritmo, PA/sis/dia/MAP, CVP, CO, SV, EF, volume/resistência/perfusão | request; MEDIX HR/PA final |
| Respiratório | `RespiratoryModel.*`, `SERespiratorySystem.h` | FR, tidal, ventilação, EtCO2, FiO2, PEEP, pressões, complacência, resistência, I:E | request; MEDIX FR/SpO2 |
| Renal | `RenalModel.*`, `SERenalSystem.h` | GFR, fluxos/resistência, urina | request; não usado |
| Nervoso | `NervousModel.*`, `SENervousSystem.h` | pupilas, respostas e métricas cerebrais | request; não usado |
| Endócrino | `EndocrineModel.*`, `SEEndocrineSystem.h` | insulina | request; não usado |
| Energia/temperatura | `EnergyModel.*`, `SEEnergySystem.h` | temperaturas, metabolismo, suor | request; temperatura MEDIX não vem do runner |
| GI | `GastrointestinalModel.*`, `SEGastrointestinalSystem.h` | nutrientes/absorção | request; não usado |
| Hepático | `HepaticModel.*`, `SEHepaticSystem.h` | modelo existe; nenhum escalar público no header | saída direta não confirmada |
| Tecidos/metabolismo | `TissueModel.*`, `SETissueSystem.h` | consumo O2, CO2, fluidos, pH intracelular | request; não usado |
| Drogas PK/PD | `DrugModel.*`, `SEDrugSystem.h` | concentrações/efeitos | ações expostas; não MEDIX |
| Ambiente | `EnvironmentModel.*` | gases, pressão, temperatura | Python; não MEDIX |
| Compartimentos | `src/cpp/cdm/compartment/` | gases, líquidos, tecido, térmico, substâncias | request genérico |
| Equipamentos | `engine/common/system/equipment/` | seis famílias | parcial; não integrado |

Diretórios principais: `.reference-local/engine-stable/src/cpp/engine/common/system/physiology/` e `src/cpp/cdm/system/physiology/`.

Não há sistema separado chamado imunológico. Hematologia está em química sanguínea; metabolismo/temperatura atravessam energia/tecido/endócrino/ambiente; fluidos, eletrólitos e ácido-base atravessam compartimentos, renal, química sanguínea e saturação.

## 10. Doenças, condições e lesões

Legenda: **C** condição basal; **A** ação/insulto; **E** cenário/exemplo; **NF** não encontrado como recurso específico.

| Tema | Classe/parâmetros | Tipo | Evidência/observação |
|---|---|---|---|
| Asma | `SEAsthmaAttack`, severidade 0–1 | A/E | `patient_actions.py`; `AsthmaAttack*Acute.json` |
| DPOC | `SEChronicObstructivePulmonaryDisease` + `SECOPDExacerbation`; bronquite/enfisema | C/A/E | condition/action modules; `COPD*.json` |
| Pneumonia | condição/exacerbação, severidade por pulmão/lobo | C/A/E | `SEPneumonia*`; `Pneumonia*.json` |
| ARDS | condição/exacerbação por pulmão | C/A/E | `SEAcuteRespiratoryDistressSyndrome*`; `ARDS*.json` |
| Pneumotórax hipertensivo | aberto/fechado, lado, severidade | A/E | `SETensionPneumothorax`; cenários correspondentes |
| Hemotórax | lado, severidade/fluxo | A/E | `SEHemothorax`; `HemothoraxVaried.json` |
| Derrame pericárdico | condição crônica/ação com taxa | C/A/E | `SEChronicPericardialEffusion`, `SEPericardialEffusion` |
| Fibrose/shunt/troca alveolar | severidade/área/fração conforme classe | C/A/E | conditions/actions e cenários |
| Insuficiência cardíaca/disfunção sistólica | marker/disfunção ventricular | C/E | `SEChronicHeartFailure`, `SEChronicVentricularSystolicDysfunction` |
| Arritmias | `SEArrhythmia`, enum de ritmo | A/E | `scenarios/acls/`; ECG limitado |
| Hemorragia/choque | compartimento, tipo, fluxo ou severidade | A/E/evento | `SEHemorrhage`; muitos cenários |
| Sepse | condição/severidade | C/E | `SESepsis`; `Sepsis.json` |
| Anemia | redução crônica | C/E | `SEChronicAnemia`; `Anemia30.json` |
| Lesão cerebral | tipo/severidade | A/E | `SEBrainInjury`; `BrainInjury.json` |
| Obstrução/broncoespasmo/dispneia/fadiga | severidades específicas | A/E | ações correspondentes |
| Estenose renal/desidratação | lado/severidade; perda hídrica | C/E | conditions e cenários |
| Estresse/exercício | severidade/intensidade | A/E | `SEAcuteStress`, `SEExercise` |
| TEP | não encontrado | NF | buscas por embolism/embol* nos sources/cenários |
| IAM | não encontrado como condição/ação | NF | há evento de déficit de O2 miocárdico, não `MyocardialInfarction` |
| Hipertensão | saída/evento, não condição específica | evento | pressão consultável; sem condition/action própria encontrada |
| Queimadura | não encontrada | NF | aplicação térmica/heat stroke não equivalem a queimadura |
| Dor | escala/ação fisiológica dedicada não encontrada | NF | texto MEDIX é rule-based |
| Febre | hipertermia/evento/ambiente, sem condição específica | evento/efeito | `eEvent.Hyperthermia`, Energy/Environment |
| Insuficiência renal | não encontrada como condição explícita | NF | renal model/estenose existem |
| Intoxicações | exposição/substâncias/cenários específicos | A/E | CO e ações de droga, não catálogo universal |
| Pediatria | não encontrada | NF | somente `human/adult` |

Progressão não é campo uniforme. Cenários aplicam condição inicial ou ação; duração/evolução decorrem do avanço do modelo. Fluxo/taxa controlam evolução onde a classe os aceita.

## 11. Ações e intervenções

| Intervenção | Implementação/parâmetros | Python | Exemplo | MEDIX |
|---|---|---|---|---|
| O2 cânula/máscaras | `SESupplementalOxygen`: device, fluxo, volume | sim | NasalCannula/SimpleMask/NonRebreather | não |
| Ventilação não/invasiva | CPAP, pressure/volume control; pressão/fluxo/estado | sim | equipment scenarios | não |
| Intubação | `SEIntubation`, tipo | sim | esofágica/mainstem | não |
| BVM | config, squeeze automático/instantâneo | sim | BVM scenarios | não |
| Fluidos/transfusão | compound, taxa, bag volume | sim | Saline/PackedRBC referenciados | não; dados ausentes |
| Bolus/infusão | rota, dose, concentração, duração/taxa/volume | sim | 19 drug scenarios | não |
| Vasopressor/inotrópico | bolus/infusão | sim | epinefrina, norepi, fenilefrina | não |
| Broncodilatador | `SEUseInhaler`/albuterol | sim | inhaler/albuterol | não |
| Sedação/analgesia/bloqueio | via substância | sim | propofol, benzodiazepínicos, opioides, ketamine, bloqueadores | não |
| Corticoide | prednisone | sim via substância | cenário | não |
| Antibiótico | substância/cenário não encontrados | não confirmado | não | não |
| Compressões | força/profundidade/período; auto/instantânea | sim | ACLS | não |
| Drenagem/descompressão | tube thoracostomy/needle: lado, fluxo/estado | sim | pneumotórax | não |
| Curativo oclusivo | lado/estado | sim | source | não |
| Nutrição | arquivo/objeto | sim | nutrition | não |
| Micção | `SEUrinate` | sim | source | não |
| Posição | ação específica não encontrada | não | não | não |
| Desfibrilação/cardioversão | ação de choque/energia não encontrada | não | transição por arritmia não é choque | não |
| Marcapasso/torniquete/diálise | não encontrados | não | não | não |
| Nebulizador | não; inalador existe | não | não | não |

Unidades tipadas estão em `src/python/pulse/cdm/scalars.py`; rotas no enum da ação de substância. O resultado fisiológico é computado pelos sistemas acoplados, não retornado como efeito causal separado. MEDIX não envia essas ações: `components/dynamic-osce/DynamicCaseRunner.tsx:130-141` usa `applyIntervention` local.

## 12. Medicamentos e substâncias

Há **43 JSONs** em `substances/`: Acetoacetate, Albumin, Albuterol, Bicarbonate, Calcium, formas de hemoglobina, CarbonDioxide, CarbonMonoxide, Chloride, Creatinine, Desflurane, Epinephrine, Etomidate, Fentanyl, Furosemide, Globulin, Glucose, Insulin, Ketamine, Lactate, Lorazepam, Midazolam, Morphine, Naloxone, Nitrogen, Norepinephrine, Oversedation, Oxygen, Phenylephrine, Potassium, Pralidoxime, Prednisone, Propofol, Rocuronium, Sodium, Succinylcholine, Tristearin e Urea.

Há 19 cenários em `data/human/adult/scenarios/drug/`: broncodilatador, anestésicos/sedativos, opioides, naloxona, vasopressores, furosemida, pralidoxima, prednisona e bloqueadores neuromusculares.

Sete JSONs locais contêm seções de PK/clearance nas buscas; nenhuma chave literal `Pharmacodynamics` foi encontrada. Isso não prova ausência de PD no código, mas prova ausência dessa configuração explícita no catálogo local. Albuterol contém dados físicos, sem PK/PD explícita no JSON; norepinefrina contém clearance sistêmico.

`substances/compounds/` existe vazio. `Saline`, `PackedRBC` e `Blood` são citados por cenários e não foram encontrados. A ação de fluido/transfusão existe, mas os compostos não estão prontos nesta cópia. Interação droga-droga configurável: **não confirmada**.

## 13. Equipamentos

Modelos C++: `.reference-local/engine-stable/src/cpp/engine/common/system/equipment/`.

| Equipamento | C++ fisiológico | Python | Visual | MEDIX |
|---|---:|---:|---:|---:|
| Ventilador | sim | sim | plots estáticos | não |
| Máquina anestesia | sim + falhas | equivalente Python não encontrado | não | não |
| BVM | sim | sim | não | não |
| ECMO | sim | sim | não | não |
| ECG | sim | DataRequest | não interativo | não |
| Inalador | sim | `UseInhaler`; config não encontrada | não | não |
| Cânula/máscaras O2 | ação, não equipamento independente | sim | não | não |
| Oxímetro | leitura SpO2, não equipamento separado | request | não | valor final |
| Capnógrafo | leitura/plot CO2, não equipamento dedicado | request | estático | não |
| Monitor | não como equipamento | utilitário Python | imagem estática | painel próprio sem ondas |
| Bomba | ação de infusão, não equipamento | sim | não | não |
| Desfibrilador/marcapasso/diálise/nebulizador | não encontrados | não | não | não |

## 14. Sinais vitais e dados

Propriedades públicas dos `SE*System.h` podem, em princípio, ser solicitadas por nome, se o modelo as reconhecer e produzir valor válido. Saída: NumPy; CSV quando há `ResultsFilename`. Tempo é índice 0 (`PulseEngine.py:202-204`). `SamplesPerSecond` reduz amostragem; sem redução, a coleta pode ocorrer por timestep. A taxa efetiva exige execução/configuração; histórico local registrou 0,02 s.

| Propriedade interna | Origem/unidade típica | Contínua/Python | MEDIX |
|---|---|---|---|
| `HeartRate`, `HeartRhythm` | cardiovascular; 1/min/enum | request/action | HR final; ritmo não |
| `ArterialPressure`, sis/dia/MAP | cardiovascular; mmHg | sim, série | sis/dia finais |
| `CentralVenousPressure` | cardiovascular; mmHg | sim | não |
| CO/CI/SV/EF | cardiovascular | sim | não |
| resistências/perfusão/volumes | cardiovascular | sim | não |
| FR/tidal/minute ventilation | respiratório | sim | FR; tidal solicitado e descartado |
| `OxygenSaturation`/`PulseOximetry` | química; unitless | sim | SpO2 final |
| PaO2/PaCO2 | química; mmHg | sim | opcionais; runner não pede |
| EtCO2 pressure/fraction | respiratório | sim | fração pedida, mas reader não preserva |
| FiO2 | respiratório | sim | não |
| pH/base excess/bicarbonato/lactato | química/substância | sim | pH opcional; runner não pede |
| eletrólitos/glicose | substance/compartment | sim | não |
| core/skin temperature | energia; °C | sim | UI mostra; runner não pede, fallback 37,0 |
| urina/GFR | renal | sim | não |
| resistência/complacência/pressões | respiratório | sim | algumas opcionais, sem UI |
| Ht/Hb/blood volume | química/cardio | sim | não |
| consciência/dor | escala dedicada não encontrada | não confirmado | texto rule-based |

Fontes: `src/cpp/cdm/system/physiology/SEBloodChemistrySystem.h`, `SECardiovascularSystem.h`, `SERespiratorySystem.h`, `SERenalSystem.h`, `SEEnergySystem.h`, `SETissueSystem.h`; requests padrão em `src/python/pulse/engine/PulseEngine.py:57-74`; `bin/VitalsMonitor.json`.

## 15. ECG, waveforms e séries temporais

| Pergunta | Resposta | Evidência |
|---|---|---|
| Só números instantâneos? | Não; há séries por passo/CSV | `PulseEngine.py:153-185`; EngineTracker |
| Séries temporais? | Sim, para requests válidas | `Controller.cpp:698-701`; manager `:736-757` |
| Sinal ECG? | Sim, potencial elétrico amostrado | `SEElectroCardioGram.h:29-85`; request padrão |
| Derivações? | Modelo Lead1–12; dados locais só Lead3 | `ElectroCardioGram.proto:18-65`; `StandardECG.json:4,299,596` |
| Pleth? | Não encontrada como onda dedicada; SpO2 é valor | buscas por pleth/plethysmography |
| Capnografia? | Sem gerador dedicado; CO2 por passo pode ser plotado | request Carina CO2; `generate_monitors.py:150-156` |
| Curva respiratória? | Séries de fluxo/volume/pressão; sem objeto pronto | `SERespiratorySystem.h` |
| Curva PA? | `ArterialPressure` por timestep | `PulseEngine.py:61`; plotter |
| CSV? | Sim | manager + runner |
| Visualização? | Offline/estática via pandas/matplotlib | `generate_monitors.py`, `plotter.py` |
| Monitor pronto? | Config/JPG, não UI interativa | `bin/VitalsMonitor.json` |
| Código para MEDIX? | Sim, dados; falta sessão/streaming/UI | DataRequest/PullData |

`ElectroCardioGramModel.cpp:80-169` mapeia sinusal/bradi/taqui/PEA para onda sinusal, assistolia para sinal limpo, VF para VF e VT para VT; ritmos não suportados geram erro. `SEElectroCardioGramWaveform.cpp:95-135` interpola ao timestep. É ECG sintético por templates, não aquisição/diagnóstico 12-lead.

O MEDIX lê somente a **última linha** do CSV (`lib/dynamic-osce/pulse/pulse-real-output-reader.ts:9-11`), descartando a série. A UI não desenha ondas.

## 16. Imagens, gráficos e interfaces

Inventário: 185 PNG, 42 JPG, 1 JPEG, 5 SVG, 1 GIF, nenhum BMP. Cerca de 220 imagens estão em `docs/`, 12 em terceiros do build e duas fora desses grupos (`bin/resource/pulse_logo.png` e gráfico de dados). Predominam documentação, diagramas, screenshots e validação; presença não comprova componente executável.

`generate_monitors.py:112-175,228-230` lê CSV e salva JPG de monitor/ventilador. `plotter.py` gera comparações; `data/config/PlotRun.json` configura plots. Não foi encontrada aplicação Qt/QML ou dashboard web runtime; HTML/CSS/JS concentra-se em docs/terceiros.

Podem ser reutilizados imediatamente os números/séries, e plots como referência. Imagens exigem análise de finalidade, licença/NOTICE e validade clínica. Gerador estático não substitui componente streaming React/canvas.

## 17. Eventos e alertas

`eEvent` lista 51 eventos fisiológicos e seis de equipamento em `src/python/pulse/cdm/engine.py:52-112`: antidiurese/diurese/natriurese, bradi/taquicardia, bradi/taquipneia, hipóxia/hiperoxemia, hipo/hipercapnia, hipo/hiperglicemia, hipo/hipernatremia, hipo/hipertermia, déficit cerebral/miocárdico de O2, distúrbios ácido-base, cetoacidose, acidose láctica, desidratação, hemotórax, choques, colapso, parada, estado irreversível, ciclos e estabilização; equipamento inclui gases/relief/BVM.

Callbacks/ativos: `PulseEngine.py:139-145,190-195,221-243`; API C `PulseEngineC.cpp:134-180`. Critérios estão nos modelos e não equivalem a configuração de alarme.

Eventos podem alimentar comportamento, alarmes, timeline, feedback e narrativa, mas exigem adapter/interpretação. “Melhora” não é evento genérico: deve ser inferida por tendência/desativação. “Morte” é representada operacionalmente por estado irreversível/parada, não por evento literal universal confirmado. MEDIX não consome eventos Pulse.

## 18. Pacientes e estados

`SEPatient` admite nome, sexo, idade, peso, altura e características basais; `SEPatientConfiguration` aceita paciente embutido/arquivo, condições e data root. O runner cria homem de 44 anos, 77 kg, 177 cm (`pulse_asthma_runner.py:103-110`).

Nenhum paciente pronto foi encontrado em `patients/`; nenhum estado em `states/`. Cenários e `bin/VitalsMonitor.json` citam `StandardMale.json`; logs/exemplos citam `Soldier@0s.json`. Portanto, **nenhum paciente/estado de arquivo é imediatamente carregável nesta cópia**. Inicialização programática adulta consta como bem-sucedida em relatório histórico, não foi repetida agora.

Só `human/adult` foi encontrado. Não há fisiologia/presets pediátricos; mudar idade/peso não valida pediatria. Sexo/antropometria existem, mas diferenças sexuais não foram avaliadas.

## 19. Testes, exemplos e validação

- 48 HowTos Python em `src/python/pulse/howto/`;
- 44 HowTos C++ em `src/cpp/howto/`;
- 42 arquivos-fonte/header de testes C++;
- 226 cenários JSON adultos;
- 283 arquivos ligados à validação;
- 454 checksums `.zip.sha512`;
- 46 CSVs fora do build;
- drivers `PulseTestsDriver` e `HowToDriver`.

`src/cpp/cdm/test/WaveformInterpolatorTest.cpp:54-84` testa ciclos ECG. Configs de plot/comparadores servem a regressão. Checksums não são os golden CSVs; `Pulse_DOWNLOAD_BASELINES` está OFF (`CMakeLists.txt:88`).

Aplicação futura: cenários/HowTos e snapshots para integração; mesma entrada e tolerância para nativo×WASM; baselines completos para regressão; teste do interpolador para ECG. Nenhum teste foi executado agora. Logs existentes (`PulseScenarioDriver.log`, `build/install/bin/test_results/howto/test_init.log`) contêm falhas de resolução de recursos; logs antigos não provam saúde atual.

## 20. Integração atual com MEDIX

### Tipos, contrato e adapters

`SimulationProvider` aceita apenas `"medix-rule-based" | "pulse"` em `lib/dynamic-osce/types.ts:10-11`; não aceita `pulse-local` ou `hybrid` como provider real. Um tipo de compatibilidade sugere híbrido em `:270-299`.

`pulse-adapter.contract.ts:9-10` define `PULSE_EXECUTION_ENABLED=false`. O contrato prevê criar sessão, aplicar ação, avançar, obter outputs e terminar (`:25-72`), mas o adapter é stub e lança erro (`:75-83`). `pulse-experimental-adapter.ts` usa fixture de asma e mantém execução desabilitada.

`pulse-action-map.ts`, `pulse-capability-map.ts`, `pulse-output-map.ts` e `pulse-scenario-templates.ts` são declarativos/documentais, não execução; alegações neles não provam paridade nativa.

### Estado, tempo, ações, falha e fallback

- `dynamic-state-engine.ts:1-7`: motor determinístico sem Pulse; mantém `PatientState` e aplica regras.
- `DynamicCaseRunner.tsx:130-141`: intervenções chamam `applyIntervention`, não Pulse.
- Tempo: incrementos locais fixos de 3/5 min (`DynamicCaseRunner.tsx:36-38`), sem timestep Pulse.
- Cada POST cria novo subprocesso (`pulse-local-runner.ts:137-161`), paciente e simulação. Sem session id/restauração.
- Timeout mata com `SIGKILL` (`:266-279`); API devolve 503 (`route.ts:71-81`).
- Falha contém `fallbackRecommended:true` (`:43-49,243-245`), mas runner não chama rule engine automaticamente.
- CSV temporário único (`:134-135`); remoção posterior não encontrada.
- GET health retorna pronto sem testar binário/import (`route.ts:19-21`).
- Única rota: `GET/POST /api/pulse/simulate`. Faltam create/apply/advance/state/terminate e streaming.

### Saída ao PatientState/UI

`PatientState` tem FC, FR, PA sis/dia, SpO2, temperatura, textos e marcadores (`types.ts:18-70`). Normalizer cobre esses seis e opcionais pH/gases/resistências (`pulse-output-normalizer.ts:21-78`). Bridge copia vitais, regenera textos por regras e preserva marcadores (`pulse-medix-bridge.ts:27-87`).

Runner pede HR, PA sis/dia, FR, SpO2, tidal e fração EtCO2 (`pulse_asthma_runner.py:112-120`). Reader não preserva tidal/EtCO2. Temperatura não é pedida; normalizer usa fallback 37,0. Painel experimental mostra SpO2, HR, FR, PA/textos. Painel principal mostra seis vitais e texto derivado (`DynamicPatientStatePanel.tsx:67-85`), sem ondas.

## 21. Estado dos quatro casos beta

| Caso | Provider real | Referência Pulse | Estado real |
|---|---|---|---|
| Asma grave | `medix-rule-based` | `AsthmaAttackSevereAcute.json`; `pulseReady:true`; híbrido sugerido | único runner real experimental; simula do zero; não altera fluxo principal |
| Pneumotórax | `medix-rule-based` | `TensionPneumothoraxClosedVaried.json` | cenário existe; sem runner/adapter real |
| DPOC | `medix-rule-based` | `COPDExacerbation.json` | cenário existe; sem execução MEDIX real |
| Pneumonia grave | `medix-rule-based` | declara `.../patient/Pneumonia.json` | caminho **não existe**; há `PneumoniaExacerbation.json` e cenários graves; sem runner |

Evidências: casos em `lib/dynamic-osce/cases/` (campos `simulationProvider`, `pulseReady`, `pulseScenarioId`, `compatibility`). Painel Pulse só para asma: `DynamicCaseRunner.tsx:264-266`.

`pulseReady:true` é intenção/compatibilidade catalogada, não prontidão operacional. Os quatro executam o estado clínico principal por regras.

## 22. Lacunas reais da interface

1. Adapter runtime com instância/sessão por caso.
2. Tradução validada de intervenção → ação Pulse, com início/cancelamento/dose/rota/unidade.
3. Relógio único UI/timestep, avanço incremental e restauração.
4. Streaming/buffer de séries, não última linha de CSV.
5. Requests para valores exibidos; hoje temperatura é fallback e tidal/EtCO2 são descartados.
6. Componentes waveform para ECG III, PA, respiração/CO2; pleth nativa não existe.
7. Eventos convertidos em alarme/narrativa/feedback com critérios versionados.
8. Pacientes, estados, compounds e baselines completos/licenciados.
9. Runners para pneumotórax/DPOC/pneumonia e caminho válido de pneumonia.
10. Isolamento, concorrência, cancelamento, persistência e limpeza de temporários.
11. Health real/observabilidade; autenticação/rate limiting da rota não encontrados.
12. Validação clínica e regressão por caso/intervenção.
13. Estratégia pediátrica separada.
14. Desenvolvimento externo/nativo para requisitos não encontrados: choque elétrico, pacing, diálise, torniquete, queimadura, TEP/IAM específicos, dor e pleth.

## 23. Avaliação inicial de WebAssembly

| Componente | Classificação | Evidência/razão |
|---|---|---|
| Núcleo C++ single-engine | provavelmente compatível, a validar | C++ estático; sem sockets no core encontrados; não compilado |
| API C `PulseEngineC` | melhor candidata | `CMakeLists.txt:83-97`: `Pulse_C_AS_STATIC` para iOS/WASM; `src/c/CMakeLists.txt:1-12` |
| Eigen | provavelmente compatível | header/template; versão não testada |
| Protobuf | requer adaptação | link obrigatório; cross-compile previsto por `Pulse_NATIVE_BUILD_DIR` |
| Filesystem/recursos | requer adaptação | patients/states/substances/config/ECG/ambiente por path; precisa VFS/embedding |
| Scenario executor/ThreadPool/Pool | requer adaptação | `PulseScenarioExec.cpp`, `cdm/utils/ThreadPool.h`; pthreads ou exclusão |
| Python/PyPulse | incompatibilidade provável no runtime browser | extensão CPython 3.9 nativa; dispensável com API C |
| Node `spawn` atual | incompatível no browser | `pulse-local-runner.ts:247-280` |
| Dylibs Mach-O ARM64 | incompatíveis | exigem recompilação |
| Exceções/RTTI | não avaliado | flags/uso não compilados/auditados integralmente |
| APIs de SO | requer revisão | macros/filesystem multiplataforma |
| Sockets | não encontrados no core | busca estática, não prova formal em terceiros |

Caminho inferido, não executado: recortar `Pulse`+`PulseC`, gerar protobuf via build nativo, Emscripten, empacotar só recursos necessários, expor lifecycle/action/advance/pull/serialize e comparar com nativo. Tamanho/memória/desempenho WASM: **não confirmados**.

## 24. Matriz Pulse × MEDIX

Legenda: S sim; P parcial; N não; NC não confirmado.

| Recurso | C++ | Python | Teste local | MEDIX | UI | Agora | Adapter | Novo dev | Evidência/nota |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Sistemas adultos | S | P/request | import | P/asma | P | P server | S | S | models/runner |
| Doenças respiratórias | S | S | asma histórica | asma P | regras | P | S | S | actions/conditions |
| Trauma/hemorragia | S | S | N | N | regras | P | S | S | actions/scenarios |
| Arritmias | S | S | N | N | N | P | S | S | ACLS |
| Medicamentos | S | S | N | N | N | P | S | S | catálogo incompleto |
| Fluidos/transfusão | S | S | N | N | N | N nesta cópia | S | recursos | compounds ausentes |
| Ventilador/BVM/ECMO | S | S | N | N | N | P | S | S | equipment |
| Máquina anestesia | S | P/NC | N | N | N | P C++ | S | S | C++/cenários |
| Vitais | S | S | histórico | P 6 finais | S numérico | S | S | P | requests/normalizer |
| Dados amplos | S | S genérico | N | mínimo | N | S server | S | P | system headers |
| Eventos | S | S | N | N | N | S API | S | S | eEvent |
| ECG Lead III | S | S request | N | N | N | S numérico | S | UI | StandardECG |
| ECG 12-lead clínico | modelo S/dados N | P | N | N | N | N | S | dados/dev | só Lead III |
| PA/resp/CO2 séries | S | S | histórico | descartadas | N | S | S | UI | per-step |
| Pleth | N encontrada | N | N | N | N | N | — | S | busca |
| CSV | S | S | histórico | última linha | N | S | S | P | reader |
| Plots/imagens | utilitário | S estático | N | N | N | P offline | P | UI | plotters |
| Adulto programático | S | S | histórico | asma | indireto | S | P | P | runner |
| Paciente/estado em arquivo | API S; dados N | S | N | N | N | N | P | recursos | ausentes |
| Pediatria | N | N | N | N | N | N | — | alternativa | adult only |
| Persistência | S | S | N | N | N | S API | S | S | serialize |
| Processo persistente | possível | possível | N | N | N | N atual | S | S | runner encerra |
| Performance | artefato/histórico | histórico | não agora | N | N | NC | — | testes | sem medição |
| WASM | opção C | Python N | N | N | N | N | S | S | sem target Emscripten |

## 25. Recomendações priorizadas

Sem implementar nesta auditoria:

1. **P0 — restaurar/verificar recursos runtime:** obter pacientes, estados, compounds e baselines compatíveis com o hash auditado; verificar licença/checksum.
2. **P0 — contrato de sessão:** implementar o contrato já desenhado (create/apply/advance/output/serialize/terminate), inicialmente server-side nativo.
3. **P0 — equivalência:** requests, ações e tolerâncias por caso antes de substituir regras clínicas.
4. **P1 — expansão incremental:** asma persistente primeiro; depois pneumotórax, DPOC e pneumonia com caminhos válidos.
5. **P1 — séries:** buffer/streaming de ECG III, PA, respiração e CO2; não somente última linha.
6. **P1 — eventos/tratamentos:** tradução bidirecional, unidades, cancelamento e eventos.
7. **P1 — ausência explícita:** não usar fallback 37,0 como se fosse saída Pulse.
8. **P2 — WASM isolado:** PulseC mínimo, recurso embutido, comparação/tolerância nativo×WASM e medição real.
9. **P2 — exclusões:** não anunciar pediatria ou recursos não encontrados como capacidades.

## 26. Lista de evidências principais

| Conclusão | Arquivo/símbolo |
|---|---|
| Versão 4.3.2 | `.reference-local/engine-stable/CMakeLists.txt:46` |
| Lifecycle C | `.reference-local/engine-stable/src/c/PulseEngineC.cpp:60-225` |
| Wrapper Python | `src/python/pulse/engine/PulseEngine.py:33-243` |
| Binding PyPulse/NumPy | `src/python/pybind/PulseEngines.cpp:16-55` |
| Inicialização/avanço | `src/cpp/engine/common/controller/Controller.cpp:326-701` |
| Sistemas | `src/cpp/engine/common/system/physiology/` |
| Escalares | `src/cpp/cdm/system/physiology/SE*System.h` |
| DataRequests | `src/python/pulse/cdm/engine.py:467-633` |
| Eventos | `src/python/pulse/cdm/engine.py:52-112` |
| Ações/condições | `src/python/pulse/cdm/patient_actions.py`, `patient_conditions.py` |
| ECG 12-lead no modelo | `src/cpp/cdm/system/equipment/electrocardiogram/SEElectroCardioGram.h:29-85` |
| ECG schema | `src/schema/pulse/cdm/bind/ElectroCardioGram.proto:9-65` |
| Dados locais Lead III | `ecg/StandardECG.json:4,299,596` |
| Plot estático | `src/python/pulse/cdm/utils/generate_monitors.py:112-175,228-230` |
| Candidato WASM | `CMakeLists.txt:83-97`; `src/c/CMakeLists.txt:1-12` |
| Provider/PatientState | `lib/dynamic-osce/types.ts:10-70,270-299` |
| Adapter desativado | `lib/dynamic-osce/pulse/pulse-adapter.contract.ts:9-83` |
| Runner por subprocesso | `lib/dynamic-osce/pulse-local/pulse-local-runner.ts:94-280` |
| Runner asma | `lib/dynamic-osce/pulse-local/pulse_asthma_runner.py:97-170` |
| API apenas asma | `app/api/pulse/simulate/route.ts:19-93` |
| Reader última linha | `lib/dynamic-osce/pulse/pulse-real-output-reader.ts:9-11` |
| Normalizer/bridge | `lib/dynamic-osce/pulse/pulse-output-normalizer.ts`; `pulse-medix-bridge.ts` |
| UI rule-based | `components/dynamic-osce/DynamicCaseRunner.tsx:36-38,130-141,264-266` |

## 27. Comandos seguros utilizados

Todos os comandos foram de leitura, exceto a gravação deste relatório por patch:

```sh
pwd
git status --short
git rev-parse --show-toplevel
test -d .reference-local/engine-stable && echo PULSE_FOUND || echo PULSE_NOT_FOUND
git rev-parse HEAD
git remote -v
git submodule status
find .reference-local/engine-stable -type f
du -sh .reference-local/engine-stable .reference-local/engine-stable/{src,build,data,docs,cmake,substances,bin,config,ecg,environments}
file .reference-local/engine-stable/build/install/bin/*
rg -n '<termos>' .reference-local/engine-stable lib/dynamic-osce app/api/pulse components/dynamic-osce
sed -n '<intervalo>p' <arquivo>
nl -ba <arquivo>
PYTHONDONTWRITEBYTECODE=1 <python3.9> -B -c 'import PyPulse; ...'
```

O import imprimiu `4.3.2`, `bb72983`, `PulseEngine`. Não foram chamados `initialize_engine`, `PulseScenarioDriver`, testes ou cenários.

O `git status --short` inicial continha alterações preexistentes em arquivos de app, hooks, libs, dados e assets, incluindo diversos untracked e uma remoção de zip. Essas mudanças não foram modificadas. O único novo arquivo desta auditoria é este relatório.

## 28. Arquivos/recursos não encontrados

- metadados Git do Pulse (branch/tag/hash completo);
- `.gitmodules` e submódulos;
- pacientes prontos e `StandardMale.json`/outros presets;
- estados salvos, inclusive `StandardMale@0s.json`/ `Soldier@0s.json`;
- compounds `Saline`, `PackedRBC`, `Blood` e conteúdo de `substances/compounds/`;
- cenário exato `data/human/adult/scenarios/patient/Pneumonia.json` declarado pelo MEDIX;
- pacientes/modelos/cenários pediátricos;
- gerador dedicado de pleth/pletismografia;
- monitor multiparamétrico interativo Pulse;
- ações específicas de desfibrilação/cardioversão energética, marcapasso, torniquete e posição;
- equipamento dedicado de diálise, nebulizador, desfibrilador, marcapasso e bomba;
- condições específicas de TEP, IAM, queimadura, dor e insuficiência renal;
- adapter MEDIX persistente, sessão, streaming e rotas de ação/advance/terminate;
- target/toolchain Emscripten e artefato WASM.

“Não encontrado” significa ausência nas buscas estáticas por nomes/sinônimos e nos diretórios C++/Python/schema/cenários inventariados; não é afirmação sobre versões externas do Pulse.

## 29. Perguntas ainda não respondidas

1. Qual repositório/commit completo originou `bb72983` e quais modificações locais foram aplicadas?
2. Onde estão os pacotes de pacientes, estados, compounds e baselines da versão 4.3.2?
3. Todos os 226 cenários executam com a distribuição completa, e quais são oficialmente suportados?
4. Qual desempenho/memória atual de inicialização, minuto simulado, múltiplas sessões e waveforms?
5. Quais escalares são válidos por condição/equipamento e com qual precisão?
6. A farmacodinâmica está em outro pacote ou ausente desta distribuição?
7. Qual validação clínica/tolerância será usada para MEDIX e WASM?
8. O objetivo é monitor de uma derivação ou ECG diagnóstico de 12 derivações? A cópia traz somente Lead III pronto.
9. A execução final será server-side nativa, client-side WASM ou híbrida?
10. Que solução atenderá pediatria e recursos não modelados?

## Apêndice A — desempenho histórico, não revalidado

`RELATORIO-CASOS-DINAMICOS-BETA-FASE9-PYPULSE-BUILD-LOCAL.md` registra uma execução anterior de asma: 580 s simulados em cerca de 14,6 s, CSV de 29.001 linhas/2,2 MB, timestep 0,02 s e aproximadamente 9 s de inicialização. É evidência histórica do workspace, não medição atual nem prova de fidelidade ao upstream.

## Apêndice B — conclusão operacional

Pode ser usado agora, com menor incerteza: API C++/C e PyPulse ARM64 local; paciente adulto programático; DataRequests numéricas; ações Python existentes; avanço; eventos; serialização; CSV; ECG Lead III/PA/respiração/CO2 como séries; plots estáticos offline. A prontidão depende de restringir-se aos recursos presentes e validar cada fluxo.

Ainda não deve ser tratado como integrado: motor persistente no MEDIX, quatro casos beta executados por Pulse, intervenções sincronizadas, waveforms na interface, eventos/alarmes, estado restaurável, 12-lead, pleth, pediatria ou WASM.
