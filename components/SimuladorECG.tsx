'use client'

import { useState, useRef } from 'react'
import { ECGLeadPosition, ECGLead } from '@/lib/ecg/types'
import { validarPosicionamentoECG } from '@/lib/ecg/validarEletrodos'
import { obterPadrao, PADROES_ECG } from '@/lib/ecg/padroesECG'
import ECGTrace from './ECGTrace'
import ECGReport from './ECGReport'

const LEADS: ECGLead[] = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'RA', 'LA', 'RL', 'LL']

interface SimuladorECGProps {
  padrao?: string
  onClose?: () => void
}

export default function SimuladorECG({ padrao = 'normal', onClose }: SimuladorECGProps) {
  const [eletrodos, setEletrodos] = useState<ECGLeadPosition[]>(() =>
    LEADS.map((lead) => ({
      lead,
      x: 0,
      y: 0,
      isPlaced: false,
    }))
  )

  const [eletrodoDragging, setEletrodoDragging] = useState<ECGLead | null>(null)
  const [validacao, setValidacao] = useState<any>(null)
  const [ecgGerado, setEcgGerado] = useState(false)
  const [padraoSelecionado, setPatraoSelecionado] = useState(padrao)

  const containerRef = useRef<HTMLDivElement>(null)

  const pattern = obterPadrao(padraoSelecionado)

  if (!pattern) {
    return null
  }

  function handleDragStart(lead: ECGLead, e: React.DragEvent) {
    e.dataTransfer.effectAllowed = 'move'
    setEletrodoDragging(lead)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()

    if (!containerRef.current || !eletrodoDragging) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Garantir que está dentro dos limites
    const xFinal = Math.max(0, Math.min(100, x))
    const yFinal = Math.max(0, Math.min(100, y))

    setEletrodos((prev) =>
      prev.map((el) =>
        el.lead === eletrodoDragging
          ? { ...el, x: xFinal, y: yFinal, isPlaced: true }
          : el
      )
    )

    setEletrodoDragging(null)
  }

  function gerarECG() {
    const result = validarPosicionamentoECG(eletrodos)
    setValidacao(result)

    if (result.exameTecnicamenteAdequado) {
      setEcgGerado(true)
    }
  }

  function resetarSimulador() {
    setEletrodos((prev) => prev.map((el) => ({ ...el, x: 0, y: 0, isPlaced: false })))
    setValidacao(null)
    setEcgGerado(false)
  }

  const eletrodosColocados = eletrodos.filter((e) => e.isPlaced).length

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold">Simulador de ECG 12 Derivações</h2>
            <p className="text-sm text-blue-100 mt-1">Arraste os eletrodos para o paciente</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Seletor de padrão */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Padrão ECG:
            </label>
            <select
              value={padraoSelecionado}
              onChange={(e) => {
                setPatraoSelecionado(e.target.value)
                resetarSimulador()
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PADROES_ECG.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Área principal de simulação */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Paciente virtual com eletrodos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border-2 border-slate-300 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Paciente Virtual</h3>
                <div
                  ref={containerRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative bg-slate-50 border-2 border-slate-200 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
                  style={{ aspectRatio: '3/4', minHeight: '480px' }}
                >
                  {/* Boneco real frontal */}
                  <img
                    src="/images/boneco/boneco-frente.png"
                    alt="Paciente"
                    className="w-full h-full object-contain p-2"
                    draggable={false}
                  />

                  {/* SVG de cabos saindo dos eletrodos até a máquina (efeito visual) */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    {eletrodos
                      .filter((el) => el.isPlaced)
                      .map((el) => (
                        <line
                          key={`cable-${el.lead}`}
                          x1={`${el.x}%`}
                          y1={`${el.y}%`}
                          x2="95%"
                          y2="95%"
                          stroke="#999"
                          strokeWidth="1"
                          opacity="0.6"
                          strokeDasharray="3,3"
                        />
                      ))}
                  </svg>

                  {/* Eletrodos posicionados */}
                  {eletrodos
                    .filter((el) => el.isPlaced)
                    .map((el) => {
                      const isVLead = el.lead.startsWith('V')
                      const isMembroLead = ['RA', 'LA', 'RL', 'LL'].includes(el.lead)
                      const bgColor = isVLead ? 'bg-red-500 border-red-700' : 'bg-blue-500 border-blue-700'

                      return (
                        <div
                          key={el.lead}
                          style={{
                            position: 'absolute',
                            left: `${el.x}%`,
                            top: `${el.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className={`w-7 h-7 ${bgColor} rounded-full border-2 flex items-center justify-center text-white text-[10px] font-bold cursor-move hover:scale-110 transition-transform shadow-lg z-10`}
                          draggable
                          onDragStart={(e) => handleDragStart(el.lead, e)}
                          title={`${el.lead}`}
                        >
                          {el.lead}
                        </div>
                      )
                    })}
                </div>

                <div className="text-xs text-slate-600 bg-blue-50 border border-blue-200 rounded p-2">
                  <p>🔴 Vermelho: Derivações precordiais (V1–V6)</p>
                  <p>🔵 Azul: Membros (RA, LA, RL, LL)</p>
                  <p>✋ Arraste eletrodos da lista ao lado para posicionar</p>
                </div>
              </div>
            </div>

            {/* Painel direito: eletrodos + máquina + status */}
            <div className="lg:col-span-1 space-y-4">
              {/* Precordiais - V1 a V6 */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span> Precordiais
                </h4>
                <div className="grid grid-cols-3 gap-1">
                  {['V1', 'V2', 'V3', 'V4', 'V5', 'V6'].map((lead) => {
                    const el = eletrodos.find((e) => e.lead === lead)
                    const isPlaced = el?.isPlaced

                    return (
                      <div
                        key={lead}
                        draggable
                        onDragStart={(e) => handleDragStart(lead as ECGLead, e)}
                        className={`p-2 rounded text-xs font-bold text-center cursor-move transition-all ${
                          isPlaced
                            ? 'bg-green-100 border border-green-400 text-green-800'
                            : 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {lead}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Membros - RA, LA, RL, LL */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Membros
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {['RA', 'LA', 'RL', 'LL'].map((lead) => {
                    const el = eletrodos.find((e) => e.lead === lead)
                    const isPlaced = el?.isPlaced

                    return (
                      <div
                        key={lead}
                        draggable
                        onDragStart={(e) => handleDragStart(lead as ECGLead, e)}
                        className={`p-2 rounded text-xs font-bold text-center cursor-move transition-all ${
                          isPlaced
                            ? 'bg-green-100 border border-green-400 text-green-800'
                            : 'bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {lead}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Máquina de ECG */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border-2 border-slate-700 text-white">
                <div className="text-center mb-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">ECG</p>
                  <p className="text-xl font-mono mt-1 text-green-400">━━━━━━</p>
                </div>

                {/* Indicador de progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">Eletrodos</span>
                    <span className="font-bold">{eletrodosColocados}/10</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(eletrodosColocados / 10) * 100}%` }}
                    ></div>
                  </div>

                  {/* Status */}
                  <div className="mt-2 p-2 bg-slate-700 rounded text-[11px] text-center font-semibold">
                    {eletrodosColocados < 8 ? (
                      <p className="text-yellow-300">✓ {eletrodosColocados}/8 mínimo</p>
                    ) : (
                      <p className="text-green-300">✓ Pronto para gerar</p>
                    )}
                  </div>
                </div>

                {/* Botões */}
                <div className="space-y-2 mt-3">
                  <button
                    onClick={gerarECG}
                    disabled={eletrodosColocados < 8}
                    className="w-full py-2 px-3 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📊 Gerar ECG
                  </button>
                  <button
                    onClick={resetarSimulador}
                    className="w-full py-2 px-3 bg-slate-600 text-white rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors"
                  >
                    🔄 Resetar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Validação e Resultado */}
          {validacao && (
            <div className="space-y-6">
              <ECGReport pattern={pattern} validacao={validacao} />
              {ecgGerado && <ECGTrace pattern={pattern} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
