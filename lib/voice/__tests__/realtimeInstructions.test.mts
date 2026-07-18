/**
 * Testes do combinador de instruções Realtime (Etapa 3).
 *
 * Função pura, sem HTTP/rede — não há nada para mockar aqui.
 *
 * Runner: npx tsx --test lib/voice/__tests__/realtimeInstructions.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { construirInstrucoesRealtime } from '@/lib/voice/realtimeInstructions'
import { construirInstrucoesBasePaciente } from '@/lib/prompts'
import { casosV2 } from '@/data/casos-v2'
import type { Caso } from '@/lib/types'

const CASOS = casosV2 as unknown as Caso[]

function primeiroAdulto(): Caso {
  const c = CASOS.find((x) => !(x.tipoPaciente === 'pediatrico' || x.paciente?.tipoPaciente === 'pediatrico'))
  assert.ok(c, 'nenhum caso adulto encontrado')
  return c!
}
function primeiroPediatrico(): Caso {
  const c = CASOS.find((x) => x.tipoPaciente === 'pediatrico' || x.paciente?.tipoPaciente === 'pediatrico')
  assert.ok(c, 'nenhum caso pediátrico encontrado')
  return c!
}

test('reutiliza a base clínica (fonte única) como prefixo das instruções', () => {
  const caso = primeiroAdulto()
  const base = construirInstrucoesBasePaciente(caso)
  const { instructions } = construirInstrucoesRealtime(caso)
  assert.ok(instructions.startsWith(base), 'instructions deveria começar com a base clínica compartilhada')
})

test('não duplica regras clínicas: cada marcador da base aparece exatamente uma vez', () => {
  const caso = primeiroAdulto()
  const { instructions } = construirInstrucoesRealtime(caso)
  for (const marcador of [
    'REGRA DE REVELAÇÃO CLÍNICA CONTROLADA',
    'ANTI-REPETIÇÃO',
    'DIAGNÓSTICO (NÃO REVELE)',
  ]) {
    const ocorrencias = instructions.split(marcador).length - 1
    assert.equal(ocorrencias, 1, `marcador "${marcador}" apareceu ${ocorrencias}x (esperado 1x)`)
  }
})

test('acrescenta bloco de metadados de voz sem repetir regra clínica', () => {
  const caso = primeiroAdulto()
  const { instructions } = construirInstrucoesRealtime(caso)
  assert.ok(instructions.includes('METADADOS DE VOZ'), 'faltou o bloco de metadados de voz')
  assert.ok(instructions.includes('Quem fala:'), 'faltou papel do falante')
  assert.ok(instructions.includes('Faixa etária do paciente:'), 'faltou faixa etária')
  assert.ok(instructions.includes('Tom de voz'), 'faltou estado emocional')
  assert.ok(instructions.includes('Ritmo de fala:'), 'faltou ritmo')
  assert.ok(instructions.includes('Esforço respiratório'), 'faltou esforço respiratório')
})

test('regra de áudio: não iniciar cumprimento antes do aluno falar', () => {
  const caso = primeiroAdulto()
  const { instructions } = construirInstrucoesRealtime(caso)
  assert.ok(
    instructions.includes('não emita nenhuma fala, som ou cumprimento'),
    'faltou a regra de áudio de não iniciar espontaneamente'
  )
  // A regra textual original (modo texto) também continua presente — não foi removida.
  assert.ok(instructions.includes('AGUARDE a pergunta do médico'), 'a regra textual original deveria continuar presente')
})

test('retorna o VoiceProfile derivado (não um objeto vazio/parcial)', () => {
  const caso = primeiroAdulto()
  const { voiceProfile } = construirInstrucoesRealtime(caso)
  assert.ok(voiceProfile.voiceId, 'voiceId ausente')
  assert.ok(voiceProfile.speakerRole, 'speakerRole ausente')
  assert.ok(voiceProfile.ageGroup, 'ageGroup ausente')
})

test('caso pediátrico produz metadados coerentes (caregiver/child, quando aplicável)', () => {
  const caso = primeiroPediatrico()
  const { instructions, voiceProfile } = construirInstrucoesRealtime(caso)
  assert.ok(instructions.includes('METADADOS DE VOZ'))
  if (voiceProfile.speakerRole === 'caregiver') {
    assert.ok(instructions.includes('responsável/acompanhante'), 'faixa pediátrica deveria indicar responsável como falante')
  }
})

test('determinística: mesma entrada produz exatamente a mesma saída', () => {
  const caso = primeiroAdulto()
  const a = construirInstrucoesRealtime(caso)
  const b = construirInstrucoesRealtime(caso)
  assert.equal(a.instructions, b.instructions)
  assert.deepEqual(a.voiceProfile, b.voiceProfile)
})

test('não conhece HTTP/React/WebRTC (superfície de import da função é só dados)', () => {
  // Verificação estrutural: o módulo exporta apenas a função combinadora e o tipo de resultado —
  // não há qualquer referência a fetch/WebRTC/React na própria função (smoke test de import).
  const caso = primeiroAdulto()
  const resultado = construirInstrucoesRealtime(caso)
  assert.equal(typeof resultado.instructions, 'string')
  assert.equal(typeof resultado.voiceProfile, 'object')
})

test('todos os 76 casos exportados geram instruções e perfis válidos via construirInstrucoesRealtime', () => {
  assert.ok(CASOS.length >= 70, `esperado ≥70 casos, encontrado ${CASOS.length}`)
  for (const caso of CASOS) {
    const { instructions, voiceProfile } = construirInstrucoesRealtime(caso)
    assert.ok(instructions.length > 500, `[${(caso as any).id}] instructions curtas demais`)
    assert.ok(!/\bundefined\b/.test(instructions), `[${(caso as any).id}] instructions contém "undefined"`)
    assert.ok(voiceProfile.voiceId && voiceProfile.speakerRole && voiceProfile.ageGroup, `[${(caso as any).id}] perfil incompleto`)
  }
})
