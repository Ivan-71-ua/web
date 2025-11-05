import css from './Register.module.css'

export default function Register() {
  return (
    <section className={css.wrap}>
      <div className={css.container}>
        <div className={css.left}>
          <div className={css.logoRow}>
            <img src="/logo.png" alt="Clario" />
          </div>
          <h1 className={css.title}>
            Ласкаво просимо
            <br />
            до Clario
          </h1>
          <p className={css.lead}>
            Фінанси стають зрозумілими. Приєднуйся й почни відстежувати свої цілі.
          </p>
          <div className={css.illus}>
            <img src="/auth-girl.png" alt="" className={css.girl} />
          </div>
        </div>

        <div className={css.right}>
          <div className={css.haveAcc}>
            Вже маєте акаунт?
            <a className={css.linkBtn} href="/login">
              Увійти
            </a>
          </div>

          <button className={css.social}>Зареєструватись з Google</button>
          <button className={css.social}>Зареєструватись з Apple</button>

          <div className={css.orRow}>
            <span className={css.line}></span>
            <span className={css.or}>або</span>
            <span className={css.line}></span>
          </div>

          <form className={css.form} action="#">
            <div className={css.grid2}>
              <input className={css.input} placeholder="Ім’я" />
              <input className={css.input} placeholder="Прізвище" />
            </div>
            <input className={css.input} placeholder="Номер телефону" />
            <input className={css.input} placeholder="Електронна пошта" />
            <input className={css.input} placeholder="Пароль" type="password" />
            <input className={css.input} placeholder="Підтвердити пароль" type="password" />
            <button className={css.submit} type="button">
              Зареєструватись
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
