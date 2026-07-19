/**
 * Teste de regressão da Etapa 1 (voz Realtime) — fonte única de instruções do
 * Paciente Virtual.
 *
 * Comprova que a refatoração de lib/prompts.ts preserva as regras clínicas:
 * construirInstrucoesBasePaciente(caso) concentra as regras estáticas e é
 * REUTILIZADA por criarPromptPaciente(caso, historico, novaMensagem), que apenas
 * acrescenta a dinâmica do turno (histórico + mensagem atual).
 *
 * Não exige igualdade byte a byte — verifica equivalência funcional/clínica.
 *
 * Runner: npx tsx --test lib/__tests__/prompts-paciente-base.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { construirInstrucoesBasePaciente, criarPromptPaciente } from '../prompts'
import { casosV2 } from '@/data/casos-v2'
import type { Caso } from '@/lib/types'

const CASOS = casosV2 as unknown as Caso[]

function primeiroPediatrico(): Caso {
  const c = CASOS.find((x) => x.tipoPaciente === 'pediatrico' || x.paciente?.tipoPaciente === 'pediatrico')
  assert.ok(c, 'nenhum caso pediátrico encontrado')
  return c!
}

/**
 * FASE 3 (Patient V3): o Caso 1 agora é servido pelo novo núcleo (ver
 * lib/patient-v3/__tests__/wiringPacienteV3.test.mts para os testes
 * específicos do Caso Ouro). Os testes deste arquivo verificam o
 * COMPORTAMENTO LEGADO genérico — por isso usam um caso adulto por id
 * EXPLÍCITO (nunca por seleção implícita como "primeiro adulto do array",
 * que poderia voltar a resolver para o Caso Ouro). id "18": adulto, não
 * registrado em data/casos-v3, sem alterações no working tree — o mesmo
 * caso de controle usado na verificação de paridade da Fase 3.
 */
const CASO_CONTROLE_LEGADO_ID = '18'
function casoLegadoDeControle(): Caso {
  const c = CASOS.find((x) => x.id === CASO_CONTROLE_LEGADO_ID)
  assert.ok(c, `caso de controle "${CASO_CONTROLE_LEGADO_ID}" não encontrado`)
  return c!
}

// ── 1. Regras clínicas estáticas continuam presentes na base ──────────────────
test('base contém as regras clínicas essenciais', () => {
  const base = construirInstrucoesBasePaciente(casoLegadoDeControle())
  for (const marcador of [
    'COMPORTAMENTO REALISTA DO PACIENTE',
    'REGRA DE REVELAÇÃO CLÍNICA CONTROLADA',
    'revele NO MÁXIMO 1',
    'ANTI-REPETIÇÃO',
    'AGUARDE a pergunta do médico',
    'INFORMAÇÕES DO PACIENTE',
    'RESPOSTAS PRÉ-PREPARADAS',
  ]) {
    assert.ok(base.includes(marcador), `faltou marcador: "${marcador}"`)
  }
})

// ── 2. Diagnóstico continua oculto ────────────────────────────────────────────
test('diagnóstico presente na base apenas sob instrução de NÃO REVELAR', () => {
  const caso = casoLegadoDeControle()
  const base = construirInstrucoesBasePaciente(caso)
  const diag = caso.dados_ocultos_do_sistema?.diagnostico_principal
  assert.ok(base.includes('DIAGNÓSTICO (NÃO REVELE)'), 'faltou cabeçalho DIAGNÓSTICO (NÃO REVELE)')
  assert.ok(base.includes('Não revele diagnóstico'), 'faltou a instrução "Não revele diagnóstico"')
  if (diag) {
    assert.ok(base.includes(diag), 'o diagnóstico do caso deveria estar na base (uso interno)')
    // e deve vir depois do cabeçalho de ocultação
    assert.ok(base.indexOf('DIAGNÓSTICO (NÃO REVELE)') < base.indexOf(diag), 'diagnóstico deveria estar sob a seção NÃO REVELE')
  }
})

// ── 3. Regra de revelação controlada permanece ────────────────────────────────
test('revelação controlada (1 dado novo por fala) permanece', () => {
  const base = construirInstrucoesBasePaciente(casoLegadoDeControle())
  assert.ok(base.includes('NO MÁXIMO 1 (um) dado clínico novo'), 'faltou a regra de 1 dado novo por fala')
  assert.ok(base.includes('PROIBIDO'), 'faltaram os exemplos PROIBIDO de checklist')
})

