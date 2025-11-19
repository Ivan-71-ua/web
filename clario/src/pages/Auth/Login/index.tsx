import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import css from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    if (!email.trim() || !password.trim()) {
      setFormError('Заповніть, будь ласка, всі поля')
      return
    }

    try {
      await login(email.trim(), password.trim())
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
          <h1 className={css.title}>Вхід до Clario</h1>
          <p className={css.lead}>Повернись до своїх фінансових цілей.</p>
          <div className={css.illus}>
            <img src="/auth-girl.png" alt="" className={css.girl} />
          </div>
        </div>

        <div className={css.right}>
          <div className={css.haveAcc}>
            Немає акаунта?
            <Link className={css.linkBtn} to="/auth">
              Зареєструватись
            </Link>
          </div>

          <button className={css.social}>Увійти з Google</button>
          <button className={css.social}>Увійти з Apple</button>

          <div className={css.orRow}>
            <span className={css.line}></span>
            <span className={css.or}>або</span>
            <span className={css.line}></span>
          </div>

          <form className={css.form} onSubmit={handleSubmit}>
            <input
              className={css.input}
              placeholder="Електронна пошта"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={css.input}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className={css.extras}>
              <label className={css.remember}>
                <input type="checkbox" className={css.rememberInput} />
                <span className={css.rememberBox} aria-hidden />
                <span className={css.rememberText}>Запамʼятати мене</span>
              </label>

              <Link to="/reset" className={css.forgot}>
                Забули пароль?
              </Link>
            </div>

            {finalError && <div className={css.error}>{finalError}</div>}

            <button className={css.submit} type="submit" disabled={loading}>
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
