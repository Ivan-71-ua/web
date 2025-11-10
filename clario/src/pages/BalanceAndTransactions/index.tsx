import { useState } from 'react'
import { Link } from 'react-router-dom'
import css from './BalanceAndTransactions.module.css'

export default function BalanceAndTransactions() {
  const [isFormOpen, setIsFormOpen] = useState(false)

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
          <p className={css.balanceBig}>$20000</p>
          <div className={css.innerLine} />
          <div className={css.balanceMeta}>
            <div>
              <p className={css.metaLabel}>Доходи</p>
              <p className={css.metaVal}>$32000</p>
            </div>
            <div className={css.metaRight}>
              <p className={css.metaLabel}>Витрати</p>
              <p className={css.metaVal}>$12000</p>
            </div>
          </div>
          <div className={css.lineChartBox}>
            <svg viewBox="0 0 200 60" className={css.lineSvg} preserveAspectRatio="none">
              <polyline
                points="10,50 45,25 75,45 100,33 125,40 150,20 185,50"
                className={css.lineStroke}
                fill="none"
              />
            </svg>
          </div>
        </div>

        <div className={css.chartsCol}>
          <div className={css.chartCard}>
            <div className={css.cardTitle}>Структура витрат по категоріях</div>
            <div className={css.chartRow}>
              <div className={css.donut} />
              <ul className={css.legend}>
                <li>
                  <span className={css.legendDotBlue} />
                  Їжа
                </li>
                <li>
                  <span className={css.legendDotGreen} />
                  Транспорт
                </li>
                <li>
                  <span className={css.legendDotTeal} />
                  Житло
                </li>
                <li>
                  <span className={css.legendDotGrey} />
                  Інше
                </li>
              </ul>
            </div>
          </div>

          <div className={css.chartCard}>
            <div className={css.cardTitle}>Доходи vs Витрати</div>
            <div className={css.bars}>
              <div className={css.barGroup}>
                <div className={css.barIncome} style={{ height: '78%' }} />
                <div className={css.barExpense} style={{ height: '45%' }} />
              </div>
              <div className={css.barGroup}>
                <div className={css.barIncome} style={{ height: '60%' }} />
                <div className={css.barExpense} style={{ height: '35%' }} />
              </div>
              <div className={css.barGroup}>
                <div className={css.barIncome} style={{ height: '40%' }} />
                <div className={css.barExpense} style={{ height: '22%' }} />
              </div>
              <div className={css.barGroup}>
                <div className={css.barIncome} style={{ height: '70%' }} />
                <div className={css.barExpense} style={{ height: '50%' }} />
              </div>
              <div className={css.barGroup}>
                <div className={css.barIncome} style={{ height: '55%' }} />
                <div className={css.barExpense} style={{ height: '30%' }} />
              </div>
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
              onClick={() => setIsFormOpen((p) => !p)}
            >
              {isFormOpen ? 'Закрити' : 'Додати транзакцію'}
            </button>
          </div>
          <div className={css.searchRow}>
            <input className={css.search} type="text" placeholder="Пошук" />
            <button className={css.searchBtn} type="button">
              Шукати
            </button>
          </div>
        </div>

        <form className={`${css.addForm} ${isFormOpen ? css.addFormOpen : ''}`}>
          <input className={css.formInput} placeholder="Дата" />
          <input className={css.formInput} placeholder="Категорія" />
          <input className={css.formInput} placeholder="Сума в $" />
          <input className={css.formInput} placeholder="Опис" />
          <button type="button" className={css.saveBtn}>
            Додати
          </button>
        </form>

        <div className={css.tableCard}>
          <div className={css.tableHead}>
            <span>Дата</span>
            <span>Категорія</span>
            <span>Сума</span>
            <span>Опис</span>
          </div>
          <div className={css.tableRow}>
            <span>25.10.25</span>
            <span>Подарунки</span>
            <span className={css.minus}>-$1000</span>
            <span>Мама</span>
          </div>
          <div className={css.tableRow}>
            <span>25.03.25</span>
            <span>Транспорт</span>
            <span className={css.minus}>-$10</span>
            <span>Таксі</span>
          </div>
          <div className={css.tableRow}>
            <span>25.03.25</span>
            <span>Розваги</span>
            <span className={css.minus}>-$100</span>
            <span>Кінотеатр</span>
          </div>
          <div className={css.tableRow}>
            <span>25.03.25</span>
            <span>Житло</span>
            <span className={css.minus}>-$1000</span>
            <span>Оренда</span>
          </div>
          <div className={css.tableRow}>
            <span>25.03.25</span>
            <span>Дохід</span>
            <span className={css.plus}>+$16000</span>
            <span>Зарплата</span>
          </div>
          <div className={css.tableFooter}>
            <Link to="/dashboard" className={css.primaryBtn}>
              На головну
            </Link>

            <div className={css.pagination}>
              <button className={css.pageActive}>1</button>
              <button className={css.page}>2</button>
              <button className={css.page}>3</button>
              <button className={css.page}>&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
