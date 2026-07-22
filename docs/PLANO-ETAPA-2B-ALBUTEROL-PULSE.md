# Plano da Etapa 2B — Recurso Oficial de Albuterol no Pulse

Data da auditoria: 2026-07-19
Repositório: `/Users/marceloalmeida/Projetos/mini-consultorio-osce`
Branch auditada: `main`
HEAD auditado: `3c0c685384f3e8cdc182d23aadd7328e9dbd6c49`
Pulse local: `.reference-local/engine-stable`, versão `4.3.2`, hash de build `bb72983` (confirmado por import real de `PyPulse` nesta sessão).

## 1. Objetivo

Resolver, se e somente se seguro, o único bloqueio técnico remanescente da Etapa 2: `substances/Albuterol.json` sem a seção `Aerosolization` exigida por `SEInhaler` para administrar o broncodilatador via `InhalerConfiguration` + `UseInhaler`. Se não houver recurso oficial completo e verificável, manter `RESOURCE_NOT_FOUND` fechado, endurecer o preflight e produzir relatório de bloqueio definitivo.

## 2. Estado herdado (Etapas 1 e 2)

- Runtime Pulse persistente (`lib/dynamic-osce/pulse-runtime/`) e Caso Ouro (`lib/dynamic-osce/cases/gold/asthma-severe/`) presentes e, segundo os relatórios anteriores, verdes.
- `_apply_albuterol` em `action_dispatcher.py` já monta `InhalerConfiguration` + `ConsciousRespiration/UseInhaler` via protobuf oficial (`ActionListData`) e `process_actions`, mas `_albuterol_parameters` interrompe antes com `RESOURCE_NOT_FOUND` porque `substances/Albuterol.json` não tem `Aerosolization`.
- Árvore de trabalho preexistente com alterações do usuário; nada será descartado, resetado ou movido para o índice.

## 3. Investigação executada nesta etapa

### 3.1 Localização de todos os `Albuterol.json`

| Caminho | SHA-256 | Papel |
|---|---|---|
| `.reference-local/engine-stable/substances/Albuterol.json` | `f1dfd6...27395b` | recurso ativo usado pelo dispatcher; **sem `Aerosolization`** |
| `.reference-local/pulse-patches/fase9/substances-drugs-removed-clearance/Albuterol.json` | `f1dfd6...27395b` (idêntico) | cópia preservada de um patch da Fase 9 que **removeu** `Clearance.SystemicClearance` de 17 drogas inativas para evitar um crash de null pointer; não adicionou `Aerosolization`; mesmo conteúdo do ativo |
| `.reference-local/engine-stable/data/human/adult/scenarios/drug/Albuterol.json` | `1804a6...a1a47c` | cenário oficial de administração (ações), não um recurso de substância; não contém `Aerosolization` |
| `/Users/marceloalmeida/Downloads/engine-stable/data/human/adult/scenarios/drug/Albuterol.json` | `1804a6...a1a47c` (idêntico ao cenário acima) | cópia parcial de distribuição em `Downloads/`, sem `src/` nem `substances/`; não avança a investigação |

Nenhuma cópia local, incluindo uma segunda árvore de download fora do projeto, contém um `substances/Albuterol.json` com `Aerosolization`.

### 3.2 Git e histórico

- O Pulse local não é um repositório Git (`.reference-local/` está em `.git/info/exclude` do app); não há branch, tag ou commit a inspecionar dentro do Pulse.
- `FASE9-PATCH-MANIFEST.md` documenta exatamente o que foi alterado na Fase 9: nenhuma menção a `Aerosolization`/inalador; os patches trataram apenas de crashes de `Clearance` renal/sistêmica e do `GastrointestinalModel`.

### 3.3 Schema oficial exigido (C++/protobuf desta mesma instalação)

- `src/schema/pulse/cdm/bind/Substance.proto:23-28`: `SubstanceAerosolizationData { BronchioleModifier (ScalarNegative1To1), InflammationCoefficient (Scalar0To1), ParticulateSizeDistribution (HistogramFractionVsLength) }`.
- `src/cpp/cdm/substance/SESubstanceAerosolization.cpp`: `IsValid()` exige as três propriedades presentes e válidas (nenhuma é opcional).
- `src/cpp/cdm/properties/SEHistogram.cpp`: histograma exige `len(fractions) + 1 == len(boundaries)`, listas não vazias.
- `src/cpp/cdm/properties/SEHistogramFractionVsLength.cpp`: soma das frações deve ser exatamente 1 (`SEScalar::IsValue(1, binned)`).
- `src/cpp/cdm/system/equipment/inhaler/SEInhaler.cpp:168-169`: `if (!sub->HasAerosolization()) throw CommonDataModelException("Inhaler substance must have aerosolization data")` — a mensagem nativa reproduzida pelos relatórios anteriores vem exatamente desta linha.
- Unidades de comprimento reconhecidas pelo wrapper Python: `m, cm, mm, um, in, ft` (`src/python/pulse/cdm/scalars.py:726-731`).
- Forma JSON confirmada por outras substâncias já presentes (`Norepinephrine.json`): campos `Scalar0To1`/`ScalarNegative1To1` são objetos aninhados, ex. `{"BronchioleModifier": {"ScalarNegative1To1": {"Value": ...}}}`; o histograma seria `{"ParticulateSizeDistribution": {"HistogramFractionVsLength": {"Histogram": {"Independent": [...], "IndependentUnit": "um", "Dependent": [...]}}}}` (`FunctionData`, `Properties.proto:473-479`).

