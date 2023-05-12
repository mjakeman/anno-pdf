describe('File share functionality', () => {
    beforeEach(() => {
        cy.login('cypressuser@gmail.com', 'password');
    });

    it.only('Successfully sharing PDF document', () => {
        cy.url().should('include', '/dash');
        cy.contains('test.pdf').should('not.exist');
        cy.logout();
        cy.wait(1000);

        cy.login('postmanuser@email.com', 'password');
        cy.contains('test.pdf').click();
        cy.get('[data-cy="Share"]').click();
        cy.get('[data-cy="share-email"]').type('cypressuser@gmail.com');
        cy.get('[data-cy="share-button"]').click();
        cy.wait(1000);
        cy.logout();
        cy.wait(1000);

        cy.login('cypressuser@gmail.com', 'password');
        cy.contains('test.pdf').should('exist');
        cy.contains('test.pdf').click();

        cy.url().should('include', '/document');
        cy.get('[data-cy="document-title"]').should('have.text', 'test.pdf');
        // get document id from url
        var documentId = '';
        var token='';
        cy.url().then(url => {
            documentId = url.split('/').pop();
            
            cy.request('POST', 
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${Cypress.env('API_TOKEN')}`
            , {
                email: "postmanuser@email.com",
                password: "password",
                returnSecureToken: true
            }).then((response) => {
                token = response.body.idToken;

                cy.request({
                    method: 'POST',
                    url: `http://localhost:8080/documents/${documentId}/removeUser`, 
                    body: {email: 'cypressuser@gmail.com'}, 
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    }
                });
        });
            }); 
        });

      

    })
