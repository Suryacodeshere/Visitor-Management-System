import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/visitors`;

const VisitorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    companyName: '',
    personToMeet: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchVisitor();
    }
  }, [id]);

  const fetchVisitor = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      const visitor = res.data;
      setFormData({
        name: visitor.name,
        mobile: visitor.mobile,
        companyName: visitor.companyName || '',
        personToMeet: visitor.personToMeet,
        purpose: visitor.purpose || ''
      });
    } catch (err) {
      setError('Failed to load visitor details.');
    }
  };

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
      if (isEdit) {
        await axios.put(`${API_URL}/${id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? 'Edit Visitor' : 'New Visitor Registration'}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
            <input
              type="text" name="mobile" required
              value={formData.mobile} onChange={handleMobileChange}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.mobile.length}/10 digits</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company / College Name</label>
            <input
              type="text" name="companyName"
              value={formData.companyName} onChange={handleChange}
              placeholder="Enter company or college"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person to Meet *</label>
            <input
              type="text" name="personToMeet" required
              value={formData.personToMeet} onChange={handleChange}
              placeholder="Who are they visiting?"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit *</label>
          <textarea
            name="purpose" rows="3" required
            value={formData.purpose} onChange={handleChange}
            placeholder="What is the reason for this visit?"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Visitor' : 'Register Visitor')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisitorForm;
