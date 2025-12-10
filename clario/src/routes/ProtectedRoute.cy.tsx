/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from '../shared/context/AuthContext'

const TEST_USER = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Тест',
  lastName: 'Юзер',
  phone: '',
}

const mountProtected = (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    window.localStorage.setItem('clario_user', JSON.stringify(TEST_USER))
  } else {
    window.localStorage.removeItem('clario_user')
  }

  return mount(
    <MemoryRouter initialEntries={['/protected']}>
      <AuthProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected content</div>
        </ProtectedRoute>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('does not render children when not authenticated', () => {
    mountProtected(false)

    cy.get('[data-testid="protected-content"]').should('not.exist')
  })

  it('renders children when authenticated', () => {
    mountProtected(true)

    cy.get('[data-testid="protected-content"]').should('exist')
  })
})
