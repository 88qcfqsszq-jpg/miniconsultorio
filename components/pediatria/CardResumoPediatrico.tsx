'use client';

import { Caso } from '@/lib/types';

interface CardResumoPediatricoProps {
  caso: Caso;
}

export default function CardResumoPediatrico({ caso }: CardResumoPediatricoProps) {
  // Renderizar apenas se for caso pediátrico
  if (!caso.tipoPaciente || caso.tipoPaciente !== 'pediatrico' || !caso.paciente.dadosPediatricos) {
    return null;
  }

  const dados = caso.paciente.dadosPediatricos;
  const paciente = caso.paciente;

  // Traduzir faixa etária de forma amigável
  const faixaEtariaLabel = {
    neonato: 'Neonato',
    lactente: 'Lactente',
    pre_escolar: 'Pré-escolar',
    escolar: 'Escolar',
    adolescente: 'Adolescente',
  }[dados.faixaEtaria] || 'Pediátrico';

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-5 space-y-4">
      {/* Badge e Título */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
            👶 OSCE Pediátrico
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {paciente.nome}, {paciente.idade}
            {dados.idadeMeses ? ` meses` : ` anos`}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Faixa etária: <span className="font-semibold text-slate-700">{faixaEtariaLabel}</span>
          </p>
        </div>
      </div>

      {/* Responsável */}
      <div className="bg-white rounded-lg p-3 space-y-1 border border-blue-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Responsável</p>
        <p className="text-sm font-semibold text-slate-800">
          {dados.responsavel.nome}
          <span className="text-slate-600 font-normal ml-1">({dados.responsavel.parentesco})</span>
        </p>
      </div>

      {/* Queixa Principal */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Queixa Principal</p>
        <p className="text-sm text-slate-700 bg-white rounded-lg p-3 border border-blue-100">
          {paciente.queixaPrincipal}
        </p>
      </div>

      {/* Dados Rápidos */}
      <div className="grid grid-cols-2 gap-2">
        {dados.peso && (
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Peso</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{dados.peso}</p>
          </div>
        )}

        {dados.estatura && (
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {dados.idadeMeses ? 'Comprimento' : 'Estatura'}
            </p>
            <p className="text-sm font-bold text-slate-700 mt-1">{dados.estatura}</p>
          </div>
        )}

        {dados.perimetroCefalico && dados.idadeMeses && (
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">PC</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{dados.perimetroCefalico}</p>
          </div>
        )}

        {dados.estadoVacinal && (
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vacinação</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{dados.estadoVacinal}</p>
          </div>
        )}
      </div>

      {/* Aviso sobre consulta pediátrica */}
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
        <p className="text-xs text-blue-900 leading-relaxed">
          <span className="font-semibold">💡 Dica:</span> Na consulta pediátrica, parte da anamnese pode ser respondida pelo responsável.
          Adapte sua linguagem à idade da criança.
        </p>
      </div>

      {/* Interlocutor Principal */}
      <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-3">
        <p className="text-xs text-indigo-900">
          <span className="font-semibold">👤 Interlocutor principal:</span>{' '}
          {dados.faixaEtaria === 'lactente' || dados.faixaEtaria === 'neonato' || (dados.faixaEtaria === 'pre_escolar' && paciente.idade < 4)
            ? 'responsável'
            : 'criança + responsável'}
        </p>
      </div>
    </div>
  );
}
