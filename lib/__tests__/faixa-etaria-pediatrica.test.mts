/**
 * Teste da microetapa: normalização de faixa etária pediátrica.
 *
 * Comportamento ANTERIOR (bug preexistente): obterInstrucoesRespostaInicialPediatrica
 * comparava a faixa etária contra literais em MAIÚSCULAS ("NEONATO", "PRÉ-ESCOLAR"...),
 * enquanto os casos usam minúsculas e variantes ("pre_escolar", "pré-escolar"). Nenhuma
 * comparação casava → todos os casos pediátricos caíam na instrução inicial GENÉRICA.
 *
 * Comportamento CORRIGIDO: normalizarFaixaEtariaPediatrica converte qualquer variante
 * ao formato canônico ("neonato" | "lactente" | "pre_escolar" | "escolar" | "adolescente"),
 * e cada faixa passa a receber sua instrução inicial específica. Valor desconhecido → null
 * → instrução genérica segura.
 *
 * Runner: npx tsx --test lib/__tests__/faixa-etaria-pediatrica.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { normalizarFaixaEtariaPediatrica, construirInstrucoesBasePaciente } from '../prompts'
import { casosPediatricosV3, casosAdultosV2 } from '@/data/casos-v2'
import type { Caso } from '@/lib/types'

const PEDIATRICOS = casosPediatricosV3 as unknown as Caso[]
const ADULTOS = casosAdultosV2 as unknown as Caso[]

// Frase da instrução inicial GENÉRICA (fallback) — sua presença indica que nenhuma
// faixa específica foi reconhecida.
const FRASE_GENERICA =
  'Responda de forma breve e natural à pergunta inicial do médico. Não entregue todas as informações de uma vez.'

// Frases distintivas por faixa (retornadas por obterInstrucoesRespostaInicialPediatrica).
const FRASE = {
  neonato_lactente: 'Toda a fala deve vir SOMENTE do RESPONSÁVEL',
  pre_escolar: 'Deixe o médico fazer as perguntas. A informação surgirá naturalmente.',
  escolar: 'a CRIANÇA responde sobre sensações',
  adolescente: 'A primeira fala deve ser do ADOLESCENTE respondendo a pergunta inicial.',
}

/** Clona um caso pediátrico real e sobrescreve apenas a faixa etária (sem tocar em dados/casos). */
function casoPediatricoComFaixa(faixa: string): Caso {
  const molde = PEDIATRICOS.find((c) => c.paciente?.dadosPediatricos)
  assert.ok(molde, 'nenhum caso pediátrico com dadosPediatricos para servir de molde')
  const clone = structuredClone(molde!) as any
  clone.paciente.dadosPediatricos.faixaEtaria = faixa
  return clone as Caso
}

// ── 1–10. Normalização (função central) ──────────────────────────────────────
test('normaliza neonato', () => assert.equal(normalizarFaixaEtariaPediatrica('neonato'), 'neonato'))
test('normaliza lactente', () => assert.equal(normalizarFaixaEtariaPediatrica('lactente'), 'lactente'))
test('normaliza pre_escolar', () => assert.equal(normalizarFaixaEtariaPediatrica('pre_escolar'), 'pre_escolar'))
test('normaliza pré-escolar (acento + hífen)', () => assert.equal(normalizarFaixaEtariaPediatrica('pré-escolar'), 'pre_escolar'))
test('normaliza pre-escolar (hífen)', () => assert.equal(normalizarFaixaEtariaPediatrica('pre-escolar'), 'pre_escolar'))
test('normaliza pre escolar (espaço)', () => assert.equal(normalizarFaixaEtariaPediatrica('pre escolar'), 'pre_escolar'))
test('normaliza escolar', () => assert.equal(normalizarFaixaEtariaPediatrica('escolar'), 'escolar'))
test('normaliza adolescente', () => assert.equal(normalizarFaixaEtariaPediatrica('adolescente'), 'adolescente'))
test('normaliza maiúsculas e espaços externos', () => {
  assert.equal(normalizarFaixaEtariaPediatrica('  PRÉ-ESCOLAR '), 'pre_escolar')
  assert.equal(normalizarFaixaEtariaPediatrica('ESCOLAR'), 'escolar')
  assert.equal(normalizarFaixaEtariaPediatrica(' Adolescente '), 'adolescente')
})
test('valor desconhecido / vazio / nulo retorna null', () => {
  assert.equal(normalizarFaixaEtariaPediatrica('xyz'), null)
  assert.equal(normalizarFaixaEtariaPediatrica(''), null)
  assert.equal(normalizarFaixaEtariaPediatrica(null), null)
  assert.equal(normalizarFaixaEtariaPediatrica(undefined), null)
})

