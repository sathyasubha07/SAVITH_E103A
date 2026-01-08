const fs = require("fs");
const path = require("path");
const callGroq = require("./groqClient");

async function teachContent(level) {
  try {
    const syllabusPath = path.join(__dirname, "../syllabus.txt");
    if (!fs.existsSync(syllabusPath)) {
      throw new Error("Syllabus file not found.");
    }

    const syllabusContent = fs.readFileSync(syllabusPath, "utf-8");

    const prompt = `
    You are an expert AI Tutor. The student has been assessed as: **${level}**.
    
    Based on the syllabus below, generate a personalized lesson plan.
    
    Syllabus:
    ${syllabusContent.slice(0, 4000)}...

    **Instructions:**
    - If Beginner: Use simple analogies, focus on fundamentals.
    - If Intermediate: Focus on application and solving standard problems.
    - If Advanced: Focus on complex scenarios, edge cases, and optimization.
    
    **Output Format (STRICT JSON ONLY):**
    {
      "title": "Lesson Title",
      "level": "${level}",
      "introduction": "Brief intro",
      "sections": [
        {
          "heading": "Topic 1",
          "content": "Detailed explanation tailored to ${level} level.",
          "youtubeQuery": "Search term to find a relevant youtube video" 
        }
      ],
      "summary": "Wrap up"
    }
    `;

    const rawResponse = await callGroq(prompt);
    console.log("Groq Lesson Response:", rawResponse);

    let cleanResponse = rawResponse.trim();
    if (cleanResponse.includes("```json")) {
      cleanResponse = cleanResponse.split("```json")[1].split("```")[0].trim();
    } else if (cleanResponse.includes("```")) {
      cleanResponse = cleanResponse.split("```")[1].split("```")[0].trim();
    }

    const jsonMatch = cleanResponse.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);

    if (!jsonMatch) {
      throw new Error("No JSON found in lesson response");
    }

    let parsed = JSON.parse(jsonMatch[0]);

    if (Array.isArray(parsed)) {
      parsed = parsed[0];
    }

    return parsed;

  } catch (error) {
    console.error("Error generating lesson:", error);
    return {
      title: "Lesson Generation Failed",
      level: level,
      introduction: "We encountered an issue. " + error.message,
      sections: [],
      summary: "Please try again shortly."
    };
  }
}

module.exports = teachContent;
