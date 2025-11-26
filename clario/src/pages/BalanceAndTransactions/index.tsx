import { useState, useMemo, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar } from 'recharts'
import { useTransactions } from '../../shared/hooks/useTransactions'
import type { Transaction } from '../../shared/types/transactions'
import css from './BalanceAndTransactions.module.css'

const EXPENSE_CATEGORIES = ['Їжа', 'Транспорт', 'Житло', 'Розваги', 'Подарунки', 'Інше'] as const

type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
type Category = ExpenseCategory | 'Дохід'

const DONUT_COLORS = ['#2563eb', '#22c55e', '#14b8a6', '#a855f7', '#f97316', '#d4d4d8']
const ITEMS_PER_PAGE = 10

function parseTransactionDate(value: string): Date | null {
  if (!value) return null
  const trimmed = value.trim()

  const dotMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (dotMatch) {
    const day = Number(dotMatch[1])
    const month = Number(dotMatch[2])
    const year = Number(dotMatch[3])
    const d = new Date(year, month - 1, day)
    d.setHours(0, 0, 0, 0)
    if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
      return d
    }
  }

  const isoPart = (trimmed.split('T')[0] ?? trimmed).trim()
  const isoMatch = isoPart.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const year = Number(isoMatch[1])
    const month = Number(isoMatch[2])
    const day = Number(isoMatch[3])
    const d = new Date(year, month - 1, day)
    d.setHours(0, 0, 0, 0)
    if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
      return d
    }
  }

  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) {
    parsed.setHours(0, 0, 0, 0)
    return parsed
  }

  return null
}

