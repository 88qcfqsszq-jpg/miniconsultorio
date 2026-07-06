# Relatório — Módulo de Hemograma Completo

_Feature aditiva e localizada. Nenhuma refatoração global; nenhum fluxo existente alterado (Paciente, Exame Físico, Exames de Imagem, Exames, Sinais Vitais, ECG intactos). Laboratório fictício; padrões didáticos e genéricos._

## Arquivos criados
- `src/data/hemogramaProfiles.ts` — catálogo de **20 perfis** hematológicos + `resolveHemogramaProfileKey(caso)`/`getHemogramaProfile(caso)` (casa por diagnóstico/categoria/título).
- `src/utils/generateHemograma.ts` — `generateHemograma({ caso })`: motor determinístico (seed por caseId), faixas por idade/sexo, coerência matemática dos índices e do diferencial.
- `src/components/HemogramaReport.tsx` — laudo visual "HEMOGRAMA COMPLETO" (paciente, coleta, tabelas por série, setas ↑↓, observações, nota final).
- `docs/RELATORIO-MODULO-HEMOGRAMA.md` — este relatório.

## Arquivos modificados (mudanças mínimas e localizadas)
- `app/caso/[id]/page.tsx` — **apenas**:
  1. `import HemogramaReport`;
  2. adicionado `"hemograma"` aos tipos de aba (`abaAtiva`/`menuAtivo`);
  3. botão **Hemograma** nas **duas** listas de abas (menu desktop "Atendimento" e abas mobile), **após "Exames" e antes de "Sinais Vitais"** — mesmo padrão visual (ícone `icon-exames.png` no desktop, 🩸 no mobile);
  4. bloco de conteúdo desktop `{menuAtivo === "hemograma" && <HemogramaReport caso={caso} />}`;
  5. bloco de conteúdo mobile `<div className={abaAtiva === "hemograma" ? "block" : "hidden"}><HemogramaReport caso={caso} /></div>`.

Nenhuma outra parte do arquivo foi tocada. `page.tsx.backup` **não** foi alterado.

## Como a sidebar/abas foram identificadas
- Estado das abas: `abaAtiva` (abas mobile + blocos de conteúdo mobile) e `menuAtivo` (menu lateral desktop + conteúdo central). Ambos atualizados.
- O botão segue o mesmo `.map()` das listas existentes; não quebra o layout mobile (a aba entra no scroll horizontal já existente).

## O hemograma gerado
Série vermelha: Hemácias, Hemoglobina, Hematócrito, VCM, HCM, CHCM, RDW (índices **coerentes**: Ht = hemácias×VCM/10; HCM = Hb×10/hemácias; CHCM = Hb×100/Ht).
Série branca: Leucócitos + diferencial (Neutrófilos, Bastonetes, Segmentados, Linfócitos, Monócitos, Eosinófilos, Basófilos) em **% e contagem absoluta**, com a **soma dos percentuais normalizada a 100%** e absolutos coerentes com o total.
Plaquetas: Plaquetas, VPM, Plaquetócrito (derivado), PDW.
Determinístico por caso (mesmo caso → mesmo laudo, não muda ao trocar de aba).

