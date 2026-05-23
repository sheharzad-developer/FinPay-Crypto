import React from 'react'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { formatUnits, erc20Abi } from 'viem'
import { USDC_ADDRESS } from '../config/wagmi'

export default function RealUsdcCard({ onSend }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const tokenAddress = USDC_ADDRESS[chainId]

  const { data: rawBalance, isLoading } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!tokenAddress, refetchInterval: 15_000 },
  })

  const balance =
    rawBalance !== undefined ? Number(formatUnits(rawBalance, 6)) : null

  return (
    <div className="group bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-600 opacity-10 rounded-full blur-2xl -mr-16 -mt-16" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">$</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            Real · USDC
          </span>
        </div>

        {!isConnected && (
          <div className="text-sm text-gray-600 font-medium">
            Connect a wallet to see your USDC balance.
          </div>
        )}

        {isConnected && !tokenAddress && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl">
            USDC not configured for this chain. Switch to Sepolia or Mainnet.
          </div>
        )}

        {isConnected && tokenAddress && (
          <div className="mb-1">
            <div className="text-xs text-gray-500 font-medium mb-1">USDC</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {isLoading || balance === null ? '…' : balance.toFixed(2)}{' '}
              <span className="text-lg">USDC</span>
            </div>
            <div className="text-base sm:text-lg font-semibold text-gray-700">
              ≈ ${isLoading || balance === null ? '—' : balance.toFixed(2)} USD
            </div>
          </div>
        )}
      </div>

      {isConnected && tokenAddress && (
        <div className="relative z-10 mt-4 flex gap-2">
          <button
            onClick={onSend}
            className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <span>→</span>
            <span>Send USDC</span>
          </button>
        </div>
      )}
    </div>
  )
}
