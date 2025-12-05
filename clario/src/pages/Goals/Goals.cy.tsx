/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import Goals from './index'

const mountGoals = () =>
  mount(
    <MemoryRouter initialEntries={['/goals']}>
      <Goals />
    </MemoryRouter>,
  )

describe('Goals page', () => {
  it('mounts without crashing', () => {
    mountGoals()
  })

  it('renders goals header', () => {
    mountGoals()

    cy.contains(/ціл/i).should('.exist')
  })
})
