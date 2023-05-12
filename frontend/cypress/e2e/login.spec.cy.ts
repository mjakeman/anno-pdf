describe('Login/Logout functionality', () => {
  it ('Error logging in with wrong credentials', () => {
    cy.login('WrongEmail123@gmail.com', 'wrongtoo123');
    cy.get('[data-cy="error-message"]').should('contain.text', 'Error');
  })

  it ('Successfully logging in with correct credentials then logout', () => {
    cy.login('postmanuser@email.com', 'password');
    cy.url().should('include', '/dash');
    cy.logout();
    cy.url().should('equal', 'http://localhost:5173/');
  });
})