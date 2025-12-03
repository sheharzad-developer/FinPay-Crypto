import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchCoinMarketData } from '../services/coingecko'

const WalletContext = createContext(null)

const initialBalances = {
  bitcoin: { symbol: 'BTC', balance: 0.025 },
  ethereum: { symbol: 'ETH', balance: 0.5 },
  tether: { symbol: 'USDT', balance: 1500 },
}

// Load transactions from localStorage on init
const loadTransactions = () => {
  try {
    const stored = localStorage.getItem('crypto_transactions')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function WalletProvider({ children }) {
  const [balances, setBalances] = useState(initialBalances)
  const [prices, setPrices] = useState({})
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [transactions, setTransactions] = useState(loadTransactions())

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('crypto_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoadingPrices(true)
      try {
        const ids = Object.keys(initialBalances).join(',')
        const data = await fetchCoinMarketData(ids)
        if (!mounted) return
        setPrices(data)
      } catch (e) {
        console.error('price fetch error', e)
      } finally {
        setLoadingPrices(false)
      }
    }
    load()
    const interval = setInterval(load, 60_000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  // CREATE - Add new transaction
  function createTransaction(coinKey, amount, toAddress, type = 'send') {
    const coin = balances[coinKey]
    if (!coin) return { success: false, error: 'Invalid coin' }

    const newTransaction = {
      id: Date.now().toString(),
      coinKey,
      symbol: coin.symbol,
      amount: Number(amount),
      toAddress,
      type,
      date: new Date().toISOString(),
      status: 'completed'
    }

    setTransactions(prev => [newTransaction, ...prev])

    // Update balance if it's a send transaction
    if (type === 'send') {
      setBalances(prev => {
        const current = prev[coinKey]
        if (!current) return prev
        const newBal = Math.max(0, Number(current.balance) - Number(amount))
        return { ...prev, [coinKey]: { ...current, balance: newBal } }
      })
    } else if (type === 'receive') {
      setBalances(prev => {
        const current = prev[coinKey]
        if (!current) return prev
        const newBal = Number(current.balance) + Number(amount)
        return { ...prev, [coinKey]: { ...current, balance: newBal } }
      })
    }

    return { success: true, transaction: newTransaction }
  }

  // READ - Get all transactions (already available via transactions state)
  function getTransaction(id) {
    return transactions.find(tx => tx.id === id)
  }

  // UPDATE - Update existing transaction
  function updateTransaction(id, updates) {
    const transaction = transactions.find(tx => tx.id === id)
    if (!transaction) return { success: false, error: 'Transaction not found' }

    const oldAmount = transaction.amount
    const oldType = transaction.type
    const newAmount = updates.amount !== undefined ? Number(updates.amount) : transaction.amount
    const newType = updates.type !== undefined ? updates.type : transaction.type

    // Revert old balance change
    setBalances(prev => {
      const current = prev[transaction.coinKey]
      if (!current) return prev
      let newBal = current.balance
      if (oldType === 'send') {
        newBal = Number(newBal) + Number(oldAmount)
      } else if (oldType === 'receive') {
        newBal = Math.max(0, Number(newBal) - Number(oldAmount))
      }
      return { ...prev, [transaction.coinKey]: { ...current, balance: newBal } }
    })

    // Apply new balance change
    setBalances(prev => {
      const current = prev[transaction.coinKey]
      if (!current) return prev
      let newBal = current.balance
      if (newType === 'send') {
        newBal = Math.max(0, Number(newBal) - Number(newAmount))
      } else if (newType === 'receive') {
        newBal = Number(newBal) + Number(newAmount)
      }
      return { ...prev, [transaction.coinKey]: { ...current, balance: newBal } }
    })

    // Update transaction
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? { ...tx, ...updates, amount: newAmount, type: newType, date: updates.date || tx.date }
          : tx
      )
    )

    return { success: true }
  }

  // DELETE - Remove transaction
  function deleteTransaction(id) {
    const transaction = transactions.find(tx => tx.id === id)
    if (!transaction) return { success: false, error: 'Transaction not found' }

    // Revert balance change
    setBalances(prev => {
      const current = prev[transaction.coinKey]
      if (!current) return prev
      let newBal = current.balance
      if (transaction.type === 'send') {
        newBal = Number(newBal) + Number(transaction.amount)
      } else if (transaction.type === 'receive') {
        newBal = Math.max(0, Number(newBal) - Number(transaction.amount))
      }
      return { ...prev, [transaction.coinKey]: { ...current, balance: newBal } }
    })

    setTransactions(prev => prev.filter(tx => tx.id !== id))
    return { success: true }
  }

  // Legacy function for backward compatibility
  function mockTransfer(coinKey, amount, toAddress) {
    const result = createTransaction(coinKey, amount, toAddress, 'send')
    return { success: result.success, txId: result.transaction?.id || 'MOCK-' + Date.now() }
  }

  return (
    <WalletContext.Provider value={{
      balances,
      prices,
      loadingPrices,
      transactions,
      createTransaction,
      getTransaction,
      updateTransaction,
      deleteTransaction,
      mockTransfer
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}