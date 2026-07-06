# Index unificado — casos-v2

Substitua o arquivo `data/casos-v2/index.ts` por este.

Ele cria uma fonte oficial única:

```ts
import { casosV2, casosAdultos, casosPediatricos } from "@/data/casos-v2";
```

Exports incluídos:
- `casosAdultosV2`
- `casosPediatricosLegadosV2`
- `casosPediatricosV3`
- `casosV2`
- `casosAdultos`
- `casosPediatricos`
- `default casosV2`

Observação: o caso 064 Bronquiolite Viral Aguda foi mantido dentro de pediátricos como legado.
