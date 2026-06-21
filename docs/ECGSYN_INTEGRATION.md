# Integração ECGSYN ao Simulador de ECG

## Visão Geral

Este documento descreve a integração do algoritmo **ECGSYN** (PhysioNet) ao simulador de ECG 12 derivações do Mini Consultório.

## Fonte Oficial

- **Repositório**: https://physionet.org/content/ecgsyn/1.0.0/
- **Referência Científica Principal**:
  ```
  McSharry PE, Clifford GD, Tarassenko L, Smith L. A dynamical model for generating 
  synthetic electrocardiogram signals. IEEE Transactions on Biomedical Engineering. 
  2003;50(3):289-294.
  ```

- **Referência Complementar**:
  ```
  Goldberger AL, Amaral LAN, Glass L, Hausdorff JM, Ivanov PC, Mark RG, et al. 
  PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource 
  for complex physiologic signals. Circulation. 2000;101(23):e215-e220.
  ```

## Localização Local

```
/Users/marceloalmeida/Projetos/mini-consultorio-osce/
├── external/physionet/ecgsyn/
│   ├── C/
│   ├── Java/
│   ├── Matlab/
│   │   ├── ecgsyn.m          (Principal)
│   │   ├── derivsecgsyn.m    (Derivadas)
│   │   └── ...
│   ├── Papel/
│   └── Saída de amostra/
│
├── src/services/ecgGenerator/
│   ├── index.ts              (Orquestrador principal)
│   ├── types.ts              (Tipos TypeScript)
│   ├── ecgsynAdapter.ts      (Implementação do algoritmo)
│   ├── presets.ts            (5 presets pediátricos)
│   └── leadTransform.ts      (Transformação em 12 derivações)
```

## Comando de Download

O ECGSYN foi baixado usando:

```bash
mkdir -p /Users/marceloalmeida/Projetos/mini-consultorio-osce/external/physionet/ecgsyn
cd /Users/marceloalmeida/Projetos/mini-consultorio-osce/external/physionet/ecgsyn
wget https://physionet.org/files/ecgsyn/1.0.0/ecgsyn.tar.gz
tar -xvzf ecgsyn.tar.gz
```

## Arquivos Utilizados

### Arquivos Matlab/Octave (Referência Principal)

1. **ecgsyn.m**
   - Implementação principal do algoritmo dinâmico ECGSYN
   - Gera sinal ECG sintético baseado em parâmetros fisiológicos
   - Implementa equações diferenciais do modelo

2. **derivsecgsyn.m**
   - Calcula as derivadas do sistema dinâmico
   - Usada para integração numérica

### Arquivos NÃO Utilizados Neste Momento

