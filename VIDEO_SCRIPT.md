# DevHack 2026 — Phase 2 Video Script
### Multi-Agent Stock Market AI Autonomity | Team WeWin
**Duration: ~9–10 minutes | Single continuous recording, no cuts**

---

## PRE-RECORDING CHECKLIST
- [ ] Backend running (`python app.py` on port 5000)
- [ ] Frontend running (`npm run dev` on port 5173)
- [ ] Browser open at `http://localhost:5173` — dark theme selected
- [ ] Terminal visible on one side (optional, for showing code execution)
- [ ] Screen recording tool ready (OBS / QuickTime)
- [ ] Mic check done

---

## SEGMENT 1 — HOOK & PROJECT OVERVIEW (0:00 – 1:30)

### [Show: Browser with the full UI loaded — dark neon theme, 3-column layout visible. TopBar at top with "◈ MASTER" logo, LeftSidebar with tab icons, center chart area, RightTradePanel on the right. Simulation not yet initialized.]

> **"Hey everyone — welcome to our DevHack 2026 Phase 2 prototype demo. We are Team WeWin, and our project is the Multi-Agent Stock Market AI Autonomity Simulator."**

> **"So what does this do? Imagine a real stock market — but instead of humans, you have five fully autonomous AI agents, each with its own strategy, its own ₹1,00,000 in cash, and its own reasoning pipeline — all competing in a shared market powered by real historical data from Yahoo Finance."**

> **"This is NOT a chatbot. This is a fully autonomous, goal-driven multi-agent decision-making system. Every single step, each agent runs a Perceive → Reason → Act pipeline — they perceive the market state, apply their strategy to reason about what to do, produce a structured decision, and then a Regulator agent reviews that decision for compliance — all coordinated by a central Orchestrator that we call the Head Agent."**

> **"Let me walk you through the architecture."**

### [Show: Click on the Help tab (? icon) in the LeftSidebar — show the agent cards and AI Pipeline visualization]

> **"Here in our Help tab, you can see the system at a glance. We have 7 agents total:"**

> **"First — the OrchestratorAgent, our Head Agent. It controls the simulation clock, coordinates all the other agents, manages risk at the system level, and triggers circuit breakers when things go south."**

> **"Then we have 5 trading agents — each with a completely different strategy:"**
>
> 1. **"Conservative Agent 🛡 — capital preservation. Only trades in low-volatility conditions with tight stop-losses."**
> 2. **"Momentum Agent 🚀 — trend follower. Uses SMA-20 / SMA-50 golden cross and death cross signals."**
> 3. **"Mean Reversion Agent ↩ — contrarian. Uses Bollinger Bands — buys when price hits the lower band, sells at the upper band."**
> 4. **"Noise Trader 🎲 — simulates irrational retail activity. Random small trades to inject realistic market noise."**
> 5. **"Adversarial Agent 🦈 — the whale. Deliberately does pump-and-dump manipulation to stress-test our regulatory system."**

> **"And finally — the Regulator Agent. It enforces 6 compliance rules on every single trade — including a repeat-offender escalation that blocks agents who rack up too many warnings."**

### [Show: Point to the AI Pipeline visualization on the Help panel: Perceive → Reason → Act → Regulate]

> **"And here's the key Phase 2 upgrade — every agent now runs a structured Perceive → Reason → Act agentic pipeline. They perceive market features, reason about strategy, act on their decision, and it all gets reviewed by the Regulator. Every step is stored in the agent's memory buffer."**

---

## SEGMENT 2 — CORE AGENTS DEEP DIVE (1:30 – 3:30)

### [Show: Still on the Help tab]

> **"Now let me zoom into the two core agents that drive our entire system — the Orchestrator and the Regulator."**

### Core Agent 1: OrchestratorAgent (Head Agent)

> **"The Orchestrator is the brain of the simulation. Every step, it runs an 8-step pipeline:"**
>
> 1. **"It gets the current market state — price, SMA, Bollinger Bands, volatility."**
> 2. **"It calls agent.step() on each active agent — which internally runs Perceive → Reason → Act. Each agent returns a structured decision: action, quantity, and reasoning."**
> 3. **"It sends every proposed trade to the Regulator for compliance review."**
> 4. **"Only APPROVED or WARNED trades get executed. BLOCKED trades are rejected."**
> 5. **"It logs every trade and regulation event — dual-write to both in-memory lists for the real-time UI, and to a SQLite database for persistent audit."**
> 6. **"It calls agent.update_after_step() — which updates each agent's performance stats: P&L, wins, losses, max drawdown — and stamps the memory entry with the result."**
> 7. **"It checks circuit breakers — any individual agent with more than 10% drawdown gets halted. If the entire system drawdown exceeds 15%, a global circuit breaker fires and ALL trading stops."**
> 8. **"Finally, it advances the market to the next bar — and here's the cool part — our market has an Endogenous Price Impact Model. Agent order flow actually moves the simulated price. Net buyers push price up, net sellers push it down."**

