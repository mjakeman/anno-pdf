describe('File upload functionality', () => {
    beforeEach(() => {
        cy.login('jjteehee@gmail.com', 'asdasdasd');
    });

    it.only('Successfully uploading PDF document', () => {
        cy.url().should('include', '/dash');
        cy.get('[data-cy="Upload PDF +"]').click({force: true});
        cy.get('[data-cy="upload-file"]').selectFile("SE701_A5.pdf", {force: true});
        cy.log('File uploaded');
        cy.url().should('include', '/document');
        cy.get('[data-cy="document-title"]').should('have.text', 'SE701_A5.pdf');
        // get document id from url
        var documentId = '';
        var token='';
        cy.url().then(url => {
            documentId = url.split('/').pop();
            
            cy.request('POST', 
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyA3gTfsWuuEoLZktxhjBRwg1DqsaBbL_OE`
            , {
                email: "jjteehee@gmail.com",
                password: "asdasdasd",
                returnSecureToken: true
            }).then((response) => {
                token = response.body.idToken;

                cy.request({
                    method: 'DELETE',
                    url: `http://localhost:8080/documents/${documentId}/delete`,
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    }
                });
        });
            }); 
        });

      

    })
