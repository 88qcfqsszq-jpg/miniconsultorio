# Teste do Endpoint com Integração Fase 1

## Endpoint: `/api/exams/references`

O endpoint foi integrado com a Fase 1 (Scoring por Metadados) para TB e PAC.

### Fluxo Implementado

```
Requisição: GET /api/exams/references?diagnosis=<diagnosis>&limit=<n>&debug=<true/false>
                                      ↓
                            Validar parâmetros
                                      ↓
                    Verificar se mapeado em Fase 1
                         ↙                      ↖
                    SIM (TB/PAC)            NÃO (outro)
                         ↓                        ↓
                 Fase 1 Handler          Legacy Handler
                         ↓                        ↓
          Buscar múltiplas imagens   Buscar 1 imagem
          Aplicar scoring             Retornar resultado
          Retornar aprovadas
```

---

## 🧪 Testes de Validação

### Teste 1: Tuberculose (P0)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=tuberculose&limit=3" | python3 -m json.tool
```

**Resposta Esperada:**
```json
{
  "sucesso": true,
  "imagens": [
    {
      "imageId": "openi-...",
      "imageUrl": "https://openi.nlm.nih.gov/...",
      "diagnosisKey": "tuberculosis",
      "queryUsada": "tuberculosis chest xray",
      "achadoPrincipal": "Right upper lobe cavitary lesion",
      "impression": "...",
      "fonte": "Open-i / Indiana University Chest X-ray Collection",
      "expectedFinding": "Radiografia de tórax evidencia infiltrado opaco nos segmentos apicais e posteriores do lobo superior..."
    }
  ],
  "diagnosisKey": "tuberculosis",
  "fase": "1 (Scoring por Metadados)",
  "fonte": "Open-i / Indiana University",
  "mensagem": "1 imagem(ns) aprovada(s) por scoring"
}
```

**Status Esperado:** ✅ 200 OK (imagens aprovadas) ou 404 (sem aprovadas)

---

### Teste 2: Pneumonia Adquirida (P0)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumonia%20adquirida%20na%20comunidade&limit=3" | python3 -m json.tool
```

**Resposta Esperada:**
```json
{
  "sucesso": true,
  "imagens": [
    {
      "imageId": "openi-...",
      "imageUrl": "https://openi.nlm.nih.gov/...",
      "diagnosisKey": "pneumonia",
      "queryUsada": "pneumonia consolidation",
      "achadoPrincipal": "Left lower lobe consolidation",
      "impression": "Left lower lobe consolidation consistent with pneumonia",
      "fonte": "Open-i / Indiana University Chest X-ray Collection",
      "expectedFinding": "Radiografia de tórax em PA e perfil mostra infiltrado consolidativo..."
    }
  ],
  "diagnosisKey": "pneumonia",
  "fase": "1 (Scoring por Metadados)",
  "fonte": "Open-i / Indiana University",
  "mensagem": "1+ imagem(ns) aprovada(s) por scoring"
}
```

**Status Esperado:** ✅ 200 OK (imagens aprovadas) ou 404 (sem aprovadas)

---

### Teste 3: Com Debug (mostra scores)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=TB&limit=3&debug=true" | python3 -m json.tool
```

**Resposta Esperada (com scores):**
```json
{
  "sucesso": true,
  "imagens": [
    {
      "imageId": "openi-...",
      "imageUrl": "https://openi.nlm.nih.gov/...",
      "diagnosisKey": "tuberculosis",
      "queryUsada": "tuberculosis chest xray",
      "achadoPrincipal": "...",
      "impression": "...",
      "fonte": "...",
      "expectedFinding": "...",
      "scoreRelevancia": 150,
      "termosEncontrados": ["tuberculosis", "cavitary", "upper lobe"],
      "scoreBreakdown": {
        "strongPositive": 150,
        "secondaryPositive": 0,
        "blocker": 0,
        "criticalBlocker": 0
      }
    }
  ],
  "diagnosisKey": "tuberculosis",
  "fase": "1 (Scoring por Metadados)",
  "resumoScoring": {
    "totalCandidatas": 5,
    "aprovadas": 2,
    "rejeitadas": 3,
    "minScore": 50
  }
}
```

---

### Teste 4: Diagnóstico Não Mapeado (Fluxo Legado)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=asma&limit=5" | python3 -m json.tool
```

**Resposta Esperada (fluxo legado):**
```json
{
  "sucesso": true,
  "imagens": [
    {
      "imageId": "...",
      "imageUrl": "...",
      "source": "...",
      "labels": ["Asthma"]
    }
  ],
  "fase": "Legado",
  "fonte": "Open-i / Indiana University Chest X-ray Collection",
  "mensagem": "1 imagem encontrada"
}
```

**Status Esperado:** ✅ 200 OK ou 404 (sem imagens)

