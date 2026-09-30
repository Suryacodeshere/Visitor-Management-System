const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  mobile: { type: String, required: true, trim: true, index: true },
  companyName: { type: String, trim: true },
  personToMeet: { type: String, required: true, trim: true },
  purpose: { type: String, trim: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  entryTime: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Compound indexes for optimized query & sorting performance
visitorSchema.index({ entryTime: -1, status: 1 });
visitorSchema.index({ mobile: 1, entryTime: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);
