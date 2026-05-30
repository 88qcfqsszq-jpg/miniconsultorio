# 🏥 Mini Consultório OSCE - Versão Estática

Versão HTML/CSS/JavaScript pura do Mini Consultório OSCE, otimizada para GitHub Pages.

## ✨ Características

- ✅ Funciona completamente no navegador (sem servidor)
- ✅ Sem dependências externas
- ✅ Responsivo para desktop, tablet e mobile
- ✅ Chat mockado com respostas contextuais
- ✅ Exame físico interativo
- ✅ Feedback simulado baseado nos dados do caso
- ✅ Totalmente offline (funciona sem conexão)
- ✅ Pronto para GitHub Pages

## 📁 Estrutura

```
static-html/
├── index.html      # Página principal
├── styles.css      # Estilos responsivos
├── script.js       # Lógica da aplicação
├── data.js         # Dados dos casos (mockados)
└── README.md       # Este arquivo
```

## 🚀 Como Usar Localmente

### Opção 1: Abrir Diretamente no Navegador

1. Abra o arquivo `index.html` diretamente no navegador:
   ```bash
   # macOS/Linux
   open static-html/index.html
   
   # Windows
   start static-html\index.html
   ```

2. Ou clique duplo no arquivo `index.html`

### Opção 2: Usar um Servidor Local (Recomendado)

**Python 3:**
```bash
cd static-html
python -m http.server 8000
```

**Python 2:**
```bash
cd static-html
python -m SimpleHTTPServer 8000
```

**Node.js (com http-server):**
```bash
npm install -g http-server
cd static-html
http-server
```

**Live Server (VSCode):**
1. Instale a extensão "Live Server" no VSCode
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"

Acesse `http://localhost:8000` no navegador.

## 📤 Deploy no GitHub Pages

### Passo 1: Configurar o Repositório

1. Faça fork ou crie um repositório no GitHub chamado `seu-usuario.github.io`

2. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-usuario.github.io.git
cd seu-usuario.github.io
```

### Passo 2: Adicionar os Arquivos Estáticos

Coloque os arquivos da pasta `static-html` na raiz do repositório:

```bash
# Copie os arquivos
cp -r mini-consultorio-osce/static-html/* .
```

A estrutura deve ficar assim:
```
seu-usuario.github.io/
├── index.html
├── styles.css
├── script.js
├── data.js
└── README.md
```

### Passo 3: Commit e Push

```bash
git add .
git commit -m "Adicionar Mini Consultório OSCE estático"
git push origin main
```

### Passo 4: Acessar

Seu app estará disponível em: `https://seu-usuario.github.io`

---

## 🔄 Alternativa: GitHub Pages em Subpasta

Se preferir manter em um repositório existente:

1. Coloque os arquivos em uma pasta chamada `docs/`:

```bash
mkdir docs
cp -r static-html/* docs/
```

2. Nas configurações do repositório no GitHub:
   - Vá para **Settings** → **Pages**
   - Em **Source**, selecione `main branch /docs folder`
   - Clique **Save**

3. Seu app estará em: `https://seu-usuario.github.io/seu-repositorio`

---

## 📱 Funcionalidades

### Prova OSCE
- Seleciona um caso aleatório
- Não revela o diagnóstico até o final
- Chat interativo com respostas mockadas
- Sinais vitais disponíveis após solicitação
- Exame físico com 5 categorias

### Treinamento
- Lista todos os casos disponíveis
- Escolha o caso específico
- Mesmo fluxo da prova

### Atendimento
- Chat com paciente virtual
- Sinais vitais
- Exame físico interativo (5 categorias)
- Formulário SOAP completo
- Hipótese diagnóstica e diferenciais
- Exames complementares
- Conduta

### Feedback
- Nota de 0-10
- Acertos e erros
- Manobras realizadas
- Diagnóstico esperado (revelado no feedback)
- **Plano de Estudo Expansível**: Clique em cada tópico para ler explicações didáticas sobre por que revisar aquele tema

---

## 🔧 Modificar os Casos

Os casos estão definidos em `data.js`. Para adicionar ou modificar um caso:

```javascript
const CASOS = [
  {
    id: 6,  // ID único
    tema: "Novo Tema",  // Categoria
    titulo: "Título do Caso",
    paciente: {
      nome: "Nome do Paciente",
      idade: 45,
      sexo: "M"  // "M" ou "F"
    },
    queixa: "Queixa principal",
    diagnosticoCorreto: "Diagnóstico esperado",
    sinaisVitais: {
      pa: "120/80 mmHg",
      fc: 72,
      fr: 16,
      satO2: "98%"
    },
    achados: {
      geral: "Descrição dos achados gerais",
      cardiovascular: "Descrição dos achados cardiovasculares",
      respiratorio: "Descrição dos achados respiratórios",
      abdominal: "Descrição dos achados abdominais",
      membros: "Descrição dos achados nos membros"
    }
  }
];
```

---

## 🎓 Customizar Plano de Estudo

O Plano de Estudo pode ser personalizado editando a função `gerarPlanoEstudo()` em `data.js`:

```javascript
function gerarPlanoEstudo(caso) {
  const planos = {
    "Cardiovascular": [
      {
        topico: "Seu tópico aqui",
        explicacao: "Explicação didática para o estudante. Motive por que revisar este tema, em linguagem clara e prática."
      }
    ],
    "Respiratório": [
      // ... mais tópicos
    ]
  };
  // ...
}
```

Cada tópico contém:
- **topico**: Título curto do tema a revisar
- **explicacao**: Parágrafo de 3-6 linhas explicando por que revisar, relacionado ao erro do estudante

---

## 🎨 Customizar Estilos

Os estilos estão em `styles.css`. As cores principais estão em variáveis CSS:

```css
:root {
  --primary: #2563eb;        /* Azul principal */
  --success: #16a34a;        /* Verde sucesso */
  --danger: #dc2626;         /* Vermelho erro */
  --text-dark: #1f2937;      /* Texto escuro */
  --bg-light: #f3f4f6;       /* Fundo claro */
}
```

---

## 📝 Notas Importantes

- **Sem Backend**: Não há chamadas a servidores. Tudo é local.
- **Sem IA**: O feedback é mockado e baseado em regras simples.
- **Sem Autenticação**: Não há login. Use como você quiser.
- **Offline-First**: Funciona completamente sem internet.
- **Responsivo**: Testado em desktop, tablet e mobile.

---

## 🚀 Próximos Passos

Para funcionalidades avançadas, considere:

1. **Integrar com Backend Next.js**:
   - Substitua as chamadas mockadas por chamadas ao servidor real
   - Use a API em `/api/chat-paciente`, `/api/exame-fisico`, `/api/corrigir`

2. **Adicionar Persistência**:
   - Use localStorage para salvar progresso
   - Implemente banco de dados

3. **Melhorar Feedback**:
   - Integre com IA real (OpenAI, Anthropic)
   - Análise mais detalhada dos dados

---

## 📞 Suporte

Para problemas ou sugestões, abra uma issue no repositório principal.

---

**Versão:** 1.0.0  
**Licença:** Propriedade da instituição de ensino  
**Última atualização:** 2026-05-30
