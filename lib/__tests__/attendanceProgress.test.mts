/**
 * Testes de lib/attendanceProgress.ts — foco na correção do crash
 * "diagnostico.diagnosticosDiferenciais.map" (undefined) em
 * components/PainelDiagnostico.tsx, causado por snapshots antigos salvos no
 * localStorage com o typo legado "diagnosticosDisferenciais" ou sem o campo.
 *
 * getAttendanceProgress só executa fora do guard `typeof window === "undefined"`,
 * então um `window.localStorage` mínimo (Map em memória) é montado só para
 * esta suíte e restaurado ao final — nenhum navegador real é necessário.
 *
 * Runner: npx tsx --test lib/__tests__/attendanceProgress.test.mts
 */

import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { getAttendanceProgress } from "@/lib/attendanceProgress";

const CASO_ID = "caso-teste-attendance-progress";
const STORAGE_KEY = `medix.attendance.${CASO_ID}`;

function criarLocalStorageEmMemoria() {
  const dados = new Map<string, string>();
  return {
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => {
      dados.set(k, v);
    },
    removeItem: (k: string) => {
      dados.delete(k);
    },
  };
}

let windowOriginal: unknown;
before(() => {
  windowOriginal = (globalThis as { window?: unknown }).window;
  (globalThis as { window?: unknown }).window = { localStorage: criarLocalStorageEmMemoria() };
});
after(() => {
  (globalThis as { window?: unknown }).window = windowOriginal;
});

function salvarBruto(valor: unknown) {
  (globalThis as unknown as { window: { localStorage: { setItem: (k: string, v: string) => void } } }).window
    .localStorage.setItem(STORAGE_KEY, JSON.stringify(valor));
}

beforeEach(() => {
  (globalThis as unknown as { window: { localStorage: { removeItem: (k: string) => void } } }).window.localStorage.removeItem(
    STORAGE_KEY
  );
});

test("1. snapshot já correto (diagnosticosDiferenciais como array) é preservado sem alteração", () => {
  salvarBruto({ diagnostico: { hipotesePrincipal: "IAM", diagnosticosDiferenciais: ["Angina"], examesIndicados: [], conduta: "" } });
  const snap = getAttendanceProgress(CASO_ID);
  assert.deepEqual(snap?.diagnostico.diagnosticosDiferenciais, ["Angina"]);
});

test("2. snapshot legado com o typo 'diagnosticosDisferenciais' é migrado para 'diagnosticosDiferenciais'", () => {
  salvarBruto({ diagnostico: { hipotesePrincipal: "IAM", diagnosticosDisferenciais: ["Angina", "Pericardite"], conduta: "" } });
  const snap = getAttendanceProgress(CASO_ID);
  assert.deepEqual(snap?.diagnostico.diagnosticosDiferenciais, ["Angina", "Pericardite"]);
});

test("3. snapshot sem diagnosticosDiferenciais (e sem o typo legado) volta a ser [] — nunca undefined", () => {
  salvarBruto({ diagnostico: { hipotesePrincipal: "IAM", conduta: "" } });
  const snap = getAttendanceProgress(CASO_ID);
  assert.deepEqual(snap?.diagnostico.diagnosticosDiferenciais, []);
});

test("4. snapshot sem o campo diagnostico algum não quebra (permanece undefined, não crasha a normalização)", () => {
  salvarBruto({ mensagens: [] });
  const snap = getAttendanceProgress(CASO_ID);
  assert.equal(snap?.diagnostico, undefined);
});

test("5. nenhum snapshot salvo → null (comportamento pré-existente preservado)", () => {
  const snap = getAttendanceProgress(CASO_ID);
  assert.equal(snap, null);
});
