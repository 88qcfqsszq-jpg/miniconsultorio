"use client";

import { useState, useEffect } from "react";
import type { DiagnosticoFormulario } from "@/lib/types";

interface PainelDiagnosticoProps {
  onSubmit: (diagnostico: DiagnosticoFormulario) => void;
  onChange?: (diagnostico: DiagnosticoFormulario) => void;
  desabilitado?: boolean;
  caso?: any;
}

export default function PainelDiagnostico({
  onSubmit,
  onChange,
  desabilitado = false,
  caso,
}: PainelDiagnosticoProps) {
  const [diagnostico, setDiagnostico] = useState<DiagnosticoFormulario>({
    hipotesePrincipal: "",
    diagnosticosDisferenciais: [],
    examesIndicados: [],
    conduta: "",
  });

  const [novoDiferencial, setNovoDiferencial] = useState("");
  const [novoExame, setNovoExame] = useState("");
  const [referenciaAberta, setReferenciaAberta] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange(diagnostico);
    }
  }, [diagnostico, onChange]);

  const handleAdicionarDiferencial = () => {
    if (novoDiferencial.trim()) {
      setDiagnostico((prev) => ({
        ...prev,
        diagnosticosDisferenciais: [
          ...prev.diagnosticosDisferenciais,
          novoDiferencial,
        ],
      }));
      setNovoDiferencial("");
    }
  };

  const handleRemoverDiferencial = (index: number) => {
    setDiagnostico((prev) => ({
      ...prev,
      diagnosticosDisferenciais: prev.diagnosticosDisferenciais.filter(
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
        <label>Hipótese Principal *</label>
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
          {diagnostico.diagnosticosDisferenciais.map((diff, idx) => (
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
        <label>Conduta *</label>
        <textarea
          value={diagnostico.conduta}
          onChange={(e) => setDiagnostico((prev) => ({ ...prev, conduta: e.target.value }))}
          placeholder="Plano de tratamento, encaminhamentos, acompanhamento..."
          disabled={desabilitado}
          rows={3}
        />
      </div>

      {caso?.diagnostico || caso?.condutaEsperada || caso?.criteriosGravidade || caso?.errosCriticos ? (
        <div className="medix-diagnosis-reference" style={{ marginTop: "1.5rem", borderTop: "1px solid #e0e0e0", paddingTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setReferenciaAberta(!referenciaAberta)}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#666",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            <span style={{ transition: "transform 0.2s", transform: referenciaAberta ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
            Referência esperada
          </button>

          {referenciaAberta && (
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "6px", fontSize: "0.95rem", lineHeight: "1.6", color: "#333" }}>
              {caso?.diagnostico && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>Diagnóstico esperado:</p>
                  <p>{typeof caso.diagnostico === "object" ? JSON.stringify(caso.diagnostico, null, 2) : caso.diagnostico}</p>
                </div>
              )}
              {caso?.condutaEsperada && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>Conduta esperada:</p>
                  <p>{typeof caso.condutaEsperada === "object" ? JSON.stringify(caso.condutaEsperada, null, 2) : caso.condutaEsperada}</p>
                </div>
              )}
              {caso?.criteriosGravidade && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>Critérios de gravidade:</p>
                  <p>{typeof caso.criteriosGravidade === "object" ? JSON.stringify(caso.criteriosGravidade, null, 2) : caso.criteriosGravidade}</p>
                </div>
              )}
              {caso?.errosCriticos && Array.isArray(caso.errosCriticos) && caso.errosCriticos.length > 0 && (
                <div>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>Erros críticos a evitar:</p>
                  <ul style={{ marginLeft: "1.5rem" }}>
                    {caso.errosCriticos.map((erro: string, idx: number) => (
                      <li key={idx}>{erro}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      <button type="submit" disabled={desabilitado} className="medix-diagnosis-submit">
        Finalizar Atendimento e Ver Feedback
      </button>
    </form>
  );
}
