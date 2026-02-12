import React from 'react';

const TICKERS = ['AAPL', 'MSFT', 'TSLA', 'NSEI', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS'];
const PERIODS = ['1d', '5d', '1mo', '3mo'];
const INTERVALS = ['1m', '5m', '15m', '1h', '1d'];

export default function ControlsPanel({
  ticker, setTicker,
  period, setPeriod,
  interval, setInterval_,
  onInit, onStep, onAutoRun, onPause,
  status, step, maxSteps,
}) {
  const badgeClass =
    status === 'running'  ? 'badge-running' :
    status === 'paused'   ? 'badge-paused' :
    status === 'finished' ? 'badge-finished' :
    'badge-idle';

  return (
    <div className="card controls">
      <h2>Controls</h2>

      <label>
        Ticker
        <select value={ticker} onChange={e => setTicker(e.target.value)}>
          {TICKERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>

      <label>
        Period
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>

      <label>
        Interval
        <select value={interval} onChange={e => setInterval_(e.target.value)}>
          {INTERVALS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </label>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={onInit}>
          Start / Re-init
        </button>
        <button className="btn btn-success" onClick={onStep}
                disabled={status === 'finished' || status === 'idle'}>
          Step
        </button>
        <button className="btn btn-warning" onClick={onAutoRun}
                disabled={status === 'running' || status === 'finished' || status === 'idle'}>
          Auto-Run
        </button>
        <button className="btn btn-danger" onClick={onPause}
                disabled={status !== 'running'}>
          Pause
        </button>
      </div>

      <div className="status-text">
        Status: <span className={`badge ${badgeClass}`}>{status.toUpperCase()}</span>
        <br />
        Step: {step} / {maxSteps}
      </div>
    </div>
  );
}