### Core Agent 2: RegulatorAgent (Compliance)

> **"The Regulator reviews every single trade before it hits the market. It enforces 6 rules:"**
>
> 1. **"MaxPositionLimit — no agent can hold more than 30% of their portfolio in a single stock."**
> 2. **"MaxOrderSize — no single order can exceed 10% of the average trading volume."**
> 3. **"BurstTrading / ManipulationPattern — if an agent fires 3 or more large orders within 5 steps, it gets BLOCKED."**
> 4. **"AdversarialFlag — large orders from the adversarial agent get flagged with a WARNING."**
> 5. **"ContrarianCrashDetection — if the market is crashing and an agent tries to BUY, the Regulator flags it as risky contrarian behaviour."**
> 6. **"RepeatOffender Escalation — and this is the key one — if any agent accumulates 5 or more warnings, it gets BLOCKED and enters a 10-step cooldown. During cooldown, all trades from that agent are automatically rejected. After the cooldown expires, the warning count resets and the agent can trade again. So warnings aren't just noise — they have real consequences."**

> **"The output is always: APPROVE, WARN, or BLOCK — with a full explanation of why."**

---

## SEGMENT 3 — LIVE DEMO: INITIALIZATION & STEPPING (3:30 – 5:30)

### [Show: Browser — the 3-column layout. TopBar has stock selector, RightTradePanel has controls]

> **"Alright, enough architecture — let's see this thing in action."**

### [Action: Use the TopBar dropdown to select AAPL, period 5d. In RightTradePanel, select 5m interval. All 5 agent checkboxes are enabled.]

> **"I'm selecting Apple stock from the TopBar — AAPL — with a 5-day window and 5-minute candles. You can see all 5 agents are toggled on in the right panel."**

### [Action: Click "▶ Initialize" button in RightTradePanel]

> **"When I hit Initialize, the backend downloads real historical data from Yahoo Finance, creates the market environment, computes all the technical indicators, instantiates all 5 agents with ₹1,00,000 each, sets up the Regulator, and creates a new run in our SQLite database."**

### [Show: TradingView chart appears with candlesticks, SMA overlays, Bollinger Bands. Floating legend visible.]

> **"And we're live. Look at this chart — this is TradingView Lightweight Charts version 5. Professional-grade OHLC candlesticks with SMA20 in orange, SMA50 in amber, and Bollinger Band overlays. The floating legend updates live as you move your crosshair."**

### [Action: Click "⏩ Step" button a few times manually]

> **"Now watch — every time I step forward, ALL 5 agents independently run their Perceive → Reason → Act pipeline, the Regulator reviews each trade, and the chart updates with new candles and trade markers."**

### [Show: Click on Trades tab (⇅) in LeftSidebar — show Trade Log Table below the chart]

> **"Here in the Trades tab, you can see every single trade — the agent name, action, price in rupees, quantity, the agent's reasoning, and the regulator's verdict — APPROVE, WARN, or BLOCK."**

### [Show: Click on Agents tab (⬡) in LeftSidebar — show the rich AgentsPanel]

> **"And here's the Agents tab — this is a Phase 2 upgrade. At the top you can see the two system agent cards side by side — the Orchestrator showing step progress, crash status, circuit breakers, and total AUM — and the Regulator showing live approval, warning, and block counts with a compliance rate bar and all 6 rules it enforces. Below that are the 5 trading agent cards — each with its own icon, portfolio value in rupees, a SparkBar chart of portfolio history, color-coded risk metric chips — return percentage, drawdown, Sharpe ratio."**

### [Action: Click on an agent quick-select button to expand a card. Show the expandable sections.]

> **"When I expand an agent, I can see the full Trade History table, and — this is key — the AI Pipeline view. Four steps: Perceive, Reason, Act, Result. You can see exactly what the agent perceived in the market, how it reasoned, what action it took, and what the outcome was. Full transparency. Plus a memory buffer counter showing how many steps the agent remembers."**

### [Action: Click "▶ Run" button — let it auto-run for 15-20 steps, then click "⏸ Pause"]

> **"Now let me hit Run — the Orchestrator will step through automatically. Watch the candles build in real-time on the TradingView chart, and watch the agents' portfolios diverge as their different strategies play out."**

### [Pause after ~20 steps]

> **"Beautiful. Already you can see the agents behaving differently — Momentum buys on the uptrend, Conservative stays cautious, the Noise Trader makes random small moves. And every decision is logged with full reasoning."**

---

## SEGMENT 4 — LIVE DEMO: MARKET TAB, THEME & SCRUBBER (5:30 – 6:30)

### [Show: Click on Market tab (◎) in LeftSidebar]

