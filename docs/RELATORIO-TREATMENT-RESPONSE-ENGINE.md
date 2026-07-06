# Relatório — TreatmentResponseEngine (resposta dos sinais vitais à conduta)

_Camada **aditiva** sobre a Reavaliação de Sinais Vitais já existente. Os sinais de saída passam a ser influenciados pela **conduta registrada pelo aluno**. Nada foi recriado do zero; a reavaliação anterior continua funcional. Educacional: orienta, não substitui o raciocínio clínico. Não altera scoring/feedback/SOAP/diagnóstico/Evidence Mapper/Fase 26._

## Fluxo implementado
```
sinais de entrada
  → conduta do aluno (texto livre)
  → extractInterventions   (texto → intervenções padronizadas)
  → analyzeTreatment       (adequação ao caso/gravidade)
  → generateDischargeVitals (base, perfil clínico — não recriado)
  → applyTreatmentResponseToVitals (modula a melhora)
  → evaluateDisposition    (alta / observação / hospital)
```
Escolhida a **Opção 2** do escopo (menor risco): gera a base e depois modula, sem alterar a assinatura do gerador.

## Arquivos criados
- `src/treatment/treatmentTypes.ts` — `Interventions`, `TreatmentAdequacy`, `TreatmentAnalysis`, `INTERVENTION_LABELS`, `emptyInterventions`.
- `src/treatment/treatmentKeywords.ts` — dicionário de sinônimos pt-BR + regex de AINE/AAS e da ressalva "evitar".
- `src/treatment/extractInterventions.ts` — `extractInterventions(textoConduta) → Interventions`.
- `src/treatment/treatmentResponseProfiles.ts` — `RESPONSE_FACTOR`, `WORSEN_ON`, `ADEQUACY_MESSAGE`, `ADEQUACY_SEVERITY`.
- `src/treatment/analyzeTreatment.ts` — `analyzeTreatment({caso, interventions, initialVitals, elapsedMinutes}) → TreatmentAnalysis`.
- `src/treatment/applyTreatmentResponseToVitals.ts` — modulação fisiológica dos sinais de saída.
- `src/treatment/TreatmentResponseEngine.ts` — orquestrador `runTreatmentResponse(...)`.

## Arquivos modificados
- `src/components/VitalsReassessment.tsx` — passa a usar o engine; recebe `condutaTexto`; **dois botões internos** ("Sinais vitais de entrada" e "Sinais vitais de saída / Reavaliação"); exibe intervenções reconhecidas, alertas, sinais de saída e recomendação final.
- `app/caso/[id]/page.tsx` — deriva `condutaTexto` (`diagnostico.conduta` + `soap.plano` + `soap.avaliacao`, **somente leitura**); substitui o botão único "Solicitar Sinais Vitais" pela nova versão do componente (desktop e mobile). Layout do card preservado.

## Onde a conduta foi localizada
A conduta do aluno é **texto livre**, em dois estados do `app/caso/[id]/page.tsx`:
- `diagnostico.conduta` — do `PainelDiagnostico` (via `setDiagnostico`);
- `soap.plano` / `soap.avaliacao` — do `FormularioSOAP` (via `setSOAP`).

Não há lista estruturada de ações; por isso a extração é textual. A aba Sinais Vitais lê esses estados **sem alterar** o fluxo de SOAP/diagnóstico (apenas leitura → prop `condutaTexto`).

## Texto livre → intervenções
`extractInterventions` normaliza (minúsculas, sem acento) e casa sinônimos pt-BR para 18 flags booleanas: oxigênio, broncodilatador, corticoide, antibiótico, antitérmico, analgesia, hidratação oral, hidratação venosa, insulina, potássio/eletrólitos, AAS, nitrato, anticoagulação, monitorização, hospitalização, retorno/sinais de alarme, evitar AINE/AAS e **AINE/AAS sem ressalva (risco em dengue)**.

Tratamento especial da ressalva: "evitar AINE/AAS" marca `avoidNsaid` e faz o AAS **não** contar como administrado nem disparar o risco de dengue. "ibuprofeno e AAS" (sem ressalva) marca o risco.

## Como a conduta é classificada
`analyzeTreatment` resolve o perfil clínico (mesmo `resolveVitalProfileKey` da reavaliação) e aplica regras por perfil (`required`, `partialAny`, `danger`), classificando em:
`adequada · parcial · inadequada · ausente · potencialmente_perigosa`.

Regras (resumo): asma (broncodilatador + corticoide, +O₂ se hipoxemia), asma grave/DPOC (+ hospital/observação, nunca alta simples), pneumonia (antibiótico + suporte; grave → hospital), dengue sem alarme (hidratação oral + evitar AINE/AAS + retorno; AINE/AAS → perigosa), dengue com alarme (hidratação venosa + observação/hospital), IAM/SCA (hospital + AAS + monitorização), sepse (antibiótico + soro venoso + hospital/monitorização), TEP (hospital + anticoagulação/O₂), cetoacidose (soro venoso + insulina + potássio + hospital), IC (hospital + O₂ se hipoxemia).

