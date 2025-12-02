export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: number
  userId: number
  type: TransactionType
  category?: string | null
  amount: number
  date: string
  description?: string
  goalId?: number | null
  createdAt?: string
}

export type CreateTransactionPayload = {
  type: TransactionType
  category?: string
  amount: number
  date: string
  description?: string
  goalId?: number
}
