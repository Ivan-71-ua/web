/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/shared/context/AuthContext'
import Login from './index'

function mountLogin() {
  cy.intercept('POST', '**/auth/login', {
    statusCode: 200,
    body: {
      token: 'test-token',
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
    },
  }).as('login')

  mount(
    <MemoryRouter initialEntries={['/auth/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Login page', () => {
  it('shows some validation on empty submit', () => {
    mountLogin()

    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click()
    })

    cy.get('form').should('exist')
  })

  it('submits form with valid credentials', () => {
    mountLogin()

    cy.get('form').within(() => {
      cy.get('input').eq(0).type('test@example.com')
      cy.get('input').eq(1).type('password123')
      cy.get('button[type="submit"]').click()
    })

    cy.wait('@login')
  })
})