> **"The Market tab gives you the full picture — current price in rupees with change percentage and directional arrow, session range bar showing the high-low range with a dot for current close, OHLC grid, and all the technical indicators: SMA20, SMA50, Bollinger Bands, and the simulated price."**

> **"You can also see the SMA crossover signal — bullish golden cross or bearish death cross — and a volatility meter with a gradient bar."**

### [Action: Click theme toggle button (🌙) in TopBar to switch to light theme, pause 2 seconds, then switch back to dark]

> **"And we have a full theme system — watch this. Light theme. Everything adapts — the glassmorphism cards, the neon accents, the fonts. And back to dark mode, because that's where it looks best."**

### [Show: Use the scrubber at bottom of the PriceChart to drag back to an earlier step]

> **"And here's a key feature — the time travel scrubber. I can drag this slider back to any previous step and review the exact market state, agent decisions, and portfolio values at that point in time."**

> **"The scrubber is capped to the furthest step we've reached — you can't jump forward into uncomputed territory. It's debounced — it only fires on mouse release, not on every pixel of drag. And it resets the entire simulation in-place without re-downloading data from Yahoo Finance, so it's fast."**

### [Drag back to step 5, then come back to the latest step]

> **"Step 5 — here's what the market looked like. And back to the present."**

---

## SEGMENT 5 — LIVE DEMO: WHALE CRASH & CIRCUIT BREAKERS (6:30 – 8:00)

### [Show: Browser — continue from where we paused]

> **"Now — the highlight of our system. The Whale Manipulation Crash."**

### [Action: Click the "Trigger Crash" button in RightTradePanel — show the crash flash animation]

> **"When I hit Trigger Crash, here's what happens behind the scenes:"**
>
> 1. **"The Orchestrator checks the Adversarial agent — the whale 🦈. If it doesn't have a position, it force-buys 90% of its cash."**
> 2. **"Then it drops all OHLC prices by 15-20% from this point onward."**
> 3. **"It recomputes all technical indicators on the crashed data."**
> 4. **"The whale's agentic pipeline is overridden — perceive() runs normally, but then act() is called directly with a forced full-dump SELL, bypassing the normal reason() step."**
> 5. **"This massive sell order flows through our Endogenous Price Impact Model — the price crashes further."**
> 6. **"On the next steps, the Momentum agent detects the death cross and panic-sells. The Mean Reversion agent might try to buy the dip — and the Regulator flags it as contrarian crash behaviour."**
> 7. **"If the total system drawdown exceeds 15%, the global circuit breaker fires and ALL trading is halted."**

### [Show: Point to the crash badge in TopBar pulsing red. Step through a few more times.]

> **"Watch the cascade happen in real-time. The crash badge is pulsing in the TopBar. You can see agents getting halted individually, regulation events piling up, and eventually..."**

### [If circuit breaker fires — show it]

> **"There it is — Global Trading Halt. The circuit breaker has fired. No more trades. This is exactly how real markets work — SEBI, SEC — they all have circuit breakers."**

### [Show: Click on Stats tab (◈) in LeftSidebar — show RiskOverview + StatsPanel]

> **"The Stats tab shows the aftermath — total AUM in rupees, agent leaderboard ranked by return with medal emojis, buy/sell ratio, trading activity breakdown, and aggregate risk metrics including max drawdown and total violations."**

---

## SEGMENT 6 — REGULATION EVENTS & AUDIT TRAIL (8:00 – 8:30)

### [Show: Click on Trades tab (⇅) — scroll down to Regulation Log Table]

> **"Every regulation event is logged — which agent got flagged, which rule was triggered, the verdict — APPROVE, WARN, or BLOCK — and a full explanation."**

> **"And all of this is persisted in our SQLite database — devhack.db — with three tables: runs, trades, and regulation_events. Dual-write: every event goes to both in-memory lists for the real-time UI and to SQLite for persistent audit. Full audit trail."**

---

## SEGMENT 7 — TECH STACK & ARCHITECTURE RECAP (8:30 – 9:00)

### [Show: Click on Help tab (?) — scroll to Tech Stack section]

> **"Quick tech stack recap:"**
>
> - **"Backend: Python 3 with Flask, yfinance for real market data, pandas and numpy for computation, SQLite for persistence."**
> - **"Frontend: React 18 with Vite, TradingView Lightweight Charts v5 for professional-grade candlesticks, Recharts for portfolio performance charts. Three font families — Space Grotesk, Inter, and JetBrains Mono. Dark and light theme with glassmorphism effects."**
> - **"6 REST endpoints: init, step, auto-step, jump, trigger-crash, and state."**
> - **"Every agent runs a Perceive → Reason → Act pipeline with memory buffer and performance stats."**
> - **"The entire codebase is on GitHub — public repository."**

---

## SEGMENT 8 — FINAL OUTPUT SUMMARY (9:00 – 10:00)

