const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const callGroq = require("./groqClient");

async function test() {
    console.log("Testing Groq API...");
    try {
        const res = await callGroq("Say hello in one word.");
        console.log("Success:", res);
    } catch (err) {
        console.error("Failed:", err.message);
    }
}

test();
