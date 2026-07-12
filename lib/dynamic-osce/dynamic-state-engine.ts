// ============================================================================
// Casos OSCE Dinâmicos — Beta · MOTOR DE ESTADO (medix-rule-based)
// ----------------------------------------------------------------------------
// Física de regras SIMPLES e determinística: recebe (estado, intervenção,
// tempo) e devolve novo estado + mensagem + eventos + tendência. NÃO usa Pulse.
// A interface já está preparada para um adapter futuro (simulationProvider).
// PURO: sem IA, sem rede, sem efeitos colaterais globais.
// ============================================================================

import type {
  InterventionId,
  PatientState,
  StateTransitionResult,
  TimelineEvent,
  TrendDirection,
  ClinicalStatus,
} from "./types";
import { obterIntervencao } from "./dynamic-intervention-engine";

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

let _seq = 0;
function novoEvento(
  tMin: number,
  titulo: string,
  detalhe: string,
  tendencia: TrendDirection,
  tipo: TimelineEvent["tipo"]
): TimelineEvent {
  _seq += 1;
  return { id: `evt-${tMin}-${_seq}`, tMin, titulo, detalhe, tendencia, tipo };
}

/** Recalcula o quadro clínico textual a partir dos números atuais. */
export function recomputarClinica(s: PatientState): ClinicalStatus {
  const { spo2, fr, paSys } = s.vitals;

  // Ramo PNEUMOTÓRAX HIPERTENSIVO (quando o marcador de tensão está presente).
  if (typeof s.tensaoPneumotorax === "number") {
    const tensao = s.tensaoPneumotorax;
    const trabalho =
      tensao > 50 ? "muito aumentado" : tensao > 20 ? "aumentado" : "próximo do normal";
    const auscultaPn = s.drenado
      ? "murmúrio vesicular retornando no hemitórax afetado"
      : s.descomprimido
        ? "murmúrio vesicular em recuperação após alívio"
        : tensao > 40
          ? "murmúrio vesicular abolido no hemitórax afetado"
          : "murmúrio vesicular reduzido unilateralmente";
    const estadoPn =
      spo2 < 85 || paSys < 90
        ? "grave, ansioso, dispneico"
        : spo2 < 92
          ? "dispneico, em estabilização"
          : "estável, respondendo ao tratamento";
    // Perfusão: lentificada quando há tensão alta, hipoxemia grave ou PA limítrofe/baixa.
    // Melhora gradual após descompressão + estabilização.
    const perfusaoPn: string =
      tensao >= 70 || spo2 < 90 || paSys <= 90
        ? "lentificada"
        : s.descomprimido && spo2 >= 92 && paSys >= 100
          ? s.drenado
            ? "preservada"
            : "melhorando"
          : "reduzida";
    return {
      estadoGeral: estadoPn,
      trabalhoRespiratorio: trabalho,
      ausculta: auscultaPn,
      fala: fr > 30 || spo2 < 90 ? "frases entrecortadas" : "frases completas",
      perfusao: perfusaoPn,
    };
  }

  // Ramo DPOC EXACERBADO (retenção de CO₂ presente).
  if (s.retencaoCO2 !== undefined) {
    const co2 = s.retencaoCO2;
    const bronco = s.broncodilatacaoDpoc ?? 0;
    const trabalho = bronco > 60 ? "muito aumentado" : bronco > 30 ? "aumentado" : "próximo do normal";
    const ausculta =
      bronco > 60
        ? "roncos e sibilos difusos, murmúrio reduzido (tórax em barril)"
        : bronco > 30
          ? "sibilos esparsos e roncos, murmúrio diminuído"
          : "roncos dispersos, murmúrio diminuído cronicamente";
    const estadoGeral =
      s.hiperoxia
        ? "sonolento, confuso — possível agravamento por CO₂ elevado (hiperóxia)"
        : spo2 < 88
          ? "dispneico, ansioso, cansado — hipoxemia importante sem melhora"
          : spo2 <= 92
            ? "dispneico, cansado, alerta — SpO₂ em alvo (88–92%)"
            : "mais confortável; SpO₂ acima do alvo — monitorar nível de consciência";
    const fala = fr > 26 || spo2 < 88 ? "frases entrecortadas" : "frases curtas";
    const perfusao =
      spo2 < 84 || paSys > 160
        ? "comprometida"
        : s.vniAplicada
          ? "melhorando"
          : co2 > 60
            ? "reduzida"
            : "preservada";
    return { estadoGeral, trabalhoRespiratorio: trabalho, ausculta, fala, perfusao };
  }

  // Ramo PNEUMONIA GRAVE (infecção pulmonar presente).
  if (s.infeccaoPulmonar !== undefined) {
    const infec = s.infeccaoPulmonar;
    const trabalho = spo2 < 90 ? "muito aumentado" : spo2 < 94 ? "aumentado" : "próximo do normal";
    const ausculta =
      infec > 60
        ? "crepitações finas em base direita, murmúrio reduzido ipsilateralmente"
        : infec > 30
          ? "crepitações esparsas em base direita, murmúrio discretamente reduzido"
          : "murmúrio vesicular presente com ruídos adventícios residuais";
    const estadoGeral =
      spo2 < 88 || paSys < 90
        ? "febril, prostrado, dispneico — deteriorando, risco de sepse"
        : s.antibioticoAplicado && spo2 >= 92
          ? "febril, dispneico com leve melhora após antibiótico e suporte"
          : "febril, prostrado, dispneico";
    const perfusao =
      paSys < 90
        ? "lentificada — possível hipoperfusão sistêmica"
        : s.fluidosAplicados
          ? "preservada"
          : paSys < 100
            ? "discretamente lentificada"
            : "preservada";
    return {
      estadoGeral,
      trabalhoRespiratorio: trabalho,
      ausculta,
      fala: fr > 28 || spo2 < 90 ? "frases curtas" : "frases curtas, com dificuldade",
      perfusao,
    };
  }

  // Ramo ASMA (broncoespasmo) — comportamento original.
  const bronco = s.broncoespasmo;

  const trabalhoRespiratorio =
    bronco > 60 ? "muito aumentado" : bronco > 30 ? "aumentado" : "próximo do normal";

  const ausculta =
    bronco > 60
      ? "sibilos difusos intensos, murmúrio vesicular reduzido"
      : bronco > 30
        ? "sibilos esparsos, murmúrio audível"
        : "murmúrio vesicular presente, sibilos raros";

  const fala = fr > 30 || spo2 < 90 ? "frases entrecortadas" : "frases completas";

  // Texto neutro por faixa de SpO₂: não presume melhora no início (t=0).
  const estadoGeral =
    spo2 < 90
      ? "dispneico e ansioso (grave)"
      : spo2 < 94
        ? "dispneico, hipoxemia leve a moderada"
        : "mais confortável, respondendo ao tratamento";

  return {
    estadoGeral,
    trabalhoRespiratorio,
    ausculta,
    fala,
    perfusao: spo2 < 85 ? "risco de comprometimento" : "preservada",
  };
}

