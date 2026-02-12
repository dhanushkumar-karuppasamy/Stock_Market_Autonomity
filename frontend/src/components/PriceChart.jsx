import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function PriceChart({ priceHistory }) {
  if (!priceHistory || priceHistory.length === 0) {
    return <div className="card"><h2>Price Chart</h2><p>No data yet.</p></div>;
  }

  // Build chart data – show last 200 bars max for performance
  const data = priceHistory.slice(-200).map((bar, i) => ({
    idx: i,
    time: bar.Datetime ? bar.Datetime.slice(11, 16) || bar.Datetime.slice(0, 10) : i,
    Close: parseFloat(bar.Close?.toFixed(2)),
    SMA20: parseFloat((bar.SMA20 || 0).toFixed(2)),
    SMA50: parseFloat((bar.SMA50 || 0).toFixed(2)),
    BB_UP: parseFloat((bar.BB_UP || 0).toFixed(2)),
    BB_LOW: parseFloat((bar.BB_LOW || 0).toFixed(2)),
  }));

  return (
    <div className="card">
      <h2>Price Chart</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#1a1d2e', border: '1px solid #3a3f55', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="Close" stroke="#3b82f6" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="SMA20" stroke="#22c55e" dot={false} strokeWidth={1} />
          <Line type="monotone" dataKey="SMA50" stroke="#f59e0b" dot={false} strokeWidth={1} />
          <Line type="monotone" dataKey="BB_UP" stroke="#ef444488" dot={false} strokeWidth={1} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="BB_LOW" stroke="#ef444488" dot={false} strokeWidth={1} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
