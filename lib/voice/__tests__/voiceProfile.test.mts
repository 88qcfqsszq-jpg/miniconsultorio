/**
 * Testes da Etapa 2 — perfil lógico de voz (derivação).
 *
 * Cobre a derivação automática de VoiceProfile a partir dos dados do caso, sem
 * depender de OpenAI/Realtime/áudio. Usa casos sintéticos mínimos (cast) e todos
 * os 76 casos reais exportados por casosV2.
 *
 * Runner: npx tsx --test lib/voice/__tests__/voiceProfile.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { derivarVoiceProfile, REGIONAL_ACCENT_DEFAULT } from '@/lib/voice/voiceProfile'
import { isVoiceIdValido } from '@/lib/voice/voiceCatalog'
import { casosV2 } from '@/data/casos-v2'
import type { Caso } from '@/lib/types'

// ── Construtores de casos sintéticos mínimos ─────────────────────────────────
function casoAdulto(sexo: 'M' | 'F', idade: number, sv?: { saturacaoOxigenio?: number; frequenciaRespiratoria?: number }): Caso {
  return {
    tipoPaciente: 'adulto',
    paciente: { nome: 'Fulano', sexo, idade, tipoPaciente: 'adulto' },
    ...(sv ? { sinaisVitais: { entrada: sv } } : {}),
  } as unknown as Caso
}
function casoPediatrico(
  faixaEtaria: string,
  parentesco: string,
  sexo: 'M' | 'F' = 'M',
  sv?: { saturacaoOxigenio?: number; frequenciaRespiratoria?: number }
): Caso {
  return {
    tipoPaciente: 'pediatrico',
    paciente: {
      nome: 'Criança',
      sexo,
      idade: 5,
      tipoPaciente: 'pediatrico',
      dadosPediatricos: { faixaEtaria, responsavel: { nome: 'Resp', parentesco } },
    },
    ...(sv ? { sinaisVitais: { entrada: sv } } : {}),
  } as unknown as Caso
}

// ── 1–3. Adultos e idoso ─────────────────────────────────────────────────────
test('adulto masculino → patient/adult/male/adult-male', () => {
  const p = derivarVoiceProfile(casoAdulto('M', 45))
  assert.equal(p.speakerRole, 'patient')
  assert.equal(p.ageGroup, 'adult')
  assert.equal(p.genderPresentation, 'male')
  assert.equal(p.voiceId, 'adult-male')
})
test('adulto feminino → adult-female', () => {
  const p = derivarVoiceProfile(casoAdulto('F', 38))
  assert.equal(p.genderPresentation, 'female')
  assert.equal(p.voiceId, 'adult-female')
})
test('idoso (idade ≥ 65) → elderly', () => {
  const p = derivarVoiceProfile(casoAdulto('F', 72))
  assert.equal(p.ageGroup, 'elderly')
  assert.equal(p.voiceId, 'elderly-female')
})

// ── 4. Adolescente ───────────────────────────────────────────────────────────
test('adolescente fala por si → patient/adolescent', () => {
  const p = derivarVoiceProfile(casoPediatrico('adolescente', 'mãe', 'M'))
  assert.equal(p.speakerRole, 'patient')
  assert.equal(p.ageGroup, 'adolescent')
  assert.equal(p.genderPresentation, 'male') // paciente adolescente usa o próprio sexo
  assert.equal(p.voiceId, 'adolescent-male')
})

// ── 5–7. Pediátricos com acompanhante ────────────────────────────────────────
test('lactente → caregiver/child/female (responsável mãe)', () => {
  const p = derivarVoiceProfile(casoPediatrico('lactente', 'mãe'))
  assert.equal(p.speakerRole, 'caregiver')
  assert.equal(p.ageGroup, 'child')
  assert.equal(p.genderPresentation, 'female')
  assert.equal(p.voiceId, 'caregiver-female')
})
test('pré-escolar (variante com acento) → caregiver/child', () => {
  const p = derivarVoiceProfile(casoPediatrico('pré-escolar', 'mãe'))
  assert.equal(p.speakerRole, 'caregiver')
  assert.equal(p.ageGroup, 'child')
  assert.equal(p.voiceId, 'caregiver-female')
})
test('escolar → caregiver (responsável pai → male)', () => {
  const p = derivarVoiceProfile(casoPediatrico('escolar', 'pai'))
  assert.equal(p.speakerRole, 'caregiver')
  assert.equal(p.ageGroup, 'child')
  assert.equal(p.genderPresentation, 'male')
  assert.equal(p.voiceId, 'caregiver-male')
})

// ── 8–9. Gênero do responsável ───────────────────────────────────────────────
test('responsável masculino → caregiver-male', () => {
  const p = derivarVoiceProfile(casoPediatrico('lactente', 'pai'))
  assert.equal(p.genderPresentation, 'male')
  assert.equal(p.voiceId, 'caregiver-male')
})
test('responsável feminino → caregiver-female', () => {
  const p = derivarVoiceProfile(casoPediatrico('lactente', 'avó'))
  assert.equal(p.genderPresentation, 'female')
  assert.equal(p.voiceId, 'caregiver-female')
})
test('responsável genérico ("responsável") → neutral', () => {
  const p = derivarVoiceProfile(casoPediatrico('lactente', 'responsável'))
  assert.equal(p.genderPresentation, 'neutral')
  assert.equal(p.voiceId, 'caregiver-neutral')
})

// ── 10. Defaults ─────────────────────────────────────────────────────────────
test('defaults seguros: pace normal, sotaque neutral_br, sem sinais → esforço none', () => {
  const p = derivarVoiceProfile(casoAdulto('M', 30))
  assert.equal(p.speakingPace, 'normal')
  assert.equal(p.regionalAccent, REGIONAL_ACCENT_DEFAULT)
  assert.equal(p.regionalAccent, 'neutral_br')
  assert.equal(p.respiratoryEffort, 'none')
  assert.equal(p.emotionalState, 'calm')
})

// ── 11. emotionalState (só objetivo) ─────────────────────────────────────────
test('emotionalState: SpO2 baixa → dyspneic; normal → calm', () => {
  const dyspneic = derivarVoiceProfile(casoAdulto('M', 50, { saturacaoOxigenio: 85 }))
  assert.equal(dyspneic.emotionalState, 'dyspneic')
  const calmo = derivarVoiceProfile(casoAdulto('M', 50, { saturacaoOxigenio: 98 }))
  assert.equal(calmo.emotionalState, 'calm')
})

// ── 12. respiratoryEffort ────────────────────────────────────────────────────
test('respiratoryEffort: severidade por SpO2/FR e none quando quem fala é o acompanhante', () => {
  assert.equal(derivarVoiceProfile(casoAdulto('M', 50, { saturacaoOxigenio: 85 })).respiratoryEffort, 'severe')
  assert.equal(derivarVoiceProfile(casoAdulto('M', 50, { saturacaoOxigenio: 90 })).respiratoryEffort, 'moderate')
  assert.equal(derivarVoiceProfile(casoAdulto('M', 50, { saturacaoOxigenio: 93 })).respiratoryEffort, 'mild')
  assert.equal(derivarVoiceProfile(casoAdulto('M', 50, { frequenciaRespiratoria: 32 })).respiratoryEffort, 'severe')
  // Acompanhante fala → o esforço respiratório da CRIANÇA não vira voz dispneica do acompanhante.
  const ped = derivarVoiceProfile(casoPediatrico('lactente', 'mãe', 'M', { saturacaoOxigenio: 84 }))
  assert.equal(ped.respiratoryEffort, 'none')
  assert.equal(ped.emotionalState, 'calm')
})

// ── 13. Merge de override ────────────────────────────────────────────────────
test('override (caso.voiceProfile) é aplicado por merge, vencendo o derivado', () => {
  const base = casoAdulto('M', 40) as any
  base.voiceProfile = { emotionalState: 'fearful', speakingPace: 'slow', voiceId: 'adult-neutral' }
  const p = derivarVoiceProfile(base as Caso)
  assert.equal(p.emotionalState, 'fearful') // override venceu
  assert.equal(p.speakingPace, 'slow')
  assert.equal(p.voiceId, 'adult-neutral')
  assert.equal(p.ageGroup, 'adult') // campos não sobrescritos permanecem derivados
  assert.equal(p.genderPresentation, 'male')
})

test('override com voiceId inválido NÃO é aceito: recai no catálogo', () => {
  const base = casoAdulto('F', 40) as any
  base.voiceProfile = { voiceId: 'voz-inexistente' }
  const p = derivarVoiceProfile(base as Caso)
  assert.ok(isVoiceIdValido(p.voiceId), `voiceId final fora do catálogo: ${p.voiceId}`)
  assert.equal(p.voiceId, 'adult-female') // resolvido pelos campos derivados/mesclados
})

test('override não muta o objeto original do caso', () => {
  const base = casoAdulto('M', 40) as any
  base.voiceProfile = { emotionalState: 'fearful', voiceId: 'voz-inexistente' }
  const antes = JSON.parse(JSON.stringify(base.voiceProfile))
  derivarVoiceProfile(base as Caso)
  assert.deepEqual(base.voiceProfile, antes, 'o override do caso foi mutado')
})

// ── 14. Todos os 76 casos reais ──────────────────────────────────────────────
test('todos os casos exportados geram VoiceProfile completo e válido', () => {
  const CASOS = casosV2 as unknown as Caso[]
  assert.ok(CASOS.length >= 70, `esperado ≥70 casos, encontrado ${CASOS.length}`)
  const papeisValidos = new Set(['patient', 'caregiver', 'companion'])
  const generosValidos = new Set(['female', 'male', 'neutral'])
  const gruposValidos = new Set(['child', 'adolescent', 'adult', 'elderly'])
  for (const caso of CASOS) {
    const p = derivarVoiceProfile(caso)
    assert.ok(p, `[${(caso as any).id}] perfil ausente`)
    assert.ok(p.speakerRole && papeisValidos.has(p.speakerRole), `[${(caso as any).id}] speakerRole inválido: ${p.speakerRole}`)
    assert.ok(p.genderPresentation && generosValidos.has(p.genderPresentation), `[${(caso as any).id}] gênero inválido`)
    assert.ok(p.ageGroup && gruposValidos.has(p.ageGroup), `[${(caso as any).id}] ageGroup inválido`)
    assert.ok(typeof p.voiceId === 'string' && p.voiceId.length > 0, `[${(caso as any).id}] voiceId vazio`)
    assert.ok(isVoiceIdValido(p.voiceId), `[${(caso as any).id}] voiceId fora do catálogo: ${p.voiceId}`)
    assert.ok(p.regionalAccent && p.regionalAccent.length > 0, `[${(caso as any).id}] sotaque vazio`)
    assert.ok(p.emotionalState && p.speakingPace && p.respiratoryEffort, `[${(caso as any).id}] campo derivado vazio`)
    // nenhum undefined/null
    for (const [k, v] of Object.entries(p)) {
      assert.ok(v !== undefined && v !== null, `[${(caso as any).id}] campo ${k} nulo/undefined`)
    }
  }
})
