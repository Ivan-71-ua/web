export {}

declare global {
  namespace Cypress {
    interface Chainable {
      registerByApi(overrides?: any): Chainable<{ email: string; password: string }>
      loginByApi(creds: any): Chainable<void>
    }
  }
}