// ── 4. Regras pediátricas continuam presentes ─────────────────────────────────
test('caso pediátrico contém o bloco de regras pediátricas; adulto contém o bloco adulto', () => {
  const basePed = construirInstrucoesBasePaciente(primeiroPediatrico())
  const baseAdulto = construirInstrucoesBasePaciente(casoLegadoDeControle())
  assert.ok(basePed.includes('REGRAS PARA CASOS PEDIÁTRICOS'), 'faltou bloco pediátrico no caso pediátrico')
  assert.ok(!basePed.includes('REGRAS PARA CASOS ADULTOS'), 'caso pediátrico não deveria ter bloco adulto')
  assert.ok(baseAdulto.includes('REGRAS PARA CASOS ADULTOS'), 'faltou bloco adulto no caso adulto')
  assert.ok(!baseAdulto.includes('REGRAS PARA CASOS PEDIÁTRICOS'), 'caso adulto não deveria ter bloco pediátrico')
})

// ── 5. Interlocutor pediátrico continua correto ───────────────────────────────
test('base pediátrica define o interlocutor por faixa etária e informa a faixa do caso', () => {
  for (const caso of CASOS.filter((c) => c.tipoPaciente === 'pediatrico' || c.paciente?.tipoPaciente === 'pediatrico')) {
    const base = construirInstrucoesBasePaciente(caso)
    // As regras de interlocutor por faixa etária estão presentes...
    assert.ok(base.includes('RESPONSÁVEL é o único falante'), `[${caso.id}] faltou regra neonato/lactente`)
    assert.ok(base.includes('ADOLESCENTE é o falante principal'), `[${caso.id}] faltou regra adolescente`)
    // ...e a faixa etária do caso é informada para o modelo escolher o interlocutor.
    const faixa = caso.paciente?.dadosPediatricos?.faixaEtaria
    if (faixa) {
      assert.ok(base.includes(faixa), `[${caso.id}] a faixa etária "${faixa}" deveria constar na base`)
    }
  }
})

// ── 6. Modo texto continua recebendo histórico e nova mensagem ────────────────
test('criarPromptPaciente reutiliza a base e acrescenta histórico + nova mensagem', () => {
  const caso = casoLegadoDeControle()
  const base = construirInstrucoesBasePaciente(caso)
  const historico = [
    { tipo: 'estudante' as const, conteudo: 'O que o trouxe aqui hoje?' },
    { tipo: 'paciente' as const, conteudo: 'Estou com dor no peito.' },
  ]
  const novaMensagem = 'Há quanto tempo começou a dor?'
  const prompt = criarPromptPaciente(caso, historico, novaMensagem)

  // Reuso: a base é prefixo exato do prompt de texto.
  assert.ok(prompt.startsWith(base), 'o prompt de texto deveria começar com a base compartilhada')
  // Dinâmica do turno presente.
  assert.ok(prompt.includes('HISTÓRICO DA CONVERSA:'), 'faltou seção de histórico')
  assert.ok(prompt.includes('ESTUDANTE: O que o trouxe aqui hoje?'), 'faltou fala do estudante no histórico')
  assert.ok(prompt.includes('PACIENTE/RESPONSÁVEL: Estou com dor no peito.'), 'faltou fala do paciente no histórico')
  assert.ok(prompt.includes(`NOVA MENSAGEM DO ESTUDANTE:\n${novaMensagem}`), 'faltou a nova mensagem')
  assert.ok(prompt.includes('Responda apenas com o que o paciente ou responsável diria'), 'faltou instrução final de resposta')
})

test('conversa inicial (histórico vazio) usa "Conversa começando agora"', () => {
  const caso = casoLegadoDeControle()
  const prompt = criarPromptPaciente(caso, [], 'Bom dia, o que o senhor sente?')
  assert.ok(prompt.includes('Conversa começando agora'), 'faltou marcador de conversa inicial')
  assert.ok(prompt.includes('AGUARDE a pergunta do médico'), 'faltou a regra de aguardar o médico')
})

// ── 7. Nenhum dos 76 casos gera prompt vazio/inválido/undefined/null ──────────
test('todos os casos geram base e prompt válidos (sem vazio/undefined/null)', () => {
  assert.ok(CASOS.length >= 70, `esperado ≥70 casos, encontrado ${CASOS.length}`)
  for (const caso of CASOS) {
    const base = construirInstrucoesBasePaciente(caso)
    const prompt = criarPromptPaciente(caso, [], 'O que o traz aqui?')

    for (const [nome, s] of [['base', base], ['prompt', prompt]] as const) {
      assert.equal(typeof s, 'string', `[${caso.id}] ${nome} não é string`)
      assert.ok(s.length > 500, `[${caso.id}] ${nome} curto demais (${s.length})`)
      assert.ok(!/\bundefined\b/.test(s), `[${caso.id}] ${nome} contém "undefined"`)
      assert.ok(!/\bnull\b/.test(s), `[${caso.id}] ${nome} contém "null"`)
      assert.ok(caso.paciente?.nome && s.includes(caso.paciente.nome), `[${caso.id}] ${nome} não inclui o nome do paciente`)
    }
    // Reuso garantido em todos os casos.
    assert.ok(prompt.startsWith(base), `[${caso.id}] prompt de texto não começa com a base`)
  }
})
