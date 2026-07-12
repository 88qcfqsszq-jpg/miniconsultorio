// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE LOCAL DISCOVERY (Fase 7)
// ----------------------------------------------------------------------------
// Inspeciona o sistema de arquivos local em busca da instalação do Pulse,
// usando apenas `fs` e `path`. NÃO executa nenhum processo externo.
// NÃO conecta à rede. READ-ONLY sobre .reference-local/.
// ============================================================================

import fs from "fs";
import path from "path";

// Diretórios que devem ser ignorados durante varredura recursiva (custosos/irrelevantes).
const SKIP_DIRS = new Set([".git", "node_modules", ".cache", "__pycache__", "build", ".idea"]);

// Palavras-chave no nome do arquivo que indicam um cenário de asma.
const ASTHMA_KEYWORDS_RE = /asthma|asma|bronchoconstrict|bronco/i;

// Palavras-chave que indicam um cenário respiratório/pulmonar relevante (amplo).
const RESP_KEYWORDS_RE = /asthma|asma|broncho|bronco|copd|dpoc|pneumon|pneumo|respirat/i;

export interface LocalPulseDiscoveryResult {
  found: boolean;
  rootPath?: string;
  executableCandidates: string[];
  scenarioCandidates: string[];
  asthmaScenarioCandidates: string[];
  pythonApiPath?: string;
  howtoFiles: string[];
  stateFiles: string[];
  notes: string[];
  warnings: string[];
}

/**
 * Varre o sistema de arquivos à procura da instalação local do Pulse.
 * Não executa binários, não faz chamadas de rede.
 *
 * @param rootCandidates Caminhos a verificar (padrão: .reference-local/engine-stable
 *                       relativo ao CWD).
 */
export function discoverLocalPulseInstallation(opts?: {
  rootCandidates?: string[];
}): LocalPulseDiscoveryResult {
  const result: LocalPulseDiscoveryResult = {
    found: false,
    executableCandidates: [],
    scenarioCandidates: [],
    asthmaScenarioCandidates: [],
    howtoFiles: [],
    stateFiles: [],
    notes: [],
    warnings: [],
  };

  // Candidatos padrão de root
  const cwd = process.cwd();
  const defaultCandidates = [
    path.join(cwd, ".reference-local", "engine-stable"),
    path.join(cwd, "..", ".reference-local", "engine-stable"),
  ];
  const candidates = opts?.rootCandidates ?? defaultCandidates;

  // --- 1. Encontrar root -------------------------------------------------------
  let rootPath: string | undefined;
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) {
      rootPath = c;
      break;
    }
  }
  if (!rootPath) {
    result.warnings.push(
      "Instalação local do Pulse NÃO encontrada em nenhum dos candidatos: " +
        candidates.join(", ")
    );
    return result;
  }

  result.found = true;
  result.rootPath = rootPath;
  result.notes.push(`Root Pulse encontrado: ${rootPath}`);

  // --- 2. Python API -----------------------------------------------------------
  const pythonApiDir = path.join(rootPath, "src", "python", "pulse");
  if (fs.existsSync(pythonApiDir)) {
    result.pythonApiPath = pythonApiDir;
    result.notes.push(`Python API localizada em: ${pythonApiDir}`);
  }

  // --- 3. Varredura de arquivos ------------------------------------------------
  walkDir(rootPath, (filePath) => {
    const name = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Executáveis / scripts de entrada
    if (name === "run.sh" || name === "run.bat") {
      result.executableCandidates.push(filePath);
    }
    if (name.startsWith("HowTo") && ext === ".py") {
      result.howtoFiles.push(filePath);
      result.executableCandidates.push(filePath);
    }
    if (name.startsWith("HowTo") && ext === ".cpp") {
      result.howtoFiles.push(filePath);
    }

    // Arquivos de estado inicial (*.json com "State" no nome ou no diretório states/)
    if (
      ext === ".json" &&
      (filePath.includes("/states/") || name.endsWith("State.json") || name.includes("State@"))
    ) {
      result.stateFiles.push(filePath);
    }

    // Cenários JSON: qualquer .json em /scenarios/
    if (ext === ".json" && filePath.includes("/scenarios/")) {
      result.scenarioCandidates.push(filePath);
      if (ASTHMA_KEYWORDS_RE.test(name)) {
        result.asthmaScenarioCandidates.push(filePath);
      }
    }
  });

  // --- 4. Notas sobre executável / compilação ----------------------------------
  const pyPulseAvailable = checkPyPulseAvailable();
  if (pyPulseAvailable) {
    result.notes.push("PyPulse (binding C++) disponível — Python API pronta para uso.");
  } else {
    result.notes.push(
      "PyPulse (binding C++) NÃO encontrado. O Pulse precisa ser compilado via CMake antes do uso."
    );
    result.notes.push(
      "Requisitos para compilar: CMake ≥ 3.12, C++17 (GCC9/Clang5/MSVC2017), Python 3, Java JDK 8."
    );
    result.warnings.push("Pulse ainda não pode ser executado — PyPulse não compilado.");
  }

  // Comando provável (após compilação)
  const howToAsthma = result.howtoFiles.find((f) => /asthma/i.test(f) && f.endsWith(".py"));
  if (howToAsthma && result.pythonApiPath) {
    const relHowTo = path.relative(rootPath, howToAsthma);
    result.notes.push(
      `Comando provável (pós-compilação): cd ${rootPath}/bin && ` +
        `PYTHONPATH=${path.dirname(path.dirname(result.pythonApiPath))} python3 ${howToAsthma}`
    );
    result.notes.push(
      `Cenário recomendado para asma grave: AsthmaAttackSevereAcute.json (severidade 0.75)`
    );
  }

  result.notes.push(
    `Total de cenários encontrados: ${result.scenarioCandidates.length} | ` +
      `Asma: ${result.asthmaScenarioCandidates.length} | ` +
      `Howtos: ${result.howtoFiles.length}`
  );

  return result;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function walkDir(dir: string, callback: (filePath: string) => void): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

/**
 * Tenta detectar se o módulo PyPulse (binding C++) está disponível.
 * Usa apenas verificação de arquivo — não importa o módulo.
 */
function checkPyPulseAvailable(): boolean {
  // Procura por PyPulse.so, PyPulse.pyd ou pasta site-packages com PyPulse
  const sitePkgCandidates = [
    "/usr/local/lib",
    "/usr/lib",
    process.env.HOME ? path.join(process.env.HOME, ".local/lib") : "",
  ].filter(Boolean);

  for (const base of sitePkgCandidates) {
    if (!fs.existsSync(base)) continue;
    // Varre apenas 2 níveis para não ser lento
    try {
      const items = fs.readdirSync(base);
      for (const item of items) {
        if (!item.startsWith("python")) continue;
        const sp = path.join(base, item, "site-packages");
        if (!fs.existsSync(sp)) continue;
        const spItems = fs.readdirSync(sp);
        if (spItems.some((f) => /PyPulse/i.test(f))) return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}
