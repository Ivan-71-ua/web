import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Register from '../pages/Auth/Register'
import Login from '../pages/Auth/Login/index'
import Goals from '../pages/Goals/index'
import Assistant from '../pages/Assistant'
import Dashboard from '../pages/Dashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
