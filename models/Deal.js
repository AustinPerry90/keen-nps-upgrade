const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
    deal_id: { type: Number, unique: true },
    stage_id: Number,
    person_name: String,
    person_email: String,
    organization_name: String,
    close_time: String,
    update_time: String
  });

module.exports = mongoose.model('Deal', DealSchema);