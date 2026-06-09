import { ECGLeadPosition, ECGPlacementResult, ECGZone } from './types'

// Zonas corretas para cada eletrodo (em porcentagem)
// Baseado no posicionamento clássico do ECG com boneco real frontal
// Eixo visual: RA fica à esquerda (x~28), LA fica à direita (x~72) porque vemos o paciente de frente
const ECG_ZONES: ECGZone[] = [
  {
    lead: 'V1',
    x: { min: 46, max: 50 },
    y: { min: 31, max: 35 },
    descricao: '4º espaço intercostal, borda esternal direita',
    tolerancia: 5,
  },
  {
    lead: 'V2',
    x: { min: 50, max: 54 },
    y: { min: 31, max: 35 },
    descricao: '4º espaço intercostal, borda esternal esquerda',
    tolerancia: 5,
  },
  {
    lead: 'V3',
    x: { min: 53, max: 57 },
    y: { min: 34, max: 38 },
    descricao: 'Entre V2 e V4',
    tolerancia: 5,
  },
  {
    lead: 'V4',
    x: { min: 56, max: 60 },
    y: { min: 37, max: 41 },
    descricao: '5º espaço intercostal, linha hemiclavicular esquerda',
    tolerancia: 5,
  },
  {
    lead: 'V5',
    x: { min: 61, max: 65 },
    y: { min: 37, max: 41 },
    descricao: 'Linha axilar anterior esquerda, mesmo nível de V4',
    tolerancia: 5,
  },
  {
    lead: 'V6',
    x: { min: 66, max: 70 },
    y: { min: 37, max: 41 },
    descricao: 'Linha axilar média esquerda, mesmo nível de V4',
    tolerancia: 5,
  },
  {
    lead: 'RA',
    x: { min: 26, max: 30 },
    y: { min: 46, max: 50 },
    descricao: 'Membro superior direito visual (braço D do paciente)',
    tolerancia: 6,
  },
  {
    lead: 'LA',
    x: { min: 70, max: 74 },
    y: { min: 46, max: 50 },
    descricao: 'Membro superior esquerdo visual (braço E do paciente)',
    tolerancia: 6,
  },
  {
    lead: 'RL',
    x: { min: 41, max: 45 },
    y: { min: 80, max: 84 },
    descricao: 'Membro inferior direito (tornozelo D do paciente)',
    tolerancia: 6,
  },
  {
    lead: 'LL',
    x: { min: 55, max: 59 },
    y: { min: 80, max: 84 },
    descricao: 'Membro inferior esquerdo (tornozelo E do paciente)',
    tolerancia: 6,
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

  // Verificar problemas específicos

  // 1. Possível inversão de membros (RA e LA trocados)
  const RA = eletrodos.find((e) => e.lead === 'RA')
  const LA = eletrodos.find((e) => e.lead === 'LA')
  if (RA && LA && RA.isPlaced && LA.isPlaced) {
    // Se RA está muito à esquerda (x < 50) e LA está muito à direita (x > 50)
    if (RA.x < 50 && LA.x > 50) {
      temInversaoMembros = true
      mensagensTecnicas.push('⚠️ Possível inversão de eletrodos RA/LA detectada')
    }
  }

  // 2. Possível posicionamento alto de V1/V2 (y < 32)
  const V1 = eletrodos.find((e) => e.lead === 'V1')
  const V2 = eletrodos.find((e) => e.lead === 'V2')
  if ((V1 && V1.isPlaced && V1.y < 32) || (V2 && V2.isPlaced && V2.y < 32)) {
    temPosicionamentoAltoV1V2 = true
    mensagensTecnicas.push(
      '⚠️ V1/V2 podem estar posicionados muito alto (verificar 4º espaço)'
    )
  }

  // 3. Possível troca ou desordem de V3-V6
  const precordialOrdem = ['V3', 'V4', 'V5', 'V6']
  const precordiaisColocadas = eletrodos
    .filter((e) => precordialOrdem.includes(e.lead) && e.isPlaced)
    .map((e) => e.lead)

  if (precordiaisColocadas.length >= 3) {
    // Verificar se y está consistente (mesmo nível)
    const ysV3V6 = precordiaisColocadas.map(
      (lead) => eletrodos.find((e) => e.lead === lead)?.y
    )
    const ysDiferenca = Math.max(...(ysV3V6 as number[])) - Math.min(...(ysV3V6 as number[]))

    if (ysDiferenca > 15) {
      temTrocaOuDesordemPrecordiais = true
      mensagensTecnicas.push(
        '⚠️ V3-V6 podem estar em ordem incorreta (devem estar no mesmo nível)'
      )
    }

    // Verificar ordem X (V3 > V4 > V5 > V6)
    const posicoes: { [key: string]: number } = {}
    precordiaisColocadas.forEach((lead) => {
      posicoes[lead] = eletrodos.find((e) => e.lead === lead)?.x || 0
    })

    const V3pos = posicoes['V3'] ?? 0
    const V4pos = posicoes['V4'] ?? 0
    const V5pos = posicoes['V5'] ?? 0
    const V6pos = posicoes['V6'] ?? 0

    if (V3pos < V4pos && V4pos < V5pos && V5pos < V6pos) {
      // Ordem esperada (aumenta para esquerda, então x diminui)
      // Na verdade, é o oposto: V3 > V4 > V5 > V6 em x
      // Vou verificar apenas se não estão completamente fora de ordem
    } else if (precordiaisColocadas.length === 4) {
      // Se temos todos, verificar
      if (!(V3pos > V4pos && V4pos > V5pos && V5pos > V6pos)) {
        temTrocaOuDesordemPrecordiais = true
        mensagensTecnicas.push(
          '⚠️ V3-V6 podem estar fora de ordem (esquerda para direita)'
        )
      }
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
