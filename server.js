const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const dealRoutes = require('./routes/dealRoutes');
const surveyRoute = require('./routes/sendEmail');
const surveyRoutes = require('./routes/survey');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

app.use(cors());

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
app.use('/api', surveyRoutes);

cron.schedule('27 10 * * *', async () => {
  try {
    console.log('Running scheduled fetch-and-save-deals job...');
    const response = await axios.get(`http://localhost:${PORT}/api/fetch-and-save-deals`);
    console.log('Scheduled API call successful:', response.data);
  } catch (error) {
    console.error('Scheduled API call failed:', error.message);
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
