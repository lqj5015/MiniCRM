const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('customer').populate('order');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one invoice
router.get('/:id', getInvoice, (req, res) => {
  res.json(res.invoice);
});

// Create one invoice
router.post('/', async (req, res) => {
  const invoice = new Invoice({
    customer: req.body.customer,
    order: req.body.order,
    amount: req.body.amount,
    invoiceDate: req.body.invoiceDate,
    status: req.body.status
  });
  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one invoice
router.patch('/:id', getInvoice, async (req, res) => {
  if (req.body.customer != null) {
    res.invoice.customer = req.body.customer;
  }
  if (req.body.order != null) {
    res.invoice.order = req.body.order;
  }
  if (req.body.amount != null) {
    res.invoice.amount = req.body.amount;
  }
  if (req.body.invoiceDate != null) {
    res.invoice.invoiceDate = req.body.invoiceDate;
  }
  if (req.body.status != null) {
    res.invoice.status = req.body.status;
  }
  try {
    const updatedInvoice = await res.invoice.save();
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one invoice
router.delete('/:id', getInvoice, async (req, res) => {
  try {
    await res.invoice.deleteOne();
    res.json({ message: 'Deleted Invoice' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getInvoice(req, res, next) {
  let invoice;
  try {
    invoice = await Invoice.findById(req.params.id).populate('customer').populate('order');
    if (invoice == null) {
      return res.status(404).json({ message: 'Cannot find invoice' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.invoice = invoice;
  next();
}

module.exports = router;