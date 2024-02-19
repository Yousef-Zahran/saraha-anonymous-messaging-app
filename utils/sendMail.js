const nodemailer = require('nodemailer');


const sendEmail = async({ to, html, subject }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    })


    const info = await transporter.sendMail({
        from: `"Saraha" <${process.env.EMAIL_ADDRESS}>`, // sender address
        to,
        subject,
        html
    });

    // console.log(info);
    return info.accepted.length > 0;

}
module.exports = sendEmail