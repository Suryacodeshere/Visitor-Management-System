import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VisitorForm from './components/VisitorForm';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {token && <Navbar setToken={setToken} />}
        <main className={token ? "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" : ""}>
          <Routes>
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/add-visitor" element={token ? <VisitorForm /> : <Navigate to="/login" />} />
            <Route path="/edit-visitor/:id" element={token ? <VisitorForm /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
