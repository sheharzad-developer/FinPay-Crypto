import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'
import BalanceCard from '../components/BalanceCard.jsx'
import PriceChart from '../components/PriceChart'
import TransferModal from '../components/TransferModal'
import TransactionsList from '../components/TransactionsList'
import TransactionForm from '../components/TransactionForm'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { balances, prices, loadingPrices, deleteTransaction } = useWallet()
  const [openTransferModal, setOpenTransferModal] = useState(false)
  const [openTransactionForm, setOpenTransactionForm] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState('bitcoin')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [transactionFormDefaults, setTransactionFormDefaults] = useState({ coinKey: null, type: 'send' })

  const handleCreateTransaction = () => {
    setEditingTransaction(null)
    setTransactionFormDefaults({ coinKey: null, type: 'send' })
    setOpenTransactionForm(true)
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setOpenTransactionForm(true)
  }

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  const handleReceive = (coinKey) => {
    setSelectedCoin(coinKey)
    setEditingTransaction(null)
    setTransactionFormDefaults({ coinKey, type: 'receive' })
    setOpenTransactionForm(true)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/signin')
  }

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Enhanced Header */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-2xl font-bold text-white">₿</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FinPay
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {user?.name ? `Welcome, ${user.name}` : 'Crypto Wallet'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handleSignOut}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
            <button
              onClick={handleCreateTransaction}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span className="hidden sm:inline">New Transaction</span>
              <span className="sm:hidden">New</span>
            </button>
            <button
              onClick={() => { setSelectedCoin('bitcoin'); setOpenTransferModal(true) }}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>Quick Send</span>
            </button>
          </div>
        </div>
      </header>

      {/* Balance Cards Section */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></span>
          Portfolio Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Object.keys(balances).map((key, index) => (
            <div
              key={key}
              className="transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BalanceCard
                coinKey={key}
                coin={balances[key]}
                market={prices[key]}
                onSend={() => { setSelectedCoin(key); setOpenTransferModal(true) }}
                onReceive={() => handleReceive(key)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Price Charts Section */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></span>
          Market Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {Object.keys(balances).map((key, index) => (
            <div
              key={key}
              className="bg-white/80 backdrop-blur-lg p-5 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">
                    {key === 'bitcoin' ? '₿' : key === 'ethereum' ? 'Ξ' : '$'}
                  </span>
                  {balances[key].symbol} Price Chart
                </h3>
                <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">7D</div>
              </div>
              <PriceChart sparkline={prices[key]?.sparkline_in_7d?.price} loading={loadingPrices} />
            </div>
          ))}
        </div>
      </section>

      {/* Transactions Section */}
      <section className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></span>
          Transaction History
        </h2>
        <TransactionsList
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </section>

      <TransferModal
        open={openTransferModal}
        onClose={() => setOpenTransferModal(false)}
        coinKey={selectedCoin}
      />

      <TransactionForm
        open={openTransactionForm}
        onClose={() => {
          setOpenTransactionForm(false)
          setEditingTransaction(null)
          setTransactionFormDefaults({ coinKey: null, type: 'send' })
        }}
        transaction={editingTransaction}
        defaultCoinKey={transactionFormDefaults.coinKey}
        defaultType={transactionFormDefaults.type}
      />
    </div>
  )
}