### 3.4 Teste oficial do próprio Pulse (`AerosolTest.cpp`)

`src/cpp/engine/human_adult/whole_body/test/AerosolTest.cpp:51-58` contém, **comentado**, exatamente o teste que a Etapa 2B precisaria:

```cpp
//SETestSuite& albuteroluite = testReport.CreateTestSuite();
//albuteroluite.SetName("Albuterol");
//subMgr.LoadSubstanceDirectory();
//SESubstance* albuterol = subMgr.GetSubstance("Albuterol");
//SizeIndependentDepositionEfficencyCoefficientsTest(albuteroluite, *albuterol, 0.043737, 0.045737, 0.090432, 0.3115);
//DepositionFractionTest(albuteroluite, *albuterol, 0.0805701, 0.0843696, 0.0701852, 0.111879);
```

Isso prova que a própria equipe do Pulse pretendeu, em algum momento, testar Albuterol com dados reais de aerossolização — mas o teste está desativado nesta distribuição, e os números ali são **saídas esperadas** (coeficientes/frações de deposição calculados a partir da configuração), não os parâmetros de entrada (`BronchioleModifier`, `InflammationCoefficient`, histograma). Não é possível, e a regra do prompt proíbe, derivar manualmente os parâmetros de entrada a partir dessas saídas.

Os testes que o arquivo de fato executa usam substâncias sintéticas (`NormalDistribution`, `MonoDispersed`, `MonoDispersed2`, `MonoDispersed3`, `Zhang`) com `BronchioleModifier = 0` e `InflammationCoefficient = 0.5` explicitamente marcados com o comentário `//Need something here...` — ou seja, mesmo o Pulse oficial usa placeholders genéricos para testar o mecanismo, não valores farmacológicos reais de Albuterol.

### 3.5 Documentação oficial (shippada nesta mesma versão local, mais checagem online)

Com acesso à internet confirmado (`curl` retornou HTTP 200/301 para hosts externos), foi consultada a documentação pública do Pulse (`pulse.kitware.com`) e, principalmente, a documentação **local** já incluída nesta instalação 4.3.2 (`docs/Methodology/*.md`), que é a fonte de maior proveniência possível porque acompanha o mesmo build:

- `docs/Methodology/DrugsMethodology.md:233`: *"The BronchioleModifier for Albuterol is set to 1 in the substance file, meaning that Albuterol has the capability to maximally dilate the bronchioles."* — confirma oficialmente o valor de **um** dos três campos exigidos (`BronchioleModifier = 1`), mas não fornece `InflammationCoefficient` nem a distribuição de tamanho de partícula.
- `docs/Methodology/DrugsMethodology.md:224-233`: confirma que Albuterol é um dos únicos dois fármacos (com Furosemide) que usam o "Site-of-Action Model" com efeito respiratório direto via `BronchioleModifier`/`InflammationCoefficient`.
- `docs/Methodology/InhalerMethodology.md`: documenta a validação clínica da administração (dose, tempo de pico, comparação com literatura), mas não publica o JSON de aerossolização nem o `InflammationCoefficient`.
- `docs/Methodology/EnvironmentMethodology.md` (`@anchor environment-aerosol`): descreve o método geral de deposição por histograma (equações de Hinds/ICRP66), mas de forma genérica — sem publicar um histograma específico para Albuterol.
- `pulse.kitware.com/_inhaler_methodology.html` (consulta online): reafirma que o transporte é tratado como gás e que o modelo assume aerossol monodisperso, sem publicar os três parâmetros como arquivo baixável.
- Tentativa de acessar o repositório oficial (`gitlab.kitware.com/physiology/engine`) via HTTP retornou bloqueio por proteção anti-bot (BotStopper/Techaro); não foi possível obter o arquivo bruto `substances/Albuterol.json` da origem para comparação byte a byte.

