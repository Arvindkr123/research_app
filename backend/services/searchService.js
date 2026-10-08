const axios = require('axios');
require('dotenv').config();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

async function searchWeb(query) {
  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: TAVILY_API_KEY,
      query: query,
      search_depth: 'basic',
      include_answer: true,
    });
    return response.data.results;
  } catch (error) {
    console.error('Tavily Search Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch search results');
  }
}

module.exports = { searchWeb };
