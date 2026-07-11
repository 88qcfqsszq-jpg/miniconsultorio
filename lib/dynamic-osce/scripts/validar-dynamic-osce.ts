// ============================================================================
// Casos OSCE Dinâmicos — Beta · SCRIPT PERMANENTE DE VALIDAÇÃO (Fase 2)
// ----------------------------------------------------------------------------
// Valida estrutura do caso, rubrica, caso × rubrica, caso × motor; simula a
// sequência correta, a sequência sem tratamento e o erro crítico de alta
// precoce. Imprime relatório e retorna exit code 1 se houver qualquer erro.
//
// Rodar:  npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts
// ============================================================================

import { DYNAMIC_CASES } from "../cases";
import { validarDynamicCase } from "../validators/validar-dynamic-case";
import { validarDynamicRubric } from "../validators/validar-dynamic-rubric";
import { validarDynamicEngine } from "../validators/validar-dynamic-engine";
import { linkRubrica } from "../dynamic-rubric-link";
import { applyIntervention } from "../dynamic-state-engine";
import { gerarFeedbackDinamico } from "../dynamic-feedback-engine";
import { checklistAnamnese } from "../dynamic-case-contract";
import { getPulseCapability } from "../pulse/pulse-capability-map";
import { getPulseAction } from "../pulse/pulse-action-map";
import { VITAIS_CENTRAIS_MEDIX, medixFieldsCobertos } from "../pulse/pulse-output-map";
import { getPulseScenarioTemplate } from "../pulse/pulse-scenario-templates";
import { PULSE_EXECUTION_ENABLED } from "../pulse/pulse-adapter.contract";
import type { InterventionId, PatientState } from "../types";

// Sequências de teste por caso (correta / sem tratamento ou errada / alta).
interface SeqTeste {
  correta: InterventionId[];
  semTratamento: InterventionId[];
  semTratamentoEsperaErro: boolean;
  altaId: InterventionId;
}
const SEQ_TESTE: Record<string, SeqTeste> = {
  "dynamic-asthma-severe-adult-001": {
    correta: ["oxigenio", "salbutamol", "ipratropio", "corticoide", "reavaliar"],
    semTratamento: ["reavaliar", "reavaliar"],
    semTratamentoEsperaErro: false,
    altaId: "alta",
  },
  "dynamic-tension-pneumothorax-adult-001": {
    correta: ["oxigenio_alto_fluxo", "descompressao_toracica", "drenagem_toracica", "reavaliar"],
    semTratamento: ["aguardar_exames", "solicitar_rx_torax"],
    semTratamentoEsperaErro: true,
    altaId: "alta_precoce",
  },
};

let falhas = 0;
const linhas: string[] = [];

function ok(cond: boolean, msg: string) {
  linhas.push(`${cond ? "  ✅" : "  ❌"} ${msg}`);
  if (!cond) falhas += 1;
}
function secao(titulo: string) {
  linhas.push(`\n### ${titulo}`);
}

