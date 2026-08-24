import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Target, Wallet } from "lucide-react";

const TABLE = [
  { perf: 80, comm: 5200 },
  { perf: 85, comm: 5800 },
  { perf: 90, comm: 6600 },
  { perf: 95, comm: 7300 },
  { perf: 100, comm: 8000 },
  { perf: 105, comm: 8700 },
  { perf: 110, comm: 9400 },
  { perf: 115, comm: 10000 },
  { perf: 120, comm: 10600 },
  { perf: 125, comm: 11300 },
  { perf: 130, comm: 11920 },
  { perf: 135, comm: 12500 },
  { perf: 140, comm: 13800 },
  { perf: 145, comm: 15000 },
  { perf: 150, comm: 16300 },
  { perf: 160, comm: 17500 },
  { perf: 170, comm: 18800 },
  { perf: 180, comm: 20000 },
  { perf: 190, comm: 21300 },
  { perf: 200, comm: 22500 },
];

const MAX_COMM = 22500;

function calcComissao(perf) {
  if (perf < 80) return 0;
  if (perf >= 200) return MAX_COMM;

  for (let i = 0; i < TABLE.length - 1; i++) {
    const a = TABLE[i];
    const b = TABLE[i + 1];
    if (perf >= a.perf && perf <= b.perf) {
      const ratio = (perf - a.perf) / (b.perf - a.perf);
      return a.comm + ratio * (b.comm - a.comm);
    }
  }
  return 0;
}

function currentBracket(perf) {
  if (perf < 80) return null;
  if (perf >= 200) return TABLE[TABLE.length - 1];
  let closest = TABLE[0];
  for (const row of TABLE) {
    if (row.perf <= perf) closest = row;
  }
  return closest;
}

