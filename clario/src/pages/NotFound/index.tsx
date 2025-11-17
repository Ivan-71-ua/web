import { Link } from 'react-router-dom'
import css from './NotFound.module.css'

export default function NotFound() {
  return (
    <section className={css.wrap}>
      <div className={css.card}>
        <h1 className={css.code}>404</h1>
        <p className={css.title}>Сторінку не знайдено</p>
        <p className={css.text}>
          Можливо, ви ввели неправильну адресу. Можете повернутися на головну 👇
        </p>
        <Link to="/" className={css.btn}>
          На головну
        </Link>
      </div>
    </section>
  )
}
