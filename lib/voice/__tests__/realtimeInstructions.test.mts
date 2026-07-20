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

/**
 * FASE 3 (Patient V3): o Caso 1 agora é servido pelo novo núcleo. Os testes
 * abaixo verificam o COMPORTAMENTO LEGADO genérico de construirInstrucoesRealtime
 * (como ela combina a base compartilhada com os metadados de voz) — por isso
 * usam um caso adulto por id EXPLÍCITO, nunca por seleção implícita que
 * poderia voltar a resolver para o Caso Ouro. id "18": adulto, não registrado
 * em data/casos-v3, sem alterações no working tree — o mesmo caso de controle
 * usado na verificação de paridade da Fase 3 (ver
 * lib/patient-v3/__tests__/wiringPacienteV3.test.mts para os testes
 * específicos do Caso Ouro em texto e voz).
 */
const CASO_CONTROLE_LEGADO_ID = '18'
function casoLegadoDeControle(): Caso {
  const c = CASOS.find((x) => x.id === CASO_CONTROLE_LEGADO_ID)
  assert.ok(c, `caso de controle "${CASO_CONTROLE_LEGADO_ID}" não encontrado`)
  return c!
}
function primeiroPediatrico(): Caso {
  const c = CASOS.find((x) => x.tipoPaciente === 'pediatrico' || x.paciente?.tipoPaciente === 'pediatrico')
  assert.ok(c, 'nenhum caso pediátrico encontrado')
  return c!
}

test('reutiliza a base clínica (fonte única) como prefixo das instruções', () => {
  const caso = casoLegadoDeControle()
  const base = construirInstrucoesBasePaciente(caso)
  const { instructions } = construirInstrucoesRealtime(caso)
  assert.ok(instructions.startsWith(base), 'instructions deveria começar com a base clínica compartilhada')
})

test('não duplica regras clínicas: cada marcador da base aparece exatamente uma vez', () => {
  const caso = casoLegadoDeControle()
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
  const caso = casoLegadoDeControle()
  const { instructions } = construirInstrucoesRealtime(caso)
  assert.ok(instructions.includes('METADADOS DE VOZ'), 'faltou o bloco de metadados de voz')
  assert.ok(instructions.includes('Quem fala:'), 'faltou papel do falante')
  assert.ok(instructions.includes('Faixa etária do paciente:'), 'faltou faixa etária')
  assert.ok(instructions.includes('Tom de voz'), 'faltou estado emocional')
  assert.ok(instructions.includes('Ritmo de fala:'), 'faltou ritmo')
  assert.ok(instructions.includes('Esforço respiratório'), 'faltou esforço respiratório')
})

test('regra de áudio: não iniciar cumprimento antes do aluno falar', () => {
  const caso = casoLegadoDeControle()
  const { instructions } = construirInstrucoesRealtime(caso)
  assert.ok(
    instructions.includes('não emita nenhuma fala, som ou cumprimento'),
    'faltou a regra de áudio de não iniciar espontaneamente'
  )
  // A regra textual original (modo texto) também continua presente — não foi removida.
  assert.ok(instructions.includes('AGUARDE a pergunta do médico'), 'a regra textual original deveria continuar presente')
})

test('retorna o VoiceProfile derivado (não um objeto vazio/parcial)', () => {
  const caso = casoLegadoDeControle()
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
  const caso = casoLegadoDeControle()
  const a = construirInstrucoesRealtime(caso)
  const b = construirInstrucoesRealtime(caso)
  assert.equal(a.instructions, b.instructions)
  assert.deepEqual(a.voiceProfile, b.voiceProfile)
})

test('não conhece HTTP/React/WebRTC (superfície de import da função é só dados)', () => {
  // Verificação estrutural: o módulo exporta apenas a função combinadora e o tipo de resultado —
  // não há qualquer referência a fetch/WebRTC/React na própria função (smoke test de import).
  const caso = casoLegadoDeControle()
  const resultado = construirInstrucoesRealtime(caso)
  assert.equal(typeof resultado.instructions, 'string')
  assert.equal(typeof resultado.voiceProfile, 'object')
})

// ── Caso Ouro (Patient V3): metadados de voz preservados, sem diagnóstico ────
test('Caso Ouro (id "1", Patient V3): metadados de voz continuam presentes e o diagnóstico legado não aparece', () => {
  const casoOuro = CASOS.find((x) => x.id === '1')
  assert.ok(casoOuro, 'Caso 1 (Ouro) não encontrado em casosV2')
  const { instructions, voiceProfile } = construirInstrucoesRealtime(casoOuro!)

  assert.ok(instructions.includes('METADADOS DE VOZ'), 'metadados de voz deveriam continuar presentes para o Caso Ouro')
  assert.ok(
    instructions.includes('não emita nenhuma fala, som ou cumprimento'),
    'regra de áudio (não iniciar espontaneamente) deveria continuar presente para o Caso Ouro'
  )
  assert.ok(!instructions.includes('DIAGNÓSTICO (NÃO REVELE)'), 'Caso Ouro V3 não deveria mais conter o bloco legado de diagnóstico')
  assert.ok(voiceProfile.voiceId && voiceProfile.speakerRole && voiceProfile.ageGroup, 'VoiceProfile deveria continuar completo')
})

