const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  stage: {
    type: String,
    enum: ['Qualification', 'Needs Analysis', 'Value Proposition', 'Id. Decision Makers', 'Perception Analysis', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost'],
    default: 'Qualification'
  },
  expectedCloseDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);