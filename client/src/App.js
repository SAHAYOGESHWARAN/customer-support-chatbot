import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './components/ChatBox';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, [token]);

  const handleLogin = async (userToken) => {
    try {
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
  };

  const handleRegister = async (userData) => {
    try {
      const response = await axios.post('/register', userData);
      handleLogin(response.data.token);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Customer Support Chatbot</h1>
      </header>
      <main>
        {isAuthenticated ? (
          <>
            <ChatBox />
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <LoginForm onLogin={handleLogin} />
            <RegisterForm onRegister={handleRegister} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}
      </main>
    </div>
  );
}

export default App;