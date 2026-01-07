const teachContent = require("./teachContent");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function debug() {
    console.log("Testing teachContent...");
    try {
        const res = await teachContent("Beginner");
        console.log("Success:", JSON.stringify(res, null, 2));
    } catch (err) {
        console.error("Failed:", err);
    }
}

debug();
