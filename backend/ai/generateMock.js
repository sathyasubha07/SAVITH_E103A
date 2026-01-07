const fs = require("fs");
const path = require("path");
const callGroq = require("./groqClient");

async function generateMock() {
    try {
        const syllabusPath = path.join(__dirname, "../syllabus.txt");

        if (!fs.existsSync(syllabusPath)) {
            throw new Error("Syllabus file not found. Please upload a syllabus first.");
        }

        const syllabusContent = fs.readFileSync(syllabusPath, "utf-8");

        const prompt = `
    Based on the following syllabus content, generate 10 multiple-choice questions (MCQs) to test the student's understanding.
    
    Syllabus Content (Snippet):
    ${syllabusContent.slice(0, 3000)}...

    Format the output STRICTLY as a JSON array of objects. Do not include markdown formatting (like \`\`\`json).
    Each object should have:
    - "id": number
    - "question": string
    - "options": array of 4 strings
    - "correctAnswer": string (must match one of the options exactly)
    
    Example:
    [
      {
        "id": 1,
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": "4"
      }
    ]
    `;



        const rawResponse = await callGroq(prompt);
        console.log("Groq Raw Response:", rawResponse); // Debugging

        // Robust JSON extraction: Find elements between first '[' and last ']'
        const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            throw new Error("No JSON array found in AI response");
        }

        const cleanResponse = jsonMatch[0];
        return JSON.parse(cleanResponse);

    } catch (error) {
        console.error("Error generating mock test:", error);
        throw error;
    }
}

module.exports = generateMock;
