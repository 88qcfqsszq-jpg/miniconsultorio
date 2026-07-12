export type { LearnTrailData, LearnSystem, LearnTrailItem, LearnMiniCase, LearnQuestion, LearnBridge, LearnSection } from "./types";
export { trilhaHipoxemia } from "./trilhas/hipoxemia";

import type { LearnSystem } from "./types";

export const LEARN_SYSTEMS: LearnSystem[] = [
  {
    id: "respiratorio",
    titulo: "Respiratório",
    descricao:
      "Hipoxemia, dispneia, sibilância, tosse, dor torácica e exame físico respiratório.",
    disponivel: true,
    href: "/learn/respiratorio",
    trilhas: [
      {
        id: "hipoxemia",
        titulo: "Hipoxemia",
        descricao:
          "SpO₂, oxigenação, ventilação, V/Q, shunt, hipoventilação e mini-casos clínicos.",
        disponivel: true,
        href: "/learn/respiratorio/hipoxemia",
      },
      { id: "dispneia", titulo: "Dispneia", descricao: "Em breve.", disponivel: false, href: "#" },
      { id: "sibilancia", titulo: "Sibilância e broncoespasmo", descricao: "Em breve.", disponivel: false, href: "#" },
      { id: "tosse-febre", titulo: "Tosse e febre", descricao: "Em breve.", disponivel: false, href: "#" },
      { id: "dor-pleuritica", titulo: "Dor torácica pleurítica", descricao: "Em breve.", disponivel: false, href: "#" },
      { id: "ef-resp", titulo: "Exame físico respiratório", descricao: "Em breve.", disponivel: false, href: "#" },
    ],
  },
  {
    id: "cardiovascular",
    titulo: "Cardiovascular",
    descricao: "Dor torácica, síncope, edema, sopro e pressão arterial.",
    disponivel: false,
    href: "#",
    trilhas: [],
  },
  {
    id: "infectologia",
    titulo: "Infectologia",
    descricao: "Febre, sepse, dengue e infecções respiratórias.",
    disponivel: false,
    href: "#",
    trilhas: [],
  },
  {
    id: "neurologia",
    titulo: "Neurologia",
    descricao: "Cefaleia, confusão mental e déficit focal.",
    disponivel: false,
    href: "#",
    trilhas: [],
  },
  {
    id: "gastro",
    titulo: "Gastroenterologia",
    descricao: "Dor abdominal, icterícia e vômitos.",
    disponivel: false,
    href: "#",
    trilhas: [],
  },
];
