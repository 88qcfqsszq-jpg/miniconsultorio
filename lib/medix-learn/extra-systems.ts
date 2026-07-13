import type { LearnSystem } from "./types";

export const GASTRO_ABDOME: LearnSystem = {
  id: "gastro-abdome",
  titulo: "Gastro/Abdome",
  descricao: "Dor abdominal, náuseas, icterícia, hemorragia digestiva e abdome agudo.",
  disponivel: true,
  href: "/learn/gastro-abdome",
  trilhas: [
    { id: "dor-abdominal", titulo: "Dor abdominal", descricao: "Dor abdominal: localização, padrão e hipóteses.", disponivel: true, href: "/learn/gastro-abdome/dor-abdominal" },
    { id: "nauseas-vomitos-e-diarreia", titulo: "Náuseas, vômitos e diarreia", descricao: "Síndrome gastrointestinal aguda.", disponivel: true, href: "/learn/gastro-abdome/nauseas-vomitos-e-diarreia" },
    { id: "ictericia", titulo: "Icterícia", descricao: "Icterícia: mecanismo, causas e investigação.", disponivel: true, href: "/learn/gastro-abdome/ictericia" },
    { id: "hemorragia-digestiva", titulo: "Hemorragia digestiva", descricao: "Hemorragia digestiva alta e baixa.", disponivel: true, href: "/learn/gastro-abdome/hemorragia-digestiva" },
    { id: "abdome-agudo", titulo: "Abdome agudo", descricao: "Abdome agudo cirúrgico e clínico.", disponivel: true, href: "/learn/gastro-abdome/abdome-agudo" },
    { id: "exame-fisico-abdominal", titulo: "Exame físico abdominal", descricao: "Palpação, ausculta e percussão abdominal.", disponivel: true, href: "/learn/gastro-abdome/exame-fisico-abdominal" },
    { id: "hepatologia-basica", titulo: "Hepatologia básica", descricao: "Fígado: função, disfunção e hepatopatia.", disponivel: true, href: "/learn/gastro-abdome/hepatologia-basica" },
  ],
};

export const SEMIOLOGIA_GERAL: LearnSystem = {
  id: "semiologia-geral",
  titulo: "Semiologia Geral",
  descricao: "Anamnese, sinais vitais, dor, exame físico geral, comunicação e grupos especiais.",
  disponivel: true,
  href: "/learn/semiologia-geral",
  trilhas: [
    { id: "anamnese-clinica-estruturada", titulo: "Anamnese estruturada", descricao: "Anamnese: queixa, HDA e revisão de sistemas.", disponivel: true, href: "/learn/semiologia-geral/anamnese-clinica-estruturada" },
    { id: "sinais-vitais-e-gravidade", titulo: "Sinais vitais e gravidade", descricao: "Sinais vitais e reconhecimento de instabilidade.", disponivel: true, href: "/learn/semiologia-geral/sinais-vitais-e-gravidade" },
    { id: "dor-como-quinto-sinal", titulo: "Dor como quinto sinal", descricao: "Avaliação da dor, escalas e documentação.", disponivel: true, href: "/learn/semiologia-geral/dor-como-quinto-sinal" },
    { id: "exame-fisico-geral", titulo: "Exame físico geral", descricao: "Exame físico geral da cabeça aos pés.", disponivel: true, href: "/learn/semiologia-geral/exame-fisico-geral" },
    { id: "comunicacao-clinica", titulo: "Comunicação clínica", descricao: "Comunicação médico-paciente e relação terapêutica.", disponivel: true, href: "/learn/semiologia-geral/comunicacao-clinica" },
    { id: "pediatria-sinais-de-gravidade", titulo: "Pediatria: sinais de gravidade", descricao: "Reconhecimento de gravidade na criança.", disponivel: true, href: "/learn/semiologia-geral/pediatria-sinais-de-gravidade" },
    { id: "idoso-apresentacao-atipica", titulo: "Idoso: apresentação atípica", descricao: "Como o idoso apresenta doenças de forma diferente.", disponivel: true, href: "/learn/semiologia-geral/idoso-apresentacao-atipica" },
  ],
};

export const RACIOCINIO_CLINICO: LearnSystem = {
  id: "raciocinio-clinico",
  titulo: "Raciocínio Clínico",
  descricao: "Síndromes, hipóteses, priorização, exames, conduta e apresentação clínica.",
  disponivel: true,
  href: "/learn/raciocinio-clinico",
  trilhas: [
    { id: "sindromes-antes-de-diagnosticos", titulo: "Síndromes antes de diagnósticos", descricao: "Síndrome como primeiro passo do raciocínio clínico.", disponivel: true, href: "/learn/raciocinio-clinico/sindromes-antes-de-diagnosticos" },
    { id: "hipoteses-e-diagnostico-diferencial", titulo: "Hipóteses e diferencial", descricao: "Formular hipóteses e raciocínio diagnóstico.", disponivel: true, href: "/learn/raciocinio-clinico/hipoteses-e-diagnostico-diferencial" },
    { id: "priorizacao-e-erro-critico", titulo: "Priorização e erro crítico", descricao: "Priorizar e evitar erros em urgências.", disponivel: true, href: "/learn/raciocinio-clinico/priorizacao-e-erro-critico" },
    { id: "exames-que-mudam-conduta", titulo: "Exames que mudam conduta", descricao: "Solicitar exames que realmente mudam a decisão.", disponivel: true, href: "/learn/raciocinio-clinico/exames-que-mudam-conduta" },
    { id: "conduta-inicial-e-reavaliacao", titulo: "Conduta inicial e reavaliação", descricao: "Conduta inicial sistemática e reavaliação clínica.", disponivel: true, href: "/learn/raciocinio-clinico/conduta-inicial-e-reavaliacao" },
    { id: "erros-cognitivos-em-medicina", titulo: "Erros cognitivos em medicina", descricao: "Vieses cognitivos e erros diagnósticos comuns.", disponivel: true, href: "/learn/raciocinio-clinico/erros-cognitivos-em-medicina" },
    { id: "soap-e-apresentacao-clinica", titulo: "SOAP e apresentação clínica", descricao: "SOAP, raciocínio e apresentação para equipe.", disponivel: true, href: "/learn/raciocinio-clinico/soap-e-apresentacao-clinica" },
  ],
};
