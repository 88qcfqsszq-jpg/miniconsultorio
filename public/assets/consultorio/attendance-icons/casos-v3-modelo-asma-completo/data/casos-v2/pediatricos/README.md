# Casos pediátricos v3 — modelo perfeito

Este pacote converte os 16 casos pediátricos para o modelo pediátrico validado.

## Inclui em cada caso

- `tipoPaciente: "pediatrico"`;
- `dadosPediatricos` preservado dentro do paciente;
- `sinaisVitaisPediatricos` com entrada, referência por idade, evolução e critérios de alta/seguimento;
- `exameFisicoPediatrico`;
- `exames` com lógica pediátrica;
- `prescricaoPediatrica` com dose por peso quando aplicável;
- blocos específicos quando aplicável:
  - `antropometria`;
  - `desenvolvimentoNeuropsicomotor`;
  - `protecaoInfantil`;
  - `arbovirosePediatrica`;
  - `cardiologiaPediatrica`;
- `feedbackDetalhado` com rubrica pediátrica de 20 pontos;
- `modeloSOAP`, `feedbackModelo` e `checklistOcultoExaminador`.

## Observação

O banco preserva o conteúdo original e adiciona a camada pediátrica estruturada para uso no OSCE.
