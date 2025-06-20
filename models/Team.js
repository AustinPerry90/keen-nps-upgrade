const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String }
});

module.exports = mongoose.model('TeamMember', TeamSchema);
