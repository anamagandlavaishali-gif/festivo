import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EventCard from '../components/events/EventCard';
import TicketModal from '../components/events/TicketModal';
import {
  Calendar,
  Ticket,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  Layers,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [regRes, eventRes] = await Promise.all([
          api.get('/registrations/my-registrations'),
          api.get('/events?sort=newest'),
        ]);

        if (regRes.data.success) {
          setRegistrations(regRes.data.registrations);
        }

        if (eventRes.data.success) {
          setUpcomingEvents(eventRes.data.events.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const confirmedRegistrations = registrations.filter((r) => r.status === 'Confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-yellow-300" />
            <span>Student Life Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-sm text-indigo-100 max-w-xl">
            Department of {user?.department || 'Engineering'} • Student ID:{' '}
            <span className="font-mono font-bold text-white">{user?.collegeId || 'FST-STUDENT'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to="/events"
            className="px-5 py-3 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-slate-100 transition shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Discover Events</span>
          </Link>
          <Link
            to="/my-registrations"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>My Tickets ({confirmedRegistrations.length})</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Registrations
            </p>
            <p className="text-2xl font-black text-slate-900 font-display">
              {confirmedRegistrations.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Campus Events Active
            </p>
            <p className="text-2xl font-black text-slate-900 font-display">
              {upcomingEvents.length}+
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Digital Badges Earned
            </p>
            <p className="text-2xl font-black text-slate-900 font-display">
              {confirmedRegistrations.length > 0 ? `${confirmedRegistrations.length} Verified` : '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Section: My Registered Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600" />
            <span>My Upcoming Registrations</span>
          </h2>
          <Link
            to="/my-registrations"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {confirmedRegistrations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <p className="text-sm text-slate-600">
              You haven't registered for any events yet. Check out the campus calendar to reserve your spot!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmedRegistrations.slice(0, 3).map((reg) => (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {reg.event?.category || 'Event'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {reg.ticketCode}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2 font-display line-clamp-1">
                    {reg.event?.title || 'Campus Event'}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{reg.event?.date}</span>
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{reg.event?.venue}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedTicket(reg)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer flex items-center gap-1"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>
                  <Link
                    to={`/events/${reg.event?._id}`}
                    className="text-xs text-slate-500 hover:text-slate-800 transition"
                  >
                    Event Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Recently Added Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Recently Added Events</span>
          </h2>
          <Link
            to="/events"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>

      {/* Recommended Categories */}
      <div className="bg-slate-100/70 p-6 rounded-3xl space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Recommended Event Categories for You
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {['Technical', 'Hackathons', 'Workshops', 'Cultural', 'Sports', 'Fests'].map((c) => (
            <Link
              key={c}
              to={`/events?category=${c}`}
              className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-700 text-xs font-bold text-slate-700 border border-slate-200 transition shadow-2xs"
            >
              #{c} Events
            </Link>
          ))}
        </div>
      </div>

      {/* Digital Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          registration={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboardPage;
