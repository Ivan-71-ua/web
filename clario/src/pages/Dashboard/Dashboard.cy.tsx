/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './index'
import { AuthProvider } from '../../shared/context/AuthContext'

const TEST_USER = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Тест',
  lastName: 'Юзер',
  phone: '',
}

const stubDashboardApi = () => {
  cy.intercept('GET', '**/transactions*', {
    statusCode: 200,
    body: [],
  })

  cy.intercept('GET', '**/goals*', {
    statusCode: 200,
    body: [],
  })

  cy.intercept('GET', '**/analytics*', {
    statusCode: 200,
    body: { income: 0, expenses: 0 },
  })
}

const mountDashboard = () => {
  window.localStorage.setItem('clario_user', JSON.stringify(TEST_USER))

  return mount(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Dashboard page', () => {
  beforeEach(() => {
    stubDashboardApi()
  })

  it('mounts without crashing', () => {
    mountDashboard()
  })

  it('shows greeting with user name', () => {
    mountDashboard()

    cy.contains(/Добрий/i).should('exist') 
    cy.contains(/Тест Юзер/i).should('exist')
  })

  it('shows main sections', () => {
    mountDashboard()

    cy.contains(/Баланс/i).should('exist')
    cy.contains(/транзакц/i).should('exist') 
    cy.contains(/ціл/i).should('exist') 
  })
})
