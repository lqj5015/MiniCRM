const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Opportunity = require('../models/Opportunity');
const Customer = require('../models/Customer');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create lead
router.post('/', async (req, res) => {
  const lead = new Lead({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    status: req.body.status
  });

  try {
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (req.body.name != null) lead.name = req.body.name;
    if (req.body.email != null) lead.email = req.body.email;
    if (req.body.phone != null) lead.phone = req.body.phone;
    if (req.body.company != null) lead.company = req.body.company;
    
    const oldStatus = lead.status;
    if (req.body.status != null) lead.status = req.body.status;

    const updatedLead = await lead.save();

    // Automation: If lead status changes to 'Qualified', create an opportunity
    if (oldStatus !== 'Qualified' && updatedLead.status === 'Qualified') {
      try {
        let customer = await Customer.findOne({ email: updatedLead.email });

        if (!customer) {
          customer = new Customer({
            name: updatedLead.name,
            email: updatedLead.email,
            phone: updatedLead.phone,
            company: updatedLead.company
          });
          await customer.save();
          console.log(`New customer created: ${customer.name}`);
        }

        const newOpportunity = new Opportunity({
          name: `Opportunity from Lead: ${updatedLead.name}`,
          customer: customer ? customer._id : null, // Link to the customer if found or created
          amount: 0, // Placeholder, can be updated later
          stage: 'Qualification',
          expectedCloseDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // One month from now
          lead: updatedLead._id // Link to the lead
        });
        await newOpportunity.save();
        console.log(`Opportunity created for qualified lead: ${updatedLead.name}`);
      } catch (opportunityErr) {
        console.error('Error creating opportunity from lead:', opportunityErr);
      }
    }

    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    await lead.deleteOne();
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;