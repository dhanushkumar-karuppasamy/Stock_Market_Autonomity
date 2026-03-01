import React, { useState } from 'react';

const C = {
  green: '#4ade80', red: '#f87171', cyan: '#38bdf8',
  amber: '#fbbf24', purple: '#c084fc', muted: '#64748b',
  text: '#cbd5e1', heading: '#f1f5f9', border: 'rgba(255,255,255,0.07)',
};

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'agents', label: 'Agents' },
  { id: 'pipeline', label: 'AI Pipeline' },
  { id: 'followers', label: 'Followers' },
  { id: 'builder', label: 'Strategy Builder' },
  { id: 'controls', label: 'Controls' },
  { id: 'stack', label: 'Tech Stack' },
];

function Section({ title, color = C.cyan, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h3 style={{
        fontSize: 13, fontWeight: 700, color, marginBottom: 12,
        textTransform: 'uppercase', letterSpacing: 1,
        fontFamily: "'JetBrains Mono', monospace",
        borderBottom: `1px solid ${color}22`, paddingBottom: 8,
      }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function P({ children }) {
  return (
    <p style={{
      fontSize: 12.5, color: C.text, lineHeight: 1.8,
      fontFamily: "'Inter', system-ui, sans-serif",
      marginBottom: 10,
    }}>
      {children}
    </p>
  );
}

function Badge({ color = C.cyan, children }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 8px', borderRadius: 4,
      background: `${color}15`, border: `1px solid ${color}30`,
      color, fontSize: 11, fontWeight: 600,
      fontFamily: "'JetBrains Mono', monospace",
      verticalAlign: 'middle',
    }}>{children}</span>
  );
}

