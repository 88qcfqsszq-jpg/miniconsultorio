# Relatório da Etapa 2B — Recurso Oficial de Albuterol no Pulse

Data: 2026-07-19
Repositório: `/Users/marceloalmeida/Projetos/mini-consultorio-osce`
Branch: `main`
HEAD inicial e final (inalterado): `3c0c685384f3e8cdc182d23aadd7328e9dbd6c49`
**Status: bloqueado em definitivo — mesmo bloqueio da Etapa 2, agora com investigação exaustiva (incluindo internet) e preflight substancialmente mais rigoroso.**

## 1. Resumo executivo

O objetivo desta etapa era eliminar o único bloqueio técnico da Etapa 2 (`substances/Albuterol.json` sem `Aerosolization`) e concluir albuterol isolado, oxigênio+albuterol, tratamento tardio, repetição de dose e lifecycle integral com fisiologia real.

Após investigação exaustiva — todas as cópias locais do Pulse, patches preservados da Fase 9, uma segunda árvore de download fora do projeto, o schema C++/protobuf desta mesma instalação, o teste oficial `AerosolTest.cpp`, a documentação `docs/Methodology/*.md` shippada com este mesmo build 4.3.2, e consulta online à documentação pública da Kitware — **não foi encontrado nenhum recurso oficial completo** para `Aerosolization` de Albuterol. Um dos três campos exigidos (`BronchioleModifier = 1`) está oficialmente documentado; os outros dois (`InflammationCoefficient` e `ParticulateSizeDistribution`) não têm valor oficial publicado em nenhuma fonte acessível para esta substância especificamente.

Conforme a regra de segurança do prompt — "se nenhum recurso oficial compatível for encontrado, não improvise, mantenha `RESOURCE_NOT_FOUND`" — **o arquivo `substances/Albuterol.json` não foi alterado** (hash idêntico antes e depois: `f1dfd684cea0d87b7855ca07b51ad1fe8ad3edf583bd773fe64dac638d27395b`). O bloqueio permanece, agora com uma causa muito mais explicitada e um preflight que valida os três campos individualmente (faixa, unidade, NaN/Infinito, soma do histograma) em vez de apenas checar a presença da seção.

Todos os cenários que **não** dependem de albuterol (controle sem tratamento, oxigênio isolado, eventos, apresentação, exame, lifecycle parcial com cancelamento real) continuam passando com a mesma fisiologia real já validada na Etapa 2. As Etapas 1 e 2 permanecem 100% verdes.

## 2. Validação inicial

| Item | Valor |
|---|---|
| `pwd` | `/Users/marceloalmeida/Projetos/mini-consultorio-osce` |
| `git rev-parse HEAD` (antes e depois) | `3c0c685384f3e8cdc182d23aadd7328e9dbd6c49` |
| `git branch --show-current` | `main` |
| `git diff --cached --name-only` | vazio (antes e depois) |
| Pulse versão | `4.3.2` (`.reference-local/engine-stable/CMakeLists.txt:46`, confirmado por import real de `PyPulse`) |
| Pulse build hash | `bb72983` (confirmado por `pulse.engine.PulseEngine.hash()` nesta sessão) |
| Bloqueio reproduzido | sim, idêntico ao relatado na Etapa 2, antes de qualquer alteração |

A árvore de trabalho já continha as alterações do usuário e o trabalho das Etapas 1/2, todos preservados integralmente. Nenhum `git reset/restore/checkout --/clean` foi executado; o índice permaneceu vazio do início ao fim.

## 3. Todos os `Albuterol.json` localizados e hash SHA-256

