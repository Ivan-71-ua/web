import css from './Goals.module.css'

export default function Goals() {
  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.pageTitle}>Прогрес цілей і досягнення</h1>
        <a href="" className={css.profile}>
          Профіль
          <span className={css.dot} />
        </a>
      </header>

      <h2 className={css.h2}>Цілі</h2>
      <div className={css.card}>
        <div className={css.cardInner}>
          <div className={css.cardTitle}>Прогрес цілей</div>

          <div className={css.row}>
            <span className={css.badge} data-color="red"></span>
            <div className={css.goalName}>Подорож</div>
            <div className={css.barWrap}>
              <div className={css.bar} data-color="red" style={{ width: '50%' }} />
            </div>
            <div className={css.pct}>50%</div>
          </div>

          <div className={css.row}>
            <span className={css.badge} data-color="green"></span>
            <div className={css.goalName}>BMW X5</div>
            <div className={css.barWrap}>
              <div className={css.bar} data-color="green" style={{ width: '50%' }} />
            </div>
            <div className={css.pct}>50%</div>
          </div>

          <div className={css.cardCta}>
            <button className={css.btn}>Редагувати цілі</button>
          </div>
        </div>
      </div>

      <h2 className={css.h2}>Досягнення</h2>
      <div className={css.card}>
        <div className={css.cardInner}>
          <div className={css.cardTitle}>Ваші досягнення</div>

          <div className={css.achRow}>
            <span className={css.achIcon} />
            <div className={css.achText}>Виконана перша ціль</div>
          </div>

          <div className={css.cardCta}>
            <button className={css.btn}>Перелік досягнень</button>
          </div>
        </div>
      </div>
    </section>
  )
}
