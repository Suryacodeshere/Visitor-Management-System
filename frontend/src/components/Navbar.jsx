import React from 'react';
import { Link } from 'react-router-dom';
import { Users, LogOut, Shield, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const isAdmin = user?.role === 'admin';

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
            {user?.username && (
              <div className="flex items-center space-x-2 text-white bg-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {isAdmin ? <Shield size={14} className="text-amber-300" /> : <User size={14} />}
                <span>{user.username}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${isAdmin ? 'bg-amber-400 text-indigo-900' : 'bg-indigo-500 text-white'}`}>
                  {user.role}
                </span>
              </div>
            )}

            <Link to="/add-visitor" className="text-white bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-md text-sm font-medium">
              + New Visitor
            </Link>
            
            <button 
              onClick={onLogout} 
              title="Logout"
              className="text-white hover:text-red-200 p-2 rounded-md transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
