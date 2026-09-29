import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import SelfCheckIn from './components/SelfCheckIn';
import Dashboard from './components/Dashboard';
import VisitorForm from './components/VisitorForm';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || '',
    role: localStorage.getItem('role') || ''
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser({ username: '', role: '' });
  };

  const isAdmin = token && user?.role === 'admin';

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Visitor Self Check-In Route */}
            <Route path="/" element={<SelfCheckIn />} />

            {/* Admin Login */}
            <Route path="/login" element={!token ? <Login setToken={setToken} setUser={setUser} /> : <Navigate to="/admin" />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={isAdmin ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/add-visitor" element={isAdmin ? <VisitorForm /> : <Navigate to="/login" />} />
            <Route path="/edit-visitor/:id" element={isAdmin ? <VisitorForm /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
