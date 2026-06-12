'use client';

import { Caso } from '@/lib/types';

interface IndicadorInterlocutorPediatricoProps {
  caso: Caso;
}

export default function IndicadorInterlocutorPediatrico({ caso }: IndicadorInterlocutorPediatricoProps) {
  // Renderizar apenas se for caso pediátrico
  if (!caso.tipoPaciente || caso.tipoPaciente !== 'pediatrico' || !caso.paciente.dadosPediatricos) {
    return null;
  }

  const dados = caso.paciente.dadosPediatricos;
  const paciente = caso.paciente;

  // Determinar interlocutor baseado na faixa etária
  const ehLactente = dados.faixaEtaria === 'lactente' || dados.faixaEtaria === 'neonato';
  const ehPequenoPreescolar = dados.faixaEtaria === 'pre_escolar' && paciente.idade < 4;
  const responderaMajoritariamente = ehLactente || ehPequenoPreescolar;

  const interlocutorLabel = responderaMajoritariamente
    ? `Interlocutor: ${dados.responsavel.parentesco}`
    : 'Interlocutores: criança + responsável';

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded px-4 py-3 mb-4">
      <p className="text-xs text-blue-900">
        <span className="font-semibold">👤</span> <span className="font-semibold">{interlocutorLabel}</span>
      </p>
      {responderaMajoritariamente && (
        <p className="text-xs text-blue-800 mt-1">
          O(a) {dados.responsavel.parentesco} responderá principalmente às perguntas.
        </p>
      )}
      {!responderaMajoritariamente && (
        <p className="text-xs text-blue-800 mt-1">
          A criança pode responder perguntas simples; o(a) {dados.responsavel.parentesco} complementa.
        </p>
      )}
    </div>
  );
}