**Conclusão da investigação:** dois dos três campos obrigatórios (`InflammationCoefficient` e `ParticulateSizeDistribution`) não têm valor oficial publicado, nem localmente nem via acesso online, para a substância Albuterol especificamente nesta versão. O único campo confirmado oficialmente (`BronchioleModifier = 1`) não é suficiente para compor um recurso `IsValid()` — os três campos são exigidos simultaneamente pelo próprio Pulse.

## 4. Decisão de segurança

Critério do prompt: *"Se nenhum recurso oficial compatível for encontrado, não improvise. Mantenha `RESOURCE_NOT_FOUND`, produza relatório de bloqueio definitivo e liste exatamente o artefato necessário."*

Decisão: **não substituir `substances/Albuterol.json`**. Não há, em nenhuma fonte investigada (cópias locais, patches preservados, download alternativo, documentação oficial local e online, teste oficial comentado), um conjunto completo e verificável de `BronchioleModifier` + `InflammationCoefficient` + `ParticulateSizeDistribution` para Albuterol especificamente. Preencher os dois campos ausentes seria inventar dado farmacológico e violaria a regra "Não invente dados de aerosolização" e "Não derive manualmente distribuição de partículas".

O arquivo `substances/Albuterol.json` ativo permanece intocado (mesmo hash `f1dfd684cea0d87b7855ca07b51ad1fe8ad3edf583bd773fe64dac638d27395b` antes e depois desta etapa). `RESOURCE_NOT_FOUND` continua fechado.

## 5. O que esta etapa entrega mesmo sem o recurso

1. **Preflight ampliado e mais preciso** em `action_dispatcher.py`: em vez de checar apenas a presença da chave `Aerosolization`, o preflight agora verifica individualmente `BronchioleModifier` (faixa -1..1, finito), `InflammationCoefficient` (faixa 0..1, finito), `ParticulateSizeDistribution` (histograma com unidade reconhecida, contagem `bins+1 == boundaries`, sem NaN/Infinito, fronteiras crescentes, frações não negativas e soma ≈ 1), o nome da substância (`Name == "Albuterol"`) e a compatibilidade de versão do engine em execução (`4.3.2`), reportando em `details` exatamente quais campos estão ausentes/ inválidos. O preflight antigo (checagem de presença) é mantido como subconjunto do novo comportamento — nada é removido, apenas estendido.
2. **Teste de aceite do preflight com fixture oficial**: para provar que o validador aceita corretamente um recurso completo (exigência explícita do prompt: "aceitação de recurso completo"), o teste usa os mesmos valores literais de `AerosolTest.cpp` (`BronchioleModifier=0`, `InflammationCoefficient=0.5`, histograma de 6 bins/7 fronteiras em `um`) que são dados oficiais do próprio Pulse — porém aplicados a uma substância de teste sintética (não nomeada "Albuterol"), para nunca implicar que esse conjunto representa a farmacologia real do Albuterol.
3. **Reconfirmação de todos os cenários não bloqueados** (controle, oxigênio isolado, eventos, lifecycle até o ponto do albuterol) com o mesmo processo persistente, e reconfirmação de que os cenários que dependem de albuterol continuam falhando de forma fechada e determinística, agora com diagnóstico mais rico.
4. **Regressão completa das Etapas 1 e 2.**

## 6. Artefato exato necessário para desbloquear (registrado para a próxima etapa)

Um `substances/Albuterol.json` (ou recurso equivalente aceito por `SESubstance::HasAerosolization()`) que:

- venha de uma distribuição oficial do Pulse (Kitware/GitLab `physiology/engine`) em versão/commit compatível com `4.3.2`/`bb72983`, com hash e proveniência registrados;
- contenha `Aerosolization.BronchioleModifier` (o valor `1` já está documentado oficialmente e pode ser reaproveitado sem invenção), `Aerosolization.InflammationCoefficient` e `Aerosolization.ParticulateSizeDistribution` com uma distribuição granulométrica real (não sintética) calibrada para o pMDI/HFA-Albuterol usado na validação do próprio Pulse;
- passe o preflight ampliado desta etapa e a administração real (`InhalerConfiguration` + `UseInhaler` + `process_actions`) sem alteração manual de parâmetros.

## 7. Regras de segurança mantidas

Preservação total do trabalho existente; nenhum `git reset/restore/checkout --/clean`; índice Git não tocado; nenhum dado de aerossolização inventado; nenhuma cópia de números de fontes não oficiais; nenhuma derivação manual de distribuição de partículas; nenhum benefício farmacológico fabricado; Pulse C++ não alterado; UI não alterada; nenhum outro caso migrado; pediatria não alterada; motor principal não substituído; `RESOURCE_NOT_FOUND` mantido até validação real passar; stdout Python permanece JSON Lines exclusivo; stderr permanece exclusivo para logs; nenhum commit ou push.
