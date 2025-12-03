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
      className="bg-white p-4 sm:p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto w-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        {isEditMode ? 'Edit Transaction' : 'Create Transaction'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={isEditMode}
          >
            <option value="send">Send</option>
            <option value="receive">Receive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coin</label>
          <select
            value={coinKey}
            onChange={e => setCoinKey(e.target.value)}
            className="w-full border rounded px-3 py-2"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="0.01"
          />
          <div className="text-xs text-gray-500 mt-1">
            Balance: {coin?.balance} {coin?.symbol}
          </div>
        </div>

        {type === 'send' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditMode ? 'To Address' : 'To Address'}
            </label>
            <input
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Recipient address"
            />
          </div>
        )}

        {status?.error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{status.error}</div>
        )}
        {status?.success && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">{status.success}</div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

