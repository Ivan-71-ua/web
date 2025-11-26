import api from '@/api/axios'

export type AuthUser = {
	id: number
	email: string
	firstName: string
	lastName: string
	phone: string | null
	createdAt?: string
}

export type LoginPayload = {
	email: string
	password: string
}

export type RegisterPayload = LoginPayload & {
	firstName: string
	lastName: string
	phone?: string
}

export type AuthResponse = {
	token: string
	user: AuthUser
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
	const { data } = await api.post<AuthResponse>('/auth/login', payload)
	return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
	const { data } = await api.post<AuthResponse>('/auth/register', payload)
	return data
}

export async function fetchProfile(): Promise<AuthUser> {
	const { data } = await api.get<AuthUser>('/auth/profile')
	return data
}
