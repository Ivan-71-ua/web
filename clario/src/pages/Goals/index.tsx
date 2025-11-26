import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import css from './Goals.module.css'

type GoalColor = 'red' | 'green' | 'purple' | 'blue' | 'orange'

type Goal = {
  id: number
  name: string
  currentAmount: number
  targetAmount: number
  color: GoalColor
}

const STORAGE_KEY = 'clario_goals'

function loadGoalsFromStorage(): Goal[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Goal[]
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

export default function Goals() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add')
  const [goals, setGoals] = useState<Goal[]>(() => loadGoalsFromStorage())
  const [error, setError] = useState<string | null>(null)
  const [addName, setAddName] = useState('')
  const [addCurrent, setAddCurrent] = useState('')
  const [addTarget, setAddTarget] = useState('')
  const [addColor, setAddColor] = useState<GoalColor>('red')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editTarget, setEditTarget] = useState('')
  const [editIncrease, setEditIncrease] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
    } catch {
      //
    }
  }, [goals])

  useEffect(() => {
    setError(null)

    const active = goals.filter((g) => g.targetAmount > 0 && g.currentAmount < g.targetAmount)

    if (mode === 'edit') {
      if (active.length === 0) {
        setEditId(null)
        setEditName('')
        setEditTarget('')
        setEditIncrease('')
        return
      }
      const first = active[0]
      setEditId(first.id)
      setEditName('')
      setEditTarget('')
      setEditIncrease('')
    }

    if (mode === 'delete') {
      setDeleteId(active[0]?.id ?? null)
    }
  }, [mode, goals])

  function handleAddGoal() {
    setError(null)

    const name = addName.trim()
    const current = Number(addCurrent.replace(',', '.'))
    const target = Number(addTarget.replace(',', '.'))

    if (!name || !addTarget.trim()) {
      setError('Заповніть, будь ласка, назву та цільову суму')
      return
    }

    if (!Number.isFinite(target) || target <= 0) {
      setError('Цільова сума має бути додатнім числом')
      return
    }

    const safeCurrent = Number.isFinite(current) && current >= 0 ? current : 0

    const newGoal: Goal = {
      id: Date.now(),
      name,
      currentAmount: Math.min(safeCurrent, target),
      targetAmount: target,
      color: addColor,
    }

    setGoals((prev) => [...prev, newGoal])
    setAddName('')
    setAddCurrent('')
    setAddTarget('')
    setAddColor('red')
  }

  function handleSelectEdit(id: number) {
    setError(null)
    setEditId(id)
    setEditName('')
    setEditTarget('')
    setEditIncrease('')
  }

  function handleUpdateGoal() {
    setError(null)
    if (editId == null) return

    const goal = goals.find((g) => g.id === editId)
    if (!goal) return

    const nextName = editName.trim() || goal.name
    const targetNum = editTarget.trim() ? Number(editTarget.replace(',', '.')) : goal.targetAmount

    if (!Number.isFinite(targetNum) || targetNum <= 0) {
      setError('Цільова сума має бути додатнім числом')
      return
    }

    const incNum = editIncrease.trim() ? Number(editIncrease.replace(',', '.')) : 0

    if (editIncrease.trim() && (!Number.isFinite(incNum) || incNum <= 0)) {
      setError('Внесок має бути додатнім числом')
      return
    }

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== editId) return g
        const updated: Goal = { ...g }
        updated.name = nextName
        updated.targetAmount = targetNum

        if (incNum > 0) {
          updated.currentAmount += incNum
        }
        if (updated.currentAmount > updated.targetAmount) {
          updated.currentAmount = updated.targetAmount
        }

        return updated
      }),
    )

    setEditName('')
    setEditTarget('')
    setEditIncrease('')
  }

  function handleDeleteGoal() {
    setError(null)
    if (deleteId == null) return
    setGoals((prev) => prev.filter((g) => g.id !== deleteId))
  }

  const achievements: { id: number; title: string; text: string }[] = []
  goals.forEach((g) => {
    if (g.targetAmount <= 0) return
    const pct = (g.currentAmount / g.targetAmount) * 100
    if (pct >= 100) {
      achievements.push({
        id: g.id * 10 + 1,
        title: `Ціль "${g.name}" виконана`,
        text: '100% прогресу — вітаємо!',
      })
    } else if (pct >= 50) {
      achievements.push({
        id: g.id * 10 + 2,
        title: `50% по "${g.name}"`,
        text: 'Половина шляху вже позаду.',
      })
    }
  })

  const activeGoals = goals.filter((g) => g.targetAmount > 0 && g.currentAmount < g.targetAmount)

  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.pageTitle}>Прогрес цілей і досягнення</h1>
        <Link to="/dashboard" className={css.backBtn}>
          <span className={css.backBtnIcon}></span>
          На головну
        </Link>
      </header>

      <h2 className={css.sectionTitle}>Цілі</h2>

      <div className={css.card}>
        <h3 className={css.cardTitle}>Прогрес цілей</h3>

        {activeGoals.length === 0 && (
          <p className={css.emptyText}>
            Поки що немає активних цілей. Додай нову або продовжуй накопичувати ✨
          </p>
        )}

        {activeGoals.map((goal) => {
          const pct =
            goal.targetAmount > 0
              ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
              : 0

          const left = Math.max(goal.targetAmount - goal.currentAmount, 0)

          const color = goal.color ?? 'red'

          let dotColorClass = css.red
          let barClass = css.barRed
          switch (color) {
            case 'green':
              dotColorClass = css.green
              barClass = css.barGreen
              break
            case 'purple':
              dotColorClass = css.purple
              barClass = css.barPurple
              break
            case 'blue':
              dotColorClass = css.blue
              barClass = css.barBlue
              break
            case 'orange':
              dotColorClass = css.orange
              barClass = css.barOrange
              break
            case 'red':
            default:
              dotColorClass = css.red
              barClass = css.barRed
          }

          return (
            <div key={goal.id} className={css.goalRow}>
              <div className={css.goalInfo}>
                <span className={`${css.dot} ${dotColorClass}`} />
                <span className={css.goalName}>{goal.name}</span>
              </div>
              <div className={css.barWrap}>
                <div className={barClass} style={{ width: `${pct}%` }} />
              </div>
              <span className={css.pct}>{Math.round(pct)}%</span>
              <div className={css.goalAmounts}>
                <span>
                  Назбирано: ${goal.currentAmount.toFixed(2)} з ${goal.targetAmount.toFixed(2)}
                </span>
                <span>Залишилось: ${left.toFixed(2)}</span>
              </div>
            </div>
          )
        })}

        <div className={css.actions}>
          <button type="button" className={css.primaryBtn} onClick={() => setIsEditOpen((p) => !p)}>
            {isEditOpen ? 'Закрити' : 'Редагувати цілі'}
          </button>
        </div>

        <div className={`${css.editBlock} ${isEditOpen ? css.editOpen : ''}`}>
          <div className={css.editTabs}>
            <button
              type="button"
              className={mode === 'add' ? css.tabActive : css.tab}
              onClick={() => setMode('add')}
            >
              Додати ціль
            </button>
            <button
              type="button"
              className={mode === 'edit' ? css.tabActive : css.tab}
              onClick={() => setMode('edit')}
              disabled={activeGoals.length === 0}
            >
              Змінити / додати внесок
            </button>
            <button
              type="button"
              className={mode === 'delete' ? css.tabActive : css.tab}
              onClick={() => setMode('delete')}
              disabled={activeGoals.length === 0}
            >
              Видалити ціль
            </button>
          </div>

          {error && <div className={css.error}>{error}</div>}

          {mode === 'add' && (
            <div className={css.formBody}>
              <div className={css.editRow}>
                <label className={css.editLabel}>Назва цілі</label>
                <input
                  className={css.editInput}
                  placeholder="Напр. Подорож"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                />
              </div>
              <div className={css.inlineRow}>
                <div className={css.editRow}>
                  <label className={css.editLabel}>Поточна сума</label>
                  <input
                    className={css.editInput}
                    placeholder="$0"
                    value={addCurrent}
                    onChange={(e) => setAddCurrent(e.target.value)}
                  />
                </div>
                <div className={css.editRow}>
                  <label className={css.editLabel}>Цільова сума</label>
                  <input
                    className={css.editInput}
                    placeholder="$2000"
                    value={addTarget}
                    onChange={(e) => setAddTarget(e.target.value)}
                  />
                </div>
              </div>
              <div className={css.editRow}>
                <label className={css.editLabel}>Колір</label>
                <select
                  className={css.editInput}
                  value={addColor}
                  onChange={(e) => setAddColor(e.target.value as GoalColor)}
                >
                  <option value="red">Червоний</option>
                  <option value="green">Зелений</option>
                  <option value="purple">Фіолетовий</option>
                  <option value="blue">Синій</option>
                  <option value="orange">Помаранчевий</option>
                </select>
              </div>
              <div className={css.editBtns}>
                <button type="button" className={css.primaryBtnSmall} onClick={handleAddGoal}>
                  Додати
                </button>
                <button
                  type="button"
                  className={css.secondaryBtnSmall}
                  onClick={() => {
                    setAddName('')
                    setAddCurrent('')
                    setAddTarget('')
                    setAddColor('red')
                    setError(null)
                  }}
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}

          {mode === 'edit' && activeGoals.length > 0 && (
            <div className={css.formBody}>
              <div className={css.editRow}>
                <label className={css.editLabel}>Оберіть ціль</label>
                <select
                  className={css.editInput}
                  value={editId ?? activeGoals[0].id}
                  onChange={(e) => handleSelectEdit(Number(e.target.value))}
                >
                  {activeGoals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={css.editRow}>
                <label className={css.editLabel}>Нова назва (необовʼязково)</label>
                <input
                  className={css.editInput}
                  placeholder="Подорож в Італію"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className={css.editRow}>
                <label className={css.editLabel}>Нова цільова сума (необовʼязково)</label>
                <input
                  className={css.editInput}
                  placeholder="$1000"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                />
              </div>
              <div className={css.editRow}>
                <label className={css.editLabel}>Додати до поточної суми</label>
                <input
                  className={css.editInput}
                  placeholder="$100"
                  value={editIncrease}
                  onChange={(e) => setEditIncrease(e.target.value)}
                />
              </div>
              <div className={css.editBtns}>
                <button type="button" className={css.primaryBtnSmall} onClick={handleUpdateGoal}>
                  Зберегти
                </button>
                <button
                  type="button"
                  className={css.secondaryBtnSmall}
                  onClick={() => {
                    setEditName('')
                    setEditTarget('')
                    setEditIncrease('')
                    setError(null)
                  }}
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}

          {mode === 'delete' && activeGoals.length > 0 && (
            <div className={css.formBody}>
              <div className={css.editRow}>
                <label className={css.editLabel}>Оберіть ціль для видалення</label>
                <select
                  className={css.editInput}
                  value={deleteId ?? activeGoals[0].id}
                  onChange={(e) => setDeleteId(Number(e.target.value))}
                >
                  {activeGoals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className={css.warningText}>Після видалення ціль зникне зі списку прогресу.</p>
              <div className={css.editBtns}>
                <button type="button" className={css.dangerBtn} onClick={handleDeleteGoal}>
                  Видалити
                </button>
                <button
                  type="button"
                  className={css.secondaryBtnSmall}
                  onClick={() => setError(null)}
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className={css.sectionTitle}>Досягнення</h2>

      <div className={css.card}>
        {achievements.length === 0 && (
          <p className={css.emptyText}>Ще немає досягнень, але ти вже на правильному шляху!</p>
        )}

        {achievements.map((a) => (
          <div key={a.id} className={css.achRow}>
            <div className={css.achIcon} />
            <div>
              <p className={css.achTitle}>{a.title}</p>
              <p className={css.achText}>{a.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
