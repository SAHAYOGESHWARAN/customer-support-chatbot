const axios = require('axios');

const processMessage = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: userMessage,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botResponse = response.data.choices[0].text.trim();
    res.json({ message: botResponse });
  } catch (error) {
    console.error('Error with Chatbot API', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { processMessage };
