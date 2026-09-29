import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Clock, CheckCircle2, XCircle } from 'lucide-react';
import VisitorList from './VisitorList';

const API_URL = `${import.meta.env.VITE_API_URL}/visitors`;

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    count: 0,
    pending: 0,
    approved: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchTodayStats();
  }, []);

  const fetchTodayStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats/today`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Users size={24} />
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Today's Visitors</p>
            <p className="text-2xl font-bold text-gray-900">{stats.count || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-amber-100 text-amber-600">
            <Clock size={24} />
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Pending Approval</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Approved Visits</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <XCircle size={24} />
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Cancelled Visits</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled || 0}</p>
          </div>
        </div>
      </div>

      <VisitorList refreshStats={fetchTodayStats} user={user} />
    </div>
  );
};

export default Dashboard;
