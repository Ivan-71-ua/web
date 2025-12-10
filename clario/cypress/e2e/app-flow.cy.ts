describe('Основні e2e сценарії Clario', () => {
  it('відкриває головну сторінку', () => {
    cy.visit('/')

    cy.location('pathname').should('eq', '/')
    cy.contains(/Clario/i).should('exist')
  })

  it('надсилає форму логіну й отримує 401 при неправильних даних', () => {
    cy.intercept('POST', '**/auth/login').as('login')

    cy.visit('/auth/login')

    cy.location('pathname').should((path) => {
      expect(path).to.match(/login/)
    })

    cy.get('input[type="email"]').should('exist').clear().type('test@example.com')

    cy.get('input[type="password"]').should('exist').clear().type('StrongPass1!')

    cy.get('form button[type="submit"]').click()

    cy.wait('@login').its('response.statusCode').should('eq', 401)

    cy.location('pathname').should('include', '/auth/login')
  })

  it('редіректить незалогіненого користувача з захищеної сторінки на логін', () => {
    cy.clearLocalStorage()

    cy.visit('/dashboard')

    cy.location('pathname').should((path) => {
      expect(path).to.match(/login/)
    })

    cy.contains('button', /Увійти/i).should('exist')
  })
})
