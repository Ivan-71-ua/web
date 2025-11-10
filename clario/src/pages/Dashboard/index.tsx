// src/pages/Dashboard/index.tsx
import { Link } from 'react-router-dom'
import css from './Dashboard.module.css'

export default function Dashboard() {
  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.pageTitle}>Добрий день, User</h1>
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
          <div className={css.balance}>$20000</div>
          <div className={css.rows}>
            <div className={css.row}>
              <span>Доходи</span>
              <div className={css.meter}>
                <div className={css.fillGreen} style={{ width: '78%' }} />
              </div>
              <span className={css.rowVal}>$32000</span>
            </div>
            <div className={css.row}>
              <span>Витрати</span>
              <div className={css.meter}>
                <div className={css.fillRed} style={{ width: '46%' }} />
              </div>
              <span className={css.rowVal}>$12000</span>
            </div>
          </div>
          <Link className={css.btn} to="/balance">
            Перейти
          </Link>
        </div>

        <div className={css.cardLg}>
          <div className={css.cardTitle}>Останні транзакції</div>
          <ul className={css.list}>
            <li>
              <span className={css.tName}>Кава</span>
              <b className={css.tVal}>- $10</b>
            </li>
            <li>
              <span className={css.tName}>Квіти</span>
              <b className={css.tVal}>- $500</b>
            </li>
            <li>
              <span className={css.tName}>Їжа</span>
              <b className={css.tVal}>- $1000</b>
            </li>
            <li>
              <span className={css.tName}>Зарплата</span>
              <b className={css.tVal}>+ $16000</b>
            </li>
          </ul>
          <Link className={css.btn} to="/balance">
            Перейти
          </Link>
        </div>

        <div className={css.card}>
          <div className={css.cardTitleCenter}>Прогрес цілей</div>
          <div className={css.goalRow}>
            <span className={css.badgeRed} />
            <span className={css.goalName}>Подорож</span>
            <div className={css.barWrapSm}>
              <div className={css.barRed} style={{ width: '50%' }} />
            </div>
            <span className={css.pct}>50%</span>
          </div>
          <div className={css.goalRow}>
            <span className={css.badgeGreen} />
            <span className={css.goalName}>BMW X5</span>
            <div className={css.barWrapSm}>
              <div className={css.barGreen} style={{ width: '50%' }} />
            </div>
            <span className={css.pct}>50%</span>
          </div>
          <Link className={css.btn} to="/goals">
            Перейти
          </Link>
        </div>

        <div className={css.card}>
          <div className={css.cardTitle}>Ваші досягнення</div>
          <div className={css.achRow}>
            <span className={css.achIcon} />
            <span className={css.achText}>Виконана перша ціль</span>
          </div>
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