function AgentRow({ icon, name, accent, entry, exit_, goal }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 8, marginBottom: 8,
      background: `${accent}05`, border: `1px solid ${accent}18`,
      borderLeft: `3px solid ${accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: accent, fontFamily: "'JetBrains Mono', monospace" }}>{name}</span>
      </div>
      <div style={{ fontSize: 11, color: C.text, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
        <strong style={{ color: C.muted }}>Goal:</strong> {goal}
      </div>
      {entry && <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontFamily: "'Inter', sans-serif" }}>
        <strong>Entry:</strong> {entry} &nbsp;|&nbsp; <strong>Exit:</strong> {exit_}
      </div>}
    </div>
  );
}

function PipelineStep({ num, label, color, desc }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
      <div style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: 6,
        background: `${color}15`, border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color,
        fontFamily: "'JetBrains Mono', monospace",
      }}>{num}</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
        <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>{desc}</div>
      </div>
    </div>
  );
}

function ControlRow({ label, color, desc }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
      <div style={{
        flexShrink: 0, minWidth: 90,
        fontSize: 10, fontWeight: 700, color,
        fontFamily: "'JetBrains Mono', monospace", paddingTop: 1,
      }}>{label}</div>
      <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>{desc}</div>
    </div>
  );
}

export default function HelpPanel() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header + tab nav */}
      <div style={{
        padding: '20px 24px 0', borderBottom: `1px solid ${C.border}`,
        background: 'rgba(0,0,0,0.12)',
      }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: C.heading }}>
          Info &amp; Rules
        </h2>
        <p style={{ fontSize: 11, color: C.muted, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>
          Complete documentation for MASTER — the Multi-Agent Stockmarket Trading Environment for Research.
        </p>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: '7px 14px', cursor: 'pointer', background: 'none',
                border: 'none', borderBottom: `2px solid ${activeSection === s.id ? C.cyan : 'transparent'}`,
                color: activeSection === s.id ? C.cyan : C.muted,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                fontWeight: activeSection === s.id ? 700 : 400,
                transition: 'all 0.15s', borderRadius: '4px 4px 0 0',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 28px' }}>

        {activeSection === 'overview' && (
          <>
            <Section title="What is this?" color={C.cyan}>
              <P>
                <strong style={{ color: C.heading }}>MASTER</strong> runs
                5 autonomous AI trading agents (plus an optional Custom agent) on real historical market data
                fetched via yfinance. A Regulator monitors all trades in real-time.
              </P>
              <P>
                Every trade affects the simulated price through an <em>endogenous price impact model</em>:
                large net order flow moves prices, just like in real markets.
              </P>
            </Section>
            <Section title="Key concepts" color={C.purple}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                {[
                  { t: 'Net Volume', d: 'Sum of signed trade quantities per step. Positive = net buying, negative = selling pressure.', c: C.cyan },
                  { t: 'Price Impact', d: 'Net volume shifts the next simulated price proportionally, creating feedback between agents and price.', c: C.green },
                  { t: 'Circuit Breaker', d: 'Agent halted at -10% drawdown. Global trading halt at -15% system-wide drawdown.', c: C.red },
                  { t: 'Followers', d: 'Multiplies an agent\'s market impact without changing its own portfolio. 50 followers = 50× price impact.', c: C.amber },
                  { t: 'Regulator', d: 'Checks every trade: position limits, burst-trading, manipulation. Blocks or warns non-compliant trades.', c: C.purple },
                  { t: 'Crash Event', d: 'Injects a flash crash by marking down OHLC data 15–20% and forcing the Adversarial agent to dump.', c: C.red },
                ].map(item => (
                  <div key={item.t} style={{
                    padding: '10px 12px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                    borderTop: `2px solid ${item.c}`,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: item.c, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{item.t}</div>
                    <div style={{ fontSize: 11, color: C.text, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{item.d}</div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {activeSection === 'agents' && (
          <Section title="The 5 built-in agents" color={C.green}>
            <AgentRow icon="🛡" name="Conservative" accent={C.cyan}
              goal="Preserve capital with steady small returns and strict risk controls."
              entry="Price < SMA50, SMA20 > SMA50, low volatility → BUY 7% cash"
              exit_="Stop-loss at -3% from avg cost, or high volatility → SELL all" />
            <AgentRow icon="🚀" name="Momentum" accent={C.green}
              goal="Maximise profit riding established price trends."
              entry="SMA20 crosses above SMA50 (golden cross) → BUY 15% cash"
              exit_="SMA20 crosses below SMA50 (death cross) → SELL all" />
            <AgentRow icon="↩" name="MeanReversion" accent={C.purple}
              goal="Profit when prices revert to statistical mean after extremes."
              entry="Price closes below Bollinger lower band → BUY 12% cash"
              exit_="Price closes above Bollinger upper band → SELL all" />
            <AgentRow icon="🎲" name="NoiseTrader" accent={C.amber}
              goal="Simulate irrational retail activity and inject market noise."
              entry="15% random chance per step → random BUY up to 2% cash"
              exit_="50% chance → random partial SELL of holdings" />
            <AgentRow icon="🦈" name="Adversarial" accent={C.red}
              goal="Stress-test the Regulator with pump-and-dump manipulation."
              entry="BUY large (25%) in low-volume windows (PUMP phase)"
              exit_="SELL all when unrealised gain > 3% (DUMP phase)" />
          </Section>
        )}

        {activeSection === 'pipeline' && (
          <Section title="Perceive → Reason → Act" color={C.purple}>
            <P>Every simulation step, each agent runs through a structured cognitive loop:</P>
            <PipelineStep num="1" label="Perceive" color={C.cyan}
              desc="Reads Close price, SMA20/50, Bollinger Bands, Volatility, Volume, and its own cash and positions from the current market bar." />
            <PipelineStep num="2" label="Reason" color={C.purple}
              desc="Applies its private strategy rules to produce a structured decision dict including a human-readable reasoning string." />
            <PipelineStep num="3" label="Act" color={C.amber}
              desc="Submits the decision (BUY/SELL/HOLD + quantity) to the Orchestrator, which forwards it to the Regulator for compliance review." />
            <PipelineStep num="4" label="Execute" color={C.green}
              desc="If approved or warned, the trade updates the portfolio. The signed effective quantity (qty × followers) is added to net_volume." />
            <PipelineStep num="5" label="Regulate" color={C.red}
              desc="Regulator checks MaxPositionLimit, BurstTrading, ManipulationPattern. Violations are logged; BLOCKed trades are cancelled." />
          </Section>
        )}

        {activeSection === 'followers' && (
          <Section title="Followers mechanic" color={C.amber}>
            <P>
              Each agent has a <Badge color={C.amber}>followers</Badge> count (default: 1).
              This represents how many identical traders use the same strategy simultaneously.
            </P>
            <P>
              When an agent with 50 followers buys 100 shares, its portfolio records 100 shares,
              but the price impact model sees 5,000 effective units — causing much stronger price movement.
            </P>
            <div style={{
              padding: '12px 16px', borderRadius: 8, marginBottom: 14,
              background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.amber, marginBottom: 6 }}>Impact formula</div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8 }}>
                effective_qty = quantity × followers<br />
                net_volume += effective_qty  <span style={{ color: C.muted }}>← price model</span><br />
                agent.execute_action(quantity)  <span style={{ color: C.muted }}>← portfolio unchanged</span>
              </div>
            </div>
            <P>Configure followers in the right panel before clicking Initialize. Changes only take effect on re-initialization.</P>
          </Section>
        )}

        {activeSection === 'builder' && (
          <Section title="Custom Strategy Builder" color={C.green}>
            <P>
              The <strong style={{ color: C.heading }}>Builder</strong> tab lets you define a trading strategy
              without writing code. It runs as the <Badge color={C.green}>Custom</Badge> agent.
            </P>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.cyan, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Basic Mode</div>
              <P>Pick an entry rule (SMA crossover, BB oversold, price vs SMA) and exit rule (death cross, BB overbought, stop-loss), plus a position size fraction.</P>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Advanced Mode — IF-THEN Rules</div>
              <P>Build conditional logic blocks: choose indicators, operators, and values; combine with AND/OR; assign a BUY/SELL/HOLD action and size.</P>
              <div style={{
                padding: '10px 14px', borderRadius: 6,
                background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.2)',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.text, lineHeight: 1.9,
              }}>
                IF [price &lt; bb_low] AND [cash_ratio &gt; 0.5] → BUY 10%<br />
                IF [sma20 &lt; sma50] → SELL 100%
              </div>
            </div>
            <P>
              <strong style={{ color: C.red }}>Security note:</strong> uses a safe JSON recipe format.
              No <code>eval()</code> or <code>exec()</code> is ever called.
            </P>
          </Section>
        )}

        {activeSection === 'controls' && (
          <Section title="Controls reference" color={C.cyan}>
            <ControlRow label="Initialize" color={C.cyan} desc="Download real market data via yfinance, reset all agents to $100,000, and apply current followers/params config." />
            <ControlRow label="Step" color={C.green} desc="Advance by one candle (or batch size). Each agent runs the full perceive → reason → act → regulate cycle." />
            <ControlRow label="Run / Pause" color={C.green} desc="Auto-step at configured speed (50–1000ms per step). Pause stops the timer, preserving all current state." />
            <ControlRow label="Crash" color={C.red} desc="Inject a flash crash: drops OHLC 15–20%, forces Adversarial to dump, activates high volatility for ~10 steps." />
            <ControlRow label="Settings" color={C.muted} desc="Tune per-agent quantitative parameters: position sizes, stop-loss thresholds, band multipliers, trade probabilities." />
            <ControlRow label="Scrubber" color={C.amber} desc="Drag the chart timeline slider to jump to any previously visited step and inspect historical state." />
          </Section>
        )}

        {activeSection === 'stack' && (
          <Section title="Technology stack" color={C.muted}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {[
                { label: 'Backend', value: 'Python 3.10+', sub: 'Type-annotated rule-based logic', color: C.green },
                { label: 'API Server', value: 'Flask', sub: 'REST: init/step/jump/crash', color: C.green },
                { label: 'Market Data', value: 'yfinance', sub: 'Real OHLCV from Yahoo Finance', color: C.cyan },
                { label: 'Frontend', value: 'React 18 + Vite', sub: 'Fast SPA with hooks', color: C.cyan },
                { label: 'Charts', value: 'TradingView LWC v5', sub: 'Candles + markers + overlays', color: C.amber },
                { label: 'Analytics', value: 'Recharts', sub: 'Portfolio & regulation charts', color: C.purple },
                { label: 'Database', value: 'SQLite', sub: 'Persistent trades + regulation logs', color: C.muted },
                { label: 'No LLMs', value: '100% Rule-Based', sub: 'All logic deterministic & local', color: C.red },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '11px 13px', borderRadius: 7,
                  background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                }}>
                  <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 3, fontFamily: "'Inter', sans-serif" }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
