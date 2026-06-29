require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function checkModels() {
    console.log("🔍 DIAGNOSTIC EN COURS...");
    
    if (!process.env.API_KEY) {
        console.log("❌ ERREUR CRITIQUE : Aucune clé API trouvée dans le fichier .env !");
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    
    // On teste les modèles du plus récent au plus ancien
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];

    for (const modelName of models) {
        process.stdout.write(`👉 Test de '${modelName}'... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent("Ceci est un test.");
            console.log("✅ SUCCÈS ! Ce modèle fonctionne.");
            console.log(`\n🏆 CONCLUSION : Tu dois utiliser le modèle "${modelName}" dans ton serveur.`);
            return; // On a trouvé, on arrête.
        } catch (error) {
            console.log("❌ ÉCHEC.");
            if (error.message.includes("404")) {
                console.log("   Raison : Google dit '404 Not Found' (Ta clé n'a pas accès à ce modèle).");
            } else {
                console.log("   Raison : " + error.message);
            }
        }
    }
    console.log("\n AUCUN modèle n'a fonctionné. Vérifie ta clé API.");
}

checkModels();
