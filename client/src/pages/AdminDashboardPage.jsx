import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ShieldCheck,
  Users,
  Calendar,
  Ticket,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentRegistrations = data?.recentRegistrations || [];
  const recentEvents = data?.recentEvents || [];
  const recentUsers = data?.recentUsers || [];
  const categoryBreakdown = stats.categoryBreakdown || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Campus Administrator Authority</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
            System Administration Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Live metrics aggregated directly from the Festivo database. Manage users, role permissions, and full event lifecycles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/events"
            className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition shadow-xs flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Manage All Events</span>
          </Link>
          <Link
            to="/admin/users"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Database-Backed Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-display">
            {stats.totalUsers || 0}
          </p>
          <p className="text-[11px] text-slate-500">Students, Organizers & Staff</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-600 font-display">
            {stats.totalEvents || 0}
          </p>
          <p className="text-[11px] text-slate-500">
            {stats.upcomingEvents || 0} Upcoming • {stats.completedEvents || 0} Completed
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Registrations
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-600 font-display">
            {stats.totalRegistrations || 0}
          </p>
          <p className="text-[11px] text-slate-500">Confirmed Digital Tickets Issued</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Upcoming
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 font-display">
            {stats.upcomingEvents || 0}
          </p>
          <p className="text-[11px] text-slate-500">Live Campus Registrations Open</p>
        </div>
      </div>

      {/* Category Breakdown & Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>Events Category Distribution</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(categoryBreakdown).map(([category, count]) => (
            <div key={category} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-2xl font-black text-indigo-700 font-display">{count}</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Column: Recent Registrations & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Ticket className="w-4 h-4 text-indigo-600" />
              <span>Recent Registrations Activity</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {recentRegistrations.length === 0 ? (
              <p className="py-4 text-slate-400 text-center">No registrations yet.</p>
            ) : (
              recentRegistrations.map((r) => (
                <div key={r._id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{r.participantName}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">
                      {r.event?.title || 'Campus Event'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-indigo-700 block">
                      {r.ticketCode}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(r.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Recent Users Enrolled</span>
            </h3>
            <Link
              to="/admin/users"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View All Users →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {recentUsers.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{u.name}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-slate-900 text-white'
                        : u.role === 'organizer'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
