const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one order
router.get('/:id', getOrder, (req, res) => {
  res.json(res.order);
});

// Create one order
router.post('/', async (req, res) => {
  const order = new Order({
    customer: req.body.customer,
    products: req.body.products,
    totalAmount: req.body.totalAmount,
    status: req.body.status
  });
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one order
router.patch('/:id', getOrder, async (req, res) => {
  if (req.body.customer != null) {
    res.order.customer = req.body.customer;
  }
  if (req.body.products != null) {
    res.order.products = req.body.products;
  }
  if (req.body.totalAmount != null) {
    res.order.totalAmount = req.body.totalAmount;
  }
  if (req.body.status != null) {
    res.order.status = req.body.status;
  }
  try {
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one order
router.delete('/:id', getOrder, async (req, res) => {
  try {
    await res.order.remove();
    res.json({ message: 'Deleted Order' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getOrder(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id).populate('customer').populate('products.product');
    if (order == null) {
      return res.status(404).json({ message: 'Cannot find order' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.order = order;
  next();
}

module.exports = router;