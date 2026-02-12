"""
Simulation orchestrator.
Glues together the market, agents, regulator, and logger into
a step-by-step simulation loop.
"""

from market.market import MarketEnvironment
from agents.conservative_agent import ConservativeAgent
from agents.momentum_agent import MomentumAgent
from agents.mean_reversion_agent import MeanReversionAgent
from agents.noise_trader import NoiseTrader
from agents.adversarial_agent import AdversarialAgent
from regulator.regulator import RegulatorAgent
from logging_utils.logger import SimulationLogger


class Simulation:
    """
    Stateful, in-memory simulation of a multi-agent trading ecosystem.

    Lifecycle:
        1. init_simulation(ticker, period, interval)  → downloads data, creates agents
        2. step_simulation()  → advance one bar, each agent decides & is reviewed
        3. get_snapshot()     → return full state for the frontend
    """

    def __init__(self):
        self.market: MarketEnvironment | None = None
        self.agents: list = []
        self.regulator: RegulatorAgent | None = None
        self.logger = SimulationLogger()
        self.current_step = 0
        self.max_steps = 0
        self.ticker: str = ""
        self.period: str = ""
        self.interval: str = ""
        self.finished = False
        self.price_history: list[dict] = []

    # ------------------------------------------------------------------ #
    # Initialisation
    # ------------------------------------------------------------------ #

    def init_simulation(self, ticker: str, period: str, interval: str) -> dict:
        """
        Download market data, create environment, agents, and regulator.
        Returns the initial snapshot for the frontend.
        """
        # Create market environment (may raise ValueError on bad data)
        self.market = MarketEnvironment(ticker, period, interval)
        self.ticker = ticker
        self.period = period
        self.interval = interval
        self.current_step = 0
        self.max_steps = self.market.total_bars
        self.finished = False

        # Reset logger
        self.logger.reset()

        # Create agents with default cash
        self.agents = [
            ConservativeAgent("Conservative", initial_cash=100_000.0),
            MomentumAgent("Momentum", initial_cash=100_000.0),
            MeanReversionAgent("MeanReversion", initial_cash=100_000.0),
            NoiseTrader("NoiseTrader", initial_cash=100_000.0),
            AdversarialAgent("Adversarial", initial_cash=100_000.0),
        ]

        # Regulator
        self.regulator = RegulatorAgent()

        # Seed price history with initial bar
        state = self.market.get_state()
        self.price_history = [state["current_bar"]]

        # Record initial portfolio values
        close = state["current_bar"]["Close"]
        for agent in self.agents:
            pv = agent.get_portfolio_value(close, self.ticker)
            agent.portfolio_value_history.append(pv)

        return self.get_snapshot()

    # ------------------------------------------------------------------ #
    # Step
    # ------------------------------------------------------------------ #

    def step_simulation(self) -> dict:
        """
        Advance the simulation by one bar.

        For each agent:
          1. observe current state
          2. decide action
          3. regulator reviews
          4. execute if approved / warned
          5. log everything
        Then advance the market.
        """
        if self.market is None:
            return {"error": "Simulation not initialised. Call /api/init first."}

        if self.finished or self.market.is_done():
            self.finished = True
            return self.get_snapshot()

        state = self.market.get_state()
        bar = state["current_bar"]
        close = bar["Close"]

        # Inject ticker into bar so agents can reference it
        bar["ticker"] = self.ticker

        for agent in self.agents:
            # 1. Observe
            agent.observe_market_state(state)

            # 2. Decide
            action = agent.decide()
            action.setdefault("ticker", self.ticker)

            # 3. Regulator review
            agent_state = {
                "cash": agent.cash,
                "positions": dict(agent.positions),
                "portfolio_value": agent.get_portfolio_value(close, self.ticker),
            }
            review = self.regulator.review_trade(
                agent_name=agent.name,
                action=action,
                agent_state=agent_state,
                market_state=bar,
                current_step=self.current_step,
            )

            reg_decision = review["decision"]
            reg_reason = review["reason"]
            adjusted = review["adjusted_action"]

            # 4. Execute trade (only if not BLOCKED)
            if reg_decision in ("APPROVE", "WARN"):
                agent.execute_action(adjusted, close)

            # 5. Compute new portfolio value
            pv = agent.get_portfolio_value(close, self.ticker)
            agent.portfolio_value_history.append(pv)

            # 6. Log trade
            self.logger.log_trade(
                step=self.current_step,
                agent_name=agent.name,
                action=adjusted.get("type", "HOLD"),
                price=close,
                quantity=adjusted.get("quantity", 0),
                portfolio_value=pv,
                reason=agent.last_reason,
                decision=reg_decision,
                decision_reason=reg_reason,
            )

            # 7. Log regulation event if WARN or BLOCK
            if reg_decision in ("WARN", "BLOCK"):
                self.logger.log_regulation_event(
                    step=self.current_step,
                    agent_name=agent.name,
                    rule_name="compliance_review",
                    decision=reg_decision,
                    explanation=reg_reason,
                )

            # 8. Reward / adaptation callback
            reward = 0.0
            if len(agent.portfolio_value_history) >= 2:
                reward = (
                    agent.portfolio_value_history[-1]
                    - agent.portfolio_value_history[-2]
                )
            agent.update_after_step(reward, state)

        # Advance market
        new_state, _, info = self.market.step({})
        self.current_step = self.market.current_step

        # Append new price bar to history
        new_bar = new_state["current_bar"]
        self.price_history.append(new_bar)

        if info.get("finished"):
            self.finished = True

        return self.get_snapshot()

    # ------------------------------------------------------------------ #
    # Snapshot for frontend
    # ------------------------------------------------------------------ #

    def get_snapshot(self) -> dict:
        """
        Build a JSON-serialisable snapshot of the full simulation state.
        """
        if self.market is None:
            return {"error": "Simulation not initialised."}

        state = self.market.get_state()
        close = state["current_bar"]["Close"]

        agents_data = [
            agent.to_dict(close, self.ticker) for agent in self.agents
        ]

        return {
            "step": self.current_step,
            "max_steps": self.max_steps,
            "ticker": self.ticker,
            "period": self.period,
            "interval": self.interval,
            "finished": self.finished,
            "current_bar": state["current_bar"],
            "price_history": self.price_history,
            "agents": agents_data,
            "trade_log": self.logger.get_trade_log(),
            "regulation_log": self.logger.get_regulation_log(),
        }
