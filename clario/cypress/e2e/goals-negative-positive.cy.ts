/// <reference types="cypress" />

const API = Cypress.env('API_URL') || 'http://localhost:3001'

const getToken = () =>
  cy.window().then((win) => {
    const token = win.localStorage.getItem('clario_token') || win.localStorage.getItem('token')
    expect(token).to.be.a('string').and.not.be.empty
    return token as string
  })

describe('Goals (negative + positive)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.registerByApi().then((creds: any) => cy.loginByApi(creds))
  })

  it('negative empty goal', () => {
    getToken().then((token) => {
      cy.request({
        method: 'POST',
        url: `${API}/goals`,
        failOnStatusCode: false,
        headers: { Authorization: `Bearer ${token}` },
        body: { name: '', targetAmount: null, color: '' },
      }).then((res) => {
        expect(res.status).to.eq(400)
      })
    })
  })

  it('positive add and delete', () => {
    const goalName = `Goal_${Date.now()}`

    getToken()
      .then((token) => {
        return cy
          .request({
            method: 'POST',
            url: `${API}/goals`,
            headers: { Authorization: `Bearer ${token}` },
            body: { name: goalName, targetAmount: 500, color: 'green' },
          })
          .then((res) => {
            expect(res.status).to.eq(201)
            expect(res.body).to.have.property('id')
            return { token, goalId: res.body.id as number }
          })
      })
      .then(({ token, goalId }) => {
        cy.intercept('GET', '**/goals*').as('getGoals')
        cy.visit('/goals')
        cy.wait('@getGoals')
        cy.contains(goalName, { timeout: 20000 }).should('exist')

        cy.request({
          method: 'DELETE',
          url: `${API}/goals/${goalId}`,
          headers: { Authorization: `Bearer ${token}` },
        })

        cy.intercept('GET', '**/goals*').as('getGoals2')
        cy.reload()
        cy.wait('@getGoals2')
        cy.contains(goalName).should('not.exist')
      })
  })
})
