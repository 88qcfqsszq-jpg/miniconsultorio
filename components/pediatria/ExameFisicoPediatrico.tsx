'use client';

import { useState, useCallback } from 'react';
import {
  ACOES_EXAME_FISICO_PEDIATRICO,
  SISTEMAS_LABELS,
  obterAcoesPorSistema,
  obterSistemas,
  SistemaPediatrico,
} from '@/lib/pediatria/acoes-exame-fisico';
import {
  obterAchadoExameFisicoPed,
  converterAchadoParaSistema,
} from '@/lib/pediatria/achados-exame-fisico';
import { montarManobraExameFisico, sistemaParaCategoria } from '@/lib/osce/physical-exam-mapper';
import ProcedimentosPediatricos from './ProcedimentosPediatricos';
import ExameFisicoPediatricoVisual from './ExameFisicoPediatricoVisual';
import ExameFisicoPediatricoDefinitivo from './ExameFisicoPediatricoDefinitivo';
import { Caso } from '@/lib/types';
import { AchadoExamePediatrico } from '@/lib/pediatria/exame-fisico-pediatrico-banco';

interface ExameFisicoPediatricoProps {
  caso: Caso;
  onAchadoEncontrado: (achado: any) => void;
  achadosEncontrados: any[];
  onFechar: () => void;
}

