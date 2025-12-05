/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Profile from './index'
import { AuthProvider } from '../../shared/context/AuthContext'

const TEST_USER = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Тест',
  lastName: 'Юзер',
  phone: '+380000000000',
}

describe('Profile page', () => {
  beforeEach(() => {
    window.localStorage.setItem('clario_user', JSON.stringify(TEST_USER))
  })

  it('renders user name and email', () => {
    mount(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </MemoryRouter>,
    )

    cy.contains('Профіль').should('exist')
    cy.contains('Тест Юзер').should('exist')
    cy.contains('test@example.com').should('exist')
  })
})