---

### Teste 5: Parâmetro Inválido

```bash
curl -s "http://localhost:3000/api/exams/references?limit=5" | python3 -m json.tool
```

**Resposta Esperada:**
```json
{
  "sucesso": false,
  "motivo": "Parâmetro 'diagnosis' é obrigatório",
  "mensagem": "Forneça um diagnóstico válido"
}
```

**Status Esperado:** ❌ 400 Bad Request

---

## 📊 Tabela de Resultados Esperados

| Diagnóstico | Alias | diagnosisKey | Min Score | Resultado Esperado | Status |
|---|---|---|---|---|---|
| tuberculose | TB, tuberculosis | tuberculosis | 50 | Imagens aprovadas ou 404 | ✅ P0 |
| tuberculose pulmonar | - | tuberculosis | 50 | Imagens aprovadas ou 404 | ✅ P0 |
| pneumonia | PAC | pneumonia | 50 | Imagens aprovadas ou 404 | ✅ P0 |
| pneumonia adquirida | - | pneumonia | 50 | Imagens aprovadas ou 404 | ✅ P0 |
| asma | - | ❌ NÃO | - | Usa fluxo legado | ⚠️ Legado |
| DPOC | - | ❌ NÃO | - | Usa fluxo legado | ⚠️ Legado |
| (inválido) | - | - | - | 400 Bad Request | ❌ Erro |

---

## 🔍 O que Validar

### Fase 1 (TB/PAC)
- ✅ Diagnóstico resolvido para diagnosisKey correto
- ✅ Imagens retornadas são aprovadas (score >= 50)
- ✅ Imagens normais/fracas são rejeitadas
- ✅ Campo `expectedFinding` contém descrição completa
- ✅ Se debug=true, mostra scoreRelevancia e termosEncontrados
- ✅ Se debug=false, não mostra scores (apenas no debug)

### Fluxo Legado (outros diagnósticos)
- ✅ Diagnóstico não encontrado em P0 é processado com provider legado
- ✅ Retorna `"fase": "Legado"`
- ✅ Funciona normalmente com limitações do provider antigo

### Conformidade
- ✅ Sem curadoria visual (score baseado em metadados)
- ✅ Sem downloads de imagens
- ✅ Sem salvamento local
- ✅ Sem geração por IA
- ✅ Sem alteração de componentes críticos

---

## 🛠️ Como Testar Localmente

### 1. Iniciar servidor de desenvolvimento
```bash
cd /Users/marceloalmeida/Projetos/mini-consultorio-osce
npm run dev
```

### 2. Executar testes em outro terminal

**Teste TB:**
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=tuberculose&limit=3" | python3 -m json.tool
```

**Teste PAC:**
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumonia%20adquirida%20na%20comunidade&limit=3" | python3 -m json.tool
```

**Teste TB com debug:**
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=TB&limit=3&debug=true" | python3 -m json.tool
```

**Teste Legado (Asma):**
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=asma&limit=5" | python3 -m json.tool
```

---

## 📋 Checklist de Validação

- [ ] TB retorna apenas imagens com score >= 50
- [ ] PAC retorna apenas imagens com score >= 50
- [ ] Imagens normais são rejeitadas (score < 50)
- [ ] Score correto exibido quando debug=true
- [ ] Score NÃO exibido quando debug=false
- [ ] Diagnósticos não P0 usam fluxo legado
- [ ] Campo expectedFinding é educacionalmente útil
- [ ] Sem erros de importação TypeScript
- [ ] Endpoint responde em < 5 segundos
- [ ] Logs mostram fase usada (Fase 1 ou Legado)

---

## 🔧 Implementação Técnica

### Arquivos Modificados
- ✅ `app/api/exams/references/route.ts` - Integração Fase 1
- ✅ `lib/radiology/providers/openiCloudProvider.ts` - Exportar `buscarMultiplasImagensEmOpenI`

### Funções Importadas
- `applyPhase1Scoring` - Aplica scoring automático
- `isPhase1Mapped` - Verifica se diagnóstico está em P0
- `resolveDiagnosisForPhase1` - Resolve diagnosisKey
- `buscarMultiplasImagensEmOpenI` - Busca múltiplas imagens

### Fluxo de Decisão
1. Se `isPhase1Mapped(diagnosis)` → Fase 1
2. Senão → Fluxo Legado

---

## 📊 Métricas Esperadas

**Casos de Sucesso:**
- TB: 60-70% das imagens candidatas aprovadas
- PAC: 70-80% das imagens candidatas aprovadas

**Casos de Falha:**
- Imagens normais: 100% rejeitadas
- Diagnósticos não P0: Processados com fluxo legado

---

**Implementação:** ✅ Concluída  
**Data:** 23 de junho de 2026  
**Status:** Pronto para testes
