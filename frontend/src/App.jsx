import React, { useState, useRef, useCallback } from 'react';
import { initSimulation, stepSimulation } from './api/client';
import ControlsPanel from './components/ControlsPanel';
import PriceChart from './components/PriceChart';
import AgentsPanel from './components/AgentsPanel';
import TradeLogTable from './components/TradeLogTable';
import RegulationLogTable from './components/RegulationLogTable';
import PerformanceCharts from './components/PerformanceCharts';

export default function App() {
  // ---- Control state ----
  const [ticker, setTicker] = useState('AAPL');
  const [period, setPeriod] = useState('5d');
  const [interval_, setInterval_] = useState('5m');

  // ---- Simulation snapshot ----
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState(null);

  // ---- Run state ----
  const [status, setStatus] = useState('idle'); // idle | paused | running | finished
  const autoRef = useRef(null);

  // ---- Handlers ----

  const handleInit = useCallback(async () => {
    setError(null);
    try {
      const data = await initSimulation(ticker, period, interval_);
      if (data.error) {
        setError(data.error);
        setStatus('idle');
      } else {
        setSnapshot(data);
        setStatus('paused');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setStatus('idle');
    }
  }, [ticker, period, interval_]);

  const handleStep = useCallback(async () => {
    setError(null);
    try {
      const data = await stepSimulation();
      if (data.error) {
        setError(data.error);
        return;
      }
      setSnapshot(data);
      if (data.finished) {
        setStatus('finished');
        if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, []);

  const handleAutoRun = useCallback(() => {
    setStatus('running');
    // Step every 300 ms
    autoRef.current = setInterval(async () => {
      try {
        const data = await stepSimulation();
        if (data.error) {
          clearInterval(autoRef.current);
          autoRef.current = null;
          setError(data.error);
          setStatus('paused');
          return;
        }
        setSnapshot(data);
        if (data.finished) {
          clearInterval(autoRef.current);
          autoRef.current = null;
          setStatus('finished');
        }
      } catch (err) {
        clearInterval(autoRef.current);
        autoRef.current = null;
        setError(err.response?.data?.error || err.message);
        setStatus('paused');
      }
    }, 300);
  }, []);

  const handlePause = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
    setStatus('paused');
  }, []);

  // ---- Derived data ----
  const step = snapshot?.step ?? 0;
  const maxSteps = snapshot?.max_steps ?? 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Multi-Agent Stock Market AI Autonomity</h1>
        <p>Simulated financial ecosystem with autonomous trading agents, regulation &amp; full audit trail</p>
      </header>

      {error && <div className="error-banner">⚠ {error}</div>}

      <div className="main-grid">
        {/* Left sidebar – controls */}
        <ControlsPanel
          ticker={ticker} setTicker={setTicker}
          period={period} setPeriod={setPeriod}
          interval={interval_} setInterval_={setInterval_}
          onInit={handleInit}
          onStep={handleStep}
          onAutoRun={handleAutoRun}
          onPause={handlePause}
          status={status}
          step={step}
          maxSteps={maxSteps}
        />

        {/* Right – charts & data */}
        <div className="right-panel">
          <PriceChart priceHistory={snapshot?.price_history} />

          <AgentsPanel agents={snapshot?.agents} />

          <PerformanceCharts
            agents={snapshot?.agents}
            tradeLog={snapshot?.trade_log}
            regulationLog={snapshot?.regulation_log}
          />

          <TradeLogTable tradeLog={snapshot?.trade_log} />

          <RegulationLogTable regulationLog={snapshot?.regulation_log} />
        </div>
      </div>
    </div>
  );
}
