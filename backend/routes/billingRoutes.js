const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');

// Get all billings
router.get('/', async (req, res) => {
  try {
    const billings = await Billing.find().populate('customer').populate('order');
    res.json(billings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one billing
router.get('/:id', getBilling, (req, res) => {
  res.json(res.billing);
});

// Create one billing
router.post('/', async (req, res) => {
  const billing = new Billing({
    customer: req.body.customer,
    order: req.body.order,
    amount: req.body.amount,
    billingDate: req.body.billingDate,
    status: req.body.status
  });
  try {
    const newBilling = await billing.save();
    res.status(201).json(newBilling);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one billing
router.patch('/:id', getBilling, async (req, res) => {
  if (req.body.customer != null) {
    res.billing.customer = req.body.customer;
  }
  if (req.body.order != null) {
    res.billing.order = req.body.order;
  }
  if (req.body.amount != null) {
    res.billing.amount = req.body.amount;
  }
  if (req.body.billingDate != null) {
    res.billing.billingDate = req.body.billingDate;
  }
  if (req.body.status != null) {
    res.billing.status = req.body.status;
  }
  try {
    const updatedBilling = await res.billing.save();
    res.json(updatedBilling);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one billing
router.delete('/:id', getBilling, async (req, res) => {
  try {
    await res.billing.deleteOne();
    res.json({ message: 'Deleted Billing' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBilling(req, res, next) {
  let billing;
  try {
    billing = await Billing.findById(req.params.id).populate('customer').populate('order');
    if (billing == null) {
      return res.status(404).json({ message: 'Cannot find billing' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.billing = billing;
  next();
}

module.exports = router;