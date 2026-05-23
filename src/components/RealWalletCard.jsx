import React from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function RealWalletCard({ onSend }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance, isLoading } = useBalance({
    address,
    query: { enabled: !!address },
  })

  return (
    <div className="group bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-10 rounded-full blur-2xl -mr-16 -mt-16" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">Ξ</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            Real · {chainId === 1 ? 'Mainnet' : 'Sepolia'}
          </span>
        </div>

        {!isConnected && (
          <div className="mb-2">
            <div className="text-sm text-gray-600 font-medium mb-3">
              Connect a wallet to see your real ETH balance.
            </div>
            <ConnectButton />
          </div>
        )}

        {isConnected && (
          <div className="mb-1">
            <div className="text-xs text-gray-500 font-medium mb-1 font-mono truncate">
              {address}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {isLoading ? '…' : Number(balance?.formatted ?? 0).toFixed(5)}{' '}
              <span className="text-lg">{balance?.symbol ?? 'ETH'}</span>
            </div>
          </div>
        )}
      </div>

      {isConnected && (
        <div className="relative z-10 mt-4 flex gap-2">
          <button
            onClick={onSend}
            className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <span>→</span>
            <span>Send (Real)</span>
          </button>
          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      )}
    </div>
  )
}
