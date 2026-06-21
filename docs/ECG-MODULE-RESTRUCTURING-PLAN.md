# Plano de Reestruturação do Módulo ECG Sintético

**Data**: 2026-06-21  
**Status**: Planejamento e Etapa 1 em andamento  
**Objetivo**: Reorganizar módulo ECG como biblioteca didática de presets clínicos

---

## 1. MUDANÇA CONCEITUAL

### De:
- "ECGSYN fiel/realista"
- "Motor ECGSYN integrado"

### Para:
- "Gerador Sintético Didático P-QRS-T"
- "Biblioteca Educacional de Padrões ECG"

**Referência científica**: ECGSYN/PhysioNet mantido como inspiração histórica, não como fiel.

---

## 2. ESTRUTURA DE ARQUIVOS PROPOSTA

```
src/services/ecgGenerator/
├── syntheticPQRSTGenerator.ts      [Motor base: renomeado, sem mudanças]
├── types.ts                         [Tipos estendidos com ECGPreset robusto]
├── leadTransform.ts                 [Transformação em 12 derivações: mantém]
├── index.ts                         [Export e orquestração]
│
├── presets/
│   ├── normalPresets.ts             [Normal por idade: neonato → adulto]
│   ├── rhythmPresets.ts             [Ritmos: taquicardia, bradicardia, arritmias]
│   ├── conductionPresets.ts         [Bloqueios AV, ramo]
│   ├── ischemiaPresets.ts           [Isquemia: IAMSTS, IAMBM, etc]
│   ├── overloadPresets.ts           [Sobrecargas/hipertrofias]
│   ├── electrolytePresets.ts        [Alterações eletrolíticas]
│   ├── artefactPresets.ts           [Artefatos e problemas técnicos]
│   └── index.ts                     [Export central de todos os presets]
│
└── osce/
    ├── caseMapping.ts               [Mapeamento caso → presets recomendados]
    └── educationalGuides.ts         [Guias de interpretação por caso]
```

---

## 3. TIPOS BASE (types.ts)

```typescript
export type AgeGroup = 
  | "neonato" 
  | "lactente" 
  | "pre_escolar" 
  | "escolar" 
  | "adolescente" 
  | "adulto";

export type ECGPresetCategory = 
  | "normal" 
  | "ritmo" 
  | "isquemia" 
  | "conducao" 
  | "sobrecarga" 
  | "eletrolitos" 
  | "artefato";

export type ECGPreset = {
  id: string;
  label: string;
  category: ECGPresetCategory;
  ageGroup: AgeGroup;
  description: string;
  
  // Parâmetros fisiológicos
  heartRate: number;
  rrVariability: number;
  prIntervalMs: number;
  qrsDurationMs: number;
  qtIntervalMs?: number;
  
  // Eixo e padrão
  axisProfile: "normal" | "rightward" | "leftward" | "extreme";
  
  // Morfologia P-QRS-T
  morphology: {
    pAmplitude: number;
    qAmplitude: number;
    rAmplitude: number;
    sAmplitude: number;
    tAmplitude: number;
    tPolarity?: "positive" | "negative" | "biphasic";
    stSegment?: "normal" | "elevation" | "depression";
    qrsPattern?: string;
  };
  
  // Ganhos por derivação
  leadProfile: {
    limb: Record<string, number>;
    precordial: Record<string, {
      rGain: number;
      sGain: number;
      tGain: number;
      stOffset?: number;
      polarity?: number;
    }>;
  };
  
  // Educacional
  expectedInterpretation: string[];
  teachingPoints: string[];
  warning?: string;
};
```

---

## 4. ETAPAS DE IMPLEMENTAÇÃO

### **ETAPA 1** (Atual — Estabilidade Máxima)

**Escopo**:
- ✅ Criar estrutura de arquivos e tipos
- ✅ Renomear conceito interno
- ✅ Implementar presets NORMAIS por idade (6 presets)
- ✅ Implementar presets RITMO básicos (3-4 presets)
- ✅ Implementar presets ARTEFATO básicos (2-3 presets)
- ✅ Atualizar seletor do simulador com novo agrupamento
- ✅ Testar visualmente e garantir funcionamento sem quebras

**Arquivos novos**:
- `syntheticPQRSTGenerator.ts` (renomeação de `ecgsynAdapter.ts`)
- `types.ts` (tipos estendidos)
- `presets/normalPresets.ts`
- `presets/rhythmPresets.ts`
- `presets/artefactPresets.ts`
- `presets/index.ts`
- `osce/caseMapping.ts` (básico)

