import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './components/ChatBox';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, [token]);

  const handleLogin = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
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
            <RegisterForm />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
