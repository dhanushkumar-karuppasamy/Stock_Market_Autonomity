import React, { useMemo, useState } from 'react';

const C = {
  green: '#4ade80',
  red: '#f87171',
  cyan: '#38bdf8',
  amber: '#fbbf24',
  purple: '#c084fc',
  muted: '#64748b',
  text: '#cbd5e1',
  heading: '#f1f5f9',
  border: 'rgba(255,255,255,0.07)',
  card: 'rgba(15,20,30,0.6)',
};

function fmt(v, d = 2) {
  if (v == null || Number.isNaN(Number(v))) return '—';
  return Number(v).toFixed(d);
}

function StatCell({ label, value, color }) {
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 6,
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || C.text, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: 9, color: C.muted, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
    </div>
  );
}

export default function StatsPanel({ agents, tradeLog, regulationLog, marketSummary }) {
  const [activeInnerTab, setActiveInnerTab] = useState('overview');

  const summary = useMemo(() => {
    if (!agents?.length) return null;

    const totalTrades = tradeLog?.filter(t => t.action === 'BUY' || t.action === 'SELL').length ?? 0;
    const buys = tradeLog?.filter(t => t.action === 'BUY').length ?? 0;
    const sells = tradeLog?.filter(t => t.action === 'SELL').length ?? 0;
    const blocked = tradeLog?.filter(t => t.regulator_decision === 'BLOCK').length ?? 0;
    const violations = regulationLog?.length ?? 0;

    const totalAUM = agents.reduce((s, a) => s + (a.portfolio_value || 0), 0);
    const totalCash = agents.reduce((s, a) => s + (a.cash || 0), 0);

    const bestAgent = agents.reduce((best, a) =>
      (a.return_pct ?? -Infinity) > (best.return_pct ?? -Infinity) ? a : best, agents[0]);
    const worstAgent = agents.reduce((worst, a) =>
      (a.return_pct ?? Infinity) < (worst.return_pct ?? Infinity) ? a : worst, agents[0]);

    const avgReturn = agents.reduce((s, a) => s + (a.return_pct || 0), 0) / agents.length;
    const avgSharpe = agents.reduce((s, a) => s + (a.sharpe_ratio || 0), 0) / agents.length;
    const maxDD = Math.min(...agents.map(a => a.max_drawdown_pct ?? 0));

    return {
      totalTrades, buys, sells, blocked, violations,
      totalAUM, totalCash,
      bestAgent, worstAgent,
      avgReturn, avgSharpe, maxDD,
      agentCount: agents.length,
    };
  }, [agents, tradeLog, regulationLog]);

  if (!summary) {
    return (
      <div className="card">
        <h2>◈ Statistics</h2>
        <p style={{ color: C.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          Initialize a simulation to see statistics.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'risk', label: 'Risk Metrics' },
  ];

  return (
    <>
      {/* ── Humanized Narrative Summary ── */}
      {marketSummary && (
        <div className="card" style={{ padding: '18px 20px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <h2 style={{ margin: 0, fontSize: 14 }}>Simulation Summary</h2>
          </div>
          <div style={{
            padding: '14px 16px', borderRadius: 8,
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.15)',
            fontSize: 13, color: C.heading, lineHeight: 1.8,
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: 0.1,
          }}>
            {marketSummary}
          </div>
        </div>
      )}

      {/* ── Inner Tabs ── */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', borderBottom: `1px solid ${C.border}`,
          background: 'rgba(0,0,0,0.15)',
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveInnerTab(t.id)}
              style={{
                flex: 1, padding: '10px 0', background: 'none', cursor: 'pointer',
                border: 'none', borderBottom: `2px solid ${activeInnerTab === t.id ? C.cyan : 'transparent'}`,
                color: activeInnerTab === t.id ? C.cyan : C.muted,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                fontWeight: activeInnerTab === t.id ? 700 : 400,
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {/* ---- OVERVIEW TAB ---- */}
          {activeInnerTab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                <StatCell label="Total AUM" value={`₹${Math.round(summary.totalAUM).toLocaleString()}`} color={C.cyan} />
                <StatCell label="Cash Reserves" value={`₹${Math.round(summary.totalCash).toLocaleString()}`} color={C.text} />
                <StatCell label="Active Agents" value={summary.agentCount} color={C.purple} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                <StatCell label="Total Trades" value={summary.totalTrades} color={C.text} />
                <StatCell label="Buys" value={summary.buys} color={C.green} />
                <StatCell label="Sells" value={summary.sells} color={C.red} />
                <StatCell label="Blocked" value={summary.blocked} color={C.amber} />
              </div>

              {summary.totalTrades > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.muted, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span>Buys {((summary.buys / summary.totalTrades) * 100).toFixed(0)}%</span>
                    <span>Sells {((summary.sells / summary.totalTrades) * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ display: 'flex', height: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${(summary.buys / summary.totalTrades) * 100}%`, background: C.green, transition: 'width 0.3s' }} />
                    <div style={{ flex: 1, background: C.red }} />
                  </div>
                </div>
              )}

              {/* Leaderboard */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>Agent Leaderboard</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[...(agents || [])]
                    .sort((a, b) => (b.return_pct ?? 0) - (a.return_pct ?? 0))
                    .map((agent, idx) => {
                      const ret = agent.return_pct ?? 0;
                      const isPositive = ret >= 0;
                      const medals = ['🥇', '🥈', '🥉'];
                      return (
                        <div key={agent.name} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '7px 10px', borderRadius: 5,
                          background: idx === 0 ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${idx === 0 ? 'rgba(74,222,128,0.12)' : C.border}`,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          <span style={{ fontSize: 13, width: 20, textAlign: 'center' }}>
                            {medals[idx] || <span style={{ color: C.muted, fontSize: 10 }}>{idx + 1}</span>}
                          </span>
                          <span style={{ flex: 1, fontSize: 11, color: C.text, fontWeight: 600 }}>{agent.name}</span>
                          {(agent.followers ?? 1) > 1 && (
                            <span style={{ fontSize: 9, color: C.cyan, padding: '1px 5px', borderRadius: 3, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                              ×{agent.followers}
                            </span>
                          )}
                          <span style={{ fontSize: 11, color: isPositive ? C.green : C.red, fontWeight: 700, minWidth: 56, textAlign: 'right' }}>
                            {isPositive ? '+' : ''}{fmt(ret, 1)}%
                          </span>
                          <span style={{ fontSize: 10, color: C.muted, minWidth: 80, textAlign: 'right' }}>
                            ₹{Math.round(agent.portfolio_value || 0).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}

          {/* ---- RISK METRICS TAB ---- */}
          {activeInnerTab === 'risk' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <StatCell label="Avg Return" value={`${fmt(summary.avgReturn, 1)}%`} color={summary.avgReturn >= 0 ? C.green : C.red} />
              <StatCell label="Avg Sharpe" value={fmt(summary.avgSharpe)} color={summary.avgSharpe >= 0 ? C.green : C.red} />
              <StatCell label="Max Drawdown" value={`${fmt(summary.maxDD, 1)}%`} color={summary.maxDD < -5 ? C.red : C.amber} />
              <StatCell label="Violations" value={summary.violations} color={summary.violations > 0 ? C.amber : C.green} />
              <StatCell label="Best Agent" value={summary.bestAgent?.name || '—'} color={C.green} />
              <StatCell label="Worst Agent" value={summary.worstAgent?.name || '—'} color={C.red} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
