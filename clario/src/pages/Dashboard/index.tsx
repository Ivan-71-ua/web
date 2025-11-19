import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../shared/context/AuthContext'
import { useTransactions } from '../../shared/hooks/useTransactions'
import type { Transaction } from '../../shared/types/transactions'
import css from './Dashboard.module.css'

type GoalColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple'

type StoredGoal = {
  id: number
  name: string
  currentAmount: number
  targetAmount: number
  color: GoalColor
}

type Achievement = {
  id: number
  title: string
  text: string
}

const GOALS_STORAGE_KEY = 'clario_goals'

function parseDate(value: string): Date | null {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const d = new Date(year, month - 1, day)
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null
  return d
}

function loadGoalsFromStorage(): StoredGoal[] {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredGoal[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (g) =>
        typeof g.id === 'number' &&
        typeof g.name === 'string' &&
        typeof g.currentAmount === 'number' &&
        typeof g.targetAmount === 'number',
    )
  } catch {
    return []
  }
}

function getGoalClasses(color: GoalColor) {
  switch (color) {
    case 'red':
      return { dot: css.badgeRed, bar: css.barRed }
    case 'green':
      return { dot: css.badgeGreen, bar: css.barGreen }
    case 'blue':
      return { dot: css.badgeBlue, bar: css.barBlue }
    case 'yellow':
      return { dot: css.badgeYellow, bar: css.barYellow }
    case 'purple':
      return { dot: css.badgePurple, bar: css.barPurple }
    default:
      return { dot: css.badgeGreen, bar: css.barGreen }
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const { transactions, loading } = useTransactions()

  const greetingName = useMemo(() => {
    if (!user) return 'User'
    const first = user.firstName?.trim() ?? ''
    const last = user.lastName?.trim() ?? ''
    const full = `${first} ${last}`.trim()
    if (full) return full
    if (user.email) return user.email
    return 'User'
  }, [user])

  const { balance, weekIncome, weekExpense, latestTransactions } = useMemo(() => {
    let incomeAll = 0
    let expenseAll = 0
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - 6)
    let weekIncomeSum = 0
    let weekExpenseSum = 0
    const copy: Transaction[] = [...transactions]
    for (const t of transactions) {
      if (t.type === 'income') incomeAll += t.amount
      else expenseAll += t.amount
      const d = parseDate(t.date)
      if (d && d >= weekStart && d <= now) {
        if (t.type === 'income') weekIncomeSum += t.amount
        else weekExpenseSum += t.amount
      }
    }
    copy.sort((a, b) => {
      const da = parseDate(a.date)
      const db = parseDate(b.date)
      if (da && db) return db.getTime() - da.getTime()
      if (da && !db) return -1
      if (!da && db) return 1
      return 0
    })
    const latest = copy.slice(0, 5)
    return {
      balance: incomeAll - expenseAll,
      totalIncome: incomeAll,
      totalExpense: expenseAll,
      weekIncome: weekIncomeSum,
      weekExpense: weekExpenseSum,
      latestTransactions: latest,
    }
  }, [transactions])

  const goals = useMemo(() => loadGoalsFromStorage(), [])
  const activeGoals = useMemo(
    () => goals.filter((g) => g.targetAmount > 0 && g.currentAmount < g.targetAmount),
    [goals],
  )

  const goalAchievements: Achievement[] = useMemo(() => {
    const result: Achievement[] = []
    goals.forEach((g) => {
      if (g.targetAmount <= 0) return
      const pct = (g.currentAmount / g.targetAmount) * 100
      if (pct >= 100) {
        result.push({
          id: g.id * 10 + 1,
          title: `Ціль "${g.name}" виконана`,
          text: '100% прогресу — вітаємо!',
        })
      } else if (pct >= 50) {
        result.push({
          id: g.id * 10 + 2,
          title: `50% по "${g.name}"`,
          text: 'Половина шляху вже позаду.',
        })
      }
    })
    return result
  }, [goals])

  const maxWeekAmount = Math.max(weekIncome, weekExpense, 1)
  const weekIncomePct = maxWeekAmount > 0 ? (weekIncome / maxWeekAmount) * 100 : 0
  const weekExpensePct = maxWeekAmount > 0 ? (weekExpense / maxWeekAmount) * 100 : 0
  const goalsPreview = activeGoals.slice(0, 2)
  const firstAchievement = goalAchievements[0] ?? null

  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.pageTitle}>Добрий день, {greetingName}</h1>
        <Link to="/profile" className={css.profile}>
          Профіль
          <span className={css.dot} />
        </Link>
      </header>

      <div className={css.grid}>
        <div className={`${css.card} ${css.forecast}`}>
          <div className={css.cardTitle}>Щоденне передбачення</div>
          <div className={css.tip}>Сьогодні прекрасний день, аби відкласти $200!</div>
        </div>

        <div className={css.card}>
          <div className={css.cardTitleCenter}>Баланс</div>
          <div className={css.balance}>${balance.toFixed(2)}</div>
          <div className={css.rows}>
            <div className={css.row}>
              <span>Доходи (7 днів)</span>
              <div className={css.meter}>
                <div className={css.fillGreen} style={{ width: `${weekIncomePct || 4}%` }} />
              </div>
              <span className={css.rowVal}>${weekIncome.toFixed(2)}</span>
            </div>
            <div className={css.row}>
              <span>Витрати (7 днів)</span>
              <div className={css.meter}>
                <div className={css.fillRed} style={{ width: `${weekExpensePct || 4}%` }} />
              </div>
              <span className={css.rowVal}>${weekExpense.toFixed(2)}</span>
            </div>
          </div>
          <Link className={css.btn} to="/balance">
            Перейти
          </Link>
        </div>

        <div className={css.cardLg}>
          <div className={css.cardTitle}>Останні транзакції</div>
          <ul className={css.list}>
            {loading && (
              <li>
                <span className={css.tName}>Завантаження...</span>
              </li>
            )}
            {!loading && latestTransactions.length === 0 && (
              <li>
                <span className={css.tName}>Поки що немає транзакцій</span>
              </li>
            )}
            {!loading &&
              latestTransactions.map((t) => (
                <li key={t.id}>
                  <span className={css.tName}>{t.category}</span>
                  <b className={css.tVal}>
                    {t.type === 'income' ? '+ ' : '- '}${t.amount.toFixed(2)}
                  </b>
                </li>
              ))}
          </ul>
          <Link className={css.btn} to="/balance">
            Перейти
          </Link>
        </div>

        <div className={css.card}>
          <div className={css.cardTitleCenter}>Прогрес цілей</div>
          {goalsPreview.length === 0 && (
            <p className={css.emptyText}>
              Ще немає активних цілей — додай першу на сторінці цілей.
            </p>
          )}
          {goalsPreview.map((goal) => {
            const pct =
              goal.targetAmount > 0
                ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
                : 0
            const classes = getGoalClasses(goal.color)
            return (
              <div key={goal.id} className={css.goalRow}>
                <span className={classes.dot} />
                <span className={css.goalName}>{goal.name}</span>
                <div className={css.barWrapSm}>
                  <div className={classes.bar} style={{ width: `${pct}%` }} />
                </div>
                <span className={css.pct}>{Math.round(pct)}%</span>
              </div>
            )
          })}
          <Link className={css.btn} to="/goals">
            Перейти
          </Link>
        </div>

        <div className={css.card}>
          <div className={css.cardTitle}>Ваші досягнення</div>
          {firstAchievement ? (
            <div className={css.achRow}>
              <span className={css.achIcon} />
              <span className={css.achText}>{firstAchievement.title}</span>
            </div>
          ) : (
            <p className={css.emptyText}>Ще немає досягнень, але ти вже на правильному шляху 💙</p>
          )}
          <Link className={css.btn} to="/goals">
            Перейти
          </Link>
        </div>

        <div className={css.card}>
          <div className={css.cardTitle}>Clario AI Помічник</div>
          <div className={css.preview}>
            <div className={css.bubble}>
              Привіт! Я — твій помічник Clario. Питай мене про витрати, цілі та поради — зроблю все
              просто і зрозуміло.
            </div>
          </div>
          <Link className={css.btn} to="/assistant">
            Перейти
          </Link>
        </div>

        <div className={css.cardWide}>
          <div className={css.cardTitle}>Допоможи розвивати Clario</div>
          <p className={css.supportText}>
            Ми створюємо Clario для людей і разом із людьми. Можеш допомогти нам: повідомити про баг
            або підтримати проєкт донатом.
          </p>
          <div className={css.actions}>
            <Link className={css.btn} to="/support">
              Повідомити про баг
            </Link>
            <button className={css.btnGreen}>Підтримати нас</button>
          </div>
        </div>
      </div>
    </section>
  )
}
