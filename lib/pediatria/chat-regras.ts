/**
 * Regras de fala para pacientes pediátricos
 * Define quem pode falar em cada faixa etária
 */

import { Caso } from '@/lib/types';

export type NivelFala = 'nao_fala' | 'responsavel_apenas' | 'limitado' | 'completo';

/**
 * Determina se um paciente pediátrico pode falar diretamente
 *
 * @param caso - Caso clínico
 * @returns 'nao_fala' | 'responsavel_apenas' | 'limitado' | 'completo'
 *
 * Regras:
 * - neonato: nunca fala (responsável apenas)
 * - lactente: nunca fala (responsável apenas)
 * - pré-escolar: responsável fala principalmente, criança faz frases curtas
 * - escolar: criança responde perguntas simples, responsável complementa
 * - adolescente: criança fala normalmente, responsável pode complementar
 */
export function obterNivelFalaPediatrico(caso: Caso): NivelFala {
  const isPediatrico = caso.tipoPaciente === 'pediatrico' || caso.paciente.tipoPaciente === 'pediatrico';

  if (!isPediatrico) {
    return 'completo'; // Adulto fala normalmente
  }

  const faixaEtaria = caso.paciente.dadosPediatricos?.faixaEtaria;
  const idadeMeses = caso.paciente.dadosPediatricos?.idadeMeses;
  const idadeAnos = caso.paciente.idade; // idade em anos no campo principal

  // Neonato e lactente nunca falam
  if (faixaEtaria === 'neonato' || faixaEtaria === 'lactente') {
    return 'nao_fala';
  }

  // Pré-escolar: responsável fala principalmente
  if (faixaEtaria === 'pre_escolar') {
    return 'responsavel_apenas';
  }

  // Escolar: criança pode responder perguntas simples, responsável complementa
  if (faixaEtaria === 'escolar') {
    return 'limitado';
  }

  // Adolescente: fala normalmente
  if (faixaEtaria === 'adolescente') {
    return 'completo';
  }

  // Fallback
  return 'responsavel_apenas';
}

/**
 * Obtém o prefixo de quem está falando (Mãe, Pai, Responsável, Criança)
 */
export function obterPrefixoFalante(caso: Caso, tipoFalante: 'paciente' | 'responsavel' = 'responsavel'): string {
  const isPediatrico = caso.tipoPaciente === 'pediatrico' || caso.paciente.tipoPaciente === 'pediatrico';

  if (!isPediatrico || tipoFalante === 'paciente') {
    return 'Paciente:';
  }

  const parentesco = caso.paciente.dadosPediatricos?.responsavel?.parentesco || 'Mãe';

  // Capitalizar primeira letra
  const prefixo = parentesco.charAt(0).toUpperCase() + parentesco.slice(1);
  return `${prefixo}:`;
}

/**
 * Gera a mensagem inicial do chat para pediátricos
 */
export function gerarMensagemInicial(caso: Caso): string {
  const isPediatrico = caso.tipoPaciente === 'pediatrico' || caso.paciente.tipoPaciente === 'pediatrico';

  if (!isPediatrico) {
    // Adulto
    return `Oi doutor/doutora, tudo bem? Meu nome é ${caso.paciente.nome}, tô aqui porque não tô me sentindo bem.`;
  }

  const nomePaciente = caso.paciente.nome;
  const queixa = caso.paciente.queixaPrincipal;
  const faixaEtaria = caso.paciente.dadosPediatricos?.faixaEtaria;
  const responsavel = caso.paciente.dadosPediatricos?.responsavel;
  const parentesco = responsavel?.parentesco || 'Mãe';

  // Para neonato e lactente, sempre o responsável fala
  if (faixaEtaria === 'neonato' || faixaEtaria === 'lactente') {
    const prefixo = parentesco.charAt(0).toUpperCase() + parentesco.slice(1);
    return `${prefixo}: Oi, doutor(a). Eu trouxe o ${nomePaciente} porque ${queixa.toLowerCase()}.`;
  }

  // Para pré-escolar
  if (faixaEtaria === 'pre_escolar') {
    const prefixo = parentesco.charAt(0).toUpperCase() + parentesco.slice(1);
    return `${prefixo}: Oi, doutor(a). Trouxe o ${nomePaciente} porque ${queixa.toLowerCase()}.`;
  }

  // Para escolar/adolescente
  if (faixaEtaria === 'escolar' || faixaEtaria === 'adolescente') {
    return `Oi, doutor(a). Eu vim porque ${queixa.toLowerCase()}.`;
  }

  // Fallback
  return `Oi, doutor(a). Meu nome é ${nomePaciente}.`;
}

/**
 * Formata uma resposta de paciente pediátrico com prefixo correto
 */
export function formatarRespostaPediatrica(
  caso: Caso,
  resposta: string,
  tipoFalante: 'paciente' | 'responsavel' = 'responsavel'
): string {
  const nivelFala = obterNivelFalaPediatrico(caso);

  // Se paciente não pode falar, sempre responsável
  if (nivelFala === 'nao_fala') {
    tipoFalante = 'responsavel';
  }

  // Se fala limitada, pode ser paciente para perguntas simples
  // mas começamos com responsável por padrão
  if (nivelFala === 'limitado' && tipoFalante === 'responsavel') {
    const parentesco = caso.paciente.dadosPediatricos?.responsavel?.parentesco || 'Mãe';
    const prefixo = parentesco.charAt(0).toUpperCase() + parentesco.slice(1);
    return `${prefixo}: ${resposta}`;
  }

  // Adulto fala sem prefixo especial
  if (nivelFala === 'completo') {
    return resposta;
  }

  return resposta;
}
