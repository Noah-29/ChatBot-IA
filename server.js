const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(express.json());

//SITE ---
const SITE_DATA = {
    nomAgence: "Breizh Vélos",
    services: [
        {
            nom: "VTT (Aventure)",
            prix: "Parfait pour les chemins de terre et la forêt. Suspension renforcée.",
            details: "À partir de 450€",
            
        },
        {
            nom: "Vélo de Ville",
            prix: "Léger, élégant, avec porte-bagages. Idéal pour vos trajets quotidiens.",
            details: "À partir de 300€",
            
        },
        {
            nom: "Vélo Électrique",
            prix: "Franchissez les collines sans transpirer avec notre assistance intelligente.",
            details: "À partir de 1200€",
            
        },
    ]
};

const servicesText = SITE_DATA.services.map(s => `- ${s.nom} : ${s.details} -> Lien : ${s.url}`).join("\n");

const SYSTEM_INSTRUCTION = `
Tu es "Le Mécano", l'IA de l'agence Breizh Vélos (Bretagne).
Ton but est de renseigner les visiteurs et de les orienter vers la bonne page.

Voici tes offres à jour :
${servicesText}

RÈGLES IMPORTANTES :
1. Réponses courtes et percutantes (max 3 phrases).
2. Sois professionnel, serviable et rassurant (ton maritime subtil apprécié).
`;

// --- LE MOTEUR
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            console.error("❌ ERREUR : Pas de clé API");
            return res.status(500).json({ reply: "Erreur config serveur." });
        }

        // 'gemini-2.5-flash'
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: SYSTEM_INSTRUCTION + "\n\nQuestion du client : " + userMessage }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ ERREUR GOOGLE :", JSON.stringify(data, null, 2));
            return res.status(500).json({ reply: "Désolé, je suis en maintenance." });
        }

        const text = data.candidates[0].content.parts[0].text;
        res.json({ reply: text });

    } catch (error) {
        console.error("❌ CRASH :", error);
        res.status(500).json({ reply: "Erreur interne." });
    }
});

app.listen(port, () => {
    console.log(`Le Gardien (Gemini 2.5) est actif sur le port ${port}`);
});
