import React from 'react'
import DarkModeToggle from './DarkModeToggle'

describe('<DarkModeToggle />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DarkModeToggle />)
  })
})