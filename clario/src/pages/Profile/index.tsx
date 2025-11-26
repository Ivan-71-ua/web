import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/context/AuthContext'
import css from './Profile.module.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = useMemo(() => {
    if (!user) return 'U'
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    if (user.firstName) return user.firstName[0].toUpperCase()
    if (user.email) return user.email[0].toUpperCase()
    return 'U'
  }, [user])

  const firstName = user?.firstName ?? ''
  const lastName = user?.lastName ?? ''
  const phone = user?.phone ?? ''
  const email = user?.email ?? ''

  const fullName = (firstName || lastName ? `${firstName} ${lastName}`.trim() : '') || 'User Name'

  function handleLogout() {
    logout()
    navigate('/login')
  }

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
          <div className={css.avatarBig}>{initials}</div>
          <p className={css.nameMain}>{fullName}</p>
          <p className={css.emailMain}>{email || 'user@email.com'}</p>
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
              <input value={firstName} disabled />
            </div>
            <div className={css.field}>
              <label>Прізвище</label>
              <input value={lastName} disabled />
            </div>
          </div>

          <div className={css.row}>
            <div className={css.field}>
              <label>Номер телефону</label>
              <input value={phone} disabled />
            </div>
            <div className={css.field}>
              <label>Електронна пошта</label>
              <input value={email} disabled />
            </div>
          </div>

          <h2 className={css.blockTitle}>Про мене</h2>
          <textarea className={css.textarea} placeholder="Коротко про себе…" />

          <div className={css.actions}>
            <button type="button" className={css.primaryBtn}>
              Зберегти
            </button>
            <button type="button" className={css.secondaryBtn} onClick={handleLogout}>
              Вийти з акаунта
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
