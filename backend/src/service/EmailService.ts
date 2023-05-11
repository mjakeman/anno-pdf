import Config from "../util/Config";
import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.GMAIL,
        pass: Config.GMAIL_PASSWORD
    }
});

class EmailService {
    async sendEmail(documentUuid: string, toEmail: string, fromEmail: string) {
        const documentUrl = `${Config.FRONTEND_BASE_URL}/document/${documentUuid}`;
        const html = this.getHtmlTemplate(documentUrl, fromEmail);
        const emailOptions = {
            from: Config.GMAIL,
            to: toEmail,
            subject: "Anno: Invite to Collaborate",
            html
        }

        let emailSent = true;
        await transporter.sendMail(emailOptions, function(error, _info){
            if (error) {
                emailSent = false;
            }
        })

        return emailSent;
    }

    private getHtmlTemplate(documentUrl: string, fromEmail: string) : string {
        return `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Anno - You've Been Invited To Anno!</title>
                <style>
                    /* Karla (default) */
                    @import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
                    
                    /* Halant */
                    @import url('https://fonts.googleapis.com/css2?family=Halant:wght@300;400;500;600;700&display=swap');
    
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: Karla, Arial, sans-serif;
                    }
                    .container {
                        text-align: center;
                    }
                    h1 {
                        color: #333333;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666666;
                        font-size: 16px;
                        margin-bottom: 20px;
                    }
                    .btn {
                        display: inline-block;
                        background-color: #CA2D37;
                        color: white !important;;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-size: 16px;
                    }
                    .btn:hover {
                        background-color: #EB4E54;
                    }
                    .logo {
                        color:#CA2D37; 
                    }
                    .name {
                        color:#CA2D37; 
                        font-family: Halant, Arial, sans-serif;
                    }
                    a {
                        color: black !important;
                    }
                    h2 {
                        color: black !important;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="name">Anno</h1>
                    <h2>You've Been Invited to Anno!</h2>
                    <p>Hello,</p>
                    <p>${fromEmail} invited you to edit a document. Click the button below to access the document and make changes.</p>
                    <a href="${documentUrl}" class="btn">Accept Invitation</a>
                </div>
            </body>
            </html>
        `;
    }
}

export { EmailService };