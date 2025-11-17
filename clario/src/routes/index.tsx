import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Register from '../pages/Auth/Register'
import Login from '../pages/Auth/Login'
import Goals from '../pages/Goals'
import Assistant from '../pages/Assistant'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import BalanceAndTransactions from '../pages/BalanceAndTransactions'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import NotFound from '../pages/NotFound'

const isAuth = false

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute isAuth={isAuth}>
            <Landing />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute isAuth={isAuth}>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute isAuth={isAuth}>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/assistant"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <Assistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/balance"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <BalanceAndTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
