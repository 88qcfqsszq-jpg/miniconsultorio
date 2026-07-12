// ============================================================================
// Casos OSCE Dinâmicos — Beta · Camada PULSE (Fase 2.5 → 6) — barrel
// ----------------------------------------------------------------------------
// Reexporta o mapeamento Pulse/MEDIX. É só contrato/mapa/tradução conceitual —
// não executa o Pulse. Ver README-PULSE-MAPPING.md.
// Fase 6: adiciona normalizer, bridge e adapter experimental (fixture-only).
// ============================================================================

export * from "./pulse-capability-map";
export * from "./pulse-action-map";
export * from "./pulse-output-map";
export * from "./pulse-scenario-templates";
export * from "./pulse-clinical-translator";
export * from "./pulse-adapter.contract";
// Fase 6 — bridge experimental (fixture-based, sem execução real do Pulse)
export * from "./pulse-output-normalizer";
export * from "./pulse-medix-bridge";
export * from "./pulse-experimental-adapter";
// pulse-fixtures-asthma não é exportado pelo barrel — é apenas para teste/script
