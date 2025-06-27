const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  comment: { type: String, maxlength: 500 },
  extraFeedback: { type: String, maxlength: 500},
  dealID: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Survey', SurveySchema);
