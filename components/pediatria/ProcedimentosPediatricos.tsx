'use client';

import { useState, useCallback } from 'react';
import {
  PROCEDIMENTOS_PEDIATRICOS,
  obterProcedimento,
  obterProcedimentosPrincipais,
  gerarAchadoProcedimento,
  converterAchadoProcedimento,
  ProcedimentoPediatricoId,
} from '@/lib/pediatria/procedimentos';
import { Caso } from '@/lib/types';

interface ProcedimentosPediatricosProps {
  caso: Caso;
  onAchadoEncontrado: (achado: any) => void;
  achadosEncontrados: any[];
}

export default function ProcedimentosPediatricos({
  caso,
  onAchadoEncontrado,
  achadosEncontrados,
}: ProcedimentosPediatricosProps) {
  const [procedimentoExpandido, setProcedimentoExpandido] = useState<ProcedimentoPediatricoId | null>(null);
  const [procedimentoEmExecucao, setProcedimentoEmExecucao] = useState<ProcedimentoPediatricoId | null>(null);

  const procedimentosPrincipais = obterProcedimentosPrincipais();

  // Verificar se um procedimento já foi realizado
  const procedimentoJaRealizado = useCallback((procedimentoId: ProcedimentoPediatricoId): boolean => {
    const procedimento = obterProcedimento(procedimentoId);
    if (!procedimento) return false;

    return achadosEncontrados.some((achado) =>
      achado.acaoRealizada?.includes(procedimento.titulo)
    );
  }, [achadosEncontrados]);

  // Executar procedimento
  const handleExecutarProcedimento = useCallback((procedimentoId: ProcedimentoPediatricoId) => {
    const procedimento = obterProcedimento(procedimentoId);
    if (!procedimento) return;

    // Gerar achado bruto
    const descricaoAchado = gerarAchadoProcedimento(procedimentoId, caso);

    // Converter para formato geral
    const achadoGeral = converterAchadoProcedimento(procedimentoId, descricaoAchado);

    if (achadoGeral) {
      // Registrar achado
      onAchadoEncontrado(achadoGeral);

      // Limpar estado
      setProcedimentoEmExecucao(null);
    }
  }, [caso, onAchadoEncontrado]);

  // Alternar expansão de procedimento
  const handleToggleExpandir = useCallback((procedimentoId: ProcedimentoPediatricoId) => {
    setProcedimentoExpandido(procedimentoExpandido === procedimentoId ? null : procedimentoId);
  }, [procedimentoExpandido]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 bg-purple-50 p-3 rounded-lg border border-purple-200">
        📋 Procedimentos técnicos de OSCE pediátrico. Execute cada procedimento conforme a faixa etária do paciente.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {procedimentosPrincipais.map((procedimento) => {
          const jaRealizado = procedimentoJaRealizado(procedimento.id as ProcedimentoPediatricoId);
          const expandido = procedimentoExpandido === procedimento.id;

          return (
            <div
              key={procedimento.id}
              className={`rounded-lg border transition-all ${
                jaRealizado
                  ? 'bg-purple-50 border-purple-300 opacity-60'
                  : 'bg-white border-slate-200 hover:border-purple-300'
              }`}
            >
              {/* Header do card */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 text-sm">{procedimento.titulo}</h4>
                    <p className="text-xs text-slate-600 mt-1">{procedimento.descricao}</p>
                    {procedimento.faixaEtariaIndicada && (
                      <p className="text-xs text-purple-600 mt-2 italic">
                        ℹ️ {procedimento.faixaEtariaIndicada}
                      </p>
                    )}
                  </div>
                  {jaRealizado && <span className="text-sm font-bold text-purple-600 shrink-0">✓</span>}
                </div>

                {/* Botões */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleToggleExpandir(procedimento.id as ProcedimentoPediatricoId)}
                    className="flex-1 px-2 py-1.5 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                  >
                    {expandido ? 'Ocultar' : 'Ver'} passos
                  </button>
                  <button
                    onClick={() => handleExecutarProcedimento(procedimento.id as ProcedimentoPediatricoId)}
                    disabled={jaRealizado}
                    className={`flex-1 px-2 py-1.5 text-xs rounded font-semibold transition-colors ${
                      jaRealizado
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    Executar
                  </button>
                </div>
              </div>

              {/* Passos (expandível) */}
              {expandido && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-200 space-y-2">
                  {procedimento.passos.map((passo) => (
                    <div key={passo.numero} className="flex gap-2 text-xs">
                      <span className="font-bold text-purple-600 shrink-0">{passo.numero}.</span>
                      <span className="text-slate-700">{passo.descricao}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensagem se nenhum procedimento ainda */}
      {procedimentosPrincipais.length === 0 && (
        <p className="text-slate-500 text-center text-sm py-4">Nenhum procedimento disponível para esta faixa etária.</p>
      )}

      {/* Contador */}
      {achadosEncontrados.filter((a) => a.categoria === 'procedimento_pediatrico').length > 0 && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700">
          <strong>{achadosEncontrados.filter((a) => a.categoria === 'procedimento_pediatrico').length}</strong> procedimento
          {achadosEncontrados.filter((a) => a.categoria === 'procedimento_pediatrico').length !== 1 ? 's' : ''} realizado
          {achadosEncontrados.filter((a) => a.categoria === 'procedimento_pediatrico').length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