### [Show: Switch between tabs quickly to show the full breadth of the UI — Trades (chart + logs), Market (OHLC + indicators), Agents (rich cards + pipeline), Stats (leaderboard + risk)]

> **"So to summarize — here's what the end user experiences in our Phase 2 prototype:"**

> **"You get a live, interactive stock market simulation where 5 autonomous AI agents with ₹1,00,000 each trade a real stock using completely different strategies. The entire UI is a 3-column neon terminal design — icon sidebar on the left, live charts and data in the center, controls on the right."**

> **"You can:"**
>
> - **"Watch agents trade step-by-step or in real-time auto mode on a TradingView professional chart"**
> - **"See every decision with full reasoning through the Perceive → Reason → Act pipeline — fully transparent AI"**
> - **"Explore 5 tabs: Trades, Market data, Agent deep-dives, Statistics, and Help documentation"**
> - **"Toggle between dark neon and light theme"**
> - **"Time-travel to any previous step with the debounced scrubber"**
> - **"Trigger a whale crash and watch the cascade — pump, dump, panic selling, circuit breaker"**
> - **"See the Regulator catch manipulation in real-time with 6 compliance rules — including repeat-offender escalation that blocks serial violators"**
> - **"Track risk metrics, portfolio performance, and trade history per agent"**
> - **"Everything persisted to SQLite for post-hoc analysis"**

> **"The 7 agents collectively produce a realistic, regulated, market simulation:"**
>
> - **"The Orchestrator coordinates the clock and manages systemic risk."**
> - **"5 Trading Agents inject diverse market behaviour — each with their own Perceive → Reason → Act pipeline, memory, and performance tracking."**
> - **"The Regulator ensures integrity — catching manipulation, enforcing limits, escalating repeat offenders to a trading ban, and halting trading when it needs to."**

> **"This is Multi-Agent Stock Market AI Autonomity — a fully autonomous, goal-driven, agentic trading simulation built for DevHack 2026. Thank you for watching — Team WeWin."**

### [End screen: Hold on the full UI in dark theme for 3 seconds]

---

## TIMING BREAKDOWN

| Segment | Time | Duration |
|---------|------|----------|
| 1. Hook & Overview | 0:00 – 1:30 | 1:30 |
| 2. Core Agents Deep Dive | 1:30 – 3:30 | 2:00 |
| 3. Live Demo: Init & Steps | 3:30 – 5:30 | 2:00 |
| 4. Market Tab, Theme & Scrubber | 5:30 – 6:30 | 1:00 |
| 5. Whale Crash & Circuit Breakers | 6:30 – 8:00 | 1:30 |
| 6. Regulation Events & Audit | 8:00 – 8:30 | 0:30 |
| 7. Tech Stack Recap | 8:30 – 9:00 | 0:30 |
| 8. Final Output Summary | 9:00 – 10:00 | 1:00 |
| **TOTAL** | | **~10:00** |

---

## KEY GUIDELINES COMPLIANCE CHECKLIST

- [x] **5–10 minutes** — Script targets ~10 minutes
- [x] **Complete project overview** — Segment 1
- [x] **Agents explained with roles & interactions** — Segments 1 & 2
- [x] **Final output clearly shown** — Segments 5, 6, 8
- [x] **Last 1–2 minutes: final output preview + agent summary** — Segments 7 & 8
- [x] **At least 2 agents from PPT demonstrated** — Orchestrator + Regulator as core; all 5 trading agents shown live
- [x] **Minimum 2 agents in project** — We have 7
- [x] **Local execution demonstrated** — Entire demo runs on localhost
- [x] **No cuts, continuous recording** — Script designed for single take
- [x] **Fast-forward allowed during runtime** — Auto-run handles this naturally
- [x] **Core 2 agents highlighted (5+ agents)** — Orchestrator (Head Agent) + Regulator as core pair
- [x] **GitHub repo public and submitted** — github.com/dhanushkumar-karuppasamy/Stock_Market_Autonomity

---

## PRESENTER TIPS

1. **Keep energy high** — you're showing something cool, act like it
2. **Point at things on screen** with your cursor as you explain — hover over the sidebar tabs, agent cards, chart legend
3. **Pause for 1-2 seconds** after each major action (init, crash, theme toggle) to let viewers see the result
4. **Don't rush the crash demo** — it's the most impressive part, let it breathe
5. **Show all 5 tabs** during the demo — switch between them naturally as you narrate
6. **If auto-run takes time, narrate** — "You can see the agents making decisions in real-time..."
7. **Theme toggle is a quick wow moment** — do it once, don't dwell on it
8. **End strong** — the last 30 seconds should be confident and conclusive
9. **Agent Pipeline view** — make sure to expand at least one agent to show the ① Perceive → ② Reason → ③ Act → ④ Result visualization
