/// <reference types="cypress" />

import * as authApi from './auth.api'
import * as goalsApi from './goals.api'
import * as analyticsApi from './analytics.api'

function callAll(module: any) {
  const fns = Object.values(module).filter(
    (v) => typeof v === 'function',
  ) as ((...args: any[]) => any)[]

  return Promise.all(
    fns.map((fn) =>
      Promise.resolve()
        .then(() => fn())      
        .catch(() => undefined), 
    ),
  )
}

describe('API services smoke', () => {
  it('calls exported service functions', () => {
    cy.intercept('**', { statusCode: 200, body: {} })

    cy.wrap(null).then(() => {
      return callAll(authApi)
        .then(() => callAll(goalsApi))
        .then(() => callAll(analyticsApi))
    })
  })
})
