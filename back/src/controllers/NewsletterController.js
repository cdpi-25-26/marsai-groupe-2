import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();


async function main(req, res) {
    console.log("BREVO_KEY:", process.env.BREVO_KEY);
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email manquant"});

        const client = new BrevoClient({
        apiKey: process.env.BREVO_KEY,
        });
        await client.contacts.createContact({
            email, 
            listIds: [4],
        });
        res.status(200).json({message : "envoi newsletter réussi"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export default { main };
