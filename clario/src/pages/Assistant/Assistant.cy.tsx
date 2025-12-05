/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Assistant from './index'

describe('Assistant page', () => {
  it('renders title and navigation buttons', () => {
    mount(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>,
    )

    cy.contains('Clario AI Помічник').should('exist')
    cy.contains('На головну').should('exist')
  })

  it('renders input and send button', () => {
    mount(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>,
    )

    cy.get('input[placeholder="Введіть текст"]').should('exist')
    cy.contains('Надіслати').should('exist')
  })
})
