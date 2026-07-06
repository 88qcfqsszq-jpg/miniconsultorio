"use client";

import { useState, useEffect } from "react";
import type { FormularioSOAP } from "@/lib/types";

interface FormularioSOAPProps {
  onSubmit?: (soap: FormularioSOAP) => void;
  onChange?: (soap: FormularioSOAP) => void;
  desabilitado?: boolean;
  caso?: any;
}

export default function FormularioSOAP({
  onSubmit,
  onChange,
  desabilitado = false,
  caso,
}: FormularioSOAPProps) {
  const [soap, setSOAP] = useState<FormularioSOAP>({
    subjetivo: "",
    objetivo: "",
    avaliacao: "",
    plano: "",
  });

  const [referenciaAberta, setReferenciaAberta] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange(soap);
    }
  }, [soap, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !soap.subjetivo.trim() ||
      !soap.objetivo.trim() ||
      !soap.avaliacao.trim() ||
      !soap.plano.trim()
    ) {
      alert("Por favor, preencha todos os campos do SOAP");
      return;
    }
    if (onSubmit) {
      onSubmit(soap);
    }
  };

  const soapFields = [
    { key: "subjetivo" as const, letter: "S", label: "Subjetivo", hint: "O que o paciente relata", placeholder: "Sintomas, queixas, história relatada pelo paciente..." },
    { key: "objetivo" as const, letter: "O", label: "Objetivo", hint: "O que você observou/mediu", placeholder: "Sinais vitais, achados do exame físico, dados objetivos..." },
    { key: "avaliacao" as const, letter: "A", label: "Avaliação", hint: "Sua interpretação clínica", placeholder: "Hipótese, raciocínio diagnóstico..." },
    { key: "plano" as const, letter: "P", label: "Plano", hint: "Como você vai proceder", placeholder: "Exames, tratamento, encaminhamentos, seguimento..." },
  ];

  return (
    <form onSubmit={handleSubmit} className="medix-soap-card">
      <header className="medix-soap-header">
        <div className="medix-soap-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 4h6a1 1 0 011 1v1h1a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2h1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 4.5h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2>Avaliação Clínica</h2>
          <p>SOAP — Registro Clínico</p>
        </div>
      </header>

      <div className="medix-soap-fields">
        {soapFields.map((field) => (
          <label key={field.key} className="medix-soap-field">
            <div className="medix-soap-label">
              <span className="medix-soap-badge">{field.letter}</span>
              <strong>{field.label}</strong>
              <small>— {field.hint}</small>
            </div>
            <textarea
              value={soap[field.key]}
              onChange={(e) => setSOAP((prev) => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              disabled={desabilitado}
              rows={3}
            />
          </label>
        ))}
      </div>

      {caso?.modeloSOAP && (
        <div className="medix-soap-reference" style={{ marginTop: "1.5rem", borderTop: "1px solid #e0e0e0", paddingTop: "1rem" }}>
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
            Referência esperada do SOAP
          </button>

          {referenciaAberta && (
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "6px", fontSize: "0.9rem", lineHeight: "1.6", color: "#333" }}>
              {caso.modeloSOAP.subjetivo && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>
                    <span style={{ display: "inline-block", width: "24px", height: "24px", backgroundColor: "#4CAF50", color: "white", borderRadius: "50%", textAlign: "center", lineHeight: "24px", marginRight: "0.5rem" }}>S</span>
                    Subjetivo
                  </p>
                  <p>{typeof caso.modeloSOAP.subjetivo === "object" ? JSON.stringify(caso.modeloSOAP.subjetivo, null, 2) : caso.modeloSOAP.subjetivo}</p>
                </div>
              )}
              {caso.modeloSOAP.objetivo && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>
                    <span style={{ display: "inline-block", width: "24px", height: "24px", backgroundColor: "#2196F3", color: "white", borderRadius: "50%", textAlign: "center", lineHeight: "24px", marginRight: "0.5rem" }}>O</span>
                    Objetivo
                  </p>
                  <p>{typeof caso.modeloSOAP.objetivo === "object" ? JSON.stringify(caso.modeloSOAP.objetivo, null, 2) : caso.modeloSOAP.objetivo}</p>
                </div>
              )}
              {caso.modeloSOAP.avaliacao && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>
                    <span style={{ display: "inline-block", width: "24px", height: "24px", backgroundColor: "#FF9800", color: "white", borderRadius: "50%", textAlign: "center", lineHeight: "24px", marginRight: "0.5rem" }}>A</span>
                    Avaliação
                  </p>
                  <p>{typeof caso.modeloSOAP.avaliacao === "object" ? JSON.stringify(caso.modeloSOAP.avaliacao, null, 2) : caso.modeloSOAP.avaliacao}</p>
                </div>
              )}
              {caso.modeloSOAP.plano && (
                <div>
                  <p style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>
                    <span style={{ display: "inline-block", width: "24px", height: "24px", backgroundColor: "#E91E63", color: "white", borderRadius: "50%", textAlign: "center", lineHeight: "24px", marginRight: "0.5rem" }}>P</span>
                    Plano
                  </p>
                  <p>{typeof caso.modeloSOAP.plano === "object" ? JSON.stringify(caso.modeloSOAP.plano, null, 2) : caso.modeloSOAP.plano}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