**Tempo estimado**: 2-3 horas de implementação + testes

**Critério de sucesso**:
- Simulador continua funcionando
- 12 derivações aparecem
- Seletor agora agrupa por categoria
- Avisos atualizados
- Sem erros de compilação/tipo

---

### **ETAPA 2** (Próxima sessão)

**Escopo**:
- Bloqueios AV (1º, Mobitz I/II, Total)
- Bloqueios de ramo (D/E)
- Extrassístoles (SVT, VT)
- Fibrilação atrial, flutter, TSV
- Testes e refinamento

**Tempo estimado**: 2 horas

---

### **ETAPA 3** (Próxima sessão)

**Escopo**:
- Isquemia (supra/infra de ST, onda T)
- Sobrecargas/hipertrofias
- Eletrólitos (hipercalemia, hipocalemia, etc)
- Testes finais

**Tempo estimado**: 2 horas

---

## 5. PRESETS ETAPA 1

### Normais por idade (6):
1. `normal_neonato` — FC 130, eixo direita, V1 proeminente
2. `normal_lactente` — FC 120, eixo direita, V1 evidente (JÁ EXISTE)
3. `normal_pre_escolar` — FC 105, eixo normal, transição
4. `normal_escolar` — FC 90, eixo normal, progredindo para adulto
5. `normal_adolescente` — FC 75, eixo normal, semelhante adulto
6. `normal_adulto` — FC 75, eixo normal, padrão referência

### Ritmos (3):
1. `taquicardia_sinusal_pediatrica` — FC 150, P visível, QRS estreito
2. `taquicardia_sinusal_adulto` — FC 115, ritmo rápido regular
3. `bradicardia_sinusal` — FC 55, RR espaçado

### Artefatos (3):
1. `artefato_movimento_leve` — Ruído leve, QRS identificável
2. `artefato_movimento_intenso` — Ruído intenso, difícil interpretação + aviso
3. `troca_eletrodos_ra_la` — DI invertido, aVR positivo + aviso técnico

---

## 6. AVISOS ATUALIZADOS

### Ao gerar ECG:
```
"Traçado sintético gerado por modelo didático para fins educacionais. 
Não utilizar para diagnóstico clínico real."
```

### Na documentação:
```
"O motor utilizado é uma implementação educacional de morfologia P-QRS-T, 
inspirada em referências como ECGSYN/PhysioNet, mas adaptada para didática 
e OSCE. Não é validado clinicamente para uso real."
```

### Referências mantidas:
- McSharry PE, et al. 2003 (IEEE)
- Goldberger AL, et al. 2000 (Circulation)

---

## 7. TESTES VISUAIS ETAPA 1

Após implementar, garantir:

- [ ] **Normal Neonato**: FC ~130, V1 com R proeminente, eixo direita
- [ ] **Normal Lactente**: FC ~120, aVR negativo, DII positivo, V1 evidente (existente, verificar)
- [ ] **Normal Adulto**: FC ~75, progressão V1→V6 adulta
- [ ] **Taquicardia Pediátrica**: FC ~150, P antes de QRS, QRS estreito
- [ ] **Bradicardia**: FC ~55, RR bem espaçado
- [ ] **Artefato Leve**: Ruído visível, QRS identificável
- [ ] **Artefato Intenso**: Traçado ruidoso, aviso "repetir"
- [ ] **Troca RA/LA**: DI invertido, aVR positivo, aviso técnico

### Modal:
- [ ] 12 derivações aparecem todas
- [ ] Seletor agrupa por categoria (Normais, Ritmos, Artefatos)
- [ ] Nenhum erro de compilação/tipo
- [ ] Botões funcionam (Gerar, Resetar)
- [ ] Validação de eletrodos continua funcionando
- [ ] Aviso educacional visível

---

## 8. ROLLBACK STRATEGY

Se algo quebrar:
1. Manter cópia de `ecgsynAdapter.ts` original
2. Se nova estrutura falhar, reverter para original
3. Implementar mudança conceitual sem mexer em gerador (menor risco)

---

## 9. PRÓXIMOS PASSOS

1. ✅ Criar este plano (feito)
2. ⏳ Implementar estrutura Etapa 1
3. ⏳ Testar visualmente
4. ⏳ Agendar Etapa 2 com novos presets

---

**Nota**: Documento será atualizado conforme progresso.
