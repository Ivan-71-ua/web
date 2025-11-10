import { Navigate } from 'react-router-dom'

type Props = {
  isAuth: boolean
  children: React.ReactNode
}

export default function PublicRoute({ isAuth, children }: Props) {
  if (isAuth) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
