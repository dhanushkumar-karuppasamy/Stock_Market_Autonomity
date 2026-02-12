"""
Base trading agent class.
Every concrete agent inherits from TradingAgent and implements `decide()`.
"""


class TradingAgent:
    """
    Abstract base class for all autonomous trading agents.

    Attributes:
        name                   – human-readable agent name
        cash                   – available cash balance
        positions              – dict {ticker: quantity}
        avg_cost               – dict {ticker: average_cost_basis}
        portfolio_value_history – list of portfolio values over time
        last_action            – last action dict or None
        last_reason            – human-readable explanation of last decision
    """

    def __init__(self, name: str, initial_cash: float = 100_000.0):
        self.name = name
        self.cash = initial_cash
        self.initial_cash = initial_cash
        self.positions: dict[str, int] = {}
        self.avg_cost: dict[str, float] = {}
        self.portfolio_value_history: list[float] = []
        self.last_action: dict | None = None
        self.last_reason: str = ""
        self._state: dict | None = None

    # ------------------------------------------------------------------ #
    # Interface methods (override in subclasses)
    # ------------------------------------------------------------------ #

    def observe_market_state(self, state: dict):
        """Store the current market state for use in `decide()`."""
        self._state = state

    def decide(self) -> dict:
        """
        Decide on a trading action.

        Returns:
            dict with keys:
                type     – "BUY" | "SELL" | "HOLD"
                ticker   – str
                quantity – int  (>= 0)
        """
        raise NotImplementedError("Subclasses must implement decide()")

    def update_after_step(self, reward: float, new_state: dict):
        """Hook called after each simulation step (for adaptation logic)."""
        pass

    # ------------------------------------------------------------------ #
    # Portfolio helpers
    # ------------------------------------------------------------------ #

    def get_portfolio_value(self, current_price: float, ticker: str = "") -> float:
        """
        Compute total portfolio value = cash + sum(positions * current_price).
        For single-ticker simulation, pass the ticker or leave blank
        (will sum all positions).
        """
        holdings_value = 0.0
        for t, qty in self.positions.items():
            if ticker and t != ticker:
                continue
            holdings_value += qty * current_price
        return self.cash + holdings_value

    def execute_action(self, action: dict, current_price: float):
        """
        Actually apply a trade to cash / positions.
        Assumes the action has already been reviewed by the regulator.
        """
        action_type = action.get("type", "HOLD")
        ticker = action.get("ticker", "")
        quantity = action.get("quantity", 0)

        if action_type == "BUY" and quantity > 0:
            cost = quantity * current_price
            if cost <= self.cash:
                self.cash -= cost
                prev_qty = self.positions.get(ticker, 0)
                prev_cost = self.avg_cost.get(ticker, 0.0)
                new_qty = prev_qty + quantity
                # Update average cost basis
                if new_qty > 0:
                    self.avg_cost[ticker] = (
                        (prev_cost * prev_qty + current_price * quantity) / new_qty
                    )
                self.positions[ticker] = new_qty

        elif action_type == "SELL" and quantity > 0:
            current_qty = self.positions.get(ticker, 0)
            sell_qty = min(quantity, current_qty)  # cannot sell more than held
            if sell_qty > 0:
                self.cash += sell_qty * current_price
                self.positions[ticker] = current_qty - sell_qty
                if self.positions[ticker] == 0:
                    self.positions.pop(ticker, None)
                    self.avg_cost.pop(ticker, None)

        self.last_action = action

    def to_dict(self, current_price: float, ticker: str = "") -> dict:
        """Serialise agent state for the frontend."""
        pv = self.get_portfolio_value(current_price, ticker)
        return {
            "name": self.name,
            "cash": round(self.cash, 2),
            "positions": dict(self.positions),
            "portfolio_value": round(pv, 2),
            "last_action": self.last_action,
            "last_reason": self.last_reason,
        }
