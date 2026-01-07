const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(prompt) {
    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is missing in .env");
    }

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful AI assistant that ALWAYS returns valid JSON when requested."
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.5,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Groq API Error:", error.response ? error.response.data : error.message);
        // Throw more specific error
        const msg = error.response?.data?.error?.message || error.message;
        throw new Error(`Groq Error: ${msg}`);
    }
}

module.exports = callGroq;
