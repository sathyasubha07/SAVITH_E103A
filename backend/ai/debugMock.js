const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const generateMock = require("./generateMock");

async function debug() {
    console.log("Debugging generateMock...");
    try {
        const questions = await generateMock();
        console.log("Success! Generated Questions:", JSON.stringify(questions, null, 2));
    } catch (err) {
        console.error("Test Failed with Error:", err.message);
        if (err.stack) console.error(err.stack);
    }
}

debug();
