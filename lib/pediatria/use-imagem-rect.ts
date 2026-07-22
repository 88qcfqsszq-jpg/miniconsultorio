import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export interface RetanguloImagem {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Calcula a área efetivamente ocupada pela imagem dentro do contêiner quando
// renderizada com object-fit: contain (letterboxing), para alinhar overlays
// (hotspots/marcadores) com a imagem real, e não com o contêiner inteiro.
function calcularRetanguloContain(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number
): RetanguloImagem {
  if (!containerWidth || !containerHeight || !naturalWidth || !naturalHeight) {
    return { left: 0, top: 0, width: containerWidth, height: containerHeight };
  }
  const escala = Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight);
  const width = naturalWidth * escala;
  const height = naturalHeight * escala;
  return {
    left: (containerWidth - width) / 2,
    top: (containerHeight - height) / 2,
    width,
    height,
  };
}

// Mede continuamente (ResizeObserver) o retângulo real de uma <img> com
// object-fit: contain dentro do seu contêiner, para permitir posicionar
// overlays absolutos (hotspots) em coordenadas percentuais relativas à
// imagem, mesmo quando o contêiner tem proporção diferente da imagem.
export function useImagemRect(
  containerRef: RefObject<HTMLElement | null>,
  imgRef: RefObject<HTMLImageElement | null>,
  deps: unknown[] = []
) {
  const [retangulo, setRetangulo] = useState<RetanguloImagem | null>(null);

  const recalcular = useCallback(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img || !img.naturalWidth || !img.naturalHeight) return;

    setRetangulo(
      calcularRetanguloContain(
        container.clientWidth,
        container.clientHeight,
        img.naturalWidth,
        img.naturalHeight
      )
    );
  }, [containerRef, imgRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => recalcular());
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recalcular]);

  useEffect(() => {
    setRetangulo(null);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth) {
      recalcular();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { retangulo, recalcular };
}
