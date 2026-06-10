'use client'

import { RegiaoVisualMI, MAPA_REGIAO_VISUAL_PARA_CLINICA } from '@/lib/membros-inferiores/coordenadas'

interface MapaImagemMIProps {
  titulo: string
  src: string
  regioes: RegiaoVisualMI[]
  regiaoSelecionada: string | null
  onSelecionarRegiao: (regiaoVisualId: string, regiaoClinicaId: string) => void
}

export default function MapaImagemMI({
  titulo,
  src,
  regioes,
  regiaoSelecionada,
  onSelecionarRegiao,
}: MapaImagemMIProps) {
  const handleRegiao = (regiao: RegiaoVisualMI) => {
    const regiaoClinica = MAPA_REGIAO_VISUAL_PARA_CLINICA[regiao.id]
    if (regiaoClinica) {
      onSelecionarRegiao(regiao.id, regiaoClinica)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Título */}
      <h4 className="text-sm font-semibold text-slate-700">{titulo}</h4>

      {/* Container da imagem */}
      <div className="relative aspect-[3/5] w-full max-w-xs rounded-xl bg-white border border-slate-200 overflow-hidden">
        {/* Imagem base */}
        <img
          src={src}
          alt={`Membros inferiores - ${titulo}`}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            // Fallback se imagem não carregar
            e.currentTarget.style.display = 'none'
          }}
        />

        {/* Hotspots clicáveis */}
        {regioes.map(regiao => (
          <button
            key={regiao.id}
            type="button"
            title={regiao.label}
            aria-label={regiao.label}
            onClick={() => handleRegiao(regiao)}
            className={`absolute z-10 rounded-xl border transition-all cursor-pointer ${
              regiaoSelecionada === regiao.id
                ? 'border-blue-500 bg-blue-500/25 shadow-md'
                : 'border-transparent hover:border-blue-400/50 hover:bg-blue-400/15'
            }`}
            style={{
              left: `${regiao.x}%`,
              top: `${regiao.y}%`,
              width: `${regiao.width}%`,
              height: `${regiao.height}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
