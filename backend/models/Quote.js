const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  proposalDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
    default: 'Draft',
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('Quote', quoteSchema);