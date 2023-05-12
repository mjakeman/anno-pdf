describe('File upload functionality', () => {
    beforeEach(() => {
        cy.login('postmanuser@email.com', 'password');
    });

    it.only('Successfully uploading PDF document', () => {
        cy.url().should('include', '/dash');
        cy.get('[data-cy="Upload PDF +"]').click({force: true});
        cy.get('[data-cy="upload-file"]').selectFile("public/test.pdf", {force: true});
        cy.log('File uploaded');
        cy.url().should('include', '/document');
        cy.get('[data-cy="document-title"]').should('have.text', 'test.pdf');
        // get document id from url
        var documentId = '';
        cy.url().then(url => {
            documentId = url.split('/').pop();
            cy.deleteFile(documentId);
            }); 
        });

    })