| Caminho | SHA-256 | Papel/veredito |
|---|---|---|
| `.reference-local/engine-stable/substances/Albuterol.json` | `f1dfd684cea0d87b7855ca07b51ad1fe8ad3edf583bd773fe64dac638d27395b` | recurso ativo; **sem `Aerosolization`**; **não alterado** |
| `.reference-local/pulse-patches/fase9/substances-drugs-removed-clearance/Albuterol.json` | `f1dfd684cea0d87b7855ca07b51ad1fe8ad3edf583bd773fe64dac638d27395b` (idêntico) | cópia de patch da Fase 9 que apenas removeu `Clearance.SystemicClearance` de 17 drogas inativas para evitar crash de null pointer; não trata de aerossolização |
| `.reference-local/engine-stable/data/human/adult/scenarios/drug/Albuterol.json` | `1804a67ac5a22315103d5a22a0c06f83fae4e15caddeb8206f07e3d6ffa1a47c` | cenário de ações (dose/inalador), não um recurso de substância; não contém `Aerosolization` |
| `/Users/marceloalmeida/Downloads/engine-stable/data/human/adult/scenarios/drug/Albuterol.json` | `1804a67ac5a22315103d5a22a0c06f83fae4e15caddeb8206f07e3d6ffa1a47c` (idêntico) | segunda árvore de download, fora do projeto, sem `src/` nem `substances/`; não avança a investigação |

O `.reference-local/pulse-patches/FASE9-PATCH-MANIFEST.md` foi lido integralmente: documenta exatamente cinco correções de crash (Gastrointestinal, Glucose, Calcium/Albumin/Acetoacetate, Lactate e 17 drogas inativas), nenhuma relacionada a `Aerosolization`/inalador.

## 4. Investigação do schema e da proveniência oficial

### 4.1 Schema exigido pelo Pulse 4.3.2 (nesta mesma instalação)

- `src/schema/pulse/cdm/bind/Substance.proto:23-28`: `SubstanceAerosolizationData { BronchioleModifier: ScalarNegative1To1Data; InflammationCoefficient: Scalar0To1Data; ParticulateSizeDistribution: HistogramFractionVsLengthData }`.
- `src/cpp/cdm/substance/SESubstanceAerosolization.cpp` (`IsValid()`): os três campos são obrigatórios, nenhum opcional.
- `src/cpp/cdm/properties/SEHistogram.cpp` (`IsValid()`): `len(fractions) + 1 == len(boundaries)`, ambas não vazias.
- `src/cpp/cdm/properties/SEHistogramFractionVsLength.cpp` (`IsVaild()`): soma das frações deve ser exatamente 1.
- `src/cpp/cdm/system/equipment/inhaler/SEInhaler.cpp:168-169`: `if (!sub->HasAerosolization()) throw CommonDataModelException("Inhaler substance must have aerosolization data")` — a mensagem nativa exata que origina o `RESOURCE_NOT_FOUND` continua vindo desta linha.
- `src/python/pulse/cdm/scalars.py:726-731`: unidades de comprimento reconhecidas: `m, cm, mm, um, in, ft`.
- Forma JSON confirmada por analogia com campos já presentes em `Norepinephrine.json` (`{"FractionUnboundInPlasma": {"Scalar0To1": {"Value": 0.75}}}`) e `Properties.proto:473-479` (`FunctionData{Independent, IndependentUnit, Dependent, DependentUnit}`).

### 4.2 Teste oficial do próprio Pulse (`AerosolTest.cpp`)

`src/cpp/engine/human_adult/whole_body/test/AerosolTest.cpp:51-58` contém, comentado:

```cpp
//SETestSuite& albuteroluite = testReport.CreateTestSuite();
//albuteroluite.SetName("Albuterol");
//subMgr.LoadSubstanceDirectory();
//SESubstance* albuterol = subMgr.GetSubstance("Albuterol");
//SizeIndependentDepositionEfficencyCoefficientsTest(albuteroluite, *albuterol, 0.043737, 0.045737, 0.090432, 0.3115);
//DepositionFractionTest(albuteroluite, *albuterol, 0.0805701, 0.0843696, 0.0701852, 0.111879);
```

Isto prova que o próprio Pulse pretendeu testar Albuterol com aerossolização real, mas o bloco está desativado nesta distribuição. Os números ali são **saídas esperadas** (coeficientes/frações de deposição calculados a partir da configuração de entrada), não os parâmetros de entrada — não é possível, e o prompt proíbe, derivar manualmente os parâmetros a partir dessas saídas.

