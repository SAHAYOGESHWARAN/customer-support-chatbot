import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chatbot/messages');
        setMessages(response.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchInitialMessages();
  }, []);

  const sendMessage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newMessages = [...messages, { sender: 'user', text: userMessage }];
      setMessages(newMessages);
      setUserMessage('');

      const response = await axios.post('http://localhost:5000/api/chatbot/message', { message: userMessage });
      const botMessage = response.data.message;
      const sentimentScore = response.data.sentiment.score;

      const sentimentLabel = sentimentScore > 0
        ? '😊 Positive'
        : sentimentScore < 0
          ? '😟 Negative'
          : '😐 Neutral';

      setMessages([
        ...newMessages,
        { sender: 'bot', text: botMessage, sentiment: sentimentLabel }
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            <p>{msg.text}</p>
            {msg.sender === 'bot' && msg.sentiment && (
              <small className="sentiment">{msg.sentiment}</small>
            )}
          </div>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}

export default ChatBox;