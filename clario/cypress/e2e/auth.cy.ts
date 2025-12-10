describe('Auth flow', () => {
  it('логін через форму з реальним бекендом', () => {
    cy.intercept('POST', '**/auth/login').as('login')

    cy.visit('/auth/login')

    cy.get('input[type="email"]').clear().type('test@example.com')
    cy.get('input[type="password"]').clear().type('StrongPass1!')

    cy.contains('button', /^Увійти$/).click()

    cy.wait('@login').its('response.statusCode').should('eq', 401)
  })
})