Os testes que o arquivo de fato executa usam substâncias sintéticas (`NormalDistribution`, `MonoDispersed`, `MonoDispersed2`, `MonoDispersed3`, `Zhang`) com `BronchioleModifier = 0` e `InflammationCoefficient = 0.5` marcados explicitamente com `//Need something here...` — placeholders genéricos de engenharia, não farmacologia real.

### 4.3 Documentação oficial (local, shippada com este build, e online)

Acesso à internet foi confirmado nesta sessão (`curl` retornou HTTP 200/301 para hosts externos) e usado exclusivamente para pesquisa/comparação, nunca para copiar números diretamente para o recurso:

- **`docs/Methodology/DrugsMethodology.md:233`** (documentação oficial já instalada junto com este build 4.3.2 — maior proveniência possível): *"The BronchioleModifier for Albuterol is set to 1 in the substance file, meaning that Albuterol has the capability to maximally dilate the bronchioles."* Confirma oficialmente **um** dos três campos (`BronchioleModifier = 1`), mas não publica `InflammationCoefficient` nem a distribuição de partículas.
- `docs/Methodology/DrugsMethodology.md:224-233`: Albuterol e Furosemide são as únicas duas substâncias com efeito direto de sítio de ação via `BronchioleModifier`/`InflammationCoefficient`.
- `docs/Methodology/InhalerMethodology.md`: documenta validação clínica (tempo de pico, percentuais de dose alveolar) comparada à literatura, mas não publica o JSON de aerossolização.
- `docs/Methodology/EnvironmentMethodology.md` (`@anchor environment-aerosol`): descreve o método geral de deposição por histograma (Hinds/ICRP66), de forma genérica, sem publicar um histograma específico de Albuterol.
- `pulse.kitware.com/_inhaler_methodology.html` (consulta online): reafirma transporte tratado como gás e aerossol monodisperso assumido; não publica um arquivo de parâmetros.
- Tentativa de acessar `gitlab.kitware.com/physiology/engine` (origem declarada em `ReadMe.md:131`) retornou bloqueio por proteção anti-bot; não foi possível obter o `substances/Albuterol.json` de origem para comparação byte a byte.

**Conclusão:** dois dos três campos obrigatórios não têm valor oficial publicado para Albuterol nesta versão, em nenhuma fonte acessível (local ou online). Isso não é uma lacuna de busca — é uma lacuna documentada da própria distribuição/documentação oficial do Pulse 4.3.2 para esta substância específica.

## 5. Decisão de segurança

Nenhuma substituição foi realizada. Critérios de bloqueio (todos aplicáveis):

- não há distribuição oficial acessível com o recurso completo;
- dois de três campos exigiriam número inventado;
- a distribuição de partículas não pode ser derivada manualmente das saídas de teste comentadas;
- preencher os campos ausentes criaria potencialmente um benefício farmacológico fabricado no MEDIX.

`substances/Albuterol.json` permanece com o mesmo conteúdo e hash de antes desta etapa. Nenhuma cópia de segurança adicional foi necessária porque nada foi trocado.

### Artefato exato necessário para desbloquear (registrado para a próxima etapa)

Um `substances/Albuterol.json` oficial, de distribuição/commit do Pulse compatível com `4.3.2`/`bb72983`, com hash e proveniência registrados, contendo `Aerosolization.BronchioleModifier` (o valor `1` já documentado oficialmente pode ser reaproveitado sem invenção), `Aerosolization.InflammationCoefficient` e `Aerosolization.ParticulateSizeDistribution` com uma distribuição granulométrica real (não sintética) calibrada para o pMDI/HFA-Albuterol usado na validação do próprio Pulse — que passe o preflight ampliado desta etapa e a administração real sem alteração manual de parâmetros.

## 6. O que esta etapa entregou

