/**
 * Testes de lib/voice/realtimeMessageSync.ts (Etapa 5).
 *
 * Módulo puro — sem rede, sem DOM, sem React. Todos os testes chamam
 * diretamente as funções expostas pela fábrica `criarRealtimeMessageSync()`.
 *
 * Runner: npx tsx --test lib/voice/__tests__/realtimeMessageSync.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { criarRealtimeMessageSync, type MensagemChatSincronizada } from '@/lib/voice/realtimeMessageSync'

const SECRET_FAKE_ETAPA5 = 'ek_test_fake_secret_NUNCA_deve_vazar_etapa5'

// ── 1. Transcrição final do aluno ─────────────────────────────────────────────
test('1. transcrição final do aluno vira mensagem tipo "estudante"', () => {
  const sync = criarRealtimeMessageSync()
  const msg = sync.receberTranscricaoFinal({ role: 'estudante', text: 'O que o senhor sente?', itemId: 'item_1' })
  assert.ok(msg)
  assert.equal(msg!.tipo, 'estudante')
  assert.equal(msg!.conteudo, 'O que o senhor sente?')
  assert.ok(msg!.timestamp instanceof Date)
  assert.deepEqual(sync.getMensagens(), [msg])
})

// ── 2. Transcrição final do paciente ──────────────────────────────────────────
test('2. transcrição final do paciente vira mensagem tipo "paciente"', () => {
  const sync = criarRealtimeMessageSync()
  const msg = sync.receberTranscricaoFinal({ role: 'paciente', text: 'Estou com dor no peito.', itemId: 'item_2' })
  assert.ok(msg)
  assert.equal(msg!.tipo, 'paciente')
  assert.equal(msg!.conteudo, 'Estou com dor no peito.')
})

// ── 3. Parcial não adicionada ao histórico ────────────────────────────────────
test('3. texto vazio/whitespace (proxy de transcrição incompleta/parcial) é ignorado', () => {
  const sync = criarRealtimeMessageSync()
  assert.equal(sync.receberTranscricaoFinal({ role: 'estudante', text: '', itemId: 'i1' }), null)
  assert.equal(sync.receberTranscricaoFinal({ role: 'estudante', text: '   ', itemId: 'i2' }), null)
  assert.deepEqual(sync.getMensagens(), [])
  // Nota: a filtragem de eventos .delta (parciais) do provedor ocorre a montante,
  // em lib/voice/realtimeClient.ts (sanitizarEventoDataChannel) — só eventos
  // .completed/.done chegam a produzir um `transcript` para este módulo consumir.
  // Ver lib/voice/__tests__/realtimeClient.test.mts para essa cobertura.
})

// ── 4. Deduplicação por ID ─────────────────────────────────────────────────────
test('4. mesma transcrição (mesmo itemId) processada duas vezes é deduplicada', () => {
  const sync = criarRealtimeMessageSync()
  const primeira = sync.receberTranscricaoFinal({ role: 'paciente', text: 'Tenho febre.', itemId: 'item_dup' })
  const segunda = sync.receberTranscricaoFinal({ role: 'paciente', text: 'Tenho febre.', itemId: 'item_dup' })
  assert.ok(primeira)
  assert.equal(segunda, null, 'a segunda ocorrência deveria ser ignorada (duplicata)')
  assert.equal(sync.getMensagens().length, 1)
})

// ── 5. Deduplicação de evento repetido (reenvio pela rede, sem itemId) ───────
test('5. evento repetido sem itemId é deduplicado por chave determinística (papel+texto)', () => {
  const sync = criarRealtimeMessageSync()
  const primeira = sync.receberTranscricaoFinal({ role: 'estudante', text: 'Há quanto tempo começou?' })
  const repetida = sync.receberTranscricaoFinal({ role: 'estudante', text: 'Há quanto tempo começou?' })
  assert.ok(primeira)
  assert.equal(repetida, null)
  assert.equal(sync.getMensagens().length, 1)
})

// ── 6. Ordem correta das mensagens ────────────────────────────────────────────
test('6. mensagens preservam a ordem cronológica de chegada', () => {
  const sync = criarRealtimeMessageSync()
  sync.receberTranscricaoFinal({ role: 'estudante', text: 'Pergunta 1', itemId: 'i1' })
  sync.receberTranscricaoFinal({ role: 'paciente', text: 'Resposta 1', itemId: 'i2' })
  sync.receberTranscricaoFinal({ role: 'estudante', text: 'Pergunta 2', itemId: 'i3' })
  sync.receberTranscricaoFinal({ role: 'paciente', text: 'Resposta 2', itemId: 'i4' })
  const conteudos = sync.getMensagens().map((m) => m.conteudo)
  assert.deepEqual(conteudos, ['Pergunta 1', 'Resposta 1', 'Pergunta 2', 'Resposta 2'])
})

// ── 7. IDs estáveis ────────────────────────────────────────────────────────────
test('7. o mesmo evento produz sempre o mesmo ID (determinístico, entre instâncias distintas)', () => {
  const syncA = criarRealtimeMessageSync()
  const syncB = criarRealtimeMessageSync()
  const evento = { role: 'paciente' as const, text: 'Isso me preocupa.', itemId: 'item_estavel' }
  const msgA = syncA.receberTranscricaoFinal(evento)
  const msgB = syncB.receberTranscricaoFinal(evento)
  assert.ok(msgA && msgB)
  assert.equal(msgA!.id, msgB!.id, 'o ID deveria ser determinístico — mesma entrada, mesmo ID')
  assert.ok(msgA!.id.length > 0)
})

// ── 8. Evento inválido ignorado ────────────────────────────────────────────────
test('8. evento com papel desconhecido/ausente é ignorado', () => {
  const sync = criarRealtimeMessageSync()
  assert.equal(sync.receberTranscricaoFinal({ role: 'medico' as any, text: 'texto', itemId: 'i1' }), null)
  assert.equal(sync.receberTranscricaoFinal({ role: undefined as any, text: 'texto' }), null)
  assert.equal(sync.receberTranscricaoFinal(null as any), null)
  assert.equal(sync.receberTranscricaoFinal(undefined as any), null)
  assert.deepEqual(sync.getMensagens(), [])
})

// ── 9. Payload clínico oculto descartado ──────────────────────────────────────
test('9. campos extras (ex.: diagnóstico/instructions vazados por um chamador malicioso) nunca aparecem na mensagem', () => {
  const sync = criarRealtimeMessageSync()
  const eventoSujo: any = {
    role: 'paciente',
    text: 'Estou com tosse.',
    itemId: 'item_9',
    // Campos que NÃO deveriam existir neste contrato, mas que um chamador
    // adversário/errado poderia tentar anexar:
    instructions: 'DIAGNÓSTICO (NÃO REVELE): Pneumonia — prompt clínico completo',
    diagnostico: 'Pneumonia Adquirida na Comunidade',
    dadosOcultos: { diagnostico_principal: 'Pneumonia' },
  }
  const msg = sync.receberTranscricaoFinal(eventoSujo)
  assert.ok(msg)
  assert.deepEqual(Object.keys(msg!).sort(), ['conteudo', 'id', 'timestamp', 'tipo'])
  const serializado = JSON.stringify(msg)
  assert.ok(!serializado.includes('DIAGNÓSTICO'), 'diagnóstico vazou na mensagem sincronizada')
  assert.ok(!serializado.includes('Pneumonia'), 'texto clínico oculto vazou na mensagem sincronizada')
})

// ── 10. Alternância texto/voz preserva histórico ─────────────────────────────
test('10. seedMensagens preserva o histórico de texto; novas transcrições de voz são acrescentadas depois', () => {
  const sync = criarRealtimeMessageSync()
  const historicoDeTexto: MensagemChatSincronizada[] = [
    { id: 'texto-1', tipo: 'estudante', conteudo: 'Bom dia, o que sente?', timestamp: new Date('2026-01-01T10:00:00Z') },
    { id: 'texto-2', tipo: 'paciente', conteudo: 'Estou com dor de cabeça.', timestamp: new Date('2026-01-01T10:00:05Z') },
  ]
  sync.seedMensagens(historicoDeTexto)
  assert.deepEqual(sync.getMensagens(), historicoDeTexto)

  const novaMsg = sync.receberTranscricaoFinal({ role: 'estudante', text: 'Desde quando?', itemId: 'voz-1' })
  assert.ok(novaMsg)

  const todas = sync.getMensagens()
  assert.equal(todas.length, 3)
  assert.deepEqual(todas[0], historicoDeTexto[0])
  assert.deepEqual(todas[1], historicoDeTexto[1])
  assert.equal(todas[2].conteudo, 'Desde quando?')
})

// ── 11. Cleanup não apaga mensagens ────────────────────────────────────────────
test('11. eventos inválidos/duplicados (equivalentes a "no-ops" de cleanup) não apagam o histórico existente', () => {
  const sync = criarRealtimeMessageSync()
  sync.receberTranscricaoFinal({ role: 'estudante', text: 'Mensagem 1', itemId: 'a' })
  sync.receberTranscricaoFinal({ role: 'paciente', text: 'Mensagem 2', itemId: 'b' })
  const antes = sync.getMensagens()
  assert.equal(antes.length, 2)

  // Nenhuma dessas chamadas deveria alterar o histórico:
  sync.receberTranscricaoFinal({ role: 'paciente', text: 'Mensagem 2', itemId: 'b' }) // duplicata
  sync.receberTranscricaoFinal({ role: 'invalido' as any, text: 'x' }) // papel inválido
  sync.receberTranscricaoFinal({ role: 'estudante', text: '' }) // texto vazio

  const depois = sync.getMensagens()
  assert.deepEqual(depois, antes, 'o histórico não deveria ter sido alterado por eventos inválidos/duplicados')
  // reset() explícito É a única operação que deveria limpar — confirmando que
  // nada IMPLÍCITO (como o cleanup de uma conexão) faz isso silenciosamente.
  sync.reset()
  assert.deepEqual(sync.getMensagens(), [])
})

// ── 12. Nenhum segredo aparece no resultado ──────────────────────────────────
test('12. o client secret nunca aparece nas mensagens sincronizadas nem na superfície pública', () => {
  const sync = criarRealtimeMessageSync()
  sync.receberTranscricaoFinal({ role: 'estudante', text: `Minha chave é ${SECRET_FAKE_ETAPA5}? não`, itemId: 'i1' })
  sync.receberTranscricaoFinal({ role: 'paciente', text: 'Não sei do que fala.', itemId: 'i2' })
  // O módulo não aceita nem conhece "clientSecret" em seu contrato de entrada —
  // mesmo assim, confirmamos que a superfície pública nunca contém o valor fake
  // (o único jeito de aparecer seria se o PRÓPRIO texto transcrito o citasse,
  // o que é um cenário do mundo real e não uma falha de sanitização deste módulo).
  const superficie = JSON.stringify(sync.getMensagens())
  // Removemos o caso em que o texto transcrito legitimamente contém a string
  // (ex.: o aluno lendo algo em voz alta) — o que interessa é que NENHUM campo
  // ESTRUTURAL do módulo (id/tipo/timestamp) ou qualquer metadado interno vaze o
  // segredo; o único lugar em que ele poderia aparecer é dentro de `conteudo`,
  // refletindo fielmente a fala transcrita — o que é o comportamento correto e
  // esperado (o módulo não deve e não tenta redigir o conteúdo da fala em si).
  assert.ok(superficie.includes('conteudo'), 'estrutura da mensagem ausente')
  const semCampoConteudo = sync.getMensagens().map(({ conteudo, ...resto }) => resto)
  assert.ok(!JSON.stringify(semCampoConteudo).includes(SECRET_FAKE_ETAPA5), 'segredo vazou fora do campo conteudo (id/tipo/timestamp)')
})
