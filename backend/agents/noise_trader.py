"""
Noise Trader – random actions to inject realistic market noise.
"""

import random
from agents.base_agent import TradingAgent


class NoiseTrader(TradingAgent):
    """
    Strategy:
    - With a small probability each step, randomly BUY or SELL a small qty.
    - Adds realistic noise to the simulation.
    - Position sizes are very small (1-3 % of cash).
    """

    TRADE_PROBABILITY = 0.15   # 15 % chance of trading each step
    POSITION_FRACTION = 0.02   # 2 % of cash

    def decide(self) -> dict:
        state = self._state
        if state is None:
            return {"type": "HOLD", "ticker": "", "quantity": 0}

        bar = state["current_bar"]
        ticker = bar.get("ticker", "")
        close = bar["Close"]
        held_qty = self.positions.get(ticker, 0)

        if random.random() > self.TRADE_PROBABILITY:
            self.last_reason = "No action this step (random skip)"
            return {"type": "HOLD", "ticker": ticker, "quantity": 0}

        # Random direction
        if random.random() < 0.5:
            # BUY
            affordable = int(
                (self.cash * self.POSITION_FRACTION) / close
            ) if close > 0 else 0
            if affordable > 0:
                qty = random.randint(1, max(1, affordable))
                self.last_reason = f"Random noise BUY of {qty} shares"
                return {"type": "BUY", "ticker": ticker, "quantity": qty}
        else:
            # SELL
            if held_qty > 0:
                sell_qty = random.randint(1, max(1, held_qty))
                self.last_reason = f"Random noise SELL of {sell_qty} shares"
                return {"type": "SELL", "ticker": ticker, "quantity": sell_qty}

        self.last_reason = "Random action considered but no position to sell / insufficient cash"
        return {"type": "HOLD", "ticker": ticker, "quantity": 0}
