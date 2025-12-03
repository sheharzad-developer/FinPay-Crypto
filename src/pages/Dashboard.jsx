import React, { useState } from 'react'
import { useWallet } from '../context/WalletContext'
import BalanceCard from '../components/BalanceCard.jsx'
import PriceChart from '../components/PriceChart'
import TransferModal from '../components/TransferModal'
import TransactionsList from '../components/TransactionsList'
import TransactionForm from '../components/TransactionForm'

export default function Dashboard() {
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

  return (
    <div className="w-full p-3 sm:p-4 md:p-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-semibold">FinPay — Crypto Wallet</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleCreateTransaction}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 text-sm sm:text-base"
          >
            <span className="hidden sm:inline">+ New Transaction</span>
            <span className="sm:hidden">+ New</span>
          </button>
          <button
            onClick={() => { setSelectedCoin('bitcoin'); setOpenTransferModal(true) }}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 text-sm sm:text-base"
          >
            Quick Send
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {Object.keys(balances).map(key => (
          <BalanceCard
            key={key}
            coinKey={key}
            coin={balances[key]}
            market={prices[key]}
            onSend={() => { setSelectedCoin(key); setOpenTransferModal(true) }}
            onReceive={() => handleReceive(key)}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {Object.keys(balances).map(key => (
          <div key={key} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base sm:text-lg text-gray-800">{balances[key].symbol} Price Chart</h3>
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">7D</div>
            </div>
            <PriceChart sparkline={prices[key]?.sparkline_in_7d?.price} loading={loadingPrices} />
          </div>
        ))}
      </section>

      <section className="mb-4 sm:mb-6">
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