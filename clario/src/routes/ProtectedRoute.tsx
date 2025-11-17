import { Navigate } from 'react-router-dom'

type Props = {
  isAuth: boolean
  children: React.ReactNode
}

export default function ProtectedRoute({ isAuth, children }: Props) {
  if (!isAuth) {
    return <Navigate to="/landing" replace />
  }
  return children
}
