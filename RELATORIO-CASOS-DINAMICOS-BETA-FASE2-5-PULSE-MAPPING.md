# Relatório — Casos OSCE Dinâmicos (Beta) · Fase 2.5 · Pulse Mapping Contract

Camada de compatibilidade **conceitual** entre casos/rubricas MEDIX, o motor rule-based atual e o
futuro **Pulse Physiology Engine** — **sem executar Pulse, sem C++, sem binário, sem dependência
nova**. Baseada no `RELATORIO-MAPEAMENTO-ENGINE-STABLE` e na inspeção (somente leitura) de
`.reference-local/engine-stable` (cenários, ações e `DataRequest` reais).

## Arquivos criados

```
lib/dynamic-osce/pulse/
├── pulse-capability-map.ts        # condições strong/medium/weak/not-supported
├── pulse-action-map.ts            # intervenções MEDIX → ações Pulse candidatas
├── pulse-output-map.ts            # saídas Pulse (nomes reais) → campos MEDIX
├── pulse-scenario-templates.ts    # 8 templates conceituais
├── pulse-clinical-translator.ts   # funções puras de tradução/classificação
├── pulse-adapter.contract.ts      # contrato TS do futuro adapter (não executa)
├── index.ts                       # barrel
└── README-PULSE-MAPPING.md
RELATORIO-CASOS-DINAMICOS-BETA-FASE2-5-PULSE-MAPPING.md
```

## Arquivos alterados (todos do Beta)

- `lib/dynamic-osce/types.ts` — `PulseCompatibilityStatus`, `PulseSuggestedProvider`,
  `PulseCompatibilityDeclaration`; `CaseSimulacao` ganhou `pulseCompatibility?` e
  `pulseScenarioIsPlaceholder?` (aditivo, não quebra nada).
- `lib/dynamic-osce/cases/piloto-asma-grave-adulto.ts` — declara `pulseCompatibility` (asma =
  strong, cenário real do engine), `pulseReady=true`; provider em execução segue `medix-rule-based`.
- `lib/dynamic-osce/validators/validar-dynamic-engine.ts` — checagens de compatibilidade Pulse.
- `lib/dynamic-osce/scripts/validar-dynamic-osce.ts` — seção "Compatibilidade Pulse/MEDIX".
- `lib/dynamic-osce/README-DYNAMIC-OSCE.md` — seção de decisão MEDIX/Pulse/hybrid, pediatria e papel do Pulse.

## Resumo do mapeamento

Ancorado em nomes **reais** do engine-stable: ações (`PatientAction.AsthmaAttack`,
`NeedleDecompression`, `SupplementalOxygen`, `MechanicalVentilator`…) e saídas (`HeartRate`,
`RespirationRate`, `OxygenSaturation`, `SystolicArterialPressure`, `BloodPH`, `HorowitzIndex`,
`BronchodilationLevel`…), além de cenários confirmados em `data/human/adult/scenarios/patient/`.

### Condições por compatibilidade

- **strong**: asma grave, pneumotórax hipertensivo, DPOC exacerbado, pneumonia grave, ARDS,
  choque hemorrágico, ventilação/oxigênio, ACLS.
- **medium**: TEP com repercussão, sepse/choque séptico, desidratação/hipovolemia, IResp inespecífica.
- **weak**: SCA/IAM como OSCE completo, valvopatias crônicas, ICC crônica, cardiopatia congênita
  pediátrica (só overlay).
- **not-supported**: pediatria sem adaptador, congênita cianótica pediátrica direta, arboviroses,
  febre reumática, anemia ferropriva (sim. completa), ITP, puericultura, maus-tratos, casos sociais.

### Ações mapeadas (20)

oxigenio, oxigenio_alto_fluxo, salbutamol, ipratropio, corticoide, sulfato_magnesio,
descompressao_toracica, drenagem_toracica, ventilacao_bvm, intubacao, ventilacao_mecanica,
fluidos_suporte, transfusao, vasopressor, antibiotico, analgesia, monitorizacao, reavaliar,
aguardar_exames, alta_precoce — mais aliases dos `InterventionId` do motor (sulfato-magnesio,
intubacao-uti, internacao, alta). Cada uma com `directPulseSupport`, `requiresTranslator` e alvos.

### Outputs mapeados

