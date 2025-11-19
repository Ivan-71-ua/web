import { Navigate } from 'react-router-dom'
import { useAuth } from '../shared/context/AuthContext'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function PublicRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
