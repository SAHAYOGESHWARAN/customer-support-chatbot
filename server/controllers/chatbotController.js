const faqs = require('../models/faq');
const Sentiment = require('sentiment');
const axios = require('axios');
const sentiment = new Sentiment();

const processMessage = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sentimentResult = sentiment.analyze(userMessage);

    // Check if the message matches an FAQ
    const faqResponse = faqs.find(faq =>
      userMessage.toLowerCase().includes(faq.question.toLowerCase())
    );

    if (faqResponse) {
      // Respond with FAQ answer if found
      return res.json({ message: faqResponse.answer, sentiment: sentimentResult });
    }

    const prompt = sentimentResult.score < 0
      ? `The user seems upset. Respond in a calming, understanding manner: ${userMessage}`
      : userMessage;

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response from OpenAI API');
    }

    const botResponse = response.data.choices[0].text.trim();
    res.json({ message: botResponse, sentiment: sentimentResult });
  } catch (error) {
    console.error('Error with Chatbot API', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { processMessage };