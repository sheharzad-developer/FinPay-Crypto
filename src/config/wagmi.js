import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia, mainnet } from 'wagmi/chains'
import { http } from 'viem'

// Get a free WalletConnect Cloud project id at https://cloud.reown.com
// Set VITE_WALLETCONNECT_PROJECT_ID in .env.local.
// Injected wallets (MetaMask, Rabby) still work without a real id, but the
// WalletConnect QR option will fail until one is provided.
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'finpay-demo'

// Optional dedicated RPC URLs. Falls back to viem's public default if unset.
// Public RPCs rate-limit aggressively — use Alchemy/Infura/QuickNode in prod.
const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC_URL
const mainnetRpc = import.meta.env.VITE_MAINNET_RPC_URL

export const wagmiConfig = getDefaultConfig({
  appName: 'FinPay',
  projectId,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(sepoliaRpc),
    [mainnet.id]: http(mainnetRpc),
  },
  ssr: false,
})

// USDC token contract addresses (6 decimals on every chain).
// Sepolia: Circle's official testnet USDC — https://developers.circle.com/stablecoins/docs/usdc-on-testnet
// Mainnet: Circle's USDC.
export const USDC_ADDRESS = {
  [sepolia.id]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
}
