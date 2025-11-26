import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Transaction, TransactionType } from '../types/transactions'
import * as transactionsApi from '../../services/transactions.api'

type AddTransactionPayload = {
  type: TransactionType
  category?: string
  amount: number
  date: string
  description?: string
}

type UseTransactionsResult = {
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  category: string
  setCategory: (value: string) => void
  loading: boolean
  error: string | null
  addTransaction: (payload: AddTransactionPayload) => Promise<void>
  deleteTransaction: (id: Transaction['id']) => Promise<void>
}

export function useTransactions(): UseTransactionsResult {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    setLoading(true)
    setError(null)

    transactionsApi
      .getTransactions()
      .then((data) => {
            console.log('API transactions', data)

        setTransactions(data)
      })
      .catch(() => {
        setError('Не вдалося завантажити транзакції')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user?.id])

  const filteredTransactions = useMemo(() => {
    const q = category.trim().toLowerCase()
    if (!q) return transactions

    return transactions.filter((t) => (t.category ?? '').toLowerCase().includes(q))
  }, [transactions, category])

  async function addTransaction(payload: AddTransactionPayload): Promise<void> {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const created = await transactionsApi.createTransaction({
        type: payload.type,
        category: payload.category,
        amount: payload.amount,
        date: payload.date,
        description: payload.description,
      })

      setTransactions((prev) => [...prev, created])
    } catch {
      setError('Не вдалося зберегти транзакцію')
      throw new Error('create transaction failed')
    } finally {
      setLoading(false)
    }
  }

  async function deleteTransaction(id: Transaction['id']): Promise<void> {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      await transactionsApi.deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch {
      setError('Не вдалося видалити транзакцію')
      throw new Error('delete transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return {
    transactions,
    filteredTransactions,
    category,
    setCategory,
    loading,
    error,
    addTransaction,
    deleteTransaction,
  }
}
