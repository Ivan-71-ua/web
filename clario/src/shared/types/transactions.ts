export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: number
  userId: number
  type: TransactionType
  category: string
  amount: number
  date: string
  description?: string
}

export type CreateTransactionPayload = {
  userId: number
  type: TransactionType
  category: string
  amount: number
  date: string
  description?: string
}
