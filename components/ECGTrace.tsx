'use client'

import { useState } from 'react'
import { ECGPattern } from '@/lib/ecg/types'

interface ECGTraceProps {
  pattern: ECGPattern
}

interface Derivacao {
  id: string
  label: string
}

interface LinhaLayout {
  derivacoes: Derivacao[]
  eRitmolongo?: boolean
}

export default function ECGTrace({ pattern }: ECGTraceProps) {
  const [modoComentado, setModoComentado] = useState(false)

  // Layout clínico: 4 linhas
  const layout: LinhaLayout[] = [
    { derivacoes: [{ id: 'DI', label: 'I' }, { id: 'DII', label: 'II' }, { id: 'DIII', label: 'III' }, { id: 'aVR', label: 'aVR' }] },
    { derivacoes: [{ id: 'aVL', label: 'aVL' }, { id: 'aVF', label: 'aVF' }, { id: 'V1', label: 'V1' }, { id: 'V2', label: 'V2' }] },
    { derivacoes: [{ id: 'V3', label: 'V3' }, { id: 'V4', label: 'V4' }, { id: 'V5', label: 'V5' }, { id: 'V6', label: 'V6' }] },
    { derivacoes: [{ id: 'DII', label: 'II (Ritmo)' }], eRitmolongo: true },
  ]

  // Função para desenhar traçado melhorado
  function desenharTraco(
    temSupra: boolean,
    temInfra: boolean,
    temInversao: boolean,
    temQPat: boolean,
    isRitmoLongo: boolean
  ): string {
    const centroY = 30
    const escala = 1.5
    let numComplexos = isRitmoLongo ? 3 : 2.5

    let d = `M 0 ${centroY}`

    for (let c = 0; c < numComplexos; c++) {
      const offset = c * 80

      // Linha de base antes de P
      d += ` L ${10 + offset} ${centroY}`

      // Onda P discreta
      d += ` L ${15 + offset} ${centroY} L ${17 + offset} ${centroY - 2 * escala} L ${22 + offset} ${centroY} L ${27 + offset} ${centroY}`

      // Complexo QRS
      if (temQPat) {
        // Q patológica (mais profunda)
        d += ` L ${32 + offset} ${centroY + 5 * escala}`
      }

      // R (pico do QRS)
      d += ` L ${37 + offset} ${centroY - 18 * escala} L ${42 + offset} ${centroY}`

      // Segmento ST
      if (temSupra) {
        d += ` L ${55 + offset} ${centroY - 8 * escala} L ${70 + offset} ${centroY - 8 * escala}`
      } else if (temInfra) {
        d += ` L ${55 + offset} ${centroY + 4 * escala} L ${70 + offset} ${centroY + 4 * escala}`
      } else {
        d += ` L ${55 + offset} ${centroY} L ${70 + offset} ${centroY}`
      }

      // Onda T
      if (temInversao) {
        // T negativa
        d += ` L ${80 + offset} ${centroY + 6 * escala} L ${90 + offset} ${centroY}`
      } else {
        // T positiva
        d += ` L ${80 + offset} ${centroY - 4 * escala} L ${90 + offset} ${centroY}`
      }

      // Linha de base até próximo complexo
      if (c < numComplexos - 1) {
        d += ` L ${100 + offset} ${centroY}`
      }
    }

    // Final
    d += ` L ${isRitmoLongo ? 1600 : 240} ${centroY}`

    return d
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200 space-y-4">
      {/* Header com controles */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">ECG 12 Derivações</h3>
          <p className="text-xs text-slate-500 mt-1">Velocidade: 25 mm/s | Amplitude: 10 mm/mV | Filtro: 0,05–150 Hz</p>
        </div>
        <button
          onClick={() => setModoComentado(!modoComentado)}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {modoComentado ? 'Ocultar comentários' : 'Ver ECG comentado'}
        </button>
      </div>

      {/* Folha de ECG única */}
      <div className="overflow-x-auto bg-rose-50 rounded-lg border-2 border-slate-300 p-4">
        <svg width="100%" height="auto" viewBox="0 0 1600 1200" className="bg-rose-50" style={{ minWidth: '100%' }}>
          <defs>
            {/* Pattern para papel milimetrado */}
            <pattern id="gridFino" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="none" stroke="#f8b4b8" strokeWidth="0.3" opacity="0.6" />
            </pattern>
            <pattern id="gridGrosso" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="#f08a90" strokeWidth="0.8" opacity="0.5" />
            </pattern>
          </defs>

          {/* Fundo paper ECG */}
          <rect width="1600" height="1200" fill="#fef5f5" />
          <rect width="1600" height="1200" fill="url(#gridFino)" />
          <rect width="1600" height="1200" fill="url(#gridGrosso)" />

          {/* Linhas de divisão entre grupos de derivações */}
          <line x1="0" y1="280" x2="1600" y2="280" stroke="#bbb" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="0" y1="560" x2="1600" y2="560" stroke="#bbb" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="0" y1="840" x2="1600" y2="840" stroke="#bbb" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />

          {/* Renderizar cada linha de derivações */}
          {layout.map((linha, linhaIdx) => {
            const yBase = linhaIdx * 280 + 50
            const isRitmoLongo = linha.eRitmolongo || false

            return (
              <g key={`linha-${linhaIdx}`}>
                {!isRitmoLongo ? (
                  // 4 derivações por linha (normais)
                  linha.derivacoes.map((der, derIdx) => {
                    const x = derIdx * 400 + 40
                    const temSupra = pattern.derivacoesComSupra.includes(der.id)
                    const temInfra = pattern.derivacoesComInfra.includes(der.id)
                    const temInversao = pattern.derivacoesComInversaoT.includes(der.id)
                    const temQPat = pattern.derivacoesComQPatologica.includes(der.id)
                    const temAlterando = temSupra || temInfra || temInversao || temQPat
                    const strokeColor = modoComentado && temAlterando ? '#d32f2f' : '#000'

                    return (
                      <g key={`der-${der.id}`}>
                        {/* Label da derivação */}
                        <text x={x} y={yBase - 10} fontSize="12" fontWeight="bold" fill="#333">
                          {der.label}
                        </text>

                        {/* Caixa do traçado */}
                        <rect x={x} y={yBase} width="360" height="200" fill="white" stroke="#999" strokeWidth="1" opacity="0.3" />

                        {/* Traçado */}
                        <path
                          d={desenharTraco(temSupra, temInfra, temInversao, temQPat, false)}
                          stroke={strokeColor}
                          strokeWidth="1.2"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          transform={`translate(${x}, ${yBase + 100})`}
                        />

                        {/* Destaque em modo comentado */}
                        {modoComentado && temAlterando && (
                          <rect
                            x={x}
                            y={yBase}
                            width="360"
                            height="200"
                            fill="none"
                            stroke="#d32f2f"
                            strokeWidth="2"
                            opacity="0.5"
                          />
                        )}
                      </g>
                    )
                  })
                ) : (
                  // Ritmo longo - ocupar toda a largura
                  <g>
                    {/* Label */}
                    <text x="40" y={yBase - 10} fontSize="12" fontWeight="bold" fill="#333">
                      {linha.derivacoes[0].label}
                    </text>

                    {/* Caixa do traçado */}
                    <rect x="40" y={yBase} width="1520" height="120" fill="white" stroke="#999" strokeWidth="1" opacity="0.3" />

                    {/* Traçado ritmo longo */}
                    <path
                      d={desenharTraco(
                        pattern.derivacoesComSupra.includes('DII'),
                        pattern.derivacoesComInfra.includes('DII'),
                        pattern.derivacoesComInversaoT.includes('DII'),
                        pattern.derivacoesComQPatologica.includes('DII'),
                        true
                      )}
                      stroke="#000"
                      strokeWidth="1"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                      transform={`translate(40, ${yBase + 60})`}
                    />
                  </g>
                )}
              </g>
            )
          })}

          {/* Rodapé */}
          <text x="40" y="1160" fontSize="10" fill="#999" fontStyle="italic">
            Traçado simulado para fins educacionais.
          </text>
        </svg>
      </div>

      {/* Legenda em modo comentado */}
      {modoComentado && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
          <p className="text-sm font-semibold text-slate-800">Alterações detectadas:</p>
          <div className="space-y-2 text-sm">
            {pattern.derivacoesComSupra.length > 0 && (
              <div className="flex items-center gap-2 text-red-700">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>
                  <strong>Supradesnivelamento de ST:</strong> {pattern.derivacoesComSupra.join(', ')}
                </span>
              </div>
            )}
            {pattern.derivacoesComInfra.length > 0 && (
              <div className="flex items-center gap-2 text-amber-700">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span>
                  <strong>Infradesnivelamento de ST:</strong> {pattern.derivacoesComInfra.join(', ')}
                </span>
              </div>
            )}
            {pattern.derivacoesComInversaoT.length > 0 && (
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>
                  <strong>Inversão de onda T:</strong> {pattern.derivacoesComInversaoT.join(', ')}
                </span>
              </div>
            )}
            {pattern.derivacoesComQPatologica.length > 0 && (
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span>
                  <strong>Onda Q patológica:</strong> {pattern.derivacoesComQPatologica.join(', ')}
                </span>
              </div>
            )}
            {pattern.derivacoesComSupra.length === 0 &&
              pattern.derivacoesComInfra.length === 0 &&
              pattern.derivacoesComInversaoT.length === 0 &&
              pattern.derivacoesComQPatologica.length === 0 && (
                <p className="text-slate-600">ECG dentro dos limites normais. Sem alterações detectadas.</p>
              )}
          </div>
        </div>
      )}
    </div>
  )
}
