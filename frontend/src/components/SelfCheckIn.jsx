import React, { useState } from 'react';
import axios from 'axios';
import { UserCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/visitors`;

const SelfCheckIn = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    companyName: '',
    personToMeet: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [lastRegistered, setLastRegistered] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, mobile: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_URL, formData);
      setLastRegistered(res.data);
      setSubmitted(true);
      setFormData({
        name: '',
        mobile: '',
        companyName: '',
        personToMeet: '',
        purpose: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit check-in request.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && lastRegistered) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center my-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check-in Successful!</h2>
        <p className="text-gray-600 mb-6">Welcome! Your visit has been registered in the system.</p>

        <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2 mb-6 border">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Visitor Name:</span>
            <span className="font-semibold text-gray-800">{lastRegistered.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Mobile:</span>
            <span className="text-gray-800">{lastRegistered.mobile}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Meeting Person:</span>
            <span className="font-semibold text-indigo-600">{lastRegistered.personToMeet}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Check-in Time:</span>
            <span className="text-gray-800">{new Date(lastRegistered.entryTime).toLocaleTimeString()}</span>
          </div>
        </div>

        <button
          onClick={() => setSubmitted(false)}
          className="w-full bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Check-in Another Visitor
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 my-4">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
          <UserCheck size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Visitor Self Check-In</h2>
          <p className="text-sm text-gray-500">Please fill in your details to register your arrival</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
            <input
              type="text"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleMobileChange}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.mobile.length}/10 digits</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company / Institution</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Acme Corp / College"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person to Meet *</label>
            <input
              type="text"
              name="personToMeet"
              required
              value={formData.personToMeet}
              onChange={handleChange}
              placeholder="Host / Employee name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit *</label>
          <textarea
            name="purpose"
            rows="3"
            required
            value={formData.purpose}
            onChange={handleChange}
            placeholder="e.g. Interview, Business Meeting, Delivery..."
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Submitting...' : 'Register My Visit'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelfCheckIn;
