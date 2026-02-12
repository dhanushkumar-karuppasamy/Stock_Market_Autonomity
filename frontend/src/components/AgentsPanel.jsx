import React from 'react';

export default function AgentsPanel({ agents }) {
  if (!agents || agents.length === 0) {
    return <div className="card"><h2>Agents</h2><p>No agents yet.</p></div>;
  }

  return (
    <div className="card">
      <h2>Agents</h2>
      <div className="agents-grid">
        {agents.map(agent => {
          const pos = agent.positions || {};
          const posStr = Object.entries(pos).map(([t, q]) => `${t}: ${q}`).join(', ') || '—';
          const action = agent.last_action?.type || '—';

          return (
            <div className="agent-card" key={agent.name}>
              <h3>{agent.name}</h3>
              <div className="row">
                <span className="label">Cash</span>
                <span>${agent.cash?.toLocaleString()}</span>
              </div>
              <div className="row">
                <span className="label">Positions</span>
                <span>{posStr}</span>
              </div>
              <div className="row">
                <span className="label">Portfolio</span>
                <span>${agent.portfolio_value?.toLocaleString()}</span>
              </div>
              <div className="row">
                <span className="label">Action</span>
                <span>{action}</span>
              </div>
              <div className="reason">{agent.last_reason || ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
