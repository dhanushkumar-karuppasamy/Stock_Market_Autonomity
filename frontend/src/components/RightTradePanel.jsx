import React from 'react';

export default function RightTradePanel({
  interval, setInterval_,
  speedMs, setSpeedMs,
  batchSize, setBatchSize,
  activeAgents, allAgents, toggleAgent,
  agentFollowers, setAgentFollowers,
  onStep, onAutoRun, onPause, onInit,
  status, step, maxSteps,
  crashActive, onCrash,
  onOpenSettings,
}) {
  const INTERVALS = ['1m', '5m', '15m', '1h', '1d'];

  const handleFollowerChange = (key, val) => {
    setAgentFollowers(prev => ({ ...prev, [key]: Math.max(1, Math.min(200, parseInt(val) || 1)) }));
  };

  return (
    <div className="olymp-right-panel">
      <div className="panel-section">
        <h3>Trade Settings</h3>
        <label>
          <span className="label-text">Candle Interval</span>
          <select 
            value={interval} 
            onChange={e => setInterval_(e.target.value)}
            className="compact-select"
          >
            {INTERVALS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
      </div>

      <div className="panel-section">
        <h3>Speed Control</h3>
        <label className="slider-label">
          <span className="speed-value">Delay: {speedMs}ms</span>
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={speedMs}
            onChange={e => setSpeedMs(Number(e.target.value))}
            className="speed-slider"
          />
        </label>
        <label className="slider-label">
          <span className="speed-value">Batch: {batchSize} step{batchSize > 1 ? 's' : ''}</span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={batchSize}
            onChange={e => setBatchSize(Number(e.target.value))}
            className="speed-slider"
          />
        </label>
      </div>

      <div className="panel-section">
        <h3>Active Agents &amp; Followers</h3>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>
          Followers multiply market impact without affecting portfolio size.
        </p>
        <div className="agents-toggle-list">
          {allAgents.map(a => (
            <div key={a.key} className="agent-follower-row">
              <label className="agent-toggle">
                <input
                  type="checkbox"
                  checked={activeAgents.includes(a.key)}
                  onChange={() => toggleAgent(a.key)}
                />
                <span>{a.label}</span>
              </label>
              <div className="follower-control">
                <span className="follower-label">×{agentFollowers?.[a.key] ?? 1}</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={agentFollowers?.[a.key] ?? 1}
                  onChange={e => handleFollowerChange(a.key, e.target.value)}
                  className="follower-input"
                  title={`Followers for ${a.label}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Actions</h3>
        <div className="control-buttons">
          <button className="btn-init" onClick={onInit}>
            ▶ Initialize
          </button>
          <button 
            className="btn-step" 
            onClick={onStep}
            disabled={status === 'finished' || status === 'idle'}
          >
            ⏭ Step
          </button>
          <button 
            className="btn-run" 
            onClick={onAutoRun}
            disabled={status === 'running' || status === 'finished' || status === 'idle'}
          >
            ⏩ Run
          </button>
          <button 
            className="btn-pause" 
            onClick={onPause}
            disabled={status !== 'running'}
          >
            ⏸ Pause
          </button>
        </div>

        <button 
          className={`btn-crash-panel ${crashActive ? 'active' : ''}`}
          onClick={onCrash}
          disabled={status === 'idle' || status === 'finished'}
        >
          ⚡ Trigger Crash
        </button>

        <button 
          className="btn-settings-panel"
          onClick={onOpenSettings}
        >
          ◈ Agent Settings
        </button>

        <div className="status-info">
          <div className="status-row">
            <span className="status-label">Status</span>
            <span className={`status-badge status-${status}`}>
              {status.toUpperCase()}
            </span>
          </div>
          <div className="status-row">
            <span className="status-label">Progress</span>
            <span className="step-counter">{step} / {maxSteps}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
