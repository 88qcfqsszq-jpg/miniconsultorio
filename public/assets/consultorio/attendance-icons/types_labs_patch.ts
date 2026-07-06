export interface FonteExamePainel {
  interpretacao: string;
  dados: Record<string, string>;
}

export interface FonteExamesLaboratoriais {
  hemograma?: FonteExamePainel;
  funcao_renal?: FonteExamePainel;
  eletrolitos?: FonteExamePainel;
  marcadores_inflamatorios?: FonteExamePainel;
  gasometria?: FonteExamePainel;
  marcadores_cardiacos?: FonteExamePainel;
  funcao_hepatica?: FonteExamePainel;
  coagulograma?: FonteExamePainel;
  urina_tipo_1?: FonteExamePainel;
}

// Dentro da interface Caso:
// fonte_exames_laboratoriais?: FonteExamesLaboratoriais;
