'use client';

import { useState } from 'react';
import type { Caso } from '@/lib/types';

interface DadosPediatricosProps {
  caso: Caso;
}

function LinhaDado({ label, valor }: { label: string; valor?: string | null }) {
  if (!valor) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', fontSize: '0.9rem' }}>
      <span style={{ fontWeight: '500', color: '#666' }}>{label}:</span>
      <span style={{ color: '#333' }}>{valor}</span>
    </div>
  );
}

export default function DadosPediatricos({ caso }: DadosPediatricosProps) {
  // Renderizar apenas se for caso pediátrico
  if (!caso.tipoPaciente || caso.tipoPaciente !== 'pediatrico') {
    return null;
  }

  const [dadosAberto, setDadosAberto] = useState(false);
  const [antropometriaAberta, setAntropometriaAberta] = useState(false);
  const [desenvolvimentoAberto, setDesenvolvimentoAberto] = useState(false);
  const [protecaoAberta, setProtecaoAberta] = useState(false);
  const [arboviroseAberta, setArboviroseAberta] = useState(false);
  const [cardiologiaAberta, setCardiologiaAberta] = useState(false);

  const dadosPediatricos = caso.paciente?.dadosPediatricos;
  if (!dadosPediatricos) {
    return null;
  }

  const antropometria = (caso as any)?.antropometria;
  const desenvolvimento = (caso as any)?.desenvolvimentoNeuropsicomotor;
  const protecaoInfantil = (caso as any)?.protecaoInfantil;
  const arbovirose = (caso as any)?.arbovirosePediatrica;
  const cardiologia = (caso as any)?.cardiologiaPediatrica;

  // Verificar se há dados pediátricos ou campos especializados
  const temDados =
    dadosPediatricos &&
    (dadosPediatricos.responsavel ||
      dadosPediatricos.peso ||
      dadosPediatricos.faixaEtaria ||
      dadosPediatricos.estadoVacinal ||
      antropometria ||
      desenvolvimento ||
      (protecaoInfantil?.aplicavel === true) ||
      (arbovirose?.aplicavel === true) ||
      (cardiologia?.aplicavel === true));

  if (!temDados) {
    return null;
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Card Principal de Dados Pediátricos */}
      <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setDadosAberto(!dadosAberto)}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            fontWeight: '600',
            color: '#333',
            fontSize: '1rem',
          }}
        >
          <span style={{ transition: 'transform 0.2s', transform: dadosAberto ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
          👶 Dados Pediátricos
        </button>

        {dadosAberto && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
            <LinhaDado label="Responsável" valor={dadosPediatricos.responsavel?.nome} />
            <LinhaDado label="Parentesco" valor={dadosPediatricos.responsavel?.parentesco} />
            <LinhaDado label="Peso" valor={(dadosPediatricos as any).peso} />
            <LinhaDado label="Faixa etária" valor={(dadosPediatricos as any).faixaEtaria} />
            <LinhaDado label="Estado vacinal" valor={(dadosPediatricos as any).estadoVacinal} />
            <LinhaDado label="Alimentação" valor={(dadosPediatricos as any).alimentacao || (dadosPediatricos as any).alimentacaoHabitual} />
            <LinhaDado label="Ingestão hídrica" valor={(dadosPediatricos as any).ingestaoHidrica} />
            <LinhaDado label="Diurese" valor={(dadosPediatricos as any).diurese} />
            <LinhaDado label="Desenvolvimento" valor={(dadosPediatricos as any).desenvolvimento} />
          </div>
        )}
      </div>

      {/* Seção Antropometria */}
      {antropometria && (
        <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e8e8e8', padding: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setAntropometriaAberta(!antropometriaAberta)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              fontWeight: '600',
              color: '#333',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ transition: 'transform 0.2s', transform: antropometriaAberta ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
            📏 Antropometria
          </button>

          {antropometriaAberta && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e8e8e8', fontSize: '0.9rem' }}>
              <LinhaDado label="Peso" valor={antropometria.peso || antropometria.pesoKg} />
              <LinhaDado label="Comprimento/Estatura" valor={antropometria.comprimentoOuEstatura} />
              <LinhaDado label="Perímetro cefálico" valor={antropometria.perimetroCefalico} />
              {antropometria.percentis && (
                <div style={{ color: '#666', marginTop: '0.5rem' }}>
                  <strong>Percentis:</strong>
                  {typeof antropometria.percentis === 'object' ? (
                    <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                      {Object.entries(antropometria.percentis).map(([key, val]: any) => (
                        <li key={key}>
                          {key}: {String(val)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>{String(antropometria.percentis)}</p>
                  )}
                </div>
              )}
              {antropometria.interpretacao && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
                  {antropometria.interpretacao}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Seção Desenvolvimento */}
      {desenvolvimento && (
        <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e8e8e8', padding: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setDesenvolvimentoAberto(!desenvolvimentoAberto)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              fontWeight: '600',
              color: '#333',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ transition: 'transform 0.2s', transform: desenvolvimentoAberto ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
            🧠 Desenvolvimento Neuropsicomotor
          </button>

          {desenvolvimentoAberto && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e8e8e8', fontSize: '0.9rem' }}>
              {desenvolvimento.motorGrosso && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Motor Grosso:</strong>
                  <p style={{ marginTop: '0.25rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                    {typeof desenvolvimento.motorGrosso === 'object'
                      ? desenvolvimento.motorGrosso.presenteNoCaso?.join('; ') || desenvolvimento.motorGrosso.interpretacao
                      : desenvolvimento.motorGrosso}
                  </p>
                </div>
              )}
              {desenvolvimento.motorFinoAdaptativo && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Motor Fino/Adaptativo:</strong>
                  <p style={{ marginTop: '0.25rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                    {typeof desenvolvimento.motorFinoAdaptativo === 'object'
                      ? desenvolvimento.motorFinoAdaptativo.presenteNoCaso?.join('; ') || desenvolvimento.motorFinoAdaptativo.interpretacao
                      : desenvolvimento.motorFinoAdaptativo}
                  </p>
                </div>
              )}
              {desenvolvimento.linguagem && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Linguagem:</strong>
                  <p style={{ marginTop: '0.25rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                    {typeof desenvolvimento.linguagem === 'object'
                      ? desenvolvimento.linguagem.presenteNoCaso?.join('; ') || desenvolvimento.linguagem.interpretacao
                      : desenvolvimento.linguagem}
                  </p>
                </div>
              )}
              {desenvolvimento.social && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Social:</strong>
                  <p style={{ marginTop: '0.25rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                    {typeof desenvolvimento.social === 'object'
                      ? desenvolvimento.social.presenteNoCaso?.join('; ') || desenvolvimento.social.interpretacao
                      : desenvolvimento.social}
                  </p>
                </div>
              )}
              {desenvolvimento.conclusao && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                  {desenvolvimento.conclusao}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Seção Proteção Infantil */}
      {protecaoInfantil?.aplicavel === true && (
        <div style={{ backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107', padding: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setProtecaoAberta(!protecaoAberta)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              fontWeight: '600',
              color: '#856404',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ transition: 'transform 0.2s', transform: protecaoAberta ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
            🛡️ Proteção Infantil
          </button>

          {protecaoAberta && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #ffc107', fontSize: '0.9rem', color: '#333' }}>
              {protecaoInfantil.nivelSuspeita && (
                <LinhaDado label="Nível de suspeita" valor={protecaoInfantil.nivelSuspeita} />
              )}
              {protecaoInfantil.historiaIncompativel && (
                <LinhaDado label="História incompatível" valor="Sim" />
              )}
              {protecaoInfantil.condutaSegura && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#333' }}>Condutas seguras:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {(Array.isArray(protecaoInfantil.condutaSegura) ? protecaoInfantil.condutaSegura : [protecaoInfantil.condutaSegura]).slice(0, 3).map((conduta: any, idx: number) => (
                      <li key={idx}>{conduta}</li>
                    ))}
                  </ul>
                </div>
              )}
              {protecaoInfantil.notificacao && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#333' }}>Notificação:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {protecaoInfantil.notificacao.map((item: any, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {protecaoInfantil.errosCriticos && (
                <div>
                  <strong style={{ color: '#c71c1c' }}>Erros críticos:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem', color: '#c71c1c' }}>
                    {protecaoInfantil.errosCriticos.map((erro: any, idx: number) => (
                      <li key={idx}>{erro}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Seção Arbovirose Pediátrica */}
      {arbovirose?.aplicavel === true && (
        <div style={{ backgroundColor: '#f0f7ff', borderRadius: '8px', border: '1px solid #87ceeb', padding: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setArboviroseAberta(!arboviroseAberta)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              fontWeight: '600',
              color: '#0066cc',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ transition: 'transform 0.2s', transform: arboviroseAberta ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
            🦟 Arbovirose Pediátrica
          </button>

          {arboviroseAberta && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #87ceeb', fontSize: '0.9rem', color: '#333' }}>
              {arbovirose.suspeita && <LinhaDado label="Suspeita" valor={arbovirose.suspeita} />}
              {arbovirose.sinaisAlarme && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Sinais de alarme:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {(Array.isArray(arbovirose.sinaisAlarme) ? arbovirose.sinaisAlarme : [arbovirose.sinaisAlarme]).map((sinal: any, idx: number) => (
                      <li key={idx}>{sinal}</li>
                    ))}
                  </ul>
                </div>
              )}
              {arbovirose.hidratacao && <LinhaDado label="Hidratação" valor={arbovirose.hidratacao} />}
              {arbovirose.medicamentosEvitar && (
                <div>
                  <strong>Medicamentos a evitar:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {(Array.isArray(arbovirose.medicamentosEvitar) ? arbovirose.medicamentosEvitar : [arbovirose.medicamentosEvitar]).map((med: any, idx: number) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Seção Cardiologia Pediátrica */}
      {cardiologia?.aplicavel === true && (
        <div style={{ backgroundColor: '#ffe6e6', borderRadius: '8px', border: '1px solid #ff6b6b', padding: '1rem' }}>
          <button
            onClick={() => setCardiologiaAberta(!cardiologiaAberta)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              fontWeight: '600',
              color: '#cc0000',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ transition: 'transform 0.2s', transform: cardiologiaAberta ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
            ❤️ Cardiologia Pediátrica
          </button>

          {cardiologiaAberta && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #ff6b6b', fontSize: '0.9rem', color: '#333' }}>
              {cardiologia.sinaisIC && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Sinais de insuficiência cardíaca:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {(Array.isArray(cardiologia.sinaisIC) ? cardiologia.sinaisIC : [cardiologia.sinaisIC]).map((sinal: any, idx: number) => (
                      <li key={idx}>{sinal}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cardiologia.sinaisCianose && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Sinais de cardiopatia cianótica:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {(Array.isArray(cardiologia.sinaisCianose) ? cardiologia.sinaisCianose : [cardiologia.sinaisCianose]).map((sinal: any, idx: number) => (
                      <li key={idx}>{sinal}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cardiologia.examesChave && (
                <div>
                  <strong>Exames-chave:</strong>
                  <ul style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {(Array.isArray(cardiologia.examesChave) ? cardiologia.examesChave : [cardiologia.examesChave]).map((exame: any, idx: number) => (
                      <li key={idx}>{exame}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
