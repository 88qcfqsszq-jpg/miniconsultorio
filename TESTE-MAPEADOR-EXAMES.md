# Testes do Mapeador de Exames V2

## Objetivo
Validar que a API `app/api/exames-complementares/route.ts` busca corretamente exames no caso V2 estruturado.

## Casos de Teste

### Teste 1: Caso Adulto - Asma Aguda Grave (ID: 3)

**Solicitar:**
- Hemograma
- Gasometria
- Oximetria

**Esperado:**
- API retorna `encontrado: true`
- Dados vêm de `caso.exames.laboratoriais` ou `caso.exames.beiraLeito`
- Não usa fallback contextual

**Como testar manualmente:**
```bash
curl -X POST http://localhost:3000/api/exames-complementares \
  -H "Content-Type: application/json" \
  -d '{
    "casoId": "3",
    "exameSolicitado": "hemograma",
    "historico": []
  }'
```

### Teste 2: Caso Pediátrico - Febre em Criança (ID: ped-01)

**Solicitar:**
- Hemograma
- Urina tipo 1
- PCR

**Esperado:**
- API retorna `encontrado: true`
- Dados vêm do caso pediátrico em `caso.exames.laboratoriais`
- Resultado completo com valores e interpretação

**Como testar:**
```bash
curl -X POST http://localhost:3000/api/exames-complementares \
  -H "Content-Type: application/json" \
  -d '{
    "casoId": "ped-01",
    "exameSolicitado": "hemograma",
    "historico": []
  }'
```

### Teste 3: Exame Inexistente

**Solicitar:**
- Exame que não existe no caso

**Esperado:**
- API retorna `encontrado: false`
- Mensagem: "Exame não disponível neste caso."

**Como testar:**
```bash
curl -X POST http://localhost:3000/api/exames-complementares \
  -H "Content-Type: application/json" \
  -d '{
    "casoId": "3",
    "exameSolicitado": "mamografia",
    "historico": []
  }'
```

### Teste 4: Sinônimos

**Solicitar (mesma solicitação, múltiplas formas):**
- "hemograma"
- "hemograma completo"
- "serie vermelha"
- "plaquetas"

**Esperado:**
- Todas retornam o mesmo resultado
- Normalização funciona corretamente

### Teste 5: ECG (Complementar)

**Solicitar:**
- "ECG"
- "eletrocardiograma"

**Esperado:**
- Busca em `caso.exames.cardiologicos.ecg`
- Retorna resultado se existir no caso

## Estrutura de Resposta Esperada

```json
{
  "encontrado": true,
  "tipo": "laboratorial",
  "grupo": "laboratoriais",
  "campo": "hemograma",
  "resultado": "...",
  "valores": {...},
  "interpretacao": "...",
  "prioridade": "...",
  "observacao": "...",
  "valoresReferenciaPediatricos": "...",
  "exameCompleto": {...}
}
```

ou

```json
{
  "encontrado": false,
  "mensagem": "Exame não disponível neste caso."
}
```

## Casos Reais para Teste

1. **Caso 3 (Asma Aguda)** - deve ter:
   - `exames.laboratoriais.hemograma`
   - `exames.laboratoriais.gasometria`
   - `exames.beiraLeito.oximetria`

2. **Caso ped-01 (Febre em Criança)** - deve ter:
   - `exames.laboratoriais.hemograma`
   - `exames.laboratoriais.urinaTipo1`
   - `exames.laboratoriais.marcadoresInflamatorios`

3. **Casos Cardiovasculares** - devem ter:
   - `exames.cardiologicos.ecg`
   - `exames.cardiologicos.ecocardiograma`

## Checklist de Validação

- [ ] Teste 1: Hemograma retorna resultado do caso adulto
- [ ] Teste 1: Gasometria retorna resultado do caso adulto
- [ ] Teste 1: Oximetria retorna resultado (beiraLeito)
- [ ] Teste 2: Hemograma retorna resultado do caso pediátrico
- [ ] Teste 2: Urina tipo 1 retorna resultado
- [ ] Teste 2: PCR/Marcadores retornam resultado
- [ ] Teste 3: Exame inexistente retorna mensagem correta
- [ ] Teste 4: Sinônimos são reconhecidos corretamente
- [ ] Teste 5: ECG é buscado em cardiologicos
- [ ] Resposta tem estrutura completa (resultado, valores, interpretação)
- [ ] Não usa fallback contextual quando encontra no caso V2

## Status

- [ ] Implementação: CONCLUÍDO
- [ ] Compilação: ✅ PASSOU
- [ ] Testes manuais: PENDENTE
- [ ] Integração: PRONTO

## Próximos Passos

1. Rodar desenvolvimento local
2. Testar cada cenário acima
3. Verificar se os casos V2 têm os exames estruturados
4. Ajustar estrutura de casos se necessário
5. Documentar resultados
