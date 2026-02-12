import React from 'react';

export default function RegulationLogTable({ regulationLog }) {
  if (!regulationLog || regulationLog.length === 0) {
    return <div className="card"><h2>Regulation Events</h2><p>No events yet.</p></div>;
  }

  const display = regulationLog.slice(-80).reverse();

  const decClass = (d) =>
    d === 'WARN'  ? 'decision-warn' :
    d === 'BLOCK' ? 'decision-block' : '';

  return (
    <div className="card">
      <h2>Regulation Events</h2>
      <div className="log-table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Agent</th>
              <th>Rule</th>
              <th>Decision</th>
              <th>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {display.map((r, i) => (
              <tr key={i}>
                <td>{r.step}</td>
                <td>{r.agent_name}</td>
                <td>{r.rule_name}</td>
                <td className={decClass(r.decision)}>{r.decision}</td>
                <td title={r.explanation}>{r.explanation?.slice(0, 80)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
