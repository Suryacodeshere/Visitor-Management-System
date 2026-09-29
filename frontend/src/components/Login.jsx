import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

const Login = ({ setToken, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { username, password });
      const { token, username: userObj, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', userObj);
      localStorage.setItem('role', role);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setToken(token);
      if (setUser) setUser({ username: userObj, role });

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Portal Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-medium">
            Login to Admin Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