### 6.1 Preflight ampliado (`action_dispatcher.py`)

Substituído o preflight que apenas checava a presença da chave `Aerosolization` por uma validação campo a campo que espelha exatamente `SESubstanceAerosolization::IsValid()` e `SEHistogram*::IsValid()`:

- `Name == "Albuterol"` (novo — rejeita recurso mal identificado com `foundName` no detalhe);
- seção `Aerosolization` presente (comportamento antigo preservado: `missingSection` no detalhe quando ausente por completo);
- `BronchioleModifier`: presente, finito, dentro de `[-1, 1]`;
- `InflammationCoefficient`: presente, finito, dentro de `[0, 1]`;
- `ParticulateSizeDistribution`: unidade reconhecida (`m, cm, mm, um, in, ft`), `len(fractions) + 1 == len(boundaries)`, todos os valores finitos (sem NaN/Infinito), fronteiras estritamente crescentes, frações não negativas, soma das frações ≈ 1 (tolerância `1e-6`);
- compatibilidade de versão do engine em execução (`4.3.2`) verificada antes da chamada nativa em `_apply_albuterol` (nova função `_check_pulse_version_compatibility`).

O erro estruturado passou a incluir `missingFields`/`invalidFields` granulares, preservando o formato antigo (`missingSection: "Aerosolization"`) para o caso de seção totalmente ausente — o que mantém compatibilidade retroativa com o teste de integração real da Etapa 2 (`isMissingAlbuterolAerosolization`), verificado nesta etapa sem qualquer alteração.

O preflight **não foi removido** e não será removido até uma validação real completa passar, conforme exigido.

### 6.2 Teste de aceite com fixture oficial

Para provar que o validador aceita corretamente um recurso completo (exigência explícita do prompt), foi criado um teste positivo usando os valores literais de `AerosolTest.cpp` (`BronchioleModifier=0`, `InflammationCoefficient=0.5`, histograma de 6 bins/7 fronteiras em `um`) — números oficiais do próprio Pulse, aplicados a um objeto de teste que **não** se chama "Albuterol" (para nunca implicar que representam a farmacologia real do fármaco). Ver `OFFICIAL_TEST_AEROSOLIZATION` em `tests/action_dispatcher` (Python).

## 7. Administração real (inalterada desta etapa, reconfirmada)

Via já implementada na Etapa 2 e reconfirmada nesta etapa, sem alteração de lógica:

- `EquipmentAction.InhalerConfiguration` (substância `Albuterol`, dose medida, perda de bocal, volume do espaçador) via protobuf oficial (`ActionListData`);
- `PatientAction.ConsciousRespiration` com `ForcedExhale` → `UseInhaler` → `ForcedInhale`, repetido por `actuations` (1 a 4);
- despachado via `process_actions` no mesmo `PulseEngine`/mesma sessão, sem `CANCEL_ACTION` exposto (ação discreta);
- gate de versão (`4.3.2`) adicionado antes da chamada nativa nesta etapa.

Nenhuma destas chamadas nativas foi de fato exercitada com sucesso, porque o preflight (correto e mais rigoroso) continua interrompendo antes por falta de `Aerosolization`.

## 8. Cenários executados e resultados reais

Severidade de asma: `0.75` (calibrada na Etapa 2, reconfirmada). Mesmo processo Python persistente para toda a matriz.

