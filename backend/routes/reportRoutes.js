const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Opportunity = require('../models/Opportunity');
const Order = require('../models/Order');

// Get sales report data
router.get('/sales', async (req, res) => {
  try {
    // Example: Total customers
    const totalCustomers = await Customer.countDocuments();

    // Example: Total opportunities (won/lost)
    const wonOpportunities = await Opportunity.countDocuments({ stage: 'Closed Won' });
    const lostOpportunities = await Opportunity.countDocuments({ stage: 'Closed Lost' });

    // Example: Total orders and revenue
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalCustomers,
      wonOpportunities,
      lostOpportunities,
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;