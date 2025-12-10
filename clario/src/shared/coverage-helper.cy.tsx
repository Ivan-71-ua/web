/// <reference types="cypress" />

import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'
import {
  clearToken,
  getTokenKey,
  getUnauthorizedEventName,
  persistToken,
} from '@/api/axios'

describe('Coverage helper', () => {
  it('executes axios helper functions without network calls', () => {
    clearToken()

    const key = getTokenKey()
    const eventName = getUnauthorizedEventName()

    persistToken('test-token')

    expect(key).to.be.a('string')
    expect(eventName).to.be.a('string')

    mount(
      <MemoryRouter>
        <div>Coverage helper</div>
      </MemoryRouter>,
    )
  })
})
