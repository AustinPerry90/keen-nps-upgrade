const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/Survey');

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

// GET /api/surveys/:dealID
router.get('/surveys/:dealID', async (req, res) => {
  const { dealID } = req.params;

  try {
    const surveys = await SurveyResponse.find({ dealID });

    if (!surveys.length) {
      return res.status(404).json({ message: 'No surveys found for this deal' });
    }

    res.status(200).json(surveys);
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/surveys - Get all surveys
router.get('/surveys', async (req, res) => {
  try {
    const surveys = await SurveyResponse.find();
    res.status(200).json(surveys);
  } catch (err) {
    console.error('Error fetching all surveys:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
