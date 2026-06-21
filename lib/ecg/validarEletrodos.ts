import { ECGLeadPosition, ECGPlacementResult, ECGZone } from './types'

// Gabarito definitivo de posicionamento dos eletrodos do ECG
// Baseado no boneco anatômico real do Mini Consultório
// Coordenadas em porcentagem da imagem
// Observação: O paciente está de frente. A direita anatômica (RA, RL, V1) aparece à esquerda visual.
const ECG_ZONES: ECGZone[] = [
  {
    lead: 'V1',
    x: { min: 42, max: 52 },
    y: { min: 25, max: 35 },
    descricao: '4º espaço intercostal direito, junto à borda esternal direita do paciente',
    tolerancia: 5,
  },
  {
    lead: 'V2',
    x: { min: 47, max: 57 },
    y: { min: 25, max: 35 },
    descricao: '4º espaço intercostal esquerdo, junto à borda esternal esquerda do paciente',
    tolerancia: 5,
  },
  {
    lead: 'V3',
    x: { min: 50, max: 60 },
    y: { min: 28, max: 38 },
    descricao: 'Entre V2 e V4',
    tolerancia: 5,
  },
  {
    lead: 'V4',
    x: { min: 53, max: 63 },
    y: { min: 31, max: 41 },
    descricao: '5º espaço intercostal esquerdo, linha hemiclavicular esquerda',
    tolerancia: 5,
  },
  {
    lead: 'V5',
    x: { min: 58, max: 68 },
    y: { min: 31, max: 41 },
    descricao: 'Linha axilar anterior esquerda, no mesmo nível horizontal de V4',
    tolerancia: 5,
  },
  {
    lead: 'V6',
    x: { min: 63, max: 73 },
    y: { min: 31, max: 41 },
    descricao: 'Linha axilar média esquerda, no mesmo nível horizontal de V4 e V5',
    tolerancia: 5,
  },
  {
    lead: 'RA',
    x: { min: 10, max: 40 },
    y: { min: 40, max: 70 },
    descricao: 'Membro superior direito do paciente (lado esquerdo visual)',
    tolerancia: 8,
  },
  {
    lead: 'LA',
    x: { min: 60, max: 90 },
    y: { min: 40, max: 70 },
    descricao: 'Membro superior esquerdo do paciente (lado direito visual)',
    tolerancia: 8,
  },
  {
    lead: 'RL',
    x: { min: 20, max: 45 },
    y: { min: 70, max: 95 },
    descricao: 'Membro inferior direito do paciente (lado esquerdo visual)',
    tolerancia: 8,
  },
  {
    lead: 'LL',
    x: { min: 55, max: 80 },
    y: { min: 70, max: 95 },
    descricao: 'Membro inferior esquerdo do paciente (lado direito visual)',
    tolerancia: 8,
  },
]

function obterZona(lead: string): ECGZone | undefined {
  return ECG_ZONES.find((z) => z.lead === lead)
}

function dentroZona(valor: number, min: number, max: number): boolean {
  return valor >= min && valor <= max
}

function proximoZona(
  valor: number,
  min: number,
  max: number,
  tolerancia: number
): boolean {
  return valor >= min - tolerancia && valor <= max + tolerancia
}

