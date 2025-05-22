const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const dealRoutes = require('./routes/deals');
const surveyRoute = require('./routes/sendSurvey');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1);
});

app.use(express.json());
app.use('/api', dealRoutes);
app.use('/api', surveyRoute)

cron.schedule('25 10 * * *', async () => {
  try {
    console.log('Running scheduled fetch-and-save-deals job...');
    const response = await axios.get(`http://localhost:${PORT}/api/fetch-and-save-deals`);
    console.log('Scheduled API call successful:', response.data);
  } catch (error) {
    console.error('Scheduled API call failed:', error.message);
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
