# Priority 2 — Mudanças Visuais e Estruturais

## Visão Geral

3 componentes foram modificados para exibir referências clínicas direto do caso V2, **sem refazer telas, sem redesenho, apenas adição de seções informativas**.

---

## 1️⃣ PainelDiagnostico — Referência Diagnóstica

### Antes (layout)
```
┌─────────────────────────────────────┐
│ Diagnóstico e Conduta               │
├─────────────────────────────────────┤
│                                     │
│  Hipótese Principal *               │
│  [__________________________]        │
│                                     │
│  Diagnósticos Diferenciais          │
│  [_________] [+]                    │
│  [chip] [chip]                      │
│                                     │
│  Exames Indicados                   │
│  [_________] [+]                    │
│  [chip] [chip]                      │
│                                     │
│  Conduta *                          │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  [Finalizar Atendimento e Ver...]   │
└─────────────────────────────────────┘
```

### Depois (layout)
```
┌─────────────────────────────────────┐
│ Diagnóstico e Conduta               │
├─────────────────────────────────────┤
│                                     │
│  Hipótese Principal *               │
│  [__________________________]        │
│                                     │
│  Diagnósticos Diferenciais          │
│  [_________] [+]                    │
│  [chip] [chip]                      │
│                                     │
│  Exames Indicados                   │
│  [_________] [+]                    │
│  [chip] [chip]                      │
│                                     │
│  Conduta *                          │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  ▶ Referência esperada              │  ← NOVO!
│  ┌─────────────────────────────────┐│
│  │ Diagnóstico esperado:           ││  ← Pode expandir/recolher
│  │ Crise Asmática Grave            ││
│  │                                 ││
│  │ Conduta esperada:               ││
│  │ • Oxigenioterapia agressiva     ││
│  │ • Corticóide IV                 ││
│  │ • Possível intubação            ││
│  │                                 ││
│  │ Critérios de gravidade:         ││
│  │ • SpO2 <90%                     ││
│  │ • Silêncio auscultório          ││
│  │                                 ││
│  │ Erros críticos a evitar:        ││
│  │ • Não reconhecer como emergência││
│  │ • Atrasar oxigenioterapia       ││
│  └─────────────────────────────────┘│
│                                     │
│  [Finalizar Atendimento e Ver...]   │
└─────────────────────────────────────┘
```

### Mudanças de Código

**Arquivo**: `components/PainelDiagnostico.tsx`

```typescript
// ANTES
export default function PainelDiagnostico({
  onSubmit,
  onChange,
  desabilitado = false,
}: PainelDiagnosticoProps) {

// DEPOIS
export default function PainelDiagnostico({
  onSubmit,
  onChange,
  desabilitado = false,
  caso,  // ← NOVO
}: PainelDiagnosticoProps) {
  
  // ... estados
  const [referenciaAberta, setReferenciaAberta] = useState(false);  // ← NOVO
  
  // Antes do botão submit:
  {caso?.diagnostico || caso?.condutaEsperada || ... ? (
    <div className="medix-diagnosis-reference">  // ← NOVO
      <button onClick={() => setReferenciaAberta(!referenciaAberta)}>
        ▶ Referência esperada
      </button>
      {referenciaAberta && (
        <div>
          {caso?.diagnostico && <p>Diagnóstico: {caso.diagnostico}</p>}
          {caso?.condutaEsperada && <p>Conduta: {caso.condutaEsperada}</p>}
          ...
        </div>
      )}
    </div>
  ) : null}
}
```

**Linha de código**: ~60 linhas adicionadas antes do botão submit

---

## 2️⃣ FormularioSOAP — Referência SOAP

### Antes (layout)
```
┌─────────────────────────────────────┐
│ Avaliação Clínica — SOAP            │
├─────────────────────────────────────┤
│                                     │
│  [S] Subjetivo                      │
│  Sintomas, queixas, história...     │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  [O] Objetivo                       │
│  Sinais vitais, achados...          │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  [A] Avaliação                      │
│  Sua interpretação clínica...       │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  [P] Plano                          │
│  Exames, tratamento, follow-up...   │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
└─────────────────────────────────────┘
```

