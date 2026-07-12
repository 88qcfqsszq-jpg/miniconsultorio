"use client";

import { useState } from "react";
import type { LearnQuestion } from "@/lib/medix-learn/types";

interface Props {
  question: LearnQuestion;
  index: number;
}

export default function LearnActiveQuestionCard({ question, index }: Props) {
  const [aberta, setAberta] = useState(false);

  return (
    <div
      style={{
        borderRadius: 12,
        background: "#fff",
        border: `1px solid ${aberta ? "rgba(59,130,246,0.3)" : "rgba(120,130,180,0.16)"}`,
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
    >
      <button
        type="button"
        onClick={() => setAberta((v) => !v)}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          textAlign: "left",
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: aberta ? "rgba(59,130,246,0.12)" : "rgba(120,130,180,0.1)",
            color: aberta ? "#1d4ed8" : "#64748b",
            fontSize: 10,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {index + 1}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 600,
            color: "#0b1f4d",
            lineHeight: 1.5,
          }}
        >
          {question.pergunta}
        </span>
        <span
          style={{
            fontSize: 14,
            color: "#3b82f6",
            flexShrink: 0,
            transform: aberta ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▾
        </span>
      </button>

      {aberta && (
        <div
          style={{
            padding: "0 16px 14px 50px",
            fontSize: 13,
            color: "#374151",
            lineHeight: 1.65,
            borderTop: "1px solid rgba(59,130,246,0.1)",
            paddingTop: 12,
          }}
        >
          {question.resposta}
        </div>
      )}
    </div>
  );
}
