/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import { AuthContext } from '../shared/context/AuthContext'

function Dummy() {
  return <div data-testid="public-content">Public</div>
}

function AuthWrapper(props: { isAuthenticated: boolean; children: React.ReactNode }) {
  const { isAuthenticated, children } = props

  const value = {
    user: isAuthenticated
      ? {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          phone: null,
        }
      : null,
    isAuthenticated,
    loading: false,
    error: null,
    register: async () => {
      throw new Error('not implemented in test')
    },
    login: async () => {
      throw new Error('not implemented in test')
    },
    logout: () => {},
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

describe('PublicRoute', () => {
  it('renders children when not authenticated', () => {
    mount(
      <MemoryRouter initialEntries={['/login']}>
        <AuthWrapper isAuthenticated={false}>
          <PublicRoute>
            <Dummy />
          </PublicRoute>
        </AuthWrapper>
      </MemoryRouter>,
    )

    cy.get('[data-testid="public-content"]').should('exist')
  })

  it('does not render children when authenticated', () => {
    mount(
      <MemoryRouter initialEntries={['/login']}>
        <AuthWrapper isAuthenticated>
          <PublicRoute>
            <Dummy />
          </PublicRoute>
        </AuthWrapper>
      </MemoryRouter>,
    )

    cy.get('[data-testid="public-content"]').should('not.exist')
  })
})
