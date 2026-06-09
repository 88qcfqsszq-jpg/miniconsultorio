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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Área de arrastar eletrodos */}
            <div className="lg:col-span-2">
              <div
                ref={containerRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="bg-gradient-to-b from-blue-50 to-slate-50 border-3 border-dashed border-blue-300 rounded-lg p-4 min-h-[500px] relative cursor-grab active:cursor-grabbing flex items-center justify-center"
              >
                {/* Desenho esquemático do paciente */}
                <svg
                  viewBox="0 0 200 400"
                  className="w-full h-full max-w-xs absolute inset-0 p-4"
                  style={{ aspectRatio: '1/2' }}
                >
                  {/* Cabeça */}
                  <circle cx="100" cy="40" r="25" fill="#fdbcb4" stroke="#333" strokeWidth="2" />

                  {/* Corpo */}
                  <ellipse cx="100" cy="100" rx="20" ry="50" fill="#fdbcb4" stroke="#333" strokeWidth="2" />

                  {/* Braço direito */}
                  <rect x="120" y="85" width="45" height="12" rx="6" fill="#fdbcb4" stroke="#333" strokeWidth="2" />
                  <circle cx="165" cy="91" r="10" fill="#fdbcb4" stroke="#333" strokeWidth="2" />

                  {/* Braço esquerdo */}
                  <rect x="35" y="85" width="45" height="12" rx="6" fill="#fdbcb4" stroke="#333" strokeWidth="2" />
                  <circle cx="35" cy="91" r="10" fill="#fdbcb4" stroke="#333" strokeWidth="2" />

                  {/* Perna direita */}
                  <rect x="95" y="160" width="10" height="90" rx="5" fill="#fdbcb4" stroke="#333" strokeWidth="2" />
                  <circle cx="100" cy="260" r="10" fill="#fdbcb4" stroke="#333" strokeWidth="2" />

                  {/* Perna esquerda */}
                  <rect x="95" y="160" width="10" height="90" rx="5" fill="#fdbcb4" stroke="#333" strokeWidth="2" />
                  <circle cx="100" cy="260" r="10" fill="#fdbcb4" stroke="#333" strokeWidth="2" />
                </svg>

                {/* Eletrodos posicionados */}
                {eletrodos
                  .filter((el) => el.isPlaced)
                  .map((el) => (
                    <div
                      key={el.lead}
                      style={{
                        position: 'absolute',
                        left: `${(el.x / 100) * 100}%`,
                        top: `${(el.y / 100) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="w-8 h-8 bg-red-500 rounded-full border-2 border-red-700 flex items-center justify-center text-white text-xs font-bold cursor-move hover:bg-red-600 transition-colors shadow-lg z-10"
                      draggable
                      onDragStart={(e) => handleDragStart(el.lead, e)}
                      title={`${el.lead} @ (${el.x.toFixed(0)}%, ${el.y.toFixed(0)}%)`}
                    >
                      {el.lead}
                    </div>
                  ))}
              </div>

              <p className="text-xs text-slate-600 mt-2">
                ✋ Arraste eletrodos da lista abaixo. Posicione sobre o tórax e membros.
              </p>
            </div>

            {/* Painel direito: eletrodos + máquina */}
            <div className="lg:col-span-2 space-y-4">
              {/* Lista de eletrodos */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Eletrodos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {LEADS.map((lead) => {
                    const el = eletrodos.find((e) => e.lead === lead)
                    const isPlaced = el?.isPlaced

                    return (
                      <div
                        key={lead}
                        draggable
                        onDragStart={(e) => handleDragStart(lead, e)}
                        className={`p-3 rounded-lg font-bold text-sm cursor-move transition-all ${
                          isPlaced
                            ? 'bg-green-100 border border-green-400 text-green-800'
                            : 'bg-slate-100 border border-slate-400 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {isPlaced ? '✅' : '⭕'} {lead}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Máquina de ECG */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border-2 border-slate-700 text-white">
                <div className="text-center mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase">ECG Machine</p>
                  <p className="text-2xl font-mono mt-1">━━━━━━━━━</p>
                </div>

                {/* Indicador de progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold">Eletrodos:</p>
                    <p className="text-sm font-bold">{eletrodosColocados}/10</p>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(eletrodosColocados / 10) * 100}%` }}
                    ></div>
                  </div>

                  {/* Status */}
                  <div className="mt-3 p-2 bg-slate-700 rounded text-xs text-center">
                    {eletrodosColocados < 8 ? (
                      <p className="text-yellow-300">Posicione mais eletrodos</p>
                    ) : (
                      <p className="text-green-300">✓ Pronto para gerar ECG</p>
                    )}
                  </div>
                </div>

                {/* Botões */}
                <div className="space-y-2 mt-4">
                  <button
                    onClick={gerarECG}
                    disabled={eletrodosColocados < 8}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📊 Gerar ECG
                  </button>
                  <button
                    onClick={resetarSimulador}
                    className="w-full py-2 px-4 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
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
