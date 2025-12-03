import React from 'react'

export default function BalanceCard({ coinKey, coin, market, onSend, onReceive }) {
  const price = market?.current_price ?? '—'
  const usdValue = (price === '—') ? '—' : (Number(price) * Number(coin.balance)).toFixed(2)

  return (
    <div className="bg-white p-3 sm:p-4 rounded shadow flex flex-col justify-between min-h-[140px]">
      <div>
        <div className="text-xs sm:text-sm text-gray-500">{coin.symbol}</div>
        <div className="text-lg sm:text-xl font-semibold mt-1">{coin.balance} {coin.symbol}</div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">≈ ${usdValue} USD</div>
      </div>
      <div className="mt-3 sm:mt-4 flex gap-2">
        <button onClick={onSend} className="flex-1 px-2 sm:px-3 py-1.5 sm:py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-xs sm:text-sm">Send</button>
        <button onClick={onReceive} className="flex-1 px-2 sm:px-3 py-1.5 sm:py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs sm:text-sm">Receive</button>
      </div>
    </div>
  )
}