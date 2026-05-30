import { Caso } from "@/lib/types";

interface IntentDetection {
  tipo: string;
  confianca: number;
  resposta: string;
}

function normalizarTexto(texto: string): string {
  return texto.toLowerCase().trim();
}

function detectarIntencao(pergunta: string, caso: Caso): IntentDetection | null {
  const perguntaLower = normalizarTexto(pergunta);
  const paciente = caso.paciente;
  const respostas = caso.respostas_do_paciente;

  // SAUDAÇÃO
  if (/\b(oi|olá|bom dia|boa tarde|boa noite|tudo bem|e aí|opa|alô)\b/.test(perguntaLower)) {
    return {
      tipo: "saudacao",
      confianca: 0.95,
      resposta: `Oi, tudo bem? Tô aqui porque ${paciente.queixaPrincipal.toLowerCase()}.`,
    };
  }

  // NOME
  if (/\b(nome|como.*chama|quem.*é|identidade|seu nome)\b/.test(perguntaLower)) {
    return {
      tipo: "nome",
      confianca: 0.95,
      resposta: `Meu nome é ${paciente.nome}.`,
    };
  }

  // QUEIXA PRINCIPAL
  if (/\b(sentindo|problema|queixa|veio|trou|traz|aqui por quê|por que está aqui|dificuldade|mal)\b/.test(perguntaLower)) {
    if (perguntaLower.includes("qual") || perguntaLower.includes("o que")) {
      return {
        tipo: "queixa",
        confianca: 0.9,
        resposta: respostas.inicial || `${paciente.queixaPrincipal}.`,
      };
    }
  }

  // INÍCIO / DURAÇÃO
  if (/\b(quando.*começou|há quanto|desde quando|faz quanto|começou|duração|quanto tempo|tempo)\b/.test(perguntaLower)) {
    return {
      tipo: "inicio",
      confianca: 0.9,
      resposta: respostas.inicio || "Começou faz alguns dias.",
    };
  }

  // DOR / INTENSIDADE / LOCALIZAÇÃO
  if (/\b(dói|dor|onde.*dói|local|irradia|irradiação|intensidade|escala|de.*a.*10|força|forte|fraco|branda)\b/.test(perguntaLower)) {
    if (respostas.dor) {
      return {
        tipo: "dor",
        confianca: 0.85,
        resposta: respostas.dor,
      };
    }
  }

  // INTENSIDADE (quando pergunta especificamente por 1-10)
  if (/\b(quanto|escala|nota|pontos|intensidade|grau|forte|leve|moderado)\b/.test(perguntaLower)) {
    if (respostas.intensidade) {
      return {
        tipo: "intensidade",
        confianca: 0.85,
        resposta: respostas.intensidade,
      };
    }
  }

  // DISPNEIA / FALTA DE AR
  if (/\b(falta.*ar|cansaço|cansado|chiado|respirar|respiração|fôlego|dispneia|aperto no peito|aperto)\b/.test(perguntaLower)) {
    if (respostas.falta_ar || respostas.chiado || respostas.respiracao || respostas.aperto) {
      const resposta = respostas.falta_ar || respostas.chiado || respostas.respiracao || respostas.aperto || "Sim, tenho dificuldade para respirar.";
      return {
        tipo: "dispneia",
        confianca: 0.85,
        resposta,
      };
    }
  }

  // TOSSE
  if (/\b(tosse|catarro|expectoração|escarro|cuspe|cuspo|tossindo)\b/.test(perguntaLower)) {
    if (respostas.tosse) {
      return {
        tipo: "tosse",
        confianca: 0.9,
        resposta: respostas.tosse,
      };
    }
  }

  // FEBRE
  if (/\b(febre|temperatura|febrícul|quent|graus|febr|térmico)\b/.test(perguntaLower)) {
    if (respostas.febre) {
      return {
        tipo: "febre",
        confianca: 0.9,
        resposta: respostas.febre,
      };
    }
  }

  // SUOR / SUDORESE
  if (/\b(suor|suado|sudorese|transpiração|transpira|umidade)\b/.test(perguntaLower)) {
    if (respostas.suor) {
      return {
        tipo: "suor",
        confianca: 0.85,
        resposta: respostas.suor,
      };
    }
  }

  // ANTECEDENTES / DOENÇAS PRÉVIAS
  if (/\b(doença|hipertensão|diabetes|asma|cardíac|cardía|coração|pressão alta|problema|antecedente|histórico|passado|já teve|tinha)\b/.test(perguntaLower)) {
    if (paciente.antecedentes && paciente.antecedentes.length > 0) {
      return {
        tipo: "antecedentes",
        confianca: 0.85,
        resposta: `Sim, tenho ${paciente.antecedentes.join(" e ")}.`,
      };
    } else {
      return {
        tipo: "antecedentes",
        confianca: 0.85,
        resposta: "Não, não tenho doenças antigas que eu saiba.",
      };
    }
  }

  // MEDICAMENTOS
  if (/\b(remédio|medicação|medicamento|usa.*algo|toma|farmáco|droga|pílula|comprimido|remédios|remédios)\b/.test(perguntaLower)) {
    if (paciente.medicamentos_em_uso && paciente.medicamentos_em_uso.length > 0) {
      return {
        tipo: "medicamentos",
        confianca: 0.9,
        resposta: `Tomo ${paciente.medicamentos_em_uso.join(" e ")}.`,
      };
    } else {
      return {
        tipo: "medicamentos",
        confianca: 0.9,
        resposta: "Não, não tomo nenhum remédio regularmente.",
      };
    }
  }

  // ALERGIAS
  if (/\b(alergi|hipersensibilid|reação|intolerância)\b/.test(perguntaLower)) {
    if (paciente.alergias && paciente.alergias.length > 0) {
      return {
        tipo: "alergias",
        confianca: 0.9,
        resposta: `Sou alérgico a ${paciente.alergias.join(" e ")}.`,
      };
    } else {
      return {
        tipo: "alergias",
        confianca: 0.9,
        resposta: "Não, não tenho alergia a nada que eu saiba.",
      };
    }
  }

  // HÁBITOS - FUMO
  if (/\b(fuma|cigarro|tabaco|fumo|fumador|fumava)\b/.test(perguntaLower)) {
    if (respostas.fuma !== undefined) {
      return {
        tipo: "habitos_fumo",
        confianca: 0.85,
        resposta: respostas.fuma || "Não, nunca fumei.",
      };
    }
  }

  // HÁBITOS - ÁLCOOL
  if (/\b(bebe|álcool|bebida|alcoólica|vinho|cerveja|pinga|brinde)\b/.test(perguntaLower)) {
    if (respostas.bebida !== undefined) {
      return {
        tipo: "habitos_alcool",
        confianca: 0.85,
        resposta: respostas.bebida || "Não bebo.",
      };
    }
  }

  // HÁBITOS - EXERCÍCIO
  if (/\b(exercício|atividade.*física|esporte|academia|corrida|caminha|sedentário|ativo)\b/.test(perguntaLower)) {
    if (respostas.atividade_fisica !== undefined) {
      return {
        tipo: "habitos_exercicio",
        confianca: 0.85,
        resposta: respostas.atividade_fisica || "Não pratico atividades físicas regularmente.",
      };
    }
  }

  // FAMÍLIA / ANTECEDENTES FAMILIARES
  if (/\b(família|familiar|pai|mãe|mãe|irmão|irmã|filho|filha|parente|genético|genética|hereditário)\b/.test(perguntaLower)) {
    if (respostas.familia !== undefined) {
      return {
        tipo: "familia",
        confianca: 0.85,
        resposta: respostas.familia || "Não tenho antecedentes familiares relevantes.",
      };
    }
  }

  // Saudações/Respostas de perguntas abertas
  if (/\b(como.*está|tá bem|saudação|seja bem-vindo|olá doutor|oi doutor|oi doutora)\b/.test(perguntaLower)) {
    return {
      tipo: "saudacao_inversa",
      confianca: 0.8,
      resposta: `Oi, tudo bem? Tô aqui com alguns problemas. ${paciente.queixaPrincipal.toLowerCase()}.`,
    };
  }

  return null;
}

export function obterRespostaPaciente(
  pergunta: string,
  caso: Caso
): string {
  const deteccao = detectarIntencao(pergunta, caso);

  if (deteccao && deteccao.confianca > 0.5) {
    return deteccao.resposta;
  }

  // Fallback amigável
  return "Hmm, pode me perguntar de outra forma? Tô um pouco nervoso aqui.";
}
