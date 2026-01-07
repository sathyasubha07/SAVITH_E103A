const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const KEY = process.env.GEMINI_API_KEY;

const models = [
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
    "gemini-1.0-pro"
];

async function testModel(model) {
    console.log(`\nTesting model: ${model}...`);
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`,
            {
                contents: [{ parts: [{ text: "Hello, reply with 'OK'." }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );
        console.log(`✅ SUCCESS: ${model} is working.`);
        return true;
    } catch (error) {
        console.error(`❌ FAILED: ${model}`);
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Details: ${JSON.stringify(error.response.data.error, null, 2)}`);
        } else {
            console.error(`   Error: ${error.message}`);
        }
        return false;
    }
}

async function runDiagnosis() {
    console.log("---------------------------------------------------");
    console.log("🔍 STARTING AI DIAGNOSIS");
    console.log(`🔑 Key loaded: ${KEY ? "YES (" + KEY.substring(0, 5) + "...)" : "NO"}`);
    console.log("---------------------------------------------------");

    let success = false;
    for (const model of models) {
        if (await testModel(model)) {
            success = true;
            console.log(`\n🚀 RECOMMENDATION: Update client to use '${model}'`);
            break;
        }
    }

    if (!success) {
        console.log("\n⚠️ CRITICAL: No models worked. The API Key is likely invalid or has no permissions.");
    }
}

runDiagnosis();
