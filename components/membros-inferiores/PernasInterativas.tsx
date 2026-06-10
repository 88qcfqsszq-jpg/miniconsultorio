'use client'

import { REGIOES_FRONTAIS_MEMBROS_INFERIORES, REGIOES_POSTERIORES_MEMBROS_INFERIORES } from '@/lib/membros-inferiores/coordenadas'
import MapaImagemMI from '@/components/membros-inferiores/MapaImagemMI'

interface PernasInterativasProps {
  regiaoSelecionada: string | null
  onSelecionarRegiao: (regiaoVisualId: string, regiaoClinicaId: string) => void
}

export default function PernasInterativas({
  regiaoSelecionada,
  onSelecionarRegiao,
}: PernasInterativasProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Vista Frontal */}
      <MapaImagemMI
        titulo="Frontal"
        src="/images/boneco/pernas_frontal_base_hotspots.png"
        regioes={REGIOES_FRONTAIS_MEMBROS_INFERIORES}
        regiaoSelecionada={regiaoSelecionada}
        onSelecionarRegiao={onSelecionarRegiao}
      />

      {/* Vista Posterior */}
      <MapaImagemMI
        titulo="Posterior"
        src="/images/boneco/pernas_posterior_hotspot.png"
        regioes={REGIOES_POSTERIORES_MEMBROS_INFERIORES}
        regiaoSelecionada={regiaoSelecionada}
        onSelecionarRegiao={onSelecionarRegiao}
      />
    </div>
  )
}
