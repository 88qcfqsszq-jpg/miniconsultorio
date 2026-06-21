// Base de normalidades clínicas específicas por região e ação
// Retorna descrições clínicas objetivas para achados normais

export interface NormalidadeClinicaPediatrica {
  titulo: string;
  descricao: string;
  normal: true;
  termosChave?: string[];
}

export const NORMALIDADES_EXAME_PEDIATRICO: Record<
  string,
  Record<string, NormalidadeClinicaPediatrica>
> = {
  // 1. ESTADO GERAL
  estado_geral: {
    avaliar_estado_geral: {
      titulo: "Bom estado geral",
      descricao:
        "Criança em bom estado geral, ativa, reativa, corada, hidratada, acianótica, anictérica e sem sinais de toxemia.",
      normal: true,
      termosChave: ["bom estado geral", "ativa", "reativa", "corada"],
    },
    avaliar_nivel_atividade: {
      titulo: "Nível de atividade preservado",
      descricao:
        "Criança ativa, com movimentação espontânea preservada e comportamento compatível com a idade.",
      normal: true,
      termosChave: ["ativa", "movimentação preservada"],
    },
    avaliar_consciencia_responsividade: {
      titulo: "Consciência e responsividade normais",
      descricao: "Criança consciente, responsiva aos estímulos, interagindo de forma adequada para a idade.",
      normal: true,
      termosChave: ["consciente", "responsiva"],
    },
    avaliar_interacao_com_responsavel: {
      titulo: "Interação adequada",
      descricao:
        "Criança mantém interação adequada com o responsável, com comportamento compatível com a faixa etária.",
      normal: true,
      termosChave: ["interação adequada"],
    },
    avaliar_sinais_gravidade: {
      titulo: "Sem sinais de gravidade",
      descricao:
        "Ausência de sinais clínicos de gravidade no momento do exame: sem toxemia, sem rebaixamento do nível de consciência, sem desconforto respiratório importante e sem sinais de choque.",
      normal: true,
      termosChave: ["sem sinais de gravidade"],
    },
    avaliar_comportamento_durante_exame: {
      titulo: "Comportamento adequado",
      descricao:
        "Comportamento durante o exame compatível com a idade, sem irritabilidade persistente, prostração ou letargia.",
      normal: true,
      termosChave: ["comportamento adequado"],
    },
  },

  // 2. ANTROPOMETRIA E CRESCIMENTO
  antropometria_crescimento: {
    medir_peso: {
      titulo: "Peso compatível",
      descricao:
        "Peso aferido e compatível com avaliação clínica da idade, sem evidência de perda ponderal aguda.",
      normal: true,
      termosChave: ["peso compatível"],
    },
    medir_estatura_ou_comprimento: {
      titulo: "Estatura compatível",
      descricao: "Comprimento/estatura aferido conforme a faixa etária, sem alteração clínica evidente.",
      normal: true,
      termosChave: ["estatura compatível"],
    },
    medir_perimetro_cefalico: {
      titulo: "Perímetro cefálico normal",
      descricao:
        "Perímetro cefálico aferido conforme técnica adequada, compatível com a curva de crescimento para a idade.",
      normal: true,
      termosChave: ["perímetro cefálico normal"],
    },
    medir_circunferencia_braquial: {
      titulo: "Circunferência braquial normal",
      descricao: "Circunferência braquial sem alteração clínica evidente.",
      normal: true,
      termosChave: ["circunferência braquial normal"],
    },
    medir_circunferencia_abdominal: {
      titulo: "Circunferência abdominal normal",
      descricao: "Circunferência abdominal sem distensão ou alteração clínica evidente.",
      normal: true,
      termosChave: ["circunferência abdominal normal"],
    },
    avaliar_curva_de_crescimento: {
      titulo: "Curva de crescimento normal",
      descricao:
        "Crescimento sem alteração clínica evidente, devendo ser interpretado em curva apropriada para idade e sexo.",
      normal: true,
      termosChave: ["crescimento normal"],
    },
    avaliar_ganho_ponderal: {
      titulo: "Ganho ponderal adequado",
      descricao: "Ganho ponderal sem alteração clínica evidente.",
      normal: true,
      termosChave: ["ganho ponderal adequado"],
    },
  },

  // 3. CABEÇA E PERÍMETRO
  cabeca_perimetro: {
    avaliar_formato_cranio: {
      titulo: "Crânio normoconfigurado",
      descricao: "Crânio normoconfigurado, sem deformidades aparentes ou assimetrias clinicamente evidentes.",
      normal: true,
      termosChave: ["crânio normoconfigurado"],
    },
    medir_perimetro_cefalico: {
      titulo: "Perímetro cefálico normal",
      descricao: "Perímetro cefálico sem alteração clínica evidente, compatível com a curva de crescimento.",
      normal: true,
      termosChave: ["perímetro cefálico normal"],
    },
    avaliar_fontanela: {
      titulo: "Fontanela normotensa",
      descricao: "Fontanela anterior normotensa, sem abaulamento ou depressão.",
      normal: true,
      termosChave: ["fontanela normotensa"],
    },
    avaliar_suturas_cranianas: {
      titulo: "Suturas cranianas normais",
      descricao: "Suturas cranianas sem diástase ou sobreposição anormal evidente.",
      normal: true,
      termosChave: ["suturas normais"],
    },
    avaliar_sinais_trauma_cranio: {
      titulo: "Sem sinais de trauma craniano",
      descricao: "Sem sinais externos evidentes de trauma craniano.",
      normal: true,
      termosChave: ["sem trauma"],
    },
  },

  // 4. FACE E OLHOS
  face_olhos: {
    avaliar_palidez_conjuntival: {
      titulo: "Conjuntivas normocoradas",
      descricao: "Conjuntivas normocoradas, sem palidez conjuntival evidente.",
      normal: true,
      termosChave: ["conjuntivas normocoradas"],
    },
    avaliar_cianose_central: {
      titulo: "Sem cianose central",
      descricao: "Lábios e língua acianóticos, sem cianose central.",
      normal: true,
      termosChave: ["acianótico"],
    },
    avaliar_sinais_desidratacao: {
      titulo: "Sem sinais de desidratação",
      descricao: "Olhos sem encovamento, mucosas úmidas e sem sinais clínicos evidentes de desidratação.",
      normal: true,
      termosChave: ["sem desidratação"],
    },
    avaliar_conjuntivite: {
      titulo: "Conjuntivas normais",
      descricao: "Conjuntivas sem hiperemia, secreção ou sinais de conjuntivite.",
      normal: true,
      termosChave: ["conjuntivas normais"],
    },
    avaliar_ictericia_escleral: {
      titulo: "Escleras anictéricas",
      descricao: "Escleras anictéricas, sem icterícia evidente.",
      normal: true,
      termosChave: ["anictérico"],
    },
    avaliar_face_toxemica_ou_abatida: {
      titulo: "Face sem alterações",
      descricao: "Face sem aspecto toxêmico ou abatido, com expressão compatível com bom estado clínico.",
      normal: true,
      termosChave: ["face normal"],
    },
  },

  // 5. ORL E OROFARINGE
  orl_orofaringe: {
    avaliar_orofaringe: {
      titulo: "Orofaringe normal",
      descricao: "Orofaringe sem hiperemia importante, sem exsudato e sem lesões aparentes.",
      normal: true,
      termosChave: ["orofaringe normal"],
    },
    avaliar_amigdalas: {
      titulo: "Amígdalas normais",
      descricao: "Amígdalas sem hipertrofia importante, sem placas ou exsudato purulento.",
      normal: true,
      termosChave: ["amígdalas normais"],
    },
    avaliar_mucosa_oral: {
      titulo: "Mucosa oral normal",
      descricao: "Mucosa oral úmida, normocorada, sem lesões aparentes.",
      normal: true,
      termosChave: ["mucosa oral normal"],
    },
    avaliar_congestao_nasal: {
      titulo: "Sem congestão nasal",
      descricao: "Sem congestão nasal importante ao exame.",
      normal: true,
      termosChave: ["sem congestão"],
    },
    avaliar_secrecao_nasal: {
      titulo: "Sem secreção nasal",
      descricao: "Ausência de secreção nasal purulenta ou rinorreia significativa.",
      normal: true,
      termosChave: ["sem secreção"],
    },
    avaliar_sinais_otite: {
      titulo: "Sem sinais de otite",
      descricao: "Sem sinais clínicos evidentes de otite ao exame.",
      normal: true,
      termosChave: ["sem otite"],
    },
    avaliar_manchas_koplik: {
      titulo: "Sem manchas de Koplik",
      descricao: "Ausência de manchas de Koplik em mucosa oral.",
      normal: true,
      termosChave: ["sem Koplik"],
    },
    avaliar_tosse_coriza_conjuntivite: {
      titulo: "Sem tríade clássica",
      descricao: "Sem associação clínica evidente de tosse, coriza e conjuntivite no exame atual.",
      normal: true,
      termosChave: ["sem tríade"],
    },
  },

  // 6. PESCOÇO E LINFONODOS
  pescoco_linfonodos: {
    palpar_linfonodos_cervicais: {
      titulo: "Sem linfonodomegalias cervicais",
      descricao: "Sem linfonodomegalias cervicais clinicamente significativas à palpação.",
      normal: true,
      termosChave: ["sem linfonodomegalias"],
    },
    palpar_cadeia_submentoniana: {
      titulo: "Cadeia submentoniana normal",
      descricao: "Cadeia submentoniana sem linfonodos aumentados ou dolorosos.",
      normal: true,
      termosChave: ["cadeia submentoniana normal"],
    },
    palpar_cadeia_submandibular: {
      titulo: "Cadeia submandibular normal",
      descricao: "Cadeia submandibular sem linfonodos aumentados, endurecidos ou dolorosos.",
      normal: true,
      termosChave: ["cadeia submandibular normal"],
    },
    palpar_cervical_anterior: {
      titulo: "Cadeia cervical anterior normal",
      descricao: "Cadeia cervical anterior sem linfonodomegalias clinicamente significativas.",
      normal: true,
      termosChave: ["cervical anterior normal"],
    },
    palpar_cervical_posterior: {
      titulo: "Cadeia cervical posterior normal",
      descricao: "Cadeia cervical posterior sem linfonodomegalias clinicamente significativas.",
      normal: true,
      termosChave: ["cervical posterior normal"],
    },
    palpar_supraclaviculares: {
      titulo: "Fossas supraclaviculares sem alterações",
      descricao: "Fossas supraclaviculares sem linfonodos palpáveis.",
      normal: true,
      termosChave: ["supraclaviculares normal"],
    },
    palpar_occipitais: {
      titulo: "Região occipital normal",
      descricao: "Região occipital sem linfonodos aumentados ou dolorosos.",
      normal: true,
      termosChave: ["occipital normal"],
    },
    descrever_caracteristicas_linfonodos: {
      titulo: "Sem linfonodos anormais",
      descricao:
        "Não foram identificados linfonodos aumentados, endurecidos, fixos ou dolorosos que necessitem caracterização adicional.",
      normal: true,
      termosChave: ["sem linfonodos anormais"],
    },
    avaliar_rigidez_de_nuca: {
      titulo: "Pescoço móvel",
      descricao: "Pescoço móvel, sem rigidez de nuca.",
      normal: true,
      termosChave: ["pescoço móvel"],
    },
  },

  // 7. TÓRAX RESPIRATÓRIO
  torax_respiratorio: {
    avaliar_frequencia_respiratoria: {
      titulo: "Frequência respiratória normal",
      descricao: "Frequência respiratória sem alteração clínica evidente para a idade no contexto do exame.",
      normal: true,
      termosChave: ["frequência respiratória normal"],
    },
    avaliar_padrao_respiratorio: {
      titulo: "Padrão respiratório regular",
      descricao: "Padrão respiratório regular, sem sinais de desconforto respiratório.",
      normal: true,
      termosChave: ["padrão regular"],
    },
    avaliar_tiragens: {
      titulo: "Sem tiragens",
      descricao: "Ausência de tiragens intercostais, subcostais ou supraesternais.",
      normal: true,
      termosChave: ["sem tiragens"],
    },
    avaliar_expansibilidade_toracica: {
      titulo: "Expansibilidade preservada",
      descricao: "Expansibilidade torácica preservada e simétrica.",
      normal: true,
      termosChave: ["expansibilidade preservada"],
    },
    avaliar_sinais_esforco_respiratorio: {
      titulo: "Sem sinais de esforço",
      descricao:
        "Sem batimento de asa nasal, gemência, retrações ou uso importante de musculatura acessória.",
      normal: true,
      termosChave: ["sem esforço respiratório"],
    },
    auscultar_pulmoes_anterior: {
      titulo: "Ausculta anterior normal",
      descricao: "Murmúrio vesicular presente bilateralmente na ausculta anterior, sem ruídos adventícios.",
      normal: true,
      termosChave: ["murmúrio vesicular bilateral"],
    },
    auscultar_pulmoes_posterior: {
      titulo: "Ausculta posterior normal",
      descricao: "Murmúrio vesicular presente bilateralmente na ausculta posterior, sem ruídos adventícios.",
      normal: true,
      termosChave: ["murmúrio vesicular bilateral"],
    },
    avaliar_murmurio_vesicular: {
      titulo: "Murmúrio vesicular preservado",
      descricao: "Murmúrio vesicular presente e simétrico bilateralmente.",
      normal: true,
      termosChave: ["murmúrio vesicular"],
    },
    avaliar_sibilos: {
      titulo: "Sem sibilos",
      descricao: "Ausência de sibilos à ausculta pulmonar.",
      normal: true,
      termosChave: ["sem sibilos"],
    },
    avaliar_crepitacoes: {
      titulo: "Sem crepitações",
      descricao: "Ausência de crepitações à ausculta pulmonar.",
      normal: true,
      termosChave: ["sem crepitações"],
    },
    avaliar_roncos: {
      titulo: "Sem roncos",
      descricao: "Ausência de roncos à ausculta pulmonar.",
      normal: true,
      termosChave: ["sem roncos"],
    },
    percutir_torax: {
      titulo: "Percussão normal",
      descricao: "Percussão torácica com sonoridade preservada bilateralmente.",
      normal: true,
      termosChave: ["percussão normal"],
    },
    avaliar_submacicez: {
      titulo: "Sem submacicez",
      descricao: "Ausência de submacicez à percussão torácica.",
      normal: true,
      termosChave: ["sem submacicez"],
    },
  },

  // 8. PRECÓRDIO CARDIOVASCULAR
  precordio_cardiovascular: {
    inspecionar_precorcio: {
      titulo: "Precórdio normal",
      descricao: "Precórdio sem abaulamentos, retrações ou impulsões visíveis.",
      normal: true,
      termosChave: ["precórdio normal"],
    },
    palpar_precorcio: {
      titulo: "Palpação precordial normal",
      descricao: "Precórdio sem frêmitos palpáveis ou impulsões anormais.",
      normal: true,
      termosChave: ["palpação normal"],
    },
    avaliar_ictus: {
      titulo: "Ictus normal",
      descricao: "Ictus cordis não desviado e sem alteração clínica evidente à palpação.",
      normal: true,
      termosChave: ["ictus normal"],
    },
    auscultar_foco_aortico: {
      titulo: "Foco aórtico normal",
      descricao: "Foco aórtico com bulhas rítmicas e normofonéticas, sem sopros audíveis.",
      normal: true,
      termosChave: ["foco aórtico normal"],
    },
    auscultar_foco_pulmonar: {
      titulo: "Foco pulmonar normal",
      descricao: "Foco pulmonar com bulhas rítmicas e normofonéticas, sem sopros audíveis.",
      normal: true,
      termosChave: ["foco pulmonar normal"],
    },
    auscultar_foco_tricuspide: {
      titulo: "Foco tricúspide normal",
      descricao: "Foco tricúspide com bulhas rítmicas e normofonéticas, sem sopros audíveis.",
      normal: true,
      termosChave: ["foco tricúspide normal"],
    },
    auscultar_foco_mitral: {
      titulo: "Foco mitral normal",
      descricao: "Foco mitral com bulhas rítmicas e normofonéticas, sem sopros audíveis.",
      normal: true,
      termosChave: ["foco mitral normal"],
    },
    avaliar_bulhas: {
      titulo: "Bulhas rítmicas",
      descricao:
        "Bulhas cardíacas rítmicas, normofonéticas, em dois tempos, sem desdobramentos patológicos evidentes.",
      normal: true,
      termosChave: ["bulhas normais"],
    },
    avaliar_ritmo_cardiaco: {
      titulo: "Ritmo regular",
      descricao: "Ritmo cardíaco regular, sem arritmia evidente ao exame.",
      normal: true,
      termosChave: ["ritmo regular"],
    },
    avaliar_sopro: {
      titulo: "Sem sopros",
      descricao: "Ausência de sopros cardíacos audíveis.",
      normal: true,
      termosChave: ["sem sopros"],
    },
    avaliar_atrito_pericardico: {
      titulo: "Sem atrito pericárdico",
      descricao: "Ausência de atrito pericárdico à ausculta.",
      normal: true,
      termosChave: ["sem atrito"],
    },
    avaliar_precorcio_hiperdinamico: {
      titulo: "Precórdio sem hiperatividade",
      descricao: "Precórdio sem hiperatividade ou impulsões anormais.",
      normal: true,
      termosChave: ["precórdio normal"],
    },
  },

  // 9. PRESSÃO ARTERIAL
  pressao_arterial: {
    escolher_manguito_adequado: {
      titulo: "Manguito adequado",
      descricao: "Manguito selecionado de tamanho adequado para a circunferência do braço da criança.",
      normal: true,
      termosChave: ["manguito adequado"],
    },
    posicionar_crianca_para_pa: {
      titulo: "Posicionamento adequado",
      descricao:
        "Criança posicionada adequadamente para aferição da pressão arterial, em repouso, com postura compatível com a técnica.",
      normal: true,
      termosChave: ["posicionamento adequado"],
    },
    posicionar_braco_altura_coracao: {
      titulo: "Braço ao nível do coração",
      descricao: "Braço posicionado na altura do coração para aferição da pressão arterial.",
      normal: true,
      termosChave: ["braço ao nível correto"],
    },
    aferir_pressao_arterial: {
      titulo: "Pressão arterial normal",
      descricao:
        "Pressão arterial aferida sem alteração clínica evidente, devendo ser interpretada por idade, sexo e estatura.",
      normal: true,
      termosChave: ["PA normal"],
    },
    classificar_pressao_por_percentil: {
      titulo: "Classificação normal",
      descricao:
        "Pressão arterial sem classificação hipertensiva evidente no contexto descrito, devendo ser comparada aos percentis pediátricos.",
      normal: true,
      termosChave: ["PA normal"],
    },
    registrar_braco_utilizado: {
      titulo: "Registro adequado",
      descricao: "Braço utilizado para aferição registrado adequadamente.",
      normal: true,
      termosChave: ["registro adequado"],
    },
  },

  // 10. ABDOME
  abdome: {
    inspecionar_abdome: {
      titulo: "Abdome normal",
      descricao: "Abdome plano ou discretamente globoso conforme idade, sem distensão importante ou circulação colateral visível.",
      normal: true,
      termosChave: ["abdome plano"],
    },
    auscultar_ruidos_hidroaereos: {
      titulo: "Ruídos normais",
      descricao: "Ruídos hidroaéreos presentes, sem alteração clínica evidente.",
      normal: true,
      termosChave: ["ruídos presentes"],
    },
    palpar_abdome_superficial: {
      titulo: "Palpação superficial normal",
      descricao: "Abdome flácido e indolor à palpação superficial.",
      normal: true,
      termosChave: ["abdome flácido"],
    },
    palpar_abdome_profundo: {
      titulo: "Palpação profunda normal",
      descricao: "Abdome indolor à palpação profunda, sem massas palpáveis.",
      normal: true,
      termosChave: ["indolor"],
    },
    avaliar_dor_abdominal: {
      titulo: "Sem dor abdominal",
      descricao: "Ausência de dor abdominal à palpação.",
      normal: true,
      termosChave: ["sem dor"],
    },
    avaliar_defesa_abdominal: {
      titulo: "Sem defesa abdominal",
      descricao: "Ausência de defesa abdominal ou sinais de irritação peritoneal.",
      normal: true,
      termosChave: ["sem defesa"],
    },
    percutir_abdome: {
      titulo: "Percussão normal",
      descricao: "Percussão abdominal sem alteração clínica evidente.",
      normal: true,
      termosChave: ["percussão normal"],
    },
    avaliar_massas_abdominais: {
      titulo: "Sem massas",
      descricao: "Sem massas abdominais palpáveis.",
      normal: true,
      termosChave: ["sem massas"],
    },
  },

  // 11. FÍGADO
  figado: {
    palpar_figado: {
      titulo: "Fígado normal",
      descricao: "Fígado sem aumento clínico evidente à palpação, sem dor à palpação hepática.",
      normal: true,
      termosChave: ["fígado normal"],
    },
    pesquisar_hepatomegalia: {
      titulo: "Sem hepatomegalia",
      descricao: "Ausência de hepatomegalia clinicamente significativa.",
      normal: true,
      termosChave: ["sem hepatomegalia"],
    },
    medir_borda_hepatica: {
      titulo: "Borda hepática normal",
      descricao: "Borda hepática sem aumento clinicamente significativo em relação ao rebordo costal direito.",
      normal: true,
      termosChave: ["borda hepática normal"],
    },
    avaliar_consistencia_figado: {
      titulo: "Consistência normal",
      descricao: "Fígado, quando palpável, de consistência habitual, sem endurecimento descrito.",
      normal: true,
      termosChave: ["consistência normal"],
    },
    avaliar_dor_hepatica: {
      titulo: "Sem dor hepática",
      descricao: "Ausência de dor à palpação hepática.",
      normal: true,
      termosChave: ["sem dor"],
    },
    realizar_manoobra_lemos_torres: {
      titulo: "Manobra de Lemos Torres normal",
      descricao: "Manobra de Lemos Torres sem evidência clínica de hepatomegalia significativa.",
      normal: true,
      termosChave: ["sem hepatomegalia"],
    },
    realizar_manoobra_mathieu: {
      titulo: "Manobra de Mathieu normal",
      descricao: "Manobra de Mathieu sem evidência clínica de hepatomegalia significativa.",
      normal: true,
      termosChave: ["sem hepatomegalia"],
    },
  },

  // 12. BAÇO
  baco: {
    palpar_baco: {
      titulo: "Baço não palpável",
      descricao: "Baço não palpável ao exame abdominal.",
      normal: true,
      termosChave: ["baço não palpável"],
    },
    pesquisar_esplenomegalia: {
      titulo: "Sem esplenomegalia",
      descricao: "Ausência de esplenomegalia clinicamente evidente.",
      normal: true,
      termosChave: ["sem esplenomegalia"],
    },
    avaliar_borda_esplenica: {
      titulo: "Borda esplênica não palpável",
      descricao: "Borda esplênica não palpável.",
      normal: true,
      termosChave: ["borda esplênica normal"],
    },
    avaliar_hepatoesplenomegalia: {
      titulo: "Sem hepatoesplenomegalia",
      descricao: "Ausência de hepatoesplenomegalia clinicamente evidente.",
      normal: true,
      termosChave: ["sem visceromegalias"],
    },
  },

  // 13. PELE E MUCOSAS
  pele_mucosas: {
    avaliar_hidratacao: {
      titulo: "Pele hidratada",
      descricao: "Pele com turgor preservado e mucosas úmidas, sem sinais clínicos de desidratação.",
      normal: true,
      termosChave: ["hidratada"],
    },
    avaliar_turgor_cutaneo: {
      titulo: "Turgor cutâneo preservado",
      descricao: "Turgor cutâneo preservado.",
      normal: true,
      termosChave: ["turgor preservado"],
    },
    avaliar_exantema: {
      titulo: "Sem exantema",
      descricao: "Pele sem exantema visível.",
      normal: true,
      termosChave: ["sem exantema"],
    },
    avaliar_lesoes_elementares: {
      titulo: "Pele sem lesões",
      descricao:
        "Pele sem lesões elementares aparentes, sem máculas, pápulas, vesículas, pústulas ou placas descritas.",
      normal: true,
      termosChave: ["sem lesões"],
    },
    avaliar_petequias: {
      titulo: "Sem petéquias",
      descricao: "Ausência de petéquias.",
      normal: true,
      termosChave: ["sem petéquias"],
    },
    avaliar_equimoses: {
      titulo: "Sem equimoses",
      descricao: "Ausência de equimoses.",
      normal: true,
      termosChave: ["sem equimoses"],
    },
    avaliar_hematomas: {
      titulo: "Sem hematomas",
      descricao: "Ausência de hematomas visíveis.",
      normal: true,
      termosChave: ["sem hematomas"],
    },
    avaliar_ictericia_cutanea: {
      titulo: "Pele anictérica",
      descricao: "Pele anictérica, sem icterícia cutânea evidente.",
      normal: true,
      termosChave: ["anictérico"],
    },
    avaliar_palidez_cutanea: {
      titulo: "Pele normocorada",
      descricao: "Pele normocorada, sem palidez cutânea evidente.",
      normal: true,
      termosChave: ["normocorada"],
    },
    avaliar_sinais_maus_tratos: {
      titulo: "Sem sinais de maus-tratos",
      descricao:
        "Ausência de lesões, equimoses, hematomas ou marcas sugestivas de maus-tratos ao exame.",
      normal: true,
      termosChave: ["sem maus-tratos"],
    },
    avaliar_distribuicao_lesoes: {
      titulo: "Distribuição normal",
      descricao: "Ausência de lesões cutâneas que necessitem descrição de distribuição.",
      normal: true,
      termosChave: ["sem lesões"],
    },
  },

  // 14. MEMBROS E PERFUSÃO
  membros_perfusao: {
    avaliar_perfusao_periferica: {
      titulo: "Perfusão preservada",
      descricao: "Extremidades aquecidas e bem perfundidas.",
      normal: true,
      termosChave: ["perfusão preservada"],
    },
    avaliar_tempo_enchimento_capilar: {
      titulo: "TEC normal",
      descricao: "Tempo de enchimento capilar menor que 2 segundos.",
      normal: true,
      termosChave: ["TEC < 2s"],
    },
    palpar_pulsos_perifericos: {
      titulo: "Pulsos periféricos normais",
      descricao: "Pulsos periféricos palpáveis, simétricos e de boa amplitude.",
      normal: true,
      termosChave: ["pulsos normais"],
    },
    avaliar_edema: {
      titulo: "Sem edema",
      descricao: "Ausência de edema em membros.",
      normal: true,
      termosChave: ["sem edema"],
    },
    avaliar_baqueteamento_digital: {
      titulo: "Sem baqueteamento digital",
      descricao: "Ausência de baqueteamento digital.",
      normal: true,
      termosChave: ["sem baqueteamento"],
    },
    avaliar_cianose_extremidades: {
      titulo: "Extremidades acianóticas",
      descricao: "Extremidades acianóticas, sem cianose periférica.",
      normal: true,
      termosChave: ["acianótico"],
    },
    avaliar_equimoses_membros: {
      titulo: "Sem equimoses em membros",
      descricao: "Ausência de equimoses em membros.",
      normal: true,
      termosChave: ["sem equimoses"],
    },
    avaliar_deformidades_ou_fraturas: {
      titulo: "Sem deformidades",
      descricao: "Sem deformidades, encurtamentos ou sinais externos evidentes de fratura.",
      normal: true,
      termosChave: ["sem deformidades"],
    },
    avaliar_dor_a_palpacao_membros: {
      titulo: "Sem dor em membros",
      descricao: "Ausência de dor à palpação dos membros.",
      normal: true,
      termosChave: ["sem dor"],
    },
    avaliar_teste_do_laco: {
      titulo: "Teste do laço negativo",
      descricao: "Teste do laço sem positividade descrita no exame.",
      normal: true,
      termosChave: ["teste negativo"],
    },
  },

  // 15. DESENVOLVIMENTO
  desenvolvimento: {
    avaliar_marcos_motores: {
      titulo: "Marcos motores adequados",
      descricao: "Marcos motores sem atraso clínico evidente para a idade.",
      normal: true,
      termosChave: ["marcos adequados"],
    },
    avaliar_sustento_cefalico: {
      titulo: "Sustento cefálico normal",
      descricao: "Sustento cefálico compatível com a faixa etária.",
      normal: true,
      termosChave: ["sustento normal"],
    },
    avaliar_sentado_sem_apoio: {
      titulo: "Senta-se adequadamente",
      descricao: "Capacidade de sentar sem apoio compatível com a idade, quando aplicável.",
      normal: true,
      termosChave: ["senta adequadamente"],
    },
    avaliar_engatinhar: {
      titulo: "Mobilidade compatível",
      descricao: "Engatinhar ou mobilidade compatível com a faixa etária, quando aplicável.",
      normal: true,
      termosChave: ["mobilidade adequada"],
    },
    avaliar_pinca: {
      titulo: "Pinça digitada normal",
      descricao: "Preensão em pinça ou motricidade fina compatível com a faixa etária, quando aplicável.",
      normal: true,
      termosChave: ["pinça adequada"],
    },
    avaliar_balbucio: {
      titulo: "Balbucio normal",
      descricao: "Balbucio ou comunicação vocal compatível com a idade, quando aplicável.",
      normal: true,
      termosChave: ["balbucio adequado"],
    },
    avaliar_interacao_social: {
      titulo: "Interação social adequada",
      descricao: "Interação social compatível com a faixa etária.",
      normal: true,
      termosChave: ["interação adequada"],
    },
    comparar_marcos_com_idade: {
      titulo: "Desenvolvimento dentro da normalidade",
      descricao: "Marcos do desenvolvimento sem atraso clínico evidente quando comparados à idade.",
      normal: true,
      termosChave: ["desenvolvimento normal"],
    },
    avaliar_sinais_alerta_desenvolvimento: {
      titulo: "Sem sinais de alerta",
      descricao: "Ausência de sinais de alerta evidentes para atraso do desenvolvimento.",
      normal: true,
      termosChave: ["sem sinais de alerta"],
    },
    avaliar_marcha: {
      titulo: "Marcha normal",
      descricao: "Marcha sem alteração clínica evidente para a idade.",
      normal: true,
      termosChave: ["marcha normal"],
    },
    avaliar_linguagem: {
      titulo: "Linguagem apropriada",
      descricao: "Linguagem compatível com a faixa etária, sem atraso evidente.",
      normal: true,
      termosChave: ["linguagem adequada"],
    },
    avaliar_brincar: {
      titulo: "Brincadeira apropriada",
      descricao: "Brincar e interação lúdica compatíveis com a faixa etária.",
      normal: true,
      termosChave: ["brincadeira adequada"],
    },
    avaliar_coordenacao: {
      titulo: "Coordenação normal",
      descricao: "Coordenação motora sem alteração clínica evidente.",
      normal: true,
      termosChave: ["coordenação normal"],
    },
    avaliar_desempenho_funcional: {
      titulo: "Desempenho funcional apropriado",
      descricao: "Desempenho funcional compatível com a idade.",
      normal: true,
      termosChave: ["desempenho adequado"],
    },
    avaliar_linguagem_comunicacao: {
      titulo: "Comunicação apropriada",
      descricao: "Linguagem e comunicação compatíveis com a faixa etária.",
      normal: true,
      termosChave: ["comunicação adequada"],
    },
    avaliar_comportamento: {
      titulo: "Comportamento apropriado",
      descricao: "Comportamento compatível com a idade, sem alteração clínica evidente.",
      normal: true,
      termosChave: ["comportamento normal"],
    },
  },
};

// Função helper para obter normalidade específica
export function obterNormalidadeClinica(
  regiaoId: string,
  acaoId: string
): NormalidadeClinicaPediatrica | null {
  return NORMALIDADES_EXAME_PEDIATRICO[regiaoId]?.[acaoId] || null;
}

// Função helper para obter normalidade genérica da região
export function obterNormalidadeRegiao(regiaoId: string): NormalidadeClinicaPediatrica | null {
  const region = NORMALIDADES_EXAME_PEDIATRICO[regiaoId];
  if (!region) return null;

  const primeiraAcao = Object.values(region)[0];
  return primeiraAcao || null;
}
