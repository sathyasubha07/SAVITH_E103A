const callGemini = require("./geminiClient");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function test() {
    console.log("Testing Gemini API...");
    try {
        const res = await callGemini("Hello, are you working?");
        console.log("Success:", res);
    } catch (err) {
        console.error("Failed:", err.message);
    }
}

test();
