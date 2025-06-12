const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  deal_id: { type: Number, unique: true },
  stage_id: Number,
  person_name: String,
  person_email: String,
  organization_name: String,
  time_as_client: Number,
  time_since_survey: Number,
  phone_number: String
});

module.exports = mongoose.model('Deal', dealSchema);