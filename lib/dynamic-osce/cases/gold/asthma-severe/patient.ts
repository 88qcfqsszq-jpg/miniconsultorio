import type { GoldAsthmaNarrative } from './types'

export const GOLD_ASTHMA_PATIENT = {
  name: 'Rafael Menezes',
  sex: 'male',
  ageYears: 44,
  weightKg: 77,
  heightCm: 177,
} as const

export const GOLD_ASTHMA_NARRATIVE: GoldAsthmaNarrative = {
  priorDiagnosis: 'Asma diagnosticada na adolescência, com exacerbações recorrentes.',
  usualTreatment: 'Budesonida-formoterol de manutenção e salbutamol (albuterol) de resgate.',
  adherence: 'Adesão irregular ao controlador nas últimas seis semanas.',
  previousAdmissions: 'Três internações prévias por exacerbação de asma.',
  priorIcu: 'Uma admissão em UTI há quatro anos.',
  priorIntubation: 'Uma intubação orotraqueal durante a admissão prévia em UTI.',
  allergies: 'Rinite alérgica e sensibilização a ácaros; nega alergia medicamentosa conhecida.',
  smoking: 'Nunca fumou; exposição passiva ocasional no trabalho.',
  likelyTrigger: 'Exposição intensa a poeira durante reforma no local de trabalho.',
  crisisDuration: 'Dispneia e chiado progressivos há aproximadamente oito horas.',
  attemptedMeasures: 'Usou quatro jatos de salbutamol em casa, com alívio breve e recorrência.',
  associatedSymptoms: 'Tosse seca e aperto torácico; nega febre, urticária, edema de face ou dor pleurítica.',
  socialContext: 'Mora com a companheira, trabalha como supervisor de estoque e tem acesso irregular à atenção primária.',
}
