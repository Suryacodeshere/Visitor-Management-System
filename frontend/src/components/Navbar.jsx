import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, LogOut, Shield, UserCheck, Lock } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const isAdmin = user?.role === 'admin' && !!localStorage.getItem('token');

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Users className="h-8 w-8 text-white mr-2" />
              <span className="font-bold text-xl text-white">Visitor System</span>
            </Link>

            <Link
              to="/"
              className={`text-sm font-medium px-3 py-2 rounded-md flex items-center space-x-1.5 transition ${
                location.pathname === '/' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              <UserCheck size={16} />
              <span>Visitor Self Check-In</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium px-3 py-2 rounded-md flex items-center space-x-1.5 transition ${
                  location.pathname === '/admin' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                <Shield size={16} />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin ? (
              <>
                <div className="flex items-center space-x-2 text-white bg-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  <Shield size={14} className="text-amber-300" />
                  <span>{user.username}</span>
                  <span className="bg-amber-400 text-indigo-900 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                    Admin
                  </span>
                </div>

                <Link
                  to="/add-visitor"
                  className="text-white bg-indigo-500 hover:bg-indigo-400 px-3.5 py-2 rounded-md text-sm font-medium transition"
                >
                  + Add Record
                </Link>

                <button
                  onClick={onLogout}
                  title="Logout Admin"
                  className="text-white hover:text-red-200 p-2 rounded-md transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-indigo-600 bg-white hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center space-x-1.5 transition"
              >
                <Lock size={16} />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
