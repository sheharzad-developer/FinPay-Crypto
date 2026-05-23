import React, { useState } from 'react'
import Modal from 'react-modal'
import { parseEther, isAddress } from 'viem'
import {
  useAccount,
  useBalance,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'

Modal.setAppElement('#root')

export default function RealSendModal({ open, onClose }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({ address, query: { enabled: !!address } })

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(null)

  const {
    data: hash,
    isPending,
    sendTransaction,
    reset,
  } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  function submit() {
    setError(null)
    if (!isConnected) return setError('Connect a wallet first')
    if (!isAddress(to)) return setError('Enter a valid 0x address')
    if (!amount || Number(amount) <= 0) return setError('Enter a valid amount')
    try {
      sendTransaction({ to, value: parseEther(amount) })
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Failed to send')
    }
  }

  function handleClose() {
    setTo('')
    setAmount('')
    setError(null)
    reset()
    onClose()
  }

  const explorer =
    chainId === 1
      ? `https://etherscan.io/tx/${hash}`
      : `https://sepolia.etherscan.io/tx/${hash}`

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleClose}
      contentLabel="Send Real ETH"
      className="bg-white/95 backdrop-blur-lg p-5 sm:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto w-full border border-white/20"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">Ξ</span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Send Real ETH
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {chainId === 1 ? 'Mainnet — real money!' : 'Sepolia testnet — safe to experiment'}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">To address</label>
          <input
            value={to}
            onChange={e => setTo(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 font-mono text-sm"
            placeholder="0x..."
            disabled={isPending || isConfirming}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (ETH)</label>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 font-medium"
            placeholder="0.001"
            disabled={isPending || isConfirming}
          />
          <div className="text-xs text-gray-500 mt-2 font-medium bg-gray-50 px-3 py-2 rounded-lg">
            💰 Balance: {balance ? Number(balance.formatted).toFixed(5) : '—'} {balance?.symbol ?? 'ETH'}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl font-medium flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {hash && !isConfirmed && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl font-medium">
            ⏳ Submitted. Waiting for confirmation…
            <div className="font-mono text-xs mt-1 break-all">
              <a href={explorer} target="_blank" rel="noopener noreferrer" className="underline">
                {hash}
              </a>
            </div>
          </div>
        )}

        {isConfirmed && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl font-medium">
            ✅ Confirmed on-chain.{' '}
            <a href={explorer} target="_blank" rel="noopener noreferrer" className="underline">
              View on Etherscan
            </a>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200"
          >
            Close
          </button>
          <button
            onClick={submit}
            disabled={isPending || isConfirming || !isConnected}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isPending ? 'Confirm in wallet…' : isConfirming ? 'Confirming…' : '⚡ Send Real ETH'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