export default function ExameFisicoPediatrico({
  caso,
  onAchadoEncontrado,
  achadosEncontrados,
  onFechar,
}: ExameFisicoPediatricoProps) {
  const [abaAtiva, setAbaAtiva] = useState<'visual' | 'sistemas' | 'procedimentos'>('visual');
  const [sistemaAtivo, setSistemaAtivo] = useState<SistemaPediatrico>('geral');
  const [erro, setErro] = useState<string | null>(null);

  const sistemas = obterSistemas();
  const acoesAtivas = obterAcoesPorSistema(sistemaAtivo);

  const acaoJaRealizada = useCallback((acaoId: string): boolean => {
    return achadosEncontrados.some((achado) =>
      achado.acaoRealizada?.includes(ACOES_EXAME_FISICO_PEDIATRICO.find(a => a.id === acaoId)?.titulo || '')
    );
  }, [achadosEncontrados]);

  const handleRealizarAcao = useCallback((acaoId: string) => {
    setErro(null);
    const acao = ACOES_EXAME_FISICO_PEDIATRICO.find((a) => a.id === acaoId);
    const titulo = acao?.titulo || acaoId;
    const sistema = acao?.sistema;
    // Toda manobra realizada É registrada: com achado quando existir, ou como
    // "exame realizado sem achado relevante" quando o caso não configurar um.
    const achadoBruto = obterAchadoExameFisicoPed(caso.id, acaoId, caso);
    const achadoConvertido = achadoBruto ? converterAchadoParaSistema(achadoBruto) : null;
    const manobra = montarManobraExameFisico({
      acaoId,
      titulo,
      sistema,
      achado: achadoConvertido
        ? { ...achadoConvertido, normal: (achadoBruto as any)?.normal === true }
        : null,
    });
    onAchadoEncontrado(manobra);
  }, [caso, onAchadoEncontrado]);

  const handleRegistrarAchadoDefinitivo = useCallback((achado: AchadoExamePediatrico) => {
    setErro(null);
    // Converter achado do novo formato para formato esperado pelo sistema
    const achadoGeral = {
      id: achado.id,
      titulo: achado.titulo,
      descricao: achado.descricao,
      acaoRealizada: achado.titulo,
      // Categoria padrão (lida pelo relatório/evidence-mapper). Mantemos a
      // origem visual em `origem`/`regiao`.
      categoria: sistemaParaCategoria(achado.sistemaClinico || achado.regiaoId),
      casoId: achado.casoId,
      origem: achado.origem,
      regiao: achado.regiaoId,
      sistema: 'pediatria',
      normal: achado.normal,
      campo_original: achado.campo_original,
      sistemaClinico: achado.sistemaClinico,
      // Campos padrão para relatório/feedback:
      textDigitado: achado.titulo,
      resposta: achado.descricao,
    };
    onAchadoEncontrado(achadoGeral);
  }, [onAchadoEncontrado]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold">Exame Físico Pediátrico</h2>
            <p className="text-sm text-emerald-100 mt-1">
              Avaliação sistematizada da criança conforme faixa etária e queixa clínica
            </p>
          </div>
          <button
            onClick={onFechar}
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
        </div>

        {/* Abas */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 flex gap-4 sticky top-0 z-20">
          <button
            onClick={() => setAbaAtiva('visual')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              abaAtiva === 'visual'
                ? 'border-sky-500 text-sky-700'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            🖼️ Visual
          </button>
          <button
            onClick={() => setAbaAtiva('sistemas')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              abaAtiva === 'sistemas'
                ? 'border-emerald-500 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            🔍 Sistemas
          </button>
          <button
            onClick={() => setAbaAtiva('procedimentos')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              abaAtiva === 'procedimentos'
                ? 'border-purple-500 text-purple-700'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            📋 Procedimentos
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden">
          {/* ABA VISUAL - NOVO COMPONENTE */}
          {abaAtiva === 'visual' && (
            <ExameFisicoPediatricoDefinitivo
              caso={caso}
              onRegistrarAchado={handleRegistrarAchadoDefinitivo}
              onFechar={onFechar}
            />
          )}

          {/* ABA SISTEMAS */}
          {abaAtiva === 'sistemas' && (
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Coluna 1: Lista de Sistemas */}
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm mb-3">Sistemas</h3>
                  {sistemas.map((sistema) => (
                    <button
                      key={sistema}
                      onClick={() => setSistemaAtivo(sistema)}
                      className={`w-full text-left p-3 rounded-lg transition-all font-semibold text-sm ${
                        sistemaAtivo === sistema
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {SISTEMAS_LABELS[sistema]}
                    </button>
                  ))}
                </div>

                {/* Coluna 2: Ações */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">
                    {SISTEMAS_LABELS[sistemaAtivo]}
                  </h3>

                  {erro && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                      ⚠️ {erro}
                    </div>
                  )}

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {acoesAtivas.length > 0 ? (
                      acoesAtivas.map((acao) => {
                        const jaRealizada = acaoJaRealizada(acao.id);
                        return (
                          <button
                            key={acao.id}
                            onClick={() => handleRealizarAcao(acao.id)}
                            disabled={jaRealizada}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              jaRealizada
                                ? 'bg-emerald-50 border-emerald-300 opacity-50 cursor-default'
                                : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 border-emerald-300 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg shrink-0 mt-0.5">{acao.icone || '🔍'}</span>
                              <div className="flex-grow">
                                <p className="font-semibold text-slate-800 text-sm">{acao.titulo}</p>
                                <p className="text-xs text-slate-600 mt-1">{acao.descricao}</p>
                              </div>
                              {jaRealizada && (
                                <span className="text-xs font-bold text-emerald-600 shrink-0 mt-1">✓</span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-slate-500 text-sm text-center py-4">
                        Nenhuma ação disponível.
                      </p>
                    )}
                  </div>
                </div>

                {/* Coluna 3: Achados */}
                <div className="lg:col-span-1 bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3 flex flex-col">
                  <h3 className="font-bold text-slate-800 text-sm">Achados</h3>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {achadosEncontrados.filter((a) => a.categoria === 'exame_fisico').length > 0 ? (
                      achadosEncontrados
                        .filter((a) => a.categoria === 'exame_fisico')
                        .map((achado, idx) => (
                          <div key={`${achado.id}-${idx}`} className="p-2 rounded border border-emerald-200 bg-white text-xs space-y-1">
                            <p className="font-semibold text-slate-800">{achado.titulo}</p>
                            <p className="text-slate-600 text-xs leading-tight">{achado.descricao}</p>
                          </div>
                        ))
                    ) : (
                      <p className="text-slate-500 text-xs text-center py-4">
                        Nenhum achado registrado.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA PROCEDIMENTOS */}
          {abaAtiva === 'procedimentos' && (
            <div className="p-6 overflow-y-auto h-full">
              <ProcedimentosPediatricos
                caso={caso}
                onAchadoEncontrado={onAchadoEncontrado}
                achadosEncontrados={achadosEncontrados}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
