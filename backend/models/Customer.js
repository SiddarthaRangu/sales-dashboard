const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  region: { type: String, required: true, enum: ['North', 'South', 'East', 'West', 'Central'] },
  type: { type: String, required: true, enum: ['Individual', 'Business', 'Government'] },
}, { timestamps: true });
module.exports = mongoose.model('Customer', customerSchema);