/// <reference types="cypress" />

describe('Full app flow', () => {
  it('dashboard -> balance -> goals -> profile -> logout', () => {
    cy.clearLocalStorage()

    cy.registerByApi().then((creds) => {
      cy.loginByApi(creds).then(() => {
        cy.intercept('GET', '**/transactions').as('getTx')
        cy.visit('/balance', { failOnStatusCode: false })
        cy.wait('@getTx')
        cy.contains(/Баланс|Транзакц/i, { timeout: 20000 }).should('exist')

        cy.intercept('GET', '**/goals').as('getGoals')
        cy.visit('/goals', { failOnStatusCode: false })
        cy.wait('@getGoals')
        cy.contains(/Ціл/i, { timeout: 20000 }).should('exist')

        cy.intercept('GET', '**/auth/profile').as('getProfile')
        cy.visit('/profile', { failOnStatusCode: false })
        cy.wait('@getProfile')
        cy.contains(/Профіл/i, { timeout: 20000 }).should('exist')

        cy.contains('button, a', /Вийти/i, { timeout: 20000 })
          .should('exist')
          .then(() => cy.contains('button, a', /Вийти/i, { timeout: 20000 }).click({ force: true }))

        cy.location('pathname', { timeout: 20000 }).should('match', /auth\/login|login/i)
      })
    })
  })
})