## Casos mapeados (por perfil)
- **infeccao_bacteriana** (leucocitose + neutrofilia + desvio à esquerda): Pneumonia (2, 6), PAC pediátrica (ped-13), Endocardite (13), Rinossinusite (ped-12).
- **sepse_grave**: Sepse/Choque séptico (59).
- **dengue / dengue_alarme**: Dengue (12, 38), Dengue com alarme (39), Febre Amarela (40), Zika (41), Chikungunya (42).
- **virose_inespecifica**: Infecção Viral Inespecífica (ped-01).
- **anemia_ferropriva** (microcítica/hipocrômica): Anemia Ferropriva (17, 43), "anemia" genérica, Anemia com sinais de alerta (ped-15).
- **anemia_hemolitica**: Anemia Hemolítica (44).
- **anemia_megaloblastica**: Deficiência de B12 (46).
- **talassemia**: Talassemia Maior (53).
- **anemia_doenca_cronica**: Insuficiência Renal Crônica (55).
- **leucemia_aguda**: Leucemia Linfoblástica Aguda (49).
- **trombocitopenia_imune**: PTI (45).
- **civd**: CIVD (50).
- **policitemia**: Policitemia Vera (47).
- **citopenias_autoimunes**: LES (56), HIV/AIDS (57), Mieloma (48).
- **eosinofilia_alergica**: Asma (3, 31, 32, ped-11), Bronquiolite (64).
- **cronico_pulmonar_hipoxia**: DPOC (9, 33, 34).
- **tuberculose**: Tuberculose (11, ped-10).
- **estresse_leucocitose_leve**: SCA/IAM/Angina (1, 4, 18, 19, 20, 58), TEP (10).

## Casos com perfil inespecífico (`hemograma_normal_ou_inespecifico`, com TODO)
Casos **sem padrão hematológico característico** — hemograma normal por design (revisar manualmente se algum precisar de perfil dedicado): HAS (5), Pericardite (7, ped-09), Insuficiência Cardíaca (8, ped-05), Valvopatias (14, 23, 24, 25, 26), DAOP/Vascular (15, 28, 29, 30), Derrame Pleural (16), Fibrilação Atrial (21), Emergência Hipertensiva (22), Febre Reumática (27), Diabetes/Cetoacidose (54, 60), Cardiomegalia (61), Pneumotórax (62), Atelectasia (63), casos pediátricos de puericultura/desenvolvimento/PA elevada/maus-tratos/cardiopatias congênitas (ped-02, ped-03, ped-04, ped-06, ped-07, ped-08), Linfonodomegalia reativa (ped-14).

## Como testar (manual)
1. Abrir um caso em `/caso/[id]` (ex.: `2` = pneumonia, `38`/`39` = dengue, `43` = anemia ferropriva, `49` = leucemia, `5` = HAS inespecífico).
2. Clicar em **Hemograma** na barra de atendimento (após "Exames").
3. Conferir o laudo: pneumonia → leucocitose com neutrofilia; dengue → leucopenia + plaquetopenia; dengue alarme → hematócrito ↑ + plaquetas muito ↓; anemia ferropriva → VCM/HCM ↓ com RDW ↑; leucemia → anemia + plaquetopenia + leucometria alterada; HAS → tudo normal.
4. Trocar entre abas (Paciente/Exames/Sinais Vitais/ECG) e voltar — **os dados das outras abas permanecem** e o hemograma **não muda** (determinístico).
5. Desktop (menu lateral) e mobile (abas horizontais) — ambos funcionam.

Validação automatizada executada: motor testado nos casos-chave (coerência do diferencial ≈100%, determinismo, sinais ↑/↓ corretos). `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).

## Riscos / pontos para revisão médica manual
- Os perfis são **didáticos e genéricos** — magnitudes calibradas para ensino, não para exatidão laboratorial individual. **Revisão médica recomendada** antes de uso avaliativo.
- Perfis inespecíficos geram hemograma **normal**; se algum desses casos exigir um achado específico (ex.: policitemia secundária em cardiopatia congênita cianótica), criar um perfil dedicado (há `TODO` no resolver).
- Anemia de doença crônica/inflamatória foi modelada com queda moderada de Hb; ajustar se preferir alteração mais leve.
- O motor não modela reticulócitos, morfologia de esfregaço nem coagulograma (fora do hemograma); coagulopatias (hemofilia/def. vit. K) caem em inespecífico por não alterarem o CBC.
- Não há ícone dedicado de "gota de sangue" nos assets do menu desktop — reutilizado `icon-exames.png` (sem imagem quebrada); trocar por um ícone próprio quando disponível.
