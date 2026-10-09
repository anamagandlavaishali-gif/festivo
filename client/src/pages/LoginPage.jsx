import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, UserCheck, Shield } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        // Redirect to intended route or role dashboard
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/dashboard/admin', { replace: true });
        } else if (res.user.role === 'organizer') {
          navigate('/dashboard/organizer', { replace: true });
        } else {
          navigate('/dashboard/student', { replace: true });
        }
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login filler
  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        {/* Header with Festivo Logo */}
        <div className="text-center space-y-3">
          <Logo size="lg" />
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500">
            Access your registrations, event passes, or organizer management console.
          </p>
        </div>

        {/* 1-Click Demo Access Box for Hackathon & Faculty Evaluators */}
        <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick Demo Logins (Click to Autofill):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student@festivo.edu', 'Student@123')}
              className="px-2 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg border border-indigo-200 shadow-2xs transition cursor-pointer"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('organizer@festivo.edu', 'Organizer@123')}
              className="px-2 py-1.5 bg-white hover:bg-purple-100 text-purple-700 font-bold text-[11px] rounded-lg border border-purple-200 shadow-2xs transition cursor-pointer"
            >
              Organizer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@festivo.edu', 'Admin@123')}
              className="px-2 py-1.5 bg-white hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-300 shadow-2xs transition cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. student@festivo.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
