import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, LogOut } from 'lucide-react';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Users className="h-8 w-8 text-white mr-2" />
              <span className="font-bold text-xl text-white">Visitor System</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/add-visitor" className="text-white bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-md font-medium">
              + New Visitor
            </Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
