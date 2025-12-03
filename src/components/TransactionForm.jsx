import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { useWallet } from '../context/WalletContext'

Modal.setAppElement('#root')

export default function TransactionForm({ open, onClose, transaction = null, defaultCoinKey = null, defaultType = 'send' }) {
  const { balances, createTransaction, updateTransaction } = useWallet()
  const [coinKey, setCoinKey] = useState('bitcoin')
  const [amount, setAmount] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [type, setType] = useState('send')
  const [status, setStatus] = useState(null)

  const isEditMode = !!transaction
  const coin = balances[coinKey]

  useEffect(() => {
    if (transaction) {
      setCoinKey(transaction.coinKey)
      setAmount(transaction.amount.toString())
      setToAddress(transaction.toAddress || '')
      setType(transaction.type)
    } else {
      setCoinKey(defaultCoinKey || 'bitcoin')
      setAmount('')
      setToAddress('')
      setType(defaultType)
    }
    setStatus(null)
  }, [transaction, open, defaultCoinKey, defaultType])

  function handleSubmit() {
    if (!amount || Number(amount) <= 0) {
      return setStatus({ error: 'Enter a valid amount' })
    }

    if (type === 'send' && Number(amount) > coin.balance) {
      return setStatus({ error: 'Insufficient balance' })
    }

    if (type === 'send' && !toAddress.trim()) {
      return setStatus({ error: 'Enter recipient address' })
    }

    if (isEditMode) {
      const result = updateTransaction(transaction.id, {
        coinKey,
        amount,
        toAddress: type === 'send' ? toAddress : transaction.toAddress,
        type,
        date: new Date().toISOString()
      })
      if (result.success) {
        setStatus({ success: 'Transaction updated successfully' })
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setStatus({ error: result.error || 'Update failed' })
      }
    } else {
      const result = createTransaction(coinKey, amount, toAddress, type)
      if (result.success) {
        setStatus({ success: 'Transaction created successfully' })
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setStatus({ error: result.error || 'Creation failed' })
      }
    }
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel={isEditMode ? 'Edit Transaction' : 'Create Transaction'}
      className="bg-white/95 backdrop-blur-lg p-5 sm:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto w-full border border-white/20"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">{isEditMode ? '✏️' : '➕'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {isEditMode ? 'Edit Transaction' : 'Create Transaction'}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 font-medium"
            disabled={isEditMode}
          >
            <option value="send">Send</option>
            <option value="receive">Receive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Coin</label>
          <select
            value={coinKey}
            onChange={e => setCoinKey(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 font-medium"
            disabled={isEditMode}
          >
            {Object.keys(balances).map(key => (
              <option key={key} value={key}>
                {balances[key].symbol}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 font-medium"
            placeholder="0.01"
          />
          <div className="text-xs text-gray-500 mt-2 font-medium bg-gray-50 px-3 py-2 rounded-lg">
            💰 Balance: {coin?.balance} {coin?.symbol}
          </div>
        </div>

        {type === 'send' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To Address
            </label>
            <input
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 font-mono text-sm"
              placeholder="0x..."
            />
          </div>
        )}

        {status?.error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl font-medium flex items-center gap-2">
            <span>⚠️</span>
            {status.error}
          </div>
        )}
        {status?.success && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl font-medium flex items-center gap-2">
            <span>✅</span>
            {status.success}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {isEditMode ? '✨ Update' : '✨ Create'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

