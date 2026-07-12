// ============================================================================
// Casos OSCE Dinâmicos — Beta · CATÁLOGO DE INTERVENÇÕES
// ----------------------------------------------------------------------------
// Metadados das intervenções (rótulo, descrição, categoria). NÃO contém a
// física da simulação — isso vive em dynamic-state-engine.ts. Separado para que
// a UI e os casos consultem um catálogo único e estável.
// ============================================================================

import type { Intervention, InterventionId } from "./types";

export const CATALOGO_INTERVENCOES: Record<InterventionId, Intervention> = {
  oxigenio: {
    id: "oxigenio",
    label: "Oxigênio suplementar",
    descricao: "Ofertar O₂ para corrigir a hipoxemia (alvo SpO₂ ≥ 92%).",
    categoria: "suporte",
  },
  salbutamol: {
    id: "salbutamol",
    label: "Salbutamol (SABA)",
    descricao: "Beta-agonista de curta ação inalatório/nebulização.",
    categoria: "medicacao",
  },
  ipratropio: {
    id: "ipratropio",
    label: "Ipratrópio",
    descricao: "Anticolinérgico associado ao SABA na crise grave.",
    categoria: "medicacao",
  },
  corticoide: {
    id: "corticoide",
    label: "Corticoide sistêmico",
    descricao: "Controla a exacerbação; efeito não é imediato.",
    categoria: "medicacao",
  },
  "sulfato-magnesio": {
    id: "sulfato-magnesio",
    label: "Sulfato de magnésio",
    descricao: "Reservado à crise grave/refratária.",
    categoria: "medicacao",
  },
  reavaliar: {
    id: "reavaliar",
    label: "Reavaliar / monitorizar",
    descricao: "Reavaliar resposta clínica e sinais vitais.",
    categoria: "monitorizacao",
  },
  internacao: {
    id: "internacao",
    label: "Internação",
    descricao: "Encaminhar para internação por resposta inadequada.",
    categoria: "decisao",
  },
  "intubacao-uti": {
    id: "intubacao-uti",
    label: "Intubação / UTI",
    descricao: "Via aérea avançada diante de deterioração.",
    categoria: "decisao",
  },
  alta: {
    id: "alta",
    label: "Alta",
    descricao: "Liberar o paciente. Insegura se ainda houver hipoxemia/esforço.",
    categoria: "decisao",
  },

  // ---- Fase 3 — emergência torácica / suporte -----------------------------
  oxigenio_alto_fluxo: {
    id: "oxigenio_alto_fluxo",
    label: "Oxigênio de alto fluxo",
    descricao: "Máscara não reinalante / alto fluxo. Suporte, não resolve a causa.",
    categoria: "suporte",
  },
  descompressao_toracica: {
    id: "descompressao_toracica",
    label: "Descompressão torácica (agulha)",
    descricao: "Punção de alívio no pneumotórax hipertensivo — intervenção salvadora.",
    categoria: "procedimento",
  },
  drenagem_toracica: {
    id: "drenagem_toracica",
    label: "Drenagem torácica",
    descricao: "Toracostomia com dreno — tratamento definitivo após a descompressão.",
    categoria: "procedimento",
  },
  monitorizacao: {
    id: "monitorizacao",
    label: "Monitorização",
    descricao: "Oximetria contínua, monitor cardíaco e PA seriada.",
    categoria: "monitorizacao",
  },
  acesso_venoso: {
    id: "acesso_venoso",
    label: "Acesso venoso",
    descricao: "Obter acesso venoso calibroso.",
    categoria: "suporte",
  },
  fluidos_suporte: {
    id: "fluidos_suporte",
    label: "Fluidos (suporte)",
    descricao: "Reposição volêmica de suporte. Não resolve a tensão intratorácica.",
    categoria: "suporte",
  },
  analgesia: {
    id: "analgesia",
    label: "Analgesia",
    descricao: "Controle da dor torácica.",
    categoria: "medicacao",
  },
  solicitar_rx_torax: {
    id: "solicitar_rx_torax",
    label: "Solicitar RX de tórax",
    descricao: "Radiografia. NÃO deve atrasar a descompressão em paciente instável.",
    categoria: "monitorizacao",
  },
  solicitar_usg_torax: {
    id: "solicitar_usg_torax",
    label: "USG torácico (beira-leito)",
    descricao: "Ultrassom à beira-leito — rápido, não atrasa a conduta.",
    categoria: "monitorizacao",
  },
  aguardar_exames: {
    id: "aguardar_exames",
    label: "Aguardar exames",
    descricao: "Esperar resultados antes de agir. Perigoso no paciente instável.",
    categoria: "decisao",
  },
  alta_precoce: {
    id: "alta_precoce",
    label: "Alta precoce",
    descricao: "Liberar antes da estabilização. Erro crítico nesta condição.",
    categoria: "decisao",
  },

  // ---- Fase 4 — DPOC exacerbado ------------------------------------------
  oxigenio_controlado: {
    id: "oxigenio_controlado",
    label: "O₂ controlado (alvo 88–92%)",
    descricao: "Oxigenioterapia titulada. Alvo SpO₂ 88–92% no DPOC; evita narcose por CO₂.",
    categoria: "suporte",
  },
  oxigenio_alto_fluxo_sem_controle: {
    id: "oxigenio_alto_fluxo_sem_controle",
    label: "O₂ alto fluxo s/ controle",
    descricao: "Alto fluxo sem titulação. Perigoso no DPOC: agrava retenção de CO₂ (narcose).",
    categoria: "suporte",
  },
  ventilacao_nao_invasiva: {
    id: "ventilacao_nao_invasiva",
    label: "Ventilação não invasiva (VNI)",
    descricao: "CPAP/BiPAP: reduz trabalho respiratório e melhora eliminação de CO₂.",
    categoria: "procedimento",
  },
  antibiotico_se_indicado: {
    id: "antibiotico_se_indicado",
    label: "Antibiótico (se indicado)",
    descricao: "Indicado na exacerbação infecciosa (escarro purulento/febre). Sem efeito imediato nos sinais vitais.",
    categoria: "medicacao",
  },
  sedativo_sem_indicacao: {
    id: "sedativo_sem_indicacao",
    label: "Sedativo sem indicação",
    descricao: "Contraindicado no DPOC com retenção de CO₂. Suprime o drive respiratório.",
    categoria: "medicacao",
  },
};

/** Resolve o metadado de uma intervenção pelo id. */
export function obterIntervencao(id: InterventionId): Intervention {
  return CATALOGO_INTERVENCOES[id];
}

/** Lista de intervenções na ordem de exibição sugerida para a UI. */
export function listarIntervencoes(ids: InterventionId[]): Intervention[] {
  return ids.map((id) => CATALOGO_INTERVENCOES[id]).filter(Boolean);
}
