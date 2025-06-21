const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// Get all opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate('customer');
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one opportunity
router.get('/:id', getOpportunity, (req, res) => {
  res.json(res.opportunity);
});

// Create one opportunity
router.post('/', async (req, res) => {
  const opportunity = new Opportunity({
    name: req.body.name,
    customer: req.body.customer,
    amount: req.body.amount,
    stage: req.body.stage,
    expectedCloseDate: req.body.expectedCloseDate
  });
  try {
    const newOpportunity = await opportunity.save();
    res.status(201).json(newOpportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one opportunity
router.patch('/:id', getOpportunity, async (req, res) => {
  if (req.body.name != null) {
    res.opportunity.name = req.body.name;
  }
  if (req.body.customer != null) {
    res.opportunity.customer = req.body.customer;
  }
  if (req.body.amount != null) {
    res.opportunity.amount = req.body.amount;
  }
  if (req.body.stage != null) {
    res.opportunity.stage = req.body.stage;
  }
  if (req.body.expectedCloseDate != null) {
    res.opportunity.expectedCloseDate = req.body.expectedCloseDate;
  }
  try {
    const updatedOpportunity = await res.opportunity.save();
    res.json(updatedOpportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one opportunity
router.delete('/:id', getOpportunity, async (req, res) => {
  try {
    await res.opportunity.deleteOne();
    res.json({ message: 'Deleted Opportunity' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getOpportunity(req, res, next) {
  let opportunity;
  try {
    opportunity = await Opportunity.findById(req.params.id).populate('customer');
    if (opportunity == null) {
      return res.status(404).json({ message: 'Cannot find opportunity' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.opportunity = opportunity;
  next();
}

module.exports = router;