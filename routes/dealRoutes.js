const express = require('express');
const router = express.Router();
const axios = require('axios');
const Deal = require('../models/Deal');

//Fetch deals from PipeDrive API and save them to MongoDB. 
router.get('/fetch-and-save-deals', async (req, res) => {
  try {
    console.log('Fetching deals from API...');
    const apiResponse = await axios.get(`${process.env.API_URL}?filter_id=82&start=0&limit=500&api_token=${process.env.API_TOKEN}`);

    console.log('API response received:', apiResponse.data);

    const dealsArray = apiResponse.data?.data;

    if (!Array.isArray(dealsArray)) {
      return res.status(400).json({ error: 'Expected an array of deals under data' });
    }

    const formattedDeals = dealsArray.map(deal => {
      const currentTime = new Date();

      let timeAsClient = null;
      let wonTime = null;

      if (deal.won_time) {
        const parsedDate = new Date(deal.won_time);
        const isValidDate = parsedDate instanceof Date && !isNaN(parsedDate);

        if (isValidDate) {
          wonTime = parsedDate;
          const diffTime = currentTime.getTime() - wonTime.getTime();
          timeAsClient = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }
      }

      let timeSinceSurvey = null;
      const stageID = deal.stage_id;

      if (typeof timeAsClient === 'number') {
        if (stageID === 9) {
          if (timeAsClient < 90) {
            timeSinceSurvey = timeAsClient;
          } else {
            timeSinceSurvey = (timeAsClient - 90) % 180;
          }
        } else if (stageID === 24) {
          if (timeAsClient < 183) {
            timeSinceSurvey = timeAsClient;
          } else {
            timeSinceSurvey = (timeAsClient - 183) % 365;
          }
        }
      }

      return {
        deal_id: deal.id,
        stage_id: deal.stage_id,
        person_name: deal.person_id?.name || '',
        person_email: deal.person_id?.email?.find(e => e.primary)?.value || '',
        organization_name: deal.org_id?.name || '',
        time_as_client: timeAsClient,
        time_since_survey: timeSinceSurvey
      };
    });


    console.log('Formatted deals:', formattedDeals);

    const bulkOps = formattedDeals.map(deal => ({
      updateOne: {
        filter: { deal_id: deal.deal_id },
        update: { $set: deal },
        upsert: true
      }
    }));
    
    const result = await Deal.bulkWrite(bulkOps, { ordered: false });
    

    console.log(`${result.nUpserted + result.nModified} deals processed`);
    res.json({ 
      message: `${result.nUpserted + result.nModified} deals processed`, 
      result 
    });
  } catch (error) {
    console.error('Error fetching or saving deals:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

//Get the client name from MongoDB using dealID
router.get('/client-info', async (req, res) => {
  try {
    const dealID = parseInt(req.query.dealID); // Make sure it's a number
    if (isNaN(dealID)) {
      return res.status(400).json({ error: 'Invalid dealID' });
    }

    const deal = await Deal.findOne({ deal_id: dealID });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    return res.json({
      name: deal.organization_name || 'Unknown Company'
    });
  } catch (error) {
    console.error('Error fetching deal info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
