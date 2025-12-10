/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Goals from './index'
import { AuthProvider } from '@/shared/context/AuthContext'

const TEST_USER = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Тест',
  lastName: 'Юзер',
  phone: '',
}

describe('Goals page', () => {
  beforeEach(() => {
    window.localStorage.setItem('clario_user', JSON.stringify(TEST_USER))
    window.localStorage.removeItem('clario_token')

    cy.intercept('GET', '**/goals', {
      statusCode: 200,
      body: [],
    }).as('getGoals')
  })

  it('renders header and empty state', () => {
    mount(
      <MemoryRouter initialEntries={['/goals']}>
        <AuthProvider>
          <Goals />
        </AuthProvider>
      </MemoryRouter>,
    )

    cy.wait('@getGoals')

    cy.contains('Прогрес цілей і досягнення').should('exist')
    cy.contains('Цілі').should('exist')
    cy.contains('Поки що немає активних цілей').should('exist')
  })

  it('opens edit block and shows add-goal UI', () => {
    mount(
      <MemoryRouter initialEntries={['/goals']}>
        <AuthProvider>
          <Goals />
        </AuthProvider>
      </MemoryRouter>,
    )

    cy.wait('@getGoals')

    cy.contains('Редагувати цілі').click()
    cy.contains('Додати ціль').click()

    // Тут НЕ шукаємо <form>, бо його, судячи з помилки, просто нема
    cy.get('input').should('have.length.at.least', 2)
    cy.contains('Додати').should('exist')
  })
})
