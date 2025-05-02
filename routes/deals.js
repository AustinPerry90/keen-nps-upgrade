const express = require('express');
const router = express.Router();
const axios = require('axios');
const Deal = require('../models/Deal');

router.get('/fetch-and-save-deals', async (req, res) => {
  try {
    console.log('Fetching deals from API...');
    const apiResponse = await axios.get(`${process.env.API_URL}?filter_id=82&start=0&limit=500&api_token=${process.env.API_TOKEN}`);

    console.log('API response received:', apiResponse.data);

    const dealsArray = apiResponse.data?.data;

    if (!Array.isArray(dealsArray)) {
      return res.status(400).json({ error: 'Expected an array of deals under data' });
    }

    const formattedDeals = dealsArray.map(deal => ({
      deal_id: deal.id,
      stage_id: deal.stage_id,
      person_name: deal.person_id?.name || '',
      person_email: deal.person_id?.email?.find(e => e.primary)?.value || '',
      organization_name: deal.org_id?.name || '',
      close_time: deal.close_time,
      update_time: deal.update_time
    }));

    console.log('Formatted deals:', formattedDeals);

    const savedDeals = await Deal.insertMany(formattedDeals, { ordered: false });

    console.log(`${savedDeals.length} deals saved`);
    res.json({ message: `${savedDeals.length} deals saved`, deals: savedDeals });
  } catch (error) {
    console.error('Error fetching or saving deals:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;
