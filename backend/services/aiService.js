const axios = require('axios');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = 'openai/gpt-oss-20b'; // Reliable, fast, and available for all accounts

/**
 * Helper function to handle Groq API calls
 */
async function callGroq(prompt, systemPrompt = 'You are a professional research assistant.') {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing in .env file');
  }

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 2048,
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30s is plenty for Groq as it is near-instant
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('Failed to communicate with Groq AI');
  }
}

/**
 * General summary of research content
 */
async function summarizeContent(content) {
  const prompt = `Provide a professional summary of the following content.
Output Format: Bullet points.
Constraint: No conversational filler.
\n\n${content}`;
  return callGroq(prompt);
}

/**
 * Deep Company Analysis: Focuses on Value Prop, Audience, and Revenue
 */
async function analyzeCompany(content) {
  const systemPrompt = 'You are an expert Product Engineer and Business Analyst. Provide structured, data-driven analysis.';
  const prompt = `Analyze this company data and extract the following in Markdown bold headers:
**Value Proposition**: What core problem do they solve?
**Target Audience**: Who is their ideal customer?
**Monetization**: How do they make money?
**Key Strengths**: What makes them unique?

Constraint: Use concise bullet points. No conversational filler.

Research Content:\n\n${content}`;

  return callGroq(prompt, systemPrompt);
}

/**
 * Competitive Analysis: Identifies and compares competitors
 */
async function analyzeCompetitors(content) {
  const systemPrompt = 'You are a Market Research Specialist. Provide a critical comparison in a structured JSON format.';
  const prompt = `Based on the provided content, identify main competitors.
Return a JSON object with this structure:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "gap": "The specific market gap we can exploit"
    }
  ]
}

Constraint: Return ONLY the JSON object. No conversational filler, no markdown code blocks.

Research Content:\n\n${content}`;

  try {
    const result = await callGroq(prompt, systemPrompt);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing competitor JSON:', error);
    return {
      competitors: [
        {
          name: 'Unknown',
          strengths: ['Could not parse structured data'],
          weaknesses: ['AI response format error'],
          gap: 'N/A'
        }
      ]
    };
  }
}

async function chatWithContext(context, userMessage) {
  const systemPrompt = `You are a research assistant. Use the provided research context to answer the user's question.
If the answer isn't directly in the context, use your general knowledge but clearly state: "Based on general knowledge (not in the specific research context)..."

Research Context:
${context}`;

  return callGroq(userMessage, systemPrompt);
}

module.exports = {
  summarizeContent,
  analyzeCompany,
  analyzeCompetitors,
  chatWithContext
};
