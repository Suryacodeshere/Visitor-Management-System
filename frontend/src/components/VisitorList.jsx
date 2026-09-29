import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Search, Download, Edit2, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/visitors`;

const VisitorList = ({ refreshStats, user }) => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const isAdmin = (user?.role || localStorage.getItem('role')) === 'admin';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchVisitors();
  }, [debouncedSearch, statusFilter]);

  const fetchVisitors = async () => {
    try {
      let url = `${API_URL}?search=${debouncedSearch}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const res = await axios.get(url);
      setVisitors(res.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus });
      fetchVisitors();
      if (refreshStats) refreshStats();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('Permission denied: Only Admins can delete visitor records.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchVisitors();
        if (refreshStats) refreshStats();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting visitor');
      }
    }
  };

  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'Company/College', key: 'companyName' },
    { label: 'Person to Meet', key: 'personToMeet' },
    { label: 'Purpose', key: 'purpose' },
    { label: 'Status', key: 'status' },
    { label: 'Entry Time', key: 'entryTime' }
  ];

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 size={12} className="mr-1" />
            Approved
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-800">Visitor Log</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1 rounded-md transition ${!statusFilter ? 'bg-white shadow text-gray-800 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1 rounded-md transition ${statusFilter === 'Pending' ? 'bg-white shadow text-amber-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('Approved')}
              className={`px-3 py-1 rounded-md transition ${statusFilter === 'Approved' ? 'bg-white shadow text-green-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('Cancelled')}
              className={`px-3 py-1 rounded-md transition ${statusFilter === 'Cancelled' ? 'bg-white shadow text-red-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="flex w-full md:w-auto space-x-2">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name or mobile..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <CSVLink
            data={visitors}
            headers={csvHeaders}
            filename={`visitors_${new Date().toLocaleDateString()}.csv`}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm whitespace-nowrap font-medium"
          >
            <Download size={16} className="mr-1.5" />
            Export
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Meet / Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Time</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visitors.map((v) => (
              <tr key={v._id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{v.name}</div>
                  <div className="text-sm text-gray-500">{v.mobile}</div>
                  {v.companyName && <div className="text-xs text-gray-400">{v.companyName}</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-800">{v.personToMeet}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{v.purpose}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge(v.status || 'Pending')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(v.entryTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Approve / Cancel Quick Action Buttons */}
                    {v.status !== 'Approved' && (
                      <button
                        onClick={() => handleStatusUpdate(v._id, 'Approved')}
                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition"
                        title="Approve Visit"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}

                    {v.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleStatusUpdate(v._id, 'Cancelled')}
                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md transition"
                        title="Cancel Visit"
                      >
                        <XCircle size={18} />
                      </button>
                    )}

                    <Link to={`/edit-visitor/${v._id}`} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition" title="Edit Visitor">
                      <Edit2 size={18} />
                    </Link>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Delete Visitor (Admin Only)"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No visitors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorList;
