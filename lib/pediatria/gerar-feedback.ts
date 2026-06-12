// Funções para gerar feedback pediátrico integrado

import {
  obterChecklistPediatrico,
  calcularPontuacaoPediatrica,
  obterItensPerdidos,
  ItemChecklistPediatrico,
  CategoriaPediatrica,
} from './checklists-feedback';
import { criarPromptCorrecaoPediatrica, criarPromptFeedbackFinalPediatrico } from './prompts-feedback';

export interface FeedbackPediatricoResultado {
  casoId: string;
  titulo: string;
  diagnosticoEsperado: string;
  falaModelo: string;
  checklist: any;
  pontuacao: {
    total: number;
    maximo: number;
    porcentagem: number;
  };
  desempenho: {
    pontosFortes: string[];
    pontosPerdidos: ItemChecklistPediatrico[];
    sugestoesEstudo: string[];
  };
  feedback: string;
}

/**
 * Preparar dados para correção pediátrica
 * Esta função retorna o prompt que será enviado à IA para correção
 *
 * @param casoId - ID do caso pediátrico
 * @param casoPaciente - Descrição do paciente
 * @param caseTitle - Título do caso
 * @param manobrasSolicitadas - Manobras realizadas
 * @returns Prompt pronto para API de correção
 */
export function prepararPromptCorrecaoPediatrica(
  casoId: string,
  casoPaciente: string,
  caseTitle: string,
  manobrasSolicitadas: any[]
): string {
  return criarPromptCorrecaoPediatrica(
    casoId,
    casoPaciente,
    caseTitle,
    manobrasSolicitadas
  );
}

/**
 * Processar resultado de feedback pediátrico
 * Combina checklist, pontuação e feedback em um resultado estruturado
 *
 * @param casoId - ID do caso
 * @param itensAtingidos - Array de IDs de itens do checklist atingidos
 * @param feedbackTexto - Texto do feedback gerado pela IA
 * @param diagnosticoAluno - Diagnóstico mencionado pelo aluno
 * @returns Resultado estruturado do feedback
 */
export function processarFeedbackPediatrico(
  casoId: string,
  itensAtingidos: string[],
  feedbackTexto: string,
  diagnosticoAluno?: string
): FeedbackPediatricoResultado | null {
  const checklist = obterChecklistPediatrico(casoId);

  if (!checklist) {
    console.warn(`Checklist não encontrado para caso ${casoId}`);
    return null;
  }

  // Calcular pontuação
  const { total, porCategoria } = calcularPontuacaoPediatrica(checklist, itensAtingidos);
  const pontosPerdidos = obterItensPerdidos(checklist, itensAtingidos);

  // Identificar pontos fortes (categorias com score máximo ou próximo)
  const pontosFortes: string[] = [];
  (Object.entries(porCategoria) as Array<[CategoriaPediatrica, number]>).forEach(([categoria, pontos]) => {
    const pesoMax = checklist.pesoPorCategoria[categoria];
    const percentual = (pontos / pesoMax) * 100;

    if (percentual >= 80) {
      pontosFortes.push(
        `${categoria.replace(/_/g, " ")}: ${pontos.toFixed(1)}/${pesoMax} pontos`
      );
    }
  });

  // Sugestões de estudo baseadas em categorias fracas
  const sugestoesEstudo: string[] = [];
  (Object.entries(porCategoria) as Array<[CategoriaPediatrica, number]>).forEach(([categoria, pontos]) => {
    const pesoMax = checklist.pesoPorCategoria[categoria];
    const percentual = (pontos / pesoMax) * 100;

    if (percentual < 60) {
      switch (categoria) {
        case "comunicacao":
          sugestoesEstudo.push("Melhorar comunicação com responsável e criança");
          break;
        case "anamnese":
          sugestoesEstudo.push("Aprofundar questões sobre queixa atual e sinais de gravidade");
          break;
        case "historia_pediatrica":
          sugestoesEstudo.push("Estudar história pediátrica essencial: vacinação, desenvolvimento, crescimento");
          break;
        case "exame_fisico":
          sugestoesEstudo.push("Treinar técnicas de exame físico pediátrico");
          break;
        case "procedimento":
          sugestoesEstudo.push("Praticar procedimentos pediátricos (PA, FR, perímetro)");
          break;
        case "raciocinio":
          sugestoesEstudo.push("Trabalhar raciocínio clínico pediátrico");
          break;
        case "exames":
          sugestoesEstudo.push("Revisar solicitação apropriada de exames em pediatria");
          break;
        case "conduta_orientacao":
          sugestoesEstudo.push("Melhorar orientação à família e reconhecimento de sinais de alarme");
          break;
      }
    }
  });

  return {
    casoId,
    titulo: checklist.titulo,
    diagnosticoEsperado: checklist.diagnosticoEsperado,
    falaModelo: checklist.falaModeloResumida,
    checklist: {
      itens: checklist.itens.map((item) => ({
        id: item.id,
        descricao: item.descricao,
        categoria: item.categoria,
        atingido: itensAtingidos.includes(item.id),
        peso: item.peso,
        obrigatorio: item.obrigatorio,
      })),
    },
    pontuacao: {
      total: parseFloat(total.toFixed(1)),
      maximo: 20,
      porcentagem: parseFloat(((total / 20) * 100).toFixed(1)),
    },
    desempenho: {
      pontosFortes,
      pontosPerdidos,
      sugestoesEstudo,
    },
    feedback: feedbackTexto,
  };
}

/**
 * Verificar se caso tem checklist pediátrico
 *
 * @param casoId - ID do caso
 * @returns true se caso pediátrico tem checklist
 */
export function temChecklistPediatrico(casoId: string): boolean {
  return obterChecklistPediatrico(casoId) !== undefined;
}

/**
 * Extrair prompt de feedback final estruturado
 * Para casos onde já temos o feedback de texto e queremos estruturar
 *
 * @param casoId - ID do caso
 * @returns Prompt para estruturação final
 */
export function obterPromptEstruturacao(casoId: string): string {
  const checklist = obterChecklistPediatrico(casoId);

  if (!checklist) {
    return "";
  }

  return criarPromptFeedbackFinalPediatrico(
    casoId,
    checklist.diagnosticoEsperado,
    "[Diagnóstico mencionado pelo aluno]",
    0,
    [],
    [],
    checklist.falaModeloResumida
  );
}
