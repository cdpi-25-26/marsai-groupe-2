import dotenv from "dotenv";
import { sendEmail } from "./mailer.js";

dotenv.config();

async function sendValidateEmail(userEmail) {
    const verificationToken = await sign({
            email: userEmail,
            exp: Math.floor(Date.now() / 1000)  + 60 * 60 *24
        },
        env.JWT_SECRET,
    )
    const html = `
    <h1>Confirmation Email</h1>
    <p>Your video submission has been accepted.</p>
    `
    try {
        await sendEmail(userEmail,html)
        return true
    } catch (error) {
        console.error(`Error sending email:`, error)
        return false
    }
} 

export { sendValidateEmail };