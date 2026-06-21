/**
 * FIXTURES EDUCACIONAIS - Dados de Teste Local
 *
 * ⚠️ IMPORTANTE:
 * - Estas são FIXTURES, não dados reais do NIH
 * - Use APENAS em desenvolvimento local
 * - Nunca em produção
 * - Nunca retornar como se fossem do NIH real
 *
 * Uso:
 * - Testar UI do módulo "Análise de Imagem"
 * - Validar fluxo de interpretação radiológica
 * - Desenvolvimento visual sem dependência de Google Cloud
 *
 * Cada fixture está marcada com:
 * - integracaoReal: false (não é de integração real)
 * - fonte: "Fixture educacional local" (clareza total)
 * - validadoPorIA: false (ainda não validado)
 */

import type { ImagemRadiologica } from "../types";

// ============================================================================
// FIXTURES DE TESTE - PNEUMONIA
// ============================================================================

/**
 * Fixture: Caso de pneumonia em paciente adulto
 * Diagnóstico: Pneumonia
 * Achado: Infiltrado alveolar em lobo inferior direito
 */
export const fixturesPneumonia: ImagemRadiologica[] = [
  {
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    imageId: "fixture-pneumonia-001",
    imageUrl: "/fixtures/chest-xray-pneumonia-001.png",
    labels: ["Pneumonia"],
    diagnosticoRadiologico: "Pneumonia com consolidação alveolar",
    achadoPrincipal: "Infiltrado alveolar no lobo inferior direito",

    fonte: "Fixture educacional local",
    atribuicao: "Dados de teste - não representa integração NIH real",

    // Marcação obrigatória
    integracaoReal: false,
    validadoPorIA: false,
    podeExibirAoAluno: true, // Apenas para desenvolvimento visual local

    dataAssociacao: new Date().toISOString(),
  },
  {
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    imageId: "fixture-pneumonia-002",
    imageUrl: "/fixtures/chest-xray-pneumonia-002.png",
    labels: ["Pneumonia"],
    diagnosticoRadiologico: "Pneumonia bilateral com padrão intersticial",
    achadoPrincipal: "Opacidades intersticiais bilaterais",

    fonte: "Fixture educacional local",
    atribuicao: "Dados de teste - não representa integração NIH real",

    integracaoReal: false,
    validadoPorIA: false,
    podeExibirAoAluno: true,

    dataAssociacao: new Date().toISOString(),
  },
];

// ============================================================================
// FIXTURES DE TESTE - PNEUMOTÓRAX
// ============================================================================

/**
 * Fixture: Caso de pneumotórax espontâneo
 * Diagnóstico: Pneumotórax
 * Achado: Colapso pulmonar parcial à direita
 */
export const fixturesPneumotorax: ImagemRadiologica[] = [
  {
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    imageId: "fixture-pneumothorax-001",
    imageUrl: "/fixtures/chest-xray-pneumothorax-001.png",
    labels: ["Pneumothorax"],
    diagnosticoRadiologico: "Pneumotórax espontâneo direito",
    achadoPrincipal: "Colapso pulmonar parcial com linha pleural visível",

    fonte: "Fixture educacional local",
    atribuicao: "Dados de teste - não representa integração NIH real",

    integracaoReal: false,
    validadoPorIA: false,
    podeExibirAoAluno: true,

    dataAssociacao: new Date().toISOString(),
  },
];

// ============================================================================
// FIXTURES DE TESTE - DERRAME PLEURAL
// ============================================================================

/**
 * Fixture: Caso de derrame pleural
 * Diagnóstico: Derrame pleural
 * Achado: Efusão pleural bilateral
 */
export const fixtureDerramePleural: ImagemRadiologica[] = [
  {
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    imageId: "fixture-effusion-001",
    imageUrl: "/fixtures/chest-xray-effusion-001.png",
    labels: ["Effusion"],
    diagnosticoRadiologico: "Derrame pleural bilateral",
    achadoPrincipal: "Opacidade basal bilateral compatível com efusão",

    fonte: "Fixture educacional local",
    atribuicao: "Dados de teste - não representa integração NIH real",

    integracaoReal: false,
    validadoPorIA: false,
    podeExibirAoAluno: true,

    dataAssociacao: new Date().toISOString(),
  },
];

// ============================================================================
// FIXTURES DE TESTE - CARDIOMEGALIA
// ============================================================================

