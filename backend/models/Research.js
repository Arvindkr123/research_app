const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
