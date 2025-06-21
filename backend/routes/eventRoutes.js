const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('relatedTo');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one event
router.get('/:id', getEvent, (req, res) => {
  res.json(res.event);
});

// Create one event
router.post('/', async (req, res) => {
  const event = new Event({
    type: req.body.type,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    relatedTo: req.body.relatedTo,
    relatedToModel: req.body.relatedToModel,
    reminders: req.body.reminders,
    completed: req.body.completed
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one event
router.patch('/:id', getEvent, async (req, res) => {
  if (req.body.type != null) {
    res.event.type = req.body.type;
  }
  if (req.body.description != null) {
    res.event.description = req.body.description;
  }
  if (req.body.date != null) {
    res.event.date = req.body.date;
  }
  if (req.body.time != null) {
    res.event.time = req.body.time;
  }
  if (req.body.relatedTo != null) {
    res.event.relatedTo = req.body.relatedTo;
  }
  if (req.body.relatedToModel != null) {
    res.event.relatedToModel = req.body.relatedToModel;
  }
  if (req.body.reminders != null) {
    res.event.reminders = req.body.reminders;
  }
  if (req.body.completed != null) {
    res.event.completed = req.body.completed;
  }
  try {
    const updatedEvent = await res.event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one event
router.delete('/:id', getEvent, async (req, res) => {
  try {
    await res.event.deleteOne();
    res.json({ message: 'Deleted Event' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getEvent(req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id).populate('relatedTo');
    if (event == null) {
      return res.status(404).json({ message: 'Cannot find event' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.event = event;
  next();
}

module.exports = router;