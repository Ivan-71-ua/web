import api from '@/api/axios'

type ReportParams = {
	startDate: string
	endDate: string
}

type IncomeReportRow = {
	totalIncome: number | null
}

type ExpenseReportRow = {
	totalExpenses: number | null
}

export async function fetchIncomeReport(params: ReportParams): Promise<number> {
	const { data } = await api.get<IncomeReportRow[]>('/report/income', { params })
	return Number(data?.[0]?.totalIncome ?? 0)
}

export async function fetchExpenseReport(params: ReportParams): Promise<number> {
	const { data } = await api.get<ExpenseReportRow[]>('/report/expenses', { params })
	return Number(data?.[0]?.totalExpenses ?? 0)
}
