const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    console.log("Checking available models for key...");
    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`
        );
        console.log("✅ API Key is VALID. Available Models:");
        response.data.models.forEach(m => {
            if (m.name.includes("gemini")) {
                console.log(` - ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
            }
        });
    } catch (error) {
        console.error("❌ API Key validation failed.");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

listModels();
