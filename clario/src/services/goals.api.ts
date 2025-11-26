import api from '@/api/axios'
import type { Goal, CreateGoalPayload, UpdateGoalPayload } from '@/shared/types/goals'

type GoalDto = {
	id: number
	user_id?: number
	name: string
	current_amount: number
	target_amount: number
	color: string
	is_hidden: number | boolean
	completed_at?: string | null
	created_at?: string
}

function toGoal(dto: GoalDto): Goal {
	return {
		id: dto.id,
		userId: dto.user_id ?? 0,
		name: dto.name,
		currentAmount: Number(dto.current_amount),
		targetAmount: Number(dto.target_amount),
		color: dto.color,
		isHidden: Boolean(dto.is_hidden),
		completedAt: dto.completed_at ?? null,
		createdAt: dto.created_at,
	}
}

export async function listGoals(): Promise<Goal[]> {
	const { data } = await api.get<GoalDto[]>('/goals')
	return data.map(toGoal)
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
	const { data } = await api.post<GoalDto>('/goals', payload)
	return toGoal(data)
}

export async function updateGoal(id: number, payload: UpdateGoalPayload): Promise<Goal> {
	const { data } = await api.patch<GoalDto>(`/goals/${id}`, payload)
	return toGoal(data)
}

export async function deleteGoal(id: number): Promise<void> {
	await api.delete(`/goals/${id}`)
}