export function validarPosicionamentoECG(
  eletrodos: ECGLeadPosition[]
): ECGPlacementResult {
  const eletrodosCorretos: string[] = []
  const eletrodosAusentes: string[] = []
  const eletrodosProximos: string[] = []
  const eletrodosMalPosicionados: string[] = []
  const mensagensTecnicas: string[] = []

  let temInversaoMembros = false
  let temPosicionamentoAltoV1V2 = false
  let temTrocaOuDesordemPrecordiais = false

  // Verificar cada eletrodo esperado
  for (const zona of ECG_ZONES) {
    const eletrodo = eletrodos.find((e) => e.lead === zona.lead)

    if (!eletrodo || !eletrodo.isPlaced) {
      eletrodosAusentes.push(zona.lead)
      continue
    }

    // Verificar se está na zona correta
    const dentroX = dentroZona(eletrodo.x, zona.x.min, zona.x.max)
    const dentroY = dentroZona(eletrodo.y, zona.y.min, zona.y.max)
    const dentroZonaCorreta = dentroX && dentroY

    if (dentroZonaCorreta) {
      eletrodosCorretos.push(zona.lead)
    } else {
      // Verificar se está próximo (com tolerância)
      const proximoX = proximoZona(
        eletrodo.x,
        zona.x.min,
        zona.x.max,
        zona.tolerancia
      )
      const proximoY = proximoZona(
        eletrodo.y,
        zona.y.min,
        zona.y.max,
        zona.tolerancia
      )

      if (proximoX && proximoY) {
        eletrodosProximos.push(zona.lead)
        eletrodosCorretos.push(zona.lead) // Conta como correto para critério de adequação
        mensagensTecnicas.push(
          `⚠️ ${zona.lead} está próximo. ${zona.descricao}`
        )
      } else {
        eletrodosMalPosicionados.push(zona.lead)
        mensagensTecnicas.push(`❌ ${zona.lead} mal posicionado. ${zona.descricao}`)
      }
    }
  }

  // Verificar problemas específicos e validações anatômicas

  const V1 = eletrodos.find((e) => e.lead === 'V1')
  const V2 = eletrodos.find((e) => e.lead === 'V2')
  const V3 = eletrodos.find((e) => e.lead === 'V3')
  const V4 = eletrodos.find((e) => e.lead === 'V4')
  const V5 = eletrodos.find((e) => e.lead === 'V5')
  const V6 = eletrodos.find((e) => e.lead === 'V6')
  const RA = eletrodos.find((e) => e.lead === 'RA')
  const LA = eletrodos.find((e) => e.lead === 'LA')
  const RL = eletrodos.find((e) => e.lead === 'RL')
  const LL = eletrodos.find((e) => e.lead === 'LL')

  // 1. Validação: Inversão de V1 e V2
  if (V1 && V2 && V1.isPlaced && V2.isPlaced) {
    if (V1.x > V2.x) {
      // V1 deveria estar mais à esquerda (menor x) que V2
      mensagensTecnicas.push(
        '⚠️ Possível inversão de V1 e V2. V1 deve ficar à direita do esterno do paciente (mais à esquerda) e V2 à esquerda do esterno (mais à direita).'
      )
    }
  }

  // 2. Validação: V4, V5, V6 muito agrupados (falta progressão lateral)
  if (V4 && V5 && V6 && V4.isPlaced && V5.isPlaced && V6.isPlaced) {
    const V4V5dist = Math.abs(V5.x - V4.x)
    const V5V6dist = Math.abs(V6.x - V5.x)

    // Devem avançar progressivamente para a esquerda (~5% cada)
    if (V4V5dist < 2 || V5V6dist < 2) {
      mensagensTecnicas.push(
        '⚠️ V4, V5 e V6 devem seguir lateralmente no mesmo nível horizontal, da linha hemiclavicular para as linhas axilares.'
      )
    }
  }

  // 3. Validação: V5 ou V6 muito mediais (não avançaram para a esquerda o suficiente)
  if (V5 && V5.isPlaced && V5.x < 56) {
    mensagensTecnicas.push(
      '⚠️ V5 está posicionado muito medialmente. Deve ser posicionado mais lateralmente no hemitórax esquerdo do paciente.'
    )
  }
  if (V6 && V6.isPlaced && V6.x < 61) {
    mensagensTecnicas.push(
      '⚠️ V6 está posicionado muito medialmente. Deve ser posicionado mais lateralmente no hemitórax esquerdo do paciente (linha axilar média).'
    )
  }

  // 4. Validação: Inversão de RA e LA (membros superiores)
  if (RA && LA && RA.isPlaced && LA.isPlaced) {
    if (RA.x > LA.x) {
      // RA deveria estar à esquerda (menor x) e LA à direita (maior x)
      temInversaoMembros = true
      mensagensTecnicas.push(
        '⚠️ Possível inversão dos eletrodos dos membros superiores. RA deve ficar no membro direito (lado esquerdo visual) e LA no membro esquerdo (lado direito visual).'
      )
    }
  }

  // 5. Validação: Inversão de RL e LL (membros inferiores)
  if (RL && LL && RL.isPlaced && LL.isPlaced) {
    if (RL.x > LL.x) {
      // RL deveria estar à esquerda (menor x) e LL à direita (maior x)
      mensagensTecnicas.push(
        '⚠️ Possível inversão dos eletrodos dos membros inferiores. RL deve ficar no membro inferior direito (lado esquerdo visual) e LL no membro inferior esquerdo (lado direito visual).'
      )
    }
  }

  // 6. Validação: V4, V5 e V6 no mesmo nível horizontal
  const precordialOrdem = ['V3', 'V4', 'V5', 'V6']
  const precordiaisColocadas = eletrodos
    .filter((e) => precordialOrdem.includes(e.lead) && e.isPlaced)
    .map((e) => e.lead)

  if (precordiaisColocadas.includes('V4') && precordiaisColocadas.includes('V5') && precordiaisColocadas.includes('V6')) {
    const ysV4V5V6 = [V4!.y, V5!.y, V6!.y]
    const ysDiferenca = Math.max(...ysV4V5V6) - Math.min(...ysV4V5V6)

    if (ysDiferenca > 8) {
      temTrocaOuDesordemPrecordiais = true
      mensagensTecnicas.push(
        '⚠️ A linha precordial lateral deve manter V4, V5 e V6 no mesmo nível horizontal (diferença máxima de 8%).'
      )
    }
  }

  // 7. Verificação clássica: desordem geral
  if (precordiaisColocadas.length >= 3) {
    const ysV3V6 = precordiaisColocadas.map(
      (lead) => eletrodos.find((e) => e.lead === lead)?.y
    )
    const ysDiferenca = Math.max(...(ysV3V6 as number[])) - Math.min(...(ysV3V6 as number[]))

    if (ysDiferenca > 12) {
      temTrocaOuDesordemPrecordiais = true
    }
  }

  const percentualAcerto = (eletrodosCorretos.length / 10) * 100

  // Critério de adequação: mínimo 8/10
  const exameTecnicamenteAdequado = eletrodosCorretos.length >= 8

  if (!exameTecnicamenteAdequado) {
    mensagensTecnicas.push(
      `❌ Exame tecnicamente inadequado (${eletrodosCorretos.length}/10). Mínimo 8 eletrodos necessários.`
    )
  } else if (percentualAcerto === 100 && eletrodosProximos.length === 0) {
    mensagensTecnicas.push('✅ Exame tecnicamente excelente (10/10)')
  } else if (percentualAcerto >= 80) {
    mensagensTecnicas.push(`✅ Exame aceitável (${eletrodosCorretos.length}/10)`)
  }

  return {
    eletrodosCorretos: eletrodosCorretos as any[],
    eletrodosAusentes: eletrodosAusentes as any[],
    eletrodosProximos: eletrodosProximos as any[],
    eletrodosMalPosicionados: eletrodosMalPosicionados as any[],
    percentualAcerto,
    exameTecnicamenteAdequado,
    mensagensTecnicas,
    temInversaoMembros,
    temPosicionamentoAltoV1V2,
    temTrocaOuDesordemPrecordiais,
  }
}
