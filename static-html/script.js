// Mini Consultório OSCE - Versão Estática
// Aplicação completamente client-side sem dependências externas

class MiniConsultorio {
  constructor() {
    this.estado = 'home';
    this.caso = null;
    this.ouvindo = false;
    this.recognition = null;
    this.dados = {
      chat: [],
      sinaisVitais: null,
      exameFisico: {},
      hipotese: '',
      diferenciais: [],
      exames: [],
      conduta: '',
      soap: { subjetivo: '', objetivo: '', avaliacao: '', plano: '' }
    };
    this.init();
  }

  init() {
    this.initializarVoz();
    this.setupEventListeners();
    this.mostrarTela('home');
  }

  initializarVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      document.getElementById('btn-microfone').style.display = 'none';
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      this.ouvindo = true;
      const btn = document.getElementById('btn-microfone');
      btn.style.background = '#ef4444';
      btn.style.opacity = '1';
      const msg = document.getElementById('msg-voz');
      msg.textContent = '🔴 Ouvindo... Fale sua pergunta agora.';
      msg.style.display = 'block';
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptParcial = event.results[i][0].transcript;
        transcript += transcriptParcial;
      }

      if (event.isFinal) {
        const input = document.getElementById('input-chat');
        const novoTexto = input.value.trim() ? `${input.value} ${transcript}` : transcript;
        input.value = novoTexto;
      }
    };

    this.recognition.onerror = (event) => {
      let mensagem = 'Erro ao capturar áudio';
      if (event.error === 'no-speech') mensagem = '⚠️ Nenhum som detectado. Tente novamente.';
      else if (event.error === 'network') mensagem = '⚠️ Erro de conexão.';
      else if (event.error === 'not-allowed') mensagem = '⚠️ Permissão de microfone negada.';

      const msg = document.getElementById('msg-voz');
      msg.textContent = mensagem;
      msg.style.background = '#fee2e2';
      msg.style.borderColor = '#fca5a5';
      msg.style.color = '#b91c1c';
      msg.style.display = 'block';
      this.ouvindo = false;
    };

    this.recognition.onend = () => {
      this.ouvindo = false;
      const btn = document.getElementById('btn-microfone');
      btn.style.background = '#9ca3af';
      const msg = document.getElementById('msg-voz');
      if (!msg.textContent.includes('⚠️')) {
        msg.style.display = 'none';
      }
    };

    document.getElementById('btn-microfone').style.display = 'inline-block';
  }

  setupEventListeners() {
    // Navbar
    document.querySelector('[data-screen="home"]')?.addEventListener('click', () => this.mostrarTela('home'));
    document.querySelector('[data-screen="prova"]')?.addEventListener('click', () => this.mostrarTela('prova'));
    document.querySelector('[data-screen="treinamento"]')?.addEventListener('click', () => this.mostrarTela('treinamento'));

    // Home - CTA buttons
    document.getElementById('btn-prova')?.addEventListener('click', () => this.iniciarProva());
    document.getElementById('btn-treinamento')?.addEventListener('click', () => this.mostrarTela('treinamento'));

    // Casos
    document.getElementById('container-casos')?.addEventListener('click', (e) => {
      const card = e.target.closest('.caso-card');
      if (card) this.selecionarCaso(parseInt(card.dataset.casoId));
    });

    // Atendimento
    document.getElementById('btn-solicitar-vitais')?.addEventListener('click', () => this.solicitarSinaisVitais());
    document.getElementById('btn-enviar-chat')?.addEventListener('click', () => this.enviarMensagemChat());
    document.getElementById('input-chat')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.enviarMensagemChat();
    });
    document.getElementById('btn-microfone')?.addEventListener('click', () => this.toggleMicrofone());

    // Exame Físico
    document.querySelectorAll('.section-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const content = e.target.closest('.exam-section').querySelector('.section-content');
        content.classList.toggle('open');
      });
    });

    document.getElementById('btn-realizar-manobra')?.addEventListener('click', () => this.realizarManobra());

    // Formulário
    document.getElementById('btn-finalizar')?.addEventListener('click', () => this.finalizarAtendimento());
    document.getElementById('btn-add-diferencial')?.addEventListener('click', () => this.adicionarDiferencial());
    document.getElementById('btn-add-exame')?.addEventListener('click', () => this.adicionarExame());
  }

  mostrarTela(tela) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`tela-${tela}`)?.classList.add('active');

    document.querySelectorAll('.navbar-links button').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-screen="${tela}"]`)?.classList.add('active');

    this.estado = tela;

    if (tela === 'treinamento') {
      this.renderizarCasos();
    }
  }

  renderizarCasos() {
    const container = document.getElementById('container-casos');
    container.innerHTML = CASOS.map(caso => `
      <div class="caso-card" data-caso-id="${caso.id}">
        <span class="caso-tema">${caso.tema}</span>
        <h3>${caso.titulo}</h3>
        <p><strong>${caso.paciente.nome}</strong>, ${caso.paciente.idade} anos</p>
        <p>${caso.queixa}</p>
      </div>
    `).join('');
  }

  iniciarProva() {
    const casoAleatorio = CASOS[Math.floor(Math.random() * CASOS.length)];
    this.selecionarCaso(casoAleatorio.id);
  }

  selecionarCaso(casoId) {
    this.caso = CASOS.find(c => c.id === casoId);
    this.resetarDados();
    this.mostrarTela('atendimento');
    this.renderizarAtendimento();
    this.iniciarChat();
  }

  resetarDados() {
    this.dados = {
      chat: [],
      sinaisVitais: null,
      exameFisico: {},
      hipotese: '',
      diferenciais: [],
      exames: [],
      conduta: '',
      soap: { subjetivo: '', objetivo: '', avaliacao: '', plano: '' }
    };
  }

  renderizarAtendimento() {
    // Header do caso
    const header = document.querySelector('.screen#tela-atendimento .panel-title');
    if (header) {
      header.textContent = this.caso.titulo;
    }

    // Informações do paciente
    const paciente = document.getElementById('info-paciente');
    if (paciente) {
      paciente.innerHTML = `
        <strong>${this.caso.paciente.nome}</strong>, ${this.caso.paciente.idade} anos, ${this.caso.paciente.sexo === 'M' ? 'Masculino' : 'Feminino'}<br>
        Queixa: ${this.caso.queixa}
      `;
    }
  }

  iniciarChat() {
    this.dados.chat = [];
    this.adicionarMensagemChat('pacient', `Oi doutor/doutora. ${this.caso.queixa}. Estou preocupado com minha saúde.`);
    this.renderizarChat();
  }

  enviarMensagemChat() {
    const input = document.getElementById('input-chat');
    const mensagem = input.value.trim();

    if (!mensagem) return;

    this.adicionarMensagemChat('user', mensagem);
    input.value = '';

    // Resposta mockada
    setTimeout(() => {
      let resposta = RESPOSTAS_CHAT.default;
      const lower = mensagem.toLowerCase();

      if (lower.includes('sintoma') || lower.includes('como') || lower.includes('começou')) {
        resposta = RESPOSTAS_CHAT.sintomas;
      } else if (lower.includes('histórico') || lower.includes('doenças') || lower.includes('pai') || lower.includes('mãe')) {
        resposta = RESPOSTAS_CHAT.historico;
      } else if (lower.includes('quanto') || lower.includes('tempo') || lower.includes('duração')) {
        resposta = RESPOSTAS_CHAT.duracao;
      } else if (lower.includes('irradia') || lower.includes('vai') || lower.includes('para')) {
        resposta = RESPOSTAS_CHAT.irradiacao;
      } else if (lower.includes('medicação') || lower.includes('toma') || lower.includes('remédio')) {
        resposta = RESPOSTAS_CHAT.medicacoes;
      } else if (lower.includes('alergia')) {
        resposta = RESPOSTAS_CHAT.alergias;
      }

      this.adicionarMensagemChat('pacient', resposta);
    }, 500);
  }

  adicionarMensagemChat(tipo, conteudo) {
    this.dados.chat.push({ tipo, conteudo });
    this.renderizarChat();
  }

  toggleMicrofone() {
    if (!this.recognition) return;

    if (this.ouvindo) {
      this.recognition.stop();
      this.ouvindo = false;
    } else {
      const msg = document.getElementById('msg-voz');
      msg.style.display = 'none';
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Erro ao iniciar microfone:', error);
        msg.textContent = '⚠️ Erro ao iniciar microfone. Recarregue a página.';
        msg.style.display = 'block';
      }
    }
  }

  renderizarChat() {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;

    messagesDiv.innerHTML = this.dados.chat.map((msg, idx) => `
      <div class="message ${msg.tipo === 'user' ? 'user' : 'pacient'}">
        <div class="message-content">${msg.conteudo}</div>
      </div>
    `).join('');

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  solicitarSinaisVitais() {
    this.dados.sinaisVitais = this.caso.sinaisVitais;
    this.renderizarSinaisVitais();
    alert('Sinais vitais solicitados com sucesso!');
  }

  renderizarSinaisVitais() {
    const container = document.getElementById('vitals-container');
    if (!container || !this.dados.sinaisVitais) return;

    container.innerHTML = `
      <div class="vital-item">
        <div class="vital-label">PA</div>
        <div class="vital-value">${this.dados.sinaisVitais.pa}</div>
      </div>
      <div class="vital-item">
        <div class="vital-label">FC (bpm)</div>
        <div class="vital-value">${this.dados.sinaisVitais.fc}</div>
      </div>
      <div class="vital-item">
        <div class="vital-label">FR (irpm)</div>
        <div class="vital-value">${this.dados.sinaisVitais.fr}</div>
      </div>
      <div class="vital-item">
        <div class="vital-label">SatO2 (%)</div>
        <div class="vital-value">${this.dados.sinaisVitais.satO2}</div>
      </div>
    `;
  }

  realizarManobra() {
    const input = document.getElementById('input-manobra');
    const select = document.getElementById('select-secao');
    const manobra = input.value.trim();
    const secao = select.value;

    if (!manobra) {
      alert('Digite a manobra a ser realizada');
      return;
    }

    // Registrar manobra
    if (!this.dados.exameFisico[secao]) {
      this.dados.exameFisico[secao] = [];
    }

    this.dados.exameFisico[secao].push(manobra);

    // Mostrar achado correspondente
    const achado = this.caso.achados[secao] || 'Achado registrado.';
    this.adicionarMensagemChat('pacient', `Ok, você realizou a manobra. ${achado}`);

    input.value = '';
    this.renderizarAchadosExame();
  }

  renderizarAchadosExame() {
    const container = document.getElementById('findings-list');
    if (!container) return;

    let html = '';
    for (const [secao, manobras] of Object.entries(this.dados.exameFisico)) {
      html += `<strong>${secao.charAt(0).toUpperCase() + secao.slice(1)}:</strong><br>`;
      manobras.forEach(m => {
        html += `<div class="finding-item">• ${m}</div>`;
      });
    }

    container.innerHTML = html || '<p style="color: var(--text-light);">Nenhuma manobra realizada ainda.</p>';
  }

  adicionarDiferencial() {
    const input = document.getElementById('input-diferencial');
    const texto = input.value.trim();

    if (!texto) return;

    this.dados.diferenciais.push(texto);
    input.value = '';
    this.renderizarTags('tags-diferenciais', this.dados.diferenciais, 'removerDiferencial');
  }

  adicionarExame() {
    const input = document.getElementById('input-exame');
    const texto = input.value.trim();

    if (!texto) return;

    this.dados.exames.push(texto);
    input.value = '';
    this.renderizarTags('tags-exames', this.dados.exames, 'removerExame');
  }

  renderizarTags(containerId, array, metodoRemover) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = array.map((item, idx) => `
      <div class="tag">
        ${item}
        <button onclick="app.${metodoRemover}(${idx})" type="button">×</button>
      </div>
    `).join('');
  }

  removerDiferencial(idx) {
    this.dados.diferenciais.splice(idx, 1);
    this.renderizarTags('tags-diferenciais', this.dados.diferenciais, 'removerDiferencial');
  }

  removerExame(idx) {
    this.dados.exames.splice(idx, 1);
    this.renderizarTags('tags-exames', this.dados.exames, 'removerExame');
  }

  finalizarAtendimento() {
    // Validar
    if (!document.getElementById('input-hipotese').value.trim()) {
      alert('Preencha a hipótese diagnóstica');
      return;
    }
    if (!document.getElementById('input-subjetivo').value.trim()) {
      alert('Preencha o subjetivo do SOAP');
      return;
    }
    if (!document.getElementById('input-objetivo').value.trim()) {
      alert('Preencha o objetivo do SOAP');
      return;
    }
    if (!document.getElementById('input-avaliacao').value.trim()) {
      alert('Preencha a avaliação do SOAP');
      return;
    }
    if (!document.getElementById('input-plano').value.trim()) {
      alert('Preencha o plano do SOAP');
      return;
    }

    // Coletar dados do formulário
    this.dados.hipotese = document.getElementById('input-hipotese').value;
    this.dados.soap = {
      subjetivo: document.getElementById('input-subjetivo').value,
      objetivo: document.getElementById('input-objetivo').value,
      avaliacao: document.getElementById('input-avaliacao').value,
      plano: document.getElementById('input-plano').value
    };
    this.dados.conduta = document.getElementById('input-conduta').value;

    // Mostrar loading
    this.mostrarLoading();
  }

  mostrarLoading() {
    const modal = document.getElementById('loading-modal');
    modal.classList.add('active');

    let percentual = 0;
    const mensagens = [
      'Iniciando análise do atendimento...',
      'Organizando histórico da anamnese...',
      'Analisando sinais vitais e exame físico...',
      'Avaliando raciocínio diagnóstico...',
      'Revisando conduta e SOAP...',
      'Gerando feedback didático...',
      'Finalizando relatório OSCE...',
      'Relatório concluído!'
    ];

    const interval = setInterval(() => {
      percentual += Math.random() * 15;
      if (percentual > 95) percentual = 95;

      const progressFill = document.querySelector('.progress-fill');
      const progressText = document.querySelector('.progress-text');
      const loadingMessage = document.getElementById('loading-message');

      if (progressFill) progressFill.style.width = percentual + '%';
      if (progressText) progressText.textContent = Math.round(percentual) + '%';

      const msgIdx = Math.floor(percentual / 12);
      if (loadingMessage && msgIdx < mensagens.length) {
        loadingMessage.textContent = mensagens[msgIdx];
      }

      if (percentual >= 95) {
        clearInterval(interval);
        // Esperar e completar
        setTimeout(() => {
          percentual = 100;
          progressFill.style.width = '100%';
          progressText.textContent = '100%';
          loadingMessage.textContent = mensagens[mensagens.length - 1];

          setTimeout(() => {
            modal.classList.remove('active');
            this.mostrarFeedback();
          }, 500);
        }, 1000);
      }
    }, 300);
  }

  mostrarFeedback() {
    const feedback = gerarFeedbackMockado(this.caso, this.dados);
    const container = document.getElementById('feedback-container');

    if (!container) {
      this.mostrarTela('atendimento');
      return;
    }

    container.innerHTML = `
      <div class="feedback-header">
        <h2>Feedback do Atendimento</h2>
        <p>${this.caso.paciente.nome}, ${this.caso.paciente.idade} anos</p>
      </div>

      <div class="feedback-score">
        <div class="score-number">${feedback.nota}</div>
        <div class="score-label">${feedback.classificacao} (${feedback.percentual}%)</div>
      </div>

      <div class="feedback-section">
        <h3>📋 Resumo do Caso</h3>
        <p><strong>Diagnóstico Esperado:</strong> ${feedback.resumoCaso.diagnosticoEsperado}</p>
        <p><strong>Síndrome Principal:</strong> ${feedback.resumoCaso.sindromePrincipal}</p>
      </div>

      <div class="feedback-section">
        <h3>✓ Acertos</h3>
        <ul class="feedback-list success">
          ${feedback.acertos.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>

      <div class="feedback-section">
        <h3>✗ Pontos de Melhoria</h3>
        <ul class="feedback-list error">
          ${feedback.erros.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>

      <div class="feedback-section">
        <h3>🔍 Manobras Realizadas</h3>
        <ul class="feedback-list">
          ${Object.entries(this.dados.exameFisico).map(([secao, manobras]) =>
            manobras.map(m => `<li>${secao}: ${m}</li>`).join('')
          ).join('') || '<li style="color: var(--text-light);">Nenhuma manobra registrada</li>'}
        </ul>
      </div>

      <div class="feedback-section">
        <h3>📚 Plano de Estudo</h3>
        <div class="plano-estudo-accordion">
          ${gerarPlanoEstudo(this.caso).map((item, idx) => {
            const topico = typeof item === 'string' ? item : item.topico;
            const explicacao = typeof item === 'string' ? '' : (item.explicacao || '');
            return `
              <div class="plano-item">
                <button class="plano-header" onclick="this.parentElement.classList.toggle('aberto')">
                  <span class="plano-numero">${idx + 1}.</span>
                  <span class="plano-topico">${topico}</span>
                  <span class="plano-icone">▶</span>
                </button>
                ${explicacao ? `<div class="plano-conteudo"><p>${explicacao}</p></div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        <button class="btn" onclick="app.voltarAoCaso()">Voltar</button>
        <button class="btn btn-success" onclick="app.repetirCaso()">Repetir Caso</button>
      </div>
    `;

    document.getElementById('tela-atendimento').appendChild(container);
  }

  voltarAoCaso() {
    this.mostrarTela('treinamento');
  }

  repetirCaso() {
    this.selecionarCaso(this.caso.id);
  }
}

// Inicializar app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new MiniConsultorio();
});
