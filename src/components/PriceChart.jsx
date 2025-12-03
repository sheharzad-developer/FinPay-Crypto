import React, { useMemo } from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function PriceChart({ sparkline = [], loading = false }) {
  const { data, priceChange, priceChangePercent, isPositive } = useMemo(() => {
    if (!sparkline || !sparkline.length) {
      return { data: [], priceChange: 0, priceChangePercent: 0, isPositive: true }
    }

    const prices = sparkline.map(p => Number(p))
    const data = prices.map((p, i) => ({ x: i, value: p }))
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const priceChange = lastPrice - firstPrice
    const priceChangePercent = firstPrice !== 0 ? ((priceChange / firstPrice) * 100) : 0
    const isPositive = priceChange >= 0

    return { data, priceChange, priceChangePercent, isPositive }
  }, [sparkline])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading chart...</p>
      </div>
    )
  }

  if (!sparkline || !sparkline.length) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        <div className="text-4xl mb-2">📈</div>
        <p>No chart data available</p>
      </div>
    )
  }

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative">
      {/* Price Change Indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↗' : '↘'}
          </span>
          <div>
            <div className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500">
              {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">7d change</div>
          <div className="text-sm font-medium text-gray-700">
            ${data[data.length - 1]?.value.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 200 }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            style={{ background: 'transparent' }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis 
              dataKey="x" 
              hide={true}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              hide={true}
              domain={['dataMin - 5%', 'dataMax + 5%']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value) => [`$${value.toFixed(4)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 6, fill: isPositive ? '#10b981' : '#ef4444', strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>7 days</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Price trend</span>
        </div>
      </div>
    </div>
  )
}