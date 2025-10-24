import AppRoutes from './routes'
import css from './app/App.module.css'
import DevNav from './dev/DevNav'

export default function App() {
  return (
    <div className={css.shell}>
      <main className={css.main}>
        <AppRoutes />
        {import.meta.env.DEV && <DevNav />}
      </main>
    </div>
  )
}
