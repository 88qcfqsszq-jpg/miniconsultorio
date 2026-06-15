'use client';

import { useState, useCallback, useEffect } from 'react';
import PacientePediatricoVisualAjustado from './PacientePediatricoVisualAjustado';
import {
  obterRegioesPediatricas,
  RegiaoPediatricaId,
} from '@/lib/pediatria/regioes-exame-ajustadas';
import { type AcaoPediatricaId } from '@/lib/pediatria/regioes-exame';
import {
  obterAchadoVisualPediatrico,
  obterAchadoVisualPediatricoComFallback,
  converterAchadoVisualParaSistema,
} from '@/lib/pediatria/achados-visual';
import { Caso } from '@/lib/types';
import { LACTENTE_REGIONS, DROP_ZONES, PlacedRegion } from '@/lib/pediatria/lactente-drop-zones';

interface ExameFisicoPediatricoVisualProps {
  caso: Caso;
  onAchadoEncontrado: (achado: any) => void;
  achadosEncontrados: any[];
  onFechar: () => void;
}

// Mapeamento de IDs de ações para rótulos
const ACOES_LABELS: Record<string, { label: string; descricao: string }> = {
  perimetro_cefalico: { label: "Medir perímetro cefálico", descricao: "Técnica com fita métrica" },
  fontanela: { label: "Avaliar fontanela", descricao: "Avaliar se lactente" },
  formato_craniano: { label: "Formato craniano", descricao: "Verificar simetria" },
  cianose_central: { label: "Cianose central", descricao: "Verificar lábios e língua" },
  palidez_conjuntival: { label: "Palidez conjuntival", descricao: "Avaliar coloração das conjuntivas" },
  sinais_desidratacao: { label: "Sinais de desidratação", descricao: "Verificar olhos fundos" },
  mucosa_oral: { label: "Mucosa oral", descricao: "Inspecionar boca" },
  hiperemia_orofaringe: { label: "Hiperemia de orofaringe", descricao: "Verificar avermelhamento" },
  lesoes_orais: { label: "Lesões orais", descricao: "Verificar aftas" },
  linfonodos_cervicais: { label: "Linfonodos cervicais", descricao: "Palpar pescoço" },
  descricao_linfonodos: { label: "Descrever linfonodos", descricao: "Tamanho, consistência, mobilidade" },
  rigidez_nuca: { label: "Rigidez de nuca", descricao: "Se indicado, avaliar" },
  frequencia_respiratoria: { label: "Frequência respiratória", descricao: "Contar por 1 minuto" },
  tiragens: { label: "Tiragens", descricao: "Verificar intercostais, subcostais" },
  batimento_asa_nasal: { label: "Batimento de asa nasal", descricao: "Sinal de desconforto respiratório" },
  expansibilidade: { label: "Expansibilidade torácica", descricao: "Simetria de movimento" },
  ausculta_pulmonar: { label: "Ausculta pulmonar", descricao: "Verificar sons respiratórios" },
  ausculta_focos: { label: "Ausculta de focos cardíacos", descricao: "Avaliar bulhas" },
  sopro: { label: "Sopro cardíaco", descricao: "Verificar presença de sopro" },
  ritmo_cardiaco: { label: "Ritmo cardíaco", descricao: "Regular ou irregular" },
  cianose_cardiaca: { label: "Cianose associada", descricao: "Avaliar cianose ao examinar coração" },
  inspecao_abdome: { label: "Inspeção abdominal", descricao: "Observar forma e simetria" },
  palpacao_abdome: { label: "Palpação abdominal", descricao: "Avaliar dor e consistência" },
  dor_abdominal: { label: "Dor abdominal", descricao: "Verificar dor à palpação" },
  distensao: { label: "Distensão abdominal", descricao: "Verificar abdominal inchado" },
  palpacao_figado: { label: "Palpação hepática", descricao: "Palpar fígado" },
  hepatomegalia: { label: "Hepatomegalia", descricao: "Fígado aumentado" },
  sensibilidade_hipocondrio_d: { label: "Sensibilidade hipocondrial D", descricao: "Dor ao palpar fígado" },
  palpacao_baco: { label: "Palpação esplênica", descricao: "Palpar baço" },
  esplenomegalia: { label: "Esplenomegalia", descricao: "Baço aumentado" },
  pulsos_perifericos: { label: "Pulsos periféricos", descricao: "Radial, femoral, etc" },
  tempo_enchimento_capilar: { label: "TEC (tempo enchimento capilar)", descricao: "Pressionar e soltar dedo" },
  extremidades_frias: { label: "Extremidades frias", descricao: "Avaliar temperatura" },
  edema: { label: "Edema em membros", descricao: "Verificar inchaço" },
  petequias_equimoses_membros: { label: "Petéquias/equimoses", descricao: "Verificar manchas e roxos" },
  palidez: { label: "Avaliar palidez", descricao: "Verificar coloração de pele e mucosas" },
  cianose: { label: "Avaliar cianose", descricao: "Verificar coloração azulada" },
  hidratacao_mucosas: { label: "Hidratação de mucosas", descricao: "Avaliar umidade da boca" },
  exantema: { label: "Avaliar exantema", descricao: "Verificar rash/erupção" },
  petequias: { label: "Avaliar petéquias", descricao: "Verificar manchas avermelhadas" },
  equimoses: { label: "Avaliar equimoses", descricao: "Verificar roxos/hematomas" },
  marcos_desenvolvimento: { label: "Marcos do desenvolvimento", descricao: "Conforme faixa etária" },
  postura: { label: "Postura", descricao: "Observar posicionamento" },
  resposta_social: { label: "Resposta social", descricao: "Sorrir, contato visual" },
  fala_interacao: { label: "Fala e interação", descricao: "Linguagem conforme idade" },
  estado_geral: { label: "Avaliar estado geral", descricao: "Observar nível de consciência" },
  nivel_atividade: { label: "Avaliar nível de atividade", descricao: "Observar reatividade" },
  irritabilidade: { label: "Avaliar irritabilidade", descricao: "Verificar choro exagerado" },
  interacao_responsavel: { label: "Interação com responsável", descricao: "Observar contato visual" },
};

