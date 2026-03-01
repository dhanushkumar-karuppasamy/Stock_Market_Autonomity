import React from 'react';

function riskLevel(exposurePct, globalDD) {
  if (globalDD <= -10 || exposurePct > 80) return { label: 'HIGH', color: '#f87171' };
  if (globalDD <= -5 || exposurePct > 50) return { label: 'MEDIUM', color: '#fbbf24' };
  return { label: 'LOW', color: '#4ade80' };
}

export default function RiskOverviewPanel({ systemRisk }) {
  if (!systemRisk) {
    return (
      <div className="card">
        <h2>System Risk Overview</h2>
        <p>No data yet.</p>
      </div>
    );
  }

  const r = systemRisk;
  const level = riskLevel(r.exposure_pct || 0, r.global_drawdown_pct || 0);

  return (
    <div className={`card risk-panel ${r.crash_active ? 'risk-panel-crash' : ''}`}>
      <div className="risk-panel-header">
        <h2>System Risk Overview</h2>
        <span className="risk-level-badge" style={{ background: level.color + '22', color: level.color }}>
          {level.label} RISK
        </span>
        {r.crash_active && <span className="badge badge-crash">CRASH ACTIVE</span>}
      </div>

      <div className="risk-metrics-grid">
        <div className="risk-metric-card">
          <div className="risk-metric-value">₹{(r.total_aum || 0).toLocaleString()}</div>
          <div className="risk-metric-label">Total AUM</div>
        </div>
        <div className="risk-metric-card">
          <div className="risk-metric-value">{r.exposure_pct ?? 0}%</div>
          <div className="risk-metric-label">Exposure</div>
        </div>
        <div className="risk-metric-card">
          <div className="risk-metric-value" style={{ color: (r.global_drawdown_pct || 0) < -5 ? '#f87171' : '#4ade80' }}>
            {r.global_drawdown_pct ?? 0}%
          </div>
          <div className="risk-metric-label">Global Drawdown</div>
        </div>
        <div className="risk-metric-card">
          <div className="risk-metric-value">{r.open_positions_count ?? 0}</div>
          <div className="risk-metric-label">Open Positions</div>
        </div>
        <div className="risk-metric-card">
          <div className="risk-metric-value" style={{ color: (r.violation_count || 0) > 0 ? '#fbbf24' : '#4ade80' }}>
            {r.violation_count ?? 0}
          </div>
          <div className="risk-metric-label">Violations</div>
        </div>
        <div className="risk-metric-card">
          <div className="risk-metric-value" style={{ color: (r.circuit_breakers_active || 0) > 0 ? '#f87171' : '#4ade80' }}>
            {r.circuit_breakers_active ?? 0}
          </div>
          <div className="risk-metric-label">Circuit Breakers</div>
        </div>
      </div>
    </div>
  );
}
