# Multi-Agent Stock Market AI Autonomity

A simulated financial ecosystem populated by **multiple autonomous trading agents** operating in a shared market. Each agent analyses real market data (via **yfinance**), trades under uncertainty, manages its portfolio & risk, and adapts over time — including an adversarial agent that attempts pump-and-dump manipulation.

A **Regulator** module enforces compliance constraints and blocks or warns on suspicious trades. Every decision is fully logged for transparent, interpretable, post-hoc auditing.

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Python 3 · Flask · yfinance · pandas · numpy |
| Frontend | React 18 (Vite) · Recharts · Axios |
| Data     | In-memory only (no database — hackathon prototype) |

---

## Agents

| Agent | Strategy |
|-------|----------|
| **Conservative** | Low volatility filter, small positions, tight stop-loss |
| **Momentum** | SMA20/SMA50 crossover trend following |
| **MeanReversion** | Bollinger Band mean-reversion (buy BB_LOW, sell BB_UP) |
| **NoiseTrader** | Random small trades to inject realistic noise |
| **Adversarial** | Pump-and-dump: burst buys in low-volume, dumps on gain |

---

## Project Structure

```
backend/
  app.py                      # Flask API server
  requirements.txt
  market/
    market.py                  # Market data download & environment
  agents/
    base_agent.py              # Abstract trading agent
    conservative_agent.py
    momentum_agent.py
    mean_reversion_agent.py
    noise_trader.py
    adversarial_agent.py
  regulator/
    regulator.py               # Compliance & manipulation detection
  simulation/
    simulation.py              # Orchestrator gluing everything together
  logging_utils/
    logger.py                  # In-memory audit trail
frontend/
  src/
    api/client.js              # Axios API client
    components/
      ControlsPanel.jsx
      PriceChart.jsx
      AgentsPanel.jsx
      TradeLogTable.jsx
      RegulationLogTable.jsx
      PerformanceCharts.jsx
    App.jsx
    main.jsx
    index.css
README.md
```

---

## How to Run

### 1. Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server (port 5000)
python app.py
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (port 5173)
npm run dev
```

---

## How to Use

1. Open the React UI at **http://localhost:5173**.
2. Select a **ticker** (e.g. AAPL, TSLA, RELIANCE.NS), **period**, and **interval**.
3. Click **Start / Re-init** to download market data and create agents.
4. Click **Step** to advance one bar at a time, or **Auto-Run** to continuously simulate.
5. Observe:
   - **Price Chart** with SMA & Bollinger Band overlays.
   - **Agent cards** showing cash, positions, portfolio value, last action & reasoning.
   - **Trade Log** with regulator decisions (filterable by agent).
   - **Regulation Events** table.
   - **Performance Charts**: portfolio value over time per agent + violations bar chart.
6. Click **Pause** to stop auto-run. The simulation ends when all historical bars are consumed.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/init` | Init simulation `{"ticker","period","interval"}` |
| POST | `/api/step` | Advance one step |
| POST | `/api/auto-step` | Advance N steps `{"steps": 10}` |
| GET  | `/api/state` | Get current snapshot |

---

## License

MIT — built for hackathon / educational purposes.
