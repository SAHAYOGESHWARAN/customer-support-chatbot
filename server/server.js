const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Import Routes
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));