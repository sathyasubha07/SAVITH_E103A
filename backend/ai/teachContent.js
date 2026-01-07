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
    
    **Output Format:**
    Return a STRICT JSON object (no markdown):
    {
      "title": "Lesson Title",
      "level": "${level}",
      "introduction": "Brief intro",
      "sections": [
        {
          "heading": "Topic 1",
          "content": "Detailed explanation tailored to ${level} level.",
          "youtubeQuery": "Search term to find a relevant youtube video for this topic" 
        },
        {
          "heading": "Topic 2",
          "content": "Detailed explanation...",
          "youtubeQuery": "Search term..."
        }
      ],
      "summary": "Wrap up"
    }
    `;

    const rawResponse = await callGroq(prompt);
    console.log("Groq Lesson Response:", rawResponse);

    // Match either {...} or [...]
    const jsonMatch = rawResponse.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);

    if (!jsonMatch) {
      throw new Error("No JSON found in lesson response");
    }

    let parsed = JSON.parse(jsonMatch[0]);

    // If array, take the first item
    if (Array.isArray(parsed)) {
      parsed = parsed[0];
    }

    return parsed;

  } catch (error) {
    console.error("Error generating lesson:", error);
    // Fallback content to prevent app crash
    return {
      title: "Lesson Generation Failed",
      level: level,
      introduction: "We encountered an issue generating your lesson. Please try again.",
      sections: [],
      summary: "Error: " + error.message
    };
  }
}

module.exports = teachContent;
