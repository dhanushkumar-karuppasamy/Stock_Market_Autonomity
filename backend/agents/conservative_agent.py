"""
Conservative Agent – low-risk, small positions, only trades in calm markets.
"""

from agents.base_agent import TradingAgent


class ConservativeAgent(TradingAgent):
    """
    Strategy:
    - Only trades when rolling volatility is below a threshold (calm market).
    - Buys when price is below SMA50 AND SMA20 > SMA50 (mild uptrend,
      price not overextended).
    - Uses small position sizes (5-10 % of cash).
    - Implements an internal stop-loss: sells if position drops more than
      3 % below average cost.
    """

    VOLATILITY_THRESHOLD = 0.02   # max acceptable rolling volatility
    POSITION_FRACTION = 0.07      # 7 % of cash per trade
    STOP_LOSS_PCT = 0.03          # 3 % stop loss

    def decide(self) -> dict:
        state = self._state
        if state is None:
            return {"type": "HOLD", "ticker": "", "quantity": 0}

        bar = state["current_bar"]
        ticker = bar.get("ticker", "")
        close = bar["Close"]
        sma20 = bar.get("SMA20", close)
        sma50 = bar.get("SMA50", close)
        vol = bar.get("Volatility", 0)

        held_qty = self.positions.get(ticker, 0)
        avg = self.avg_cost.get(ticker, 0)

        # ---------- Stop-loss check ----------
        if held_qty > 0 and avg > 0:
            if close < avg * (1 - self.STOP_LOSS_PCT):
                self.last_reason = (
                    f"Stop-loss triggered: price {close:.2f} < "
                    f"{avg*(1-self.STOP_LOSS_PCT):.2f} "
                    f"(avg_cost {avg:.2f} - {self.STOP_LOSS_PCT*100}%)"
                )
                return {"type": "SELL", "ticker": ticker, "quantity": held_qty}

        # ---------- Volatility filter ----------
        if vol > self.VOLATILITY_THRESHOLD:
            self.last_reason = (
                f"HOLD – volatility {vol:.4f} exceeds threshold "
                f"{self.VOLATILITY_THRESHOLD}"
            )
            return {"type": "HOLD", "ticker": ticker, "quantity": 0}

        # ---------- Entry condition ----------
        if close < sma50 and sma20 > sma50 and held_qty == 0:
            affordable = int(
                (self.cash * self.POSITION_FRACTION) / close
            ) if close > 0 else 0
            if affordable > 0:
                self.last_reason = (
                    f"Low volatility ({vol:.4f}), price {close:.2f} < SMA50 "
                    f"{sma50:.2f}, SMA20 {sma20:.2f} > SMA50 → small long entry"
                )
                return {"type": "BUY", "ticker": ticker, "quantity": affordable}

        self.last_reason = "HOLD – conditions not met for conservative entry"
        return {"type": "HOLD", "ticker": ticker, "quantity": 0}
