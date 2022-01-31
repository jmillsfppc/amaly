const nodemailer = require('nodemailer');

// setup a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth : {
        user: 'jeremiah@focusppc.com',
        pass: 'Jesusislord123'
    }
});

// setup html context


const sendEmail = async (emailTo, subject, text, html) => {
    try {
        const email = await transporter.sendMail({
            from: 'Amalyapp <register@amalyapp.com>',
            to: emailTo,
            subject: subject,
            text: text,
            html: html
        })
        console.log("Email sent successfully");

    } catch (error) {
        console.log(error)
    }
}

module.exports = sendEmail