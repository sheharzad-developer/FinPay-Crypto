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
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded shadow">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Transactions</h2>
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600">Date</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600">Type</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600">Coin</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600 hidden md:table-cell">To Address</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600 hidden sm:table-cell">Status</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="py-2 px-2 sm:px-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    tx.type === 'send' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {tx.type === 'send' ? 'Send' : 'Receive'}
                  </span>
                </td>
                <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium">{tx.symbol}</td>
                <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap">{tx.amount} {tx.symbol}</td>
                <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-600 font-mono hidden md:table-cell">
                  {tx.toAddress ? (tx.toAddress.length > 15 ? tx.toAddress.substring(0, 15) + '...' : tx.toAddress) : '—'}
                </td>
                <td className="py-2 px-2 sm:px-3 hidden sm:table-cell">
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    {tx.status || 'completed'}
                  </span>
                </td>
                <td className="py-2 px-2 sm:px-3">
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => onEdit(tx)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
                    >
                      Delete
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

