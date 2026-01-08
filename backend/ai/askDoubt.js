const fs = require("fs");
const path = require("path");
const callGroq = require("./groqClient");

async function askDoubt(question) {
    try {
        const syllabusPath = path.join(__dirname, "../syllabus.txt");
        if (!fs.existsSync(syllabusPath)) {
            throw new Error("Please upload a syllabus first.");
        }

        const syllabusContent = fs.readFileSync(syllabusPath, "utf-8");

        const prompt = `
        You are an AI Tutor helpfully answering student doubts.
        You MUST answer based ONLY on the provided Syllabus Content.

        Syllabus Content:
        ${syllabusContent.slice(0, 5000)}...

        Student Question: "${question}"

        Instructions:
        1. If the question is related to the syllabus, provide a clear, concise answer.
        2. If the question is NOT related to the syllabus content provided above, STRICTLY say: 
           "I'm sorry, but that question is not related to your syllabus. Please ask something relevant to your studies."
        3. Do not use external knowledge that contradicts or is outside the scope of the syllabus.

        Your Response:
        `;

        const response = await callGroq(prompt);
        return response.trim();

    } catch (error) {
        console.error("Error in askDoubt:", error);
        throw error;
    }
}

module.exports = askDoubt;
