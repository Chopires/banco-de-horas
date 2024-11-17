import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      return true;
    } else {
      alert('Usuário ou senha incorretos!');
      return false;
    }
  };

  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;