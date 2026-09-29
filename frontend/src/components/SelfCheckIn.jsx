import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Clock, ArrowRight, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/visitors`;

const SelfCheckIn = ({ initialTab = 'register' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  // Registration state
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

  // Status lookup state
  const [searchMobile, setSearchMobile] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, mobile: val });
  };

  const handleSearchMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setSearchMobile(val);
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
      const data = res.data;
      if (data.isExisting) {
        setLastRegistered(data.visitor);
      } else {
        setLastRegistered(data);
      }
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

  const handleLookupStatus = async (e) => {
    e?.preventDefault();
    setStatusError('');
    setStatusResult(null);

    if (searchMobile.length !== 10) {
      setStatusError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setStatusLoading(true);
    try {
      const res = await axios.get(`${API_URL}/check-status/${searchMobile}`);
      setStatusResult(res.data);
    } catch (err) {
      setStatusError(err.response?.data?.error || 'No visitor record found for this mobile number.');
    } finally {
      setStatusLoading(false);
    }
  };

  const renderStatusBadgeLarge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white uppercase tracking-wider mb-2">
              Status: APPROVED
            </span>
            <h3 className="text-xl font-bold text-green-900">You are Clear for Entry! 🎉</h3>
            <p className="text-sm text-green-700 mt-1">Your visit has been approved by the host/admin.</p>
          </div>
        );
      case 'Cancelled':
        return (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircle size={32} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white uppercase tracking-wider mb-2">
              Status: CANCELLED
            </span>
            <h3 className="text-xl font-bold text-red-900">Visit Request Cancelled</h3>
            <p className="text-sm text-red-700 mt-1">Please contact reception or your host for details.</p>
          </div>
        );
      case 'Pending':
      default:
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock size={32} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white uppercase tracking-wider mb-2">
              Status: PENDING APPROVAL
            </span>
            <h3 className="text-xl font-bold text-amber-900">Awaiting Host Approval</h3>
            <p className="text-sm text-amber-700 mt-1">Your visit is logged and waiting for host/admin confirmation.</p>
          </div>
        );
    }
  };

  if (submitted && lastRegistered) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center my-8">
        {renderStatusBadgeLarge(lastRegistered.status || 'Pending')}

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
            <span className="text-gray-500 font-medium">Host / Meeting Person:</span>
            <span className="font-semibold text-indigo-600">{lastRegistered.personToMeet}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Purpose:</span>
            <span className="text-gray-800">{lastRegistered.purpose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Check-in Time:</span>
            <span className="text-gray-800">{new Date(lastRegistered.entryTime).toLocaleString()}</span>
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
      {/* Tab Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-2.5 rounded-md text-center transition flex items-center justify-center space-x-2 ${
            activeTab === 'register' ? 'bg-white text-indigo-600 font-bold shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserCheck size={18} />
          <span>Register Visit</span>
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2.5 rounded-md text-center transition flex items-center justify-center space-x-2 ${
            activeTab === 'status' ? 'bg-white text-indigo-600 font-bold shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search size={18} />
          <span>Check Visit Status</span>
        </button>
      </div>

      {/* TAB 1: REGISTER VISIT */}
      {activeTab === 'register' && (
        <>
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
        </>
      )}

      {/* TAB 2: CHECK VISIT STATUS */}
      {activeTab === 'status' && (
        <>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Search size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Check Your Visit Status</h2>
              <p className="text-sm text-gray-500">Enter your 10-digit mobile number to view live approval status</p>
            </div>
          </div>

          <form onSubmit={handleLookupStatus} className="flex gap-2 mb-6">
            <input
              type="text"
              value={searchMobile}
              onChange={handleSearchMobileChange}
              placeholder="Enter your 10-digit mobile number"
              className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={statusLoading}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Search size={18} />
              <span>{statusLoading ? 'Searching...' : 'Search'}</span>
            </button>
          </form>

          {statusError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center mb-4">
              {statusError}
            </div>
          )}

          {statusResult && (
            <div className="mt-4">
              {renderStatusBadgeLarge(statusResult.status || 'Pending')}

              <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2 border">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Visitor Name:</span>
                  <span className="font-semibold text-gray-800">{statusResult.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Mobile:</span>
                  <span className="text-gray-800">{statusResult.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Meeting Host:</span>
                  <span className="font-semibold text-indigo-600">{statusResult.personToMeet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Purpose:</span>
                  <span className="text-gray-800">{statusResult.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Registered Time:</span>
                  <span className="text-gray-800">{new Date(statusResult.entryTime).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleLookupStatus}
                className="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-1.5 text-sm font-medium"
              >
                <RefreshCw size={16} />
                <span>Refresh Status</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SelfCheckIn;
