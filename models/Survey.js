const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  clientName: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 10 },
  comment: { type: String, maxlength: 500 },
  extraFeedback: { type: String, maxlength: 500 },
  dealID: { type: String, required: true },
  submittedAt: { type: Date },
  submitted: { type: Boolean, default: false },
  accessToken: { type: String, required: true, unique: true },
  expiresAt: { type: Date } // Optional
});

module.exports = mongoose.model('Survey', SurveySchema);