export default function BalanceAndTransactions() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [deleteId, setDeleteId] = useState<Transaction['id'] | null>(null)

  const [formDate, setFormDate] = useState('')
  const [formCategory, setFormCategory] = useState<Category>('Їжа')
  const [formAmount, setFormAmount] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')
  const [formError, setFormError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)

  const {
    transactions,
    filteredTransactions,
    category,
    setCategory,
    loading,
    error,
    addTransaction,
    deleteTransaction,
  } = useTransactions()

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0
    let expense = 0

    for (const t of transactions) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    }
  }, [transactions])

  const weeklyData = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const result: { label: string; income: number; expense: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now)
      dayStart.setDate(now.getDate() - i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayStart.getDate() + 1)

      let income = 0
      let expense = 0

      for (const t of transactions) {
        const tDate = parseTransactionDate(t.date)
        if (!tDate) continue

        if (tDate >= dayStart && tDate < dayEnd) {
          if (t.type === 'income') income += t.amount
          else expense += t.amount
        }
      }

      const label = dayStart.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
      })

      result.push({ label, income, expense })
    }

    return result
  }, [transactions])

  const donutData = useMemo(() => {
    const sums: Record<ExpenseCategory, number> = {
      Їжа: 0,
      Транспорт: 0,
      Житло: 0,
      Розваги: 0,
      Подарунки: 0,
      Інше: 0,
    }

    for (const t of transactions) {
      if (t.type !== 'expense') continue

      let cat = t.category as ExpenseCategory
      if (!EXPENSE_CATEGORIES.includes(cat)) {
        cat = 'Інше'
      }

      sums[cat] += t.amount
    }

    const total = Object.values(sums).reduce((acc, v) => acc + v, 0) || 1

    const parts = EXPENSE_CATEGORIES.map((cat, index) => ({
      cat,
      value: sums[cat],
      percent: (sums[cat] / total) * 100,
      color: DONUT_COLORS[index],
    }))

    let current = 0
    const segments: string[] = []

    for (const p of parts) {
      if (p.percent <= 0) continue
      const start = current
      const end = current + p.percent
      segments.push(`${p.color} ${start}% ${end}%`)
      current = end
    }

    const background =
      segments.length > 0
        ? `conic-gradient(${segments.join(', ')})`
        : 'conic-gradient(#e5e7eb 0 100%)'

    return { parts, background }
  }, [transactions])

  const balanceSeries = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dayNet = new Map<number, number>()

    for (const t of transactions) {
      const d = parseTransactionDate(t.date)
      if (!d) continue
      d.setHours(0, 0, 0, 0)
      if (d > today) continue

      const key = d.getTime()
      const prev = dayNet.get(key) ?? 0
      const delta = t.type === 'income' ? t.amount : -t.amount
      dayNet.set(key, prev + delta)
    }

    const sortedKeys = Array.from(dayNet.keys()).sort((a, b) => a - b)
    const cumulativeByDay = new Map<number, number>()
    let cumulative = 0

    for (const key of sortedKeys) {
      cumulative += dayNet.get(key) ?? 0
      cumulativeByDay.set(key, cumulative)
    }

    const start = new Date(today)
    start.setDate(today.getDate() - 6)

    const series: { label: string; balance: number }[] = []
    let lastKnown = 0

    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      d.setHours(0, 0, 0, 0)

      const key = d.getTime()
      if (cumulativeByDay.has(key)) {
        lastKnown = cumulativeByDay.get(key) ?? lastKnown
      }

      const label = d.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
      })

      series.push({ label, balance: lastKnown })
    }

    return series
  }, [transactions])

  async function handleAddTransaction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const date = formDate.trim()
    const desc = formDescription.trim()
    const amountNum = Number(formAmount.replace(',', '.'))

    if (!date || !formAmount.trim()) {
      setFormError('Заповніть, будь ласка, всі обовʼязкові поля')
      return
    }

    const parsed = parseTransactionDate(date)
    if (!parsed) {
      setFormError('Дата має бути у форматі ДД.ММ.РРРР, наприклад 10.11.2025')
      return
    }

    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setFormError('Сума має бути додатнім числом')
      return
    }

    try {
      await addTransaction({
        type: formType,
        category: formType === 'income' ? 'Дохід' : (formCategory as ExpenseCategory),
        amount: amountNum,
        date,
        description: desc || undefined,
      })

      setFormDate('')
      setFormAmount('')
      setFormDescription('')
      setFormType('expense')
      setFormCategory('Їжа')
      setIsFormOpen(false)
      setCurrentPage(1)
    } catch {
      return
    }
  }

  async function handleDelete(id: Transaction['id']) {
    setFormError(null)
    try {
      await deleteTransaction(id)
    } catch {
      return
    }
  }

  async function handleDeleteSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (deleteId == null) return
    await handleDelete(deleteId)
    setDeleteId(null)
    setIsDeleteMode(false)
  }

  const sortedFilteredTransactions = useMemo(() => {
    const copy = [...filteredTransactions]

    copy.sort((a, b) => {
      const da = parseTransactionDate(a.date)
      const db = parseTransactionDate(b.date)
      if (da && db) return db.getTime() - da.getTime()
      if (da && !db) return -1
      if (!da && db) return 1
      return 0
    })

    return copy
  }, [filteredTransactions])

  const totalPages = Math.max(1, Math.ceil(sortedFilteredTransactions.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [sortedFilteredTransactions.length])

  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const pageTransactions = sortedFilteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const finalError = formError || error || null

  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.pageTitle}>Баланс і транзакції</h1>
        <Link to="/profile" className={css.profile}>
          Профіль
          <span className={css.dot} />
        </Link>
      </header>

      <div className={css.grid}>
        <div className={css.balanceCard}>
          <p className={css.balanceTitle}>Баланс</p>
          <p className={css.balanceBig}>${balance.toFixed(2)}</p>
          <div className={css.innerLine} />
          <div className={css.balanceMeta}>
            <div>
              <p className={css.metaLabel}>Доходи</p>
              <p className={css.metaVal}>${totalIncome.toFixed(2)}</p>
            </div>
            <div className={css.metaRight}>
              <p className={css.metaLabel}>Витрати</p>
              <p className={css.metaVal}>${totalExpense.toFixed(2)}</p>
            </div>
          </div>
          <div className={css.lineChartBox}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={balanceSeries} margin={{ top: 10, right: 24, left: 24, bottom: 24 }}>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  padding={{ left: 12, right: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Баланс']}
                  labelFormatter={(label) => `Дата: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={css.chartsCol}>
          <div className={css.chartCard}>
            <div className={css.cardTitle}>Структура витрат по категоріях</div>
            <div className={css.chartRow}>
              <div className={css.donut} style={{ background: donutData.background }} />
              <ul className={css.legend}>
                {donutData.parts.map((part) => (
                  <li key={part.cat}>
                    <span className={css.legendDotBlue} style={{ backgroundColor: part.color }} />
                    {part.cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={css.chartCard}>
            <div className={css.cardTitle}>Доходи vs Витрати (останній тиждень)</div>
            <div className={css.chartRowFull}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData} margin={{ top: 10, bottom: 0, left: 0, right: 0 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.15)' }}
                    contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }}
                  />
                  <Bar dataKey="income" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="expense" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className={css.transactionsBlock}>
        <div className={css.trHeader}>
          <div className={css.trTitleWrap}>
            <h2 className={css.trTitle}>Транзакції</h2>
            <button
              type="button"
              className={css.addLinkBtn}
              onClick={() => {
                setIsFormOpen((p) => !p)
                if (isDeleteMode) {
                  setIsDeleteMode(false)
                  setDeleteId(null)
                }
              }}
            >
              {isFormOpen ? 'Закрити форму' : 'Додати транзакцію'}
            </button>
            <button
              type="button"
              className={css.addLinkBtn}
              onClick={() => {
                setIsDeleteMode((p) => !p)
                setIsFormOpen(false)
                setFormError(null)
              }}
            >
              {isDeleteMode ? 'Скасувати видалення' : 'Видалити транзакцію'}
            </button>
          </div>
          <div className={css.searchRow}>
            <input
              className={css.search}
              type="text"
              placeholder="Пошук по категорії"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <button className={css.searchBtn} type="button">
              Шукати
            </button>
          </div>
        </div>

        {isDeleteMode && (
          <form className={`${css.addForm} ${css.addFormOpen}`} onSubmit={handleDeleteSubmit}>
            <select
              className={css.formInput}
              value={deleteId ?? ''}
              onChange={(e) => setDeleteId(e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">Оберіть транзакцію</option>
              {transactions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.date} • {t.category} • {t.type === 'income' ? '+' : '-'}
                  {t.amount.toFixed(2)}
                </option>
              ))}
            </select>
            <button type="submit" className={css.saveBtn} disabled={loading || deleteId == null}>
              Видалити
            </button>
          </form>
        )}

        <form
          className={`${css.addForm} ${isFormOpen ? css.addFormOpen : ''}`}
          onSubmit={handleAddTransaction}
        >
          <select
            className={css.formInput}
            value={formType}
            onChange={(e) => {
              const nextType = e.target.value as 'income' | 'expense'
              setFormType(nextType)
              if (nextType === 'income') {
                setFormCategory('Дохід')
              } else if (formCategory === 'Дохід') {
                setFormCategory('Їжа')
              }
            }}
          >
            <option value="expense">Витрата</option>
            <option value="income">Дохід</option>
          </select>

          <input
            className={css.formInput}
            placeholder="Дата (ДД.ММ.РРРР)"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
          />

          {formType === 'expense' && (
            <select
              className={css.formInput}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as Category)}
            >
              {EXPENSE_CATEGORIES.filter((c) => c !== 'Інше').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <input
            className={css.formInput}
            placeholder="Сума в $"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
          />
          <input
            className={css.formInput}
            placeholder="Опис"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <button type="submit" className={css.saveBtn} disabled={loading}>
            {loading ? 'Збереження...' : 'Додати'}
          </button>
        </form>

        {finalError && <div style={{ color: '#e5484d', marginTop: '8px' }}>{finalError}</div>}

        <div className={css.tableCard}>
          <div className={css.tableHead}>
            <span>Дата</span>
            <span>Категорія</span>
            <span>Сума</span>
            <span>Опис</span>
          </div>

          {loading && pageTransactions.length === 0 && (
            <div className={css.tableRow}>
              <span>Завантаження...</span>
              <span />
              <span />
              <span />
            </div>
          )}

          {!loading && pageTransactions.length === 0 && (
            <div className={css.tableRow}>
              <span>Транзакцій поки немає</span>
              <span />
              <span />
              <span />
            </div>
          )}

          {pageTransactions.map((t: Transaction) => {
            const d = parseTransactionDate(t.date)
            const displayDate = d
              ? d.toLocaleDateString('uk-UA', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : t.date

            return (
              <div
                className={css.tableRow}
                key={t.id}
                style={isDeleteMode && deleteId === t.id ? { backgroundColor: '#fff0f0' } : undefined}
                onClick={() => {
                  if (isDeleteMode) {
                    setDeleteId(t.id)
                  }
                }}
              >
                <span>{displayDate}</span>
                <span>{t.category}</span>
                <span className={t.type === 'income' ? css.plus : css.minus}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
                <span className={css.descCell}>{t.description || ''}</span>
              </div>
            )
          })}

          <div className={css.tableFooter}>
            <Link to="/dashboard" className={css.primaryBtn}>
              На головну
            </Link>

            <div className={css.pagination}>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const page = i + 1
                const active = page === safePage
                return (
                  <button
                    key={page}
                    type="button"
                    className={active ? css.pageActive : css.page}
                    onClick={() => setCurrentPage(page)}
                    disabled={page > totalPages}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                type="button"
                className={css.page}
                onClick={() => {
                  if (safePage < totalPages) setCurrentPage(safePage + 1)
                }}
                disabled={safePage >= totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
