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
    async sendEmail(documentUuid: string, email: string) {
        const documentUrl = `${Config.FRONTEND_BASE_URL}/document/${documentUuid}`;
        const html = `<h1>Invite to Anno</h1>
                    <p>You have been invited to collaborate : ${documentUrl}</p>
                  `;
        const emailOptions = {
            from: Config.GMAIL,
            to: email,
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
}

export { EmailService };