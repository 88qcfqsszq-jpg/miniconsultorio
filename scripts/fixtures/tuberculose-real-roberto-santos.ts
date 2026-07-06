// ============================================================================
// Fixture de AUDITORIA (NLP Shadow Mode) — atendimento real de tuberculose
// ----------------------------------------------------------------------------
// Transcrição textual do atendimento de Roberto Santos (tuberculose pulmonar
// ativa). Usada apenas pelo shadow mode; NÃO é importada pela aplicação.
// ============================================================================

export type ShadowFixture = {
  casoId: string;
  paciente: string;
  diagnosticoEsperado: string;
  diagnosisKey: string; // chave de pacote NLP (diagnosis-nlp-pack)
  transcript: string;
  exameFisico?: string;
  examesSolicitados?: string;
  sinaisVitais?: string;
  diagnosticoInformado?: string;
  conduta?: string;
  soap?: string;
  // Critérios que o feedback real (grader) reconheceu / marcou como faltou.
  // Preenchidos a partir do relatório do atendimento, quando disponível.
  feedbackReconheceu?: string[];
  feedbackFaltou?: string[];
};

export const TUBERCULOSE_REAL_ROBERTO_SANTOS: ShadowFixture = {
  casoId: "11",
  paciente: "Roberto Santos",
  diagnosticoEsperado: "Tuberculose pulmonar ativa",
  diagnosisKey: "tuberculose_pulmonar",
  transcript: [
    "Aluno: O senhor é o Roberto Santos?",
    "Paciente: Sim, sou eu.",
    "Aluno: O senhor teve contato com alguém com tuberculose?",
    "Paciente: Meu irmão teve tuberculose há 2 anos.",
    "Aluno: O senhor está com falta de ar?",
    "Paciente: Não, falta de ar eu não tenho.",
    "Aluno: Tem mais algum sintoma?",
    "Paciente: Estou com tosse há mais de 3 semanas, febre à noite e perdi peso.",
  ].join("\n"),
  examesSolicitados: "Solicito trm tb e hemograma.",
  diagnosticoInformado: "tuberculose pulmonar",
  conduta: "Vou iniciar antibioticoterapia e dipirona para a febre.",
  // Resultado típico do feedback real (parcial) — para comparação shadow.
  feedbackReconheceu: [
    "tosse persistente / tosse crônica",
    "perda de peso / sintomas constitucionais",
  ],
  feedbackFaltou: [
    "teste rápido molecular (TRM-TB) não solicitado",
    "RX de tórax",
    "baciloscopia/cultura de escarro",
    "máscara/etiqueta respiratória",
    "notificação/vigilância",
    "investigação de contatos",
    "RIPE",
    "febre vespertina/noturna não valorizada",
    "contato epidemiológico subpontuado",
  ],
};
