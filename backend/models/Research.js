const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  query: { type: String, required: true },
  summary: { type: String, required: true },
  sources: [
    {
      title: { type: String },
      url: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  folder: { type: String },
});

module.exports = mongoose.model('Research', researchSchema);
