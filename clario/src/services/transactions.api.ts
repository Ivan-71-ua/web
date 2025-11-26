import api from '@/api/axios'
import type { CreateTransactionPayload, Transaction, TransactionType } from '@/shared/types/transactions'

type TransactionDto = {
  id: number
  user_id?: number
  userId?: number
  type: TransactionType
  category?: string | null
  amount: number
  description?: string | null
  date: string
  goal_id?: number | null
  created_at?: string
}

function formatDate(date: string) {
  if (!date) return ''
  if (date.includes('.')) return date
  const parts = date.split('T')[0]?.split('-')
  if (!parts || parts.length !== 3) return date
  const [year, month, day] = parts
  return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`
}

function toTransaction(dto: TransactionDto): Transaction {
  const category = dto.type === 'income' ? 'Дохід' : dto.category || 'Інше'
  return {
    id: dto.id,
    userId: dto.user_id ?? dto.userId ?? 0,
    type: dto.type,
    category,
    amount: Number(dto.amount),
    date: formatDate(dto.date),
    description: dto.description ?? undefined,
    goalId: dto.goal_id ?? null,
    createdAt: dto.created_at,
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<TransactionDto[]>('/transactions')
  return data.map(toTransaction)
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  const normalizedPayload = {
    type: payload.type,
    amount: payload.amount,
    date: payload.date,
    description: payload.description,
    category: payload.type === 'income' ? undefined : payload.category,
    goalId: payload.goalId,
  }

  const { data } = await api.post<TransactionDto>('/transactions', normalizedPayload)
  return toTransaction(data)
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`)
}