// ── 11–15. Instrução inicial correta por faixa (via API pública) ──────────────
test('neonato recebe a instrução do responsável', () => {
  const base = construirInstrucoesBasePaciente(casoPediatricoComFaixa('neonato'))
  assert.ok(base.includes(FRASE.neonato_lactente), 'faltou instrução de responsável (neonato)')
  assert.ok(!base.includes(FRASE_GENERICA), 'neonato caiu na instrução genérica')
})
test('lactente recebe a instrução do responsável', () => {
  const base = construirInstrucoesBasePaciente(casoPediatricoComFaixa('lactente'))
  assert.ok(base.includes(FRASE.neonato_lactente), 'faltou instrução de responsável (lactente)')
  assert.ok(!base.includes(FRASE_GENERICA), 'lactente caiu na instrução genérica')
})
test('pré-escolar (variante com acento) recebe a instrução de pré-escolar', () => {
  const base = construirInstrucoesBasePaciente(casoPediatricoComFaixa('pré-escolar'))
  assert.ok(base.includes(FRASE.pre_escolar), 'faltou instrução de pré-escolar')
  assert.ok(!base.includes(FRASE_GENERICA), 'pré-escolar caiu na instrução genérica')
})
test('escolar recebe a instrução de escolar (criança + responsável)', () => {
  const base = construirInstrucoesBasePaciente(casoPediatricoComFaixa('escolar'))
  assert.ok(base.includes(FRASE.escolar), 'faltou instrução de escolar')
  assert.ok(!base.includes(FRASE_GENERICA), 'escolar caiu na instrução genérica')
})
test('adolescente recebe a instrução de adolescente', () => {
  const base = construirInstrucoesBasePaciente(casoPediatricoComFaixa('adolescente'))
  assert.ok(base.includes(FRASE.adolescente), 'faltou instrução de adolescente')
  assert.ok(!base.includes(FRASE_GENERICA), 'adolescente caiu na instrução genérica')
})

// ── 16. Todos os 16 casos pediátricos EXPORTADOS geram instrução reconhecida ──
test('os 16 casos pediátricos exportados normalizam e recebem instrução específica', () => {
  assert.equal(PEDIATRICOS.length, 16, `esperado 16 casos pediátricos, encontrado ${PEDIATRICOS.length}`)
  for (const caso of PEDIATRICOS) {
    const faixaBruta = caso.paciente?.dadosPediatricos?.faixaEtaria as string | undefined
    const norm = normalizarFaixaEtariaPediatrica(faixaBruta)
    assert.notEqual(norm, null, `[${caso.id}] faixa "${faixaBruta}" não reconhecida`)
    const base = construirInstrucoesBasePaciente(caso)
    assert.ok(!base.includes(FRASE_GENERICA), `[${caso.id}] recebeu instrução GENÉRICA (faixa "${faixaBruta}" não casou)`)
  }
})

// ── 17. Nenhum caso adulto é afetado ──────────────────────────────────────────
// FASE 3 (Patient V3): o Caso 1 agora é servido pelo novo núcleo, então
// "ADULTOS.slice(0, 5)" (que incluía o id "1" por ordem do array) deixou de
// representar o comportamento LEGADO genérico que este teste verifica. Usa-se
// um conjunto EXPLÍCITO e estável de ids adultos — nunca por posição/ordem do
// array — que exclui o Caso Ouro ("1") e qualquer caso com arquivo modificado
// no working tree ("4"). id "18" é o mesmo caso de controle usado na
// verificação de paridade da Fase 3 (ver
// lib/patient-v3/__tests__/wiringPacienteV3.test.mts para os testes
// específicos do Caso Ouro).
const IDS_ADULTOS_DE_CONTROLE = ['5', '18', '19']
test('casos adultos não recebem instruções pediátricas de interlocutor', () => {
  for (const id of IDS_ADULTOS_DE_CONTROLE) {
    const caso = ADULTOS.find((c) => c.id === id)
    assert.ok(caso, `caso de controle "${id}" não encontrado em casosAdultosV2`)
    const base = construirInstrucoesBasePaciente(caso!)
    assert.ok(base.includes('REGRAS PARA CASOS ADULTOS'), `[${caso!.id}] deveria ter bloco adulto`)
    assert.ok(!base.includes(FRASE.neonato_lactente), `[${caso!.id}] adulto não deveria ter instrução de responsável`)
    assert.ok(!base.includes(FRASE.escolar), `[${caso!.id}] adulto não deveria ter instrução de escolar`)
  }
})
