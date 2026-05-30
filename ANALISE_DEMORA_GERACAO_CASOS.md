# 🔍 Análise: Demora na Geração de Casos

**Data:** 30 de Maio de 2026  
**Status:** ⚠️ **PROBLEMA IDENTIFICADO**

---

## 📊 Testes Realizados

### 1. Teste da API
```
Comando: curl -X POST http://localhost:3000/api/gerar-caso
Resposta: ✅ HTTP 200 OK
Tempo total: 25-26 segundos
JSON: ✅ Válido e completo
```

**Resultado:** A API funciona corretamente. O tempo de 25-26 segundos é esperado porque:
- OpenAI `gpt-4o-mini` leva tempo para processar
- Prompt é complexo (3000 caracteres)
- Resposta é grande (5760 bytes de JSON)

---

## ⚠️ PROBLEMA IDENTIFICADO

### Cenário do Problema

Quando o usuário:
1. Clica em "🤖 Gerar Novo Caso com IA"
2. Preenche os campos
3. Clica em "✨ Gerar Novo Caso"
4. Aguarda > 1 minuto
5. **Nada acontece**

### Causa Raiz: Caso Gerado Não Carrega

**Arquivo:** `app/caso/[id]/page.tsx`, linhas 69-75

```typescript
useEffect(() => {
  const casoEncontrado = casosOSCE.find((c) => c.id === casoId);
  if (casoEncontrado) {
    setCaso(casoEncontrado);
    setTempoInicio(Date.now());
  }
}, [casoId]);
```

**Problema:**
- O código APENAS busca em `casosOSCE` (lista estática de 14 casos)
- Um caso gerado tem ID como `"gerado_1704063600"` (timestamp)
- Este ID **nunca** será encontrado em `casosOSCE`
- Logo: `casoEncontrado = undefined`
- O `setCaso(undefined)` deixa a página **em branco**

---

## 🔄 Fluxo Atual (Quebrado)

```
1. Usuário clica "Gerar Novo Caso"
   ↓
2. [25-26 segundos] OpenAI gera caso ✅
   ↓
3. API retorna JSON com sucesso ✅
   ↓
4. handleCasoGerado() chama:
   - sessionStorage.setItem("casoGerado", JSON.stringify(caso)) ✅
   - router.push(`/caso/${caso.id}`) ✅
   ↓
5. Página /caso/[id] carrega
   ↓
6. useEffect procura caso em casosOSCE ❌
   ↓
7. Não encontra (ID é "gerado_...")
   ↓
8. Estado `caso` fica null
   ↓
9. Página renderiza vazia ❌
```

---

## 💾 Dados Salvos Mas Não Usados

```javascript
// No sessionStorage (SIM, foi salvo):
{
  "id": "gerado_1704063600",
  "titulo": "Dor torácica em paciente masculino de 45 anos",
  "paciente": { "nome": "Carlos Silva", ... },
  "diagnostico_principal": "Infarto Agudo do Miocárdio",
  // ... (todos os campos do caso)
}
```

```typescript
// No código da página (NÃO está sendo usado):
useEffect(() => {
  // ← Deveria verificar aqui!
  // const casoGerado = sessionStorage.getItem("casoGerado");
  // if (casoGerado) setCaso(JSON.parse(casoGerado));
  
  const casoEncontrado = casosOSCE.find((c) => c.id === casoId); // ← Procura errado
  if (casoEncontrado) {
    setCaso(casoEncontrado); // ← Nunca executa para casos gerados
    setTempoInicio(Date.now());
  }
}, [casoId]);
```

---

## 📈 Por Que Demora > 1 Minuto?

1. **Tempo real de processamento:** 25-26 segundos (OpenAI)
2. **Rendering do caso (se funcionasse):** < 1 segundo
3. **O que acontece:** O usuário vê tela em branco e espera "algo carregar"
4. **Timeout do navegador:** Alguns navegadores têm timeout de 120 segundos (2 min)
5. **Resultado:** Usuário vê loading infinito até dar timeout

---

## 🚨 Impacto

| Aspecto | Status |
|--------|--------|
| Geração da IA | ✅ Funciona |
| Salvamento em sessionStorage | ✅ Funciona |
| Navegação para página | ✅ Funciona |
| Carregamento do caso | ❌ **NÃO FUNCIONA** |
| Renderização da página | ❌ **VAZIA/NULL** |

---

## 🔧 Solução Necessária

No arquivo `app/caso/[id]/page.tsx`, na função `useEffect` (linhas 69-75):

1. **Adicionar verificação de `sessionStorage`** antes de procurar em `casosOSCE`
2. **Lógica corrigida:**
   ```typescript
   useEffect(() => {
     // 1. Primeiro: verificar sessionStorage (casos gerados)
     const casoGerado = sessionStorage.getItem("casoGerado");
     if (casoGerado) {
       try {
         const caso = JSON.parse(casoGerado);
         if (caso.id === casoId) {
           setCaso(caso);
           setTempoInicio(Date.now());
           sessionStorage.removeItem("casoGerado"); // Limpar após usar
           return;
         }
       } catch (e) {
         console.error("Erro ao parsear caso gerado:", e);
       }
     }
     
     // 2. Depois: procurar em casos estáticos
     const casoEncontrado = casosOSCE.find((c) => c.id === casoId);
     if (casoEncontrado) {
       setCaso(casoEncontrado);
       setTempoInicio(Date.now());
     }
   }, [casoId]);
   ```

---

## 📋 Resumo da Investigação

| Ponto | Conclusão |
|-------|-----------|
| **Tempo de geração da IA** | Normal (25-26s) ✅ |
| **Tempo de transmissão** | Normal ✅ |
| **Salvamento de dados** | Funcionando ✅ |
| **Navegação** | Funcionando ✅ |
| **Carregamento do caso** | ❌ **FALHA AQUI** |
| **Motivo da demora** | Timeout do navegador aguardando renderização que nunca chega |

---

## 🎯 Próxima Ação

Aguardar aprovação do usuário para corrigir `app/caso/[id]/page.tsx` adicionando verificação de `sessionStorage` no `useEffect`.
