import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TicketModal from '../components/events/TicketModal';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Printer,
  Sparkles,
  ArrowRight,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations/my-registrations');
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this registration? Your seat will be released immediately.')) {
      return;
    }

    setCancellingId(id);
    setMessage('');

    try {
      const res = await api.put(`/registrations/cancel/${id}`);
      if (res.data.success) {
        setMessage('Registration successfully cancelled.');
        fetchRegistrations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel registration.');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = registrations.filter((r) => {
    if (filter === 'Active') return r.status === 'Confirmed';
    if (filter === 'Cancelled') return r.status === 'Cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            <Ticket className="w-3.5 h-3.5 text-indigo-600" />
            <span>Digital Ticket Wallet</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-1">
            My Registered Events
          </h1>
          <p className="text-xs text-slate-500">
            View your verified campus passes, barcodes, and manage attendance status.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Browse More Events</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('All')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'All'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Passes ({registrations.length})
        </button>
        <button
          onClick={() => setFilter('Active')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'Active'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Confirmed Active ({registrations.filter((r) => r.status === 'Confirmed').length})
        </button>
        <button
          onClick={() => setFilter('Cancelled')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'Cancelled'
              ? 'bg-rose-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cancelled ({registrations.filter((r) => r.status === 'Cancelled').length})
        </button>
      </div>

      {message && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Registrations List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            No Registrations Found
          </h3>
          <p className="text-xs text-slate-500">
            {filter === 'All'
              ? "You haven't registered for any events yet."
              : `No ${filter.toLowerCase()} registrations found.`}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Explore Campus Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((reg) => {
            const isConfirmed = reg.status === 'Confirmed';
            return (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                      {reg.event?.category || 'Event'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 font-display mt-2 line-clamp-1">
                    {reg.event?.title || 'Campus Event'}
                  </h3>

                  {/* Date, Time, Venue */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{reg.event?.date || 'Upcoming'}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{reg.event?.venue || 'Campus Venue'}</span>
                    </div>
                  </div>

                  {/* Ticket Code Box */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Digital Pass ID</p>
                      <p className="font-mono font-bold text-indigo-700 text-sm">{reg.ticketCode}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">1 Seat Reserved</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isConfirmed ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(reg)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Digital Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCancelRegistration(reg._id)}
                        disabled={cancellingId === reg._id}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === reg._id ? 'Cancelling...' : 'Cancel Seat'}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Seat Released</span>
                  )}

                  <Link
                    to={`/events/${reg.event?._id}`}
                    className="text-xs text-slate-500 hover:text-indigo-600 transition"
                  >
                    Event Page →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          registration={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default MyRegistrationsPage;
