/// <reference types="cypress" />

describe('Auth validations', () => {
  it('login: пусті поля показують помилку', () => {
    cy.intercept('POST', '**/auth/login').as('login')

    cy.visit('/auth/login')
    cy.contains('button', /^Увійти$/i).click()

    cy.contains('Заповніть, будь ласка, всі поля').should('exist')
    cy.get('@login.all').should('have.length', 0)
  })

  it('register: пусті поля не відправляють запит', () => {
    cy.intercept('POST', '**/auth/register').as('register')

    cy.visit('/auth/register')
    cy.contains('button', /Зареєструватись/i).click()

    cy.get('@register.all').should('have.length', 0)
  })

  it('register: невалідний email не відправляє запит', () => {
    cy.intercept('POST', '**/auth/register').as('register')

    cy.visit('/auth/register')

    cy.get('input[placeholder="Ім’я"]').type('Ivan')
    cy.get('input[placeholder="Прізвище"]').type('Test')
    cy.get('input[placeholder="Номер телефону"]').type('+380501112233')

    cy.get('input[placeholder="Електронна пошта"]')
      .type('bad-email')
      .then(($el) => {
        expect(($el[0] as HTMLInputElement).checkValidity()).to.eq(false)
      })

    cy.get('input[placeholder="Пароль"]').type('StrongPass1!')
    cy.get('input[placeholder="Підтвердити пароль"]').type('StrongPass1!')

    cy.contains('button', /Зареєструватись/i).click()

    cy.get('@register.all').should('have.length', 0)
  })

  it('register: паролі не співпадають не відправляє запит', () => {
    cy.intercept('POST', '**/auth/register').as('register')

    cy.visit('/auth/register')

    cy.get('input[placeholder="Ім’я"]').type('Ivan')
    cy.get('input[placeholder="Прізвище"]').type('Test')
    cy.get('input[placeholder="Номер телефону"]').type('+380501112233')
    cy.get('input[placeholder="Електронна пошта"]').type(`e2e_${Date.now()}@test.com`)
    cy.get('input[placeholder="Пароль"]').type('StrongPass1!')
    cy.get('input[placeholder="Підтвердити пароль"]').type('Different1!')

    cy.contains('button', /Зареєструватись/i).click()

    cy.get('@register.all').should('have.length', 0)
  })
})
