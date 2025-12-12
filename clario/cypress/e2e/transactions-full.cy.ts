// cypress/e2e/transactions-full.cy.ts
/// <reference types="cypress" />

describe('Transactions (UI) add + search + delete', () => {
  const clickStable = (re: RegExp) => {
    cy.contains('button, a', re, { timeout: 20000 })
      .should('exist')
      .then(() => cy.contains('button, a', re, { timeout: 20000 }).click({ force: true }))
  }

  const fill = (sel: string, v: string) => {
    cy.get(sel, { timeout: 20000 })
      .should('exist')
      .click({ force: true })
      .type(`{selectall}{backspace}${v}`, { force: true })
  }

  const withinTxEditor = (fn: () => void) => {
    cy.contains('button', /^Додати$/i, { timeout: 20000 })
      .should('exist')
      .then(($btn) => {
        cy.wrap($btn)
          .parents(
            'form, [role="dialog"], dialog, [data-testid*="modal"], [class*="modal"], section, main, div'
          )
          .first()
          .within(() => fn())
      })
  }

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.registerByApi().then((creds: any) => cy.loginByApi(creds))
    cy.intercept('GET', '**/transactions*').as('getTx')
    cy.visit('/balance')
    cy.wait('@getTx')
    cy.contains(/Баланс/i, { timeout: 20000 }).should('exist')
  })

  it('add + search + delete', () => {
    const desc = `Taxi_${Date.now()}`

    clickStable(/Додати транзакцію/i)

    withinTxEditor(() => {
      cy.get('select', { timeout: 20000 }).should('have.length.at.least', 2)
      cy.get('select').first().select('Витрата', { force: true })
      cy.get('select').eq(1).select('Транспорт', { force: true })

      fill('input[placeholder="Дата (ДД.ММ.РРРР)"]', '12.12.2025')
      fill('input[placeholder="Сума в $"]', '50')
      fill('input[placeholder="Опис"]', desc)

      cy.intercept('POST', '**/transactions').as('createTx')
      cy.contains('button', /^Додати$/i).click({ force: true })
    })

    cy.wait('@createTx')

    cy.contains(desc, { timeout: 20000 }).should('exist')

    fill('input[placeholder="Пошук по категорії"]', 'Транспорт')
    cy.contains(desc, { timeout: 20000 }).should('exist')

    clickStable(/Видалити транзакцію/i)
    cy.contains(desc, { timeout: 20000 }).click({ force: true })

    cy.intercept('DELETE', '**/transactions/*').as('deleteTx')
    cy.contains('button', /^Видалити$/i, { timeout: 20000 })
      .should('exist')
      .click({ force: true })
    cy.wait('@deleteTx')

    fill('input[placeholder="Пошук по категорії"]', 'Транспорт')
    cy.contains(desc).should('not.exist')
  })
})
