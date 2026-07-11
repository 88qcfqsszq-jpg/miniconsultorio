# Pulse Mapping — camada de compatibilidade (Fase 2.5)

Camada **conceitual** que liga os casos dinâmicos MEDIX ao **Pulse Physiology Engine**
(`engine-stable`) **sem executar o Pulse**. É só contrato, mapa e tradução em TypeScript.

## Objetivo

Fazer os casos e rubricas **nascerem sincronizados** com o motor fisiológico, para que, quando
um Pulse Adapter real existir (serviço isolado), a troca seja transparente — sem reescrever casos
nem quebrar o app.

## O que foi mapeado

- **`pulse-capability-map.ts`** — classifica condições em `strong | medium | weak | not-supported`,
  com cenários candidatos reais do engine, overlay MEDIX e segurança pediátrica.
- **`pulse-action-map.ts`** — intervenções MEDIX → ações Pulse candidatas
  (`PatientAction.*` / `EquipmentAction.*`), com alvos fisiológicos esperados.
- **`pulse-output-map.ts`** — saídas Pulse (nomes reais de `DataRequest`, ex.: `HeartRate`,
  `OxygenSaturation`, `RespirationRate`, `BloodPH`, `HorowitzIndex`) → campos clínicos MEDIX;
  campos sem saída direta ficam `derivedByMedix`.
- **`pulse-scenario-templates.ts`** — templates conceituais por caso (fisiologia inicial, ações
  obrigatórias, atrasos perigosos, implicações de rubrica).
- **`pulse-clinical-translator.ts`** — funções puras: `translatePulseOutputsToMedixState`,
  `classifyPulseCompatibility`, `getPulseScenarioTemplateById`, `getPulseActionCandidate`,
  `interpretDynamicTrend`.
- **`pulse-adapter.contract.ts`** — contrato TS do futuro adaptador (`PulseAdapter` +
  `PulseScenarioSession`, `PulseActionRequest`, `PulseOutputSnapshot`, `PulseAdapterStatus`,
  `PulseAdapterError`) e o interruptor `PULSE_EXECUTION_ENABLED = false`.

## O que ainda depende de investigação do `engine-stable.zip`

- Nomes exatos de saída para **PaO₂/PaCO₂ arteriais** (hoje via compartimento `Aorta/*/PartialPressure`).
- Disponibilidade de **Lactato/Bicarbonato** como `DataRequest` direto (marcados `derivedByMedix`).
- Ações dedicadas para **ipratrópio, corticoide, magnésio, antibiótico** (hoje aproximadas por
  `SubstanceBolus/Infusion` — efeito modelado como overlay).
- Base **pediátrica** (não encontrada) — exige adaptador de segurança antes de qualquer uso.

## Como um caso novo declara compatibilidade

No bloco `simulacao` do caso:

```ts
simulacao: {
  simulationProvider: "medix-rule-based", // execução atual
  pulseReady: true,
  pulseScenarioId: "data/human/adult/scenarios/patient/AsthmaAttackSevereAcute.json",
  pulseCompatibility: {
    conditionId: "asthma-severe-adult",
    compatibility: "strong",
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [...],
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    notes: [...],
  },
}
```

Regras validadas automaticamente (validar-dynamic-engine + script):
- `pulseReady=true` exige `pulseCompatibility`;
- `compatibility='not-supported'` não pode sugerir `pulse`;
- pediátrico com provider `pulse` exige `pediatricSafetyAdapterRequired=true`;
- `pulseScenarioId` com cara de placeholder deve estar marcado (`pulseScenarioIsPlaceholder=true`);
- provider em execução permanece `medix-rule-based` (o script nunca executa Pulse).

## Como o futuro Pulse Adapter entra sem quebrar o app

1. Implementar `PulseAdapter` (contrato deste diretório) num **serviço isolado** (Python/CLI ou
   microserviço) — **nunca** import direto do C++ no bundle Next.
2. Ligar `PULSE_EXECUTION_ENABLED` e selecionar o provider por caso.
3. Usar `translatePulseOutputsToMedixState` para alimentar o painel; a rubrica MEDIX permanece
   a fonte da nota. `medix-rule-based` continua como fallback offline.
