"use client";

import { useState, useEffect } from "react";
import type { FormularioSOAP } from "@/lib/types";

interface FormularioSOAPProps {
  onSubmit?: (soap: FormularioSOAP) => void;
  onChange?: (soap: FormularioSOAP) => void;
  desabilitado?: boolean;
  caso?: any;
  /** Tag do wrapper. Use "div" para embutir dentro de outro <form> (ex.: SOAP
   *  opcional dentro de "Diagnóstico e Conduta") sem aninhar formulários. */
  as?: "form" | "div";
}

export default function FormularioSOAP({
  onSubmit,
  onChange,
  desabilitado = false,
  caso,
  as = "form",
}: FormularioSOAPProps) {
  const [soap, setSOAP] = useState<FormularioSOAP>({
    subjetivo: "",
    objetivo: "",
    avaliacao: "",
    plano: "",
  });

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

  const Wrapper = as as any;
  const wrapperProps = as === "form" ? { onSubmit: handleSubmit } : {};

  return (
    <Wrapper {...wrapperProps} className="medix-soap-card">
      <header className="medix-soap-header">
        <div className="medix-soap-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 4h6a1 1 0 011 1v1h1a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2h1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 4.5h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2>Avaliação Clínica</h2>
          <p>SOAP</p>
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

    </Wrapper>
  );
}
