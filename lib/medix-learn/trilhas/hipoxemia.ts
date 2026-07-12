import type { LearnTrailData } from "../types";

// Fonte de verdade: MEDIX-LEARN-TRILHA-HIPOXEMIA-CONTEUDO.md
export const trilhaHipoxemia: LearnTrailData = {
  id: "hipoxemia",
  titulo: "Hipoxemia",
  subtitulo:
    "Entenda por que a SpO₂ cai, quando oxigênio resolve e quando ele não resolve.",
  publicoAlvo:
    "Ciclo básico, início do ciclo clínico e alunos em transição para OSCE.",
  badges: ["Respiratório", "Fisiologia aplicada", "Semiologia", "Raciocínio clínico"],

  objetivos: [
    "Explicar o que a SpO₂ mede e o que ela não mede.",
    "Diferenciar oxigenação de ventilação.",
    "Interpretar hipoxemia como consequência de mecanismos fisiopatológicos diferentes.",
    "Reconhecer V/Q alterado, shunt, hipoventilação e difusão prejudicada.",
    "Relacionar achados semiológicos com o mecanismo provável.",
    "Entender por que alguns pacientes melhoram com oxigênio e outros melhoram pouco.",
    "Identificar sinais de gravidade respiratória.",
    "Aplicar o raciocínio em mini-casos clínicos.",
    "Conectar a trilha com casos OSCE de asma, pneumonia, TEP e pneumotórax.",
  ],

  competencias: [
    "Interpretar SpO₂ no contexto clínico.",
    "Distinguir problema de oxigenação de problema de ventilação.",
    "Reconhecer V/Q baixo, V/Q alto, shunt e hipoventilação.",
    "Identificar quando o oxigênio trata e quando não basta.",
    "Realizar avaliação semiológica estruturada do paciente hipoxêmico.",
  ],

  secoes: [
    {
      id: "microaula",
      titulo: "O que é SpO₂?",
      paragrafos: [
        "A SpO₂ é a saturação periférica de oxigênio estimada pelo oxímetro. Ela representa, de forma indireta, a porcentagem de hemoglobina arterial ligada ao oxigênio.",
        "Em linguagem simples: a SpO₂ estima quanto da hemoglobina está \"carregada\" com oxigênio. Ela é útil porque é rápida, não invasiva e ajuda a identificar hipoxemia. Mas ela não explica sozinha a causa do problema.",
      ],
      items: [
        "Se o sangue arterial está bem saturado de oxigênio.",
        "Se há risco de hipoxemia.",
        "Se a oxigenação está melhorando ou piorando ao longo do tempo.",
        "Se uma intervenção, como oxigênio suplementar, está tendo resposta.",
      ],
      destaque:
        "SpO₂ normal não exclui gravidade. SpO₂ baixa é sinal de alerta, mas precisa ser interpretada junto com a clínica.",
    },
    {
      id: "o-que-spo2-nao-mede",
      titulo: "O que a SpO₂ não mede",
      paragrafos: [
        "Erro comum: \"A saturação está boa, então o paciente está bem.\" Essa conclusão é incompleta.",
        "Um paciente pode ter SpO₂ aparentemente aceitável e ainda estar grave — por exemplo, se estiver retendo CO₂, exausto ou com piora progressiva do trabalho respiratório.",
      ],
      items: [
        "Ventilação alveolar.",
        "Eliminação de CO₂.",
        "Trabalho respiratório.",
        "Causa da hipoxemia.",
        "Perfusão tecidual.",
        "Conteúdo total de oxigênio no sangue.",
        "Gravidade completa do paciente.",
      ],
    },
    {
      id: "oxigenacao-ventilacao",
      titulo: "Oxigenação vs Ventilação",
      paragrafos: [
        "Essa é a distinção mais importante da trilha.",
        "Oxigenação é o processo pelo qual o oxigênio chega ao sangue arterial. Depende de: oxigênio inspirado, alvéolos funcionantes, membrana alvéolo-capilar, perfusão pulmonar, relação V/Q e hemoglobina disponível. A SpO₂ conversa mais diretamente com a oxigenação.",
        "Ventilação é o movimento de ar para dentro e para fora dos pulmões, especialmente a eliminação de CO₂. É melhor avaliada por: frequência respiratória, padrão respiratório, esforço, fala, gasometria (PaCO₂) e sinais de fadiga.",
      ],
      destaque:
        "SpO₂ fala principalmente de oxigenação. CO₂ e esforço respiratório falam muito sobre ventilação. Um paciente pode oxigenar razoavelmente com O₂ suplementar, mas ventilar mal e reter CO₂.",
    },
    {
      id: "vq",
      titulo: "Relação V/Q",
      paragrafos: [
        "V/Q significa a relação entre Ventilação (ar chegando ao alvéolo) e Perfusão (sangue chegando ao capilar). Para trocar gás bem, o pulmão precisa dos dois.",
        "V/Q baixo ocorre quando há pouca ventilação em uma área ainda perfundida. Exemplos: asma, DPOC, pneumonia, atelectasia parcial. O sangue passa por regiões mal ventiladas, sai menos oxigenado e mistura-se ao sangue bem oxigenado — a SpO₂ cai. Esse mecanismo costuma melhorar, pelo menos parcialmente, com oxigênio suplementar.",
        "V/Q alto (espaço morto) ocorre quando há ventilação, mas pouca perfusão. Exemplo clássico: tromboembolismo pulmonar. A área é ventilada, mas o sangue não chega adequadamente — a ventilação é desperdiçada. A ausculta pode ser quase normal, porque o problema não é a via aérea ou o alvéolo, mas a perfusão.",
      ],
      destaque:
        "V/Q alterado é uma das causas mais comuns de hipoxemia na prática clínica.",
    },
    {
      id: "shunt",
      titulo: "Shunt",
      paragrafos: [
        "Shunt ocorre quando o sangue passa do lado venoso para o lado arterial sem ser adequadamente oxigenado. No pulmão, isso acontece quando há áreas perfundidas, mas não ventiladas.",
        "Exemplos: pneumonia extensa, atelectasia importante, edema alveolar grave.",
        "Diferença para V/Q baixo: no V/Q baixo, ainda existe alguma ventilação. No shunt verdadeiro, a ventilação é ausente ou quase ausente naquela região.",
      ],
      items: [
        "V/Q baixo costuma melhorar com oxigênio.",
        "Shunt importante melhora pouco com oxigênio — o alvéolo não recebe ar, então aumentar o O₂ inspirado não corrige aquela unidade.",
      ],
      destaque:
        "Se a SpO₂ não melhora como esperado com oxigênio, pense em shunt, doença alveolar extensa ou problema grave de perfusão/ventilação.",
    },
    {
      id: "hipoventilaçao",
      titulo: "Hipoventilação",
      paragrafos: [
        "Hipoventilação significa ventilação alveolar insuficiente. O paciente não está renovando ar adequadamente nos alvéolos.",
        "Causas comuns: depressão do SNC, sedativos/opioides, doenças neuromusculares, fadiga respiratória, obstrução grave, DPOC grave, obesidade-hipoventilação.",
      ],
      items: [
        "Na hipoventilação, a PaCO₂ tende a subir.",
        "O oxigênio pode melhorar a SpO₂, mas não corrige a ventilação.",
        "Se o problema é CO₂, oxigênio sozinho pode mascarar a gravidade.",
      ],
      destaque:
        "Na hipoventilação pura, o oxigênio pode melhorar a SpO₂, mas não corrige a retenção de CO₂ nem a falência ventilatória.",
    },
    {
      id: "quando-o2-resolve",
      titulo: "Quando o oxigênio resolve",
      paragrafos: [
        "O oxigênio suplementar ajuda muito quando o problema é principalmente falta de oxigênio chegando ao sangue por alteração V/Q leve/moderada ou baixa FiO₂.",
      ],
      items: [
        "Crise asmática com hipoxemia leve/moderada.",
        "Pneumonia com hipoxemia moderada.",
        "DPOC com alvo adequado de SpO₂.",
        "Atelectasia parcial.",
        "Baixa FiO₂ ambiental.",
      ],
      destaque:
        "Oxigênio pode melhorar o número, mas não substitui o tratamento causal. Na pneumonia, O₂ melhora a saturação — mas antibiótico e avaliação de gravidade tratam a causa.",
    },
    {
      id: "quando-o2-nao-resolve",
      titulo: "Quando o oxigênio não resolve",
      paragrafos: [
        "O oxigênio pode não resolver, ou resolver apenas parcialmente, quando o problema mecânico/fisiológico principal permanece.",
      ],
      items: [
        "Pneumotórax hipertensivo — O₂ não remove a pressão intratorácica nem reexpande o pulmão.",
        "Shunt importante — sangue continua passando por áreas sem ventilação.",
        "Hipoventilação grave — o paciente precisa ventilar melhor, não apenas receber O₂.",
        "DPOC com retenção de CO₂ — O₂ deve ser usado com alvo controlado, evitando hiperoxia.",
        "Choque com má perfusão — problema circulatório, não apenas de oxigênio inspirado.",
      ],
      destaque:
        "Pneumotórax hipertensivo: O₂ pode aumentar oferta, mas não reexpande o pulmão nem tira a pressão do tórax. A intervenção principal é descompressão/drenagem.",
    },
    {
      id: "semiologia",
      titulo: "Semiologia da hipoxemia",
      paragrafos: [
        "O aluno deve treinar a observação estruturada antes de olhar para o oxímetro.",
        "Ausculta ajuda a sugerir mecanismo: sibilos indicam obstrução; crepitações indicam doença alveolar/intersticial; murmúrio vesicular abolido unilateralmente sugere pneumotórax, derrame ou atelectasia; ausculta quase normal com dispneia súbita leva a pensar em TEP.",
        "A fala é marcador prático de gravidade: frases completas indicam menor gravidade; frases curtas indicam esforço importante; palavras isoladas indicam gravidade alta; silêncio ou sonolência indicam risco de falência respiratória.",
      ],
      items: [
        "O paciente fala frases completas?",
        "Está usando musculatura acessória?",
        "Há tiragem?",
        "Está agitado, sonolento ou confuso?",
        "A frequência respiratória está alta ou baixa demais?",
        "Há cianose?",
        "A perfusão está preservada?",
        "A ausculta tem sibilos, crepitações ou murmúrio abolido?",
        "A SpO₂ está baixa?",
      ],
      destaque:
        "Sinais de gravidade: fala entrecortada, esforço respiratório importante, uso de musculatura acessória, rebaixamento do nível de consciência, cianose, SpO₂ persistentemente baixa, silêncio auscultatório em asma grave, hipotensão, deterioração rápida.",
    },
  ],

  miniCasos: [
    {
      id: "asma",
      titulo: "Asma grave",
      cenario:
        "Paciente de 22 anos com falta de ar intensa após exposição a poeira. Ansioso, falando frases curtas, com sibilos difusos, uso de musculatura acessória e SpO₂ 88% em ar ambiente.",
      dadosChave: [
        { label: "SpO₂", valor: "88%" },
        { label: "FR", valor: "34 irpm" },
        { label: "FC", valor: "122 bpm" },
        { label: "Ausculta", valor: "Sibilos difusos, MV reduzido" },
        { label: "Fala", valor: "Frases curtas" },
      ],
      mecanismo:
        "Broncoespasmo → ar entra e sai com dificuldade → áreas mal ventiladas → alteração V/Q → SpO₂ cai.",
      perguntaCentral:
        "A SpO₂ baixa na asma significa que o alvéolo está cheio de secreção como na pneumonia?",
      respostaEsperada:
        "Não. Na asma, o problema principal é obstrução das vias aéreas e ventilação desigual. Algumas regiões recebem menos ar, apesar de ainda serem perfundidas, gerando alteração V/Q.",
      erroComum:
        "Considerar melhora da saturação como resolução completa e esquecer a reavaliação após broncodilatador.",
      ponteOSCE:
        "No OSCE: reconhecer gravidade, avaliar fala/FR/SpO₂/ausculta, iniciar tratamento adequado, reavaliar, procurar sinais de piora, evitar alta precoce.",
      accentColor: "#92400e",
      accentBg: "rgba(245,158,11,0.08)",
    },
    {
      id: "pneumonia",
      titulo: "Pneumonia",
      cenario:
        "Paciente de 68 anos com febre, tosse produtiva, dor torácica ventilatório-dependente e falta de ar. Prostrado. SpO₂ 89% em ar ambiente.",
      dadosChave: [
        { label: "SpO₂", valor: "89%" },
        { label: "FR", valor: "30 irpm" },
        { label: "FC", valor: "112 bpm" },
        { label: "Temp", valor: "39,1°C" },
        { label: "Ausculta", valor: "Crepitações em base direita" },
      ],
      mecanismo:
        "Infecção alveolar → exsudato no alvéolo → troca gasosa prejudicada → alteração V/Q ou shunt parcial → SpO₂ cai.",
      perguntaCentral:
        "Se uma área do pulmão está cheia de exsudato, por que a resposta ao oxigênio pode ser apenas parcial?",
      respostaEsperada:
        "Porque áreas pouco ou nada ventiladas não recebem bem o oxigênio inspirado. Se o sangue continua passando por essas áreas, ocorre mistura com sangue mal oxigenado.",
      erroComum:
        "Achar que oxigênio é tratamento definitivo e não reconhecer sinais sistêmicos de infecção.",
      ponteOSCE:
        "No OSCE: reconhecer síndrome infecciosa respiratória, avaliar gravidade, solicitar exames pertinentes, indicar suporte de O₂ quando necessário, tratar a causa, reavaliar resposta clínica.",
      accentColor: "#065f46",
      accentBg: "rgba(16,185,129,0.08)",
    },
    {
      id: "tep",
      titulo: "TEP",
      cenario:
        "Paciente de 35 anos, em uso de anticoncepcional e após viagem longa, com dispneia súbita e dor torácica pleurítica. Taquicárdica, SpO₂ 90%. Ausculta pulmonar sem grandes alterações.",
      dadosChave: [
        { label: "SpO₂", valor: "90%" },
        { label: "FR", valor: "28 irpm" },
        { label: "FC", valor: "128 bpm" },
        { label: "Ausculta", valor: "Sem sibilos ou crepitações" },
        { label: "Início", valor: "Súbito" },
      ],
      mecanismo:
        "Trombo na circulação pulmonar → região ventilada, mas pouco perfundida → espaço morto aumentado → V/Q alto → dispneia e hipoxemia.",
      perguntaCentral:
        "Como o paciente pode estar hipoxêmico com ausculta quase normal?",
      respostaEsperada:
        "Porque o problema não precisa estar no alvéolo ou na via aérea. No TEP, a perfusão está comprometida, mas a ventilação pode estar relativamente preservada — o achado auscultatório pode ser mínimo.",
      erroComum:
        "Descartar gravidade porque a ausculta é normal e atribuir tudo à ansiedade sem investigar fatores de risco.",
      ponteOSCE:
        "No OSCE: reconhecer dispneia súbita como alerta, investigar fatores de risco, interpretar ausculta normal sem tranquilização excessiva, avaliar estabilidade hemodinâmica.",
      accentColor: "#1d4ed8",
      accentBg: "rgba(59,130,246,0.08)",
    },
    {
      id: "pneumotorax",
      titulo: "Pneumotórax hipertensivo",
      cenario:
        "Paciente jovem após trauma torácico. Falta de ar intensa, hipotensão, taquicardia e SpO₂ 84%. Murmúrio vesicular abolido à direita, hipertimpanismo.",
      dadosChave: [
        { label: "SpO₂", valor: "84%" },
        { label: "FR", valor: "36 irpm" },
        { label: "PA", valor: "90/60 mmHg" },
        { label: "Ausculta", valor: "MV abolido à direita" },
        { label: "Percussão", valor: "Hipertimpanismo D" },
      ],
      mecanismo:
        "Ar no espaço pleural sob pressão → colapso pulmonar → ventilação prejudicada + compressão mediastinal → hipoxemia e choque obstrutivo.",
      perguntaCentral:
        "Por que oxigênio sozinho não resolve o pneumotórax hipertensivo?",
      respostaEsperada:
        "Porque o problema é mecânico. O pulmão está comprimido por ar sob pressão no espaço pleural. É necessário aliviar essa pressão com descompressão imediata.",
      erroComum:
        "Pedir exames antes de reconhecer a emergência e esperar confirmação radiológica em paciente instável.",
      ponteOSCE:
        "No OSCE: reconhecer emergência, avaliar assimetria respiratória, priorizar intervenção salvadora, não atrasar conduta por exame desnecessário, reavaliar perfusão e ventilação.",
      accentColor: "#b91c1c",
      accentBg: "rgba(239,68,68,0.08)",
    },
  ],

  questoesAtivas: [
    {
      id: "q1",
      pergunta:
        "Um paciente tem SpO₂ 88%. Isso, sozinho, permite afirmar que ele está hipoventilando?",
      resposta:
        "Não. SpO₂ baixa indica problema de oxigenação, mas não define a causa. Hipoventilação deve ser suspeitada por padrão respiratório, esforço, sonolência, gasometria e retenção de CO₂.",
    },
    {
      id: "q2",
      pergunta: "Qual a diferença entre oxigenação e ventilação?",
      resposta:
        "Oxigenação é a entrada de oxigênio no sangue arterial. Ventilação é a renovação de ar nos alvéolos, especialmente relacionada à eliminação de CO₂. Um paciente pode oxigenar razoavelmente com O₂ suplementar e ainda ventilar mal.",
    },
    {
      id: "q3",
      pergunta:
        "Paciente com dispneia súbita, dor pleurítica, taquicardia, SpO₂ baixa e ausculta normal. Qual mecanismo deve ser lembrado?",
      resposta:
        "Alteração V/Q por problema de perfusão, como TEP. A área pode estar ventilada, mas pouco perfundida — a ausculta pode ser mínima ou ausente.",
    },
    {
      id: "q4",
      pergunta:
        "Paciente com pneumonia extensa melhora pouco com oxigênio. Qual mecanismo explica isso?",
      resposta:
        "Shunt ou efeito shunt: sangue passa por áreas pouco ventiladas ou preenchidas por exsudato, limitando a resposta ao oxigênio.",
    },
    {
      id: "q5",
      pergunta: "Na crise asmática, por que fala entrecortada é sinal de gravidade?",
      resposta:
        "Porque indica limitação ventilatória e esforço respiratório importante. O paciente não consegue sustentar fala normal por falta de reserva respiratória.",
    },
    {
      id: "q6",
      pergunta:
        "Em pneumotórax hipertensivo, por que não se deve esperar apenas melhora com oxigênio?",
      resposta:
        "Porque o problema é compressivo/mecânico. O oxigênio pode melhorar temporariamente a oferta de O₂, mas não reexpande o pulmão nem corrige a pressão intratorácica.",
    },
    {
      id: "q7",
      pergunta: "O que sugere V/Q baixo?",
      resposta:
        "Pouca ventilação em uma área ainda perfundida. Exemplos: asma, DPOC, pneumonia, atelectasia parcial. Costuma responder ao menos parcialmente ao oxigênio.",
    },
    {
      id: "q8",
      pergunta:
        "O que é mais grave: SpO₂ 91% falando frases completas ou SpO₂ 95% sonolento e exausto? Justifique.",
      resposta:
        "SpO₂ 95% sonolento e exausto é mais grave. A sonolência pode indicar hipercapnia, fadiga respiratória iminente ou hipoventilação — situações de maior risco que uma SpO₂ numericamente mais baixa, porém com paciente compensado.",
    },
  ],

  mapaLinhas: [
    "HIPOXEMIA",
    "│",
    "├── Baixa FiO₂",
    "│   └── Melhora com O₂",
    "│",
    "├── Hipoventilação",
    "│   ├── CO₂ tende a subir",
    "│   ├── Ex: opioides, fadiga, neuromuscular, DPOC grave",
    "│   └── O₂ pode melhorar SpO₂, mas não corrige ventilação",
    "│",
    "├── Alteração V/Q",
    "│   ├── V/Q baixo → asma, DPOC, pneumonia",
    "│   ├── V/Q alto → TEP (espaço morto aumentado)",
    "│   └── Geralmente melhora com O₂, mas precisa tratar causa",
    "│",
    "├── Shunt",
    "│   ├── Sangue passa sem oxigenar adequadamente",
    "│   ├── Ex: pneumonia extensa, atelectasia, edema alveolar",
    "│   └── Responde pouco ao O₂ se importante",
    "│",
    "└── Causa mecânica",
    "    ├── Ex: pneumotórax hipertensivo",
    "    ├── O₂ não resolve sozinho",
    "    └── Precisa de intervenção específica",
  ],

  pontes: [
    {
      modulo: "ciclo-basico",
      titulo: "MEDIX OSCE Ciclo Básico",
      subtitulo: "Treinar o atendimento",
      casosRecomendados: ["Asma grave", "Pneumonia", "Pneumotórax", "DPOC", "Dispneia a esclarecer"],
      competencias: [
        "Colher história e reconhecer sinais de gravidade.",
        "Fazer exame físico respiratório dirigido.",
        "Solicitar exames básicos pertinentes.",
        "Formular hipótese e propor conduta inicial.",
        "Comunicar o plano ao paciente.",
      ],
      href: "/faca-o-osce",
      cor: "#6d28d9",
      corBg: "rgba(124,58,237,0.07)",
    },
    {
      modulo: "clinico",
      titulo: "MEDIX OSCE Clínico",
      subtitulo: "Simular a evolução",
      casosRecomendados: [
        "Asma grave dinâmica com Pulse",
        "DPOC exacerbado com alvo de oxigênio",
        "Pneumotórax hipertensivo com atraso terapêutico",
        "Pneumonia grave com evolução temporal",
      ],
      competencias: [
        "Observar evolução dos sinais vitais ao longo do tempo.",
        "Entender resposta temporal ao tratamento.",
        "Treinar reavaliação após cada intervenção.",
        "Evitar erro crítico que piora o paciente.",
        "Entender quando oxigênio ajuda e quando não basta.",
      ],
      href: "/casos-dinamicos",
      cor: "#0369a1",
      corBg: "rgba(14,165,233,0.07)",
    },
  ],
};
