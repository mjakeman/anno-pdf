describe('Signup functionality', () => {
    const newRandomEmail = () => {
        const uuid = () => Cypress._.random(0, 1e6);
        const id = uuid();
        const testname = `newuser${id}`;
        const domain = 'test.com';
        const email = `${testname}@${domain}`;
        return email;
    }
    const email = newRandomEmail();

    afterEach(() => {
        cy.deleteUser(`${email}`);
    });

    it('Error signing up with existing email', () => {
        cy.visit('http://localhost:5173/signup');
        cy.get('[data-cy="first-name-input"]').type('New1');
        cy.get('[data-cy="last-name-input"]').type('User2');
        cy.get('[data-cy="email-input"]').type(`${email}`);
        cy.get('[data-cy="password-input"]').type('password');
        cy.get('[data-cy="Sign up"]').eq(1).click();
        cy.wait(1000);
        cy.url().should('equal', 'http://localhost:5173/dash');
        cy.wait(2000);   
    });

})