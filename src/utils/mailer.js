const nodeMailer = require('nodemailer')

exports.sendMail = (to, subject, htmlText) => {
    const transport = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'tdq1711@gmail.com',
            pass: 'wnqbndmjpaxfpjys',
        }
    })

    const options = {
        from: 'tdq1711@gmail.com',
        to: to,
        subject: subject,
        html: htmlText
    }
    
    return transport.sendMail(options);
}