/**
 * Fixture: Caso de cardiomegalia
 * Diagnóstico: Cardiomegalia
 * Achado: Aumento do índice cardiotorácico
 */
export const fixturesCardiomegalia: ImagemRadiologica[] = [
  {
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    imageId: "fixture-cardiomegaly-001",
    imageUrl: "/fixtures/chest-xray-cardiomegaly-001.png",
    labels: ["Cardiomegaly"],
    diagnosticoRadiologico: "Cardiomegalia com aumento do índice cardiotorácico",
    achadoPrincipal: "Silhueta cardíaca aumentada, índice cardiotorácico >0.5",

    fonte: "Fixture educacional local",
    atribuicao: "Dados de teste - não representa integração NIH real",

    integracaoReal: false,
    validadoPorIA: false,
    podeExibirAoAluno: true,

    dataAssociacao: new Date().toISOString(),
  },
];

// ============================================================================
// FIXTURES DE TESTE - RX NORMAL
// ============================================================================

/**
 * Fixture: RX de tórax normal
 * Diagnóstico: Sem alteração
 * Achado: RX normal
 */
export const fixturesNormal: ImagemRadiologica[] = [
  {
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    imageId: "fixture-normal-001",
    imageUrl: "/fixtures/chest-xray-normal-001.png",
    labels: ["No Finding"],
    diagnosticoRadiologico: "RX de tórax sem alterações",
    achadoPrincipal: "Normal - sem achados patológicos visíveis",

    fonte: "Fixture educacional local",
    atribuicao: "Dados de teste - não representa integração NIH real",

    integracaoReal: false,
    validadoPorIA: false,
    podeExibirAoAluno: true,

    dataAssociacao: new Date().toISOString(),
  },
  {
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    imageId: "fixture-normal-002",
    imageUrl: "/fixtures/chest-xray-normal-002.png",
    labels: ["No Finding"],
    diagnosticoRadiologico: "RX de tórax normal",
    achadoPrincipal: "Pulmões e mediastino normais",

    fonte: "Fixture educacional local",
    atribuicao: "Dados de teste - não representa integração NIH real",

    integracaoReal: false,
    validadoPorIA: false,
    podeExibirAoAluno: true,

    dataAssociacao: new Date().toISOString(),
  },
];

// ============================================================================
// MAPA DE FIXTURES POR RÓTULO NIH
// ============================================================================

/**
 * Mapa de fixtures por rótulo NIH
 * Usado para busca rápida quando em modo desenvolvimento
 */
export const mapFixturesPorRotulo: Record<string, ImagemRadiologica[]> = {
  "Pneumonia": fixturesPneumonia,
  "Pneumothorax": fixturesPneumotorax,
  "Effusion": fixtureDerramePleural,
  "Cardiomegaly": fixturesCardiomegalia,
  "No Finding": fixturesNormal,
};

// ============================================================================
// FUNÇÃO HELPER: OBTER FIXTURE ALEATÓRIA
// ============================================================================

/**
 * Obtém uma fixture aleatória para um rótulo NIH específico
 *
 * APENAS para desenvolvimento local
 * NUNCA use esta função em produção
 *
 * @param rotulo Rótulo NIH (ex: "Pneumonia")
 * @returns Fixture aleatória ou undefined se não existir
 */
export function obterFixtureAleatoria(rotulo: string): ImagemRadiologica | undefined {
  const fixtures = mapFixturesPorRotulo[rotulo];

  if (!fixtures || fixtures.length === 0) {
    return undefined;
  }

  const indiceAleatorio = Math.floor(Math.random() * fixtures.length);
  return fixtures[indiceAleatorio];
}

// ============================================================================
// FUNÇÃO HELPER: LISTAR RÓTULOS COM FIXTURES
// ============================================================================

/**
 * Lista todos os rótulos que têm fixtures disponíveis
 *
 * Útil para desenvolvimento e debugging
 */
export function listarRotulosComFixtures(): string[] {
  return Object.keys(mapFixturesPorRotulo);
}

// ============================================================================
// AVISO IMPORTANTE
// ============================================================================

/**
 * Aviso que deve ser exibido quando usando fixtures
 */
export const AVISO_FIXTURE = `
⚠️ MODO DE DESENVOLVIMENTO - Usando dados de teste local
Estas imagens são FIXTURES educacionais, não dados reais do NIH Chest X-ray.
Não envie este conteúdo a pacientes reais.
Para integração com NIH real, configure as variáveis de ambiente.
`;
