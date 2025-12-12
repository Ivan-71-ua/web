/// <reference types="cypress" />

const API = String(Cypress.env('API_URL') ?? 'http://localhost:3001').replace(/\/$/, '')

function uniqueEmail() {
  return `e2e_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`
}

Cypress.Commands.add('registerByApi', (overrides: any = {}) => {
  const password = overrides.password ?? 'StrongPass1!'
  const body = {
    firstName: overrides.firstName ?? 'E2E',
    lastName: overrides.lastName ?? 'User',
    phone: overrides.phone ?? '+380501112233',
    email: overrides.email ?? uniqueEmail(),
    password,
    confirmPassword: overrides.confirmPassword ?? password,
  }

  return cy
    .request({
      method: 'POST',
      url: `${API}/auth/register`,
      body,
      failOnStatusCode: false,
    })
    .then((res) => {
      expect([200, 201]).to.include(res.status)
      return { email: body.email, password: body.password }
    })
})

Cypress.Commands.add('loginByApi', (creds: any) => {
  return cy
    .request({
      method: 'POST',
      url: `${API}/auth/login`,
      body: creds,
      failOnStatusCode: false,
    })
    .then((res) => {
      expect(res.status).to.eq(200)

      const token =
        res.body?.token ??
        res.body?.accessToken ??
        res.body?.data?.token ??
        res.body?.data?.accessToken

      const user = res.body?.user ?? res.body?.data?.user

      expect(token).to.be.a('string').and.not.be.empty

      return cy.window().then((win) => {
        win.localStorage.setItem('clario_token', token)
        win.localStorage.setItem('token', token)
        if (user) win.localStorage.setItem('clario_user', JSON.stringify(user))
      })
    })
})

export {}
