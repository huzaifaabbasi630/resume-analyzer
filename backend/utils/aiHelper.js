// aiHelper.js
const axios = require("axios");

const getAIResponse = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions", // correct Groq OpenAI‑compatible endpoint
      {
        model: "openai/gpt-oss-20b",     // Groq‑supported OpenAI‑style model
        messages: [
          { role: "system", content: "You are a resume analysis assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 5000,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Most Groq responses include output in response.data.choices[0].message.content
    const aiOutput = response.data.choices?.[0]?.message?.content;
    if (!aiOutput) {
      throw new Error("No content returned from Groq AI");
    }

    return aiOutput;
  } catch (error) {
    console.error(
      "Groq AI Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("AI analysis failed. Please check your API key or try again later.");
  }
};

module.exports = { getAIResponse };