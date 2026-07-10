"use client";

import { useState, useEffect, type ReactNode } from "react";
import type { DiagnosticoFormulario } from "@/lib/types";

interface PainelDiagnosticoProps {
  onSubmit: (diagnostico: DiagnosticoFormulario) => void;
  onChange?: (diagnostico: DiagnosticoFormulario) => void;
  desabilitado?: boolean;
  caso?: any;
  /** SOAP opcional expansível (renderizado dentro deste painel). Opcional. */
  soapSlot?: ReactNode;
  /** Valor para retomar um atendimento em andamento (progresso salvo). */
  valorInicial?: DiagnosticoFormulario;
}

export default function PainelDiagnostico({
  onSubmit,
  onChange,
  desabilitado = false,
  caso,
  soapSlot,
  valorInicial,
}: PainelDiagnosticoProps) {
  // SOAP começa FECHADO; preenchimento é opcional e não bloqueia a finalização.
  const [soapAberto, setSoapAberto] = useState(false);
  const [diagnostico, setDiagnostico] = useState<DiagnosticoFormulario>(
    () =>
      valorInicial ?? {
        hipotesePrincipal: "",
        diagnosticosDiferenciais: [],
        examesIndicados: [],
        conduta: "",
      }
  );

  const [novoDiferencial, setNovoDiferencial] = useState("");
  const [novoExame, setNovoExame] = useState("");

  useEffect(() => {
    if (onChange) {
      onChange(diagnostico);
    }
  }, [diagnostico, onChange]);

  const handleAdicionarDiferencial = () => {
    if (novoDiferencial.trim()) {
      setDiagnostico((prev) => ({
        ...prev,
        diagnosticosDiferenciais: [
          ...prev.diagnosticosDiferenciais,
          novoDiferencial,
        ],
      }));
      setNovoDiferencial("");
    }
  };

  const handleRemoverDiferencial = (index: number) => {
    setDiagnostico((prev) => ({
      ...prev,
      diagnosticosDiferenciais: prev.diagnosticosDiferenciais.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleAdicionarExame = () => {
    if (novoExame.trim()) {
      setDiagnostico((prev) => ({
        ...prev,
        examesIndicados: [...prev.examesIndicados, novoExame],
      }));
      setNovoExame("");
    }
  };

  const handleRemoverExame = (index: number) => {
    setDiagnostico((prev) => ({
      ...prev,
      examesIndicados: prev.examesIndicados.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !diagnostico.hipotesePrincipal.trim() ||
      !diagnostico.conduta.trim()
    ) {
      alert("Por favor, preencha Hipótese Principal e Conduta");
      return;
    }
    onSubmit(diagnostico);
  };

  return (
    <form onSubmit={handleSubmit} className="medix-diagnosis-card">
      <header className="medix-diagnosis-header">
        <div className="medix-diagnosis-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3v6m0 0a4 4 0 004 4h.5a3.5 3.5 0 100-7M12 9a4 4 0 01-4 4h-.5a3.5 3.5 0 110-7M12 13v3a4 4 0 004 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2>Diagnóstico e Conduta</h2>
          <p>Hipóteses, exames e plano clínico</p>
        </div>
      </header>

      <div className="medix-diagnosis-section">
        <label>Hipótese Principal</label>
        <input
          type="text"
          value={diagnostico.hipotesePrincipal}
          onChange={(e) => setDiagnostico((prev) => ({ ...prev, hipotesePrincipal: e.target.value }))}
          placeholder="Ex: Síndrome Coronariana Aguda"
          disabled={desabilitado}
        />
      </div>

      <div className="medix-diagnosis-section">
        <label>Diagnósticos Diferenciais</label>
        <div className="medix-diagnosis-inline">
          <input
            type="text"
            value={novoDiferencial}
            onChange={(e) => setNovoDiferencial(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdicionarDiferencial(); } }}
            placeholder="Adicionar diferencial..."
            disabled={desabilitado}
          />
          <button type="button" onClick={handleAdicionarDiferencial} disabled={desabilitado || !novoDiferencial.trim()} className="medix-diagnosis-add">
            +
          </button>
        </div>
        <div className="medix-diagnosis-list">
          {diagnostico.diagnosticosDiferenciais.map((diff, idx) => (
            <span key={idx} className="medix-diagnosis-chip">
              {diff}
              <button type="button" onClick={() => handleRemoverDiferencial(idx)} disabled={desabilitado} className="medix-diagnosis-chip-x">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="medix-diagnosis-section">
        <label>Exames Indicados</label>
        <div className="medix-diagnosis-inline">
          <input
            type="text"
            value={novoExame}
            onChange={(e) => setNovoExame(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdicionarExame(); } }}
            placeholder="ECG, Troponina, Raio X..."
            disabled={desabilitado}
          />
          <button type="button" onClick={handleAdicionarExame} disabled={desabilitado || !novoExame.trim()} className="medix-diagnosis-add">
            +
          </button>
        </div>
        <div className="medix-diagnosis-list">
          {diagnostico.examesIndicados.map((exame, idx) => (
            <span key={idx} className="medix-diagnosis-chip medix-diagnosis-chip-green">
              {exame}
              <button type="button" onClick={() => handleRemoverExame(idx)} disabled={desabilitado} className="medix-diagnosis-chip-x">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="medix-diagnosis-section">
        <label>Conduta</label>
        <textarea
          value={diagnostico.conduta}
          onChange={(e) => setDiagnostico((prev) => ({ ...prev, conduta: e.target.value }))}
          placeholder="Plano de tratamento, encaminhamentos, acompanhamento..."
          disabled={desabilitado}
          rows={3}
        />
      </div>

      {soapSlot && (
        <div className="medix-soap-optional">
          <button
            type="button"
            onClick={() => setSoapAberto((v) => !v)}
            aria-expanded={soapAberto}
            className="medix-soap-toggle"
          >
            Deseja realizar SOAP?
          </button>
          {soapAberto && <div className="medix-soap-embed">{soapSlot}</div>}
        </div>
      )}

      <button type="submit" disabled={desabilitado} className="medix-diagnosis-submit">
        Finalizar Atendimento e Ver Feedback
      </button>
    </form>
  );
}
