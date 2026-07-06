# Análise de Integração: Casos V2

## Status Atual

### ✅ O que já existe
1. **data/casos-v2/index.ts** - Exporta casos adultos e pediátricos:
   - `casosAdultosV2` - ~64 casos adultos
   - `casosPediatricosV3` - ~16 casos pediátricos
   - `casosV2` - union de ambos
   - Aliases: `casosAdultos`, `casosPediatricos`

2. **Estrutura de tipos v2**:
   - `CasoOSCEV2` (adultos) - genérico, permite qualquer campo
   - `CasoPediatricoOSCEV2` (pediátricos) - estruturado com campos específicos

3. **Exemplos reais**:
   - Adulto: `032-crise-asmatica-grave.ts` com campos estruturados
   - Pediátrico: `ped-01-febre-em-crianca-de-4-anos.ts` com `sinaisVitais`, `exameFisico`, etc.

### ❌ O que falta

1. **Listagem de casos**: `app/treinamento/page.tsx` e `app/faca-o-osce/page.tsx` usam:
   - `import { casosOSCE } from "@/data/casos-osce"` ← **fonte antiga**
   - Precisam usar `data/casos-v2` como fonte oficial

2. **Carregamento de casos**: `app/caso/[id]/page.tsx` busca em:
   - `casosOSCE.find((c) => c.id === casoId)` ← **fonte antiga**
   - Precisam usar `data/casos-v2` como fonte oficial

3. **Mapeamento de campos v2 → Caso (interface antiga)**:
   - `CasoOSCEV2` e `CasoPediatricoOSCEV2` têm estrutura diferente de `Caso`
   - Precisam ser compatibilizados sem criar adaptador (fazer inline)

## Mapeamento de Campos

### Campos comuns (adulto e pediátrico)
```
V2                          → Tipo atual (Caso)
id                         → id
titulo                     → titulo
sistema                    → sistema
tema                       → tema
nivel                      → nivel
tipo_estacao               → tipo_estacao
tempo_osce_minutos         → tempo_osce_minutos
objetivo_pedagogico        → objetivo_pedagogico
dados_visiveis_ao_estudante → dados_visiveis_ao_estudante
dados_ocultos_do_sistema   → dados_ocultos_do_sistema
paciente                   → paciente
respostas_do_paciente      → respostas_do_paciente / respostaPaciente
```

### Sinais Vitais

**Adulto V2**:
```
sinaisVitaisCorretos ou sinais_vitais.corretos → sinais_vitais.corretos
sinais_vitais.variacoes? → sinais_vitais.variacoes?
```

**Pediátrico V2**:
```
sinaisVitais.entrada → sinais_vitais.corretos (para compatibilidade)
sinaisVitais.referenciaPorIdade → ??? (novo campo, guardar separado)
sinaisVitais.evolucao → ??? (novo campo, guardar separado)
```

### Exame Físico

**Adulto V2**:
```
exame_fisico.correto ou exameFisicoCorreto → exame_fisico.correto
exame_fisico.por_regiao? → exame_fisico.por_regiao?
exame_fisico_interativo? → exame_fisico_interativo?
```

**Pediátrico V2**:
```
exameFisico → exame_fisico (estruturado com regiões)
Campos: abordagem, impressaoGeral, pele, cabecaPescoco, respiratorio, etc.
```

### Exames Complementares

**V2** usa:
- `exames.laboratoriais.*`
- `exames.beiraLeito.*`
- `exames.imagem.*`
- `exames.cardiologicos.*`
- `exames.complementaresOriginais[]`

**Tipo atual** usa:
- `exames_complementares_disponiveis[]`

**Ação**: Manter ambos quando disponível, com preferência para novo.

## Plano de Implementação

### FASE 1: Substituição de fonte (sem mudança de tipos)
1. Substituir `casosOSCE` → `casosAdultos` em `app/treinamento/page.tsx`
2. Substituir `casosOSCE` → `casosV2` em `app/faca-o-osce/page.tsx`
3. Substituir `casosOSCE` → `casosV2` em `app/caso/[id]/page.tsx`

### FASE 2: Adaptação inline (sem criar adaptador)
Quando um componente precisar de dados v2:
- Tentar buscar no novo tipo (ex: `caso.sinaisVitais?.entrada`)
- Se não existir, buscar no tipo antigo (ex: `caso.sinaisVitaisCorretos`)
- Se não existir, avisar que dado não está disponível

### FASE 3: Testes manuais
1. Listar casos adultos e pediátricos
2. Iniciar atendimento com cada tipo
3. Verificar se sinais vitais, exame físico, exames carregam corretamente

## Riscos

1. **IDs conflitantes**: Casos v2 usam `id`, `codigo`, `versao` - precisam ser únicos globalmente
2. **Estrutura diferente**: v2 tem estrutura mais elaborada, pode não caber em alguns lugares
3. **Compatibilidade anterior**: Alguns componentes ainda esperam a velha estrutura

## Próximos Passos

1. Verificar se há conflito de IDs entre casosOSCE e casosV2
2. Adaptar app/treinamento/page.tsx para usar casosV2
3. Adaptar app/faca-o-osce/page.tsx para usar casosV2
4. Adaptar app/caso/[id]/page.tsx para buscar em casosV2
5. Testar manualmente cada fluxo
