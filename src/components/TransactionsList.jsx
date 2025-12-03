import React from 'react'
import { useWallet } from '../context/WalletContext'

export default function TransactionsList({ onEdit, onDelete }) {
  const { transactions } = useWallet()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-xl border border-white/20">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No transactions yet</h3>
          <p className="text-sm text-gray-500">Start by creating your first transaction</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Coin</th>
              <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
              <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">To Address</th>
              <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Status</th>
              <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={tx.id}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap font-medium text-gray-700">
                  {formatDate(tx.date)}
                </td>
                <td className="py-3 px-3 sm:px-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                    tx.type === 'send' 
                      ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200' 
                      : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                  }`}>
                    <span className="mr-1">{tx.type === 'send' ? '→' : '←'}</span>
                    {tx.type === 'send' ? 'Send' : 'Receive'}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-800">{tx.symbol}</td>
                <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap font-semibold text-gray-800">
                  {tx.amount} {tx.symbol}
                </td>
                <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 font-mono hidden md:table-cell">
                  {tx.toAddress ? (
                    <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      {tx.toAddress.length > 15 ? tx.toAddress.substring(0, 15) + '...' : tx.toAddress}
                    </span>
                  ) : '—'}
                </td>
                <td className="py-3 px-3 sm:px-4 hidden sm:table-cell">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    {tx.status || 'completed'}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(tx)}
                      className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

