"""
In-memory simulation logger.
Maintains trade logs and regulation logs for full audit trail.
"""

from datetime import datetime


class SimulationLogger:
    """
    Captures every trade decision and regulatory event for post-hoc analysis.
    All data is stored in-memory (no database for hackathon prototype).
    """

    def __init__(self):
        self.trade_log: list[dict] = []
        self.regulation_log: list[dict] = []

    def reset(self):
        """Clear all logs."""
        self.trade_log.clear()
        self.regulation_log.clear()

    # ------------------------------------------------------------------ #
    # Trade logging
    # ------------------------------------------------------------------ #

    def log_trade(
        self,
        step: int,
        agent_name: str,
        action: str,
        price: float,
        quantity: int,
        portfolio_value: float,
        reason: str,
        decision: str,
        decision_reason: str,
    ):
        """
        Record a single trade decision (whether executed or blocked).

        Args:
            step:             simulation step index
            agent_name:       name of the trading agent
            action:           "BUY" / "SELL" / "HOLD"
            price:            market price at time of trade
            quantity:         number of shares
            portfolio_value:  agent portfolio value after trade
            reason:           agent's human-readable reasoning
            decision:         regulator decision ("APPROVE"/"WARN"/"BLOCK")
            decision_reason:  regulator's explanation
        """
        self.trade_log.append({
            "timestamp": datetime.now().isoformat(),
            "step": step,
            "agent_name": agent_name,
            "action": action,
            "price": round(price, 2),
            "quantity": quantity,
            "portfolio_value": round(portfolio_value, 2),
            "agent_reason": reason,
            "regulator_decision": decision,
            "regulator_reason": decision_reason,
        })

    # ------------------------------------------------------------------ #
    # Regulation event logging
    # ------------------------------------------------------------------ #

    def log_regulation_event(
        self,
        step: int,
        agent_name: str,
        rule_name: str,
        decision: str,
        explanation: str,
    ):
        """
        Record a regulation event (warning or block).

        Args:
            step:        simulation step
            agent_name:  agent involved
            rule_name:   which compliance rule was triggered
            decision:    "WARN" or "BLOCK"
            explanation: detailed explanation of the violation
        """
        self.regulation_log.append({
            "timestamp": datetime.now().isoformat(),
            "step": step,
            "agent_name": agent_name,
            "rule_name": rule_name,
            "decision": decision,
            "explanation": explanation,
        })

    # ------------------------------------------------------------------ #
    # Getters
    # ------------------------------------------------------------------ #

    def get_trade_log(self) -> list[dict]:
        return list(self.trade_log)

    def get_regulation_log(self) -> list[dict]:
        return list(self.regulation_log)