### Depois (layout)
```
┌─────────────────────────────────────┐
│ Avaliação Clínica — SOAP            │
├─────────────────────────────────────┤
│                                     │
│  [S] Subjetivo                      │
│  Sintomas, queixas, história...     │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  [O] Objetivo                       │
│  Sinais vitais, achados...          │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  [A] Avaliação                      │
│  Sua interpretação clínica...       │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  [P] Plano                          │
│  Exames, tratamento, follow-up...   │
│  [_________________________]         │
│  [_________________________]         │
│  [_________________________]         │
│                                     │
│  ▶ Referência esperada do SOAP      │  ← NOVO!
│  ┌─────────────────────────────────┐│
│  │ [S] Subjetivo                   ││  ← Pode expandir/recolher
│  │ • Queixa principal              ││
│  │ • História da doença            ││
│  │ • Fatores agravantes            ││
│  │                                 ││
│  │ [O] Objetivo                    ││
│  │ • Sinais vitais                 ││
│  │ • Achados físicos               ││
│  │                                 ││
│  │ [A] Avaliação                   ││
│  │ • Hipótese diagnóstica          ││
│  │ • Raciocínio clínico            ││
│  │                                 ││
│  │ [P] Plano                       ││
│  │ • Exames necessários            ││
│  │ • Tratamento                    ││
│  │ • Encaminhamentos               ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Mudanças de Código

**Arquivo**: `components/FormularioSOAP.tsx`

```typescript
// ANTES
export default function FormularioSOAP({
  onSubmit,
  onChange,
  desabilitado = false,
  caso,  // já recebia
}: FormularioSOAPProps) {

// DEPOIS
export default function FormularioSOAP({
  onSubmit,
  onChange,
  desabilitado = false,
  caso,
}: FormularioSOAPProps) {
  
  // ... estados
  const [referenciaAberta, setReferenciaAberta] = useState(false);  // ← NOVO
  
  // Depois das seções SOAP:
  {caso?.modeloSOAP ? (
    <div className="medix-soap-reference">  // ← NOVO
      <button onClick={() => setReferenciaAberta(!referenciaAberta)}>
        ▶ Referência esperada do SOAP
      </button>
      {referenciaAberta && (
        <div>
          <p>[S] Subjetivo: {caso.modeloSOAP.subjetivo}</p>
          <p>[O] Objetivo: {caso.modeloSOAP.objetivo}</p>
          <p>[A] Avaliação: {caso.modeloSOAP.avaliacao}</p>
          <p>[P] Plano: {caso.modeloSOAP.plano}</p>
        </div>
      )}
    </div>
  ) : null}
}
```

**Linha de código**: ~70 linhas adicionadas após SOAP

---

## 3️⃣ FeedbackOSCE — Escala Dinâmica

### Antes (cálculo)
```typescript
const percentual = Math.round((feedback.nota / 20) * 100);
// Sempre usa 20 como máximo
```

### Depois (cálculo)
```typescript
const notaMaxima = (caso as any)?.feedbackDetalhado?.escala?.total ?? 20;
const percentual = Math.round((feedback.nota / notaMaxima) * 100);
// Lê escala do caso, fallback para 20
```

### Exemplos de Cálculo

**Caso 1: Caso com escala dinâmica**
```
caso.feedbackDetalhado.escala.total = 30
feedback.nota = 22.5
Cálculo: (22.5 / 30) * 100 = 75%
```

**Caso 2: Caso sem escala (fallback)**
```
caso.feedbackDetalhado.escala.total = undefined
feedback.nota = 15
Cálculo: (15 / 20) * 100 = 75%
```

**Arquivo**: `components/FeedbackOSCE.tsx`

```typescript
// Linhas 108-109
const notaMaxima = (caso as any)?.feedbackDetalhado?.escala?.total ?? 20;
const percentual = Math.round((feedback.nota / notaMaxima) * 100);
```

**Mudança**: 2 linhas

---

## Resumo de Mudanças

| Componente | Arquivo | Mudanças | Tipo |
|-----------|---------|----------|------|
| PainelDiagnostico | `components/PainelDiagnostico.tsx` | ~60 linhas | Adição |
| FormularioSOAP | `components/FormularioSOAP.tsx` | ~70 linhas | Adição |
| FeedbackOSCE | `components/FeedbackOSCE.tsx` | 2 linhas | Modificação |
| **Total** | **3 arquivos** | **~132 linhas** | **Sem removals** |

---

## Garantias

✅ **Nenhuma tela foi redesenhada** — apenas seções adicionadas
✅ **Zero breaking changes** — tudo é condicional e expansível
✅ **Backward compatible** — casos sem dados não quebram
✅ **Graceful degradation** — se `caso?.diagnostico` faltar, nada aparece
✅ **Compilação sem erros** — TypeScript check passa
✅ **Performance** — useState local, sem rerenders desnecessários

---

**Data**: 5 de julho de 2026
**Commits**: 3 (um por componente)
**Status**: ✅ COMPLETO E TESTÁVEL
