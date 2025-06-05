const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');

// POST /api/submit-survey
router.post('/submit-survey', async (req, res) => {
  try {
    const { clientName, rating, comment, dealID } = req.body;

    if (!clientName || !rating || !dealID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newSurvey = new SurveyResponse({ clientName, rating, comment, dealID });
    await newSurvey.save();

    res.status(201).json({ message: 'Survey saved' });
  } catch (err) {
    console.error('Error saving survey:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
