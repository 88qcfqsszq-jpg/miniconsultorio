# 🏥 Mini Consultório OSCE

Ferramenta de treinamento para simulação clínica estruturada (OSCE) do 3º semestre de Medicina.

## 📋 Características

- ✅ Chat inteligente com paciente virtual
- ✅ Exame físico interativo com manobras específicas
- ✅ Formulário SOAP completo
- ✅ Feedback detalhado com 12 seções de análise
- ✅ Modo OSCE aleatório e modo treinamento direcionado
- ✅ Responsivo (desktop, tablet, mobile)
- ✅ Pronto para produção

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Chave da API OpenAI (visite [platform.openai.com](https://platform.openai.com))

### Instalação Local

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd mini-consultorio-osce
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a variável de ambiente:
```bash
cp .env.local.example .env.local
```

4. Adicione sua chave da OpenAI no arquivo `.env.local`:
```
OPENAI_API_KEY=sua_chave_aqui
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🏗️ Build e Produção

### Testar Build Localmente

```bash
npm run build
npm start
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000)

### Deploy em Produção

#### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte o repositório no [Vercel](https://vercel.com)
3. Adicione a variável de ambiente `OPENAI_API_KEY` nas configurações do Vercel
4. Deploy automático será acionado

#### Render.com

1. Conecte seu repositório GitHub
2. Crie um novo Web Service
3. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Adicione a variável de ambiente `OPENAI_API_KEY`

#### Railway.app

1. Faça login e crie um novo projeto
2. Conecte seu repositório GitHub
3. Adicione a variável de ambiente `OPENAI_API_KEY`
4. Deploy será automático

#### Node.js Servidor

```bash
# Build
npm run build

# Inicie com PM2 ou similar
npm start
```

## 🔒 Variáveis de Ambiente

### Obrigatória

- `OPENAI_API_KEY` - Chave da API OpenAI (use modelo `gpt-4` ou `gpt-3.5-turbo`)

### Opcional

- `NODE_ENV` - Deve ser `production` em produção
- `PORT` - Porta padrão é 3000

## 📱 Responsividade

O projeto é totalmente responsivo:

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

Testado em:
- Chrome
- Safari (iOS e macOS)
- Firefox
- Edge

## 🔌 APIs Internas

- `POST /api/chat-paciente` - Chat com paciente virtual
- `POST /api/exame-fisico` - Processamento de manobras de exame físico
- `POST /api/corrigir` - Geração de feedback OSCE

## 🧪 Teste Rápido

Após iniciar o servidor:

1. Vá para **Prova OSCE** ou **Treinamento**
2. Selecione um caso
3. Converse com o paciente no chat
4. Preencha o formulário SOAP
5. Clique em **Finalizar Atendimento e Ver Feedback**
6. Aguarde a IA gerar o feedback (5-10 segundos)

## ❗ Troubleshooting

### Erro: "Chave de API não configurada"

- Verifique se `.env.local` existe e contém `OPENAI_API_KEY`
- Reinicie o servidor: `npm run dev`

### Erro: "Não foi possível gerar o relatório"

- Verifique sua conexão com a internet
- Confirme que a chave OpenAI é válida
- Verifique se tem créditos na conta OpenAI

### App lento em produção

- Verifique a performance da API OpenAI
- Considere usar `gpt-3.5-turbo` se `gpt-4` estiver lento
- Ative cache do navegador nas configurações

## 📚 Estrutura do Projeto

```
mini-consultorio-osce/
├── app/                    # Rotas e páginas do Next.js
│   ├── api/               # Endpoints de API
│   ├── caso/              # Simulação de caso
│   ├── faca-o-osce/       # Modo prova
│   └── treinamento/       # Modo treinamento
├── components/            # Componentes React reutilizáveis
├── data/                  # Dados dos casos OSCE
├── lib/                   # Utilitários e tipos
├── public/                # Arquivos estáticos
└── README.md             # Este arquivo
```

## 🔄 Falhas e Recuperação

O sistema possui fallback robusto:

- Se a API OpenAI falhar, o chat usa interpretação local
- O exame físico retorna achados pré-definidos
- O feedback exibe mensagem amigável e permite tentar novamente
- Nenhum dado do aluno é perdido

## 📄 Licença

Este projeto é propriedade da instituição de ensino.

## 🤝 Contribuindo

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

## ℹ️ Suporte

Para dúvidas sobre o uso da ferramenta, entre em contato com o coordenador do curso.

---

**Versão:** 1.0.0  
**Última atualização:** 2026-05-30
