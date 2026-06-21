'use client'

import { useState, useRef, useEffect } from 'react'
import { ECGLeadPosition, ECGLead } from '@/lib/ecg/types'
import { validarPosicionamentoECG } from '@/lib/ecg/validarEletrodos'
import { obterPadrao, PADROES_ECG } from '@/lib/ecg/padroesECG'
import { generateECG } from '@/src/services/ecgGenerator'
import { getPresetOptionsFlat, getPresetById } from '@/src/services/ecgGenerator/presets'
import { getECGExpectationForCaseTheme, getDefaultECGPresetByAgeGroup } from '@/lib/ecg/ecg-case-mapping'
import { getPatientImage, getElectrodeProfileForCase } from '@/lib/paciente/get-patient-image'
import type { RespostaGeracaoECG } from '@/src/services/ecgGenerator'
import type { ECGGerado, Caso } from '@/lib/types'
import ECGTrace from './ECGTrace'
import ECGReport from './ECGReport'

const LEADS: ECGLead[] = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'RA', 'LA', 'RL', 'LL']

interface SimuladorECGProps {
  padrao?: string
  caso?: Caso // Novo: caso clínico para usar preset esperado
  onClose?: () => void
  onECGGerado?: (ecg: ECGGerado) => void
}

export default function SimuladorECG({ padrao = 'ecg_pediatrico_normal', caso, onClose, onECGGerado }: SimuladorECGProps) {
  // Determinar preset a usar: caso esperado → fallback → padrão
  // IMPORTANTE: Usar função pura fora do render para evitar erros de inicialização
  const determineInitialPreset = (): string => {
    try {
      // 1. Se caso tem expectativa de ECG com presetId, usar esse
      if (caso?.esperadosExames?.ecg?.presetId) {
        return caso.esperadosExames.ecg.presetId
      }

      // 2. Se caso tem tema, buscar preset por tema
      if (caso?.tema) {
        try {
          const expectativa = getECGExpectationForCaseTheme(caso.tema)
          if (expectativa?.presetId) {
            return expectativa.presetId
          }
        } catch (e) {
          console.warn('[SimuladorECG] Erro ao buscar expectativa por tema:', e)
        }
      }

      // 3. Fallback por idade do paciente
      if (caso?.paciente?.dadosPediatricos?.faixaEtaria) {
        return getDefaultECGPresetByAgeGroup(caso.paciente.dadosPediatricos.faixaEtaria)
      }

      // 4. Fallback por tipo de paciente
      if (caso?.tipoPaciente === 'pediatrico' && caso?.paciente?.idade) {
        if (caso.paciente.idade < 1) return 'normal_neonato'
        if (caso.paciente.idade < 3) return 'normal_lactente'
        if (caso.paciente.idade < 6) return 'normal_pre_escolar'
        if (caso.paciente.idade < 12) return 'normal_escolar'
        return 'normal_adolescente'
      }

      // 5. Fallback final
      return padrao || 'normal_adulto'
    } catch (e) {
      console.error('[SimuladorECG] Erro ao determinar preset inicial:', e)
      return padrao || 'normal_adulto'
    }
  }

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
  const [padraoSelecionado, setPatraoSelecionado] = useState(determineInitialPreset())
  const [ecgDadosGerados, setEcgDadosGerados] = useState<RespostaGeracaoECG | null>(null)
  const [erroGerador, setErroGerador] = useState<string | null>(null)

  // Obter imagem exata do paciente (usa a mesma função do exame físico pediátrico)
  const patientImage = getPatientImage(caso)
  const electrodeProfile = getElectrodeProfileForCase(caso)

  // Debug: confirmar que está usando a mesma imagem que o exame físico
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && caso) {
      console.log('[SimuladorECG] Imagem do paciente:', patientImage.imageSrc, `(source: ${patientImage.source})`)
    }
  }, [caso, patientImage])

  const containerRef = useRef<HTMLDivElement>(null)

  // Tentar obter padrão do novo sistema primeiro, depois fallback para o antigo
  const padraoAntigo = obterPadrao(padraoSelecionado)
  const novoPreset = !padraoAntigo ? getPresetById(padraoSelecionado) : null

  // Construir pattern final garantindo que nunca é undefined
  const pattern: any = padraoAntigo || {
    id: novoPreset?.id || 'fallback',
    titulo: novoPreset?.label || 'ECG',
    descricao: novoPreset?.description || 'Eletrocardiograma',
    derivacoesComSupra: [],
    derivacoesComInfra: [],
    derivacoesComInversaoT: [],
    derivacoesComQPatologica: [],
    imagem: patientImage.imageSrc,
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
    setErroGerador(null)

    if (result.exameTecnicamenteAdequado) {
      try {
        // Obter eletrodos posicionados
        const selectedLeads = eletrodos
          .filter((el) => el.isPlaced)
          .map((el) => el.lead)

        // Gerar ECG (normalizePresetId é feita automaticamente)
        const ecgData = generateECG({
          presetId: padraoSelecionado,
          selectedLeads,
          durationSeconds: 5,
          samplingRate: 250,
        })

        // Armazenar dados gerados
        setEcgDadosGerados(ecgData)
        setEcgGerado(true)

        // Chamar callback para notificar caso clínico (se fornecido)
        if (onECGGerado) {
          const ecgGerado: ECGGerado = {
            tipo: 'ECG',
            nome: 'Eletrocardiograma de 12 derivações',
            dataHora: new Date().toISOString(),
            presetId: padraoSelecionado,
            padraoSelecionado,
            selectedLeads,
            resultado: ecgData,
            interpretacao: ecgData.interpretation,
            pontosEnsino: ecgData.teachingPoints,
            aviso: ecgData.metadata?.avisoEducacional || 'Traçado sintético gerado para fins educacionais. Não utilizar para diagnóstico clínico real.',
            metadata: ecgData.metadata,
          }
          onECGGerado(ecgGerado)
        }
      } catch (erro) {
        const mensagem = erro instanceof Error ? erro.message : 'Erro ao gerar ECG'
        setErroGerador(mensagem)
        console.error('[SimuladorECG] Erro ao gerar ECG:', erro)
        setEcgGerado(false)
      }
    }
  }

  function resetarSimulador() {
    setEletrodos((prev) => prev.map((el) => ({ ...el, x: 0, y: 0, isPlaced: false })))
    setValidacao(null)
    setEcgGerado(false)
    setEcgDadosGerados(null)
    setErroGerador(null)
  }

  // Determinar cores dos eletrodos baseado no tipo
  function getCorEletrodo(id: string, isPlaced: boolean) {
    // RA: vermelho
    if (id === 'RA') {
      if (isPlaced) {
        return 'bg-red-300 border-red-500 text-red-900'
      }
      return 'bg-red-100 border border-red-400 text-red-700 hover:bg-red-200'
    }

    // LA: amarelo
    if (id === 'LA') {
      if (isPlaced) {
        return 'bg-yellow-300 border-yellow-500 text-yellow-900'
      }
      return 'bg-yellow-100 border border-yellow-400 text-yellow-900 hover:bg-yellow-200'
    }

    // RL: preto
    if (id === 'RL') {
      if (isPlaced) {
        return 'bg-slate-800 border-slate-900 text-white'
      }
      return 'bg-slate-900 border border-slate-950 text-white hover:bg-slate-800'
    }

    // LL: verde
    if (id === 'LL') {
      if (isPlaced) {
        return 'bg-green-300 border-green-500 text-green-900'
      }
      return 'bg-green-100 border border-green-400 text-green-700 hover:bg-green-200'
    }

    // Precordiais: vermelho (padrão)
    if (isPlaced) {
      return 'bg-green-100 border border-green-400 text-green-800'
    }
    return 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200'
  }

  // Determinar cores dos eletrodos posicionados no boneco
  function getCorEletrodoPosicionado(id: string) {
    // RA: vermelho
    if (id === 'RA') {
      return 'bg-red-500 border-red-700'
    }

    // LA: amarelo
    if (id === 'LA') {
      return 'bg-yellow-400 border-yellow-600'
    }

    // RL: preto
    if (id === 'RL') {
      return 'bg-slate-950 border-slate-950'
    }

    // LL: verde
    if (id === 'LL') {
      return 'bg-green-500 border-green-700'
    }

    // Precordiais: vermelho
    return 'bg-red-500 border-red-700'
  }

  const eletrodosColocados = eletrodos.filter((e) => e.isPlaced).length

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
              {getPresetOptionsFlat().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
                  {/* Imagem do paciente — idêntica ao exame físico */}
                  <img
                    src={patientImage.imageSrc}
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
                      const bgColor = getCorEletrodoPosicionado(el.lead)
                      let textColor = 'text-white'
                      if (el.lead === 'LA') {
                        textColor = 'text-yellow-900'
                      } else if (el.lead === 'LL') {
                        textColor = 'text-green-900'
                      }

                      return (
                        <div
                          key={el.lead}
                          style={{
                            position: 'absolute',
                            left: `${el.x}%`,
                            top: `${el.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className={`w-7 h-7 ${bgColor} rounded-full border-2 flex items-center justify-center ${textColor} text-[10px] font-bold cursor-move hover:scale-110 transition-transform shadow-lg z-10`}
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
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span> Membros
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
                        className={`p-2 rounded text-xs font-bold text-center cursor-move transition-all ${getCorEletrodo(lead, isPlaced || false)}`}
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

              {/* Erro ao gerar ECG */}
              {erroGerador && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-800 font-semibold">Erro ao gerar ECG:</p>
                  <p className="text-red-700 text-sm">{erroGerador}</p>
                </div>
              )}

              {/* Aviso educacional */}
              {ecgGerado && ecgDadosGerados && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-amber-800 font-semibold text-sm">⚠️ {ecgDadosGerados.metadata.avisoEducacional}</p>
                </div>
              )}

              {/* Traçado e interpretação gerados */}
              {ecgGerado && ecgDadosGerados && (
                <div className="space-y-4">
                  <ECGTrace
                    pattern={pattern}
                    ecgData={ecgDadosGerados}
                  />

                  {/* Interpretação */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <h4 className="font-bold text-blue-900">📊 Interpretação Automática</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-semibold">FC (bpm)</p>
                        <p className="text-blue-900 text-lg">{ecgDadosGerados.interpretation.frequenciaCardiaca}</p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-semibold">Ritmo</p>
                        <p className="text-blue-900">{ecgDadosGerados.interpretation.ritmo}</p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-semibold">Eixo (°)</p>
                        <p className="text-blue-900">{ecgDadosGerados.interpretation.eixoMedio}°</p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-semibold">QTc (ms)</p>
                        <p className="text-blue-900">{ecgDadosGerados.interpretation.duracaoQTc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pontos de ensino */}
                  {ecgDadosGerados.teachingPoints.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-bold text-green-900">📚 Pontos de Ensino</h4>
                      <ul className="text-sm text-green-900 space-y-1">
                        {ecgDadosGerados.teachingPoints.map((ponto, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span>
                            <span>{ponto}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Referências científicas */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">🔬 Referências</h4>
                    <p className="text-slate-700 text-xs">Fonte: {ecgDadosGerados.metadata.fontePrincipal}</p>
                    <div className="text-xs text-slate-600 space-y-1">
                      {ecgDadosGerados.metadata.referências.map((ref, idx) => (
                        <p key={idx} className="italic">{ref}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
