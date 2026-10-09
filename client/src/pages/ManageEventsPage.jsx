import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Users,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching admin events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Admin confirmation: Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.success) {
        setMessage(`Event "${title}" and associated registrations removed.`);
        fetchEvents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.organizerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'All' || ev.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Console</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Manage All Campus Events
          </h1>
          <p className="text-xs text-slate-500">
            Admin oversight: Edit, delete, monitor attendance, or create university-wide events.
          </p>
        </div>

        <Link
          to="/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-blue-700 hover:to-purple-700 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Event</span>
        </Link>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Controls & Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        {/* Search & Category Filter Row */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, venue, organizer..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Workshops">Workshops</option>
              <option value="Fests">Fests</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No events found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Event</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Organizer</th>
                  <th className="py-3 px-4">Registrations</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <Link
                            to={`/events/${ev._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                          >
                            {ev.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 truncate block max-w-xs">
                            {ev.venue}
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
                      <p className="text-[10px] text-slate-400">{ev.startTime}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {ev.organizerName || 'College Council'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900">
                        {ev.registeredCount || 0}
                      </span>
                      <span className="text-slate-400 text-[10px]"> / {ev.maxParticipants}</span>
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
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          title="Manage Participants"
                        >
                          <Users className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/events/edit/${ev._id}`}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(ev._id, ev.title)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEventsPage;
