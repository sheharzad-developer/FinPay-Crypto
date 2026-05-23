# FinPay — Crypto Wallet UI

A React crypto wallet built with Vite + Tailwind. Ships with two layers:

- **Mock portfolio** — hardcoded BTC / ETH / USDT balances with a localStorage transaction CRUD. Useful for demoing the UI without a wallet.
- **Real wallet** — connect MetaMask / WalletConnect, view live ETH + USDC balances on Sepolia or Mainnet, and send real on-chain transactions via [wagmi](https://wagmi.sh) + [viem](https://viem.sh) + [RainbowKit](https://www.rainbowkit.com).

The mock and real layers live side-by-side on the dashboard — flip between them without changing code.

## Tech stack

- React 19, Vite (rolldown), Tailwind v3
- React Router 7 for auth gating
- recharts for price sparklines
- CoinGecko REST for live market prices
- wagmi 2 + viem + @tanstack/react-query + RainbowKit for the real wallet

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — see "Env vars" below
npm run dev
```

Open the URL Vite prints. You'll land on `/signin`; create an account or sign in (auth is client-side, see [src/context/AuthContext.jsx](src/context/AuthContext.jsx)). The dashboard renders both wallet sections.

## Env vars

All optional. Defaults work, but with caveats noted below. Copy `.env.example` to `.env.local` and fill in.

| Variable | Purpose | Without it |
|---|---|---|
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project id ([free here](https://cloud.reown.com)) | MetaMask / injected wallets work; WalletConnect QR flow won't |
| `VITE_SEPOLIA_RPC_URL` | Dedicated Sepolia RPC (Alchemy / Infura / QuickNode) | Falls back to public RPC — rate-limits aggressively |
| `VITE_MAINNET_RPC_URL` | Dedicated mainnet RPC | Same — public fallback |

## Using the real wallet

1. Click **Connect Wallet** on the emerald-bordered card. Pick MetaMask, Rabby, or scan WalletConnect.
2. Make sure the wallet is on **Sepolia** (the default network in [src/config/wagmi.js](src/config/wagmi.js)).
3. Get test funds:
   - Sepolia ETH (for gas + ETH sends): [sepoliafaucet.com](https://sepoliafaucet.com) or [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)
   - Sepolia USDC: [faucet.circle.com](https://faucet.circle.com) → pick Ethereum Sepolia
4. Click **Send (Real)** for ETH or **Send USDC** for the ERC-20 — the modal opens, you confirm in your wallet, the tx hash links to Sepolia Etherscan, and ✅ shows once it's mined.

### Switching to mainnet

Edit [src/config/wagmi.js](src/config/wagmi.js) — reorder `chains` so `mainnet` is first, or remove `sepolia` entirely. The user still picks the active network in their wallet. **Mainnet means real money — start on Sepolia.**

## Project structure

```
src/
├── App.jsx                  # router + protected/public routes
├── main.jsx                 # all providers (wagmi, query, RainbowKit, auth, mock wallet)
├── config/wagmi.js          # chains, transports, USDC contract addresses
├── context/
│   ├── AuthContext.jsx      # client-side auth (mock)
│   └── WalletContext.jsx    # mock balances + localStorage transaction CRUD
├── services/coingecko.js    # live price fetch
├── pages/
│   ├── Dashboard.jsx        # both wallet sections side-by-side
│   ├── SignIn.jsx / SignUp.jsx / EmailVerification.jsx
└── components/
    ├── BalanceCard.jsx      # mock BTC / ETH / USDT card
    ├── PriceChart.jsx       # 7d sparkline
    ├── TransferModal.jsx    # mock quick-send
    ├── TransactionForm.jsx  # mock CRUD form
    ├── TransactionsList.jsx # mock tx table
    ├── RealWalletCard.jsx   # real ETH balance + connect button
    ├── RealSendModal.jsx    # real ETH send (useSendTransaction)
    ├── RealUsdcCard.jsx     # real USDC balance (useReadContract)
    └── RealUsdcSendModal.jsx # real USDC transfer (useWriteContract)
```

## Scripts

```bash
npm run dev       # vite dev server
npm run build     # production build to dist/
npm run preview   # serve dist/
npm run lint      # eslint
```

## What's mock vs. real

| Piece | Status |
|---|---|
| Market prices | ✅ Real — CoinGecko |
| Real ETH balance + send (Sepolia/Mainnet) | ✅ Real — wagmi/viem |
| Real USDC balance + transfer | ✅ Real — ERC-20 via wagmi |
| BTC / ETH / USDT portfolio cards | ❌ Mock — hardcoded in [WalletContext.jsx](src/context/WalletContext.jsx) |
| Mock transactions CRUD | ❌ localStorage only |
| Auth | ❌ Client-side only — no backend |

## Known limitations

- wagmi is EVM-only. The mock BTC card is **not** real Bitcoin — that would need a different stack (e.g. bitcoinjs-lib + a UTXO indexer).
- Auth has no server. Treat it as a UI scaffold, not a real identity layer.
- Bundle is ~1.3 MB (wallet libs are heavy). For prod, consider `manualChunks` in `vite.config.js`.