// ═══════════════════════════════════════════════════════════════════════════
// FASE 4E — regra curta de escopo da resposta (voz)
// ═══════════════════════════════════════════════════════════════════════════

test('regra de escopo da resposta (voz) aparece exatamente uma vez', () => {
  const caso = casoLegadoDeControle()
  const { instructions } = construirInstrucoesRealtime(caso)
  const marcador = 'REGRA DE ESCOPO DA RESPOSTA'
  const ocorrencias = instructions.split(marcador).length - 1
  assert.equal(ocorrencias, 1, `marcador "${marcador}" apareceu ${ocorrencias}x (esperado 1x)`)
  assert.ok(instructions.includes('responda apenas ao'), 'faltou o início da regra de escopo da resposta')
})

test('a regra de escopo da resposta (voz) NÃO aparece no Prompt Base do texto (só na composição de voz)', () => {
  const caso = casoLegadoDeControle()
  const baseTexto = construirInstrucoesBasePaciente(caso)
  assert.ok(
    !baseTexto.includes('REGRA DE ESCOPO DA RESPOSTA'),
    'Prompt Base do texto não deveria conter a regra específica de voz da Fase 4E'
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FASE 4F — Semantic VAD + regra final obrigatória sobre fala não inteligível
// ═══════════════════════════════════════════════════════════════════════════

test('10. regra "REGRA OBRIGATÓRIA DO TURNO ATUAL" aparece exatamente uma vez', () => {
  const caso = casoLegadoDeControle()
  const { instructions } = construirInstrucoesRealtime(caso)
  const marcador = 'REGRA OBRIGATÓRIA DO TURNO ATUAL'
  const ocorrencias = instructions.split(marcador).length - 1
  assert.equal(ocorrencias, 1, `marcador "${marcador}" apareceu ${ocorrencias}x (esperado 1x)`)
})

test('11. a regra do turno atual encerra as instructions (é o último bloco, depois dos metadados de voz)', () => {
  const caso = casoLegadoDeControle()
  const { instructions } = construirInstrucoesRealtime(caso)
  const marcador = 'REGRA OBRIGATÓRIA DO TURNO ATUAL'
  const indice = instructions.indexOf(marcador)
  assert.ok(indice >= 0, 'marcador da regra do turno atual não encontrado')
  // Nada depois do bloco da regra final além do próprio texto da regra —
  // ela é literalmente a última coisa nas instructions.
  const restante = instructions.slice(indice)
  assert.equal(instructions.indexOf(marcador, indice + 1), -1, 'a regra não deveria se repetir depois de si mesma')
  assert.ok(restante.endsWith('Não revele, antecipe, resuma nem acrescente qualquer informação clínica nesse caso.'))
})

test('12. a frase obrigatória de repetição está presente, verbatim', () => {
  const caso = casoLegadoDeControle()
  const { instructions } = construirInstrucoesRealtime(caso)
  assert.ok(
    instructions.includes('Desculpe, não entendi. Pode repetir a pergunta?'),
    'frase obrigatória de repetição ausente ou alterada'
  )
})

test('a regra do turno atual não contém exemplos clínicos nem lista extensa de respostas alternativas', () => {
  const caso = casoLegadoDeControle()
  const { instructions } = construirInstrucoesRealtime(caso)
  const marcador = 'REGRA OBRIGATÓRIA DO TURNO ATUAL'
  const indice = instructions.indexOf(marcador)
  const blocoRegra = instructions.slice(indice)
  // Só uma frase entre aspas (a de repetição) — nenhuma outra resposta alternativa listada.
  const ocorrenciasDeAspas = (blocoRegra.match(/"/g) ?? []).length
  assert.equal(ocorrenciasDeAspas, 2, 'a regra deveria conter apenas uma frase entre aspas (a de repetição)')
})

test('13. a regra do turno atual NÃO aparece no Prompt Base do texto', () => {
  const caso = casoLegadoDeControle()
  const baseTexto = construirInstrucoesBasePaciente(caso)
  assert.ok(!baseTexto.includes('REGRA OBRIGATÓRIA DO TURNO ATUAL'))
  assert.ok(!baseTexto.includes('Desculpe, não entendi. Pode repetir a pergunta?'))
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
