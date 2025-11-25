import type { CreateTransactionPayload, Transaction } from '../shared/types/transactions'

const BASE_URL = 'http://localhost:3001'

export async function getTransactionsByUser(userId: number): Promise<Transaction[]> {
  const res = await fetch(`${BASE_URL}/transactions?userId=${userId}`)

  if (!res.ok) {
    throw new Error('Failed to load transactions')
  }

  return res.json()
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('Failed to create transaction')
  }

  return res.json()
}

export async function deleteTransaction(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Failed to delete transaction')
  }
}
