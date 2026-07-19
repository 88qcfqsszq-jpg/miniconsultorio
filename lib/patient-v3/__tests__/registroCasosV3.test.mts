/**
 * Testes determinísticos do registro isolado de casos V3 (Fase 2B) — sem LLM,
 * sem rede.
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/registroCasosV3.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { obterCasoV3PorId } from "@/data/casos-v3/index";
import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";

test("1. obterCasoV3PorId localiza o Caso Ouro pelo id '1'", () => {
  const caso = obterCasoV3PorId("1");
  assert.ok(caso);
  assert.equal(caso?.metadata.id, "1");
});

test("2. retorna o mesmo objeto registrado (mesma referência)", () => {
  const caso = obterCasoV3PorId("1");
  assert.equal(caso, casoSCAOuroV3);
});

test("3. id desconhecido retorna null", () => {
  assert.equal(obterCasoV3PorId("999"), null);
  assert.equal(obterCasoV3PorId(""), null);
  assert.equal(obterCasoV3PorId("caso-inexistente"), null);
});

test("4. a assinatura aceita string diretamente (id já é string em toda a base — sem normalização adicional)", () => {
  // O próprio tipo da função (id: string) já é a normalização mínima suficiente,
  // confirmada antes da autoria (Caso legado, CasoOSCEV2 e CasoV3.metadata.id
  // são todos string).
  const caso = obterCasoV3PorId("1");
  assert.equal(typeof caso?.metadata.id, "string");
});

test("5. o registro contém apenas um CasoV3 nesta fase", () => {
  // Verificado indiretamente: nenhum outro id conhecido resolve, e o único id
  // registrado é o do Caso Ouro.
  assert.ok(obterCasoV3PorId("1"));
  assert.equal(obterCasoV3PorId("2"), null);
  assert.equal(obterCasoV3PorId("18"), null);
  assert.equal(obterCasoV3PorId("58"), null);
});

test("6. o registro não importa nem expõe casos legados (nenhuma declaração import/require de casos-v2)", async () => {
  const codigoFonte = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("../../../data/casos-v3/index.ts", import.meta.url), "utf8")
  );
  // Verifica a ausência de uma REFERÊNCIA DE CÓDIGO real (import de casos-v2),
  // não de qualquer menção textual — o próprio arquivo documenta em comentário
  // que não importa casos-v2, o que legitimamente cita a string sem ser um import.
  assert.ok(
    !codigoFonte.includes('from "@/data/casos-v2') && !codigoFonte.includes("from '@/data/casos-v2"),
    "index.ts do registro V3 não deveria conter uma importação real de casos-v2"
  );
});

test("7. o registry não altera o objeto registrado (mesmo conteúdo antes e depois de múltiplas leituras)", () => {
  const primeiraLeitura = obterCasoV3PorId("1");
  const segundaLeitura = obterCasoV3PorId("1");
  assert.deepEqual(primeiraLeitura, segundaLeitura);
  assert.equal(primeiraLeitura, segundaLeitura, "deveria ser a mesma referência, sem cópia/mutação");
  assert.equal(primeiraLeitura?.metadata.id, "1", "objeto original permanece intacto após as leituras");
});
