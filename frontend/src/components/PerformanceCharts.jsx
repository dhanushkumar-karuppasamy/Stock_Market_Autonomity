import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid, BarChart, Bar,
} from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a78bfa', '#ef4444'];

export default function PerformanceCharts({ agents, tradeLog, regulationLog }) {
  // --- Portfolio value over time (multi-line) ---
  const portfolioData = useMemo(() => {
    if (!agents || agents.length === 0) return [];
    // We only have the latest portfolio_value per agent in the snapshot,
    // but the trade_log has per-step values we can reconstruct from.
    // Build from trade_log: group by step, collect portfolio_value per agent.
    if (!tradeLog || tradeLog.length === 0) return [];

    const byStep = {};
    for (const t of tradeLog) {
      if (!byStep[t.step]) byStep[t.step] = { step: t.step };
      byStep[t.step][t.agent_name] = t.portfolio_value;
    }
    return Object.values(byStep).sort((a, b) => a.step - b.step);
  }, [tradeLog, agents]);

  // --- Violations per agent (bar chart) ---
  const violationData = useMemo(() => {
    if (!regulationLog || regulationLog.length === 0) return [];
    const counts = {};
    for (const r of regulationLog) {
      counts[r.agent_name] = (counts[r.agent_name] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({ name, violations: count }));
  }, [regulationLog]);

  const agentNames = agents?.map(a => a.name) || [];

  return (
    <div className="charts-row">
      {/* Portfolio value over time */}
      <div className="card">
        <h2>Portfolio Performance</h2>
        {portfolioData.length === 0 ? (
          <p>No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={portfolioData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
              <XAxis dataKey="step" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid #3a3f55', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {agentNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[i % COLORS.length]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Violations per agent */}
      <div className="card">
        <h2>Regulatory Violations</h2>
        {violationData.length === 0 ? (
          <p>No violations yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={violationData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid #3a3f55', fontSize: 12 }} />
              <Bar dataKey="violations" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
