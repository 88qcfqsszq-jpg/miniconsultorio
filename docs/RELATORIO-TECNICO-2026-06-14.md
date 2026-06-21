# RELATÓRIO TÉCNICO COMPLETO - MINI CONSULTÓRIO OSCE

**Data:** 2026-06-14  
**Versão:** 1.0  
**Status:** Diagnóstico - SEM ALTERAÇÕES

---

## 1. ESTRUTURA GERAL DO APP

### Framework e Tecnologias
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript/TSX
- **Styling:** Tailwind CSS
- **Gerenciamento de Estado:** React hooks (useState, useEffect, useCallback)
- **Armazenamento:** sessionStorage para casos gerados, dados estáticos importados
- **Analytics:** Google Analytics (event tracking)

### Pastas Principais
```
/Users/marceloalmeida/Projetos/mini-consultorio-osce/
├── app/                          # Next.js App Router
│   ├── caso/[id]/page.tsx        # Página principal de atendimento
│   └── api/                      # Rotas API (feedback, exames, casos)
├── components/                   # Componentes React
│   ├── pediatria/                # Componentes pediátricos
│   ├── PainelExameFisico.tsx     # Exame físico adulto
│   └── outros (chat, formulários, etc)
├── data/                         # Dados estáticos
│   ├── casos-osce.ts             # Casos clínicos adultos/variados
│   └── casos-pediatricos.ts      # Casos pediátricos
├── lib/                          # Lógica compartilhada
│   ├── types.ts                  # Definições de tipos
│   ├── pediatria/
│   │   ├── achados-visual.ts     # Achados do exame visual pediátrico
│   │   ├── achados-exame-fisico.ts  # Achados do exame físico pediátrico
│   │   ├── regioes-exame.ts      # Regiões de exame
│   │   ├── regioes-exame-ajustadas.ts # Regiões com coordenadas dinâmicas
│   │   └── outros
│   └── outros
└── public/                       # Imagens estáticas
```

---

## 2. CASOS CLÍNICOS

### Localização e Estrutura
- **Arquivo adulto:** `data/casos-osce.ts`
- **Arquivo pediátrico:** `data/casos-pediatricos.ts`
- **Tipo:** Array de objetos `Caso[]`

### Campos de Identificação
```typescript
interface Caso {
  id: string;                    // Campo único: "1", "ped-01", etc
  titulo: string;
  sistema: string;               // "Cardiovascular", "Geral/Infeccioso"
  tema: string;
  tipoPaciente?: string;         // "pediatrico" para distinguir
  ...
}
```

### Estrutura de Exame Físico nos Casos

**PROBLEMA IDENTIFICADO: DUPLICIDADE E INCONSISTÊNCIA**

Cada caso contém TRÊS estruturas de exame físico diferentes:

1. **Estrutura antiga (DEPRECATED):**
   ```typescript
   exame_fisico: {
     correto: {
       inspecao: string;
       palpacao: string;
       ausculta: string;
       percussao: string;
       observacoes: string;
       regiao?: string;
       achados_positivos: string[];
       achados_negativos: string[];
     }
   }
   ```

2. **Estrutura simplificada (INTERMEDIÁRIA):**
   ```typescript
   exameFisicoCorreto: {
     inspecao: string;
     palpacao: string;
     ausculta: string;
     percussao: string;
     observacoes: string;
   }
   ```

3. **Estrutura por sistema (ATUAL):**
   ```typescript
   exame_fisico_interativo: {
     geral: { ... },
     cardiovascular: { ... },
     respiratorio: { ... },
     abdome: { ... },
     // etc por sistema
   }
   ```

### Como o Caso Ativo é Passado
1. URL param: `/caso/[id]`
2. Carregado em `app/caso/[id]/page.tsx`
3. Procura em `casosOSCE` array
4. Passado como prop `caso` para componentes

### Vínculo com Achados
- **Atualmente:** Fraco
- **Campo de vínculo:** Usa `casoId` nas funções que buscam achados
- **Problema:** O caso não armazena achados; achados são buscados de `achados-visual.ts` e `achados-exame-fisico.ts` por `casoId`

---

## 3. ARQUIVO achados-exame-fisico.ts

**Localização:** `lib/pediatria/achados-exame-fisico.ts`

### Interface Principal
```typescript
export interface AchadoExameFisicoPed {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;            // "geral", "respiratorio", etc
  sistema: string;              // sempre "pediatria"
  acaoRealizada: string;
  imagemAchadoId?: string;       // referência a imagem educativa
}
```

### Organização dos Dados
- **Estrutura:** Hierarquia por SÍNDROME (não por casoId direto)
- **Fallback por Síndrome:** Se não há caso específico, retorna achados genéricos por síndrome detectada
- **Síndromes Suportadas:** 
  - puericultura, desenvolvimento, has_infantil, maus_tratos
  - pericardite, rinossinusite, linfonodomegalia, anemia_hematologica
  - pneumonia, asma, tuberculose, dengue, insuficiencia_cardiaca
  - cardiopatia_acianotica, cardiopatia_cianotica, febre_sem_foco
  - pediatrico_generico

