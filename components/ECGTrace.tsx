'use client'

import { ECGPattern } from '@/lib/ecg/types'

interface ECGTraceProps {
  pattern: ECGPattern
}

export default function ECGTrace({ pattern }: ECGTraceProps) {
  const derivacoes = [
    { id: 'DI', label: 'I' },
    { id: 'DII', label: 'II' },
    { id: 'DIII', label: 'III' },
    { id: 'aVR', label: 'aVR' },
    { id: 'aVL', label: 'aVL' },
    { id: 'aVF', label: 'aVF' },
    { id: 'V1', label: 'V1' },
    { id: 'V2', label: 'V2' },
    { id: 'V3', label: 'V3' },
    { id: 'V4', label: 'V4' },
    { id: 'V5', label: 'V5' },
    { id: 'V6', label: 'V6' },
  ]

  function desenharTraco(
    derivacao: string,
    temSupra: boolean,
    temInfra: boolean,
    temInversao: boolean,
    temQPat: boolean
  ) {
    const largura = 240
    const altura = 60
    const centroY = altura / 2
    const escala = 1.2

    let d = `M 0 ${centroY}`

    // Início - onda P
    d += ` L 15 ${centroY} L 20 ${centroY - 3 * escala} L 25 ${centroY}`

    // Complexo QRS
    if (temQPat) {
      // Q profunda
      d += ` L 35 ${centroY + 6 * escala} L 40 ${centroY}`
    } else {
      d += ` L 35 ${centroY}`
    }

    // R
    d += ` L 45 ${centroY - 20 * escala} L 55 ${centroY}`

    if (temSupra) {
      // ST elevado
      d += ` L 75 ${centroY - 10 * escala} L 105 ${centroY - 10 * escala}`
    } else if (temInfra) {
      // ST deprimido
      d += ` L 75 ${centroY + 6 * escala} L 105 ${centroY + 6 * escala}`
    } else {
      // ST normal
      d += ` L 75 ${centroY} L 105 ${centroY}`
    }

    // Onda T
    if (temInversao) {
      // T invertida
      d += ` L 135 ${centroY + 8 * escala} L 160 ${centroY}`
    } else {
      // T normal
      d += ` L 135 ${centroY - 5 * escala} L 160 ${centroY}`
    }

    // Final
    d += ` L ${largura} ${centroY}`

    return d
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Traçado ECG 12 Derivações</h3>
        <p className="text-xs text-slate-500">Papel: 25 mm/s | Amplitude: 10 mm/mV</p>
      </div>

      {/* Grid 3x4 de derivações */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {derivacoes.map((der) => {
          const temSupra = pattern.derivacoesComSupra.includes(der.id)
          const temInfra = pattern.derivacoesComInfra.includes(der.id)
          const temInversao = pattern.derivacoesComInversaoT.includes(der.id)
          const temQPat = pattern.derivacoesComQPatologica.includes(der.id)

          const bgColor = temSupra
            ? 'bg-red-50 border-red-300'
            : temInfra
              ? 'bg-yellow-50 border-yellow-300'
              : temInversao
                ? 'bg-blue-50 border-blue-300'
                : temQPat
                  ? 'bg-purple-50 border-purple-300'
                  : 'bg-slate-50 border-slate-300'

          return (
            <div key={der.id} className={`border-2 rounded p-2 ${bgColor}`}>
              <p className="text-xs font-bold text-slate-700 mb-1">{der.label}</p>
              <svg
                width="100%"
                height="70"
                viewBox="0 0 240 60"
                className="bg-white bg-opacity-60"
              >
                {/* Desenhar grid de fundo (papel de ECG) */}
                <defs>
                  <pattern
                    id={`grid-${der.id}`}
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="12" height="12" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                  </pattern>
                  <pattern
                    id={`grid-bold-${der.id}`}
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="60" height="60" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Grid fino */}
                <rect width="240" height="60" fill="white" />
                <rect width="240" height="60" fill={`url(#grid-${der.id})`} />
                <rect width="240" height="60" fill={`url(#grid-bold-${der.id})`} />

                {/* Desenhar traço */}
                <path
                  d={desenharTraco(der.id, temSupra, temInfra, temInversao, temQPat)}
                  stroke="#000"
                  strokeWidth="1.5"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Status */}
              <div className="text-xs mt-1 space-y-0.5">
                {temSupra && <p className="font-semibold text-red-600">SUPRA ↑</p>}
                {temInfra && <p className="font-semibold text-yellow-600">INFRA ↓</p>}
                {temInversao && <p className="font-semibold text-blue-600">T inv</p>}
                {temQPat && <p className="font-semibold text-purple-600">Q pat</p>}
                {!temSupra && !temInfra && !temInversao && !temQPat && (
                  <p className="text-slate-500">—</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="p-4 bg-slate-50 rounded border border-slate-200">
        <p className="text-xs font-semibold text-slate-700 mb-2">Legenda:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-300 border border-red-500 rounded"></div>
            <span>SUPRA de ST</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-300 border border-yellow-500 rounded"></div>
            <span>INFRA de ST</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 border border-blue-500 rounded"></div>
            <span>T Invertida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-300 border border-purple-500 rounded"></div>
            <span>Q Patológica</span>
          </div>
        </div>
      </div>
    </div>
  )
}
