'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ECGPattern } from '@/lib/ecg/types'
import type { RespostaGeracaoECG } from '@/src/services/ecgGenerator'

interface ECGTraceProps {
  pattern: ECGPattern
  ecgData?: RespostaGeracaoECG
}

interface Derivacao {
  id: string
  label: string
}

interface LinhaLayout {
  derivacoes: Derivacao[]
  eRitmolongo?: boolean
}

// Componente reutilizável para renderizar traçado ECG
interface EcgTraceProps {
  lead: string
  dados: number[]
  width?: number
  height?: number
  isLong?: boolean
}

function renderECGTrace({ lead, dados, width = 220, height = 90, isLong = false }: EcgTraceProps) {
  const padding = 8
  const innerWidth = width - 2 * padding
  const innerHeight = height - 2 * padding

  // Para ritmo longo, fazer subamostragem para evitar overdraw
  let dadosParaRender = dados
  if (isLong && dados.length > 2000) {
    const fatorSubamostragem = Math.ceil(dados.length / 1000)
    dadosParaRender = dados.filter((_, idx) => idx % fatorSubamostragem === 0)
  }

  // Usar escala fisiológica: -2.5 a +2.5 mV
  const minEscala = -2.5
  const maxEscala = 2.5
  const escalaRange = maxEscala - minEscala

  // Limitar valores entre -2.5 e +2.5 mV (clamp) e filtrar inválidos
  const dadosLimitados = dadosParaRender
    .filter((v) => isFinite(v))
    .map((v) => Math.max(minEscala, Math.min(maxEscala, v)))

  if (dadosLimitados.length === 0) {
    return null
  }

  // Criar polyline points com escala fisiológica
  const points = dadosLimitados
    .map((val, idx) => {
      const x = padding + (idx / Math.max(1, dadosLimitados.length - 1)) * innerWidth
      const y = padding + innerHeight - ((val - minEscala) / escalaRange) * innerHeight
      return `${x},${y}`
    })
    .join(' ')

  const patternId = `grid-${lead}-${Date.now()}`
  const zeroLineY = padding + (innerHeight * 2.5) / escalaRange

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="border border-slate-300 rounded"
      style={{ backgroundColor: '#fef5f5', display: 'block' }}
    >
      <defs>
        <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fca5a5" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Fundo claro */}
      <rect x="0" y="0" width={width} height={height} fill="#fef5f5" />

      {/* Grid */}
      <rect x="0" y="0" width={width} height={height} fill={`url(#${patternId})`} />

      {/* Linha de base (zero) */}
      <line x1={padding} y1={zeroLineY} x2={width - padding} y2={zeroLineY} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />

      {/* Traçado */}
      <polyline points={points} fill="none" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Componente para renderizar cada traçado individual
function EcgTraceCanvas({ lead, dados }: { lead: string; dados: number[] }) {
  const svgContent = renderECGTrace({ lead, dados, width: 220, height: 90, isLong: false })

  return (
    <div className="flex flex-col items-center gap-1">
      {svgContent}
      <p className="text-xs font-semibold text-slate-700">{lead}</p>
    </div>
  )
}

// Componente para ritmo longo — CORRIGIDO (sem fundo preto)
function EcgRhythmStrip({ dados }: { dados: number[] }) {
  const width = 900
  const height = 120
  const minY = -2.5
  const maxY = 2.5

  // Filtrar e limitar dados
  const dadosValidos = dados
    .filter((v) => Number.isFinite(v))
    .map((v) => Math.max(minY, Math.min(maxY, v)))

  if (dadosValidos.length === 0) {
    return (
      <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
        II (Ritmo) - sem dados
      </div>
    )
  }

  // Calcular pontos do traçado
  const stepX = width / Math.max(dadosValidos.length - 1, 1)
  const points = dadosValidos
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - minY) / (maxY - minY)) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="border border-slate-300 rounded"
        style={{ backgroundColor: '#fef5f5', display: 'block' }}
      >
        {/* Fundo claro */}
        <rect x="0" y="0" width={width} height={height} fill="#fef5f5" />

        {/* Grid fino */}
        {Array.from({ length: Math.floor(width / 10) + 1 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 10} y1={0} x2={i * 10} y2={height} stroke="#fecaca" strokeWidth="0.4" />
        ))}
        {Array.from({ length: Math.floor(height / 10) + 1 }).map((_, i) => (
          <line key={`h-${i}`} x1={0} y1={i * 10} x2={width} y2={i * 10} stroke="#fecaca" strokeWidth="0.4" />
        ))}

        {/* Grid grosso */}
        {Array.from({ length: Math.floor(width / 50) + 1 }).map((_, i) => (
          <line key={`vg-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={height} stroke="#fca5a5" strokeWidth="0.8" />
        ))}
        {Array.from({ length: Math.floor(height / 50) + 1 }).map((_, i) => (
          <line key={`hg-${i}`} x1={0} y1={i * 50} x2={width} y2={i * 50} stroke="#fca5a5" strokeWidth="0.8" />
        ))}

        {/* Traçado */}
        <polyline points={points} fill="none" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="text-center text-xs font-semibold text-slate-700 mt-1">II (Ritmo)</div>
    </div>
  )
}

export default function ECGTrace({ pattern, ecgData }: ECGTraceProps) {
  const [modoComentado, setModoComentado] = useState(false)

  // Layout clínico: 4 linhas (usado apenas para fallback SVG)
  const layout: LinhaLayout[] = [
    { derivacoes: [{ id: 'DI', label: 'I' }, { id: 'DII', label: 'II' }, { id: 'DIII', label: 'III' }, { id: 'aVR', label: 'aVR' }] },
    { derivacoes: [{ id: 'aVL', label: 'aVL' }, { id: 'aVF', label: 'aVF' }, { id: 'V1', label: 'V1' }, { id: 'V2', label: 'V2' }] },
    { derivacoes: [{ id: 'V3', label: 'V3' }, { id: 'V4', label: 'V4' }, { id: 'V5', label: 'V5' }, { id: 'V6', label: 'V6' }] },
    { derivacoes: [{ id: 'DII', label: 'II (Ritmo)' }], eRitmolongo: true },
  ]

  // Função para desenhar traçado (fallback)
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

      d += ` L ${10 + offset} ${centroY}`
      d += ` L ${15 + offset} ${centroY} L ${17 + offset} ${centroY - 2 * escala} L ${22 + offset} ${centroY} L ${27 + offset} ${centroY}`

      if (temQPat) {
        d += ` L ${32 + offset} ${centroY + 5 * escala}`
      }

      d += ` L ${37 + offset} ${centroY - 18 * escala} L ${42 + offset} ${centroY}`

      if (temSupra) {
        d += ` L ${55 + offset} ${centroY - 8 * escala} L ${70 + offset} ${centroY - 8 * escala}`
      } else if (temInfra) {
        d += ` L ${55 + offset} ${centroY + 4 * escala} L ${70 + offset} ${centroY + 4 * escala}`
      } else {
        d += ` L ${55 + offset} ${centroY} L ${70 + offset} ${centroY}`
      }

      if (temInversao) {
        d += ` L ${80 + offset} ${centroY + 6 * escala} L ${90 + offset} ${centroY}`
      } else {
        d += ` L ${80 + offset} ${centroY - 4 * escala} L ${90 + offset} ${centroY}`
      }

      if (c < numComplexos - 1) {
        d += ` L ${100 + offset} ${centroY}`
      }
    }

    d += ` L ${isRitmoLongo ? 1600 : 240} ${centroY}`
    return d
  }

  // Se houver dados gerados pelo ECGSYN, exibir traçado real
  if (ecgData) {
    return (
      <div className="bg-white rounded-lg p-6 border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">ECG 12 Derivações - Traçado Gerado</h3>
            <p className="text-xs text-slate-500 mt-1">
              Velocidade: 25 mm/s | Amplitude: 10 mm/mV | Taxa de amostragem: {ecgData.samplingRate} Hz | Duração: {ecgData.duration}s
            </p>
          </div>
        </div>

        {/* Renderizar traçados gerados em layout clássico 12 derivações */}
        <div className="bg-rose-50 rounded-lg border-2 border-slate-300 p-4">
                    {/* Validação de derivações */}
          {(() => {
            const derivacoesEsperadas = [
              'I',
              'II',
              'III',
              'aVR',
              'aVL',
              'aVF',
              'V1',
              'V2',
              'V3',
              'V4',
              'V5',
              'V6',
            ] as const

            const ausentes = derivacoesEsperadas.filter(
              (lead) => !ecgData.leads[lead]
            )

            if (ausentes.length > 0) {
              console.warn(
                `[ECGTrace] Derivações ausentes em ecgData.leads: ${ausentes.join(', ')}`
              )
            }

            return null
          })()}

          {/* Grid 4x3 para 12 derivações */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {/* Linha 1: I, aVR, V1, V4 */}
            {(['I', 'aVR', 'V1', 'V4'] as const).map((lead) => (
              <div key={lead} className="flex justify-center">
                {ecgData.leads[lead] ? (
                  <EcgTraceCanvas lead={lead} dados={ecgData.leads[lead]!} />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    {lead}
                    <br />
                    (ausente)
                  </div>
                )}
              </div>
            ))}

            {/* Linha 2: II, aVL, V2, V5 */}
            {(['II', 'aVL', 'V2', 'V5'] as const).map((lead) => (
              <div key={lead} className="flex justify-center">
                {ecgData.leads[lead] ? (
                  <EcgTraceCanvas lead={lead} dados={ecgData.leads[lead]!} />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    {lead}
                    <br />
                    (ausente)
                  </div>
                )}
              </div>
            ))}

            {/* Linha 3: III, aVF, V3, V6 */}
            {(['III', 'aVF', 'V3', 'V6'] as const).map((lead) => (
              <div key={lead} className="flex justify-center">
                {ecgData.leads[lead] ? (
                  <EcgTraceCanvas lead={lead} dados={ecgData.leads[lead]!} />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    {lead}
                    <br />
                    (ausente)
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Linha 4: Ritmo longo (DII - 5 segundos) */}
          <div className="w-full border-t-2 border-slate-300 pt-4 mt-4">
            {ecgData.leads.II ? <EcgRhythmStrip dados={ecgData.leads.II} /> : <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">II (Ritmo) - ausente</div>}
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center italic">
          Traçado sintético gerado com ECGSYN (PhysioNet) para fins educacionais.
        </p>
      </div>
    )
  }

  // Se houver imagem, exibir a imagem PNG
  if (pattern.imagem) {
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

        {/* Imagem ECG */}
        <div className="bg-rose-50 rounded-lg border-2 border-slate-300 p-4 overflow-x-auto">
          <div className="relative w-full bg-white rounded-lg overflow-hidden">
            <img
              src={pattern.imagem}
              alt={`ECG - ${pattern.titulo}`}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          <p className="mt-3 text-xs text-slate-500 text-center italic">Traçado simulado para fins educacionais.</p>
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

  // Fallback: exibir SVG se não houver imagem
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

      {/* Folha de ECG única (SVG fallback) */}
      <div className="overflow-x-auto bg-rose-50 rounded-lg border-2 border-slate-300 p-4">
        <svg width="100%" height="auto" viewBox="0 0 1600 1200" className="bg-rose-50" style={{ minWidth: '100%' }}>
          <defs>
            <pattern id="gridFino" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="none" stroke="#f8b4b8" strokeWidth="0.3" opacity="0.6" />
            </pattern>
            <pattern id="gridGrosso" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="#f08a90" strokeWidth="0.8" opacity="0.5" />
            </pattern>
          </defs>

          <rect width="1600" height="1200" fill="#fef5f5" />
          <rect width="1600" height="1200" fill="url(#gridFino)" />
          <rect width="1600" height="1200" fill="url(#gridGrosso)" />

          <line x1="0" y1="280" x2="1600" y2="280" stroke="#bbb" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="0" y1="560" x2="1600" y2="560" stroke="#bbb" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="0" y1="840" x2="1600" y2="840" stroke="#bbb" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />

          {layout.map((linha, linhaIdx) => {
            const yBase = linhaIdx * 280 + 50
            const isRitmoLongo = linha.eRitmolongo || false

            return (
              <g key={`linha-${linhaIdx}`}>
                {!isRitmoLongo ? (
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
                        <text x={x} y={yBase - 10} fontSize="12" fontWeight="bold" fill="#333">
                          {der.label}
                        </text>

                        <rect x={x} y={yBase} width="360" height="200" fill="white" stroke="#999" strokeWidth="1" opacity="0.3" />

                        <path
                          d={desenharTraco(temSupra, temInfra, temInversao, temQPat, false)}
                          stroke={strokeColor}
                          strokeWidth="1.2"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          transform={`translate(${x}, ${yBase + 100})`}
                        />

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
                  <g>
                    <text x="40" y={yBase - 10} fontSize="12" fontWeight="bold" fill="#333">
                      {linha.derivacoes[0].label}
                    </text>

                    <rect x="40" y={yBase} width="1520" height="120" fill="white" stroke="#999" strokeWidth="1" opacity="0.3" />

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
