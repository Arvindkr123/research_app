const { chatWithContext } = require('../services/aiService');
const errorHandler = require('../middleware/errorHandler');

exports.handleChat = async (req, res, next) => {
  try {
    const { context, message } = req.body;

    if (!context || !message) {
      return res.status(400).json({ error: 'Both context and message are required' });
    }

    const response = await chatWithContext(context, message);
    res.json({ response });
  } catch (error) {
    next(error);
  }
};
