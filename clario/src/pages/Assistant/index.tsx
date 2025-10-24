import css from './Assistant.module.css'

export default function Assistant() {
  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.title}>Clario AI Помічник</h1>
        <a href="" className={css.profile}>
          Профіль
          <span className={css.dot} />
        </a>
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
        </div>
      </div>
    </section>
  )
}