| Cenário | Execução | Resultado |
|---|---|---|
| 1. Controle sem tratamento | `run-gold-asthma-pulse.mts --scenario untreated` | HR/SpO2/RR/Raw idênticos à Etapa 2 (ex.: t=300s → HR 74,87, SpO2 94,70, Raw 21,50); evento `Hypoxia` inicia/termina |
| 2. Oxigênio isolado (cânula 1 L/min) | `--scenario oxygen` | idêntico à Etapa 2 (t=300s → SpO2 97,95, PaO2 107,55, PaCO2 50,88, pH 7,318); `RespiratoryAcidosis` ativa; apresentação final `life-threatening`/13 |
| 3. Albuterol isolado | `--scenario albuterol` | **bloqueado**: `RESOURCE_NOT_FOUND`, mensagem `"Pulse Albuterol resource has no aerosolization data required by the inhaler model."`, `exit=1`, stderr sanitizado (sem traceback/paths) |
| 4. Oxigênio + albuterol (combinado) | `--scenario combined` | oxigênio real aplicado; **albuterol bloqueado** no mesmo ponto |
| 5. Tratamento tardio | `--scenario late-treatment` | crise avançada; **albuterol bloqueado** no mesmo ponto |
| 6. Repetição de dose | não suportado | **bloqueado antes da primeira dose**; repetição é, portanto, indeterminável nesta distribuição — não simulada |
| 7. Lifecycle integral | `--scenario lifecycle` (CLI cru) e teste dedicado de integração real | CLI cru: propaga o erro no passo do albuterol (`exit=1`), por desenho do `runGoldAsthmaScenario('lifecycle', …)`. Teste dedicado (`gold-asthma-real-integration.test.mts`, cenário 6): asma 0,75 → avança 90s → oxigênio 1 L/min → avança 30s → **tenta albuterol, recebe `RESOURCE_NOT_FOUND` explicitamente** → cancela oxigênio → cancela asma → avança 5s → snapshot de recuperação real (t=180s → SpO2 98,00, VC 547,85 mL, Raw 1,50, PaO2 97,32, pH 7,431) → `terminate` → `shutdown`. `activeSessionCount` foi 1 durante o fluxo e 0 após `TERMINATE_SESSION` |

Nenhuma tabela foi preenchida com tendência esperada; os cenários 3–6 não produzem comparação fisiológica de albuterol porque a ação nunca chega a ser processada pelo Pulse — exatamente a mesma limitação da Etapa 2, agora diagnosticada com mais precisão.

## 9. Validação farmacológica

Não aplicável a albuterol: a ação nunca é processada pelo motor, logo não há mudança de resistência, volume corrente, ventilação minuto, FC, oxigenação, PaCO2 ou pH atribuível ao fármaco para medir. Nenhuma tendência foi fabricada. As mudanças fisiológicas medidas para asma e oxigênio (seções 8) são as mesmas, dentro da margem de variação determinística do motor, já validadas na Etapa 2.

## 10. Testes

### 10.1 Python (`unittest`, CPython 3.9 do Xcode, `PYTHONPATH` apontando para o build local)

23/23 aprovados, incluindo os 10 pré-existentes de protocolo/sessão/servidor/eventos e 13 de `action_dispatcher`, dos quais 7 são novos desta etapa:

- `test_preflight_rejects_wrong_substance_name`
- `test_preflight_reports_each_missing_aerosolization_field`
- `test_preflight_rejects_out_of_range_and_malformed_values` (5 subcasos: fora de faixa, NaN, soma≠1, unidade não reconhecida, fronteiras não crescentes)
- `test_preflight_accepts_schema_complete_resource` (caminho de aceite, fixture oficial)
- `test_version_compatibility_gate_blocks_mismatched_engine`
- mais os 6 testes pré-existentes de `action_dispatcher` (asma, severidade, oxigênio, dose/unidade albuterol, cancelamento), todos ainda verdes.

### 10.2 Node

| Suite | Resultado |
|---|---|
| `pulse-runtime-protocol.test.mts` | 3/3 |
| `pulse-process-manager.test.mts` | 7/7 |
| `pulse-session-client.test.mts` | 1/1 |
| `pulse-runtime.integration.test.mts` (real, Etapa 1) | 1/1, ~9,8s |
| `gold-asthma-clinical-layers.test.mts` | 2/2 |
| `gold-asthma-timeline.test.mts` | 2/2 |
| `gold-asthma-technical-service.test.mts` | 3/3 |
| `gold-asthma-real-integration.test.mts` (real, Etapa 2, 7 subcenários) | 7/7, ~78s |