const fmtBRL = (v) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export default function ComissaoCalculator() {
  const [meta, setMeta] = useState("");
  const [realizado, setRealizado] = useState("");

  const metaNum = parseFloat(meta.replace(",", "."));
  const realizadoNum = parseFloat(realizado.replace(",", "."));

  const valid =
    !isNaN(metaNum) && metaNum > 0 && !isNaN(realizadoNum) && realizadoNum >= 0;

  const performance = valid ? (realizadoNum / metaNum) * 100 : 0;
  const comissao = valid ? calcComissao(performance) : 0;
  const bracket = valid ? currentBracket(performance) : null;

  const nextBracket = useMemo(() => {
    if (!valid) return null;
    if (performance >= 200) return null;
    return TABLE.find((r) => r.perf > performance) || null;
  }, [performance, valid]);

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: 560,
        margin: "0 auto",
        color: "#12242b",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        .sc-card { background:#ffffff; border:1px solid #e2e8ea; border-radius:16px; }
        .sc-input {
          width:100%; box-sizing:border-box; font-size:22px; font-weight:700;
          padding:12px 14px; border-radius:10px; border:1.5px solid #d7e0e2;
          font-family:'Space Grotesk',sans-serif; color:#0f2e33; outline:none;
          transition: border-color .15s ease, box-shadow .15s ease;
          background:#fbfdfd;
        }
        .sc-input:focus { border-color:#0f7a72; box-shadow:0 0 0 3px rgba(15,122,114,0.12); }
        .sc-label {
          font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
          color:#5b7278; margin-bottom:6px; display:flex; align-items:center; gap:6px;
        }
        .sc-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media (max-width:420px){ .sc-row{ grid-template-columns:1fr; } }
        .sc-badge {
          display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:700;
          padding:5px 10px; border-radius:999px;
        }
        .sc-table-row { display:flex; justify-content:space-between; padding:6px 10px; font-size:13px; border-radius:8px; }
        .sc-table-row.active { background:#0f7a72; color:#fff; font-weight:700; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#0f7a72",
            color: "#fff",
            padding: "5px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".03em",
            marginBottom: 10,
          }}
        >
          <Calculator size={14} />
          CALCULADORA DE COMISSÃO
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            margin: "4px 0 4px",
            color: "#0f2e33",
          }}
        >
          Quanto vai cair na sua comissão?
        </h1>
        <p style={{ fontSize: 14, color: "#5b7278", margin: 0 }}>
          Informe a meta do mês e o quanto você realizou. O cálculo interpola
          a tabela oficial de performance × comissão.
        </p>
      </div>

      {/* Inputs */}
      <div className="sc-card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="sc-row">
          <div>
            <div className="sc-label">
              <Target size={13} /> Meta do mês (R$)
            </div>
            <input
              className="sc-input"
              inputMode="decimal"
              placeholder="Ex: 100.000"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />
          </div>
          <div>
            <div className="sc-label">
              <TrendingUp size={13} /> Realizado (R$)
            </div>
            <input
              className="sc-input"
              inputMode="decimal"
              placeholder="Ex: 118.500"
              value={realizado}
              onChange={(e) => setRealizado(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Result */}
      <div
        className="sc-card"
        style={{
          padding: 22,
          marginBottom: 16,
          background: valid
            ? "linear-gradient(135deg, #0f7a72 0%, #0b5a54 100%)"
            : "#f4f7f7",
          border: "none",
          color: valid ? "#fff" : "#5b7278",
        }}
      >
        {!valid ? (
          <div style={{ textAlign: "center", padding: "10px 0", fontSize: 14 }}>
            Preencha a meta e o realizado para calcular sua comissão.
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    opacity: 0.85,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Performance atingida
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  {performance.toFixed(1)}%
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    opacity: 0.85,
                    textTransform: "uppercase",
                    marginBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  <Wallet size={13} /> Comissão estimada
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 34,
                    fontWeight: 800,
                  }}
                >
                  {fmtBRL(comissao)}
                </div>
              </div>
            </div>

            {performance < 80 && (
              <div
                style={{
                  marginTop: 14,
                  fontSize: 13,
                  background: "rgba(255,255,255,0.15)",
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                Performance abaixo de 80% — fora da tabela de comissionamento
                (comissão R$ 0).
              </div>
            )}

            {performance >= 80 && nextBracket && (
              <div
                style={{
                  marginTop: 14,
                  fontSize: 13,
                  background: "rgba(255,255,255,0.15)",
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                Faltam{" "}
                <strong>
                  {fmtBRL(
                    ((nextBracket.perf - performance) / 100) * metaNum
                  )}
                </strong>{" "}
                em vendas para chegar em {nextBracket.perf}% e subir a faixa
                de comissão.
              </div>
            )}

            {performance >= 200 && (
              <div
                style={{
                  marginTop: 14,
                  fontSize: 13,
                  background: "rgba(255,255,255,0.15)",
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                Performance de 200% ou mais — comissão máxima da tabela (R$
                22.500).
              </div>
            )}
          </>
        )}
      </div>

      {/* Table */}
      <div className="sc-card" style={{ padding: "16px 8px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "#5b7278",
            padding: "0 12px 8px",
          }}
        >
          Tabela de referência
        </div>
        <div style={{ maxHeight: 260, overflowY: "auto", padding: "0 8px" }}>
          {TABLE.map((row, i) => {
            const isActive =
              valid && bracket && row.perf === bracket.perf && performance < 200;
            const isMax = valid && performance >= 200 && i === TABLE.length - 1;
            return (
              <div
                key={row.perf}
                className={`sc-table-row ${isActive || isMax ? "active" : ""}`}
              >
                <span>{row.perf}%</span>
                <span>{fmtBRL(row.comm)}</span>
              </div>
            );
          })}
          <div className="sc-table-row" style={{ color: "#5b7278" }}>
            <span>Acima de 200%</span>
            <span>{fmtBRL(MAX_COMM)}</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#8ca0a4", marginTop: 14, textAlign: "center" }}>
        Valores entre faixas são interpolados linearmente com base na tabela
        oficial de comissionamento.
      </p>
    </div>
  );
}
