// ============================================================================
// Clinical Engine — ADAPTER: Caso Canônico → Caso OSCE legado
// ----------------------------------------------------------------------------
// Converte um CanonicalCase para um objeto com o MESMO formato dos casos em
// data/casos-osce.ts, para que — NO FUTURO — um caso canônico possa substituir
// um caso legado sem alterar o fluxo (OSCE/HealthBench/Feedback).
//
// NESTA ETAPA o adapter NÃO é conectado a nada. É apenas uma função pura,
// verificável por type-check. Não importa nem altera módulos existentes.
// ============================================================================

import type { CanonicalCase } from "../types/canonical-case";

/**
 * Subconjunto do formato legado efetivamente consumido pelo pipeline atual
 * (rubric-adapter.ts, /api/corrigir, page.tsx). Mantido local para NÃO acoplar
 * ao tipo Caso do app (evita qualquer risco de alteração indireta).
 */
export interface LegacyOSCECaseShape {
  id: number | string;
  titulo: string;
  sistema?: string;
  tema?: string;
  tipoPaciente?: "adulto" | "pediatrico";
  diagnosticoCorreto?: string;
  objetivo_pedagogico?: string;

  dados_visiveis_ao_estudante: {
    nome_paciente: string;
    idade: number;
    sexo: string;
    queixa_principal: string;
    historia_breve?: string;
  };
  dados_ocultos_do_sistema: {
    diagnostico_principal: string;
    diagnosticos_diferenciais: string[];
  };

  paciente: {
    id?: string;
    nome: string;
    idade: number;
    sexo: string;
    queixaPrincipal: string;
    antecedentes: string[];
    alergias: string[];
    medicamentos_em_uso: string[];
  };

  respostaPaciente: Record<string, string>;
  respostas_do_paciente: Record<string, string>;

  sinaisVitaisCorretos: Record<string, unknown>;

  exame_fisico_interativo: {
    geral: Record<string, string>;
    respiratorio: Record<string, string>;
    cardiovascular?: Record<string, string>;
  };

  exames_complementares_disponiveis: Array<{
    nome: string;
    descricao?: string;
    resultado: string;
    interpretacao: string;
  }>;

  examesIndicados: string[];
  condutaCorreta: string;

  checklist_osce: Array<{ item: string; realizado: boolean; critico: boolean }>;
  rubrica_correcao: Array<{ criterio: string; peso: number; descricao: string; pontuacao_maxima: number }>;
  erros_criticos: Array<{ erro: string; descricao: string; penalidade: number }>;
}

/** Converte um CanonicalCase no formato legado consumido pelo pipeline atual. */
export function toLegacyOSCECase(c: CanonicalCase): LegacyOSCECaseShape {
  const respostas: Record<string, string> = {
    inicial: c.scriptPaciente.aberturaEspontanea,
    ...c.scriptPaciente.respostasDirigidas,
  };

  return {
    id: c.identificacao.legacyId,
    titulo: c.identificacao.titulo,
    sistema: c.identificacao.sistema,
    tema: c.identificacao.especialidade,
    tipoPaciente: c.paciente.tipoPaciente,
    diagnosticoCorreto: c.identificacao.diagnostico,
    objetivo_pedagogico: c.identificacao.objetivosAprendizagem[0],

    dados_visiveis_ao_estudante: {
      nome_paciente: c.paciente.nome,
      idade: c.paciente.idade,
      sexo: c.paciente.sexo === "F" ? "Feminino" : "Masculino",
      queixa_principal: c.paciente.queixaPrincipal,
      historia_breve: c.historia.hda,
    },
    dados_ocultos_do_sistema: {
      diagnostico_principal: c.identificacao.diagnostico,
      diagnosticos_diferenciais: c.diagnostico.diferenciais.map((d) => d.diagnostico),
    },

    paciente: {
      id: `${c.identificacao.canonicalId}-${c.identificacao.legacyId}`,
      nome: c.paciente.nome,
      idade: c.paciente.idade,
      sexo: c.paciente.sexo,
      queixaPrincipal: c.paciente.queixaPrincipal,
      antecedentes: c.historia.antecedentes,
      alergias: c.historia.alergias,
      medicamentos_em_uso: c.historia.medicacoes,
    },

    respostaPaciente: respostas,
    respostas_do_paciente: respostas,

    sinaisVitaisCorretos: { ...c.exameFisico.sinaisVitais },

    exame_fisico_interativo: {
      geral: {
        estado_geral: c.exameFisico.estadoGeral,
      },
      respiratorio: {
        ausculta_pulmonar: c.exameFisico.respiratorio,
      },
      cardiovascular: {
        ausculta_cardiaca: c.exameFisico.cardiovascular,
      },
    },

    exames_complementares_disponiveis: c.exames.map((e) => ({
      nome: e.nome,
      descricao: e.justificativa,
      resultado: e.resultadoEsperado,
      interpretacao: e.interpretacao,
    })),

    examesIndicados: c.exames.filter((e) => e.solicitavel).map((e) => e.nome),
    condutaCorreta: c.conduta.tratamento.join("; "),

    // Rubrica/checklist/erros: repassados 1:1 (compatível com rubric-adapter.ts).
    checklist_osce: c.rubrica.checklistOsce.map((it) => ({
      item: it.item,
      realizado: false,
      critico: it.critico,
    })),
    rubrica_correcao: c.rubrica.rubricaCorrecao.map((r) => ({
      criterio: r.criterio,
      peso: r.peso,
      descricao: r.descricao,
      pontuacao_maxima: r.pontuacaoMaxima,
    })),
    erros_criticos: c.rubrica.errosCriticos.map((e) => ({
      erro: e.erro,
      descricao: e.descricao,
      penalidade: e.penalidade,
    })),
  };
}