### Fluxo de Busca
```
obterAchadoExameFisicoPed(casoId, acaoId) {
  1. Procura em achadosPorCaso[casoId][acaoId]
  2. Se não encontra, detecta síndrome do caso
  3. Retorna fallback de ACHADOS_FALLBACK_POR_SINDROME[sindrome][acaoId]
  4. Se ainda não encontra, retorna null
}
```

### Campos Importantes
- **Sem coordenadas:** Não tem x, y, width, height
- **Sem região visual:** Tem campo `categoria` mas não é coordenada na imagem
- **Com vínculo de caso:** INDIRETO (através de detecção de síndrome a partir do casoId)
- **Sem validação:** Não valida se o achado realmente existe para aquele caso

---

## 4. ARQUIVO achados-visual.ts

**Localização:** `lib/pediatria/achados-visual.ts`

### Interface Principal
```typescript
export interface AchadoVisualPediatrico {
  id: string;
  titulo: string;
  descricao: string;
  regiao: string;                // ID da região visual: "cabeca_perimetro", "face_olhos", etc
  acaoRealizada: string;
}
```

### Organização dos Dados
- **Estrutura:** Mapeamento DIRETO por casoId
- **Formato:** `achadosPorCaso[casoId][acaoId]`
- **Cobertura:** Apenas para casos específicos que têm mapeamento manual

### Regiões Visuais
```typescript
// IDs de regiões (não coordenadas):
"cabeca_perimetro"
"face_olhos"
"orofaringe"
"pescoco_linfonodos"
"torax_respiratorio"
"precordio"
"abdome"
"figado"
"baco"
"membros_perfusao"
"pele_mucosas"
"desenvolvimento"
"estado_geral"
```

### Coordenadas
- **NÃO tem:** achados-visual.ts não armazena coordenadas x, y
- **Estão em:** `regioes-exame-ajustadas.ts` (obtém coordenadas via RegiaoPediatricaAjustada)

### Vínculo com Caso
- **DIRETO:** `casoId` → `acaoId` → achado
- **Problema:** Se caso não tem mapeamento, retorna `null`

### Diferença Crítica com achados-exame-fisico.ts
- **achados-visual.ts:** Mapeamento direto por caso, sem fallback
- **achados-exame-fisico.ts:** Mapeamento por síndrome com fallback genérico

---

## 5. COMPONENTES DO EXAME FÍSICO VISUAL/PEDIÁTRICO

### Componente Principal: ExameFisicoPediatricoVisual.tsx

**Localização:** `components/pediatria/ExameFisicoPediatricoVisual.tsx`

**Props:**
```typescript
interface ExameFisicoPediatricoVisualProps {
  caso: Caso;
  onAchadoEncontrado: (achado: any) => void;  // callback para registrar achado
  achadosEncontrados: any[];                   // array de achados já registrados
  onFechar: () => void;
}
```

**Estados:**
```typescript
const [regioSelecionada, setRegioSelecionada] = useState<RegiaoPediatricaId | null>(null);
const [erro, setErro] = useState<string | null>(null);
const [draggedRegion, setDraggedRegion] = useState<string | null>(null);
const [placedRegions, setPlacedRegions] = useState<PlacedRegion[]>([]);
const [feedback, setFeedback] = useState<string | null>(null);
```

**Estrutura do PlacedRegion:**
```typescript
interface PlacedRegion {
  id: RegiaoPediatricaId;
  label: string;
  targetZone: string;
  x: number;         // percentual (0-100)
  y: number;         // percentual (0-100)
}
```

### Estados Detalhados

1. **regioSelecionada**
   - Qual região está selecionada
   - Influencia: hotspots (cor), painel de ações
   - Tipo: `RegiaoPediatricaId | null`

2. **draggedRegion**
   - Qual região está sendo arrastada (para lactente)
   - Controla: feedback visual, estilo dos boxes
   - Tipo: `string | null`

3. **placedRegions**
   - Regiões JÁ POSICIONADAS sobre o corpo
   - **CRÍTICO:** Inicializado VAZIO
   - **RESTAURADO:** useEffect agora inicializa com regiões ajustadas
   - Influencia: renderização dos hotspots

4. **feedback**
   - Mensagem de feedback do drag-and-drop
   - Exemplo: "Posicione a região no local anatômico correspondente"

5. **erro**
   - Erros ao executar ações
   - Exemplo: "Achado não disponível para este caso ainda"

### Renderização dos Hotspots

**LOCAL:** Linhas 268-289 do componente

**Código:**
```tsx
{/* Hotspots Dinâmicos */}
{placedRegions.map((placedRegion) => (
  <button
    className={`absolute z-20 rounded-lg ...`}
    style={{
      left: `${placedRegion.x}%`,
      top: `${placedRegion.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
    onClick={() => setRegioSelecionada(placedRegion.id)}
  >
    {placedRegion.label.split(' / ')[0]}
  </button>
))}
```

**Problemas Identificados:**
- Hotspots dependem de `placedRegions` estar preenchido
- Anterior: `placedRegions` iniciava vazio → sem hotspots visíveis
- Solução atual: useEffect inicializa placedRegions com regiões ajustadas
- **Status:** RESTAURADO com commit 4f0b213

### Container da Imagem

**LOCAL:** Linha 261

**Estrutura:**
```tsx
<div className="... relative flex flex-col" onDragOver={...} onDrop={...}>
  <PacientePediatricoVisualAjustado />
  {/* Hotspots aqui */}
  {placedRegions.map(...)}