### 10.3 Outras verificações

| Verificação | Resultado |
|---|---|
| `npx --no-install tsc --noEmit --pretty false` | aprovado, zero diagnóstico |
| `npx --no-install eslint` (runtime, caso ouro, CLI, testes focais) | aprovado, zero diagnóstico |
| `py_compile` do `action_dispatcher.py` modificado | aprovado |
| CLI manual — 5 cenários (`untreated`, `oxygen`, `albuterol`, `combined`, `late-treatment`) + lifecycle | comportamento idêntico ao esperado/documentado |
| `git diff --check` (tracked) | aprovado, sem saída |
| `git diff --stat` (tracked) | idêntico ao estado herdado (15 arquivos, 1619(+)/746(-)), nada tocado por esta etapa |
| `git status --short` | preserva todas as alterações preexistentes; nenhum novo arquivo tracked alterado |
| `git diff --cached --name-only` | vazio antes e depois |
| Processos filhos residuais | nenhum (`pgrep`/`ps` não mostram `pulse_runtime_server`/`PulseEngine` após os testes) |
| `__pycache__`/`.pyc` em caminhos novos | nenhum |

## 11. Critérios atendidos

- Investigação exaustiva de todas as fontes locais, patches, download alternativo, schema, teste oficial, documentação local e online.
- Decisão de segurança correta: nenhum dado inventado, nenhuma substituição de recurso sem proveniência completa.
- Preflight ampliado, mais preciso, sem remoção do gate `RESOURCE_NOT_FOUND`.
- Teste de aceite do preflight com fixture oficial (não atribuída a Albuterol).
- Administração real (`InhalerConfiguration`+`UseInhaler`) reconfirmada como implementação correta, apenas não exercitável nesta distribuição.
- Todos os cenários não dependentes de albuterol executados com fisiologia real, mesma sessão/engine.
- Regressão total das Etapas 1 e 2 verde.
- Feature flag continua protegendo o caso; fluxo principal, pediatria, UI e outros casos inalterados.
- `substances/Albuterol.json` com hash idêntico ao inicial.
- Nenhum commit, push, alteração de índice ou comando destrutivo.

## 12. Critérios pendentes (herdados da Etapa 2, ainda bloqueados)

- Aplicação real de albuterol (ou outro broncodilatador com recurso completo).
- Medição de resposta fisiológica ao broncodilatador.
- Comparação real de albuterol isolado, combinação e tratamento tardio.
- Repetição de dose (indeterminável sem a primeira dose funcionar).
- Lifecycle integral com uma administração broncodilatadora bem-sucedida.

## 13. Limitações e riscos

1. **Gap de proveniência, não de esforço de busca:** mesmo com acesso à internet e à documentação oficial shippada com este build, `InflammationCoefficient` e `ParticulateSizeDistribution` de Albuterol não são publicados em lugar algum acessível para esta versão. `BronchioleModifier=1` é conhecido, mas insuficiente sozinho.
2. **`gitlab.kitware.com/physiology/engine` bloqueado por proteção anti-bot** nesta sessão; não foi possível comparar byte a byte com a origem declarada no `ReadMe.md`.
3. **Teste oficial comentado (`AerosolTest.cpp`):** confirma a intenção histórica do próprio Pulse de testar Albuterol, mas não fornece os parâmetros de entrada — apenas saídas esperadas, que não podem ser revertidas em parâmetros sem derivação manual (proibida).
4. **Repetição de dose continua indeterminável:** sem a primeira dose funcionar, não há como validar suporte real à repetição.
5. **Gate de versão é novo e estrito:** qualquer atualização futura do binário Pulse local exigirá atualizar `EXPECTED_PULSE_VERSION` deliberadamente; isto é intencional (evita validar contra um binário não verificado).

## 14. Arquivos criados nesta etapa

- `docs/PLANO-ETAPA-2B-ALBUTEROL-PULSE.md`
- `docs/RELATORIO-ETAPA-2B-ALBUTEROL-PULSE.md`

