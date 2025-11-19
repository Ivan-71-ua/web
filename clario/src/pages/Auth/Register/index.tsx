import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import css from './Register.module.css'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const first = firstName.trim()
    const last = lastName.trim()
    const phoneVal = phone.trim()
    const emailVal = email.trim()
    const pass = password.trim()
    const conf = confirm.trim()

    if (!first || !last || !phoneVal || !emailVal || !pass || !conf) {
      setFormError('Заповніть, будь ласка, всі поля')
      return
    }

    if (first.length < 2 || last.length < 2) {
      setFormError('Імʼя та прізвище мають містити щонайменше 2 символи')
      return
    }

    const namePattern = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]+$/
    if (!namePattern.test(first) || !namePattern.test(last)) {
      setFormError('Імʼя та прізвище мають містити лише літери')
      return
    }

    const phonePattern = /^\+\d{10,13}$/
    if (!phonePattern.test(phoneVal)) {
      setFormError('Номер телефону має бути у форматі +380XXXXXXXXX')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(emailVal)) {
      setFormError('Введіть коректну електронну пошту')
      return
    }

    if (pass.length < 6) {
      setFormError('Пароль має містити щонайменше 6 символів')
      return
    }

    if (pass !== conf) {
      setFormError('Паролі не співпадають')
      return
    }

    try {
      await register({
        firstName: first,
        lastName: last,
        phone: phoneVal,
        email: emailVal,
        password: pass,
      })
      navigate('/dashboard')
    } catch {
      return
    }
  }

  const finalError = formError || error

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
            <Link className={css.linkBtn} to="/login">
              Увійти
            </Link>
          </div>

          <button className={css.social}>Зареєструватись з Google</button>
          <button className={css.social}>Зареєструватись з Apple</button>

          <div className={css.orRow}>
            <span className={css.line}></span>
            <span className={css.or}>або</span>
            <span className={css.line}></span>
          </div>

          <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.grid2}>
              <input
                className={css.input}
                placeholder="Ім’я"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className={css.input}
                placeholder="Прізвище"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input
              className={css.input}
              placeholder="Номер телефону"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className={css.input}
              placeholder="Електронна пошта"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={css.input}
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className={css.input}
              placeholder="Підтвердити пароль"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {finalError && <div className={css.error}>{finalError}</div>}

            <button className={css.submit} type="submit" disabled={loading}>
              {loading ? 'Реєстрація...' : 'Зареєструватись'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
