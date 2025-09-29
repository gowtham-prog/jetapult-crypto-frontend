"use client"
export default function CoinsTable({ coins, selectedId, onSelect }) {
  const formatPrice = (price) =>
    price == null
      ? "N/A"
      : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(price)

  const formatPct = (pct) => {
    if (pct == null || Number.isNaN(+pct)) return <span className="text-gray-500">N/A</span>
    const v = +pct
    const positive = v >= 0
    return (
      <span className={positive ? "text-green-600" : "text-red-600"}>
        {positive ? "+" : ""}
        {v.toFixed(2)}%
      </span>
    )
  }

  const formatVol = (v) => {
    if (v == null) return "N/A"
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
    if (v >= 1e3) return `$${(v / 1e3).toFixed(2)}K`
    return `$${Number(v).toLocaleString()}`
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Top 10 Cryptocurrencies</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                Rank
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                Name
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                Price
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300 hidden md:table-cell"
              >
                24h
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300 hidden lg:table-cell"
              >
                Volume (24h)
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300 hidden md:table-cell"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {coins.map((coin) => {
              const id = coin.coingecko_id || coin.id || coin.symbol
              const selected = selectedId === id
              return (
                <tr
                  key={id}
                  onClick={() => onSelect(coin)}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors ${selected ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}
                >
                  <td className="px-4 sm:px-6 py-3 text-gray-900 dark:text-gray-100">{coin.market_cap_rank}</td>
                  <td className="px-2 sm:px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={`https://assets.coincap.io/assets/icons/${coin.symbol?.toLowerCase()}@2x.png`}
                        alt={coin.symbol ? `${coin.symbol.toUpperCase()} icon` : "coin icon"}
                        onError={(e) => {
                          const t = e.target
                          t.onerror = null
                          t.src = "https://placehold.co/32x32/111827/e5e7eb?text=%F0%9F%92%B0"
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{coin.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{coin.symbol?.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-900 dark:text-gray-100">{formatPrice(coin.last_price)}</td>
                  <td className="px-4 sm:px-6 py-3 hidden md:table-cell">{formatPct(coin.percent_change_24h)}</td>
                  <td className="px-4 sm:px-6 py-3 hidden lg:table-cell text-gray-900 dark:text-gray-100">
                    {formatVol(coin.volume)}
                  </td>
                  <td className="px-4 sm:px-6 py-3 hidden md:table-cell">
                    <button
                      className="rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(coin)
                      }}
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
