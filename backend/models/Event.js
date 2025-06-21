const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Call', 'Email', 'Meeting', 'Task']
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedToModel'
  },
  relatedToModel: {
    type: String,
    required: true,
    enum: ['Customer', 'Lead', 'Opportunity', 'Quote', 'Order']
  },
  reminders: [{
    method: { type: String, enum: ['email', 'message'], required: true },
    timeBefore: { type: Number, required: true } // minutes before event
  }],
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);