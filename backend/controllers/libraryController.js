const Research = require('../models/Research');

exports.saveResearch = async (req, res, next) => {
  try {
    const { query, summary, sources } = req.body;
    if(!query || !summary) return res.status(400).json({ error: 'Query and summary are required' });

    const savedResearch = new Research({ query, summary, sources });
    await savedResearch.save();
    res.status(201).json(savedResearch);
  } catch (error) {
    next(error);
  }
};

exports.getSavedResearch = async (req, res, next) => {
  try {
    const saved = await Research.find().sort({ createdAt: -1 });
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

exports.deleteResearch = async (req, res, next) => {
  try {
    await Research.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
