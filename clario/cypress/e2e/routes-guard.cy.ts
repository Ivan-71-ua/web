/// <reference types="cypress" />

describe('Routes guard', () => {
  it('redirects guest to login from protected page', () => {
    cy.clearLocalStorage()
    cy.visit('/dashboard')
    cy.location('pathname').should('match', /login/)
  })
})
