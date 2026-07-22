'use client'

import { useState, useEffect, useRef } from 'react'
import {
  PadraoMembrosInferiores,
  AchadoMembrosInferiores,
  PulsoArterialMI,
  PulsoPositionado,
} from '@/lib/membros-inferiores/types'
import PacienteInterativoMembrosInferiores from '@/components/membros-inferiores/PacienteInterativoMembrosInferiores'
import BoxPulsosArteriais from '@/components/membros-inferiores/BoxPulsosArteriais'

interface ModalMembrosInferioresProps {
  padrao?: PadraoMembrosInferiores
  onClose?: () => void
}

export default function ModalMembrosInferiores({
  padrao = 'normal',
  onClose,
}: ModalMembrosInferioresProps) {
  const [achados, setAchados] = useState<AchadoMembrosInferiores[]>([])
  const [pulsosDrop, setPulsosDrop] = useState<PulsoPositionado[]>([])
  const [draggedPulso, setDraggedPulso] = useState<PulsoArterialMI | null>(null)
  const [erroPulso, setErroPulso] = useState<string | null>(null)
  const [resetCounter, setResetCounter] = useState(0)
  const [copiadoOk, setCopiadoOk] = useState(false)
  const copiadoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiadoTimeoutRef.current) clearTimeout(copiadoTimeoutRef.current)
    }
  }, [])

  // Resetar achados quando padrão muda
  useEffect(() => {
    setAchados([])
    setPulsosDrop([])
    setDraggedPulso(null)
    setErroPulso(null)
  }, [padrao])

  // Fechar com tecla ESC
  useEffect(() => {
    if (!onClose) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleAcaoRealizada = (achado: AchadoMembrosInferiores) => {
    setAchados([...achados, achado])
  }

  const handleDragStartPulso = (pulsoId: PulsoArterialMI) => {
    setDraggedPulso(pulsoId)
    setErroPulso(null)
  }

  const handleDropPulso = (
    xDrop: number,
    yDrop: number,
    vistaUsada: 'frontal' | 'posterior' | 'plantar'
  ) => {
    if (!draggedPulso) return

    const { obterPulso, validarPosicaoPulso } = require('@/lib/membros-inferiores/coordenadas')
    const { obterResultadoBuscaAtiva } = require('@/lib/membros-inferiores/resultados-buscaativa')

    const pulso = obterPulso(draggedPulso)
    if (!pulso) {
      setDraggedPulso(null)
      return
    }

    // Validar posição
    if (!validarPosicaoPulso(pulso, xDrop, yDrop, vistaUsada)) {
      if (pulso.vista !== vistaUsada) {
        setErroPulso(
          `Use a vista ${pulso.vista === 'posterior' ? 'posterior' : 'frontal'} para palpar a ${pulso.label.toLowerCase()}.`
        )
      } else {
        setErroPulso('Local de palpação inadequado. Reposicione o ponto anatômico.')
      }
      setDraggedPulso(null)
      return
    }

    // Validação passou - registrar achado
    const resultado = obterResultadoBuscaAtiva(padrao, pulso.regiaoClinica, 'palpar_pulso_femoral')

    const achado: AchadoMembrosInferiores = {
      id: `pulso-${draggedPulso}-${Date.now()}`,
      titulo: `${pulso.label}`,
      descricao: resultado?.resultado || 'Pulso: 2+/4.',
      categoria: 'pulsos',
      regiao: pulso.regiaoClinica as any,
      acaoRealizada: 'Palpação',
    }

    // Adicionar pulso posicionado
    setPulsosDrop([...pulsosDrop, { id: draggedPulso, xDrop, yDrop, vista: vistaUsada }])

    // Registrar achado
    setAchados([...achados, achado])

    setDraggedPulso(null)
    setErroPulso(null)
  }

  const handleResetar = () => {
    setAchados([])
    setPulsosDrop([])
    setDraggedPulso(null)
    setErroPulso(null)
    setResetCounter(c => c + 1)
    if (copiadoTimeoutRef.current) clearTimeout(copiadoTimeoutRef.current)
    setCopiadoOk(false)
  }

  const handleCopiar = () => {
    const todosAchados = achados
      .map((a) => {
        const regiao = a.regiao ? a.regiao.replace(/_/g, ' ') : ''
        const acao = a.acaoRealizada ? ` — ${a.acaoRealizada}` : ''
        return `${regiao}${acao}\n${a.descricao}`
      })
      .join('\n\n')
    navigator.clipboard.writeText(todosAchados)
    if (copiadoTimeoutRef.current) clearTimeout(copiadoTimeoutRef.current)
    setCopiadoOk(true)
    copiadoTimeoutRef.current = setTimeout(() => setCopiadoOk(false), 2500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold">Avaliação Completa dos Membros Inferiores</h2>
            <p className="text-sm text-blue-100 mt-1">Busca ativa por regiões anatômicas</p>
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
          {/* Conteúdo principal: 2 colunas (paciente interativo + achados) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna esquerda: Paciente interativo */}
            <div>
              <PacienteInterativoMembrosInferiores
                padrao={padrao}
                onAcaoRealizada={handleAcaoRealizada}
                achadosJaRegistrados={achados}
                draggedPulso={draggedPulso}
                onDropPulso={handleDropPulso}
                resetCounter={resetCounter}
                pulsosDrop={pulsosDrop}
              />
            </div>

            {/* Coluna direita: Pulsos + Achados */}
            <div className="space-y-4">
              {/* Box de Palpação dos Pulsos */}
              <BoxPulsosArteriais
                pulsosPositionados={pulsosDrop.map(p => p.id)}
                onDragStart={handleDragStartPulso}
              />

              {/* Aviso de erro de pulso */}
              {erroPulso && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  ⚠️ {erroPulso}
                </div>
              )}

              {/* Painel de achados */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Achados encontrados</h3>
                {achados.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {achados.map((achado, idx) => (
                      <div
                        key={`${achado.id}-${idx}`}
                        className="p-3 bg-slate-50 rounded border border-slate-200 text-sm space-y-1"
                      >
                        <p className="font-semibold text-slate-800">{achado.titulo}</p>
                        <p className="text-slate-700">{achado.descricao}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm py-8 text-center">Nenhum achado registrado ainda. Clique em uma região das pernas para começar a avaliar.</p>
                )}

                {/* Contador */}
                {achados.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      {achados.length} achado{achados.length !== 1 ? 's' : ''} registrado{achados.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões inferiores */}
          <div className="flex items-center gap-3 justify-end pt-4 border-t border-slate-200">
            {copiadoOk && (
              <p className="text-sm text-green-700" role="status">
                Achados copiados para a área de transferência!
              </p>
            )}
            <button
              onClick={handleResetar}
              disabled={achados.length === 0}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Resetar avaliação
            </button>
            <button
              onClick={handleCopiar}
              disabled={achados.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📋 Copiar achados
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
