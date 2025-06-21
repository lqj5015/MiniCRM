const mongoose = require('mongoose');

const salesForecastSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  expectedRevenue: {
    type: Number,
    required: true,
  },
  actualRevenue: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('SalesForecast', salesForecastSchema);