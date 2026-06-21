import { gerarExameFisicoVisualAPartirDoCaso } from "@/lib/pediatria/adaptador-exame-fisico-caso";
import { casosPediatricos } from "@/data/casos-pediatricos";

const casosParaTestar = ["ped-01", "ped-05", "ped-13", "ped-16"];

console.log("╔" + "═".repeat(98) + "╗");
console.log("║" + " ".repeat(98) + "║");
console.log("║" + "  TESTE DO ADAPTADOR: Exame Físico Pediátrico a Partir do Caso".padEnd(98) + "║");
console.log("║" + " ".repeat(98) + "║");
console.log("╚" + "═".repeat(98) + "╝");

for (const casoId of casosParaTestar) {
  const caso = casosPediatricos.find((c) => c.id === casoId);

  if (!caso) {
    console.log(`\n❌ Caso ${casoId} não encontrado\n`);
    continue;
  }

  const resultado = gerarExameFisicoVisualAPartirDoCaso(caso);

  if (!resultado) {
    console.log(`\n❌ ${casoId}: Nenhum resultado gerado (pode não ser pediátrico)\n`);
    continue;
  }

  console.log(`\n┌─ ${casoId.toUpperCase()} ─────────────────────────────────────────────────────────┐`);
  console.log(`│ Origem: ${resultado.origem}`);
  console.log(`│ Total de regiões: ${resultado.regioes.length}`);
  console.log(`└────────────────────────────────────────────────────────────────────────────────────┘`);

  for (const regiao of resultado.regioes) {
    console.log(`\n  📍 REGIÃO: ${regiao.label} (${regiao.id})`);
    if (regiao.sistemaClinico) {
      console.log(`     Sistema: ${regiao.sistemaClinico}`);
    }
    console.log(`     Ações: ${regiao.acoes.length}`);

    for (const acao of regiao.acoes) {
      const achado = acao.achado;
      const normalEmoji = achado.normal ? "✅" : "⚠️";

      console.log(`       ${normalEmoji} ${acao.label}`);
      console.log(`          ID: ${acao.id}`);
      console.log(`          Descrição: ${achado.descricao.substring(0, 60)}${achado.descricao.length > 60 ? "..." : ""}`);
      console.log(
        `          Normal: ${achado.normal ? "SIM" : "NÃO"} | Origem: ${achado.origem} | Campo: ${achado.campo_original}`
      );
    }
  }

  console.log("");
}

console.log("\n╔" + "═".repeat(98) + "╗");
console.log("║" + "  CRITÉRIOS DE SUCESSO".padEnd(98) + "║");
console.log("╚" + "═".repeat(98) + "╝");

const ped01 = casosPediatricos.find((c) => c.id === "ped-01");
const ped05 = casosPediatricos.find((c) => c.id === "ped-05");
const ped13 = casosPediatricos.find((c) => c.id === "ped-13");
const ped16 = casosPediatricos.find((c) => c.id === "ped-16");

const resultados = {
  ped01: gerarExameFisicoVisualAPartirDoCaso(ped01!),
  ped05: gerarExameFisicoVisualAPartirDoCaso(ped05!),
  ped13: gerarExameFisicoVisualAPartirDoCaso(ped13!),
  ped16: gerarExameFisicoVisualAPartirDoCaso(ped16!),
};

const testes = [
  {
    nome: "ped-01 gera >= 3 regiões",
    ok: (resultados.ped01?.regioes.length ?? 0) >= 3,
  },
  {
    nome: "ped-01 tem face_olhos",
    ok: resultados.ped01?.regioes.some((r) => r.id === "face_olhos"),
  },
  {
    nome: "ped-01 tem torax_respiratorio",
    ok: resultados.ped01?.regioes.some((r) => r.id === "torax_respiratorio"),
  },
  {
    nome: "ped-05 tem precordio",
    ok: resultados.ped05?.regioes.some((r) => r.id === "precordio"),
  },
  {
    nome: "ped-13 tem torax_respiratorio",
    ok: resultados.ped13?.regioes.some((r) => r.id === "torax_respiratorio"),
  },
  {
    nome: "ped-16 tem pele_mucosas OU membros_perfusao",
    ok: resultados.ped16?.regioes.some((r) => r.id === "pele_mucosas" || r.id === "membros_perfusao"),
  },
  {
    nome: "Todas as regiões têm >= 1 ação",
    ok: [...Object.values(resultados)].every((r) =>
      r?.regioes.every((reg) => reg.acoes.length >= 1)
    ),
  },
  {
    nome: "Toda ação tem achado",
    ok: [...Object.values(resultados)].every((r) =>
      r?.regioes.every((reg) => reg.acoes.every((a) => a.achado !== undefined))
    ),
  },
  {
    nome: "Todo achado tem casoId",
    ok: [...Object.values(resultados)].every((r) =>
      r?.regioes.every((reg) =>
        reg.acoes.every((a) => a.achado.casoId !== undefined && a.achado.casoId !== "")
      )
    ),
  },
  {
    nome: "Todo achado tem origem",
    ok: [...Object.values(resultados)].every((r) =>
      r?.regioes.every((reg) =>
        reg.acoes.every((a) => a.achado.origem !== undefined)
      )
    ),
  },
  {
    nome: "Todo achado tem campo_original",
    ok: [...Object.values(resultados)].every((r) =>
      r?.regioes.every((reg) =>
        reg.acoes.every((a) => a.achado.campo_original !== undefined)
      )
    ),
  },
];

let passados = 0;
let falhados = 0;

for (const teste of testes) {
  const emoji = teste.ok ? "✅" : "❌";
  console.log(`${emoji} ${teste.nome}`);
  if (teste.ok) {
    passados++;
  } else {
    falhados++;
  }
}

console.log(
  `\n📊 RESULTADO: ${passados}/${testes.length} testes passados${falhados > 0 ? `, ${falhados} falhados` : ""}`
);

if (falhados === 0) {
  console.log("🎉 SUCESSO: Adaptador pronto para integração!");
  process.exit(0);
} else {
  console.log("⚠️  AVISO: Alguns testes falharam, revisar implementação");
  process.exit(1);
}
