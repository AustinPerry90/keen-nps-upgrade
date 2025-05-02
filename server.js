const express = require('express');
const mongoose = require('mongoose');
const dealRoutes = require('./routes/deals');
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