function obterLabelAcao(acaoId: string): string {
  return ACOES_LABELS[acaoId]?.label || acaoId;
}

function obterDescricaoAcao(acaoId: string): string {
  return ACOES_LABELS[acaoId]?.descricao || '';
}

export default function ExameFisicoPediatricoVisual({
  caso,
  onAchadoEncontrado,
  achadosEncontrados,
  onFechar,
}: ExameFisicoPediatricoVisualProps) {
  const [regioSelecionada, setRegioSelecionada] = useState<RegiaoPediatricaId | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [draggedRegion, setDraggedRegion] = useState<string | null>(null);
  const [placedRegions, setPlacedRegions] = useState<PlacedRegion[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const regioesAjustadas = obterRegioesPediatricas(caso.paciente.dadosPediatricos?.faixaEtaria);
  const regiao = regioSelecionada ? regioesAjustadas.find((r) => r.id === regioSelecionada) : null;

  // Inicializar hotspots com as regiões ajustadas (coordenadas padrão)
  useEffect(() => {
    const initialPlacedRegions: PlacedRegion[] = regioesAjustadas.map((r) => ({
      id: r.id,
      label: r.label,
      targetZone: r.targetZone || '',
      x: r.coordenadas.x + r.coordenadas.width / 2,
      y: r.coordenadas.y + r.coordenadas.height / 2,
    }));
    setPlacedRegions(initialPlacedRegions);
  }, [caso.id]);

  // Converter ações em acoes pediátricas
  const acoes = regiao
    ? regiao.acoes.map((acaoId) => {
        return {
          id: acaoId,
          label: obterLabelAcao(acaoId),
          descricao: obterDescricaoAcao(acaoId),
        };
      })
    : [];

  // Verificar se uma ação já foi realizada
  const acaoJaRealizada = useCallback(
    (acaoId: string): boolean => {
      return achadosEncontrados.some(
        (achado) =>
          achado.categoria === 'exame_fisico_visual' &&
          achado.acaoRealizada &&
          achado.id.includes(acaoId)
      );
    },
    [achadosEncontrados]
  );

  // Executar ação
  const handleRealizarAcao = useCallback(
    (acaoId: string) => {
      setErro(null);

      // Obter achado específico do caso (com fallback)
      const achado = obterAchadoVisualPediatricoComFallback(
        caso.id,
        acaoId as AcaoPediatricaId,
        caso
      );

      if (!achado) {
        setErro('Achado não disponível para este caso ainda.');
        return;
      }

      // Converter para formato geral (preserva casoId)
      const achadoGeral = converterAchadoVisualParaSistema(achado);

      // Registrar achado (agora com casoId incluído)
      onAchadoEncontrado(achadoGeral);
    },
    [caso, onAchadoEncontrado]
  );

  // Handlers para drag-and-drop com hotspots dinâmicos
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, regionId: string) => {
    setDraggedRegion(regionId);
    e.dataTransfer.effectAllowed = 'move';
    setFeedback(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedRegion(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedRegion) return;

    // Encontrar a região arrastada
    const region = LACTENTE_REGIONS.find((r) => r.id === draggedRegion);
    if (!region) {
      setDraggedRegion(null);
      return;
    }

    // Obter as coordenadas do drop
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Verificar se caiu em uma zona válida
    const targetZone = region.targetZone;
    const zone = DROP_ZONES[targetZone];

    if (!zone) {
      setFeedback(`Zona de drop não configurada para "${region.label}"`);
      setDraggedRegion(null);
      return;
    }

    // Validar se o drop está dentro da zona
    const isInZone =
      x >= zone.left &&
      x <= zone.left + zone.width &&
      y >= zone.top &&
      y <= zone.top + zone.height;

    if (!isInZone) {
      setFeedback('Posicione a região no local anatômico correspondente.');
      setDraggedRegion(null);
      return;
    }

    // Drop válido: adicionar região posicionada
    setPlacedRegions((prev) => [
      ...prev.filter((item) => item.id !== region.id),
      {
        id: region.id,
        label: region.label,
        targetZone: region.targetZone,
        x,
        y,
      },
    ]);

    // Selecionar região e abrir ações
    setRegioSelecionada(region.id as RegiaoPediatricaId);
    setFeedback(null);
    setDraggedRegion(null);
  }, [draggedRegion]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl w-[95vw] h-[95vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Exame Físico Pediátrico Visual</h2>
            <p className="text-sm text-sky-100 mt-1">
              Avaliação sistematizada com imagem interativa
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

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-[1.5fr_280px_1fr_280px] gap-6 h-full">
            {/* Coluna 1: Imagem com Hotspots Dinâmicos */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-visible relative flex flex-col" onDragOver={handleDragOver} onDrop={handleDrop}>
              <PacientePediatricoVisualAjustado
                faixaEtaria={caso.paciente.dadosPediatricos?.faixaEtaria}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />

              {/* Hotspots Dinâmicos - criados após posicionamento correto */}
              {placedRegions.map((placedRegion) => (
                <button
                  key={placedRegion.id}
                  className={`absolute z-20 rounded-lg text-xs px-2 py-1 font-medium shadow cursor-pointer transition-all ${
                    regioSelecionada === placedRegion.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-300 text-slate-800 hover:bg-slate-400'
                  }`}
                  style={{
                    left: `${placedRegion.x}%`,
                    top: `${placedRegion.y}%`,
                    transform: 'translate(-50%, -50%)',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => setRegioSelecionada(placedRegion.id as RegiaoPediatricaId)}
                  title={`Clique para abrir ações de ${placedRegion.label}`}
                >
                  {placedRegion.label.split(' / ')[0]}
                </button>
              ))}
            </div>

            {/* Coluna 2: Lista de Regiões do Exame */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3 flex flex-col overflow-y-auto min-h-0">
              <h3 className="font-bold text-slate-800 text-sm">Regiões do exame</h3>
              <p className="text-xs text-slate-500">
                {caso.paciente.dadosPediatricos?.faixaEtaria === 'lactente' ||
                caso.paciente.dadosPediatricos?.faixaEtaria === 'neonato'
                  ? 'Arraste para o corpo correto'
                  : 'Clique para selecionar'}
              </p>
              {feedback && (
                <div className="text-xs bg-orange-50 text-orange-700 px-3 py-2 rounded border border-orange-200">
                  ⚠️ {feedback}
                </div>
              )}
              <div className="flex-1 overflow-y-auto space-y-2">
                {regioesAjustadas.map((r) => {
                  const isPlaced = placedRegions.some((pr) => pr.id === r.id);
                  const isLactente = caso.paciente.dadosPediatricos?.faixaEtaria === 'lactente' ||
                                     caso.paciente.dadosPediatricos?.faixaEtaria === 'neonato';
                  const lactenteregiao = LACTENTE_REGIONS.find((lr) => lr.id === r.id);

                  return (
                    <div
                      key={r.id}
                      draggable={isLactente && !!lactenteregiao}
                      onDragStart={(e) => isLactente && lactenteregiao && handleDragStart(e, r.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setRegioSelecionada(r.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-sm font-medium select-none ${
                        isLactente && !!lactenteregiao ? 'cursor-move' : 'cursor-pointer'
                      } ${
                        draggedRegion === r.id
                          ? 'opacity-50 bg-amber-100 border-amber-500'
                          : regioSelecionada === r.id
                            ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-md'
                            : isPlaced
                              ? 'bg-green-100 border-green-500 opacity-75'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPlaced && <span className="text-green-600 font-bold text-lg">✓</span>}
                        {regioSelecionada === r.id && !isPlaced && <span className="text-blue-600 font-bold text-lg">→</span>}
                        <span>{r.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coluna 3: Ações e Detalhes da Região */}
            <div className="space-y-4 overflow-y-auto min-h-0">
              {regiao ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-slate-800 text-lg">{regiao.label}</h3>
                    <p className="text-sm text-slate-600 mt-1">{regiao.descricao}</p>
                  </div>

                  {erro && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      ⚠️ {erro}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 text-sm">Ações disponíveis:</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {acoes.length > 0 ? (
                        acoes.map((acao) => {
                          const jaRealizada = acaoJaRealizada(acao.id as string);
                          return (
                            <button
                              key={acao.id}
                              onClick={() => handleRealizarAcao(acao.id as string)}
                              disabled={jaRealizada}
                              className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                                jaRealizada
                                  ? 'bg-blue-50 border-blue-300 opacity-50 cursor-default'
                                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg shrink-0 mt-0.5">🔍</span>
                                <div className="flex-grow">
                                  <p className="font-semibold text-slate-800 text-sm">{acao.label}</p>
                                  <p className="text-xs text-slate-600 mt-0.5">{acao.descricao}</p>
                                </div>
                                {jaRealizada && (
                                  <span className="text-xs font-bold text-blue-600 shrink-0 mt-1">✓</span>
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-slate-500 text-xs text-center py-4">
                          Nenhuma ação disponível.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-slate-100 rounded-lg p-4 text-center text-slate-500 text-sm">
                  Clique em uma região para selecionar
                </div>
              )}
            </div>

            {/* Coluna 4: Achados Registrados */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3 flex flex-col overflow-y-auto min-h-0">
              <h3 className="font-bold text-slate-800 text-sm">Achados Registrados</h3>
              <div className="flex-1 overflow-y-auto space-y-2">
                {achadosEncontrados.filter((a) => a.categoria === 'exame_fisico_visual').length > 0 ? (
                  achadosEncontrados
                    .filter((a) => a.categoria === 'exame_fisico_visual')
                    .map((achado, idx) => (
                      <div
                        key={`${achado.id}-${idx}`}
                        className="p-3 bg-white rounded border border-blue-200 text-xs space-y-1"
                      >
                        <p className="font-semibold text-slate-800">{achado.titulo}</p>
                        <p className="text-slate-600 text-xs leading-tight">
                          {achado.descricao}
                        </p>
                        <p className="text-xs text-slate-400 italic">{achado.acaoRealizada}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-slate-500 text-xs text-center py-4">
                    Nenhum achado registrado ainda.
                  </p>
                )}
              </div>

              {/* Contador */}
              {achadosEncontrados.filter((a) => a.categoria === 'exame_fisico_visual').length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold">
                    {achadosEncontrados.filter((a) => a.categoria === 'exame_fisico_visual').length} achado
                    {achadosEncontrados.filter((a) => a.categoria === 'exame_fisico_visual').length !== 1
                      ? 's'
                      : ''}{' '}
                    registrado
                    {achadosEncontrados.filter((a) => a.categoria === 'exame_fisico_visual').length !== 1
                      ? 's'
                      : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-sky-50 border-t border-sky-200 p-4">
          <p className="text-xs text-sky-700">
            <strong>ℹ️ Dica:</strong> Clique nos boxes das regiões ou nos pontos da imagem para selecionar a área do exame. Selecione uma região e depois escolha a ação desejada. O achado só será registrado após clicar em uma ação.
          </p>
        </div>
      </div>
    </div>
  );
}
