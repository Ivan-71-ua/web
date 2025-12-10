/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import BalanceAndTransactions from './index'
import { AuthProvider } from '../../shared/context/AuthContext'

const TEST_USER = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Тест',
  lastName: 'Юзер',
  phone: '',
}

const stubBalanceApi = () => {
  cy.intercept('GET', '**/transactions*', {
    statusCode: 200,
    body: [],
  })

  cy.intercept('GET', '**/goals*', {
    statusCode: 200,
    body: [],
  })
}

const mountPage = () => {
  window.localStorage.setItem('clario_user', JSON.stringify(TEST_USER))

  return mount(
    <MemoryRouter initialEntries={['/balance']}>
      <AuthProvider>
        <BalanceAndTransactions />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('BalanceAndTransactions page', () => {
  beforeEach(() => {
    stubBalanceApi()
  })

  it('mounts without crashing', () => {
    mountPage()
  })

  it('shows balance and transactions sections', () => {
    mountPage()

    cy.contains(/Баланс/i).should('exist')
    cy.contains(/транзакц/i).should('exist')
  })

  it('has button to add transaction', () => {
    mountPage()

    // будь-яка кнопка з текстом "додати"
    cy.contains(/додати/i).should('exist')
  })
})
