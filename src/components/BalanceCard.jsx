import React from 'react'

const coinIcons = {
  bitcoin: '₿',
  ethereum: 'Ξ',
  tether: '$'
}

const coinColors = {
  bitcoin: 'from-orange-500 to-amber-600',
  ethereum: 'from-blue-500 to-indigo-600',
  tether: 'from-green-500 to-emerald-600'
}

export default function BalanceCard({ coinKey, coin, market, onSend, onReceive }) {
  const price = market?.current_price ?? '—'
  const usdValue = (price === '—') ? '—' : (Number(price) * Number(coin.balance)).toFixed(2)
  const priceChange = market?.price_change_percentage_7d_in_currency ?? 0
  const isPositive = priceChange >= 0
  const gradientClass = coinColors[coinKey] || 'from-gray-500 to-gray-600'

  return (
    <div className="group bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 flex flex-col justify-between min-h-[180px] transform hover:-translate-y-1 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClass} opacity-10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        {/* Coin Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl font-bold text-white">{coinIcons[coinKey] || coin.symbol}</span>
          </div>
          {priceChange !== 0 && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span>{isPositive ? '↗' : '↘'}</span>
              <span>{Math.abs(priceChange).toFixed(2)}%</span>
            </div>
          )}
        </div>

        {/* Balance Info */}
        <div className="mb-1">
          <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1">{coin.symbol}</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {coin.balance} <span className="text-lg">{coin.symbol}</span>
          </div>
          <div className="text-base sm:text-lg font-semibold text-gray-700">
            ≈ ${usdValue === '—' ? '—' : parseFloat(usdValue).toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-4 flex gap-2">
        <button
          onClick={onSend}
          className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1"
        >
          <span>→</span>
          <span>Send</span>
        </button>
        <button
          onClick={onReceive}
          className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1"
        >
          <span>←</span>
          <span>Receive</span>
        </button>
      </div>
    </div>
  )
}