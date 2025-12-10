/// <reference types="cypress" />

describe('Smoke: базові сторінки', () => {
  it('відкриває головну сторінку без помилок', () => {
    cy.visit('/')

    cy.contains(/clario/i).should('exist')
    cy.get('body').should('exist')
  })
})
