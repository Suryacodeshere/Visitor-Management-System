import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Search, Download, Edit2, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/visitors';

const VisitorList = ({ refreshStats }) => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Bug fix: debounce search input — wait 400ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchVisitors();
  }, [debouncedSearch]);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${API_URL}?search=${debouncedSearch}`);
      setVisitors(res.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchVisitors();
        if (refreshStats) refreshStats();
      } catch (error) {
        console.error('Error deleting visitor:', error);
      }
    }
  };

  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'Company/College', key: 'companyName' },
    { label: 'Person to Meet', key: 'personToMeet' },
    { label: 'Purpose', key: 'purpose' },
    { label: 'Entry Time', key: 'entryTime' }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Visitor Log</h2>

        <div className="flex w-full md:w-auto space-x-2">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name or mobile..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <CSVLink
            data={visitors}
            headers={csvHeaders}
            filename={`visitors_${new Date().toLocaleDateString()}.csv`}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 whitespace-nowrap"
          >
            <Download size={18} className="mr-2" />
            Export
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Meet</th>
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
                  <div className="text-xs text-gray-400">{v.companyName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{v.personToMeet}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{v.purpose}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(v.entryTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/edit-visitor/${v._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                    <Edit2 size={18} />
                  </Link>
                  <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:text-red-900 inline-block">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No visitors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorList;