HeartRate, RespirationRate, Systolic/Diastolic/MeanArterialPressure, OxygenSaturation,
CoreTemperature, BloodPH, PaCO₂/PaO₂ (compartimento), Bicarbonate/Lactate (derivados),
HorowitzIndex, e derivados MEDIX (consciência, trabalho respiratório, perfusão). Vitais centrais
cobertos: FC, FR, PA sistólica, SpO₂.

### Templates criados (8)

asthma-severe-adult, tension-pneumothorax-adult, copd-exacerbation-adult, pneumonia-severe-adult,
hemorrhagic-shock-adult, respiratory-failure-adult, pediatric-bronchiolitis-medix-only,
pediatric-cyanotic-heart-disease-medix-only.

## Regras de segurança pediátrica

Sem base pediátrica no engine → casos pediátricos com Pulse exigem
`pediatricSafetyAdapterRequired=true` e ficam em `medix-rule-based` até adaptador validado. O
validador bloqueia pediátrico com `suggestedSimulationProvider='pulse'` sem esse flag.

## Como isso orienta os próximos casos e rubricas

Todo caso novo deve declarar `pulseCompatibility` (conditionId do capability-map, provider
sugerido, cenário candidato). A rubrica continua cobrando reconhecimento de gravidade,
intervenção correta, reavaliação e escalonamento; para casos com fisiologia (ex.: pneumotórax),
a rubrica cobra "não atrasou a intervenção salvadora" e o motor demonstra a piora ao aguardar.

## Validações

- `npm run build` — ✅ compilado, TypeScript 0 erros, rota `○ /casos-dinamicos`.
- `npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts` — ✅ exit 0. Seção Pulse:
  ```
  ✅ Pulse real NÃO é executado (PULSE_EXECUTION_ENABLED=false)
  ✅ Provider atual continua medix-rule-based
  ✅ conditionId reconhecido no capability-map (asthma-severe-adult)
  ✅ Compatibilidade strong/medium (strong)
  ✅ Action map reconhece as intervenções do caso
  ✅ Output map cobre os sinais vitais centrais
  ✅ Template de cenário existe (asthma-severe-adult)
  ```

## Limitações

- Nenhuma execução de Pulse (por design da fase). PaO₂/PaCO₂/lactato/bicarbonato ainda dependem de
  confirmação de `DataRequest` ou derivação MEDIX. Sem base pediátrica. Ações farmacológicas não
  respiratórias (corticoide/antibiótico) são conduta correta sem efeito fisiológico imediato.

## Próximos passos (Fase 3)

- Criar o caso de **pneumotórax hipertensivo** com `pulseProfile` realista usando este mapa.
- Especificar o serviço isolado que implementará `PulseAdapter` (Python/CLI ou microserviço).
- Confirmar nomes de saída de gasometria arterial e ações farmacológicas no engine.

## Confirmação — nenhum app principal alterado

Todas as mudanças ficaram em `lib/dynamic-osce/**` (+ relatório na raiz). Não foram tocados:
`data/casos-v2`, `lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`, `app/treinamento`, ECG,
laboratório, exames, dashboard, feedback principal. `.reference-local` foi apenas **lida**. Nenhum
caso novo criado. Pulse não executado. Sem dependência nova. Sem commit.
```
Arquivos da Fase 2.5:
lib/dynamic-osce/pulse/pulse-capability-map.ts        (novo)
lib/dynamic-osce/pulse/pulse-action-map.ts            (novo)
lib/dynamic-osce/pulse/pulse-output-map.ts            (novo)
lib/dynamic-osce/pulse/pulse-scenario-templates.ts    (novo)
lib/dynamic-osce/pulse/pulse-clinical-translator.ts   (novo)
lib/dynamic-osce/pulse/pulse-adapter.contract.ts      (novo)
lib/dynamic-osce/pulse/index.ts                       (novo)
lib/dynamic-osce/pulse/README-PULSE-MAPPING.md        (novo)
lib/dynamic-osce/types.ts                             (aditivo)
lib/dynamic-osce/cases/piloto-asma-grave-adulto.ts    (declara pulseCompatibility)
lib/dynamic-osce/validators/validar-dynamic-engine.ts (checagens Pulse)
lib/dynamic-osce/scripts/validar-dynamic-osce.ts      (seção Pulse)
lib/dynamic-osce/README-DYNAMIC-OSCE.md               (doc)
```
