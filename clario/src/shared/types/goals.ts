export type Goal = {
  id: number
  userId: number
  name: string
  currentAmount: number
  targetAmount: number
  color: string
  isHidden: boolean
  completedAt?: string | null
  createdAt?: string
}

export type CreateGoalPayload = {
  name: string
  targetAmount: number
  currentAmount?: number
  color: string
  isHidden?: boolean
}

export type UpdateGoalPayload = Partial<{
  name: string
  currentAmount: number
  targetAmount: number
  color: string
  isHidden: boolean
}>
