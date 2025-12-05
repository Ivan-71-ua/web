/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Register from './index'

const mountRegister = () =>
  mount(
    <MemoryRouter initialEntries={['/register']}>
      <Register />
    </MemoryRouter>,
  )

describe('Register page', () => {
  it('renders register form', () => {
    mountRegister()

    cy.get('form').should('exist')
    cy.get('button').should('exist')
  })
})
