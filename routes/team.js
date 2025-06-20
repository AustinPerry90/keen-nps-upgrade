const express = require('express');
const router = express.Router();
const TeamMember = require('../models/Team');

// POST /api/team
router.post('/team', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const newMember = new TeamMember({ name, email, phone });
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (err) {
    console.error('Failed to save team member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/team - Fetch all team members
router.get('/team', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ name: 1 });
    res.json(members);
  } catch (err) {
    console.error('Error fetching team members:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