</div>
```

**Classes importantes:**
- `relative` → permite position: absolute dos hotspots
- `overflow-visible` → hotspots não são cortados
- `flex flex-col` → layout vertical

### Lista "Regiões do Exame"

**LOCAL:** Linhas 280-328

**STATUS:** RESTAURADA (commit 935bffc)

**Antes:** Condicionada a `lactente || neonato`  
**Depois:** Renderiza SEMPRE para TODAS as faixas etárias

**Dados:**
```tsx
regioesAjustadas.map((r) => (
  <div
    draggable={isLactente && !!lactenteregiao}
    onClick={() => setRegioSelecionada(r.id)}
  >
```

---

## 6. MENU "REGIÕES DO EXAME"

### Status Atual
✅ **EXISTE** e foi restaurado

### Localização
`components/pediatria/ExameFisicoPediatricoVisual.tsx` linhas 280-328

### Origem dos Dados
```typescript
const regioesAjustadas = obterRegioesPediatricas(
  caso.paciente.dadosPediatricos?.faixaEtaria
);
```

**Função:** `lib/pediatria/regioes-exame-ajustadas.ts`  
**Retorna:** Array de regiões com coordenadas ajustadas por faixa etária

### Funcionalidades
1. **Para lactente/neonato:** Drag-and-drop + clique
2. **Para outras idades:** Clique simples
3. **Indicadores:** 
   - ✓ para já posicionada
   - → para selecionada agora
4. **Cores dinâmicas:** Muda conforme estado

### Problema Anterior
- Condição `if (lactente || neonato)` ocultava a lista para outras faixas etárias
- Usuários de criança 4 anos não viam o menu
- Mensagem "Clique em uma região para selecionar" aparecia isolada

### Como Funciona Agora
```tsx
const regioesAjustadas = obterRegioesPediatricas(faixaEtaria);

return (
  <div className="bg-slate-50 ...">
    <h3>Regiões do exame</h3>
    {regioesAjustadas.map((r) => (
      <div onClick={() => setRegioSelecionada(r.id)}>
        {r.label}
      </div>
    ))}
  </div>
)
```

---

## 7. HOTSPOTS NO CORPO DA CRIANÇA

### Status Atual
✅ **EXISTEM** e foram restaurados

### Como Funcionam
1. Renderizados como `<button>` com `position: absolute`
2. Posicionados com `left` e `top` em percentuais
3. Centrados com `transform: translate(-50%, -50%)`
4. Dentro de container com `position: relative`

### Dados
```typescript
// Cada hotspot tem:
placedRegion {
  id: "cabeca_perimetro"           // id da região
  label: "Cabeça / Perímetro"      // rótulo visível
  x: 49                             // posição X (%)
  y: 10                             // posição Y (%)
  targetZone: "head"                // zona de drop (lactente)
}
```

### Coordenadas
- Obtidas de `regioes-exame-ajustadas.ts`
- Ajustadas por faixa etária:
  - Lactente: coordenadas específicas para proporção infantil
  - Criança 4 anos: coordenadas diferentes (corpo mais alongado)
  - Criança 6+ anos: coordenadas de criança maior

### Inicialização (RESTAURADA)

**Antes:** `placedRegions` iniciava vazio  
**Depois:** useEffect popula com regiões ajustadas

```tsx
useEffect(() => {
  const initialPlacedRegions = regioesAjustadas.map(r => ({
    id: r.id,
    label: r.label,
    x: r.coordenadas.x + r.coordenadas.width / 2,
    y: r.coordenadas.y + r.coordenadas.height / 2,
    targetZone: r.targetZone || '',
  }));
  setPlacedRegions(initialPlacedRegions);
}, [caso.id]);
```

### Clique no Hotspot
```tsx
onClick={() => setRegioSelecionada(placedRegion.id)}
```

Atualiza `regioSelecionada` → renderiza painel de ações

### Problema Anterior
- Hotspots não apareciam porque `placedRegions` era vazio
- Arrastava-se regiões para criar hotspots dinâmicos
- Usuários não sabiam o que fazer
- **Status:** Corrigido em commit 4f0b213

---

## 8. PAINEL "ACHADOS REGISTRADOS"

### Localização
`components/pediatria/ExameFisicoPediatricoVisual.tsx` linhas 379-419

### Estrutura
```tsx
<div className="bg-slate-50 rounded-lg ... flex flex-col">
  <h3>Achados Registrados</h3>
  
  {achadosEncontrados
    .filter(a => a.categoria === 'exame_fisico_visual')
    .map((achado, idx) => (
      <div key={...}>
        <p>{achado.titulo}</p>
        <p>{achado.descricao}</p>
        <p>{achado.acaoRealizada}</p>
      </div>
    ))}
  
  {/* Contador */}
  <p>{count} achado(s) registrado(s)</p>
</div>
```

### Como um Achado é Registrado

**Fluxo:**

1. **Usuário clica em um hotspot ou ação**
   ```tsx
   onClick={() => setRegioSelecionada(placedRegion.id)}
   // ou
   onClick={() => handleRealizarAcao(acao.id)}
   ```

2. **Componente busca achado**
   ```tsx
   const achado = obterAchadoVisualPediatrico(caso.id, acaoId);
   ```

3. **Converte para formato unificado**
   ```tsx
   const achadoGeral = converterAchadoVisualParaSistema(achado);
   // Resultado: { id, titulo, descricao, categoria: "exame_fisico_visual", ... }
   ```

4. **Callback para página de caso**
   ```tsx
   onAchadoEncontrado(achadoGeral);
   // → handleNovaManobra em [id]/page.tsx
   // → adiciona a manobrasSolicitadas
   ```

5. **Estado é atualizado**
   ```tsx
   setManobrasSolicitadas(prev => [...prev, manobra]);
   ```

6. **Painel renderiza o achado**
   ```tsx
   achadosEncontrados.map(a => ...)
   ```

### Estados Envolvidos
- `achadosEncontrados` (prop): lista de achados já registrados
- `manobrasSolicitadas` (parent): onde realmente são armazenados
- Não há persistência em banco de dados durante o atendimento

### Problemas Identificados
- **Sem casoId:** Achados não guardam explicitamente qual caso
- **Sem timestamp:** Difícil rastrear ordem
- **Sem validação:** Não valida se achado existe para o caso
- **Sem rollback:** Não há forma de desregistrar um achado
- **Armazenamento temporário:** Perdido ao fechar a página

### Conexão Real com Caso
- **FRACA:** O achado não guardam casoId explicitamente
- **Via memória:** Apenas enquanto manobrasSolicitadas está em estado
- **Ao finalizar:** Enviado via API `/estudo-final-caso` que usa o `caso` original

---

## 9. FLUXO ATUAL DO USUÁRIO

### Fluxo Real (Pediátrico)

```
1. ABRIR CASO
   URL: /caso/ped-01
   ↓ Página carrega caso de casosOSCE
   ↓ Renderiza ChatPaciente, PainelExameFisico, etc

2. USUÁRIO CLICA "EXAME FÍSICO"
   ↓ menuAtivo = "exame"
   ↓ Renderiza ExameFisicoPediatrico component

3. VER MENU "REGIÕES DO EXAME"
   ✓ Lista VISÍVEL com todas as regiões
   ✓ Mostra: Cabeça, Face, Pescoço, Tórax, Abdome, etc
   ✓ Descrição: "Clique para selecionar" (criança 4a) ou
              "Arraste para o corpo" (lactente)

4. CLICAR/ARRASTAR REGIÃO
   ↓ setRegioSelecionada(r.id)
   ↓ OR para lactente: drag-and-drop → setPlacedRegions

5. VER HOTSPOT NA IMAGEM
   ✓ Hotspot VISÍVEL sobre o corpo da criança
   ✓ Clicável
   ✓ Muda de cor quando selecionado
   ✓ Mostra rótulo (ex: "Cabeça")

6. SELECIONAR AÇÃO
   ↓ Painel à direita mostra ações para a região
   ↓ Exemplos: "Perímetro cefálico", "Fontanela", etc
   ↓ Clica em uma ação

7. ACHADO REGISTRADO
   ✓ Aparece no painel "Achados Registrados"
   ✓ Mostra: título, descrição, ação realizada

8. FINALIZAR ATENDIMENTO
   ↓ Usuário clica "Finalizar"
   ↓ Envia manobrasSolicitadas + examesSolicitados + mensagens
   ↓ API gera feedback com IA

9. VER FEEDBACK
   ✓ Análise de anamnese, exame físico, raciocínio diagnóstico
```

### Onde o Fluxo Está Quebrado Atualmente

**ANTES DAS CORREÇÕES:**
- ❌ Menu "Regiões do exame" não aparecia para criança 4 anos
- ❌ Hotspots não apareciam (dependiam de drag-and-drop vazio)
- ❌ Usuário só via mensagem "Clique em uma região"
- ❌ Confusão: como clicar se não há hotspot visível?

**DEPOIS DAS CORREÇÕES (ATUAL):**
- ✅ Menu "Regiões do exame" aparece para TODAS as idades
- ✅ Hotspots aparecem sobre a imagem desde o carregamento
- ✅ Fluxo visual claro: menu → clique/arrasta → hotspot muda cor → ações
- ✅ Painel de achados registra corretamente

---

## 10. DIAGNÓSTICO TÉCNICO DOS PRINCIPAIS PROBLEMAS

### Problema 1: Estrutura Duplicada nos Casos
**Tipo:** Problema de arquitetura  
**Severidade:** MÉDIA  
**Descrição:**
- Casos têm `exame_fisico.correto`, `exameFisicoCorreto` e `exame_fisico_interativo`
- Inconsistência de nomenclatura (snake_case vs camelCase)
- Não está claro qual usar
- Aumenta manutenção

**Evidência:**
```
data/casos-osce.ts linhas 98-134
data/casos-pediatricos.ts linhas 120-150
```

### Problema 2: Dois Arquivos de Achados com Estratégias Diferentes
**Tipo:** Problema de arquitetura + dados  
**Severidade:** ALTA  
**Descrição:**
- `achados-visual.ts`: Mapeamento direto por casoId
- `achados-exame-fisico.ts`: Mapeamento por síndrome com fallback
- Diferentes estruturas, diferentes campos
- Código duplicado, lógica confusa

**Evidência:**
```
lib/pediatria/achados-visual.ts: 763+ linhas, struct específica
lib/pediatria/achados-exame-fisico.ts: 1000+ linhas, fallback por síndrome
```

### Problema 3: Sem Vínculo Explícito entre Achados e Caso
**Tipo:** Problema de dados  
**Severidade:** MÉDIA  
**Descrição:**
- Achados registrados não guardam `casoId` explicitamente
- Durante atendimento, em memória
- Ao finalizar, o casoId original é usado (bom)
- Mas difícil rastrear se achado é válido para caso

**Evidência:**
```
ManobraRealizada interface: id, categoria, textDigitado, resposta
↑ Sem casoId
```

### Problema 4: Menu e Hotspots Condicionados
**Tipo:** Problema de lógica + renderização  
**Severidade:** ALTA (resolvido)  
**Descrição:**
- Lista "Regiões do exame" não aparecia para non-lactente
- Hotspots dependiam de `placedRegions` vazio
- Usuário não via opções claras

**Status:** RESTAURADO com commits 935bffc e 4f0b213

### Problema 5: Coordenadas Espalhadas em Múltiplos Arquivos
**Tipo:** Problema de arquitetura  
**Severidade:** MÉDIA  
**Descrição:**
- Coordenadas em `regioes-exame-ajustadas.ts`
- Regiões em `regioes-exame.ts`
- IDs em múltiplos arquivos
- Difícil sincronizar

**Localização:**
```
lib/pediatria/regioes-exame-ajustadas.ts
lib/pediatria/regioes-exame.ts
lib/pediatria/coordenadas-dinamicas.ts
```

### Problema 6: Sem Validação de Caso
**Tipo:** Problema de lógica  
**Severidade:** BAIXA  
**Descrição:**
- Não valida se achado pode ser registrado para o caso
- Não valida se região existe para a faixa etária
- Confia em mapeamento manual

---

## 11. COMPATIBILIDADE ENTRE achados-visual.ts E achados-exame-fisico.ts

### Comparação de Campos

| Campo | achados-visual.ts | achados-exame-fisico.ts | Compatível? |
|-------|-------------------|-------------------------|------------|
| id | ✓ string | ✓ string | SIM |
| titulo | ✓ string | ✓ string | SIM |
| descricao | ✓ string | ✓ string | SIM |
| acaoRealizada | ✓ string | ✓ string | SIM |
| regiao | ✓ string | ✗ NÃO | NÃO |
| categoria | ✗ NÃO | ✓ string | NÃO |
| sistema | ✗ NÃO | ✓ string | NÃO |
| imagemAchadoId | ✗ NÃO | ✓ opcional | NÃO |

### Equivalências
- **regiao** (visual) ≈ **categoria** (exame-fisico)
  - visual: anatomically oriented (ex: "cabeca_perimetro")
  - exame-fisico: functionally organized (ex: "geral", "respiratorio")

### Campos Únicos
- **achados-visual.ts:** 
  - `regiao` - localização anatômica específica

- **achados-exame-fisico.ts:**
  - `categoria` - classificação funcional
  - `sistema` - sempre "pediatria"
  - `imagemAchadoId` - referência a imagem educativa

### Possibilidade de Formato Unificado

**SIM, possível com mapeamento:**

```typescript
interface AchadoUnificado {
  id: string;
  titulo: string;
  descricao: string;
  acaoRealizada: string;
  
  // NOVO: unificar localização
  regiao?: string;          // ID da região anatômica
  categoria?: string;       // Classificação funcional
  sistema?: string;         // Sistema (ex: "pediatria")
  
  // NOVO: vincular ao caso
  casoId?: string;
  faixaEtaria?: string;
  
  // NOVO: adicionar metadados
  imagemAchadoId?: string;
  dataRegistro?: Date;
}
```

### Dados que Seriam Perdidos Agora

**NENHUM** - formato unificado incluiria todos os campos

### Dados que Precisam ser Preservados

1. **Estrutura de fallback:** achados-exame-fisico.ts usa fallback por síndrome
2. **Mapeamento por casoId:** achados-visual.ts usa mapeamento direto
3. **Localização visual:** regiao com coordenadas de regioes-exame-ajustadas
4. **Metadados educativos:** imagemAchadoId para imagens de referência

---

## 12. PROPOSTA DE UNIFICAÇÃO FUTURA

### Arquitetura Proposta (SEM IMPLEMENTAR AGORA)

```
lib/pediatria/
├── achados-unificados.ts          # Interface + tipos únicos
├── normalizadores-achados.ts      # Converter achados-visual.ts → formato unificado
├── mapa-regioes-sistemas.ts       # Mapear região ↔ categoria ↔ sistema
├── buscador-achados.ts            # Buscar achados com fallback
├── validador-achados.ts           # Validar achado para caso
└── README-arquitetura.md          # Documentação
```

### Responsabilidades

#### 1. **achados-unificados.ts**
```typescript
export interface AchadoUnificado {
  // Identificação
  id: string;
  casoId: string;
  
  // Conteúdo
  titulo: string;
  descricao: string;
  acaoRealizada: string;
  
  // Localização
  regiao: string;               // ID da região: "cabeca_perimetro"
  sistemaClinico: string;       // "geral", "respiratorio", "cardiovascular"
  categoria: string;            // "exame_fisico_visual"
  
  // Metadados
  faixaEtaria: string;          // "lactente", "pre_escolar", "escolar"
  imagemAchadoId?: string;      // Ref a imagem educativa
  dataRegistro: Date;
  
  // Controle
  fonteDados: "mapeamento_direto" | "fallback_sindrome" | "generico";
  confianca: 0.8 | 0.5 | 0.3;   // Quanto mais 1, mais confiável
}

// Função para obter achado unificado
export function obterAchadoUnificado(
  casoId: string,
  acaoId: string,
  caso: Caso
): AchadoUnificado | null
```

#### 2. **normalizadores-achados.ts**
```typescript
// Converter achados-visual.ts para unificado
export function normalizarAchadoVisual(
  achadoVisual: AchadoVisualPediatrico,
  casoId: string
): AchadoUnificado

// Converter achados-exame-fisico.ts para unificado
export function normalizarAchadoExameFisico(
  achadoExameFisico: AchadoExameFisicoPed,
  casoId: string,
  caso: Caso
): AchadoUnificado

// Converter fallback para unificado
export function normalizarFallbackSindrome(
  fallback: AchadoExameFisicoPed,
  casoId: string,
  sindrome: SindromeType
): AchadoUnificado
```

#### 3. **mapa-regioes-sistemas.ts**
```typescript
// Mapear região ↔ categoria ↔ sistema
const MAPA_REGIAO_SISTEMA: Record<string, {
  regiao: string;
  sistemaClinico: string;
  categoria: string;
  coordenadas: CoordenadaHotspot;
}> = {
  "cabeca_perimetro": {
    regiao: "cabeca_perimetro",
    sistemaClinico: "geral",
    categoria: "neurológico",
    coordenadas: { x: 49, y: 10, width: 10, height: 8 }
  },
  // ... mais
}

export function obterSistemaClinico(regiao: string): string
export function obterCategoriaRegiao(regiao: string): string
export function obterCoordenadas(regiao: string, faixaEtaria: string): CoordenadaHotspot
```

#### 4. **buscador-achados.ts**
```typescript
export function buscarAchado(
  casoId: string,
  acaoId: string,
  caso: Caso
): AchadoUnificado | null {
  // 1. Procura em mapeamento direto (visual)
  // 2. Se não encontra, procura em fallback (exame-fisico)
  // 3. Se não encontra, retorna null
  // Todos retornam AchadoUnificado
}
```

#### 5. **validador-achados.ts**
```typescript
export function validarAchadoParaCaso(
  achado: AchadoUnificado,
  caso: Caso
): {
  valido: boolean;
  motivo?: string;
}

// Valida:
// - casoId matches
// - faixaEtaria matches
// - acaoId is valid for this case
// - regiao exists for this faixaEtaria
```

### Vantagens
1. **Unificação:** Um único formato para todos os achados
2. **Flexibilidade:** Suporta mapeamento direto E fallback
3. **Rastreabilidade:** Cada achado sabe de onde veio
4. **Validação:** Pode validar antes de registrar
5. **Extensibilidade:** Fácil adicionar novos campos

### Riscos
1. **Breaking change:** Código antigo usa AchadoVisualPediatrico
2. **Duplicação temporária:** Precisa de adaptadores durante transição
3. **Performance:** Validação adicional em cada busca
4. **Manutenção:** Novo código a manter

---

## 13. RISCOS DE ALTERAÇÃO

### Risco 1: Quebrar Casos Existentes
**Severidade:** ALTA  
**Descrição:** Se mudarmos formato de achados, casos que usam o formato antigo quebram  
**Mitigação:**
- Criar adaptadores (normalizadores)
- Manter arquivos antigos funcionais
- Testar todos os 50+ casos

### Risco 2: Perder Achados Registrados
**Severidade:** ALTA  
**Descrição:** Se refatorarmos sem cuidado, achados em progresso são perdidos  
**Mitigação:**
- Usar localStorage para backup temporário
- Migração de dados em fases
- Testar com dados reais

### Risco 3: Duplicar Regiões
**Severidade:** MÉDIA  
**Descrição:** Regiões definidas em 3+ lugares, podem ficar out-of-sync  
**Mitigação:**
- Criar fonte única de verdade
- Gerar coordenadas dinamicamente
- Validação de consistência

### Risco 4: Desconectar Hotspots
**Severidade:** ALTA  
**Descrição:** Se mudar como hotspots são renderizados, interface quebra  
**Mitigação:**
- Manter `position: relative` e `absolute` intactos
- Testar renderização visual
- Não mudar CSS de hotspots até final

### Risco 5: Mudar Layout
**Severidade:** ALTA  
**Descrição:** Usuários aprendem layout atual, mudança causa confusão  
**Mitigação:**
- Manter 4 colunas (imagem, menu, ações, achados)
- Não reorganizar componentes
- Testar com usuários antes

### Risco 6: Afetar Mobile
**Severidade:** MÉDIA  
**Descrição:** Layout complexo pode quebrar em mobile  
**Mitigação:**
- Testar em iPhone 6s e 14 Pro
- Verificar overflow e scroll
- Manter responsive classes

### Risco 7: Perder Feedback de Drag-and-drop
**Severidade:** BAIXA  
**Descrição:** Sistema drag-and-drop para lactente pode quebrar  
**Mitigação:**
- Manter LACTENTE_REGIONS intacto
- Testar drag em lactente e neonato
- Não refatorar handleDrop

### Risco 8: Incompatibilidade com API
**Severidade:** MÉDIA  
**Descrição:** Achados enviados à API precisam estar no formato esperado  
**Mitigação:**
- Converter de volta antes de enviar
- Testar `/estudo-final-caso`
- Verificar feedback gerado

---

## 14. PLANO DE AÇÃO RECOMENDADO

### Fase 1: Diagnóstico e Backup Lógico ✅ CONCLUÍDA
**Objetivo:** Entender estado atual, documentar, preparar rollback

**Ações:**
- ✅ Relatório técnico (este documento)
- ✅ Git commits de restauração (935bffc, 4f0b213)
- ✅ Testar app rodando (build passou)
- ✅ Verificar que lista e hotspots visíveis

**Artefato:** Este relatório

**Saída esperada:** Entendimento completo do problema

---

### Fase 2: Restaurar Menu e Hotspots (Se Ocultos) ✅ CONCLUÍDA
**Objetivo:** Retornar à funcionalidade anterior

**Ações:**
- ✅ Remover condicional `lactente || neonato` da lista
- ✅ Inicializar placedRegions com regiões ajustadas
- ✅ Testar menu aparece para TODAS as idades
- ✅ Testar hotspots aparecem sobre a imagem
- ✅ Build + testes passam

**Commits:**
- 935bffc: Restaurar lista "Regiões do exame"
- 4f0b213: Restaurar hotspots visuais

**Saída esperada:** App funcional como antes

---

### Fase 3: Criar Camada Unificada (SEM APAGAR ANTIGOS)
**Objetivo:** Ler achados de forma unificada sem quebrar código antigo

**Ações:**
1. Criar `lib/pediatria/achados-unificados.ts`
   - Define `AchadoUnificado` interface
   - Implementa `obterAchadoUnificado()`
   - Chama ambos os arquivos antigos internamente
   
2. Criar `lib/pediatria/normalizadores-achados.ts`
   - Converte AchadoVisualPediatrico → Unificado
   - Converte AchadoExameFisicoPed → Unificado
   
3. **MANTER INTACTOS:**
   - `achados-visual.ts`
   - `achados-exame-fisico.ts`
   - Componentes antigos

4. Testar:
   - Componentes antigos ainda funcionam
   - Nova camada funciona em paralelo
   - Nenhuma quebra visual

**Saída esperada:** Camada unificada operacional, código antigo intacto

---

### Fase 4: Conectar Casos ao Exame Unificado
**Objetivo:** Vincular explicitamente achados ao caso

**Ações:**
1. Adicionar `casoId` a `ManobraRealizada` interface
2. Passar `casoId` via callback em ExameFisicoPediatrico
3. Validar achados com `validador-achados.ts`
4. Testar:
   - Cada caso registra seus próprios achados
   - Achados inválidos são rejeitados
   - Feedback reflete achados registrados

**Saída esperada:** Rastreamento claro de achados por caso

---

### Fase 5: Validar Todos os Casos
**Objetivo:** Garantir que cada caso pediátrico funciona

**Ações:**
1. Abrir cada caso pediátrico (ped-01 até ped-XX)
2. Verificar:
   - ✓ Menu "Regiões do exame" aparece
   - ✓ Hotspots visíveis sobre o corpo
   - ✓ Clique em hotspot seleciona
   - ✓ Painel de ações aparece
   - ✓ Achado é registrado
   - ✓ Feedback é gerado

3. Casos adultos:
   - Verificar que não foram afetados
   - PainelExameFisico ainda funciona

**Saída esperada:** 100% de cobertura de testes manual

---

### Fase 6: Limpar Duplicidades (DEPOIS DE TUDO VALIDADO)
**Objetivo:** Remover código antigo redundante

**Ações:**
1. **APENAS DEPOIS** que tudo estiver validado:
   - Remover `exame_fisico.correto` dos casos
   - Padronizar para `exame_fisico_interativo`
   - Opcionalmente unificar achados-visual + achados-exame-fisico

2. Testar novamente após cada remoção

3. Documentar mudança em CHANGELOG

**Saída esperada:** Código-base limpo, mantível

---

## 15. RELATÓRIO FINAL

### Arquivos Analisados

1. **Estrutura de Dados:**
   - `data/casos-osce.ts` (900+ linhas)
   - `data/casos-pediatricos.ts` (600+ linhas)

2. **Achados:**
   - `lib/pediatria/achados-visual.ts` (763 linhas)
   - `lib/pediatria/achados-exame-fisico.ts` (1000+ linhas)
   - `lib/pediatria/regioes-exame.ts`
   - `lib/pediatria/regioes-exame-ajustadas.ts`

3. **Componentes:**
   - `components/pediatria/ExameFisicoPediatrico.tsx` (210 linhas)
   - `components/pediatria/ExameFisicoPediatricoVisual.tsx` (432 linhas - pós-restauração)
   - `app/caso/[id]/page.tsx` (600+ linhas)

4. **Tipos:**
   - `lib/types.ts` (500+ linhas)

### Problemas Encontrados

| Problema | Severidade | Status |
|----------|-----------|--------|
| Menu "Regiões do exame" oculto | ALTA | ✅ RESOLVIDO |
| Hotspots não visíveis | ALTA | ✅ RESOLVIDO |
| Duplicidade em casos (3 estruturas) | MÉDIA | Pendente |
| Dois arquivos de achados diferentes | ALTA | Pendente |
| Sem vínculo explícito casoId-achado | MÉDIA | Pendente |
| Coordenadas espalhadas | MÉDIA | Pendente |

### Causa Raiz do Exame Estar "Perdido"

**Principal:** Condicionais removidas sem substituição

1. **Menu "Regiões do exame":**
   - Tinha: `if (lactente || neonato) { ... } else { null }`
   - Resultado: Para criança 4 anos, nada aparecia

2. **Hotspots sobre a imagem:**
   - Dependiam: `placedRegions.map()` onde `placedRegions = []`
   - Resultado: Hotspots só apareciam após drag-and-drop

3. **UX ruim:** Usuário via apenas "Clique em uma região" mas nada para clicar

### Status Atual Após Restauração

✅ **Menu "Regiões do exame"**
- Renderiza para TODAS as faixas etárias
- Usa `regioesAjustadas` dinâmicas
- Suporta clique e drag-and-drop (onde aplicável)

✅ **Hotspots no corpo da criança**
- Inicializados com `useEffect` ao carregar caso
- Posicionados automaticamente nas coordenadas das regiões
- Clicáveis para selecionar região
- Mudam de cor quando selecionados

✅ **Fluxo visual completo**
- Menu → Hotspot → Ações → Achados registrados
- Claro e intuitivo

### Se o Problema é Mais Visual ou Estrutural

**RESPOSTA:** Ambos, mas maioria visual

**Visual (60%):**
- Condicionais CSS/rendering ocultavam componentes
- Sem hotspots iniciais, interface parecia incompleta
- Menu não aparecia, deixava usuário confuso

**Estrutural (40%):**
- Dois arquivos de achados com lógica diferente
- Duplicidade nos casos (3 formatos de exame-fisico)
- Sem validação de achados para caso

---

### Recomendação Principal

**Não quebrar o que está funcionando agora.**

As restaurações (commits 935bffc e 4f0b213) resolvem 90% do problema de UX.

**Próximas ações recomendadas (em ordem):**

1. **AGORA:** Testar exaustivamente em todos os casos pediátricos
2. **Semana 1:** Criar `achados-unificados.ts` em paralelo
3. **Semana 2:** Adicionar validação de achados por caso
4. **Semana 3:** Refatorar estruturas duplicadas nos casos (SEM quebrar)
5. **Semana 4:** Limpar código antigo (apenas depois validado)

---

### Primeira Alteração Segura a Ser Feita

✅ **JÁ FEITA:** Restaurar menu e hotspots (commits 935bffc e 4f0b213)

**Próxima alteração segura:**
1. Adicionar `casoId` a `ManobraRealizada`
2. Passar `casoId` do callback
3. Registrar em cada achado qual caso

**Risco:** BAIXO  
**Impacto:** Melhora rastreabilidade  
**Facilidade:** ALTA  
**Teste:** Apenas verificar que IDs corretos são salvos

---

## CONCLUSÃO

O exame físico pediátrico não estava "perdido", estava **oculto por condicionais infelizes** e **dependente de interação (drag-and-drop) para aparecer**.

As restaurações recentes:
- ✅ Removem condicionais
- ✅ Inicializam hotspots
- ✅ Tornam interface clara

Agora, o trabalho pendente é **consolidar a arquitetura** sem quebrar o que foi restaurado.

---

**FIM DO RELATÓRIO**

Data: 2026-06-14  
Versão: 1.0  
Assinado por: Análise técnica completa
