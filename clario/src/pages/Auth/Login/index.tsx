import css from './Login.module.css'

export default function Login() {
  return (
    <section className={css.wrap}>
      <div className={css.container}>
        <div className={css.left}>
          <div className={css.logoRow}>
            <img src="/logo.png" alt="Clario" />
          </div>
          <h1 className={css.title}>Вхід до Clario</h1>
          <p className={css.lead}>Повернись до своїх фінансових цілей.</p>
          <div className={css.illus}>
            <img src="/auth-girl.png" alt="" className={css.girl} />
          </div>
        </div>

        <div className={css.right}>
          <div className={css.haveAcc}>
            Немає акаунта?
            <a className={css.linkBtn} href="/auth">
              Зареєструватись
            </a>
          </div>

          <button className={css.social}>Увійти з Google</button>
          <button className={css.social}>Увійти з Apple</button>

          <div className={css.orRow}>
            <span className={css.line}></span>
            <span className={css.or}>або</span>
            <span className={css.line}></span>
          </div>

          <form className={css.form}>
            <input className={css.input} placeholder="Електронна пошта" />
            <input className={css.input} type="password" placeholder="Пароль" />
            <div className={css.extras}>
              <label className={css.check}>
                <input type="checkbox" className={css.checkbox} />
                <span>Запам’ятати мене</span>
              </label>
              <a href="" className={css.forgot}>
                Забули пароль?
              </a>
            </div>
            <button className={css.submit}>Увійти</button>
          </form>
        </div>
      </div>
    </section>
  )
}
