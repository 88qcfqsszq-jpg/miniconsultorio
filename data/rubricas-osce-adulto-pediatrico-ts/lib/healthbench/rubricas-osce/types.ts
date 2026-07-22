export type TipoPacienteOSCE = 'adulto' | 'pediatrico'

export type DominioRubricaOSCE =
  | 'comunicacao'
  | 'anamnese'
  | 'exameFisico'
  | 'examesComplementares'
  | 'raciocinioDiagnostico'
  | 'conduta'

export interface CriterioRubricaOSCE {
  id: string
  descricao: string
  peso: number
  obrigatorio?: boolean
  tags?: string[]
}

export interface DominioOSCERubrica {
  id: DominioRubricaOSCE
  titulo: string
  pontos: number
  criterios: CriterioRubricaOSCE[]
}

export interface RubricaOSCE {
  id: string
  versao: string
  tipo: TipoPacienteOSCE
  nome: string
  totalPontos: 20
  dominios: DominioOSCERubrica[]
  regrasGerais: string[]
}

export type RubricaBaseId = 'adulto-generica-v1' | 'pediatrica-generica-v1'

export interface PerfilRubricaCaso {
  caseId: string
  tipo: TipoPacienteOSCE
  titulo: string
  sistema: string
  rubricaBase: RubricaBaseId
  focoAnamnese: string[]
  focoExameFisico: string[]
  examesEssenciais: string[]
  focoDiagnostico: string[]
  condutasEssenciais: string[]
  criteriosCriticos: string[]
  seguranca: string[]
  aliasesExames?: Record<string, string[]>
}

export interface RubricaResolvidaOSCE {
  rubrica: RubricaOSCE
  perfilCaso?: PerfilRubricaCaso
}
