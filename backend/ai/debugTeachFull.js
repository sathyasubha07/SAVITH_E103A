const teachContent = require("./teachContent");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Mocking the syllabus file for the test if it doesn't exist or just to ensure consistent run
const mockSyllabus = "This is a test syllabus content. " + "content ".repeat(500);
fs.writeFileSync(path.join(__dirname, "../syllabus.txt"), mockSyllabus);

async function debug() {
    console.log("Debugging teachContent...");
    try {
        const res = await teachContent("Intermediate");
        console.log("Success:", JSON.stringify(res, null, 2));
    } catch (err) {
        console.error("Test Failed with Error:", err);
    }
}

debug();
