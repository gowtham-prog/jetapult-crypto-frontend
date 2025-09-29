"use client"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"

function formatCurrency(v) {
  if (v == null || Number.isNaN(v)) return "$0.00"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(v)
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-md">
      <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
      <div className="text-gray-700 dark:text-gray-300" style={{ color: payload[0].stroke }}>
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  )
}

export default function PriceLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 md:h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No chart data available.
      </div>
    )
  }

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            domain={["auto", "auto"]}
            tickFormatter={(tick) => `$${Number(tick).toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="price"
            name="Price (USD)"
            stroke="#0ea5e9" /* tailwind sky-600 */
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 1.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
