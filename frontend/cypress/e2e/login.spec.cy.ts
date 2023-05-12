describe('Login/Logout functionality', () => {
  it ('Error logging in with wrong credentials', () => {
    cy.login('WrongEmail123@gmail.com', 'wrongtoo123');
    cy.get('[data-cy="error-message"]').should('contain.text', 'Error');
  })

  it ('Successfully logging in with correct credentials then logout', () => {
    cy.login('jjteehee@gmail.com', 'asdasdasd');
    cy.url().should('include', '/dash');
    cy.logout();
    cy.url().should('equal', 'http://localhost:5173/');
  });

  it.only('Successfully uploading PDF document', () => {
    cy.login('jjteehee@gmail.com', 'asdasdasd');
    cy.get('[data-cy="Upload PDF +"]').click();
    cy.get('[data-cy="upload-file"]').selectFile("SE701_A5.pdf", {force: true});
  })
})