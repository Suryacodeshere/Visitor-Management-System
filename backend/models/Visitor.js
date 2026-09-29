const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  companyName: { type: String },
  personToMeet: { type: String, required: true },
  purpose: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Cancelled'],
    default: 'Pending'
  },
  entryTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
