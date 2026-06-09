'use client'

import { ECGPattern, ECGPlacementResult } from '@/lib/ecg/types'

interface ECGReportProps {
  pattern: ECGPattern
  validacao: ECGPlacementResult
}

export default function ECGReport({ pattern, validacao }: ECGReportProps) {
  const percentualDisplay = validacao.percentualAcerto.toFixed(0)

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200 space-y-6">
      {/* Status Técnico */}
      <div
        className={`p-4 rounded-lg border ${
          validacao.exameTecnicamenteAdequado
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">
            {validacao.exameTecnicamenteAdequado ? '✅' : '⚠️'}
          </div>
          <div>
            <p
              className={`font-semibold ${
                validacao.exameTecnicamenteAdequado
                  ? 'text-green-900'
                  : 'text-red-900'
              }`}
            >
              {validacao.exameTecnicamenteAdequado
                ? 'Exame Tecnicamente Adequado'
                : 'Exame Tecnicamente Inadequado'}
            </p>
            <p
              className={`text-sm mt-1 ${
                validacao.exameTecnicamenteAdequado
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}
            >
              {validacao.eletrodosCorretos.length}/10 eletrodos posicionados corretamente
              ({percentualDisplay}%)
            </p>
          </div>
        </div>

        {/* Mensagens técnicas */}
        {validacao.mensagensTecnicas.length > 0 && (
          <div className="mt-3 space-y-1 text-sm">
            {validacao.mensagensTecnicas.map((msg, i) => (
              <p
                key={i}
                className={
                  validacao.exameTecnicamenteAdequado
                    ? 'text-green-800'
                    : 'text-red-800'
                }
              >
                {msg}
              </p>
            ))}
          </div>
        )}

        {/* Avisos específicos */}
        {(validacao.temInversaoMembros ||
          validacao.temPosicionamentoAltoV1V2 ||
          validacao.temTrocaOuDesordemPrecordiais) && (
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-900">
            <p className="font-semibold mb-1">⚠️ Possíveis problemas detectados:</p>
            <ul className="space-y-1 ml-4">
              {validacao.temInversaoMembros && <li>• Possível inversão de RA/LA</li>}
              {validacao.temPosicionamentoAltoV1V2 && (
                <li>• Possível posicionamento alto de V1/V2</li>
              )}
              {validacao.temTrocaOuDesordemPrecordiais && (
                <li>• Possível troca ou desordem de V3-V6</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Título e Identificação */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{pattern.titulo}</h2>
        <p className="text-xs text-slate-500">Padrão: {pattern.id}</p>
      </div>

      {/* Medidas ECG */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Medidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-1">Frequência Cardíaca</p>
            <p className="text-2xl font-bold text-slate-800">{pattern.frequenciaCardiaca}</p>
            <p className="text-xs text-slate-500 mt-1">bpm</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-1">Ritmo</p>
            <p className="text-sm font-bold text-slate-800">{pattern.ritmo}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-1">Eixo</p>
            <p className="text-sm font-bold text-slate-800">{pattern.eixo}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-1">PR</p>
            <p className="text-sm font-bold text-slate-800">{pattern.pr}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-1">QRS</p>
            <p className="text-sm font-bold text-slate-800">{pattern.qrs}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-1">QTc</p>
            <p className="text-sm font-bold text-slate-800">{pattern.qtc}</p>
          </div>
        </div>
      </div>

      {/* Achados Principais */}
      {pattern.achados.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800">Achados Principais</h3>
          <div className="space-y-2">
            {pattern.achados.map((achado, i) => (
              <div key={i} className="flex gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                <span className="font-semibold text-blue-900 min-w-fit text-sm">
                  {achado.derivacao}:
                </span>
                <span className="text-blue-800 text-sm">{achado.achado}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Laudo */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Laudo ECG</h3>
        <p className="text-blue-800 leading-relaxed">{pattern.laudo}</p>
      </div>

      {/* Configurações técnicas */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded border border-slate-200 text-sm">
        <div>
          <p className="text-xs text-slate-600 font-semibold">Velocidade</p>
          <p className="text-slate-800 font-bold">25 mm/s</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 font-semibold">Amplitude</p>
          <p className="text-slate-800 font-bold">10 mm/mV</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 font-semibold">Filtro</p>
          <p className="text-slate-800 font-bold">0.05-100 Hz</p>
        </div>
      </div>

      {/* Observações Clínicas */}
      {pattern.observacoesClinicas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800">Observações Clínicas</h3>
          <ul className="space-y-2">
            {pattern.observacoesClinicas.map((obs, i) => (
              <li key={i} className="flex gap-3 text-slate-700">
                <span className="text-blue-600 font-bold shrink-0">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Eletrodos */}
      <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 text-sm">
        <h4 className="font-semibold text-slate-800">Posicionamento de Eletrodos</h4>
        {validacao.eletrodosCorretos.length > 0 && (
          <p>
            <span className="font-semibold text-green-700">✅ Corretos:</span>{' '}
            <span className="text-slate-700">{validacao.eletrodosCorretos.join(', ')}</span>
          </p>
        )}
        {validacao.eletrodosProximos.length > 0 && (
          <p>
            <span className="font-semibold text-yellow-700">⚠️ Próximos:</span>{' '}
            <span className="text-slate-700">{validacao.eletrodosProximos.join(', ')}</span>
          </p>
        )}
        {validacao.eletrodosMalPosicionados.length > 0 && (
          <p>
            <span className="font-semibold text-red-700">❌ Mal posicionados:</span>{' '}
            <span className="text-slate-700">{validacao.eletrodosMalPosicionados.join(', ')}</span>
          </p>
        )}
        {validacao.eletrodosAusentes.length > 0 && (
          <p>
            <span className="font-semibold text-slate-700">⏸️ Ausentes:</span>{' '}
            <span className="text-slate-700">{validacao.eletrodosAusentes.join(', ')}</span>
          </p>
        )}
      </div>
    </div>
  )
}
