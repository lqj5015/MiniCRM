const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().populate('customer').populate('opportunity').populate('products.product');
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one proposal
router.get('/:id', getQuote, (req, res) => {
  res.json(res.quote);
});

// Create one proposal
router.post('/', async (req, res) => {
  const quote = new Quote({
    customer: req.body.customer,
    opportunity: req.body.opportunity,
    products: req.body.products,
    totalAmount: req.body.totalAmount,
    proposalDate: req.body.proposalDate,
    status: req.body.status,
    notes: req.body.notes,
  });

  try {
    const newQuote = await quote.save();
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one proposal
router.patch('/:id', getQuote, async (req, res) => {
  if (req.body.customer != null) {
    res.quote.customer = req.body.customer;
  }
  if (req.body.opportunity != null) {
    res.quote.opportunity = req.body.opportunity;
  }
  if (req.body.products != null) {
    res.quote.products = req.body.products;
  }
  if (req.body.totalAmount != null) {
    res.quote.totalAmount = req.body.totalAmount;
  }
  if (req.body.proposalDate != null) {
    res.quote.proposalDate = req.body.proposalDate;
  }
  if (req.body.status != null) {
    res.quote.status = req.body.status;
  }
  if (req.body.notes != null) {
    res.quote.notes = req.body.notes;
  }

  try {
    const updatedQuote = await res.quote.save();
    res.json(updatedQuote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one proposal
router.delete('/:id', getQuote, async (req, res) => {
  try {
    await res.quote.deleteOne();
    res.json({ message: 'Deleted Quote' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getQuote(req, res, next) {
  let quote;
  try {
    quote = await Quote.findById(req.params.id).populate('customer').populate('opportunity').populate('products.product');
    if (quote == null) {
      return res.status(404).json({ message: 'Cannot find quote' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.quote = quote;
  next();
}

module.exports = router;
module.exports.getQuote = getQuote;