import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config();

async function sendEmail(userEmail, subject, html) {
    const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
            user: env.SMTP_USERNAME,
            pass: env.SMTP_PASSWORD,
        },
    })
    await transporter.sendMail({
        from: env.FROM_EMAIL,
        to: userEmail,
        subject, subject,
        html: html
    })
}

export { sendEmail };