## Como a resposta fisiológica altera os sinais
`applyTreatmentResponseToVitals` escala a melhora esperada (delta perfil → base) por `RESPONSE_FACTOR`:
`adequada 1.1 · parcial 0.6 · inadequada 0.3 · ausente 0.2 · potencialmente_perigosa 0.25`.
- Beta-agonista atenua a queda da FC (taquicardia leve).
- Conduta **perigosa** aplica piora leve/moderada (SpO₂↓, FR↑, FC↑, Temp↑, dor↑, PA↓, glicemia↑ se alta), proporcional ao tempo.
- Reclampa nos mesmos limites fisiológicos do gerador.

## Integração com VitalsReassessment
Ao abrir "Sinais vitais de saída / Reavaliação", escolher o tempo e clicar em "Reavaliar sinais vitais", o componente executa `runTreatmentResponse` e mostra:
- **leitura da conduta** (mensagem educativa + intervenções reconhecidas + alertas);
- **sinais de saída** com setas ▲/▼;
- **recomendação final** (alta / observação / hospital) com justificativas.
Mensagens não acusatórias: "Conduta compatível com melhora clínica esperada." / "Conduta parcial…" / "Conduta insuficiente…" / "Há elementos de risco na conduta informada."

## Regra de segurança (prevalece)
`evaluateDisposition` continua soberano: **nunca alta simples** para IAM/SCA, sepse, TEP, pneumonia grave, dengue com alarme, cetoacidose, IC descompensada, DPOC grave e crise asmática grave — mesmo com conduta ótima e sinais melhorando. Além disso, o engine adiciona uma trava: conduta **potencialmente perigosa** nunca resulta em alta simples (mínimo observação), mesmo em quadro de baixo risco.

## Determinismo
Determinístico por `caseId + tempo de observação + texto da conduta + perfil clínico`. Mesmo caso + mesmo texto + mesmo tempo → **mesmos sinais** (verificado por script).

## Fallback
Sem conduta registrada → `condutaAusente = true`, adequação **"ausente"**, resposta conservadora (fator 0.2, quase sem melhora), reavaliação continua funcionando. TODO no gerador/engine indica onde ampliar a leitura estruturada da conduta se ela existir no futuro.

## Testes executados (60 min, títulos reais)
| Conduta | Adequação | Disposição |
|---|---|---|
| Asma: salbutamol + O₂ se SatO₂ baixa + corticoide + reavaliar | adequada | alta_segura |
| Asma: corticoide + repouso | parcial | alta_segura |
| Dengue clássica: hidratação + evitar AINE/AAS + retorno | adequada | alta_segura |
| Dengue clássica: ibuprofeno + AAS | potencialmente_perigosa | observacao |
| Pneumonia grave: antibiótico + antitérmico + hidratação + O₂ | adequada | encaminhamento_hospitalar |
| IAM/SCA: emergência + ECG + troponina + AAS + monitorização | adequada | encaminhamento_hospitalar |
| Sepse: hospitalizar + ATB precoce + soro venoso + monitorização | adequada | encaminhamento_hospitalar |
| Cetoacidose: hospital + soro venoso + insulina + potássio | adequada | encaminhamento_hospitalar |
| **Sem conduta** (fallback) | ausente | observacao |

✅ Nenhum quadro de alto risco recebeu alta simples. ✅ Determinismo confirmado. ✅ `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).

## Limitações
- A extração é textual (não há lista estruturada de condutas); grafias muito atípicas podem não ser reconhecidas.
- Não se detecta "mandar para casa" no texto; a segurança vem das travas de perfil, não da leitura de "alta" no texto.
- Magnitudes de melhora/piora são **didáticas/genéricas**.
- O resolvedor de perfil trata "sem alarme" pela presença da palavra "alarme"; os casos reais de dengue leve são titulados "Dengue Clássica"/"Dengue Grupo A" (sem "alarme"), então resolvem corretamente.

## TODOs
- `generateDischargeVitals`: TODO já existente para, se houver, consumir uma lista estruturada de intervenções.
- Ampliar sinônimos (ex.: diuréticos para IC, antivirais) conforme novos casos.
- Opcional: pesar dose/tempo da intervenção, não só presença.

## Pontos para revisão médica
- Calibrar `RESPONSE_FACTOR` e os offsets de piora por especialidade.
- Revisar as regras `required`/`partialAny` por perfil (o que define "adequada" em cada caso).
- Validar limiares de hipoxemia (SpO₂ < 94 → O₂ obrigatório) e a piora aplicada às condutas perigosas.
