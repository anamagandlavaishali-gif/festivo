import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Calendar,
  Users,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

const OrganizerDashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchOrganizerEvents = async () => {
    try {
      const res = await api.get('/events/my-events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to load organizer events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All associated registrations will also be removed.`)) {
      return;
    }

    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.success) {
        setMessage(`Event "${title}" was successfully deleted.`);
        fetchOrganizerEvents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (e.maxParticipants || 0), 0);
  const avgFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Event Organizer Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display">
            Organizer Console — {user?.name}
          </h1>
          <p className="text-xs text-indigo-200">
            {user?.department || 'College Tech Council'} • Manage events, track attendee rosters, and view real-time registrations.
          </p>
        </div>

        <Link
          to="/events/create"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-white text-purple-900 hover:bg-slate-100 shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-purple-700" />
          <span>Publish New Event</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            My Events Hosted
          </p>
          <p className="text-3xl font-black text-slate-900 font-display">{events.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Registrations
          </p>
          <p className="text-3xl font-black text-indigo-600 font-display">{totalRegistrations}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Seat Capacity
          </p>
          <p className="text-3xl font-black text-slate-900 font-display">{totalCapacity}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Fill Rate
          </p>
          <p className="text-3xl font-black text-purple-600 font-display">{avgFillRate}%</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Events List / Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Managed Events Roster
            </h2>
            <p className="text-xs text-slate-500">
              Live registrations, capacity counters, participant management, and editing.
            </p>
          </div>
          <Link
            to="/events/create"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">You haven't created any events yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start publishing technical hackathons, cultural events, or workshops for your college clubs.
            </p>
            <Link
              to="/events/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Event Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Venue</th>
                  <th className="py-3 px-4">Registrations / Cap</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => {
                  const percent = Math.min(100, Math.round(((ev.registeredCount || 0) / ev.maxParticipants) * 100));
                  return (
                    <tr key={ev._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <Link
                              to={`/events/${ev._id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                            >
                              {ev.title}
                            </Link>
                            <span className="text-[10px] text-slate-400">
                              Deadline: {ev.registrationDeadline}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {ev.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <p className="font-semibold">{ev.date}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {ev.venue}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1 w-28">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>{ev.registeredCount || 0}</span>
                            <span className="text-slate-400">/ {ev.maxParticipants}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/events/${ev._id}/participants`}
                            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                            title="Manage Participants Roster"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/events/edit/${ev._id}`}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ev._id, ev.title)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
