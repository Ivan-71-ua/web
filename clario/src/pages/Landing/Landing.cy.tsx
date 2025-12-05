/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Landing from './index'

describe('Landing page', () => {
  it('renders without crashing', () => {
    mount(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    )

    cy.get('body').should('exist')
    cy.get('button').should('exist')
  })

  it('has at least one visible image or link', () => {
    mount(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    )

    cy.get('img, a').should('have.length.greaterThan', 0)
  })
})
