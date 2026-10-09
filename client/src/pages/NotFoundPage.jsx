import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { Home, Compass, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        <Logo size="lg" />

        <div className="space-y-2">
          <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-display">
            404
          </p>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            Event Or Page Not Found
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The campus celebration or page you are looking for has moved, ended, or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/events"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
