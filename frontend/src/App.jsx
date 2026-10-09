import React, { useState } from 'react';
import LoginPage from './LoginPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import LandingPage from './components/LandingPage.jsx';
import './style.css';

export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    return token && storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app-shell">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : showLogin ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <LandingPage onGoToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}
