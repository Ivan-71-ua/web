import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import css from './DevNav.module.css'

export default function DevNav() {
  const [open, setOpen] = useState(true)
  if (!open)
    return (
      <button className={css.fab} onClick={() => setOpen(true)}>
        DEV
      </button>
    )
  return (
    <div className={css.wrap}>
      <div className={css.head}>
        <span>DEV навігація</span>
        <button className={css.close} onClick={() => setOpen(false)}>
          ×
        </button>
      </div>
      <nav className={css.list}>
        <NavLink to="/">Landing</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/balance">Баланс</NavLink>
        <NavLink to="/goals">Цілі</NavLink>
        <NavLink to="/assistant">Assistant</NavLink>
        <NavLink to="/auth">Auth</NavLink>
      </nav>
    </div>
  )
}
