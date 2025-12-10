/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from './index'

describe('NotFound page', () => {
  it('renders not found layout', () => {
    mount(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    cy.get('body').should('exist')
    cy.get('a[href="/"]').should('exist')
  })
})
