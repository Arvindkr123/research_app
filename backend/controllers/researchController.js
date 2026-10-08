const { searchWeb } = require('../services/searchService');
const { summarizeContent, analyzeCompany, analyzeCompetitors } = require('../services/aiService');

exports.performResearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const results = await searchWeb(q);
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No web results found for this query' });
    }

    const content = results.map(r => r.content).join('\\n\\n');
    const summary = await summarizeContent(content);

    res.json({
      query: q,
      summary,
      sources: results.map(r => ({ title: r.title, url: r.url }))
    });
  } catch (error) {
    next(error);
  }
};

exports.performCompanyAnalysis = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const results = await searchWeb(`company analysis and value proposition for ${q}`);
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No company data found' });
    }

    const content = results.map(r => r.content).join('\\n\\n');
    const analysis = await analyzeCompany(content);

    res.json({
      query: q,
      analysis,
      sources: results.map(r => ({ title: r.title, url: r.url }))
    });
  } catch (error) {
    next(error);
  }
};

exports.performCompetitorAnalysis = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const results = await searchWeb(`main competitors and market gaps for ${q}`);
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No competitor data found' });
    }

    const content = results.map(r => r.content).join('\\n\\n');
    const analysis = await analyzeCompetitors(content);

    res.json({
      query: q,
      analysis,
      sources: results.map(r => ({ title: r.title, url: r.url }))
    });
  } catch (error) {
    next(error);
  }
};
