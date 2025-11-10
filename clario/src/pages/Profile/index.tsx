import { Link } from 'react-router-dom'
import css from './Profile.module.css'

export default function Profile() {
  return (
    <section className={css.wrap}>
      <header className={css.top}>
        <div className={css.brand}>
          <img src="/logo.png" alt="" />
        </div>
        <h1 className={css.pageTitle}>Профіль</h1>
        <Link to="/dashboard" className={css.backBtn}>
          На головну
        </Link>
      </header>

      <div className={css.grid}>
        <div className={css.avatarCard}>
          <div className={css.avatarBig}>U</div>
          <p className={css.nameMain}>User Name</p>
          <p className={css.emailMain}>user@email.com</p>
          <label className={css.uploadBtn}>
            Завантажити нове фото
            <input type="file" accept="image/*" className={css.fileInput} />
          </label>
        </div>

        <div className={css.mainCard}>
          <h2 className={css.blockTitle}>Особисті дані</h2>
          <div className={css.row}>
            <div className={css.field}>
              <label>Імʼя</label>
              <input value="User" disabled />
            </div>
            <div className={css.field}>
              <label>Прізвище</label>
              <input value="Name" disabled />
            </div>
          </div>

          <div className={css.row}>
            <div className={css.field}>
              <label>Номер телефону</label>
              <input value="+380..." disabled />
            </div>
            <div className={css.field}>
              <label>Електронна пошта</label>
              <input value="user@email.com" disabled />
            </div>
          </div>

          <h2 className={css.blockTitle}>Про мене</h2>
          <textarea className={css.textarea} placeholder="Коротко про себе…" />

          <div className={css.actions}>
            <button type="button" className={css.primaryBtn}>
              Зберегти
            </button>
            <button type="button" className={css.secondaryBtn}>
              Змінити пароль
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
