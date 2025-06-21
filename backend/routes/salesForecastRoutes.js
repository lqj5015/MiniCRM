const express = require('express');
const router = express.Router();
const SalesForecast = require('../models/SalesForecast');

// Get all sales forecasts
router.get('/', async (req, res) => {
  try {
    const salesForecasts = await SalesForecast.find();
    res.json(salesForecasts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one sales forecast
router.get('/:id', getSalesForecast, (req, res) => {
  res.json(res.salesForecast);
});

// Create one sales forecast
router.post('/', async (req, res) => {
  const salesForecast = new SalesForecast({
    year: req.body.year,
    month: req.body.month,
    expectedRevenue: req.body.expectedRevenue,
    actualRevenue: req.body.actualRevenue || 0,
    notes: req.body.notes,
  });

  try {
    const newSalesForecast = await salesForecast.save();
    res.status(201).json(newSalesForecast);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one sales forecast
router.patch('/:id', getSalesForecast, async (req, res) => {
  if (req.body.year != null) {
    res.salesForecast.year = req.body.year;
  }
  if (req.body.month != null) {
    res.salesForecast.month = req.body.month;
  }
  if (req.body.expectedRevenue != null) {
    res.salesForecast.expectedRevenue = req.body.expectedRevenue;
  }
  if (req.body.actualRevenue != null) {
    res.salesForecast.actualRevenue = req.body.actualRevenue;
  }
  if (req.body.notes != null) {
    res.salesForecast.notes = req.body.notes;
  }

  try {
    const updatedSalesForecast = await res.salesForecast.save();
    res.json(updatedSalesForecast);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one sales forecast
router.delete('/:id', getSalesForecast, async (req, res) => {
  try {
    await res.salesForecast.deleteOne();
    res.json({ message: 'Deleted Sales Forecast' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSalesForecast(req, res, next) {
  let salesForecast;
  try {
    salesForecast = await SalesForecast.findById(req.params.id);
    if (salesForecast == null) {
      return res.status(404).json({ message: 'Cannot find sales forecast' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.salesForecast = salesForecast;
  next();
}

module.exports = router;