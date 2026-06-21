// Utilitários para gerenciar imagens pediátricas no exame físico

/**
 * Obtém o caminho da imagem pediátrica conforme a faixa etária do paciente.
 *
 * Mapeamento:
 * - neonato → lactente-frente.png
 * - lactente → lactente-frente.png
 * - pre_escolar → crianca-frente.png
 * - escolar → crianca-frente.png
 * - adolescente → crianca-frente.png
 * - (sem faixa etária ou desconhecida) → crianca-frente.png
 *
 * @param faixaEtaria - Faixa etária do paciente pediátrico
 * @returns Caminho relativo da imagem pediátrica
 */
export function obterImagemPacientePediatrico(faixaEtaria?: string): string {
  if (!faixaEtaria) {
    return '/images/pediatria/crianca-frente.png';
  }

  switch (faixaEtaria) {
    case 'neonato':
    case 'lactente':
      return '/images/pediatria/lactente-frente-crop.png';
    case 'pre_escolar':
    case 'escolar':
    case 'adolescente':
    default:
      return '/images/pediatria/crianca-frente.png';
  }
}

/**
 * Obtém a descrição da faixa etária em português.
 *
 * @param faixaEtaria - Faixa etária do paciente
 * @returns Descrição em português
 */
export function obterDescricaoFaixaEtaria(faixaEtaria?: string): string {
  if (!faixaEtaria) return 'Criança';

  switch (faixaEtaria) {
    case 'neonato':
      return 'Neonato (0-28 dias)';
    case 'lactente':
      return 'Lactente (1 mês - 2 anos)';
    case 'pre_escolar':
      return 'Pré-escolar (2-6 anos)';
    case 'escolar':
      return 'Escolar (6-12 anos)';
    case 'adolescente':
      return 'Adolescente (12-18 anos)';
    default:
      return 'Criança';
  }
}

/**
 * Verifica se a imagem pediátrica esperada existe.
 * (Apenas para logging/debug - a imagem pode ser substituída depois)
 *
 * @param caminhoimagem - Caminho da imagem
 * @returns Objeto com informações sobre a imagem
 */
export function obterInfoImagem(caminhoImagem: string): {
  caminho: string;
  nome: string;
  tipo: 'lactente' | 'crianca';
} {
  const nome = caminhoImagem.split('/').pop() || '';
  const tipo: 'lactente' | 'crianca' = caminhoImagem.includes('lactente') ? 'lactente' : 'crianca';

  return {
    caminho: caminhoImagem,
    nome,
    tipo,
  };
}
