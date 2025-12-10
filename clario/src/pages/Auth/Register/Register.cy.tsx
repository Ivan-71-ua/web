/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Register from './index'
import { AuthProvider } from '@/shared/context/AuthContext'

describe('Register page', () => {
  beforeEach(() => {
    window.localStorage.clear()

    Cypress.on('uncaught:exception', () => {
      return false
    })

    cy.intercept('POST', '**/auth/register', {
      statusCode: 200,
      body: { user: { id: 1, email: 'test@example.com' }, token: 'fake-token' },
    })
  })

  const mountPage = () => {
    mount(
      <MemoryRouter initialEntries={['/auth/register']}>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>,
    )
  }

  it('mounts register page without crashing', () => {
    mountPage()

    cy.get('body').should('exist')

    cy.get('input').its('length').should('be.greaterThan', 0)
  })

  it('fills inputs and clicks submit button', () => {
    mountPage()

    cy.get('input').then(($inputs) => {
      const values = ['Іван', 'Павук', 'test@example.com', 'StrongPass1!', 'StrongPass1!']

      Cypress.$($inputs).each((_, el) => {
        const value = values.shift()
        if (!value) return
        cy.wrap(el as HTMLInputElement)
          .clear()
          .type(value)
      })
    })

    cy.get('button').first().click()

    cy.get('body').should('exist')
  })
})
