"""
Market engine module.
Downloads real market data via yfinance, computes technical indicators,
and provides a step-based replay environment for the simulation.
"""

import yfinance as yf
import pandas as pd
import numpy as np


def download_market_data(ticker: str, period: str, interval: str) -> pd.DataFrame:
    """
    Download historical market data using yfinance.

    Args:
        ticker:   e.g. "AAPL", "NSEI", "RELIANCE.NS"
        period:   e.g. "1d", "5d", "1mo"
        interval: e.g. "5m", "15m", "1h", "1d"

    Returns:
        pandas DataFrame with columns:
        Datetime, Open, High, Low, Close, Volume

    Raises:
        ValueError if no data could be downloaded.
    """
    ticker_obj = yf.Ticker(ticker)
    df = ticker_obj.history(period=period, interval=interval)

    if df is None or df.empty:
        raise ValueError(
            f"No data downloaded for ticker='{ticker}', "
            f"period='{period}', interval='{interval}'. "
            "Check that the ticker symbol is valid and yfinance is reachable."
        )

    # Reset index so that the datetime becomes a regular column
    df = df.reset_index()

    # Normalise the datetime column name
    if "Date" in df.columns:
        df.rename(columns={"Date": "Datetime"}, inplace=True)
    elif "index" in df.columns:
        df.rename(columns={"index": "Datetime"}, inplace=True)

    # Keep only the columns we care about
    keep = [c for c in ["Datetime", "Open", "High", "Low", "Close", "Volume"] if c in df.columns]
    df = df[keep].copy()

    return df


class MarketEnvironment:
    """
    Historical-replay market environment.

    On init it downloads data, pre-computes technical indicators,
    and then exposes a step-based interface so the simulation can
    advance one bar at a time.
    """

    def __init__(self, ticker: str, period: str, interval: str):
        self.ticker = ticker
        self.period = period
        self.interval = interval
        self.current_step = 0

        # Download raw data
        self.df = download_market_data(ticker, period, interval)

        # ---------- Pre-compute technical indicators ----------
        close = self.df["Close"]

        # Simple Moving Averages
        self.df["SMA20"] = close.rolling(window=20, min_periods=1).mean()
        self.df["SMA50"] = close.rolling(window=50, min_periods=1).mean()

        # Bollinger Bands (20-period)
        rolling_std = close.rolling(window=20, min_periods=1).std()
        self.df["BB_MID"] = self.df["SMA20"]
        self.df["BB_UP"] = self.df["SMA20"] + 2 * rolling_std
        self.df["BB_LOW"] = self.df["SMA20"] - 2 * rolling_std

        # Rolling volatility – 20-period std of log returns
        log_returns = np.log(close / close.shift(1))
        self.df["Volatility"] = log_returns.rolling(window=20, min_periods=1).std()

        # Fill any remaining NaNs with 0
        self.df.fillna(0, inplace=True)

        # Total number of bars available
        self.total_bars = len(self.df)

    # ------------------------------------------------------------------ #
    # helpers
    # ------------------------------------------------------------------ #

    def _bar_to_dict(self, idx: int) -> dict:
        """Convert a single DataFrame row to a plain dict."""
        row = self.df.iloc[idx]
        d = row.to_dict()
        # Convert Timestamp / datetime objects to ISO strings for JSON
        if "Datetime" in d and hasattr(d["Datetime"], "isoformat"):
            d["Datetime"] = d["Datetime"].isoformat()
        return d

    # ------------------------------------------------------------------ #
    # public API
    # ------------------------------------------------------------------ #

    def get_state(self) -> dict:
        """
        Return the current market state.

        Returns dict:
            current_bar  – dict of the current row (price + indicators)
            recent_window – list of dicts for the last 50 bars
            step         – current step index
            total_bars   – total available bars
        """
        current_bar = self._bar_to_dict(self.current_step)

        start = max(0, self.current_step - 49)
        recent = [
            self._bar_to_dict(i)
            for i in range(start, self.current_step + 1)
        ]

        return {
            "current_bar": current_bar,
            "recent_window": recent,
            "step": self.current_step,
            "total_bars": self.total_bars,
        }

    def step(self, actions_by_agent: dict) -> tuple:
        """
        Advance the market by one bar.

        Args:
            actions_by_agent: dict mapping agent_name -> action_dict
                              (used externally; market itself is replay-only)

        Returns:
            (new_state, rewards_dict, info)
            rewards are computed externally by the simulation orchestrator.
        """
        if self.current_step >= self.total_bars - 1:
            return self.get_state(), {}, {"finished": True}

        self.current_step += 1
        new_state = self.get_state()
        return new_state, {}, {"finished": False}

    def is_done(self) -> bool:
        return self.current_step >= self.total_bars - 1
