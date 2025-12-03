import React, { useState } from 'react'
import Modal from 'react-modal'
import { useWallet } from '../context/WalletContext'

Modal.setAppElement('#root')

export default function TransferModal({ open, onClose, coinKey }) {
  const { balances, mockTransfer } = useWallet()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState(null)

  const coin = balances[coinKey]

  function submit() {
    if (!amount || Number(amount) <= 0) return setStatus({ error: 'Enter a valid amount' })
    if (Number(amount) > coin.balance) return setStatus({ error: 'Insufficient balance' })
    const res = mockTransfer(coinKey, amount, to)
    setStatus({ success: res.txId })
    setAmount('')
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Send"
      className="bg-white p-4 sm:p-6 rounded shadow max-h-[90vh] overflow-y-auto w-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Send {coin?.symbol}</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600">To address</label>
          <input value={to} onChange={e => setTo(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Recipient address" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Amount</label>
          <input value={amount} onChange={e => setAmount(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="0.01" />
          <div className="text-xs text-gray-500 mt-1">Balance: {coin?.balance} {coin?.symbol}</div>
        </div>
        {status?.error && <div className="text-sm text-red-600">{status.error}</div>}
        {status?.success && <div className="text-sm text-green-600">Sent (mock) — tx: {status.success}</div>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={submit} className="px-3 py-1 bg-indigo-600 text-white rounded">Confirm</button>
        </div>
      </div>
    </Modal>
  )
}