/** Alvo de SpO₂ atingível conforme o contexto clínico. */
function alvoSpo2(s: PatientState): number {
  // DPOC: teto em 92% para evitar narcose por CO₂.
  if (s.retencaoCO2 !== undefined) return 92;
  const base = s.oxigenioSuplementar ? 97 : 94;
  // Broncoespasmo alto limita o teto de saturação alcançável.
  const teto = 100 - Math.round(s.broncoespasmo / 12);
  return Math.min(base, teto);
}

/**
 * Aplica UMA intervenção ao estado. Retorna sempre um novo objeto (imutável).
 * `tempoMin` é o instante simulado do clique (minutos desde o início).
 */
export function applyIntervention(
  estado: PatientState,
  intervencao: InterventionId,
  tempoMin: number
): StateTransitionResult {
  const s: PatientState = {
    ...estado,
    vitals: { ...estado.vitals },
    clinical: { ...estado.clinical },
    tempoDecorridoMin: tempoMin,
  };
  const meta = obterIntervencao(intervencao);
  const eventos: TimelineEvent[] = [];
  let tendencia: TrendDirection = "estabilidade";
  let mensagem = "";
  let erroCritico: string | undefined;

  switch (intervencao) {
    case "oxigenio": {
      s.oxigenioSuplementar = true;
      const antes = s.vitals.spo2;
      s.vitals.spo2 = clamp(s.vitals.spo2 + 4, 40, alvoSpo2(s));
      tendencia = s.vitals.spo2 > antes ? "melhora" : "estabilidade";
      mensagem = `SpO₂ ${antes}% → ${s.vitals.spo2}% com oxigenioterapia.`;
      break;
    }
    case "salbutamol": {
      s.broncoespasmo = clamp(s.broncoespasmo - 25, 0, 100);
      if (s.broncodilatacaoDpoc !== undefined) {
        s.broncodilatacaoDpoc = clamp(s.broncodilatacaoDpoc - 20, 0, 100);
      }
      s.vitals.fr = clamp(s.vitals.fr - 4, 12, 70);
      s.vitals.fc = clamp(s.vitals.fc + 6, 60, 160); // efeito adrenérgico
      s.vitals.spo2 = clamp(s.vitals.spo2 + 2, 40, alvoSpo2(s));
      tendencia = "melhora";
      mensagem = "Broncoespasmo reduzido; FR menor, FC discretamente maior (SABA).";
      break;
    }
    case "ipratropio": {
      const ganho = s.broncoespasmo > 30 ? 15 : 6;
      s.broncoespasmo = clamp(s.broncoespasmo - ganho, 0, 100);
      if (s.broncodilatacaoDpoc !== undefined) {
        s.broncodilatacaoDpoc = clamp(s.broncodilatacaoDpoc - 15, 0, 100);
      }
      s.vitals.fr = clamp(s.vitals.fr - 2, 12, 70);
      s.vitals.spo2 = clamp(s.vitals.spo2 + 1, 40, alvoSpo2(s));
      tendencia = "melhora";
      mensagem = "Melhora adicional do broncoespasmo com ipratrópio associado.";
      break;
    }
    case "corticoide": {
      s.corticoideAdministrado = true;
      tendencia = "estabilidade";
      mensagem =
        "Corticoide sistêmico administrado: controle da exacerbação (efeito não imediato).";
      break;
    }
    case "sulfato-magnesio": {
      const ganho = s.broncoespasmo > 50 ? 20 : 8;
      s.broncoespasmo = clamp(s.broncoespasmo - ganho, 0, 100);
      s.vitals.spo2 = clamp(s.vitals.spo2 + 1, 40, alvoSpo2(s));
      tendencia = s.broncoespasmo > 50 ? "melhora" : "estabilidade";
      mensagem = "Sulfato de magnésio na crise grave/refratária.";
      break;
    }
    case "reavaliar": {
      const pneumo = typeof s.tensaoPneumotorax === "number";
      const dpoc = s.retencaoCO2 !== undefined;
      const pneumonia = s.infeccaoPulmonar !== undefined;
      const semTratamentoAsma = !dpoc && !pneumonia && s.broncoespasmo > 60 && !s.oxigenioSuplementar;
      const semTratamentoPneumo = pneumo && (s.tensaoPneumotorax ?? 0) > 40 && !s.descomprimido;
      const hiperóxiaDpoc = dpoc && !!s.hiperoxia;
      const semTratamentoDpoc = dpoc && s.vitals.spo2 < 88 && !s.oxigenioSuplementar;
      const semAntibioticoPneumonia = pneumonia && !s.antibioticoAplicado && s.vitals.spo2 < 90;
      if (semTratamentoAsma || semTratamentoPneumo) {
        s.vitals.spo2 = clamp(s.vitals.spo2 - 3, 40, 100);
        s.vitals.fr = clamp(s.vitals.fr + 2, 12, 70);
        if (semTratamentoPneumo) s.vitals.paSys = clamp(s.vitals.paSys - 5, 40, 260);
        tendencia = "piora";
        mensagem = "Reavaliação sem conduta adequada: piora progressiva.";
      } else if (hiperóxiaDpoc) {
        // Narcose hipercápnica progressiva após hiperóxia
        s.vitals.fr = clamp(s.vitals.fr - 3, 4, 70);
        s.vitals.spo2 = clamp(s.vitals.spo2 - 10, 40, 100);
        s.retencaoCO2 = clamp((s.retencaoCO2 ?? 0) + 5, 0, 100);
        tendencia = "piora";
        mensagem = `Reavaliação com hiperóxia: narcose hipercápnica progressiva, SpO₂ caindo (${s.vitals.spo2}%).`;
      } else if (semTratamentoDpoc) {
        s.vitals.spo2 = clamp(s.vitals.spo2 - 3, 40, 100);
        s.vitals.fr = clamp(s.vitals.fr + 2, 12, 70);
        tendencia = "piora";
        mensagem = "Reavaliação DPOC sem oxigênio: piora progressiva.";
      } else if (semAntibioticoPneumonia) {
        s.vitals.spo2 = clamp(s.vitals.spo2 - 3, 40, 100);
        s.vitals.fr = clamp(s.vitals.fr + 2, 12, 70);
        s.vitals.paSys = clamp(s.vitals.paSys - 4, 40, 260);
        if (s.infeccaoPulmonar !== undefined) s.infeccaoPulmonar = clamp(s.infeccaoPulmonar + 5, 0, 100);
        tendencia = "piora";
        mensagem = "Reavaliação sem antibiótico: piora progressiva — risco de sepse crescente.";
      } else if (pneumonia) {
        const melhora = !!s.antibioticoAplicado && s.vitals.spo2 >= 92;
        tendencia = melhora ? "melhora" : "estabilidade";
        mensagem = `Reavaliação: SpO₂ ${s.vitals.spo2}%, FR ${s.vitals.fr}, PA ${s.vitals.paSys}/${s.vitals.paDia}, temp ${s.vitals.temp.toFixed(1)}°C.`;
      } else if (pneumo) {
        tendencia = s.vitals.spo2 >= 92 && s.vitals.paSys >= 100 ? "melhora" : "estabilidade";
        mensagem = `Reavaliação: SpO₂ ${s.vitals.spo2}%, PA sistólica ${s.vitals.paSys}, FR ${s.vitals.fr}.`;
      } else if (dpoc) {
        const emAlvo = s.vitals.spo2 >= 88 && s.vitals.spo2 <= 92;
        tendencia = emAlvo && (s.broncodilatacaoDpoc ?? 100) <= 50 ? "melhora" : "estabilidade";
        mensagem = `Reavaliação DPOC: SpO₂ ${s.vitals.spo2}% (alvo 88–92%), FR ${s.vitals.fr}.`;
      } else {
        tendencia = s.vitals.spo2 >= 92 && s.broncoespasmo <= 30 ? "melhora" : "estabilidade";
        mensagem = `Reavaliação: SpO₂ ${s.vitals.spo2}%, FR ${s.vitals.fr}, broncoespasmo ${s.broncoespasmo}/100.`;
      }
      break;
    }
    case "internacao": {
      tendencia = "estabilidade";
      mensagem = "Paciente encaminhado à internação para monitorização contínua.";
      break;
    }
    case "intubacao-uti": {
      tendencia = "estabilidade";
      mensagem =
        "Via aérea avançada / UTI acionada diante de risco de deterioração.";
      break;
    }
    case "alta": {
      const inseguro =
        s.vitals.spo2 < 92 || s.broncoespasmo > 30 || s.vitals.fr > 26;
      if (inseguro) {
        tendencia = "piora";
        erroCritico =
          "Alta insegura: paciente ainda com hipoxemia e/ou esforço respiratório.";
        mensagem = erroCritico;
      } else {
        tendencia = "estabilidade";
        mensagem = "Alta com paciente estável e orientado.";
      }
      break;
    }

    // ---- Fase 3 — emergência torácica / suporte ---------------------------
    case "oxigenio_alto_fluxo": {
      s.oxigenioSuplementar = true;
      const antes = s.vitals.spo2;
      const pneumoInstavel =
        typeof s.tensaoPneumotorax === "number" && (s.tensaoPneumotorax ?? 0) > 40 && !s.descomprimido;
      // Sob tensão, o O₂ eleva pouco (não resolve a causa); caso contrário, mais.
      const ganho = pneumoInstavel ? 3 : 5;
      s.vitals.spo2 = clamp(s.vitals.spo2 + ganho, 40, 99);
      tendencia = s.vitals.spo2 > antes ? "melhora" : "estabilidade";
      mensagem = pneumoInstavel
        ? `O₂ de alto fluxo: SpO₂ ${antes}% → ${s.vitals.spo2}% (melhora parcial; não trata a tensão).`
        : `O₂ de alto fluxo: SpO₂ ${antes}% → ${s.vitals.spo2}%.`;
      break;
    }
    case "descompressao_toracica": {
      if (typeof s.tensaoPneumotorax === "number" && (s.tensaoPneumotorax ?? 0) > 0) {
        s.tensaoPneumotorax = clamp((s.tensaoPneumotorax ?? 0) - 70, 0, 100);
        s.descomprimido = true;
        s.vitals.spo2 = clamp(s.vitals.spo2 + 8, 40, 99);
        s.vitals.paSys = clamp(s.vitals.paSys + 25, 40, 260);
        s.vitals.paDia = clamp(s.vitals.paDia + 12, 30, 160);
        s.vitals.fr = clamp(s.vitals.fr - 8, 12, 70);
        s.vitals.fc = clamp(s.vitals.fc - 10, 40, 200);
        tendencia = "melhora";
        mensagem = "Descompressão torácica: alívio imediato — SpO₂ e PA sobem, FR cai (melhora crítica).";
      } else {
        tendencia = "estabilidade";
        mensagem = "Descompressão sem tensão residual significativa.";
      }
      break;
    }
    case "drenagem_toracica": {
      s.drenado = true;
      if (s.descomprimido) {
        s.tensaoPneumotorax = clamp((s.tensaoPneumotorax ?? 0) - 15, 0, 100);
        s.vitals.spo2 = clamp(s.vitals.spo2 + 1, 40, 99);
        s.vitals.paSys = clamp(s.vitals.paSys + 5, 40, 260);
        tendencia = "melhora";
        mensagem = "Drenagem torácica: estabilização sustentada, menor risco de recorrência.";
      } else {
        tendencia = "estabilidade";
        mensagem = "Dreno instalado, porém sem descompressão prévia adequada.";
      }
      break;
    }
    case "monitorizacao": {
      tendencia = "estabilidade";
      mensagem = "Monitorização contínua (oximetria, monitor cardíaco, PA seriada).";
      break;
    }
    case "acesso_venoso": {
      s.acessoVenoso = true;
      tendencia = "estabilidade";
      mensagem = "Acesso venoso calibroso obtido.";
      break;
    }
    case "fluidos_suporte": {
      // Suporte parcial: melhora discreta da PA, sem resolver a causa.
      s.vitals.paSys = clamp(s.vitals.paSys + (s.descomprimido ? 8 : 5), 40, 260);
      tendencia = "estabilidade";
      mensagem = "Fluidos de suporte: melhora discreta da PA (não resolve a tensão intratorácica).";
      break;
    }
    case "analgesia": {
      s.dorControlada = true;
      s.vitals.fr = clamp(s.vitals.fr - 1, 12, 70);
      tendencia = "estabilidade";
      mensagem = "Analgesia: dor torácica controlada.";
      break;
    }
    case "solicitar_usg_torax": {
      tendencia = "estabilidade";
      mensagem = "USG torácico à beira-leito: rápido, não atrasa a conduta.";
      break;
    }
    case "solicitar_rx_torax": {
      const pneumoInstavel =
        typeof s.tensaoPneumotorax === "number" && (s.tensaoPneumotorax ?? 0) > 40 && !s.descomprimido;
      if (pneumoInstavel) {
        s.vitals.spo2 = clamp(s.vitals.spo2 - 3, 40, 100);
        s.vitals.paSys = clamp(s.vitals.paSys - 5, 40, 260);
        s.vitals.fr = clamp(s.vitals.fr + 2, 12, 70);
        tendencia = "piora";
        erroCritico = "Atraso terapêutico: solicitar RX antes da descompressão em paciente instável.";
        mensagem = erroCritico;
      } else {
        tendencia = "estabilidade";
        mensagem = "RX de tórax solicitado (paciente estabilizado).";
      }
      break;
    }
    case "aguardar_exames": {
      const instavel =
        (typeof s.tensaoPneumotorax === "number" && (s.tensaoPneumotorax ?? 0) > 40 && !s.descomprimido) ||
        s.vitals.spo2 < 90;
      if (instavel) {
        s.vitals.spo2 = clamp(s.vitals.spo2 - 4, 40, 100);
        s.vitals.paSys = clamp(s.vitals.paSys - 8, 40, 260);
        s.vitals.fr = clamp(s.vitals.fr + 3, 12, 70);
        tendencia = "piora";
        erroCritico = "Atraso terapêutico: aguardar exames em paciente instável.";
        mensagem = erroCritico;
      } else {
        tendencia = "estabilidade";
        mensagem = "Aguardando exames (paciente estável).";
      }
      break;
    }
    case "alta_precoce": {
      const dpocAtivo = s.retencaoCO2 !== undefined;
      const pneumoniaAtiva = s.infeccaoPulmonar !== undefined;
      const inseguro = pneumoniaAtiva
        ? s.vitals.spo2 < 92 || s.vitals.fr > 26 || !s.antibioticoAplicado
        : dpocAtivo
          ? s.vitals.spo2 < 88 || s.vitals.fr > 26
          : s.vitals.spo2 < 92 || s.vitals.paSys < 100 || s.vitals.fr > 26 || (typeof s.tensaoPneumotorax === "number" && !s.drenado);
      if (inseguro) {
        tendencia = "piora";
        erroCritico = pneumoniaAtiva
          ? "Alta insegura em pneumonia grave: hipoxemia e/ou antibiótico ainda não iniciado."
          : dpocAtivo
            ? "Alta insegura em DPOC: paciente hipoxêmico (SpO₂ < 88%) sem tratamento adequado."
            : "Alta insegura: paciente ainda instável / sem tratamento definitivo.";
        mensagem = erroCritico;
      } else {
        tendencia = "estabilidade";
        mensagem = "Alta com paciente estável e orientado.";
      }
      break;
    }

    // ---- Fase 4 — DPOC exacerbado ----------------------------------------
    case "oxigenio_controlado": {
      s.oxigenioSuplementar = true;
      s.oxigenioControlado = true;
      const antes = s.vitals.spo2;
      // Teto 92%: titulado para evitar narcose por CO₂.
      s.vitals.spo2 = clamp(s.vitals.spo2 + 5, 40, 92);
      tendencia = s.vitals.spo2 > antes ? "melhora" : "estabilidade";
      mensagem = `O₂ controlado (alvo 88–92%): SpO₂ ${antes}% → ${s.vitals.spo2}%. CO₂ monitorado.`;
      break;
    }
    case "oxigenio_alto_fluxo_sem_controle": {
      s.oxigenioSuplementar = true;
      const antes = s.vitals.spo2;
      if (s.retencaoCO2 !== undefined) {
        // Em DPOC: O₂ alto fluxo pode piorar hipercapnia por mecanismos multifatoriais (efeito Haldane, V/Q, drive)
        s.vitals.spo2 = clamp(s.vitals.spo2 + 4, 40, 99);
        s.hiperoxia = true;
        s.retencaoCO2 = clamp(s.retencaoCO2 + 25, 0, 100);
        s.vitals.fr = clamp(s.vitals.fr - 4, 4, 70); // narcose: drive respiratório cai
        tendencia = "piora";
        erroCritico =
          "Hiperóxia em DPOC: O₂ de alto fluxo sem controle agrava retenção de CO₂ (narcose hipercápnica).";
        mensagem = erroCritico;
      } else {
        s.vitals.spo2 = clamp(s.vitals.spo2 + 8, 40, 99);
        tendencia = s.vitals.spo2 > antes ? "melhora" : "estabilidade";
        mensagem = `O₂ alto fluxo: SpO₂ ${antes}% → ${s.vitals.spo2}%.`;
      }
      break;
    }
    case "ventilacao_nao_invasiva": {
      const antesFr = s.vitals.fr;
      s.vitals.fr = clamp(s.vitals.fr - 6, 12, 70);
      // Em DPOC: SpO₂ controlada (teto 92%); melhora CO₂.
      const tetoDpoc = s.retencaoCO2 !== undefined ? 92 : 99;
      s.vitals.spo2 = clamp(s.vitals.spo2 + 3, 40, tetoDpoc);
      if (s.retencaoCO2 !== undefined) {
        s.retencaoCO2 = clamp(s.retencaoCO2 - 15, 0, 100);
        s.vniAplicada = true;
      }
      tendencia = "melhora";
      mensagem = `VNI aplicada: FR ${antesFr} → ${s.vitals.fr} irpm, SpO₂ melhora, CO₂ reduzindo.`;
      break;
    }
    case "antibiotico_se_indicado": {
      s.antibioticoAplicado = true;
      tendencia = "estabilidade";
      mensagem = "Antibiótico administrado: conduta correta na exacerbação infecciosa (efeito não imediato).";
      break;
    }
    case "sedativo_sem_indicacao": {
      if (s.retencaoCO2 !== undefined) {
        s.vitals.fr = clamp(s.vitals.fr - 6, 4, 70);
        s.vitals.spo2 = clamp(s.vitals.spo2 - 6, 40, 100);
        tendencia = "piora";
        erroCritico =
          "Sedação em DPOC com retenção de CO₂: supressão do drive respiratório — risco de parada.";
        mensagem = erroCritico;
      } else {
        tendencia = "estabilidade";
        mensagem = "Sedação administrada.";
      }
      break;
    }

    // ---- Fase 5 — Pneumonia grave ----------------------------------------
    case "oxigenio_suplementar": {
      s.oxigenioSuplementar = true;
      const antes = s.vitals.spo2;
      s.vitals.spo2 = clamp(s.vitals.spo2 + 5, 40, 97);
      s.vitals.fr = clamp(s.vitals.fr - 2, 12, 70);
      tendencia = s.vitals.spo2 > antes ? "melhora" : "estabilidade";
      mensagem = `Oxigênio suplementar: SpO₂ ${antes}% → ${s.vitals.spo2}%. FR discretamente reduzida.`;
      break;
    }
    case "antibiotico_precoce": {
      s.antibioticoAplicado = true;
      if (s.cargaInflamatoria !== undefined) {
        s.cargaInflamatoria = clamp(s.cargaInflamatoria - 5, 0, 100);
      }
      tendencia = "estabilidade";
      mensagem = "Antibiótico iniciado precocemente: conduta essencial. Efeito clínico progressivo nas próximas horas.";
      break;
    }
    case "antitermico": {
      s.vitals.temp = clamp(s.vitals.temp - 0.8, 36.0, 43.0);
      s.vitals.fc = clamp(s.vitals.fc - 8, 60, 200);
      if (s.cargaInflamatoria !== undefined) {
        s.cargaInflamatoria = clamp(s.cargaInflamatoria - 5, 0, 100);
      }
      tendencia = "melhora";
      mensagem = `Antitérmico: temperatura ${s.vitals.temp.toFixed(1)}°C, FC melhora para ${s.vitals.fc} bpm.`;
      break;
    }
    case "hidratacao_cautelosa": {
      s.fluidosAplicados = true;
      if (s.vitals.paSys < 100) {
        s.vitals.paSys = clamp(s.vitals.paSys + 10, 40, 260);
        s.vitals.paDia = clamp(s.vitals.paDia + 5, 30, 160);
      }
      s.vitals.fc = clamp(s.vitals.fc - 5, 60, 200);
      tendencia = s.vitals.paSys < 105 ? "melhora" : "estabilidade";
      mensagem = "Hidratação cautelosa: perfusão melhora discretamente. Monitorar sinais de congestão.";
      break;
    }
    case "coleta_culturas_sem_atrasar_antibiotico": {
      tendencia = "estabilidade";
      mensagem = "Hemoculturas coletadas antes do antibiótico: conduta ideal — ATB não foi atrasado.";
      break;
    }
    case "atrasar_antibiotico_por_exames": {
      if (s.infeccaoPulmonar !== undefined) {
        s.infeccaoPulmonar = clamp(s.infeccaoPulmonar + 10, 0, 100);
        if (s.cargaInflamatoria !== undefined) {
          s.cargaInflamatoria = clamp(s.cargaInflamatoria + 10, 0, 100);
        }
        s.vitals.spo2 = clamp(s.vitals.spo2 - 2, 40, 100);
        tendencia = "piora";
        erroCritico =
          "Atraso no antibiótico: em pneumonia grave o ATB deve ser iniciado em até 1 hora — atrasar aumenta mortalidade e risco de sepse.";
        mensagem = erroCritico;
      } else {
        tendencia = "estabilidade";
        mensagem = "Aguardando exames antes de iniciar antibiótico.";
      }
      break;
    }

    default: {
      mensagem = "Ação sem efeito fisiológico definido.";
    }
  }

  s.clinical = recomputarClinica(s);

  eventos.push(
    novoEvento(
      tempoMin,
      meta?.label ?? intervencao,
      mensagem,
      tendencia,
      erroCritico ? "erro-critico" : "intervencao"
    )
  );

  return { novoEstado: s, mensagem, eventos, tendencia, erroCritico };
}

/** Evento inicial padronizado para abrir a linha do tempo de um caso. */
export function eventoInicial(estado: PatientState): TimelineEvent {
  return novoEvento(
    0,
    "Início do atendimento",
    `Paciente ${estado.clinical.estadoGeral}; SpO₂ ${estado.vitals.spo2}%, FR ${estado.vitals.fr}, FC ${estado.vitals.fc}.`,
    estado.vitals.spo2 < 90 ? "piora" : "estabilidade",
    "inicio"
  );
}