- **C/dfour1.c**: Transformada de Fourier (FFT) — não necessária para geração básica
- **C/ran1.c**: Gerador de números aleatórios — não necessária em TypeScript
- **Java/**: Implementação gráfica — não necessária (web app)

## Modelo Dinâmico Implementado

O ECGSYN usa um **modelo dinâmico** que simula:

### 1. Componentes do ECG
- **Onda P**: Depolarização atrial
- **Complexo QRS**: Depolarização ventricular (Q, R, S)
- **Onda T**: Repolarização ventricular

### 2. Parâmetros Configuráveis

Cada preset ECG define:

```typescript
{
  frequenciaCardiaca: number      // bpm (média esperada)
  numeroIntervalos: number         // batimentos a gerar
  frequenciaAmostragem: number     // Hz (250, 500, etc)
  
  variacaoRR: number              // variância do intervalo RR
  razaoLFHF: number               // razão LF/HF (0.5-2.0)
  
  amplitude: {
    P: number                      // 0-1 (amplitude relativa)
    Q: number
    R: number
    S: number
    T: number
  }
  
  duracao: number                 // segundos
  ruido: number                   // nível de ruído (0-1)
}
```

### 3. Variabilidade Fisiológica

O algoritmo adiciona:
- **Variabilidade HF** (~0.15 Hz) → modulação respiratória
- **Variabilidade LF** (~0.05 Hz) → modulação simpática
- **Ruído gaussiano** → variações naturais

## Presets Implementados

### 1. ECG Pediátrico Normal
- FC: 110 bpm (lactente)
- Variabilidade RR: baixa (0.02)
- LF/HF: 1.0 (equilíbrio vagal normal)

### 2. Taquicardia Sinusal Pediátrica
- FC: 150 bpm (criança)
- Variabilidade RR: reduzida (0.015)
- LF/HF: 1.5 (predomínio simpático)

### 3. Bradicardia Sinusal
- FC: 60 bpm
- Variabilidade RR: alta (0.08)
- LF/HF: 0.5 (predomínio parassimpático)

### 4. Arritmia Sinusal Respiratória
- FC: 100 bpm (média)
- Variabilidade RR: MUITO alta (0.15)
- LF/HF: 0.3 (predomínio respiratório)

### 5. ECG com Artefato Leve
- FC: 115 bpm
- Ruído: 0.3 (30% de amplitude)
- Objetivo: educacional (diferenciar artefato de patologia)

## Função Principal

```typescript
generateECG({
  presetId: 'ecg_pediatrico_normal',
  selectedLeads: ['II', 'V1', 'V4', 'aVF'],
  durationSeconds: 5,
  samplingRate: 250
})
```

**Retorna:**
```typescript
{
  samplingRate: 250,
  duration: 5,
  leads: {
    II: [0.12, 0.15, -0.08, ...],
    V1: [0.03, 0.06, -0.15, ...],
    V4: [0.80, 0.85, 0.10, ...],
    aVF: [0.45, 0.50, -0.02, ...]
  },
  interpretation: {
    frequenciaCardiaca: 110,
    ritmo: "Sinusal",
    eixoMedio: 60,
    intervalosPR: [120, 118, 122, ...],
    duracoesQRS: [65, 68, 64, ...],
    duracaoQTc: 405
  },
  teachingPoints: [
    "Frequência cardíaca elevada é normal em lactentes",
    "Onda P pequena em DII/DIII",
    ...
  ],
  metadata: {
    presetId: 'ecg_pediatrico_normal',
    dataGeracao: Date,
    versaoECGSyn: '1.0.0 (PhysioNet)',
    sintético: true,
    avisoEducacional: '...',
    referências: [...]
  }
}
```

## Transformação em 12 Derivações

O sinal base (DII sintética) é transformado em:

### Derivações Bipolares (Einthoven)
- **I**: LA - RA (lateral esquerda)
- **II**: LL - RA (inferior) — derivação original gerada
- **III**: LL - LA (inferior)

### Derivações Aumentadas (Augmented)
- **aVR**: RA aumentado (amplificação 1.5x) — invertida
- **aVL**: LA aumentado (amplificação 1.5x)
- **aVF**: LL aumentado (amplificação 1.5x)

### Derivações Precordiais
- **V1-V2**: S dominante (septo)
- **V3-V4**: Zona de transição (progressão R/S)
- **V5-V6**: R dominante (lateral)

## Integração ao Simulador Existente

### Sem Alteração da Interface

- ✅ Botão "Gerar ECG" mantido
- ✅ Seleção de eletrodos preservada (RA, LA, RL, LL, V1-V6)
- ✅ Validação de posicionamento intacta
- ✅ Padrões estáticos não removidos
- ✅ Layout visual não alterado

### Fluxo de Execução

```
1. Usuário seleciona padrão (dropdown)
2. Usuário posiciona eletrodos
3. Clica "Gerar ECG"
4. Valida posicionamento (lógica existente)
5. Se válido: chama generateECG() com eletrodos selecionados
6. Renderiza traçado com valores gerados
7. Exibe interpretação e pontos de ensino
```

## Avisos Educacionais

### Obrigatório em Metadata

```
"Traçado sintético gerado para fins educacionais. 
Não utilizar para diagnóstico clínico real."
```

### Aplicado Automaticamente

- ✅ Cada resposta inclui avisoEducacional
- ✅ Exibido em rodapé técnico
- ✅ Impossível remover sem alterar código

## Limitações Conhecidas

### Versão 1.0.0 (Atual)

1. **Eixo QRS Fixo**: 60° (não variável por preset)
   - Futura: implementar eixo configurável por faixa etária

2. **Sem Arritmias Complexas**: 
   - Apenas variabilidade RR
   - Futura: adicionar bloqueios, extra-sístoles, TSV

3. **Sem Morfologia Patológica**:
   - Apenas normal ou com artefato
   - Futura: supradesnivelamento, inversão T, etc.

4. **Sem ECG Real do PhysioNet**:
   - Apenas sintético
   - Futura: integração com MIT-BIH, AHA, outros datasets

## Próximas Fases (Roadmap)

### Fase 2: Arritmias Básicas
- [ ] Extra-sístoles atriais
- [ ] Extra-sístoles ventriculares
- [ ] Pausas sinusais

### Fase 3: Achados Patológicos
- [ ] Supradesnivelamento ST
- [ ] Infradesnivelamento ST
- [ ] Inversão de onda T
- [ ] Prolongamento QT

### Fase 4: ECG Real
- [ ] Integração com PhysioNet datasets
- [ ] Casos reais de pediátricos
- [ ] Diferentes faixas etárias

### Fase 5: Exportação
- [ ] Gerar PNG/PDF do traçado
- [ ] Salvar ECG no caso clínico
- [ ] Integrar com exame complementar do OSCE

## Referências Completas

### Primária
```bibtex
@article{McSharry2003,
  author = {McSharry, Patrick E and Clifford, Gari D and Tarassenko, Lionel and Smith, Leif A},
  title = {A dynamical model for generating synthetic electrocardiogram signals},
  journal = {IEEE Transactions on Biomedical Engineering},
  year = {2003},
  volume = {50},
  number = {3},
  pages = {289--294},
  doi = {10.1109/TBME.2003.808805}
}
```

### Complementar
```bibtex
@article{Goldberger2000,
  author = {Goldberger, AL and others},
  title = {PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource for complex physiologic signals},
  journal = {Circulation},
  year = {2000},
  volume = {101},
  number = {23},
  pages = {e215--e220},
  doi = {10.1161/01.CIR.101.23.e215}
}
```

## Status de Implementação

- ✅ Tipos TypeScript (types.ts)
- ✅ Algoritmo ECGSYN (ecgsynAdapter.ts)
- ✅ Transformação 12 derivações (leadTransform.ts)
- ✅ 5 Presets pediátricos (presets.ts)
- ✅ Orquestrador principal (index.ts)
- ✅ Avisos educacionais
- ✅ Citações obrigatórias
- ⏳ Integração ao componente SimuladorECG
- ⏳ Testes E2E
- ⏳ Documentação de uso para alunos

## Contato / Problemas

Se encontrar inconsistências entre a implementação TypeScript e o MATLAB original:
1. Verificar ecgsyn.m em external/physionet/ecgsyn/Matlab/
2. Comparar com src/services/ecgGenerator/ecgsynAdapter.ts
3. Registrar discrepância em comentário no código

---

**Última atualização**: 2026-06-21
**Versão**: 1.0.0 (PhysioNet ECGSYN)
**Status**: Implementação Completa, Pronto para Integração
