import { useState } from 'react'
import { Link } from 'react-router-dom'
import css from './Goals.module.css'

export default function Goals() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add')

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

        <div className={css.goalRow}>
          <div className={css.goalInfo}>
            <span className={`${css.dot} ${css.red}`} />
            <span className={css.goalName}>Подорож</span>
          </div>
          <div className={css.barWrap}>
            <div className={css.barRed} style={{ width: '78%' }} />
          </div>
          <span className={css.pct}>78%</span>
        </div>

        <div className={css.goalRow}>
          <div className={css.goalInfo}>
            <span className={`${css.dot} ${css.green}`} />
            <span className={css.goalName}>BMW X5</span>
          </div>
          <div className={css.barWrap}>
            <div className={css.barGreen} style={{ width: '62%' }} />
          </div>
          <span className={css.pct}>62%</span>
        </div>

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
            >
              Змінити ціль
            </button>
            <button
              type="button"
              className={mode === 'delete' ? css.tabActive : css.tab}
              onClick={() => setMode('delete')}
            >
              Видалити ціль
            </button>
          </div>

          {mode === 'add' && (
            <div className={css.formBody}>
              <div className={css.editRow}>
                <label className={css.editLabel}>Назва цілі</label>
                <input className={css.editInput} placeholder="Напр. Подорож" />
              </div>
              <div className={css.inlineRow}>
                <div className={css.editRow}>
                  <label className={css.editLabel}>Поточна сума</label>
                  <input className={css.editInput} placeholder="$0" />
                </div>
                <div className={css.editRow}>
                  <label className={css.editLabel}>Цільова сума</label>
                  <input className={css.editInput} placeholder="$2000" />
                </div>
              </div>
              <div className={css.editRow}>
                <label className={css.editLabel}>Колір</label>
                <select className={css.editInput}>
                  <option>Червоний</option>
                  <option>Зелений</option>
                  <option>Синій</option>
                </select>
              </div>
              <div className={css.editBtns}>
                <button type="button" className={css.primaryBtnSmall}>
                  Додати
                </button>
                <button type="button" className={css.secondaryBtnSmall}>
                  Скасувати
                </button>
              </div>
            </div>
          )}

          {mode === 'edit' && (
            <div className={css.formBody}>
              <div className={css.editRow}>
                <label className={css.editLabel}>Оберіть ціль</label>
                <select className={css.editInput}>
                  <option>Подорож</option>
                  <option>BMW X5</option>
                </select>
              </div>
              <div className={css.editRow}>
                <label className={css.editLabel}>Нова назва</label>
                <input className={css.editInput} placeholder="Подорож в Італію" />
              </div>
              <div className={css.inlineRow}>
                <div className={css.editRow}>
                  <label className={css.editLabel}>Поточна сума</label>
                  <input className={css.editInput} placeholder="$780" />
                </div>
                <div className={css.editRow}>
                  <label className={css.editLabel}>Цільова сума</label>
                  <input className={css.editInput} placeholder="$1000" />
                </div>
              </div>
              <div className={css.editBtns}>
                <button type="button" className={css.primaryBtnSmall}>
                  Зберегти
                </button>
                <button type="button" className={css.secondaryBtnSmall}>
                  Скасувати
                </button>
              </div>
            </div>
          )}

          {mode === 'delete' && (
            <div className={css.formBody}>
              <div className={css.editRow}>
                <label className={css.editLabel}>Оберіть ціль для видалення</label>
                <select className={css.editInput}>
                  <option>Подорож</option>
                  <option>BMW X5</option>
                </select>
              </div>
              <p className={css.warningText}>Після видалення ціль зникне зі списку прогресу.</p>
              <div className={css.editBtns}>
                <button type="button" className={css.dangerBtn}>
                  Видалити
                </button>
                <button type="button" className={css.secondaryBtnSmall}>
                  Скасувати
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className={css.sectionTitle}>Досягнення</h2>

      <div className={css.card}>
        <div className={css.achRow}>
          <div className={css.achIcon} />
          <div>
            <p className={css.achTitle}>Виконана перша ціль</p>
            <p className={css.achText}>25.03.25</p>
          </div>
        </div>
        <div className={css.achRow}>
          <div className={css.achIcon} />
          <div>
            <p className={css.achTitle}>50% по BMW X5</p>
            <p className={css.achText}>26.03.25</p>
          </div>
        </div>
      </div>
    </section>
  )
}
