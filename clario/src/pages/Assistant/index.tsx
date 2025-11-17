import { Link } from 'react-router-dom'
import css from './Assistant.module.css'

export default function Assistant() {
  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.title}>Clario AI Помічник</h1>
        <div className={css.actions}>
          <Link to="/" className={css.primaryBtn}>
            На головну
          </Link>
          <Link to="/profile" className={css.profile}>
            Профіль
            <span className={css.dot} />
          </Link>
        </div>
      </header>

      <div className={css.chat}>
        <div className={css.msgRow}>
          <img src="/emblem.png" alt="" className={css.avatar} />
          <div className={css.bubble}>
            Привіт! Я Clario, твій розумний фінансовий друг 🤖
            <br />
            Разом ми впораємось із будь-яким бюджетом: я підкажу, коли краще заощадити, а коли можна
            дозволити собі каву ☕️
          </div>
        </div>

        <div className={css.inputRow}>
          <input className={css.input} placeholder="Введіть текст" />
          <button type="button" className={css.sendBtn}>
            Надіслати
          </button>
        </div>
      </div>
    </section>
  )
}