## 15. Arquivos alterados nesta etapa

- `lib/dynamic-osce/pulse-runtime/python/action_dispatcher.py` (preflight ampliado, gate de versão; caminho tracked pelo Git: nenhum — diretório ainda não rastreado desde a Etapa 1)
- `lib/dynamic-osce/pulse-runtime/python/tests/test_action_dispatcher.py` (7 testes novos; mesmo diretório não rastreado)

Nenhum arquivo da Etapa 1/2 fora destes dois foi modificado. `substances/Albuterol.json` (fora do repositório MEDIX, em `.reference-local/`) permanece byte-a-byte idêntico.

## 16. Comandos executados (principais)

```sh
pwd; git status --short; git rev-parse HEAD; git branch --show-current; git diff --cached --name-only
find … -iname "Albuterol.json"; shasum -a 256 …
grep -rli "aerosolization" .reference-local/engine-stable
curl -s -m 5 -o /dev/null -w "%{http_code}" https://github.com
# WebFetch: pulse.kitware.com/_inhaler_methodology.html; github.com/cnsuhao/engine1
# WebSearch: Pulse Albuterol BronchioleModifier/Aerosolization
grep -n "Albuterol" docs/Methodology/*.md
PYTHONPATH=".reference-local/engine-stable/build/install/lib:.../python" python3.9 -B -c "import PyPulse; from pulse.engine.PulseEngine import version, hash as pulse_hash; …"
python3.9 -B -m py_compile lib/dynamic-osce/pulse-runtime/python/action_dispatcher.py
PYTHONDONTWRITEBYTECODE=1 python3.9 -B -m unittest discover -s lib/dynamic-osce/pulse-runtime/python/tests -p 'test_*.py' -v
npx --no-install tsc --noEmit --pretty false
npx --no-install eslint lib/dynamic-osce/pulse-runtime/*.ts lib/dynamic-osce/cases/gold/asthma-severe/*.ts lib/dynamic-osce/scripts/*.mts tests/pulse-runtime/*.mts tests/pulse-runtime/*.mjs tests/pulse-gold-asthma/*.mts
node --experimental-strip-types --loader ./tests/pulse-runtime/ts-extension-loader.mjs --test tests/pulse-runtime/*.test.mts
MEDIX_PULSE_REAL_INTEGRATION=1 node … --test tests/pulse-runtime/pulse-runtime.integration.test.mts
MEDIX_PULSE_REAL_INTEGRATION=1 MEDIX_PULSE_GOLD_ASTHMA_ENABLED=true node … --test tests/pulse-gold-asthma/gold-asthma-real-integration.test.mts
MEDIX_PULSE_GOLD_ASTHMA_ENABLED=true node … lib/dynamic-osce/scripts/run-gold-asthma-pulse.mts --scenario {untreated,oxygen,albuterol,combined,late-treatment,lifecycle}
git diff --check; git diff --stat; git status --short; git rev-parse HEAD; git branch --show-current
pgrep -fl "pulse_runtime_server|PulseEngine"; ps aux | grep pulse_runtime_server
```

## 17. Auditoria Git final

- HEAD inalterado: `3c0c685384f3e8cdc182d23aadd7328e9dbd6c49`, branch `main`.
- `git diff --cached --name-only`: vazio.
- `git diff --stat` (tracked): idêntico ao herdado — 15 arquivos, 1619 inserções(+)/746 remoções(-); nenhum tocado por esta etapa.
- `git diff --check`: exit 0, sem saída.
- `git status --short`: preserva integralmente o estado herdado; os únicos caminhos novos por esta etapa (`docs/PLANO-ETAPA-2B-ALBUTEROL-PULSE.md`, `docs/RELATORIO-ETAPA-2B-ALBUTEROL-PULSE.md`) aparecem como `??`, dentro de `docs/` que já era parcialmente não rastreado.
- Nenhum commit, push, add ao índice, reset, restore, checkout destrutivo ou clean foi executado nesta etapa.
