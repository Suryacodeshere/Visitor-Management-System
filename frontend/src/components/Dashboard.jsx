import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import VisitorList from './VisitorList';

const API_URL = `${import.meta.env.VITE_API_URL}/visitors`;

const Dashboard = () => {
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    fetchTodayStats();
  }, []);

  const fetchTodayStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats/today`);
      setTodayCount(res.data.count);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Users size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 font-medium">Today's Visitors</p>
            <p className="text-2xl font-semibold text-gray-900">{todayCount}</p>
          </div>
        </div>
      </div>


      <VisitorList refreshStats={fetchTodayStats} />
    </div>
  );
};

export default Dashboard;
