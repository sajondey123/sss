import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, UserPlus, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-400" />
              <span className="font-bold text-lg hidden sm:block">গণরাজ একতা সংঘ</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center space-x-1 hover:text-orange-400 transition-colors">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link to="/apply" className="flex items-center space-x-1 hover:text-orange-400 transition-colors">
              <UserPlus className="h-5 w-5" />
              <span className="text-sm font-medium">Apply</span>
            </Link>
            <Link to="/admin" className="flex items-center space-x-1 hover:text-orange-400 transition-colors">
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-sm font-medium">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