for (const caso of DYNAMIC_CASES) {
  const id = caso.identificacao.caseId;
  linhas.push(`\n================ Caso: ${id} — "${caso.identificacao.titulo}" ================`);

  // 1. Estrutura do caso
  secao("Validação estrutural do caso");
  const vCaso = validarDynamicCase(caso);
  ok(vCaso.ok, `Caso válido${vCaso.ok ? "" : ": " + vCaso.erros.join("; ")}`);

  // 2. Rubrica
  const rubrica = linkRubrica(caso.rubricaId);
  secao("Validação da rubrica");
  ok(!!rubrica, `rubricaId resolve (${caso.rubricaId})`);

  // 3. Caso × rubrica
  secao("Validação caso × rubrica");
  if (rubrica) {
    const vRub = validarDynamicRubric(rubrica, caso);
    ok(vRub.ok, `Rubrica coerente e vinculada ao caso${vRub.ok ? "" : ": " + vRub.erros.join("; ")}`);
    ok(rubrica.totalPontos === 20, `Rubrica soma 20 (total=${rubrica.totalPontos})`);
  }

  // 4. Caso × motor
  secao("Validação caso × motor");
  const vMotor = validarDynamicEngine(caso);
  ok(vMotor.ok, `Motor compatível${vMotor.ok ? "" : ": " + vMotor.erros.join("; ")}`);

  const cfg = SEQ_TESTE[caso.identificacao.caseId];
  const inicial = caso.fisiologia.estadoInicial;

  // 5. Sequência correta
  secao("Sequência clínica correta");
  if (!cfg) {
    linhas.push("  ⚠️ sem sequência de teste registrada para este caso.");
  } else {
    let st: PatientState = inicial;
    const spo2Inicial = st.vitals.spo2;
    let erroNaCorreta = false;
    for (const iv of cfg.correta) {
      const r = applyIntervention(st, iv, st.tempoDecorridoMin + 3);
      st = r.novoEstado;
      if (r.erroCritico) erroNaCorreta = true;
    }
    ok(st.vitals.spo2 > spo2Inicial, `SpO₂ melhora (${spo2Inicial}% → ${st.vitals.spo2}%)`);
    if (inicial.broncoespasmo > 0) {
      ok(st.broncoespasmo < inicial.broncoespasmo, `Broncoespasmo reduz (${inicial.broncoespasmo} → ${st.broncoespasmo})`);
    }
    if (typeof inicial.tensaoPneumotorax === "number") {
      ok(st.vitals.paSys > inicial.vitals.paSys, `PA melhora (${inicial.vitals.paSys} → ${st.vitals.paSys})`);
    }
    ok(!erroNaCorreta, "Sem erro crítico na sequência correta");

    if (rubrica) {
      const fb = gerarFeedbackDinamico(rubrica, {
        comunicacaoItens: caso.comunicacao.itensEsperados,
        anamneseItens: checklistAnamnese(caso),
        exameItens: caso.exameFisico.manobrasObrigatorias,
        examesSolicitados: [...caso.exames.examesEssenciais],
        intervencoesAplicadas: cfg.correta,
        estadoInicial: inicial,
        estadoFinal: st,
        eventos: [],
        erroCriticoRegistrado: false,
      });
      ok(fb.nota === 20, `Conduta completa + registro pontua 20/20 (obtido ${fb.nota}/${fb.total})`);
      const soma = fb.dominios.reduce((s, d) => s + d.obtido, 0);
      ok(Math.abs(soma - fb.nota) < 0.001, `Soma dos domínios = nota (${soma} = ${fb.nota})`);
    }

    // 5b. Exames não prioritários antes da descompressão (só casos que a exigem)
    if (caso.intervencoes.intervencoesEssenciais.includes("descompressao_toracica") && rubrica) {
      secao("Exames não prioritários antes da descompressão");
      const fbExameAntes = gerarFeedbackDinamico(rubrica, {
        comunicacaoItens: caso.comunicacao.itensEsperados,
        anamneseItens: checklistAnamnese(caso),
        exameItens: caso.exameFisico.manobrasObrigatorias,
        examesSolicitados: ["Gasometria", ...caso.exames.examesEssenciais],
        intervencoesAplicadas: cfg.correta,
        estadoInicial: inicial,
        estadoFinal: st,
        eventos: [],
        erroCriticoRegistrado: false,
        examesNaoPrioritariosAntesDescompressao: true,
      });
      const naoAtrasouComExame = fbExameAntes.dominios
        .find((d) => d.nome === "Exames e monitorização")
        ?.itens.find((i) => /não atrasou/i.test(i.descricao))?.cumprido;
      ok(naoAtrasouComExame === false, "Exame não essencial antes da descompressão: 'não atrasou' NÃO pontua");
      ok(fbExameAntes.nota < 20, `Nota < 20 com exame antecipado (${fbExameAntes.nota}/${fbExameAntes.total})`);
    }

    // 6. Sequência sem tratamento / errada
    secao("Sequência sem tratamento / errada (piora esperada)");
    let stSem: PatientState = inicial;
    let erroNoErrado = false;
    for (const iv of cfg.semTratamento) {
      const r = applyIntervention(stSem, iv, stSem.tempoDecorridoMin + 5);
      stSem = r.novoEstado;
      if (r.erroCritico) erroNoErrado = true;
    }
    ok(stSem.vitals.spo2 < inicial.vitals.spo2, `SpO₂ piora sem conduta adequada (${inicial.vitals.spo2}% → ${stSem.vitals.spo2}%)`);
    if (cfg.semTratamentoEsperaErro) {
      ok(erroNoErrado, "Sequência errada gera erro crítico de atraso/conduta");
      if (rubrica) {
        const fbErr = gerarFeedbackDinamico(rubrica, {
          comunicacaoItens: [], anamneseItens: [], exameItens: [], examesSolicitados: [],
          intervencoesAplicadas: cfg.semTratamento,
          estadoInicial: inicial, estadoFinal: stSem,
          eventos: [], erroCriticoRegistrado: true,
        });
        const condDefinitiva = fbErr.dominios
          .find((d) => d.nome === "Conduta e reavaliação")
          ?.itens.find((i) => /descompress/i.test(i.descricao))?.cumprido;
        ok(condDefinitiva === false, "Conduta definitiva (descompressão) NÃO pontua na sequência errada");
      }
    }

    // 7. Erro crítico — alta precoce
    secao("Erro crítico — alta precoce");
    const rAlta = applyIntervention(inicial, cfg.altaId, 3);
    ok(!!rAlta.erroCritico, `Alta precoce gera erro crítico (${rAlta.erroCritico ?? "—"})`);
    if (rubrica) {
      const fbAlta = gerarFeedbackDinamico(rubrica, {
        comunicacaoItens: [], anamneseItens: [], exameItens: [], examesSolicitados: [],
        intervencoesAplicadas: [cfg.altaId],
        estadoInicial: inicial, estadoFinal: rAlta.novoEstado,
        eventos: [], erroCriticoRegistrado: true,
      });
      ok(fbAlta.errosCriticos.length > 0, "Feedback registra o erro crítico");
      const racSemAlta = fbAlta.dominios
        .find((d) => d.nome === "Raciocínio clínico")
        ?.itens.find((i) => i.descricao.includes("Não deu alta"))?.cumprido;
      ok(racSemAlta === false, "Critério 'não deu alta' fica NÃO cumprido");
    }
  }

  // 8. Compatibilidade Pulse/MEDIX (sem executar Pulse real)
  secao("Compatibilidade Pulse/MEDIX");
  ok(PULSE_EXECUTION_ENABLED === false, "Pulse real NÃO é executado (PULSE_EXECUTION_ENABLED=false)");
  ok(caso.simulacao.simulationProvider === "medix-rule-based", "Provider atual continua medix-rule-based");
  const pc = caso.simulacao.pulseCompatibility;
  if (pc) {
    const cap = getPulseCapability(pc.conditionId);
    ok(!!cap, `conditionId reconhecido no capability-map (${pc.conditionId})`);
    ok(["strong", "medium"].includes(pc.compatibility), `Compatibilidade strong/medium (${pc.compatibility})`);
  } else {
    linhas.push("  ⚠️ sem pulseCompatibility declarada (opcional para casos não Pulse-ready).");
  }
  const ivsCaso: InterventionId[] = [
    ...caso.intervencoes.intervencoesEssenciais,
    ...caso.intervencoes.intervencoesAceitas,
    ...caso.intervencoes.intervencoesDeResgate,
  ];
  const semAcao = ivsCaso.filter((id) => !getPulseAction(id));
  ok(semAcao.length === 0, `Action map reconhece as intervenções do caso${semAcao.length ? ": faltam " + semAcao.join(", ") : ""}`);
  const cobertos = medixFieldsCobertos();
  const faltamVitais = VITAIS_CENTRAIS_MEDIX.filter((f) => !cobertos.includes(f));
  ok(faltamVitais.length === 0, `Output map cobre os sinais vitais centrais${faltamVitais.length ? ": faltam " + faltamVitais.join(", ") : ""}`);
  // Template Pulse ESPECÍFICO do caso (o scenarioTemplateId espelha o conditionId).
  const templateId = pc?.conditionId;
  const tpl = templateId ? getPulseScenarioTemplate(templateId) : undefined;
  ok(!!tpl, `Template de cenário existe (${templateId ?? "—"})`);
  if (tpl) {
    // Ações essenciais do caso devem estar previstas no template (compatibilidade).
    const faltamNoTemplate = caso.intervencoes.intervencoesEssenciais.filter(
      (id) => !tpl.requiredActions.includes(id)
    );
    ok(
      faltamNoTemplate.length === 0,
      `Template cobre as intervenções essenciais do caso${faltamNoTemplate.length ? ": faltam " + faltamNoTemplate.join(", ") : ""}`
    );
  }
}

// Resumo final
console.log("======== VALIDAÇÃO — Casos OSCE Dinâmicos (Beta · Fase 2) ========");
console.log(linhas.join("\n"));
console.log("\n---------------------------------------------------------");
if (falhas === 0) {
  console.log(`RESUMO: ✅ TODAS as checagens passaram (${DYNAMIC_CASES.length} caso(s)).`);
  process.exit(0);
} else {
  console.log(`RESUMO: ❌ ${falhas} checagem(ns) falharam.`);
  process.exit(1);
}
