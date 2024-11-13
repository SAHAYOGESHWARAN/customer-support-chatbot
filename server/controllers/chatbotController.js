const faqs = require('../models/faq');
const Sentiment = require('sentiment');
const axios = require('axios');
const sentiment = new Sentiment();

const processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sentimentResult = sentiment.analyze(message);

    const faqResponse = faqs.find(faq =>
      message.toLowerCase().includes(faq.question.toLowerCase())
    );

    if (faqResponse) {
      return res.json({ message: faqResponse.answer, sentiment: sentimentResult });
    }

    const prompt = sentimentResult.score < 0
      ? `The user seems upset. Respond in a calming, understanding manner: ${message}`
      : message;

    const openAiConfig = {
      method: 'post',
      url: 'https://api.openai.com/v1/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 100,
      },
    };

    const response = await axios(openAiConfig);

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