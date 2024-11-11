import React, { useState } from 'react';
import axios from 'axios';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const sendMessage = async () => {
    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setUserMessage('');

    try {
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
      console.error('Error sending message:', error);
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
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatBox;
